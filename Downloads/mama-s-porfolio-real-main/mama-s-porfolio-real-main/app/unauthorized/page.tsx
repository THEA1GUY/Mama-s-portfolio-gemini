import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ShieldOff } from "lucide-react"

export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black text-white p-6 text-center">
      <ShieldOff className="h-24 w-24 text-red-500 mb-8" />
      <h1 className="text-5xl font-bold text-african-terracotta mb-4">Access Denied</h1>
      <p className="text-lg text-gray-400 mb-8">You do not have the necessary permissions to view this page.</p>
      <Link href="/login">
        <Button className="bg-african-terracotta hover:bg-african-terracotta/90 text-white px-8 py-3 font-medium">
          Go to Login
        </Button>
      </Link>
      <Link href="/" className="mt-4 text-purple-400 hover:text-purple-300 transition-colors">
        Back to Home
      </Link>
    </div>
  )
}
