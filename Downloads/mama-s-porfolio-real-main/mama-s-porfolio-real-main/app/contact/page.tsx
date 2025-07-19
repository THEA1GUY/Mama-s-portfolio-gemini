"use client"

import React, { useState } from "react"
import { Mail, MessageCircle, Twitter, Link as LucideLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { submitContactForm } from "@/app/venus/messages/actions"

export default function ContactPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData()
    formData.append("name", name)
    formData.append("email", email)
    formData.append("message", message)

    const result = await submitContactForm(formData)

    if (result.success) {
      toast({
        title: "Success",
        description: result.message,
      })
      setName("")
      setEmail("")
      setMessage("")
    } else {
      toast({
        title: "Error",
        description: result.message,
        variant: "destructive",
      })
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-black text-white relative pt-24 pb-20 px-6">
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

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <h1 className="text-5xl lg:text-6xl font-bold leading-tight mb-8">Get in Touch</h1>
        <p className="text-gray-300 text-lg leading-relaxed max-w-lg mx-auto mb-12">
          I'd love to hear from you! Connect with me through the channels below.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Contact Form */}
          <div className="md:col-span-2 bg-black/60 border border-purple-500/20 p-8 rounded-lg shadow-lg">
            <h2 className="text-3xl font-semibold mb-6 text-african-terracotta">Send a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="name" className="text-lg">Name</Label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="mt-1 bg-gray-800 border-gray-700 text-white focus:ring-african-ochre focus:border-african-ochre"
                />
              </div>
              <div>
                <Label htmlFor="email" className="text-lg">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="mt-1 bg-gray-800 border-gray-700 text-white focus:ring-african-ochre focus:border-african-ochre"
                />
              </div>
              <div>
                <Label htmlFor="message" className="text-lg">Message</Label>
                <Textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  rows={5}
                  className="mt-1 bg-gray-800 border-gray-700 text-white focus:ring-african-ochre focus:border-african-ochre"
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-african-terracotta hover:bg-african-terracotta/90 text-white px-6 py-3 font-medium text-lg"
                disabled={loading}
              >
                {loading ? "Sending..." : "Send Message"}
              </Button>
            </form>
          </div>

          {/* TikTok */}
          <div className="bg-black/60 border border-purple-500/20 p-6 rounded-lg shadow-lg flex flex-col items-center justify-center space-y-4">
            <LucideLink size={48} className="text-african-terracotta" />
            <h3 className="text-2xl font-semibold">TikTok</h3>
            <a
              href="https://www.tiktok.com/@theufedojo?_t=ZM-8y6j51M6fZN&_r=1"
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-400 hover:text-purple-300 transition-colors duration-300 text-lg"
            >
              @theufedojo
            </a>
            <Button
              className="bg-african-terracotta hover:bg-african-terracotta/90 text-white px-6 py-2 font-medium"
              onClick={() => window.open("https://www.tiktok.com/@theufedojo?_t=ZM-8y6j51M6fZN&_r=1", "_blank")}
            >
              Visit TikTok
            </Button>
          </div>

          {/* Twitter */}
          <div className="bg-black/60 border border-purple-500/20 p-6 rounded-lg shadow-lg flex flex-col items-center justify-center space-y-4">
            <Twitter size={48} className="text-african-terracotta" />
            <h3 className="text-2xl font-semibold">Twitter</h3>
            <a
              href="https://x.com/shy_black_girl?t=NRh2WbwAmxH7fF5IHeHcOA&s=09"
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-400 hover:text-purple-300 transition-colors duration-300 text-lg"
            >
              @shy_black_girl
            </a>
            <Button
              className="bg-african-terracotta hover:bg-african-terracotta/90 text-white px-6 py-2 font-medium"
              onClick={() => window.open("https://x.com/shy_black_girl?t=NRh2WbwAmxH7fF5IHeHcOA&s=09", "_blank")}
            >
              Visit Twitter
            </Button>
          </div>

          {/* Email */}
          <div className="bg-black/60 border border-purple-500/20 p-6 rounded-lg shadow-lg flex flex-col items-center justify-center space-y-4">
            <Mail size={48} className="text-african-terracotta" />
            <h3 className="text-2xl font-semibold">Email</h3>
            <a
              href="mailto:amehdivine16@gmail.com"
              className="text-purple-400 hover:text-purple-300 transition-colors duration-300 text-lg"
            >
              amehdivine16@gmail.com
            </a>
            <Button
              className="bg-african-terracotta hover:bg-african-terracotta/90 text-white px-6 py-2 font-medium"
              onClick={() => window.location.href = "mailto:amehdivine16@gmail.com"}
            >
              Send Email
            </Button>
          </div>

          {/* WhatsApp */}
          <div className="bg-black/60 border border-purple-500/20 p-6 rounded-lg shadow-lg flex flex-col items-center justify-center space-y-4">
            <MessageCircle size={48} className="text-african-terracotta" />
            <h3 className="text-2xl font-semibold">WhatsApp</h3>
            <a
              href="https://wa.me/2348066649043"
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-400 hover:text-purple-300 transition-colors duration-300 text-lg"
            >
              +234 806 664 9043
            </a>
            <Button
              className="bg-african-terracotta hover:bg-african-terracotta/90 text-white px-6 py-2 font-medium"
              onClick={() => window.open("https://wa.me/2348066649043", "_blank")}
            >
              Message on WhatsApp
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
