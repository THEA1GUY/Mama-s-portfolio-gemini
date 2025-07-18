"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft, X } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { GalleryFrame } from "@/components/gallery-frame"
import { getWorks } from "@/app/venus/works/actions" // Import getWorks action
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react" // Import Loader2 component

// Define a type for the work data fetched from Supabase
interface Work {
  id: string
  title: string
  category: string
  image_url: string | null
  description: string | null
  created_at: string
  updated_at: string
  image_width: number | null // Add this
  image_height: number | null // Add this
}

export default function WorksPage() {
  const [activeCategory, setActiveCategory] = useState("All")
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [allWorks, setAllWorks] = useState<Work[]>([]) // State to hold all fetched works
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  const categories = ["All", "Photography", "Digital Art", "Cultural Documentation", "Mixed Media", "Fine Art"]

  useEffect(() => {
    const fetchInitialWorks = async () => {
      setLoading(true)
      const result = await getWorks()
      if (result.success && result.data) {
        setAllWorks(result.data)
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to fetch works.",
          variant: "destructive",
        })
      }
      setLoading(false)
    }
    fetchInitialWorks()
  }, [])

  const filteredWorks =
    activeCategory === "All"
      ? allWorks.filter((work) => work.image_url && work.image_width && work.image_height) // Only show works with images and dimensions
      : allWorks.filter(
          (work) => work.category === activeCategory && work.image_url && work.image_width && work.image_height,
        )

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
        <div className="text-center mb-16">
          <h1 className="text-5xl lg:text-6xl font-bold mb-6">My Works</h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Explore a curated collection of my art, photography, and spiritual designs, categorized for your journey.
          </p>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
            <Button
              key={category}
              variant={activeCategory === category ? "default" : "outline"}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                activeCategory === category
                  ? "bg-african-terracotta text-white hover:bg-african-terracotta/90"
                  : "border-african-ochre text-african-ochre hover:bg-african-ochre hover:text-black bg-transparent"
              }`}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Works Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full flex justify-center items-center h-40">
              <Loader2 className="h-8 w-8 animate-spin text-purple-400" />
            </div>
          ) : filteredWorks.length > 0 ? (
            filteredWorks.map((work, index) => (
              <div
                key={work.id}
                className="group relative overflow-hidden rounded-lg cursor-pointer"
                onClick={() => setSelectedImage(work.image_url)} // Open lightbox on click
              >
                <GalleryFrame
                  src={work.image_url || undefined} // Pass undefined if null, GalleryFrame will use its fallback
                  alt={work.title}
                  width={work.image_width || 600} // Use dynamic width, fallback to 600
                  height={work.image_height || 400} // Use dynamic height, fallback to 400
                  className="w-full h-auto object-contain transition-transform duration-300 group-hover:scale-105" // h-auto to allow dynamic height
                  frameClassName="w-full h-auto" // h-auto for the frame wrapper
                />
                <div className="absolute inset-0 bg-african-terracotta/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-8">
                  <div className="text-center space-y-2">
                    <h3 className="text-xl font-medium">{work.title}</h3>
                    <p className="text-sm text-gray-200">{work.category}</p>
                    <Button className="bg-white text-black hover:bg-gray-200 mt-2">View Details</Button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="col-span-full text-center text-gray-500">No works with images found in this category.</p>
          )}
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)} // Close on overlay click
        >
          <div className="relative max-w-4xl max-h-[90vh] w-full h-full flex items-center justify-center">
            <Button
              variant="ghost"
              className="absolute top-4 right-4 text-white hover:bg-white/20"
              onClick={() => setSelectedImage(null)}
            >
              <X size={24} />
            </Button>
            <Image
              src={selectedImage || "/placeholder.svg"}
              alt="Selected Work"
              layout="fill"
              objectFit="contain"
              className="rounded-lg"
            />
          </div>
        </div>
      )}
    </div>
  )
}
