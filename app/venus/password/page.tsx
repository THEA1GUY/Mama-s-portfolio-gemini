"use client"

import { login } from "./actions"

export default function PasswordPage() {
  const formAction = async (formData: FormData) => {
    console.log("Client-side formAction hit!")
    await login(formData.get("password") as string)
  }

  return (
    <div className="flex items-center justify-center h-screen">
      <form action={formAction} className="space-y-4">
        <input
          type="password"
          name="password"
          className="border p-2"
          required
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          Login
        </button>
      </form>
    </div>
  )
}
