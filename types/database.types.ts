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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      accommodations: {
        Row: {
          amenities: string[] | null
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          lat: number | null
          lng: number | null
          name: string
          pueblo_slug: string
          slug: string
          type: string | null
          updated_at: string | null
        }
        Insert: {
          amenities?: string[] | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          lat?: number | null
          lng?: number | null
          name: string
          pueblo_slug: string
          slug: string
          type?: string | null
          updated_at?: string | null
        }
        Update: {
          amenities?: string[] | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          lat?: number | null
          lng?: number | null
          name?: string
          pueblo_slug?: string
          slug?: string
          type?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      agencies: {
        Row: {
          contact_name: string | null
          created_at: string
          email: string
          id: string
          is_active: boolean
          name: string
          notes: string | null
          phone: string | null
          slug: string
          updated_at: string
          whatsapp: string | null
        }
        Insert: {
          contact_name?: string | null
          created_at?: string
          email: string
          id?: string
          is_active?: boolean
          name: string
          notes?: string | null
          phone?: string | null
          slug: string
          updated_at?: string
          whatsapp?: string | null
        }
        Update: {
          contact_name?: string | null
          created_at?: string
          email?: string
          id?: string
          is_active?: boolean
          name?: string
          notes?: string | null
          phone?: string | null
          slug?: string
          updated_at?: string
          whatsapp?: string | null
        }
        Relationships: []
      }
      guide_services: {
        Row: {
          available_days: string[]
          created_at: string
          currency: string
          description: string | null
          duration_hours: number | null
          guide_id: string
          id: string
          is_active: boolean
          meeting_point: string | null
          price_from: number | null
          price_to: number | null
          slug: string
          sort_order: number
          start_times: string[]
          title: string
          updated_at: string
        }
        Insert: {
          available_days?: string[]
          created_at?: string
          currency?: string
          description?: string | null
          duration_hours?: number | null
          guide_id: string
          id?: string
          is_active?: boolean
          meeting_point?: string | null
          price_from?: number | null
          price_to?: number | null
          slug: string
          sort_order?: number
          start_times?: string[]
          title: string
          updated_at?: string
        }
        Update: {
          available_days?: string[]
          created_at?: string
          currency?: string
          description?: string | null
          duration_hours?: number | null
          guide_id?: string
          id?: string
          is_active?: boolean
          meeting_point?: string | null
          price_from?: number | null
          price_to?: number | null
          slug?: string
          sort_order?: number
          start_times?: string[]
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "guide_services_guide_id_fkey"
            columns: ["guide_id"]
            isOneToOne: false
            referencedRelation: "guides"
            referencedColumns: ["id"]
          },
        ]
      }
      guides: {
        Row: {
          agency_id: string | null
          bio: string | null
          created_at: string
          email: string | null
          id: string
          is_active: boolean
          is_verified: boolean
          languages: string[]
          name: string
          photo_url: string | null
          slug: string
          sort_order: number
          town_slug: string
          updated_at: string
          whatsapp: string | null
        }
        Insert: {
          agency_id?: string | null
          bio?: string | null
          created_at?: string
          email?: string | null
          id?: string
          is_active?: boolean
          is_verified?: boolean
          languages?: string[]
          name: string
          photo_url?: string | null
          slug: string
          sort_order?: number
          town_slug: string
          updated_at?: string
          whatsapp?: string | null
        }
        Update: {
          agency_id?: string | null
          bio?: string | null
          created_at?: string
          email?: string | null
          id?: string
          is_active?: boolean
          is_verified?: boolean
          languages?: string[]
          name?: string
          photo_url?: string | null
          slug?: string
          sort_order?: number
          town_slug?: string
          updated_at?: string
          whatsapp?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "guides_agency_id_fkey"
            columns: ["agency_id"]
            isOneToOne: false
            referencedRelation: "agencies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "guides_town_slug_fkey"
            columns: ["town_slug"]
            isOneToOne: false
            referencedRelation: "towns"
            referencedColumns: ["slug"]
          },
        ]
      }
      internal_admin_users: {
        Row: {
          created_at: string
          display_name: string | null
          email: string
          id: string
          is_active: boolean
          notes: string | null
          role: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          display_name?: string | null
          email: string
          id?: string
          is_active?: boolean
          notes?: string | null
          role?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          display_name?: string | null
          email?: string
          id?: string
          is_active?: boolean
          notes?: string | null
          role?: string
          updated_at?: string
        }
        Relationships: []
      }
      internal_request_notifications: {
        Row: {
          channel: string
          created_at: string
          delivery_status: string
          error_message: string | null
          id: string
          provider_message_id: string | null
          recipient_email: string
          recipient_type: string
          request_id: string
          request_kind: string
          subject: string | null
          template: string
          triggered_by: string | null
        }
        Insert: {
          channel?: string
          created_at?: string
          delivery_status: string
          error_message?: string | null
          id?: string
          provider_message_id?: string | null
          recipient_email: string
          recipient_type: string
          request_id: string
          request_kind: string
          subject?: string | null
          template: string
          triggered_by?: string | null
        }
        Update: {
          channel?: string
          created_at?: string
          delivery_status?: string
          error_message?: string | null
          id?: string
          provider_message_id?: string | null
          recipient_email?: string
          recipient_type?: string
          request_id?: string
          request_kind?: string
          subject?: string | null
          template?: string
          triggered_by?: string | null
        }
        Relationships: []
      }
      internal_request_transitions: {
        Row: {
          actor: string
          created_at: string
          from_status: string | null
          id: string
          note: string | null
          request_id: string
          request_kind: string
          to_status: string
        }
        Insert: {
          actor?: string
          created_at?: string
          from_status?: string | null
          id?: string
          note?: string | null
          request_id: string
          request_kind: string
          to_status: string
        }
        Update: {
          actor?: string
          created_at?: string
          from_status?: string | null
          id?: string
          note?: string | null
          request_id?: string
          request_kind?: string
          to_status?: string
        }
        Relationships: []
      }
      places: {
        Row: {
          address: string | null
          category: string
          created_at: string | null
          description: string | null
          google_maps_url: string | null
          id: string
          is_active: boolean | null
          last_verified_at: string | null
          lat: number
          lng: number
          name: string
          notes: string | null
          phone: string | null
          slug: string
          source: string | null
          town_slug: string
          updated_at: string | null
          verified_by: string | null
          website: string | null
        }
        Insert: {
          address?: string | null
          category: string
          created_at?: string | null
          description?: string | null
          google_maps_url?: string | null
          id?: string
          is_active?: boolean | null
          last_verified_at?: string | null
          lat: number
          lng: number
          name: string
          notes?: string | null
          phone?: string | null
          slug: string
          source?: string | null
          town_slug?: string
          updated_at?: string | null
          verified_by?: string | null
          website?: string | null
        }
        Update: {
          address?: string | null
          category?: string
          created_at?: string | null
          description?: string | null
          google_maps_url?: string | null
          id?: string
          is_active?: boolean | null
          last_verified_at?: string | null
          lat?: number
          lng?: number
          name?: string
          notes?: string | null
          phone?: string | null
          slug?: string
          source?: string | null
          town_slug?: string
          updated_at?: string | null
          verified_by?: string | null
          website?: string | null
        }
        Relationships: []
      }
      rate_limit_buckets: {
        Row: {
          count: number
          expires_at: string
          identifier: string
          updated_at: string
          window_start: string
        }
        Insert: {
          count?: number
          expires_at: string
          identifier: string
          updated_at?: string
          window_start?: string
        }
        Update: {
          count?: number
          expires_at?: string
          identifier?: string
          updated_at?: string
          window_start?: string
        }
        Relationships: []
      }
      reservations: {
        Row: {
          accommodation_id: string | null
          admin_notes: string | null
          cancelled_at: string | null
          confirmed_at: string | null
          created_at: string | null
          customer_locale: string | null
          date: string
          email: string
          email_attempts: number | null
          email_delivery_status: string | null
          email_last_attempt_at: string | null
          email_last_error: string | null
          full_name: string
          guide_id: string | null
          guide_service_id: string | null
          guide_service_name: string | null
          id: string
          notes: string | null
          number_of_people: number
          requested_time: string | null
          reservation_type: string | null
          status: string | null
          total_price: number | null
          tour_id: string | null
          tour_name: string | null
          updated_at: string | null
          whatsapp: string | null
        }
        Insert: {
          accommodation_id?: string | null
          admin_notes?: string | null
          cancelled_at?: string | null
          confirmed_at?: string | null
          created_at?: string | null
          customer_locale?: string | null
          date: string
          email: string
          email_attempts?: number | null
          email_delivery_status?: string | null
          email_last_attempt_at?: string | null
          email_last_error?: string | null
          full_name: string
          guide_id?: string | null
          guide_service_id?: string | null
          guide_service_name?: string | null
          id?: string
          notes?: string | null
          number_of_people: number
          requested_time?: string | null
          reservation_type?: string | null
          status?: string | null
          total_price?: number | null
          tour_id?: string | null
          tour_name?: string | null
          updated_at?: string | null
          whatsapp?: string | null
        }
        Update: {
          accommodation_id?: string | null
          admin_notes?: string | null
          cancelled_at?: string | null
          confirmed_at?: string | null
          created_at?: string | null
          customer_locale?: string | null
          date?: string
          email?: string
          email_attempts?: number | null
          email_delivery_status?: string | null
          email_last_attempt_at?: string | null
          email_last_error?: string | null
          full_name?: string
          guide_id?: string | null
          guide_service_id?: string | null
          guide_service_name?: string | null
          id?: string
          notes?: string | null
          number_of_people?: number
          requested_time?: string | null
          reservation_type?: string | null
          status?: string | null
          total_price?: number | null
          tour_id?: string | null
          tour_name?: string | null
          updated_at?: string | null
          whatsapp?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reservations_guide_id_fkey"
            columns: ["guide_id"]
            isOneToOne: false
            referencedRelation: "guides"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reservations_guide_service_guide_fkey"
            columns: ["guide_service_id", "guide_id"]
            isOneToOne: false
            referencedRelation: "guide_services"
            referencedColumns: ["id", "guide_id"]
          },
        ]
      }
      shuttle_bookings: {
        Row: {
          admin_notes: string | null
          cancelled_at: string | null
          confirmed_at: string | null
          created_at: string | null
          customer_email: string
          customer_locale: string | null
          customer_name: string
          customer_whatsapp: string | null
          email_attempts: number | null
          email_delivery_status: string | null
          email_last_attempt_at: string | null
          email_last_error: string | null
          id: string
          passengers: number
          pickup_location: string
          route_destination: string
          route_origin: string
          status: string | null
          travel_date: string
          travel_time: string
          type: string | null
        }
        Insert: {
          admin_notes?: string | null
          cancelled_at?: string | null
          confirmed_at?: string | null
          created_at?: string | null
          customer_email: string
          customer_locale?: string | null
          customer_name: string
          customer_whatsapp?: string | null
          email_attempts?: number | null
          email_delivery_status?: string | null
          email_last_attempt_at?: string | null
          email_last_error?: string | null
          id?: string
          passengers?: number
          pickup_location: string
          route_destination: string
          route_origin: string
          status?: string | null
          travel_date: string
          travel_time: string
          type?: string | null
        }
        Update: {
          admin_notes?: string | null
          cancelled_at?: string | null
          confirmed_at?: string | null
          created_at?: string | null
          customer_email?: string
          customer_locale?: string | null
          customer_name?: string
          customer_whatsapp?: string | null
          email_attempts?: number | null
          email_delivery_status?: string | null
          email_last_attempt_at?: string | null
          email_last_error?: string | null
          id?: string
          passengers?: number
          pickup_location?: string
          route_destination?: string
          route_origin?: string
          status?: string | null
          travel_date?: string
          travel_time?: string
          type?: string | null
        }
        Relationships: []
      }
      shuttle_routes: {
        Row: {
          agency_id: string | null
          created_at: string | null
          description: string | null
          destination: string
          duration: string
          id: string
          image: string | null
          origin: string
          price: number
          schedule: string[]
          type: string | null
        }
        Insert: {
          agency_id?: string | null
          created_at?: string | null
          description?: string | null
          destination: string
          duration: string
          id: string
          image?: string | null
          origin: string
          price: number
          schedule: string[]
          type?: string | null
        }
        Update: {
          agency_id?: string | null
          created_at?: string | null
          description?: string | null
          destination?: string
          duration?: string
          id?: string
          image?: string | null
          origin?: string
          price?: number
          schedule?: string[]
          type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "shuttle_routes_agency_id_fkey"
            columns: ["agency_id"]
            isOneToOne: false
            referencedRelation: "agencies"
            referencedColumns: ["id"]
          },
        ]
      }
      tours: {
        Row: {
          agency_id: string | null
          available_days: string[] | null
          category: string | null
          child_price: number | null
          cover_image: string | null
          cover_image_url: string | null
          created_at: string
          currency: string
          description: string | null
          description_en: string | null
          difficulty: string | null
          duration_hours: number | null
          duration_text: string | null
          faqs: Json | null
          full_description: string | null
          full_description_en: string | null
          highlights: string[] | null
          id: string
          images: string[] | null
          included: string[] | null
          is_active: boolean
          is_featured: boolean | null
          itinerary: Json | null
          max_guests: number
          meeting_point: string | null
          min_guests: number
          not_included: string[] | null
          pickup_time: string | null
          price: number | null
          price_max: number | null
          price_min: number | null
          pueblo_slug: string
          rating: number | null
          slug: string
          start_times: string[] | null
          title: string
          title_en: string | null
          what_to_bring: string[] | null
        }
        Insert: {
          agency_id?: string | null
          available_days?: string[] | null
          category?: string | null
          child_price?: number | null
          cover_image?: string | null
          cover_image_url?: string | null
          created_at?: string
          currency?: string
          description?: string | null
          description_en?: string | null
          difficulty?: string | null
          duration_hours?: number | null
          duration_text?: string | null
          faqs?: Json | null
          full_description?: string | null
          full_description_en?: string | null
          highlights?: string[] | null
          id?: string
          images?: string[] | null
          included?: string[] | null
          is_active?: boolean
          is_featured?: boolean | null
          itinerary?: Json | null
          max_guests?: number
          meeting_point?: string | null
          min_guests?: number
          not_included?: string[] | null
          pickup_time?: string | null
          price?: number | null
          price_max?: number | null
          price_min?: number | null
          pueblo_slug: string
          rating?: number | null
          slug: string
          start_times?: string[] | null
          title: string
          title_en?: string | null
          what_to_bring?: string[] | null
        }
        Update: {
          agency_id?: string | null
          available_days?: string[] | null
          category?: string | null
          child_price?: number | null
          cover_image?: string | null
          cover_image_url?: string | null
          created_at?: string
          currency?: string
          description?: string | null
          description_en?: string | null
          difficulty?: string | null
          duration_hours?: number | null
          duration_text?: string | null
          faqs?: Json | null
          full_description?: string | null
          full_description_en?: string | null
          highlights?: string[] | null
          id?: string
          images?: string[] | null
          included?: string[] | null
          is_active?: boolean
          is_featured?: boolean | null
          itinerary?: Json | null
          max_guests?: number
          meeting_point?: string | null
          min_guests?: number
          not_included?: string[] | null
          pickup_time?: string | null
          price?: number | null
          price_max?: number | null
          price_min?: number | null
          pueblo_slug?: string
          rating?: number | null
          slug?: string
          start_times?: string[] | null
          title?: string
          title_en?: string | null
          what_to_bring?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "tours_agency_id_fkey"
            columns: ["agency_id"]
            isOneToOne: false
            referencedRelation: "agencies"
            referencedColumns: ["id"]
          },
        ]
      }
      towns: {
        Row: {
          activities: Json
          cover_image: string
          created_at: string
          full_description: string | null
          guides: Json
          highlights: Json
          id: string
          is_active: boolean
          rating: number
          services: Json
          slug: string
          sort_order: number
          summary: string
          title: string
          transport_schedule: Json
          updated_at: string
          vibe: string | null
          weather: Json
          wifi_rating: number
        }
        Insert: {
          activities?: Json
          cover_image: string
          created_at?: string
          full_description?: string | null
          guides?: Json
          highlights?: Json
          id?: string
          is_active?: boolean
          rating?: number
          services?: Json
          slug: string
          sort_order?: number
          summary: string
          title: string
          transport_schedule?: Json
          updated_at?: string
          vibe?: string | null
          weather?: Json
          wifi_rating?: number
        }
        Update: {
          activities?: Json
          cover_image?: string
          created_at?: string
          full_description?: string | null
          guides?: Json
          highlights?: Json
          id?: string
          is_active?: boolean
          rating?: number
          services?: Json
          slug?: string
          sort_order?: number
          summary?: string
          title?: string
          transport_schedule?: Json
          updated_at?: string
          vibe?: string | null
          weather?: Json
          wifi_rating?: number
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_rate_limit: {
        Args: { p_identifier: string; p_max: number; p_window_ms: number }
        Returns: {
          allowed: boolean
          remaining: number
          reset_at: string
          retry_after: number
        }[]
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
