import type React from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface GalleryFrameProps extends React.ComponentProps<typeof Image> {
  frameClassName?: string
}

export function GalleryFrame({ src, alt, width, height, className, frameClassName, ...props }: GalleryFrameProps) {
  return (
    <div
      // Removed fixed aspect ratio classes from here, it will now be determined by the Image component
      className={cn(
        "relative p-0.5 border-[12px] border-gallery-gold rounded-lg overflow-hidden", // Thicker border
        "shadow-xl drop-shadow-lg", // Stronger outer shadow and drop shadow for prominence
        "before:content-[''] before:absolute before:inset-0 before:bg-gradient-to-br before:from-gallery-gold before:via-gallery-gold/80 before:to-gallery-gold-dark before:opacity-100 before:z-10", // More vivid, multi-stop gradient for metallic sheen
        "before:shadow-inner-frame", // Custom inner shadow for carved effect
        frameClassName,
      )}
    >
      <Image
        src={src || "/placeholder.svg"}
        alt={alt}
        // Pass width and height directly from props, which will now come from fetched data
        width={width}
        height={height}
        className={cn("w-full h-full object-contain rounded-md relative z-20", className)} // object-contain to show full image
        {...props}
      />
    </div>
  )
}
