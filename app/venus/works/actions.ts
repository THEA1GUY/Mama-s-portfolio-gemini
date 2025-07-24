"use server"

import { createServerClient, createAdminClient } from "@/lib/supabase"
import { cookies } from "next/headers"
import { revalidatePath } from "next/cache"
import { z } from "zod"
import { Database } from "@/lib/database.types"

// Define Zod schema for work data validation
const workSchema = z.object({
  title: z.string().min(1, "Title is required"),
  category: z.string().min(1, "Category is required"),
  description: z.string().optional(),
  type: z.enum(["image", "video"]).default("image"),
  image_url: z.string().optional().nullable(),
  video_url: z.string().url("Must be a valid URL").optional().nullable(),
  image_width: z.number().optional().nullable(),
  image_height: z.number().optional().nullable(),
});

// Helper function to delete image from Supabase Storage
async function deleteImage(imageUrl: string) {
  const supabaseAdmin = createAdminClient()
  const pathSegments = imageUrl.split("/")
  const fileName = pathSegments[pathSegments.length - 1]
  const filePath = `works/${fileName}`

  const { error } = await supabaseAdmin.storage.from("works-images").remove([filePath])

  if (error) {
    console.error("Error deleting image:", error)
  }
}

export async function getWorks(isFavorite?: boolean) {
  const supabase = createAdminClient()
  let query = supabase
    .from("works")
    .select("*, image_width, image_height, is_favorite, type, video_url, document_url, thumbnail_url")

  if (isFavorite !== undefined) {
    query = query.eq("is_favorite", isFavorite)
  }

  const { data, error } = await query

  if (error) {
    console.error("Error fetching works:", error)
    return { success: false, message: error.message, data: null }
  }
  return { success: true, message: "Works fetched successfully", data }
}

export async function addWork(formData: FormData) {
    const supabase = createAdminClient()
    const title = formData.get("title") as string
    const category = formData.get("category") as string
    const description = formData.get("description") as string
    const image_width = formData.get("image_width") ? Number(formData.get("image_width")) : null
    const image_height = formData.get("image_height") ? Number(formData.get("image_height")) : null
    const isFavorite = formData.get("is_favorite") === "true"
    console.log("Is Favorite (before insert):", isFavorite)
    const type = formData.get("type") as "image" | "video"
    const video_url = formData.get("video_url") as string | null
    const image_url = formData.get("image_url") as string | null

    const parsed = workSchema.safeParse({
        title,
        category,
        description,
        type,
        video_url,
        image_url,
        image_width: image_width,
        image_height: image_height,
    });

    if (!parsed.success) {
        return { success: false, message: parsed.error.errors[0].message }
    }

    try {
        const { error } = await supabase.from("works").insert({
            title: parsed.data.title,
            category: parsed.data.category,
            description: parsed.data.description,
            image_url: parsed.data.image_url,
            image_width: parsed.data.image_width,
            image_height: parsed.data.image_height,
            is_favorite: isFavorite,
            type: parsed.data.type,
            video_url: parsed.data.video_url,
        })

        if (error) {
            if (parsed.data.image_url) {
                await deleteImage(parsed.data.image_url)
            }
            console.error("Error adding work to Supabase:", error)
            return { success: false, message: error.message }
        }
    } catch (e: any) {
        console.error("Unexpected error during Supabase insert:", e)
        return { success: false, message: `Unexpected error: ${e.message}` }
    }

    revalidatePath("/venus/works")
    revalidatePath("/")
    return { success: true, message: "Work added successfully" }
}

export async function updateWork(id: string, formData: FormData) {
    const supabase = createAdminClient()
    const title = formData.get("title") as string
    const category = formData.get("category") as string
    const description = formData.get("description") as string
    const image_width = formData.get("image_width") ? Number(formData.get("image_width")) : null
    const image_height = formData.get("image_height") ? Number(formData.get("image_height")) : null
    const isFavorite = formData.get("is_favorite") === "true"
    const type = formData.get("type") as "image" | "video"
    const video_url = formData.get("video_url") as string | null
    const image_url = formData.get("image_url") as string | null
    const currentImageUrl = formData.get("currentImageUrl") as string | null

    const parsed = workSchema.safeParse({
        title,
        category,
        description,
        type,
        video_url,
        image_url,
        image_width: image_width,
        image_height: image_height,
    });


    if (!parsed.success) {
        return { success: false, message: parsed.error.errors[0].message }
    }

    if (type === "image" && image_url && currentImageUrl && image_url !== currentImageUrl) {
        await deleteImage(currentImageUrl);
    }

    try {
        const { error } = await supabase.from("works").update({
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
            console.error("Error updating work in Supabase:", error)
            return { success: false, message: error.message }
        }
    } catch (e: any) {
        console.error("Unexpected error during Supabase update:", e)
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

export async function getSignedUploadUrl(fileName: string, contentType: string, bucketName: string) {
  const supabaseAdmin = createAdminClient();

  const { data, error } = await supabaseAdmin.storage
    .from(bucketName)
    .createSignedUploadUrl(`${fileName}`)

  if (error) {
    console.error("Error getting presigned URL:", error);
    return { success: false, message: error.message, data: null };
  }

  return { success: true, message: "Presigned URL generated", data };
}