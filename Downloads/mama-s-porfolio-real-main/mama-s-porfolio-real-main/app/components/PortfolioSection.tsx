import { getWorks } from "@/app/venus/works/actions";
import { default as NextImage } from "next/image";
import { GalleryFrame } from "@/components/gallery-frame";
import { Star } from "lucide-react";

interface Work {
  id: string;
  title: string;
  category: string;
  image_url: string | null;
  description: string | null;
  created_at: string;
  updated_at: string;
  image_width: number | null;
  image_height: number | null;
  is_favorite: boolean | null;
  type: "image" | "video";
  video_url: string | null;
}

// Helper function to extract YouTube video ID
const getYouTubeVideoId = (url: string) => {
  let videoId = null;
  const youtubeRegex = /(?:https?:\/\/)?(?:www\.)?(?:m\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=|embed\/|v\/|)([^&?#\n]*)/i;
  const match = url.match(youtubeRegex);
  if (match && match[1]) {
    videoId = match[1];
  }
  return videoId;
};

export default async function PortfolioSection() {
  const result = await getWorks(true); // Fetch only favorite works
  const portfolioWorks: Work[] = result.success && result.data ? result.data.filter((work) => (work.type === "image" && work.image_url) || (work.type === "video" && work.video_url)).slice(0, 6) : [];

  return (
    <section id="portfolio" className="py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">My favorite works</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            A curated collection of my most powerful pieces, showcasing the intersection of African heritage and
            celestial beauty.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-2 gap-4">
          {portfolioWorks.length > 0 ? (
            portfolioWorks.map((work) => (
              <div
                key={work.id}
                className="group relative overflow-hidden rounded-lg transition-all duration-1000 opacity-100"
              >
                {work.thumbnail_url ? (
                  <GalleryFrame
                    src={work.thumbnail_url}
                    alt={work.title}
                    width={work.image_width || 300}
                    height={work.image_height || 300}
                    className="w-full h-auto object-contain transition-transform duration-300 group-hover:scale-105"
                    frameClassName="w-full h-auto"
                    // onClick={() => setSelectedImage(work)}
                  />
                ) : work.type === "image" && work.image_url ? (
                  <GalleryFrame
                    src={work.image_url || undefined}
                    alt={work.title}
                    width={work.image_width || 300}
                    height={work.image_height || 300}
                    className="w-full h-auto object-contain transition-transform duration-300 group-hover:scale-105"
                    frameClassName="w-full h-auto"
                    // onClick={() => setSelectedImage(work)}
                  />
                ) : work.type === "video" && work.video_url ? (
                  <div
                    className="relative w-full h-0 pb-[56.25%] bg-black rounded-lg overflow-hidden"
                    // onClick={() => setSelectedVideo(work)} // Open video lightbox on click
                  >
                    <NextImage
                      src={`https://img.youtube.com/vi/${getYouTubeVideoId(work.video_url)}/hqdefault.jpg`}
                      alt="YouTube Thumbnail"
                      fill
                      style={{ objectFit: 'cover' }}
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
                ) : (
                  <div className="w-full h-48 bg-gray-700 rounded-lg flex items-center justify-center text-gray-400 text-sm">
                    No Media
                  </div>
                )}
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
  );
}