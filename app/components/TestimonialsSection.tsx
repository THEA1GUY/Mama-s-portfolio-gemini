"use client"
import { useState, useEffect } from "react";
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

export default function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const response = await fetch('/.netlify/functions/testimonials');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        if (result.success && result.data) {
          setTestimonials(result.data.filter((t: Testimonial) => t.approved));
        } else {
          setError(result.message || "Failed to fetch testimonials.");
        }
      } catch (e: any) {
        setError(e.message || "An unexpected error occurred.");
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  if (loading) {
    return <p className="text-center text-gray-500">Loading testimonials...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">Error: {error}</p>;
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
