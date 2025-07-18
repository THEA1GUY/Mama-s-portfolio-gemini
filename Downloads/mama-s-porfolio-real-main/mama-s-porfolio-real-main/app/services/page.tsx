"use client"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Sparkles, Gem, Lightbulb } from "lucide-react"
import Link from "next/link"
import { useInView } from "@/hooks/use-in-view"
import { GalleryFrame } from "@/components/gallery-frame"

export default function ServicesPage() {
  const [servicesHeaderRef, servicesHeaderInView] = useInView()
  const [culturalPhotographyRef, culturalPhotographyInView] = useInView()
  const [afrofuturisticArtRef, afrofuturisticArtInView] = useInView()
  const [spiritualDesignRef, spiritualDesignInView] = useInView()
  const [whyChooseMeRef, whyChooseMeInView] = useInView()
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
          ref={servicesHeaderRef}
          className={`text-center mb-16 transition-all duration-1000 ${servicesHeaderInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
        >
          <p className="text-purple-400 text-sm font-medium mb-4">MY SERVICES</p>
          <h1 className="text-5xl lg:text-6xl font-bold mb-6">What can I do</h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Offering a spectrum of creative services that blend ancient African wisdom with contemporary celestial
            aesthetics, creating powerful visual narratives rooted in our heritage.
          </p>
        </div>

        {/* Cultural Photography Section */}
        <section
          id="cultural-photography"
          ref={culturalPhotographyRef}
          className={`py-16 transition-all duration-1000 ${culturalPhotographyInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
        >
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <h2 className="text-4xl font-bold mb-6 text-african-terracotta">Cultural Photography</h2>
              <p className="text-gray-300 leading-relaxed mb-6">
                My cultural photography service is dedicated to preserving and celebrating the rich tapestry of African
                heritage. I specialize in capturing authentic moments from traditional ceremonies, community events, and
                intimate family gatherings. Each photograph is a narrative, honoring ancestral wisdom and the vibrant
                spirit of our people.
              </p>
              <ul className="list-disc list-inside text-gray-400 space-y-2 mb-6">
                <li>Documentary-style event coverage</li>
                <li>Traditional portrait sessions</li>
                <li>Community and cultural festival photography</li>
                <li>High-resolution digital images</li>
                <li>Optional print packages and albums</li>
              </ul>
              <Link href="/works">
                <Button
                  variant="outline"
                  className="border-african-ochre text-african-ochre hover:bg-african-ochre hover:text-black px-8 py-3 font-medium bg-transparent"
                >
                  View Photography Portfolio
                </Button>
              </Link>
            </div>
            <div className="order-1 md:order-2 relative w-full h-auto overflow-hidden">
              <GalleryFrame
                src={undefined}
                alt="Cultural Photography"
                width={600} // Fallback width
                height={400} // Fallback height
                className="w-full h-auto object-contain" // h-auto to allow dynamic height
                frameClassName="w-full h-auto" // h-auto for the frame wrapper
              />
            </div>
          </div>
        </section>

        {/* Afrofuturistic Art Section */}
        <section
          id="afrofuturistic-art"
          ref={afrofuturisticArtRef}
          className={`py-16 transition-all duration-1000 delay-200 ${afrofuturisticArtInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
        >
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative w-full h-auto overflow-hidden">
              <GalleryFrame
                src={undefined}
                alt="Afrofuturistic Art"
                width={600} // Fallback width
                height={400} // Fallback height
                className="w-full h-auto object-contain" // h-auto to allow dynamic height
                frameClassName="w-full h-auto" // h-auto for the frame wrapper
              />
            </div>
            <div>
              <h2 className="text-4xl font-bold mb-6 text-african-terracotta">Afrofuturistic Art</h2>
              <p className="text-gray-300 leading-relaxed mb-6">
                Elevate your brand or personal space with stunning Afrofuturistic visuals. I create art that bridges
                ancient African wisdom with future visions, exploring themes of technology, spirituality, and
                liberation. Perfect for modern brands seeking authentic cultural expression and individuals desiring
                unique, thought-provoking pieces.
              </p>
              <ul className="list-disc list-inside text-gray-400 space-y-2 mb-6">
                <li>Digital illustrations and concept art</li>
                <li>Album art and book covers</li>
                <li>Brand identity and visual development</li>
                <li>Custom commissions for personal collections</li>
                <li>High-resolution digital files for various uses</li>
              </ul>
              <Button
                variant="outline"
                className="border-african-ochre text-african-ochre hover:bg-african-ochre hover:text-black px-8 py-3 font-medium bg-transparent"
              >
                Explore Digital Art
              </Button>
            </div>
          </div>
        </section>

        {/* Spiritual Design Section */}
        <section
          id="spiritual-design"
          ref={spiritualDesignRef}
          className={`py-16 transition-all duration-1000 delay-400 ${spiritualDesignInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
        >
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <h2 className="text-4xl font-bold mb-6 text-african-terracotta">Spiritual Design</h2>
              <p className="text-gray-300 leading-relaxed mb-6">
                Transform your ideas into captivating visual stories that connect the earthly with the divine. My
                spiritual design work incorporates sacred geometry, celestial themes, and ancient symbols to create
                meaningful and resonant visual experiences for personal or commercial projects.
              </p>
              <ul className="list-disc list-inside text-gray-400 space-y-2 mb-6">
                <li>Symbolic logo and brand mark creation</li>
                <li>Sacred geometry patterns and illustrations</li>
                <li>Meditation and spiritual guide visuals</li>
                <li>Event and retreat branding</li>
                <li>Visual storytelling for spiritual practices</li>
              </ul>
              <Button
                variant="outline"
                className="border-african-ochre text-african-ochre hover:bg-african-ochre hover:text-black px-8 py-3 font-medium bg-transparent"
              >
                Discover Spiritual Designs
              </Button>
            </div>
            <div className="order-1 md:order-2 relative w-full h-auto overflow-hidden">
              <GalleryFrame
                src={undefined}
                alt="Spiritual Design"
                width={600} // Fallback width
                height={400} // Fallback height
                className="w-full h-auto object-contain" // h-auto to allow dynamic height
                frameClassName="w-full h-auto" // h-auto for the frame wrapper
              />
            </div>
          </div>
        </section>

        {/* Why Choose Me Section */}
        <section
          id="why-choose-me"
          ref={whyChooseMeRef}
          className={`py-16 text-center transition-all duration-1000 delay-600 ${whyChooseMeInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
        >
          <h2 className="text-4xl lg:text-5xl font-bold mb-8">Why Choose Divine Ameh?</h2>
          <p className="text-gray-400 max-w-3xl mx-auto mb-12">
            My work is more than just art; it's a journey into the soul of African heritage fused with the boundless
            possibilities of the cosmos. I bring a unique perspective, deep cultural understanding, and a commitment to
            excellence to every project.
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-black/60 border-purple-500/20 p-6">
              <div className="space-y-4">
                <Sparkles className="w-12 h-12 text-african-ochre mx-auto" />
                <h3 className="text-xl font-bold text-african-ochre">Unique Vision</h3>
                <p className="text-gray-300">A distinctive blend of African and celestial aesthetics.</p>
              </div>
            </Card>
            <Card className="bg-black/60 border-purple-500/20 p-6">
              <div className="space-y-4">
                <Gem className="w-12 h-12 text-african-ochre mx-auto" />
                <h3 className="text-xl font-bold text-african-ochre">Cultural Authenticity</h3>
                <p className="text-gray-300">Deep respect and accurate representation of heritage.</p>
              </div>
            </Card>
            <Card className="bg-black/60 border-purple-500/20 p-6">
              <div className="space-y-4">
                <Lightbulb className="w-12 h-12 text-african-ochre mx-auto" />
                <h3 className="text-xl font-bold text-african-ochre">Collaborative Process</h3>
                <p className="text-gray-300">Working closely with clients to bring their vision to life.</p>
              </div>
            </Card>
          </div>
        </section>

        {/* Call to Action */}
        <section
          id="contact-cta"
          ref={ctaRef}
          className={`py-16 text-center transition-all duration-1000 delay-800 ${ctaInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
        >
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">Ready to Create Something Divine?</h2>
          <p className="text-gray-400 max-w-2xl mx-auto mb-8">
            Whether you have a specific project in mind or just want to explore possibilities, I'd love to hear from
            you. Let's connect and bring your vision to life.
          </p>
          <Link href="/contact">
            {" "}
            <Button className="bg-african-terracotta hover:bg-african-terracotta/90 text-white px-10 py-4 text-lg font-medium">
              Get in Touch
            </Button>
          </Link>
        </section>
      </div>
    </div>
  )
}
