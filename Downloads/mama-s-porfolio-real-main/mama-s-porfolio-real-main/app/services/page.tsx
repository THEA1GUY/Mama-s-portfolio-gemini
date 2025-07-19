"use client"
import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Sparkles, Gem, Lightbulb } from "lucide-react"
import Link from "next/link"
import { useInView } from "@/hooks/use-in-view"
import { GalleryFrame } from "@/components/gallery-frame"
import { getContentSettings } from "@/app/venus/settings/actions"

interface ContentSetting {
  id: string
  created_at: string
  key: string
  value_text: string | null
  value_image_url: string | null
  value_image_width: number | null
  value_image_height: number | null
}

export default function ServicesPage() {
  const [servicesHeaderRef, servicesHeaderInView] = useInView()
  const [culturalPhotographyRef, culturalPhotographyInView] = useInView()
  const [afrofuturisticArtRef, afrofuturisticArtInView] = useInView()
  const [spiritualDesignRef, spiritualDesignInView] = useInView()
  const [whyChooseMeRef, whyChooseMeInView] = useInView()
  const [ctaRef, ctaInView] = useInView()

  const [contentSettings, setContentSettings] = useState<Record<string, ContentSetting>>({}) // State to hold settings

  useEffect(() => {
    const fetchPageContent = async () => {
      const result = await getContentSettings()
      if (result.success && result.data) {
        const settingsMap: Record<string, ContentSetting> = {}
        result.data.forEach((setting) => {
          settingsMap[setting.key] = setting
        })
        setContentSettings(settingsMap)
      }
    }
    fetchPageContent()
  }, [])

  const servicesWhatCanIDoHeading = contentSettings["services_what_can_i_do_heading"]
  const servicesWhatCanIDoParagraph = contentSettings["services_what_can_i_do_paragraph"]
  const servicesCulturalPhotographyImage = contentSettings["services_cultural_photography_image"]
  const servicesCulturalPhotographyHeading = contentSettings["services_cultural_photography_heading"]
  const servicesCulturalPhotographyParagraph = contentSettings["services_cultural_photography_paragraph"]
  const servicesCulturalPhotographyListItem1 = contentSettings["services_cultural_photography_list_item1"]
  const servicesCulturalPhotographyListItem2 = contentSettings["services_cultural_photography_list_item2"]
  const servicesCulturalPhotographyListItem3 = contentSettings["services_cultural_photography_list_item3"]
  const servicesCulturalPhotographyListItem4 = contentSettings["services_cultural_photography_list_item4"]
  const servicesCulturalPhotographyListItem5 = contentSettings["services_cultural_photography_list_item5"]
  const servicesAfrofuturisticArtImage = contentSettings["services_afrofuturistic_art_image"]
  const servicesAfrofuturisticArtHeading = contentSettings["services_afrofuturistic_art_heading"]
  const servicesAfrofuturisticArtParagraph = contentSettings["services_afrofuturistic_art_paragraph"]
  const servicesAfrofuturisticArtListItem1 = contentSettings["services_afrofuturistic_art_list_item1"]
  const servicesAfrofuturisticArtListItem2 = contentSettings["services_afrofuturistic_art_list_item2"]
  const servicesAfrofuturisticArtListItem3 = contentSettings["services_afrofuturistic_art_list_item3"]
  const servicesAfrofuturisticArtListItem4 = contentSettings["services_afrofuturistic_art_list_item4"]
  const servicesAfrofuturisticArtListItem5 = contentSettings["services_afrofuturistic_art_list_item5"]
  const servicesSpiritualDesignImage = contentSettings["services_spiritual_design_image"]
  const servicesSpiritualDesignHeading = contentSettings["services_spiritual_design_heading"]
  const servicesSpiritualDesignParagraph = contentSettings["services_spiritual_design_paragraph"]
  const servicesSpiritualDesignListItem1 = contentSettings["services_spiritual_design_list_item1"]
  const servicesSpiritualDesignListItem2 = contentSettings["services_spiritual_design_list_item2"]
  const servicesSpiritualDesignListItem3 = contentSettings["services_spiritual_design_list_item3"]
  const servicesSpiritualDesignListItem4 = contentSettings["services_spiritual_design_list_item4"]
  const servicesSpiritualDesignListItem5 = contentSettings["services_spiritual_design_list_item5"]
  const servicesWhyChooseMeHeading = contentSettings["services_why_choose_me_heading"]
  const servicesWhyChooseMeParagraph = contentSettings["services_why_choose_me_paragraph"]
  const servicesWhyChooseMeCard1Heading = contentSettings["services_why_choose_me_card1_heading"]
  const servicesWhyChooseMeCard1Paragraph = contentSettings["services_why_choose_me_card1_paragraph"]
  const servicesWhyChooseMeCard2Heading = contentSettings["services_why_choose_me_card2_heading"]
  const servicesWhyChooseMeCard2Paragraph = contentSettings["services_why_choose_me_card2_paragraph"]
  const servicesWhyChooseMeCard3Heading = contentSettings["services_why_choose_me_card3_heading"]
  const servicesWhyChooseMeCard3Paragraph = contentSettings["services_why_choose_me_card3_paragraph"]
  const servicesCtaHeading = contentSettings["services_cta_heading"]
  const servicesCtaParagraph = contentSettings["services_cta_paragraph"]

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
          <h1 className="text-5xl lg:text-6xl font-bold mb-6">{servicesWhatCanIDoHeading?.value_text || "What can I do"}</h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            {servicesWhatCanIDoParagraph?.value_text || "Offering a spectrum of creative services that blend ancient African wisdom with contemporary celestial aesthetics, creating powerful visual narratives rooted in our heritage."}
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
              <h2 className="text-4xl font-bold mb-6 text-african-terracotta">{servicesCulturalPhotographyHeading?.value_text || "Cultural Photography"}</h2>
              <p className="text-gray-300 leading-relaxed mb-6">
                {servicesCulturalPhotographyParagraph?.value_text || "My cultural photography service is dedicated to preserving and celebrating the rich tapestry of African heritage. I specialize in capturing authentic moments from traditional ceremonies, community events, and intimate family gatherings. Each photograph is a narrative, honoring ancestral wisdom and the vibrant spirit of our people."}
              </p>
              <ul className="list-disc list-inside text-gray-400 space-y-2 mb-6">
                <li>{servicesCulturalPhotographyListItem1?.value_text || "Documentary-style event coverage"}</li>
                <li>{servicesCulturalPhotographyListItem2?.value_text || "Traditional portrait sessions"}</li>
                <li>{servicesCulturalPhotographyListItem3?.value_text || "Community and cultural festival photography"}</li>
                <li>{servicesCulturalPhotographyListItem4?.value_text || "High-resolution digital images"}</li>
                <li>{servicesCulturalPhotographyListItem5?.value_text || "Optional print packages and albums"}</li>
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
                src={servicesCulturalPhotographyImage?.value_image_url || undefined}
                alt="Cultural Photography"
                width={servicesCulturalPhotographyImage?.value_image_width || 600}
                height={servicesCulturalPhotographyImage?.value_image_height || 400}
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
                src={servicesAfrofuturisticArtImage?.value_image_url || undefined}
                alt="Afrofuturistic Art"
                width={servicesAfrofuturisticArtImage?.value_image_width || 600}
                height={servicesAfrofuturisticArtImage?.value_image_height || 400}
                className="w-full h-auto object-contain" // h-auto to allow dynamic height
                frameClassName="w-full h-auto" // h-auto for the frame wrapper
              />
            </div>
            <div>
              <h2 className="text-4xl font-bold mb-6 text-african-terracotta">{servicesAfrofuturisticArtHeading?.value_text || "Afrofuturistic Art"}</h2>
              <p className="text-gray-300 leading-relaxed mb-6">
                {servicesAfrofuturisticArtParagraph?.value_text || "Elevate your brand or personal space with stunning Afrofuturistic visuals. I create art that bridges ancient African wisdom with future visions, exploring themes of technology, spirituality, and liberation. Perfect for modern brands seeking authentic cultural expression and individuals desiring unique, thought-provoking pieces."}
              </p>
              <ul className="list-disc list-inside text-gray-400 space-y-2 mb-6">
                <li>{servicesAfrofuturisticArtListItem1?.value_text || "Digital illustrations and concept art"}</li>
                <li>{servicesAfrofuturisticArtListItem2?.value_text || "Album art and book covers"}</li>
                <li>{servicesAfrofuturisticArtListItem3?.value_text || "Brand identity and visual development"}</li>
                <li>{servicesAfrofuturisticArtListItem4?.value_text || "Custom commissions for personal collections"}</li>
                <li>{servicesAfrofuturisticArtListItem5?.value_text || "High-resolution digital files for various uses"}</li>
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
              <h2 className="text-4xl font-bold mb-6 text-african-terracotta">{servicesSpiritualDesignHeading?.value_text || "Spiritual Design"}</h2>
              <p className="text-gray-300 leading-relaxed mb-6">
                {servicesSpiritualDesignParagraph?.value_text || "Transform your ideas into captivating visual stories that connect the earthly with the divine. My spiritual design work incorporates sacred geometry, celestial themes, and ancient symbols to create meaningful and resonant visual experiences for personal or commercial projects."}
              </p>
              <ul className="list-disc list-inside text-gray-400 space-y-2 mb-6">
                <li>{servicesSpiritualDesignListItem1?.value_text || "Symbolic logo and brand mark creation"}</li>
                <li>{servicesSpiritualDesignListItem2?.value_text || "Sacred geometry patterns and illustrations"}</li>
                <li>{servicesSpiritualDesignListItem3?.value_text || "Meditation and spiritual guide visuals"}</li>
                <li>{servicesSpiritualDesignListItem4?.value_text || "Event and retreat branding"}</li>
                <li>{servicesSpiritualDesignListItem5?.value_text || "Visual storytelling for spiritual practices"}</li>
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
                src={servicesSpiritualDesignImage?.value_image_url || undefined}
                alt="Spiritual Design"
                width={servicesSpiritualDesignImage?.value_image_width || 600}
                height={servicesSpiritualDesignImage?.value_image_height || 400}
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
          <h2 className="text-4xl lg:text-5xl font-bold mb-8">{servicesWhyChooseMeHeading?.value_text || "Why Choose Divine Ameh?"}</h2>
          <p className="text-gray-400 max-w-3xl mx-auto mb-12">
            {servicesWhyChooseMeParagraph?.value_text || "My work is more than just art; it's a journey into the soul of African heritage fused with the boundless possibilities of the cosmos. I bring a unique perspective, deep cultural understanding, and a commitment to excellence to every project."}
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-black/60 border-purple-500/20 p-6">
              <div className="space-y-4">
                <Sparkles className="w-12 h-12 text-african-ochre mx-auto" />
                <h3 className="text-xl font-bold text-african-ochre">{servicesWhyChooseMeCard1Heading?.value_text || "Unique Vision"}</h3>
                <p className="text-gray-300">{servicesWhyChooseMeCard1Paragraph?.value_text || "A distinctive blend of African and celestial aesthetics."}</p>
              </div>
            </Card>
            <Card className="bg-black/60 border-purple-500/20 p-6">
              <div className="space-y-4">
                <Gem className="w-12 h-12 text-african-ochre mx-auto" />
                <h3 className="text-xl font-bold text-african-ochre">{servicesWhyChooseMeCard2Heading?.value_text || "Cultural Authenticity"}</h3>
                <p className="text-gray-300">{servicesWhyChooseMeCard2Paragraph?.value_text || "Deep respect and accurate representation of heritage."}</p>
              </div>
            </Card>
            <Card className="bg-black/60 border-purple-500/20 p-6">
              <div className="space-y-4">
                <Lightbulb className="w-12 h-12 text-african-ochre mx-auto" />
                <h3 className="text-xl font-bold text-african-ochre">{servicesWhyChooseMeCard3Heading?.value_text || "Collaborative Process"}</h3>
                <p className="text-gray-300">{servicesWhyChooseMeCard3Paragraph?.value_text || "Working closely with clients to bring their vision to life."}</p>
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
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">{servicesCtaHeading?.value_text || "Ready to Create Something Divine?"}</h2>
          <p className="text-gray-400 max-w-2xl mx-auto mb-8">
            {servicesCtaParagraph?.value_text || "Whether you have a specific project in mind or just want to explore possibilities, I'd love to hear from you. Let's connect and bring your vision to life."}
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
