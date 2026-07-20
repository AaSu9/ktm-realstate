export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      achievements: {
        Row: {
          icon: string | null
          id: number
          label: string
          value: string
        }
        Insert: {
          icon?: string | null
          id?: never
          label: string
          value: string
        }
        Update: {
          icon?: string | null
          id?: never
          label?: string
          value?: string
        }
        Relationships: []
      }
      company_values: {
        Row: {
          description: string
          icon: string | null
          id: number
          title: string
        }
        Insert: {
          description: string
          icon?: string | null
          id?: never
          title: string
        }
        Update: {
          description?: string
          icon?: string | null
          id?: never
          title?: string
        }
        Relationships: []
      }
      contacts: {
        Row: {
          address: string | null
          branch_name: string | null
          facebook: string | null
          id: number
          instagram: string | null
          phone: string | null
          whatsapp: string | null
          youtube: string | null
          youtube_api_key: string | null
          youtube_channel_id: string | null
        }
        Insert: {
          address?: string | null
          branch_name?: string | null
          facebook?: string | null
          id?: number
          instagram?: string | null
          phone?: string | null
          whatsapp?: string | null
          youtube?: string | null
          youtube_api_key?: string | null
          youtube_channel_id?: string | null
        }
        Update: {
          address?: string | null
          branch_name?: string | null
          facebook?: string | null
          id?: number
          instagram?: string | null
          phone?: string | null
          whatsapp?: string | null
          youtube?: string | null
          youtube_api_key?: string | null
          youtube_channel_id?: string | null
        }
        Relationships: []
      }
      inquiries: {
        Row: {
          created_at: string
          email: string
          full_name: string
          id: string
          inquiry_type: string | null
          message: string | null
          phone: string
          property_id: string | null
          property_interest: string | null
          status: string | null
        }
        Insert: {
          created_at?: string
          email: string
          full_name: string
          id?: string
          inquiry_type?: string | null
          message?: string | null
          phone: string
          property_id?: string | null
          property_interest?: string | null
          status?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          inquiry_type?: string | null
          message?: string | null
          phone?: string
          property_id?: string | null
          property_interest?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "inquiries_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      properties: {
        Row: {
          area_sqft: number | null
          bathrooms: number | null
          bedrooms: number | null
          category: string
          created_at: string
          description: string | null
          discount_percentage: number | null
          features: string[] | null
          id: string
          images: string[] | null
          is_featured: boolean | null
          is_hot_deal: boolean | null
          latitude: number | null
          location: string
          longitude: number | null
          map_url: string | null
          price: number
          property_id: string
          property_type: string
          status: string | null
          tiktok_url: string | null
          title: string
          updated_at: string
          video_url: string | null
          youtube_url: string | null
        }
        Insert: {
          area_sqft?: number | null
          bathrooms?: number | null
          bedrooms?: number | null
          category: string
          created_at?: string
          description?: string | null
          discount_percentage?: number | null
          features?: string[] | null
          id?: string
          images?: string[] | null
          is_featured?: boolean | null
          is_hot_deal?: boolean | null
          latitude?: number | null
          location: string
          longitude?: number | null
          map_url?: string | null
          price: number
          property_id: string
          property_type: string
          status?: string | null
          tiktok_url?: string | null
          title: string
          updated_at?: string
          video_url?: string | null
          youtube_url?: string | null
        }
        Update: {
          area_sqft?: number | null
          bathrooms?: number | null
          bedrooms?: number | null
          category?: string
          created_at?: string
          description?: string | null
          discount_percentage?: number | null
          features?: string[] | null
          id?: string
          images?: string[] | null
          is_featured?: boolean | null
          is_hot_deal?: boolean | null
          latitude?: number | null
          location?: string
          longitude?: number | null
          map_url?: string | null
          price?: number
          property_id?: string
          property_type?: string
          status?: string | null
          tiktok_url?: string | null
          title?: string
          updated_at?: string
          video_url?: string | null
          youtube_url?: string | null
        }
        Relationships: []
      }
      stats: {
        Row: {
          happy_clients: number | null
          id: number
          properties_listed: number | null
          years_experience: number | null
        }
        Insert: {
          happy_clients?: number | null
          id?: never
          properties_listed?: number | null
          years_experience?: number | null
        }
        Update: {
          happy_clients?: number | null
          id?: never
          properties_listed?: number | null
          years_experience?: number | null
        }
        Relationships: []
      }
      testimonials: {
        Row: {
          comment: string
          id: number
          name: string
          rating: number | null
          role: string | null
        }
        Insert: {
          comment: string
          id?: never
          name: string
          rating?: number | null
          role?: string | null
        }
        Update: {
          comment?: string
          id?: never
          name?: string
          rating?: number | null
          role?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
