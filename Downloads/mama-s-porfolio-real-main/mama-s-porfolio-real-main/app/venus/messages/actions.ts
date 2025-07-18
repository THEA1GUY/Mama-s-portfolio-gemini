"use server"

import { createServerClient } from "@/lib/supabase"
import { revalidatePath } from "next/cache"
import { z } from "zod"

// Zod schema for contact form submission
const messageSchema = z.object({
  name: z.string().min(1, "Name is required."),
  email: z.string().email("Invalid email address."),
  message: z.string().min(1, "Message cannot be empty."),
})

export async function getMessages() {
  const supabase = createServerClient()
  const { data, error } = await supabase.from("messages").select("*").order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching messages:", error)
    return { success: false, message: error.message, data: null }
  }
  return { success: true, message: "Messages fetched successfully", data }
}

export async function updateMessageStatus(id: string, read: boolean) {
  const supabase = createServerClient()
  const { error } = await supabase.from("messages").update({ read }).eq("id", id)

  if (error) {
    console.error("Error updating message status:", error)
    return { success: false, message: error.message }
  }

  revalidatePath("/venus/messages")
  return { success: true, message: `Message marked as ${read ? "read" : "unread"}` }
}

export async function deleteMessage(id: string) {
  const supabase = createServerClient()
  const { error } = await supabase.from("messages").delete().eq("id", id)

  if (error) {
    console.error("Error deleting message:", error)
    return { success: false, message: error.message }
  }

  revalidatePath("/venus/messages")
  return { success: true, message: "Message deleted successfully" }
}

export async function submitContactForm(formData: FormData) {
  const supabase = createServerClient()
  const name = formData.get("name") as string
  const email = formData.get("email") as string
  const message = formData.get("message") as string

  const parsed = messageSchema.safeParse({ name, email, message })

  if (!parsed.success) {
    return { success: false, message: parsed.error.errors[0].message }
  }

  const { error } = await supabase.from("messages").insert({
    name: parsed.data.name,
    email: parsed.data.email,
    message: parsed.data.message,
    read: false, // New messages are unread by default
  })

  if (error) {
    console.error("Error submitting contact form:", error)
    return { success: false, message: error.message }
  }

  revalidatePath("/venus/messages") // Revalidate admin messages page
  return { success: true, message: "Your message has been sent successfully!" }
}