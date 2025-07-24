"use client"

import type React from "react"
import { useState, useCallback, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface FileUploadProps {
  name: string
  label: string
  currentFileUrl?: string | null
  onFileChange: (file: File | null, dimensions?: { width: number; height: number } | null) => void
  disabled?: boolean
}

export function FileUpload({ name, label, currentFileUrl, onFileChange, disabled }: FileUploadProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentFileUrl || null)
  const [file, setFile] = useState<File | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    setPreviewUrl(currentFileUrl || null)
  }, [currentFileUrl])

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFile = e.target.files?.[0]
      if (selectedFile) {
        if (selectedFile.size > 5 * 1024 * 1024) {
          toast({
            title: "File too large",
            description: "Please select an image smaller than 5MB.",
            variant: "destructive",
          })
          e.target.value = ""
          setFile(null)
          setPreviewUrl(null)
          onFileChange(null, null) // Pass null for dimensions
          return
        }

        const reader = new FileReader()
        reader.onloadend = () => {
          setPreviewUrl(reader.result as string)
          const img = new window.Image()
          img.onload = () => {
            onFileChange(selectedFile, { width: img.naturalWidth, height: img.naturalHeight })
          }
          img.onerror = () => {
            console.error("Could not load image to get dimensions.")
            onFileChange(selectedFile, null) // Pass null if dimensions can't be read
          }
          img.src = reader.result as string
        }
        reader.readAsDataURL(selectedFile)
        setFile(selectedFile)
      } else {
        setFile(null)
        setPreviewUrl(null)
        onFileChange(null, null) // Pass null for dimensions
      }
    },
    [onFileChange, toast],
  )

  const handleRemoveFile = useCallback(() => {
    setFile(null)
    setPreviewUrl(null)
    onFileChange(null, null) // Pass null for dimensions
    const inputElement = document.querySelector(`input[name="${name}"]`) as HTMLInputElement
    if (inputElement) {
      inputElement.value = ""
    }
  }, [name, onFileChange])

  return (
    <div className="space-y-2">
      <Label htmlFor={name}>{label}</Label>
      <div className="flex items-center space-x-4">
        <Input
          id={name}
          name={name}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          disabled={disabled}
          className="flex-1 bg-gray-800 border-gray-700 text-white file:text-african-ochre file:bg-gray-700 file:border-0 file:rounded-md file:px-3 file:py-1 file:mr-4 hover:file:bg-gray-600"
        />
        {previewUrl && (
          <div className="relative w-24 h-24 rounded-md overflow-hidden border border-purple-500/20">
            <img src={previewUrl || "/placeholder.svg"} alt="Preview" className="w-full h-full object-cover" />
            {!disabled && (
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-1 right-1 h-6 w-6 rounded-full"
                onClick={handleRemoveFile}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        )}
      </div>
      {!previewUrl && !file && currentFileUrl && (
        <p className="text-sm text-gray-500">
          Current file:{" "}
          <a
            href={currentFileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-african-ochre hover:underline"
          >
            {currentFileUrl.split("/").pop()}
          </a>
        </p>
      )}
    </div>
  )
}
