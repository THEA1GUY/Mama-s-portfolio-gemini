"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft, X } from "lucide-react"
import Link from "next/link"
import { default as NextImage } from "next/image"
import { GalleryFrame } from "@/components/gallery-frame"
import { getWorks } from "@/app/venus/works/actions" // Import getWorks action
import { useToast } from "@/hooks/use-toast"
import { Loader2, PlusCircle, Edit, Trash2, Star, FileText } from "lucide-react" // Import Loader2 component

// Define a type for the work data fetched from Supabase
interface Work {
  id: string
  title: string
  category: string
  image_url: string | null
  description: string | null
  created_at: string
  updated_at: string
  image_width: number | null
  image_height: number | null
  is_favorite: boolean | null
  type: "image" | "video" | "document" // New: type of work
  video_url: string | null // New: video URL
  document_url: string | null | undefined // New: document URL
  thumbnail_url: string | null | undefined // New: thumbnail URL
}

export default function WorksPage() {
  const [activeCategory, setActiveCategory] = useState("All")
  const [selectedImage, setSelectedImage] = useState<Work | null>(null)
  const [selectedVideo, setSelectedVideo] = useState<Work | null>(null) // New state for selected video
  const [allWorks, setAllWorks] = useState<Work[]>([]) // State to hold all fetched works
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  // Helper function to extract YouTube video ID
  const getYouTubeVideoId = (url: string) => {
    let videoId = null
    const youtubeRegex = /(?:https?:\/\/)?(?:www\.)?(?:m\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=|embed\/|v\/|)([^&?#\n]*)/i
    const match = url.match(youtubeRegex)
    if (match && match[1]) {
      videoId = match[1]
    }
    return videoId
  }

  const categories = ["All", "Photography", "Videography", "Written Works"]

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
      ? allWorks.filter((work) => (work.type === "image" && work.image_url) || (work.type === "video" && work.video_url) || (work.type === "document" && work.document_url))
      : allWorks.filter(
          (work) =>
            work.category === activeCategory &&
            ((work.type === "image" && work.image_url) || (work.type === "video" && work.video_url) || (work.type === "document" && work.document_url)),
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
                onClick={() => {
                  if (work.type === "image") {
                    setSelectedImage(work)
                  } else if (work.type === "video") {
                    setSelectedVideo(work)
                  }
                }} // Open lightbox on click
              >
                {work.type === "image" && work.image_url ? (
                  <GalleryFrame
                    src={work.image_url || ''} // Pass undefined if null, GalleryFrame will use its fallback
                    alt={work.title}
                    width={work.image_width || 600} // Use dynamic width, fallback to 600
                    height={work.image_height || 400} // Use dynamic height, fallback to 400
                    className="w-full h-auto object-contain transition-transform duration-300 group-hover:scale-105" // h-auto to allow dynamic height
                    frameClassName="w-full h-auto" // h-auto for the frame wrapper
                  />
                ) : work.type === "video" && work.video_url ? (
                  <div className="relative w-full h-0 pb-[56.25%] bg-black rounded-lg overflow-hidden">
                    <NextImage
                      src={`https://img.youtube.com/vi/${getYouTubeVideoId(work.video_url)}/hqdefault.jpg`}
                      alt="YouTube Thumbnail"
                      layout="fill"
                      objectFit="cover"
                      className="rounded-lg"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <svg
                        width="68" height="48" viewBox="0 0 68 48"
                        className="fill-current text-white opacity-80 group-hover:opacity-100 transition-opacity"
                      >
                        <path d="M66.52 7.74c-.78-2.93-2.49-5.41-5.42-6.19C55.79.13 34 0 34 0S12.21.13 6.9 1.55c-2.93.78-4.64 3.26-5.42 6.19C.13 13.24 0 24 0 24s.13 10.76 1.55 16.26c.78 2.93 2.49 5.41 5.42 6.19C12.21 47.87 34 48 34 48s21.79-.13 27.1-1.55c2.93-.78 4.64-3.26 5.42-6.19C67.87 34.76 68 24 68 24s-.13-10.76-1.55-16.26z"></path>
                        <path d="M45 24 27 14v20z" fill="#fff"></path>
                      </svg>
                    </div>
                  </div>
                ) : work.type === "document" && work.document_url ? (
                  <div className="relative w-full h-0 pb-[56.25%] bg-gray-800 rounded-lg flex items-center justify-center text-gray-400 text-sm">
                    <a href={work.document_url} target="_blank" rel="noopener noreferrer" className="text-center p-4">
                      <FileText className="w-12 h-12 mx-auto mb-2" />
                      <p>View Document</p>
                    </a>
                  </div>
                ) : (
                  <div className="w-full h-48 bg-gray-700 rounded-lg flex items-center justify-center text-gray-400 text-sm">
                    No Media
                  </div>
                )}
                <div className="absolute inset-0 bg-african-terracotta/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-8">
                  <div className="text-center space-y-2">
                    <h3 className="text-xl font-medium">{work.title}</h3>
                    <p className="text-sm text-gray-200">{work.category}</p>
                    {work.type === "image" && (
                      <Button className="bg-white text-black hover:bg-gray-200 mt-2">View Details</Button>
                    )}
                    {work.type === "document" && (
                      <Link href={work.document_url || "#"} target="_blank" rel="noopener noreferrer">
                        <Button className="bg-white text-black hover:bg-gray-200 mt-2">View Document</Button>
                      </Link>
                    )}
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
          <div className="relative max-w-5xl max-h-[90vh] w-full h-full flex flex-col lg:flex-row items-center lg:items-start justify-center gap-4 p-4 bg-black rounded-lg shadow-lg">
            <Button
              variant="ghost"
              className="absolute top-4 right-4 text-white hover:bg-white/20 z-10"
              onClick={() => setSelectedImage(null)}
            >
              <X size={24} />
            </Button>
            <div className="relative w-full lg:w-2/3 h-full flex items-center justify-center">
              <NextImage
                src={selectedImage.image_url || "/placeholder.svg"}
                alt={selectedImage.title}
                layout="fill"
                objectFit="contain"
                className="rounded-lg"
              />
            </div>
            <div className="w-full lg:w-1/3 text-white space-y-4 mt-4 lg:mt-0">
              <h3 className="text-3xl font-bold text-african-terracotta">{selectedImage.title}</h3>
              <p className="text-lg text-gray-300">Category: {selectedImage.category}</p>
              <p className="text-gray-400 leading-relaxed">{selectedImage.description || "No description provided."}</p>
            </div>
          </div>
        </div>
      )}

      {/* Video Lightbox Modal */}
      {selectedVideo && (
        <div
          className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4"
          onClick={() => setSelectedVideo(null)} // Close on overlay click
        >
          <div className="relative max-w-5xl max-h-[90vh] w-full h-full flex flex-col lg:flex-row items-center lg:items-start justify-center gap-4 p-4 bg-black rounded-lg shadow-lg">
            <Button
              variant="ghost"
              className="absolute top-4 right-4 text-white hover:bg-white/20 z-10"
              onClick={() => setSelectedVideo(null)}
            >
              <X size={24} />
            </Button>
            <div className="relative w-full lg:w-2/3 h-0 pb-[56.25%] bg-black rounded-lg overflow-hidden">
              <iframe
                className="absolute top-0 left-0 w-full h-full"
                src={`https://www.youtube.com/embed/${getYouTubeVideoId(selectedVideo.video_url!)}?autoplay=1`}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
            <div className="w-full lg:w-1/3 text-white space-y-4 mt-4 lg:mt-0">
              <h3 className="text-3xl font-bold text-african-terracotta">{selectedVideo.title}</h3>
              <p className="text-lg text-gray-300">Category: {selectedVideo.category}</p>
              <p className="text-gray-400 leading-relaxed">{selectedVideo.description || "No description provided."}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
