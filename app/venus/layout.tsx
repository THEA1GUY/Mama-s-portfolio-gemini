import type React from "react"
import Link from "next/link"
import { Home, GalleryVertical, Users, MessageSquare, Settings, LogOut } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Toaster } from "@/components/ui/toaster"

import type React from "react"
import Link from "next/link"
import { Home, GalleryVertical, Users, MessageSquare, Settings, LogOut } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Toaster } from "@/components/ui/toaster"
import { useRouter } from "next/navigation"

export default function VenusLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  const handleSignOut = () => {
    document.cookie = "venus_authenticated=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    router.push("/login");
  };

  return (
    <div className="flex min-h-screen bg-black text-white">
      {/* Subtle African Pattern Background */}
      <div className="fixed inset-0 opacity-5 bg-african-geometric"></div>
      {/* Twinkling Stars Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(150)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-twinkle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>
      {/* Venus Sidebar */}
      <aside className="w-64 bg-black border-r border-purple-500/20 p-6 flex flex-col relative z-10">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-african-terracotta">Venus Panel</h2>
          <p className="text-sm text-gray-400">Welcome, Venus</p>
        </div>
        <nav className="space-y-4">
          <Link
            href="/venus"
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-400 transition-all hover:text-african-ochre",
            )}
          >
            <Home className="h-5 w-5" />
            Dashboard
          </Link>
          <Link
            href="/venus/works"
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-400 transition-all hover:text-african-ochre",
            )}
          >
            <GalleryVertical className="h-5 w-5" />
            Works
          </Link>
          <Link
            href="/venus/testimonials"
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-400 transition-all hover:text-african-ochre",
            )}
          >
            <Users className="h-5 w-5" />
            Testimonials
          </Link>
          <Link
            href="/venus/messages"
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-400 transition-all hover:text-african-ochre",
            )}
          >
            <MessageSquare className="h-5 w-5" />
            Messages
          </Link>
          <Link
            href="/venus/settings"
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-400 transition-all hover:text-african-ochre",
            )}
          >
            <Settings className="h-5 w-5" />
            Settings
          </Link>
        </nav>
        <div className="mt-auto pt-6 border-t border-purple-500/20 space-y-4">
            <Button
              type="button"
              variant="outline"
              className="w-full border-red-500 text-red-500 hover:bg-red-500 hover:text-white bg-transparent flex items-center gap-2"
              onClick={handleSignOut}
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          <Link href="/">
            <Button
              variant="outline"
              className="w-full border-african-ochre text-african-ochre hover:bg-african-ochre hover:text-black bg-transparent"
            >
              Back to Site
            </Button>
          </Link>
        </div>
      </aside>
      {/* Main Content Area */}
      <main className="flex-1 p-8 overflow-auto relative z-10">{children}</main>
      <Toaster /> {/* Add Toaster component here */}
    </div>
  )
}
