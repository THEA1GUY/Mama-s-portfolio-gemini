import type React from "react"
import type { Metadata } from "next"
import { Inter, Cinzel } from "next/font/google" // Import both fonts
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster" // Import Toaster

// Configure Inter for body text
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter", // Define a CSS variable for Inter
  display: "swap", // Optimize font loading
})

// Configure Cinzel for headings
const cinzel = Cinzel({
  subsets: ["latin"],
  variable: "--font-cinzel", // Define a CSS variable for Cinzel
  weight: ["400", "700"], // Specify weights to load
  display: "swap", // Optimize font loading
})

export const metadata: Metadata = {
  title: "Divine Ameh - Celestial African Art",
  description: "A visionary artist bridging ancient African wisdom with contemporary celestial beauty.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    // Apply both font variables to the html tag
    <html lang="en" className={`${inter.variable} ${cinzel.variable}`}>
      <body>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
        <Toaster /> {/* Add Toaster component here */}
      </body>
    </html>
  )
}
