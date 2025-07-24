import { createClient } from '@supabase/supabase-js';
import type { Context } from '@netlify/functions';
import { z } from "zod";
import Busboy from 'busboy';
import { Database } from '../../lib/database.types'; // Adjust path as needed

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

// Define Zod schema for work data validation
const workSchema = z.object({
  title: z.string().min(1, "Title is required"),
  category: z.string().min(1, "Category is required"),
  description: z.string().optional().nullable(),
  type: z.enum(["image", "video"]).default("image"),
  image_url: z.string().optional().nullable(),
  video_url: z.string().url("Must be a valid URL").optional().nullable(),
  image_width: z.number().optional().nullable(),
  image_height: z.number().optional().nullable(),
});

// Helper function to delete image from Supabase Storage
async function deleteImage(imageUrl: string) {
  const pathSegments = imageUrl.split("/");
  const fileName = pathSegments[pathSegments.length - 1];
  const filePath = `works/${fileName}`;

  const { error } = await supabaseAdmin.storage.from("works-images").remove([filePath]);

  if (error) {
    console.error("Error deleting image:", error);
  }
}

// Helper function to upload image to Supabase Storage
async function uploadImage(
  file: { filename: string; encoding: string; mimetype: string; content: Buffer },
  key: string,
): Promise<{ url: string }> {
  const fileExt = file.filename.split(".").pop();
  const fileName = `${key}-${Date.now()}.${fileExt}`;
  const filePath = `works/${fileName}`;

  const { data, error } = await supabaseAdmin.storage.from("works-images").upload(filePath, file.content, {
    cacheControl: "3600",
    upsert: false,
    contentType: file.mimetype,
  });

  if (error) {
    console.error("Error uploading image:", error);
    throw new Error(`Image upload failed: ${error.message}`);
  }

  const { data: publicUrlData } = supabaseAdmin.storage.from("works-images").getPublicUrl(filePath);
  return { url: publicUrlData.publicUrl };
}

export async function handler(event: Request, context: Context) {
  if (event.method === 'GET') {
    // Handle getWorks
    const url = new URL(event.url);
    const isFavorite = url.searchParams.get('isFavorite');

    let query = supabaseAdmin
      .from("works")
      .select("*, image_width, image_height, is_favorite, type, video_url, document_url, thumbnail_url");

    if (isFavorite !== undefined && isFavorite !== null) {
      query = query.eq("is_favorite", isFavorite === 'true');
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching works:', error);
      return new Response(JSON.stringify({ success: false, message: error.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    return new Response(JSON.stringify({ success: true, message: "Works fetched successfully", data }), {
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
          const type = fields.type; // Get the action type from the fields

          switch (type) {
            case 'addWork': {
              const title = fields.title as string;
              const category = fields.category as string;
              const description = fields.description as string;
              const image_width = fields.image_width ? Number(fields.image_width) : null;
              const image_height = fields.image_height ? Number(fields.image_height) : null;
              const isFavorite = fields.is_favorite === "true";
              const workType = fields.type as "image" | "video";
              const video_url = fields.video_url as string | null;
              let image_url: string | null = null;

              if (fileContent && fileInfo) {
                const uploadResult = await uploadImage({ ...fileInfo, content: fileContent }, title);
                image_url = uploadResult.url;
              }

              const parsed = workSchema.safeParse({
                title,
                category,
                description,
                type: workType,
                video_url,
                image_url,
                image_width,
                image_height,
              });

              if (!parsed.success) {
                resolve(new Response(JSON.stringify({ success: false, message: parsed.error.errors[0].message }), {
                  status: 400,
                  headers: { 'Content-Type': 'application/json' },
                }));
                return;
              }

              try {
                const { error } = await supabaseAdmin.from("works").insert({
                  title: parsed.data.title,
                  category: parsed.data.category,
                  description: parsed.data.description,
                  image_url: parsed.data.image_url,
                  image_width: parsed.data.image_width,
                  image_height: parsed.data.image_height,
                  is_favorite: isFavorite,
                  type: parsed.data.type,
                  video_url: parsed.data.video_url,
                });

                if (error) {
                  if (parsed.data.image_url) {
                    await deleteImage(parsed.data.image_url);
                  }
                  console.error("Error adding work to Supabase:", error);
                  resolve(new Response(JSON.stringify({ success: false, message: error.message }), {
                    status: 500,
                    headers: { 'Content-Type': 'application/json' },
                  }));
                  return;
                }
              } catch (e: any) {
                console.error("Unexpected error during Supabase insert:", e);
                resolve(new Response(JSON.stringify({ success: false, message: `Unexpected error: ${e.message}` }), {
                  status: 500,
                  headers: { 'Content-Type': 'application/json' },
                }));
                return;
              }

              resolve(new Response(JSON.stringify({ success: true, message: "Work added successfully" }), {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
              }));
              break;
            }
            case 'updateWork': {
              const id = fields.id as string;
              const title = fields.title as string;
              const category = fields.category as string;
              const description = fields.description as string;
              const image_width = fields.image_width ? Number(fields.image_width) : null;
              const image_height = fields.image_height ? Number(fields.image_height) : null;
              const isFavorite = fields.is_favorite === "true";
              const workType = fields.type as "image" | "video";
              const video_url = fields.video_url as string | null;
              let image_url = fields.image_url as string | null;
              const currentImageUrl = fields.currentImageUrl as string | null;

              if (fileContent && fileInfo) {
                // If a new image is uploaded, delete the old one if it exists
                if (currentImageUrl) {
                  await deleteImage(currentImageUrl);
                }
                const uploadResult = await uploadImage({ ...fileInfo, content: fileContent }, title);
                image_url = uploadResult.url;
              }

              const parsed = workSchema.safeParse({
                title,
                category,
                description,
                type: workType,
                video_url,
                image_url,
                image_width,
                image_height,
              });

              if (!parsed.success) {
                resolve(new Response(JSON.stringify({ success: false, message: parsed.error.errors[0].message }), {
                  status: 400,
                  headers: { 'Content-Type': 'application/json' },
                }));
                return;
              }

              if (workType === "image" && image_url && currentImageUrl && image_url !== currentImageUrl) {
                await deleteImage(currentImageUrl);
              }

              try {
                const { error } = await supabaseAdmin.from("works").update({
                  title: parsed.data.title,
                  category: parsed.data.category,
                  description: parsed.data.description,
                  image_url: parsed.data.image_url,
                  image_width: parsed.data.image_width,
                  image_height: parsed.data.image_height,
                  is_favorite: isFavorite,
                  type: parsed.data.type,
                  video_url: parsed.data.video_url,
                }).eq("id", id);

                if (error) {
                  console.error("Error updating work in Supabase:", error);
                  resolve(new Response(JSON.stringify({ success: false, message: error.message }), {
                    status: 500,
                    headers: { 'Content-Type': 'application/json' },
                  }));
                  return;
                }
              } catch (e: any) {
                console.error("Unexpected error during Supabase update:", e);
                resolve(new Response(JSON.stringify({ success: false, message: `Unexpected error: ${e.message}` }), {
                  status: 500,
                  headers: { 'Content-Type': 'application/json' },
                }));
                return;
              }

              resolve(new Response(JSON.stringify({ success: true, message: "Work updated successfully" }), {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
              }));
              break;
            }
            case 'deleteWork': {
              const { id, imageUrl } = fields;

              if (imageUrl) {
                await deleteImage(imageUrl);
              }

              const { error } = await supabaseAdmin.from("works").delete().eq("id", id);

              if (error) {
                console.error("Error deleting work:", error);
                resolve(new Response(JSON.stringify({ success: false, message: error.message }), {
                  status: 500,
                  headers: { 'Content-Type': 'application/json' },
                }));
                return;
              }

              resolve(new Response(JSON.stringify({ success: true, message: "Work deleted successfully" }), {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
              }));
              break;
            }
            case 'getSignedUploadUrl': {
              const { fileName, contentType, bucketName } = fields;

              const { data, error } = await supabaseAdmin.storage
                .from(bucketName)
                .createSignedUploadUrl(`${fileName}`);

              if (error) {
                console.error("Error getting presigned URL:", error);
                resolve(new Response(JSON.stringify({ success: false, message: error.message, data: null }), {
                  status: 500,
                  headers: { 'Content-Type': 'application/json' },
                }));
                return;
              }

              resolve(new Response(JSON.stringify({ success: true, message: "Presigned URL generated", data }), {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
              }));
              break;
            }
            default:
              resolve(new Response('Invalid action type', { status: 400 }));
          }
        } catch (error: any) {
          console.error("Error in works handler:", error);
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