"use client"

import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { GalleryFrame } from "@/components/gallery-frame"
import { useInView } from "@/hooks/use-in-view"

export default function AboutPage() {
  const [aboutHeaderRef, aboutHeaderInView] = useInView()
  const [artistStatementTextRef, artistStatementTextInView] = useInView()
  const [portraitRef, portraitInView] = useInView()
  const [journeyRef, journeyInView] = useInView()
  const [philosophyRef, philosophyInView] = useInView()
  const [ctaRef, ctaInView] = useInView()

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
          ref={aboutHeaderRef}
          className={`text-center mb-16 transition-all duration-1000 ${aboutHeaderInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
        >
          <p className="text-purple-400 text-sm font-medium mb-4">ABOUT ME</p>
          <h1 className="text-5xl lg:text-6xl font-bold mb-6">My Journey & Vision</h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Discover the story behind Divine Ameh, a visionary artist bridging ancient African wisdom with contemporary
            celestial beauty.
          </p>
        </div>

        <section id="artist-statement" className="py-16 grid md:grid-cols-2 gap-12 items-center">
          <div
            ref={artistStatementTextRef}
            className={`order-2 md:order-1 transition-all duration-1000 ${artistStatementTextInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
          >
            <h2 className="text-4xl font-bold mb-6 text-african-terracotta">Artist Statement</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              My art is a dialogue between the ancestral and the ethereal, a celebration of African heritage infused
              with the boundless wonder of the cosmos. I believe in the power of visual storytelling to connect us to
              our roots and inspire us to reach for new horizons. Each piece is an invitation to explore identity,
              spirituality, and the infinite possibilities of Afrofuturism.
            </p>
            <p className="text-gray-300 leading-relaxed">
              Through my work, I aim to honor the resilience and beauty of African cultures while envisioning a future
              where our narratives are central to the universal tapestry.
            </p>
          </div>
          <div
            ref={portraitRef}
            className={`order-1 md:order-2 relative w-full h-auto overflow-hidden transition-all duration-1000 delay-200 ${portraitInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
          >
            <GalleryFrame
              src="/images/divine-ameh-portrait.png"
              alt="Divine Ameh Portrait"
              width={600} // Assuming this is the actual width of the portrait image
              height={400} // Assuming this is the actual height of the portrait image
              className="w-full h-auto object-contain" // h-auto to allow dynamic height
              frameClassName="w-full h-auto" // h-auto for the frame wrapper
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/30 text-white text-lg font-medium">
              Artist Portrait
            </div>
          </div>
        </section>

        <section
          id="journey"
          ref={journeyRef}
          className={`py-16 transition-all duration-1000 delay-200 ${journeyInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
        >
          <h2 className="text-4xl font-bold mb-6 text-center text-african-terracotta">My Artistic Journey</h2>
          <div className="text-gray-300 leading-relaxed max-w-3xl mx-auto space-y-4">
            <p>
              My journey into art began with a deep fascination for the intricate patterns of traditional African
              textiles and the vast, star-filled skies of my childhood. These early inspirations laid the groundwork for
              a unique artistic voice that seeks to harmonize the earthly with the cosmic.
            </p>
            <p>
              I formally trained in fine arts, but my true education came from immersing myself in cultural studies and
              exploring various digital and mixed media techniques. This blend allowed me to develop a style that is
              both deeply rooted in heritage and boldly forward-looking.
            </p>
            <p>
              Over the years, I've had the privilege of exhibiting my work in galleries worldwide, collaborating with
              diverse clients, and contributing to projects that celebrate cultural identity and inspire spiritual
              growth. Each experience has shaped my perspective and deepened my commitment to creating art that
              resonates on multiple levels.
            </p>
          </div>
        </section>

        <section
          id="philosophy"
          ref={philosophyRef}
          className={`py-16 transition-all duration-1000 delay-400 ${philosophyInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
        >
          <h2 className="text-4xl font-bold mb-6 text-center text-african-terracotta">Philosophy & Inspirations</h2>
          <div className="text-gray-300 leading-relaxed max-w-3xl mx-auto space-y-4">
            <p>
              My artistic philosophy is centered on the concept of "African Venusianism" – a fusion of ancient African
              wisdom, matriarchal strength, and the celestial beauty of the cosmos. I draw inspiration from:
            </p>
            <ul className="list-disc list-inside text-gray-400 space-y-2 pl-4">
              <li>
                **Traditional African Symbolism**: The rich iconography, patterns, and narratives of various African
                cultures.
              </li>
              <li>
                **Astronomy & Cosmology**: The mysteries of the universe, stars, galaxies, and celestial phenomena.
              </li>
              <li>
                **Afrofuturism**: The cultural aesthetic that combines elements of science fiction, fantasy, and history
                with Black culture.
              </li>
              <li>
                **Spirituality & Metaphysics**: Concepts of energy, consciousness, and the interconnectedness of all
                things.
              </li>
              <li>**Nature**: The organic forms, vibrant colors, and inherent balance found in the natural world.</li>
            </ul>
            <p>
              I believe art should not only be visually appealing but also evoke emotion, spark thought, and foster a
              deeper connection to oneself and the world.
            </p>
          </div>
        </section>

        {/* Call to Action - Re-use from Services page, but link to contact */}
        <section
          ref={ctaRef}
          className={`py-16 text-center transition-all duration-1000 delay-600 ${ctaInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
        >
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">Ready to Collaborate?</h2>
          <p className="text-gray-400 max-w-2xl mx-auto mb-8">
            If my vision resonates with yours, I'd love to discuss how we can create something truly divine together.
          </p>
          <Link href="/contact">
            <Button className="bg-african-terracotta hover:bg-african-terracotta/90 text-white px-10 py-4 text-lg font-medium">
              Get in Touch
            </Button>
          </Link>
        </section>
      </div>
    </div>
  )
}
