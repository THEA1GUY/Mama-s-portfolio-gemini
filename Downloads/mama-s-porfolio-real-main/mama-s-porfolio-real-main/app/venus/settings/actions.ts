"use server"

import { createAdminClient, createServerClient } from "@/lib/supabase"
import { cookies } from "next/headers"
import { revalidatePath } from "next/cache"
import { z } from "zod"
import { Database } from "@/lib/database.types"

// Define Zod schema for content setting data validation
const contentSettingSchema = z.object({
  key: z.string().min(1, "Key is required"),
  value_text: z.string().optional().nullable(),
  value_image_url: z.string().optional().nullable(),
  value_image_width: z.number().optional().nullable(),
  value_image_height: z.number().optional().nullable(),
  imageFile: z.instanceof(File).optional(), // For new uploads
})

// Helper function to upload image to Supabase Storage and get dimensions
async function uploadImage(
  file: File,
  key: string, // Use key for folder structure
  width: number | null,
  height: number | null,
): Promise<{ url: string; width: number | null; height: number | null }> {
  const supabaseAdmin = createAdminClient()
  const fileExt = file.name.split(".").pop()
  const fileName = `${key}-${Date.now()}.${fileExt}` // Unique filename based on key
  const filePath = `content_settings/${fileName}` // Store in a dedicated folder

  const buffer = Buffer.from(await file.arrayBuffer())

  const { data, error } = await supabaseAdmin.storage.from("content-images").upload(filePath, buffer, {
    cacheControl: "3600",
    upsert: false,
    contentType: file.type,
  })

  if (error) {
    console.error("Error uploading image:", error)
    throw new Error(`Image upload failed: ${error.message}`)
  }

  const { data: publicUrlData } = supabaseAdmin.storage.from("content-images").getPublicUrl(filePath)
  return { url: publicUrlData.publicUrl, width, height }
}

// Helper function to delete image from Supabase Storage
async function deleteImage(imageUrl: string) {
  const supabaseAdmin = createAdminClient()
  const pathSegments = imageUrl.split("/")
  const fileName = pathSegments[pathSegments.length - 1]
  const filePath = `content_settings/${fileName}` // Assuming all images are in 'content_settings/' folder

  const { error } = await supabaseAdmin.storage.from("content-images").remove([filePath])

  if (error) {
    console.error("Error deleting image:", error)
    // Don't throw error here, as it might be a stale URL or file already gone
  }
}

export async function getContentSettings() {
  const supabase = createServerClient() // Use server client for public reads
  const { data, error } = await supabase
    .from("content_settings")
    .select("*")

  if (error) {
    console.error("Error fetching content settings:", error)
    return { success: false, message: error.message, data: null }
  }
  return { success: true, message: "Content settings fetched successfully", data: data as Database['public']['Tables']['content_settings']['Row'][] }
}

export async function updateContentSetting(formData: FormData) {
  const supabase = createAdminClient() // Use admin client to bypass RLS
  const key = formData.get("key") as string
  const value_text = formData.get("value_text") as string | null
  const imageFile = formData.get("imageFile") as File | null
  const currentImageUrl = formData.get("currentImageUrl") as string | null
  const imageWidthFromForm = formData.get("imageWidth") ? Number(formData.get("imageWidth")) : null
  const imageHeightFromForm = formData.get("imageHeight") ? Number(formData.get("imageHeight")) : null

  const parsed = contentSettingSchema.safeParse({
    key,
    value_text,
    imageFile: imageFile && imageFile.size > 0 ? imageFile : undefined,
    value_image_url: currentImageUrl,
  })

  if (!parsed.success) {
    return { success: false, message: parsed.error.errors[0].message }
  }

  let newImageUrl: string | null = currentImageUrl
  let newImageWidth: number | null = imageWidthFromForm
  let newImageHeight: number | null = imageHeightFromForm

  if (parsed.data.imageFile) {
    // If a new image is uploaded, delete the old one if it exists
    if (currentImageUrl) {
      await deleteImage(currentImageUrl)
    }
    try {
      const uploadResult = await uploadImage(parsed.data.imageFile, key, imageWidthFromForm, imageHeightFromForm)
      newImageUrl = uploadResult.url
      newImageWidth = uploadResult.width
      newImageHeight = uploadResult.height
    } catch (uploadError: any) {
      return { success: false, message: uploadError.message }
    }
  } else if (!currentImageUrl && imageFile === null) {
    // If no new image and current image is removed
    if (currentImageUrl) {
      await deleteImage(currentImageUrl)
    }
    newImageUrl = null
    newImageWidth = null
    newImageHeight = null
  }

  const updateData: {
    key: string
    value_text?: string | null
    value_image_url?: string | null
    value_image_width?: number | null
    value_image_height?: number | null
  } = {
    key: key,
    value_text: parsed.data.value_text,
    value_image_url: newImageUrl,
    value_image_width: newImageWidth,
    value_image_height: newImageHeight,
  }

  const { error } = await supabase
    .from("content_settings")
    .upsert(updateData, { onConflict: "key" }) // Upsert based on key

  if (error) {
    console.error("Error updating content setting:", error)
    return { success: false, message: error.message }
  }

  revalidatePath("/venus/settings")
  revalidatePath("/") // Revalidate home page
  revalidatePath("/about") // Revalidate about page
  revalidatePath("/services") // Revalidate services page

  return { success: true, message: "Content setting updated successfully" }
}
