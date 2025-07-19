"use client"

import { useState, useEffect, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { getContentSettings, updateContentSetting } from "./actions"
import { FileUpload } from "@/components/ui/file-upload"
import { Loader2 } from "lucide-react"

interface ContentSetting {
  id: string
  created_at: string
  key: string
  value_text: string | null
  value_image_url: string | null
  value_image_width: number | null
  value_image_height: number | null
}

export default function AdminContentSettingsPage() {
  const [settings, setSettings] = useState<Record<string, ContentSetting>>({}) // Map key to setting object
  const [loading, setLoading] = useState(true)
  const [isPending, startTransition] = useTransition()
  const [fileToUpload, setFileToUpload] = useState<Record<string, { file: File | null; dimensions: { width: number; height: number } | null }>>({})
  const { toast } = useToast()

  const fetchSettings = async () => {
    setLoading(true)
    const result = await getContentSettings()
    if (result.success && result.data) {
      const settingsMap: Record<string, ContentSetting> = {}
      result.data.forEach((setting) => {
        settingsMap[setting.key] = setting
      })
      setSettings(settingsMap)
    } else {
      toast({
        title: "Error",
        description: result.message || "Failed to fetch content settings.",
        variant: "destructive",
      })
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchSettings()
  }, [])

  const handleFileChange = (key: string, file: File | null, dimensions: { width: number; height: number } | null) => {
    setFileToUpload((prev) => ({
      ...prev,
      [key]: { file, dimensions },
    }))
  }

  const handleUpdateSetting = async (key: string, e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    // Append file and dimensions if available for this key
    if (fileToUpload[key]?.file) {
      formData.append("imageFile", fileToUpload[key].file!)
      if (fileToUpload[key].dimensions) {
        formData.append("imageWidth", fileToUpload[key].dimensions!.width.toString())
        formData.append("imageHeight", fileToUpload[key].dimensions!.height.toString())
      }
    } else if (settings[key]?.value_image_url && !formData.get("currentImageUrl")) {
      // If no new file and current image is being removed (e.g., by clearing FileUpload)
      // Ensure currentImageUrl is explicitly set to empty string if it was present and now removed
      formData.append("currentImageUrl", "")
    } else if (settings[key]?.value_image_url) {
      // If no new file, but there was an existing image, pass its URL
      formData.append("currentImageUrl", settings[key].value_image_url!)
    }

    formData.append("key", key)

    startTransition(async () => {
      const result = await updateContentSetting(formData)
      if (result.success) {
        toast({
          title: "Success",
          description: result.message,
        })
        // Re-fetch settings to get the latest data, including updated URLs/dimensions
        fetchSettings()
        setFileToUpload((prev) => {
          const newFiles = { ...prev }
          delete newFiles[key] // Clear file data for this key after successful upload
          return newFiles
        })
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to update setting.",
          variant: "destructive",
        })
      }
    })
  }

  const renderSettingForm = (settingKey: string, label: string, type: "text" | "image", isTextArea: boolean = false) => {
    const currentSetting = settings[settingKey]
    const isImage = type === "image"

    return (
      <Card key={settingKey} className="bg-black/60 border-purple-500/20">
        <CardHeader>
          <CardTitle className="text-african-ochre">{label}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={(e) => handleUpdateSetting(settingKey, e)} className="space-y-4">
            {isImage ? (
              <FileUpload
                name="imageFile"
                label={`Upload ${label}`}
                currentFileUrl={currentSetting?.value_image_url}
                onFileChange={(file, dimensions) => handleFileChange(settingKey, file, dimensions)}
                disabled={isPending}
              />
            ) : isTextArea ? (
              <Textarea
                id={settingKey}
                name="value_text"
                defaultValue={currentSetting?.value_text || ""}
                className="bg-gray-800 border-gray-700 text-white focus:ring-african-ochre focus:border-african-ochre"
                rows={5}
                disabled={isPending}
              />
            ) : (
              <Input
                id={settingKey}
                name="value_text"
                defaultValue={currentSetting?.value_text || ""}
                className="bg-gray-800 border-gray-700 text-white focus:ring-african-ochre focus:border-african-ochre"
                disabled={isPending}
              />
            )}

            <Button type="submit" disabled={isPending} className="bg-african-terracotta hover:bg-african-terracotta/90 text-white">
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
                </>
              ) : (
                "Save"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold text-african-terracotta">Manage Content Settings</h1>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <Loader2 className="h-8 w-8 animate-spin text-purple-400" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {renderSettingForm("about_me_portrait_image", "About Me Portrait Image", "image")}
          {renderSettingForm("about_me_portrait_caption", "About Me Portrait Caption", "text")}
          {renderSettingForm("about_me_journey_vision_heading", "About Me Journey & Vision Heading", "text")}
          {renderSettingForm("about_me_journey_vision_paragraph", "About Me Journey & Vision Paragraph", "text", true)}
          {renderSettingForm("about_me_artist_statement_heading", "About Me Artist Statement Heading", "text")}
          {renderSettingForm("about_me_artist_statement_paragraph1", "About Me Artist Statement (Paragraph 1)", "text", true)}
          {renderSettingForm("about_me_artist_statement_paragraph2", "About Me Artist Statement (Paragraph 2)", "text", true)}
          {renderSettingForm("about_me_artistic_journey_heading", "About Me Artistic Journey Heading", "text")}
          {renderSettingForm("about_me_artistic_journey_paragraph1", "About Me Artistic Journey (Paragraph 1)", "text", true)}
          {renderSettingForm("about_me_artistic_journey_paragraph2", "About Me Artistic Journey (Paragraph 2)", "text", true)}
          {renderSettingForm("about_me_artistic_journey_paragraph3", "About Me Artistic Journey (Paragraph 3)", "text", true)}
          {renderSettingForm("about_me_philosophy_inspirations_heading", "About Me Philosophy & Inspirations Heading", "text")}
          {renderSettingForm("about_me_philosophy_inspirations_intro_paragraph", "About Me Philosophy & Inspirations Intro Paragraph", "text", true)}
          {renderSettingForm("about_me_philosophy_inspirations_list_item1", "About Me Philosophy & Inspirations List Item 1", "text")}
          {renderSettingForm("about_me_philosophy_inspirations_list_item2", "About Me Philosophy & Inspirations List Item 2", "text")}
          {renderSettingForm("about_me_philosophy_inspirations_list_item3", "About Me Philosophy & Inspirations List Item 3", "text")}
          {renderSettingForm("about_me_philosophy_inspirations_list_item4", "About Me Philosophy & Inspirations List Item 4", "text")}
          {renderSettingForm("about_me_philosophy_inspirations_list_item5", "About Me Philosophy & Inspirations List Item 5", "text")}
          {renderSettingForm("about_me_philosophy_inspirations_conclusion_paragraph", "About Me Philosophy & Inspirations Conclusion Paragraph", "text", true)}
          {renderSettingForm("about_me_cta_heading", "About Me CTA Heading", "text")}
          {renderSettingForm("about_me_cta_paragraph", "About Me CTA Paragraph", "text", true)}
          {renderSettingForm("services_what_can_i_do_heading", "Services What Can I Do Heading", "text")}
          {renderSettingForm("services_what_can_i_do_paragraph", "Services What Can I Do Paragraph", "text", true)}
          {renderSettingForm("services_cultural_photography_image", "Services Cultural Photography Image", "image")}
          {renderSettingForm("services_cultural_photography_heading", "Services Cultural Photography Heading", "text")}
          {renderSettingForm("services_cultural_photography_paragraph", "Services Cultural Photography Paragraph", "text", true)}
          {renderSettingForm("services_cultural_photography_list_item1", "Services Cultural Photography List Item 1", "text")}
          {renderSettingForm("services_cultural_photography_list_item2", "Services Cultural Photography List Item 2", "text")}
          {renderSettingForm("services_cultural_photography_list_item3", "Services Cultural Photography List Item 3", "text")}
          {renderSettingForm("services_cultural_photography_list_item4", "Services Cultural Photography List Item 4", "text")}
          {renderSettingForm("services_cultural_photography_list_item5", "Services Cultural Photography List Item 5", "text")}
          {renderSettingForm("services_afrofuturistic_art_image", "Services Afrofuturistic Art Image", "image")}
          {renderSettingForm("services_afrofuturistic_art_heading", "Services Afrofuturistic Art Heading", "text")}
          {renderSettingForm("services_afrofuturistic_art_paragraph", "Services Afrofuturistic Art Paragraph", "text", true)}
          {renderSettingForm("services_afrofuturistic_art_list_item1", "Services Afrofuturistic Art List Item 1", "text")}
          {renderSettingForm("services_afrofuturistic_art_list_item2", "Services Afrofuturistic Art List Item 2", "text")}
          {renderSettingForm("services_afrofuturistic_art_list_item3", "Services Afrofuturistic Art List Item 3", "text")}
          {renderSettingForm("services_afrofuturistic_art_list_item4", "Services Afrofuturistic Art List Item 4", "text")}
          {renderSettingForm("services_afrofuturistic_art_list_item5", "Services Afrofuturistic Art List Item 5", "text")}
          {renderSettingForm("services_spiritual_design_image", "Services Spiritual Design Image", "image")}
          {renderSettingForm("services_spiritual_design_heading", "Services Spiritual Design Heading", "text")}
          {renderSettingForm("services_spiritual_design_paragraph", "Services Spiritual Design Paragraph", "text", true)}
          {renderSettingForm("services_spiritual_design_list_item1", "Services Spiritual Design List Item 1", "text")}
          {renderSettingForm("services_spiritual_design_list_item2", "Services Spiritual Design List Item 2", "text")}
          {renderSettingForm("services_spiritual_design_list_item3", "Services Spiritual Design List Item 3", "text")}
          {renderSettingForm("services_spiritual_design_list_item4", "Services Spiritual Design List Item 4", "text")}
          {renderSettingForm("services_spiritual_design_list_item5", "Services Spiritual Design List Item 5", "text")}
          {renderSettingForm("services_why_choose_me_heading", "Services Why Choose Me Heading", "text")}
          {renderSettingForm("services_why_choose_me_paragraph", "Services Why Choose Me Paragraph", "text", true)}
          {renderSettingForm("services_why_choose_me_card1_heading", "Services Why Choose Me Card 1 Heading", "text")}
          {renderSettingForm("services_why_choose_me_card1_paragraph", "Services Why Choose Me Card 1 Paragraph", "text", true)}
          {renderSettingForm("services_why_choose_me_card2_heading", "Services Why Choose Me Card 2 Heading", "text")}
          {renderSettingForm("services_why_choose_me_card2_paragraph", "Services Why Choose Me Card 2 Paragraph", "text", true)}
          {renderSettingForm("services_why_choose_me_card3_heading", "Services Why Choose Me Card 3 Heading", "text")}
          {renderSettingForm("services_why_choose_me_card3_paragraph", "Services Why Choose Me Card 3 Paragraph", "text", true)}
          {renderSettingForm("services_cta_heading", "Services CTA Heading", "text")}
          {renderSettingForm("services_cta_paragraph", "Services CTA Paragraph", "text", true)}
        </div>
      )}
    </div>
  )
}
