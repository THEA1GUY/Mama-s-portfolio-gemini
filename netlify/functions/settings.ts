import { createClient } from '@supabase/supabase-js';
import type { Context } from '@netlify/functions';
import { Database } from '../../lib/database.types'; // Adjust path as needed
import { z } from "zod";
import Busboy from 'busboy';

// Initialize Supabase client for Netlify Function
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Use service role key for admin access

if (!supabaseUrl || !supabaseServiceRoleKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabaseAdmin = createClient<Database>(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    persistSession: false,
  },
});

// Define Zod schema for content setting data validation
const contentSettingSchema = z.object({
  key: z.string().min(1, "Key is required"),
  value_text: z.string().optional().nullable(),
  value_image_url: z.string().optional().nullable(),
  value_image_width: z.number().optional().nullable(),
  value_image_height: z.number().optional().nullable(),
});

// Helper function to upload image to Supabase Storage and get dimensions
async function uploadImage(
  file: { filename: string; encoding: string; mimetype: string; content: Buffer },
  key: string,
  width: number | null,
  height: number | null,
): Promise<{ url: string; width: number | null; height: number | null }> {
  const fileExt = file.filename.split(".").pop();
  const fileName = `${key}-${Date.now()}.${fileExt}`; // Unique filename based on key
  const filePath = `content_settings/${fileName}`; // Store in a dedicated folder

  const { data, error } = await supabaseAdmin.storage.from("content-images").upload(filePath, file.content, {
    cacheControl: "3600",
    upsert: false,
    contentType: file.mimetype,
  });

  if (error) {
    console.error("Error uploading image:", error);
    throw new Error(`Image upload failed: ${error.message}`);
  }

  const { data: publicUrlData } = supabaseAdmin.storage.from("content-images").getPublicUrl(filePath);
  return { url: publicUrlData.publicUrl, width, height };
}

// Helper function to delete image from Supabase Storage
async function deleteImage(imageUrl: string) {
  const pathSegments = imageUrl.split("/");
  const fileName = pathSegments[pathSegments.length - 1];
  const filePath = `content_settings/${fileName}`; // Assuming all images are in 'content_settings/' folder

  const { error } = await supabaseAdmin.storage.from("content-images").remove([filePath]);

  if (error) {
    console.error("Error deleting image:", error);
    // Don't throw error here, as it might be a stale URL or file already gone
  }
}

export async function handler(event: Request, context: Context) {
  if (event.method === 'GET') {
    // Handle getContentSettings
    const { data, error } = await supabaseAdmin.from('content_settings').select('*');

    if (error) {
      console.error('Error fetching content settings:', error);
      return new Response(JSON.stringify({ success: false, message: error.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ success: true, data: data }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } else if (event.method === 'POST') {
    return new Promise((resolve, reject) => {
      const busboy = Busboy({ headers: event.headers });
      const fields: { [key: string]: any } = {};
      let fileContent: Buffer | null = null;
      let fileInfo: { filename: string; encoding: string; mimetype: string } | null = null;

      busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
        fileInfo = { filename, encoding, mimetype };
        file.on('data', (data) => {
          if (fileContent) {
            fileContent = Buffer.concat([fileContent, data]);
          } else {
            fileContent = data;
          }
        });
        file.on('end', () => {
          // File processing done, will be handled in on('finish')
        });
      });

      busboy.on('field', (fieldname, val) => {
        fields[fieldname] = val;
      });

      busboy.on('finish', async () => {
        try {
          const key = fields.key as string;
          const value_text = fields.value_text as string | null;
          const currentImageUrl = fields.currentImageUrl as string | null;
          const imageWidthFromForm = fields.imageWidth ? Number(fields.imageWidth) : null;
          const imageHeightFromForm = fields.imageHeight ? Number(fields.imageHeight) : null;

          const parsed = contentSettingSchema.safeParse({
            key,
            value_text,
            value_image_url: currentImageUrl,
            value_image_width: imageWidthFromForm,
            value_image_height: imageHeightFromForm,
          });

          if (!parsed.success) {
            resolve(new Response(JSON.stringify({ success: false, message: parsed.error.errors[0].message }), {
              status: 400,
              headers: { 'Content-Type': 'application/json' },
            }));
            return;
          }

          let newImageUrl: string | null = currentImageUrl;
          let newImageWidth: number | null = imageWidthFromForm;
          let newImageHeight: number | null = imageHeightFromForm;

          if (fileContent && fileInfo) {
            // If a new image is uploaded, delete the old one if it exists
            if (currentImageUrl) {
              await deleteImage(currentImageUrl);
            }
            try {
              const uploadResult = await uploadImage({ ...fileInfo, content: fileContent }, key, imageWidthFromForm, imageHeightFromForm);
              newImageUrl = uploadResult.url;
              newImageWidth = uploadResult.width;
              newImageHeight = uploadResult.height;
            } catch (uploadError: any) {
              resolve(new Response(JSON.stringify({ success: false, message: uploadError.message }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
              }));
              return;
            }
          } else if (!currentImageUrl && !fileContent) {
            // If no new image and current image is removed
            if (currentImageUrl) {
              await deleteImage(currentImageUrl);
            }
            newImageUrl = null;
            newImageWidth = null;
            newImageHeight = null;
          }

          const updateData: {
            key: string;
            value_text?: string | null;
            value_image_url?: string | null;
            value_image_width?: number | null;
            value_image_height?: number | null;
          } = {
            key: key,
            value_text: parsed.data.value_text,
            value_image_url: newImageUrl,
            value_image_width: newImageWidth,
            value_image_height: newImageHeight,
          };

          const { error } = await supabaseAdmin
            .from("content_settings")
            .upsert(updateData, { onConflict: "key" }); // Upsert based on key

          if (error) {
            console.error("Error updating content setting:", error);
            resolve(new Response(JSON.stringify({ success: false, message: error.message }), {
              status: 500,
              headers: { 'Content-Type': 'application/json' },
            }));
            return;
          }

          resolve(new Response(JSON.stringify({ success: true, message: "Content setting updated successfully" }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          }));
        } catch (error: any) {
          console.error("Error in settings handler:", error);
          resolve(new Response(JSON.stringify({ success: false, message: error.message || "An unexpected error occurred." }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
          }));
        }
      });

      busboy.on('error', (err) => {
        console.error('Busboy error:', err);
        reject(new Response(JSON.stringify({ success: false, message: `Form parsing error: ${err.message}` }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }));
      });

      if (event.body) {
        busboy.end(Buffer.from(event.body, event.isBase64Encoded ? 'base64' : 'utf8'));
      } else {
        busboy.end();
      }
    });
  }

  return new Response('Method Not Allowed', { status: 405 });
}