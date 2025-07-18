"use server"

import { createServerClient, createAdminClient } from "@/lib/supabase"
import { revalidatePath } from "next/cache"
import { z } from "zod"
// import sharp from "sharp" // REMOVE THIS LINE

// Define Zod schema for work data validation
const workSchema = z.object({
  title: z.string().min(1, "Title is required"),
  category: z.string().min(1, "Category is required"),
  description: z.string().optional(),
  imageFile: z.instanceof(File).optional(), // For new uploads
  currentImageUrl: z.string().optional().nullable(), // For existing images
  // No need to validate width/height from form, they are derived from imageFile
})

// Helper function to upload image to Supabase Storage and get dimensions
async function uploadImage(
  file: File,
  width: number | null,
  height: number | null,
): Promise<{ url: string; width: number | null; height: number | null }> {
  const supabaseAdmin = createAdminClient()
  const fileExt = file.name.split(".").pop()
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`
  const filePath = `works/${fileName}`

  const buffer = Buffer.from(await file.arrayBuffer())

  const { data, error } = await supabaseAdmin.storage.from("works-images").upload(filePath, buffer, {
    cacheControl: "3600",
    upsert: false,
    contentType: file.type, // Ensure correct content type is set
  })

  if (error) {
    console.error("Error uploading image:", error)
    throw new Error(`Image upload failed: ${error.message}`)
  }

  const { data: publicUrlData } = supabaseAdmin.storage.from("works-images").getPublicUrl(filePath)
  return { url: publicUrlData.publicUrl, width, height } // Return passed dimensions
}

// Helper function to delete image from Supabase Storage
async function deleteImage(imageUrl: string) {
  const supabaseAdmin = createAdminClient()
  const pathSegments = imageUrl.split("/")
  const fileName = pathSegments[pathSegments.length - 1]
  const filePath = `works/${fileName}` // Assuming all images are in 'works/' folder

  const { error } = await supabaseAdmin.storage.from("works-images").remove([filePath])

  if (error) {
    console.error("Error deleting image:", error)
    // Don't throw error here, as it might be a stale URL or file already gone
  }
}

export async function getWorks(isFavorite?: boolean) {
  const supabase = createServerClient()
  let query = supabase
    .from("works")
    .select("*, image_width, image_height, is_favorite") // Explicitly include is_favorite

  if (isFavorite !== undefined) {
    query = query.eq("is_favorite", isFavorite)
  }

  const { data, error } = await query.order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching works:", error)
    return { success: false, message: error.message, data: null }
  }
  console.log("Fetched works data:", data) // Add this line
  return { success: true, message: "Works fetched successfully", data }
}

export async function addWork(formData: FormData) {
  const supabase = createAdminClient()
  const imageFile = formData.get("imageFile") as File | null
  const title = formData.get("title") as string
  const category = formData.get("category") as string
  const description = formData.get("description") as string
  const imageWidthFromForm = formData.get("imageWidth") ? Number(formData.get("imageWidth")) : null
  const imageHeightFromForm = formData.get("imageHeight") ? Number(formData.get("imageHeight")) : null
  const isFavorite = formData.get("is_favorite") === "true"

  const parsed = workSchema.safeParse({
    title,
    category,
    description,
    imageFile: imageFile && imageFile.size > 0 ? imageFile : undefined,
  })

  if (!parsed.success) {
    return { success: false, message: parsed.error.errors[0].message }
  }

  let imageUrl: string | null = null
  let imageWidth: number | null = null
  let imageHeight: number | null = null

  if (parsed.data.imageFile) {
    try {
      const uploadResult = await uploadImage(parsed.data.imageFile, imageWidthFromForm, imageHeightFromForm)
      imageUrl = uploadResult.url
      imageWidth = uploadResult.width
      imageHeight = uploadResult.height
    } catch (uploadError: any) {
      return { success: false, message: uploadError.message }
    }
  }

  try {
    const { error } = await supabase.from("works").insert({
      title: parsed.data.title,
      category: parsed.data.category,
      description: parsed.data.description,
      image_url: imageUrl,
      image_width: imageWidth,
      image_height: imageHeight,
      is_favorite: isFavorite, // Insert is_favorite
    })

    if (error) {
      if (imageUrl) {
        await deleteImage(imageUrl)
      }
      console.error("Error adding work to Supabase:", error) // MODIFIED LOG
      return { success: false, message: error.message }
    }
  } catch (e: any) {
    console.error("Unexpected error during Supabase insert:", e) // ADDED CATCH
    return { success: false, message: `Unexpected error: ${e.message}` }
  }

  revalidatePath("/venus/works")
  revalidatePath("/")
  return { success: true, message: "Work added successfully" }
}

export async function updateWork(id: string, formData: FormData) {
  const supabase = createAdminClient()
  const imageFile = formData.get("imageFile") as File | null
  const title = formData.get("title") as string
  const category = formData.get("category") as string
  const description = formData.get("description") as string
  const currentImageUrl = formData.get("currentImageUrl") as string | null
  const currentImageWidth = formData.get("currentImageWidth") ? Number(formData.get("currentImageWidth")) : null
  const currentImageHeight = formData.get("currentImageHeight") ? Number(formData.get("currentImageHeight")) : null
  const newImageWidthFromForm = formData.get("imageWidth") ? Number(formData.get("imageWidth")) : null
  const newImageHeightFromForm = formData.get("imageHeight") ? Number(formData.get("imageHeight")) : null
  const isFavorite = formData.get("is_favorite") === "true" // Get is_favorite from form data

  const parsed = workSchema.safeParse({
    title,
    category,
    description,
    imageFile: imageFile && imageFile.size > 0 ? imageFile : undefined,
    currentImageUrl,
  })

  if (!parsed.success) {
    return { success: false, message: parsed.error.errors[0].message }
  }

  let newImageUrl: string | null = currentImageUrl
  let newImageWidth: number | null = currentImageWidth
  let newImageHeight: number | null = currentImageHeight

  if (parsed.data.imageFile) {
    if (currentImageUrl) {
      await deleteImage(currentImageUrl)
    }
    try {
      const uploadResult = await uploadImage(parsed.data.imageFile, newImageWidthFromForm, newImageHeightFromForm)
      newImageUrl = uploadResult.url
      newImageWidth = uploadResult.width
      newImageHeight = uploadResult.height
    } catch (uploadError: any) {
      return { success: false, message: uploadError.message }
    }
  } else if (!currentImageUrl && imageFile === null) {
    if (currentImageUrl) {
      await deleteImage(currentImageUrl)
    }
    newImageUrl = null
    newImageWidth = null
    newImageHeight = null
  }

  try {
    const { error } = await supabase
      .from("works")
      .update({
        title: parsed.data.title,
        category: parsed.data.category,
        description: parsed.data.description,
        image_url: newImageUrl,
        image_width: newImageWidth,
        image_height: newImageHeight,
        is_favorite: isFavorite, // Update is_favorite
      })
      .eq("id", id)

    if (error) {
      if (parsed.data.imageFile && newImageUrl && newImageUrl !== currentImageUrl) {
        await deleteImage(newImageUrl)
      }
      console.error("Error updating work in Supabase:", error) // MODIFIED LOG
      return { success: false, message: error.message }
    }
  } catch (e: any) {
    console.error("Unexpected error during Supabase update:", e) // ADDED CATCH
    return { success: false, message: `Unexpected error: ${e.message}` }
  }

  revalidatePath("/venus/works")
  revalidatePath("/")
  return { success: true, message: "Work updated successfully" }
}

export async function deleteWork(id: string, imageUrl: string | null) {
  const supabase = createAdminClient()

  if (imageUrl) {
    await deleteImage(imageUrl)
  }

  const { error } = await supabase.from("works").delete().eq("id", id)

  if (error) {
    console.error("Error deleting work:", error)
    return { success: false, message: error.message }
  }

  revalidatePath("/venus/works")
  revalidatePath("/")
  return { success: true, message: "Work deleted successfully" }
}