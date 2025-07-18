"use client"

import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useInView } from "@/hooks/use-in-view" // Import useInView hook
import { Input } from "@/components/ui/input" // Import Input
import { Label } from "@/components/ui/label" // Import Label
import { Textarea } from "@/components/ui/textarea" // Import Textarea
import { useActionState } from "react" // Import useActionState
import { submitContactForm } from "@/app/venus/messages/actions" // Import the action
import { useToast } from "@/hooks/use-toast" // Import useToast
import React from "react" // Import React for useEffect

export default function ContactPage() {
  const [contactHeaderRef, contactHeaderInView] = useInView()
  const [contactFormRef, contactFormInView] = useInView()
  const [contactInfoRef, contactInfoInView] = useInView()
  const [footerRef, footerInView] = useInView()

  const [state, formAction, isPending] = useActionState(submitContactForm, null)
  const { toast } = useToast()

  // Show toast message based on action state
  React.useEffect(() => {
    if (state?.success === true) {
      toast({
        title: "Success",
        description: state.message,
      })
    } else if (state?.success === false) {
      toast({
        title: "Error",
        description: state.message,
        variant: "destructive",
      })
    }
  }, [state, toast])

  return (
    <div className="min-h-screen bg-black text-white relative pt-24 pb-12">
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

      <nav className="fixed top-0 w-full z-50 bg-black/90 backdrop-blur-sm border-b border-purple-500/20">
        <div className="max-w-7xl mx-auto flex items-center justify-between p-6">
          <div className="flex items-center space-x-3">
            <span className="text-xl font-bold tracking-wider">DIVINE AMEH</span>
          </div>
          <Link href="/" className="text-purple-400 hover:text-purple-300 transition-colors flex items-center gap-2">
            <ArrowLeft size={20} /> Back to Home
          </Link>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div
          ref={contactHeaderRef}
          className={`text-center mb-16 transition-all duration-1000 ${contactHeaderInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
        >
          <h1 className="text-5xl lg:text-6xl font-bold mb-6">Get in Touch</h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            I'd love to hear from you! Whether you have a project in mind, a question, or just want to connect, feel
            free to reach out.
          </p>
        </div>

        {/* Contact Form */}
        <div
          ref={contactFormRef}
          className={`bg-black/60 border border-purple-500/20 rounded-lg p-8 max-w-2xl mx-auto mb-12 transition-all duration-1000 delay-200 ${contactFormInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
        >
          <h2 className="text-3xl font-bold text-center mb-8">Send a Message</h2>
          <form action={formAction} className="space-y-6">
            <div>
              <Label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                Name
              </Label>
              <Input
                type="text"
                id="name"
                name="name" // Add name attribute for FormData
                className="w-full p-3 rounded-md bg-gray-800 border border-gray-700 focus:ring-african-ochre focus:border-african-ochre text-white"
                placeholder="Your Name"
                required
                disabled={isPending}
              />
            </div>
            <div>
              <Label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email
              </Label>
              <Input
                type="email"
                id="email"
                name="email" // Add name attribute for FormData
                className="w-full p-3 rounded-md bg-gray-800 border border-gray-700 focus:ring-african-ochre focus:border-african-ochre text-white"
                placeholder="your@example.com"
                required
                disabled={isPending}
              />
            </div>
            <div>
              <Label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                Message
              </Label>
              <Textarea
                id="message"
                name="message" // Add name attribute for FormData
                rows={5}
                className="w-full p-3 rounded-md bg-gray-800 border border-gray-700 focus:ring-african-ochre focus:border-african-ochre text-white"
                placeholder="Your message..."
                required
                disabled={isPending}
              ></Textarea>
            </div>
            <Button
              type="submit"
              className="w-full bg-african-terracotta hover:bg-african-terracotta/90 text-white py-3 font-medium"
              disabled={isPending}
            >
              {isPending ? "Sending..." : "Send Message"}
            </Button>
          </form>
        </div>

        {/* Contact Info */}
        <div
          ref={contactInfoRef}
          className={`grid md:grid-cols-3 gap-8 text-center mb-12 transition-all duration-1000 delay-400 ${contactInfoInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
        >
          <div>
            <h3 className="text-xl font-bold text-african-ochre mb-2">Email</h3>
            <p className="text-gray-300">info@divineameh.com</p>
          </div>
          <div>
            <h3 className="text-xl font-bold text-african-ochre mb-2">Phone</h3>
            <p className="text-gray-300">+1 (555) 123-4567</p>
          </div>
          <div>
            <h3 className="text-xl font-bold text-african-ochre mb-2">Socials</h3>
            <div className="flex justify-center space-x-4 mt-2">
              {["Instagram", "LinkedIn", "Behance"].map((social) => (
                <button key={social} className="text-gray-400 hover:text-african-ochre transition-colors text-sm">
                  {social}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer (moved from app/page.tsx, now in app/contact/page.tsx) */}
      <footer
        ref={footerRef}
        className={`border-t border-gray-800 py-12 px-6 transition-all duration-1000 delay-600 ${footerInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <span className="font-bold">DIVINE AMEH</span>
              </div>
              <p className="text-gray-400 text-sm">
                Bridging ancient African wisdom with celestial beauty through art and design.
              </p>
            </div>

            {["Portfolio", "Services", "About", "Contact"].map((section) => (
              <div key={section}>
                <h4 className="font-medium mb-4">{section}</h4>
                <div className="space-y-2 text-sm text-gray-400">
                  <p>Coming Soon</p>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">© 2024 Divine Ameh. All rights reserved.</p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              {["Instagram", "LinkedIn", "Behance"].map((social) => (
                <button key={social} className="text-gray-400 hover:text-african-ochre transition-colors text-sm">
                  {social}
                </button>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
