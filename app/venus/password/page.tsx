"use client"

import { useRouter } from "next/navigation"

export default function PasswordPage() {
  const router = useRouter();
  const formAction = async (formData: FormData) => {
    console.log("Client-side formAction hit!")
    const password = formData.get("password") as string;

    const response = await fetch('/.netlify/functions/password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ password }),
    });

    const result = await response.json();

    if (result.success) {
      router.push("/venus");
    } else {
      alert(result.error || "Login failed");
    }
  };

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
