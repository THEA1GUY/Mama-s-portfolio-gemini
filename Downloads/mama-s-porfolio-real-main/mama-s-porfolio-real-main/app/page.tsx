import type React from "react"
import { Button } from "@/components/ui/button"
import { Menu, X, Star } from "lucide-react"
import PortfolioSection from "@/app/components/PortfolioSection"
import TestimonialsSection from "@/app/components/TestimonialsSection"

export default function AfricanCelestialSite() {
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
                className={`text-sm font-medium tracking-wide transition-all duration-300 relative `}
              >
                {item}
              </a>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden text-purple-400">
            <Menu size={24} />
          </button>
        </div>
      </nav>

      {/* Hero Section (Simplified) */}
      <section id="hero" className="pt-24 pb-20 px-6 text-center">
        <div
          className={`max-w-4xl mx-auto space-y-8 transition-all duration-1000 `}
        >
          <h1 className="text-5xl lg:text-6xl font-bold leading-tight">Divine Ameh</h1>
          <p className="text-gray-300 text-lg leading-relaxed max-w-lg mx-auto">
            A visionary artist bridging ancient African wisdom with contemporary celestial beauty.
          </p>
          <Button
            className="bg-african-terracotta hover:bg-african-terracotta/90 text-white px-8 py-3 font-medium"
          >
            Learn More About Me
          </Button>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="my-works" className="py-20 px-6 bg-gradient-to-br from-purple-900/20 to-black">
        <div className="max-w-7xl mx-auto">
          <h2
            className={`text-4xl lg:text-5xl font-bold text-center mb-16 transition-all duration-1000 `}
          >
            What clients say
          </h2>

          <TestimonialsSection />
        </div>
      </section>

      {/* Portfolio Gallery */}
      <PortfolioSection />

    </div>
  )
}
