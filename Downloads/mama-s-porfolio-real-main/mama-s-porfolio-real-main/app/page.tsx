"use client"

import type React from "react"
import { useState, useEffect, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Star, Menu, X } from "lucide-react"
import { useRouter } from "next/navigation"
import { useInView } from "@/hooks/use-in-view"
import { GalleryFrame } from "@/components/gallery-frame"
import { getWorks } from "@/app/venus/works/actions" // Import getWorks action

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
  is_favorite: boolean | null // Add this
}

export default function AfricanCelestialSite() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState(0)
  const router = useRouter()
  const [portfolioWorks, setPortfolioWorks] = useState<Work[]>([]) // State to hold fetched works

  // Refs for sections to link with navigation and observe for active state
  const heroSectionRef = useRef<HTMLElement>(null)
  const worksRef = useRef<HTMLElement>(null)

  const sectionRefs = [heroSectionRef, worksRef]
  const sectionIds = ["hero", "my-works"]

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight / 2

      sectionRefs.forEach((ref, index) => {
        if (ref.current) {
          const sectionTop = ref.current.offsetTop
          const sectionHeight = ref.current.offsetHeight

          if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            setActiveSection(index)
          }
        }
      })
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Fetch works on component mount
  useEffect(() => {
    const fetchInitialWorks = async () => {
      const result = await getWorks(true) // Fetch only favorite works
      if (result.success && result.data) {
        // Filter to only show works with an image_url and dimensions, limit to 6 for the homepage
        const filteredWorks = result.data.filter((work) => work.image_url && work.image_width && work.image_height).slice(0, 6)
        setPortfolioWorks(filteredWorks)
        console.log("Home Page: Fetched and filtered portfolio works:", filteredWorks) // ADDED LOG
      }
    }
    fetchInitialWorks()
  }, [])

  // Reveal animation hooks for various elements
  const [heroContentRef, heroContentInView] = useInView()
  const [testimonialsHeaderRef, testimonialsHeaderInView] = useInView()
  const [testimonialCard1Ref, testimonialCard1InView] = useInView()
  const [testimonialCard2Ref, testimonialCard2InView] = useInView()
  const [testimonialCard3Ref, testimonialCard3InView] = useInView()
  const [portfolioHeaderRef, portfolioHeaderInView] = useInView()

  // --- Refactored Portfolio Item Animation Logic ---
  const portfolioItemRefs = useRef(new Map<number, HTMLElement>())
  const [portfolioItemInViewMap, setPortfolioItemInViewMap] = useState(new Map<number, boolean>())

  const setPortfolioRef = useCallback((node: HTMLElement | null, index: number) => {
    if (node) {
      portfolioItemRefs.current.set(index, node)
    } else {
      portfolioItemRefs.current.delete(index)
    }
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = Number(entry.target.getAttribute("data-index"))
          setPortfolioItemInViewMap((prev) => {
            const newMap = new Map(prev)
            if (entry.isIntersecting) {
              newMap.set(index, true)
              observer.unobserve(entry.target)
            }
            return newMap
          })
        })
      },
      { threshold: 0.1 },
    )

    portfolioItemRefs.current.forEach((node) => observer.observe(node))

    return () => {
      portfolioItemRefs.current.forEach((node) => observer.unobserve(node))
    }
  }, [])
  // --- End Refactored Portfolio Item Animation Logic ---

  const handleNavigation = (path: string) => (e: React.MouseEvent) => {
    e.preventDefault()
    setIsMenuOpen(false)
    router.push(path)
  }

  return (
    <div className="min-h-screen bg-black text-white relative">
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

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-black/90 backdrop-blur-sm border-b border-purple-500/20">
        <div className="max-w-7xl mx-auto flex items-center justify-between p-6">
          <div className="flex items-center space-x-3">
            <span className="text-xl font-bold tracking-wider">DIVINE AMEH</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {["About Me", "My Works", "Services", "Contact"].map((item) => (
              <a
                key={item}
                href={
                  item === "About Me"
                    ? "/about"
                    : item === "My Works"
                      ? "/works"
                      : item === "Services"
                        ? "/services"
                        : "/contact"
                }
                className={`text-sm font-medium tracking-wide transition-all duration-300 relative ${
                  router.pathname === `/${item.toLowerCase().replace(" ", "-")}`
                    ? "text-purple-400"
                    : "text-gray-300 hover:text-purple-400"
                }`}
                onClick={handleNavigation(
                  item === "About Me"
                    ? "/about"
                    : item === "My Works"
                      ? "/works"
                      : item === "Services"
                        ? "/services"
                        : "/contact",
                )}
              >
                {item}
                {router.pathname === `/${item.toLowerCase().replace(" ", "-")}` && (
                  <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-purple-400"></span>
                )}
              </a>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden text-purple-400" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-40 bg-black/95 backdrop-blur-sm md:hidden">
          <div className="flex flex-col items-center justify-center h-full space-y-8">
            {["About Me", "My Works", "Services", "Contact"].map((item) => (
              <a
                key={item}
                href={
                  item === "About Me"
                    ? "/about"
                    : item === "My Works"
                      ? "/works"
                      : item === "Services"
                        ? "/services"
                        : "/contact"
                }
                className="text-xl font-medium text-purple-400"
                onClick={handleNavigation(
                  item === "About Me"
                    ? "/about"
                    : item === "My Works"
                      ? "/works"
                      : item === "Services"
                        ? "/services"
                        : "/contact",
                )}
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Hero Section (Simplified) */}
      <section id="hero" ref={heroSectionRef} className="pt-24 pb-20 px-6 text-center">
        <div
          ref={heroContentRef}
          className={`max-w-4xl mx-auto space-y-8 transition-all duration-1000 ${heroContentInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
        >
          <h1 className="text-5xl lg:text-6xl font-bold leading-tight">Divine Ameh</h1>
          <p className="text-gray-300 text-lg leading-relaxed max-w-lg mx-auto">
            A visionary artist bridging ancient African wisdom with contemporary celestial beauty.
          </p>
          <Button
            className="bg-african-terracotta hover:bg-african-terracotta/90 text-white px-8 py-3 font-medium"
            onClick={handleNavigation("/about")}
          >
            Learn More About Me
          </Button>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="my-works" ref={worksRef} className="py-20 px-6 bg-gradient-to-br from-purple-900/20 to-black">
        <div className="max-w-7xl mx-auto">
          <h2
            ref={testimonialsHeaderRef}
            className={`text-4xl lg:text-5xl font-bold text-center mb-16 transition-all duration-1000 ${testimonialsHeaderInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
          >
            What clients say
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Kemi Adebayo",
                role: "Cultural Center Director",
                rating: 5,
                text: "Divine's work beautifully captures the essence of our African heritage while bringing a fresh, contemporary perspective. Her celestial African aesthetic is truly unique.",
                avatar: "KA",
                ref: testimonialCard1Ref,
                inView: testimonialCard1InView,
                delay: 0,
              },
              {
                name: "Marcus Johnson",
                role: "Gallery Owner",
                text: "Working with Divine was an incredible experience. Her ability to blend traditional African elements with futuristic concepts created something truly magical for our exhibition.",
                rating: 5,
                avatar: "MJ",
                ref: testimonialCard2Ref,
                inView: testimonialCard2InView,
                delay: 200,
              },
              {
                name: "Fatima Al-Rashid",
                role: "Brand Creative Director",
                text: "Divine's spiritual design work transformed our brand identity. The way she incorporates sacred geometry and celestial themes while honoring African traditions is masterful.",
                rating: 5,
                avatar: "FR",
                ref: testimonialCard3Ref,
                inView: testimonialCard3InView,
                delay: 400,
              },
            ].map((testimonial, index) => (
              <Card
                key={index}
                ref={testimonial.ref}
                className={`bg-black/60 border-purple-500/20 p-6 transition-all duration-1000 ${testimonial.inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
                style={{ transitionDelay: `${testimonial.delay}ms` }}
              >
                <div className="space-y-4">
                  <div className="flex text-african-ochre">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-300 leading-relaxed">"{testimonial.text}"</p>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-african-terracotta rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <p className="font-medium">{testimonial.name}</p>
                      <p className="text-sm text-gray-400">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio Gallery */}
      <section id="portfolio" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div
            ref={portfolioHeaderRef}
            className={`text-center mb-16 transition-all duration-1000 ${portfolioHeaderInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
          >
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">My favorite works</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              A curated collection of my most powerful pieces, showcasing the intersection of African heritage and
              celestial beauty.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-2 gap-4">
            {portfolioWorks.length > 0 ? (
              portfolioWorks.map((work, index) => (
                <div
                  key={work.id} // Use work.id as key
                  data-index={index}
                  ref={(node) => setPortfolioRef(node, index)}
                  // Removed aspect-square, now height will be determined by image aspect ratio
                  className={`group relative overflow-hidden rounded-lg transition-all duration-1000 opacity-100 ${portfolioItemInViewMap.get(index) ? "translate-y-0" : "translate-y-10"}`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <GalleryFrame
                    src={work.image_url || undefined} // Pass undefined if null, GalleryFrame will use its fallback
                    alt={work.title}
                    width={work.image_width || 300} // Use dynamic width, fallback to 300
                    height={work.image_height || 300} // Use dynamic height, fallback to 300
                    className="w-full h-auto object-contain transition-transform duration-300 group-hover:scale-105" // h-auto to allow dynamic height
                    frameClassName="w-full h-auto" // h-auto for the frame wrapper
                  />
                  <div className="absolute inset-0 bg-african-terracotta/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-8">
                    <div className="text-center space-y-2">
                      <p className="text-sm font-medium">{work.title}</p>
                      <p className="text-xs text-gray-200">{work.category}</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="col-span-full text-center text-gray-500">No works with images found.</p>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
