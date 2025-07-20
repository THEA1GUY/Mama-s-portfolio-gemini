// This file is manually updated to include the profiles table and is_admin function.
// If you use the Supabase CLI, you can generate this file automatically.

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  public: {
    Tables: {
      works: {
        Row: {
          id: string
          title: string
          category: string
          image_url: string | null
          description: string | null
          created_at: string
          updated_at: string
          image_width: number | null
          image_height: number | null
          is_favorite: boolean | null // Ensure this is present
        }
        Insert: {
          id?: string
          title: string
          category: string
          image_url?: string | null
          description?: string | null
          created_at?: string
          updated_at?: string
          image_width?: number | null
          image_height?: number | null
          is_favorite?: boolean | null // Ensure this is present
        }
        Update: {
          id?: string
          title?: string
          category?: string
          image_url?: string | null
          description?: string | null
          created_at?: string
          updated_at?: string
          image_width?: number | null
          image_height?: number | null
          is_favorite?: boolean | null // Ensure this is present
        }
        Relationships: []
      }
      testimonials: {
        Row: {
          id: string
          name: string
          role: string | null
          text: string
          rating: number | null
          approved: boolean
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          role?: string | null
          text: string
          rating?: number | null
          approved?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          role?: string | null
          text?: string
          rating?: number | null
          approved?: boolean
          created_at?: string
        }
        Relationships: []
      }
      messages: {
        Row: {
          id: string
          name: string
          email: string
          message: string
          read: boolean
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          message: string
          read?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          message?: string
          read?: boolean
          created_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          id: string
          email: string
          role: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          role?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          role?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      content_settings: {
        Row: {
          id: string
          created_at: string
          key: string
          value_text: string | null
          value_image_url: string | null
          value_image_width: number | null
          value_image_height: number | null
        }
        Insert: {
          id?: string
          created_at?: string
          key: string
          value_text?: string | null
          value_image_url?: string | null
          value_image_width?: number | null
          value_image_height?: number | null
        }
        Update: {
          id?: string
          created_at?: string
          key?: string
          value_text?: string | null
          value_image_url?: string | null
          value_image_width?: number | null
          value_image_height?: number | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
