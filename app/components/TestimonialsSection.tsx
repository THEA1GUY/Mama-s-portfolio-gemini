import { createServerClient } from "@/lib/supabase";
import { cookies } from "next/headers";
import { Card } from "@/components/ui/card";
import { Star } from "lucide-react";

interface Testimonial {
  id: string;
  name: string;
  role: string | null;
  text: string;
  rating: number | null;
  approved: boolean;
  created_at: string;
}

export default async function TestimonialsSection() {
  const supabase = createServerClient();
  const { data: testimonials, error } = await supabase
    .from("testimonials")
    .select("*")
    .eq("approved", true) // Only fetch approved testimonials
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching testimonials for homepage:", error);
    return <p className="text-center text-gray-500">Failed to load testimonials.</p>;
  }

  if (!testimonials || testimonials.length === 0) {
    return <p className="col-span-full text-center text-gray-500">No approved testimonials yet.</p>;
  }

  return (
    <div className="flex space-x-4 overflow-x-auto pb-4">
      {testimonials.map((testimonial) => (
        <Card
          key={testimonial.id}
          className={`inline-block w-80 flex-shrink-0 bg-black/60 border-purple-500/20 p-6 rounded-lg shadow-lg transition-all duration-1000 `}
        >
          <div className="space-y-4">
            <div className="flex text-african-ochre">
              {[...Array(testimonial.rating || 0)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-current" />
              ))}
            </div>
            <p className="text-gray-300 leading-relaxed">"{testimonial.text}"</p>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-african-terracotta rounded-full flex items-center justify-center text-white font-bold text-sm">
                {testimonial.name.charAt(0).toUpperCase()}
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
  );
}
