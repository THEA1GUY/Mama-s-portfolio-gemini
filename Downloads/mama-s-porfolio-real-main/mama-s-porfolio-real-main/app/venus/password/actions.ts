"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export async function login(password: string) {
  if (password === process.env.VENUS_PASSWORD) {
    cookies().set("venus_authenticated", "true", { secure: process.env.NODE_ENV === "production", httpOnly: true, sameSite: "lax", path: "/" })
    redirect("/venus")
  } else {
    return { error: "Invalid password" }
  }
}