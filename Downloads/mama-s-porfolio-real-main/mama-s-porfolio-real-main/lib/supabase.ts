import { createClient } from "@supabase/supabase-js"
import { cookies } from "next/headers"
import type { Database } from "./database.types"

// This client is for server-side operations (e.g., Server Actions, Route Handlers)
// It uses the service role key and does not persist sessions.
export const createServerClient = () =>
  createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!, // Use service role key for server actions
    {
      auth: {
        persistSession: false, // No session persistence on server
      },
    },
  )

// This client is specifically for Server Components and Layouts
// It reads the session from the request cookies.
export const createServerComponentClient = () => {
  const cookieStore = cookies()
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, // Use anon key for client-facing reads
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          try {
            cookieStore.set(name, value, options)
          } catch (error) {
            // The `cookies().set()` method can only be called in a Server Action or Route Handler.
            // This error is expected if you're not setting cookies in a Server Component.
            console.warn("Could not set cookie from Server Component:", error)
          }
        },
        remove(name: string, options: any) {
          try {
            cookieStore.set(name, "", options)
          } catch (error) {
            console.warn("Could not remove cookie from Server Component:", error)
          }
        },
      },
    },
  )
}

// This client is for server-side operations that require the service role key
// (e.g., deleting files from storage, bypassing RLS for specific admin tasks)
export const createAdminClient = () => {
  console.log("DEBUG: SUPABASE_SERVICE_ROLE_KEY length:", process.env.SUPABASE_SERVICE_ROLE_KEY?.length)
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!, // Use service role key
    {
      auth: {
        persistSession: false, // No session persistence on server
      },
    },
  )
}

// Create a single Supabase client for client-side operations
// This client uses the anon public key and handles user sessions
export const createBrowserClient = () =>
  createClient<Database>(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
