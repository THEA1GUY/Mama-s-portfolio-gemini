
import { createServerClient } from '@/lib/supabase';
import { Database } from "@/lib/database.types";

export async function getDashboardStats() {
  const supabase = createServerClient();

  const { count: worksCount, error: worksError } = await supabase
    .from('works')
    .select('*', { count: 'exact', head: true });

  const { count: messagesCount, error: messagesError } = await supabase
    .from('messages')
    .select('*', { count: 'exact', head: true });

  const { count: testimonialsCount, error: testimonialsError } = await supabase
    .from('testimonials')
    .select('*', { count: 'exact', head: true });

  if (worksError || messagesError || testimonialsError) {
    console.error('Error fetching dashboard stats:', { worksError, messagesError, testimonialsError });
    return {
      worksCount: 0,
      messagesCount: 0,
      testimonialsCount: 0,
    };
  }

  return {
    worksCount: worksCount ?? 0,
    messagesCount: messagesCount ?? 0,
    testimonialsCount: testimonialsCount ?? 0,
  };
}
