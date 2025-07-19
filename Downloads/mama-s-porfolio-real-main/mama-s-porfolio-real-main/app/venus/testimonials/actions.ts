"use server"

import { createServerClient, createAdminClient } from "@/lib/supabase"
import { cookies } from "next/headers"
import { revalidatePath } from "next/cache"
import { z } from "zod"

// Define Zod schema for testimonial data validation
const testimonialSchema = z.object({
  name: z.string().min(1, "Client name is required."),
  role: z.string().optional(),
  text: z.string().min(1, "Testimonial text is required."),
  rating: z.coerce.number().min(1).max(5, "Rating must be between 1 and 5.").optional().nullable(),
  approved: z.boolean().default(false),
})

export async function getTestimonials() {
  const supabase = createAdminClient()
  const { data, error } = await supabase.from("testimonials").select("*").order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching testimonials:", error)
    return { success: false, message: error.message, data: null }
  }
  return { success: true, message: "Testimonials fetched successfully", data }
}

export async function addTestimonial(formData: FormData) {
  const supabase = createAdminClient()
  const name = formData.get("name") as string
  const role = formData.get("role") as string
  const text = formData.get("text") as string
  const rating = formData.get("rating") ? Number.parseInt(formData.get("rating") as string) : null
  const approved = formData.get("approved") === "on" // Checkbox value

  const parsed = testimonialSchema.safeParse({
    name,
    role: role || null, // Ensure empty string becomes null
    text,
    rating,
    approved,
  })

  if (!parsed.success) {
    return { success: false, message: parsed.error.errors[0].message }
  }

  const { error } = await supabase.from("testimonials").insert(parsed.data)

  if (error) {
    console.error("Error adding testimonial:", error)
    return { success: false, message: error.message }
  }

  revalidatePath("/venus/testimonials")
  revalidatePath("/") // Revalidate homepage to show new testimonial if approved
  return { success: true, message: "Testimonial added successfully" }
}

export async function updateTestimonial(id: string, formData: FormData) {
  const supabase = createAdminClient()
  const name = formData.get("name") as string
  const role = formData.get("role") as string
  const text = formData.get("text") as string
  const rating = formData.get("rating") ? Number.parseInt(formData.get("rating") as string) : null
  const approved = formData.get("approved") === "on" // Checkbox value

  const parsed = testimonialSchema.safeParse({
    name,
    role: role || null,
    text,
    rating,
    approved,
  })

  if (!parsed.success) {
    return { success: false, message: parsed.error.errors[0].message }
  }

  const { error } = await supabase.from("testimonials").update(parsed.data).eq("id", id)

  if (error) {
    console.error("Error updating testimonial:", error)
    return { success: false, message: error.message }
  }

  revalidatePath("/venus/testimonials")
  revalidatePath("/") // Revalidate homepage to show updated testimonial
  return { success: true, message: "Testimonial updated successfully" }
}

export async function deleteTestimonial(id: string) {
  const supabase = createAdminClient()
  const { error } = await supabase.from("testimonials").delete().eq("id", id)

  if (error) {
    console.error("Error deleting testimonial:", error)
    return { success: false, message: error.message }
  }

  revalidatePath("/venus/testimonials")
  revalidatePath("/") // Revalidate homepage to reflect deletion
  return { success: true, message: "Testimonial deleted successfully" }
}

export async function toggleTestimonialApproval(id: string, currentApprovedStatus: boolean) {
  const supabase = createAdminClient()
  const { error } = await supabase.from("testimonials").update({ approved: !currentApprovedStatus }).eq("id", id)

  if (error) {
    console.error("Error toggling approval status:", error)
    return { success: false, message: error.message }
  }

  revalidatePath("/venus/testimonials")
  revalidatePath("/") // Revalidate homepage as approval status affects visibility
  return { success: true, message: `Testimonial approval status updated.` }
}