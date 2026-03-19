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
      reservations: {
        Row: {
          accommodation_id: string | null
          admin_notes: string | null
          cancelled_at: string | null
          confirmed_at: string | null
          created_at: string | null
          date: string
          email: string
          email_attempts: number | null
          email_delivery_status: string | null
          email_last_attempt_at: string | null
          email_last_error: string | null
          full_name: string
          guide_id: string | null
          id: string
          notes: string | null
          number_of_people: number
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
          date: string
          email: string
          email_attempts?: number | null
          email_delivery_status?: string | null
          email_last_attempt_at?: string | null
          email_last_error?: string | null
          full_name: string
          guide_id?: string | null
          id?: string
          notes?: string | null
          number_of_people: number
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
          date?: string
          email?: string
          email_attempts?: number | null
          email_delivery_status?: string | null
          email_last_attempt_at?: string | null
          email_last_error?: string | null
          full_name?: string
          guide_id?: string | null
          id?: string
          notes?: string | null
          number_of_people?: number
          reservation_type?: string | null
          status?: string | null
          total_price?: number | null
          tour_id?: string | null
          tour_name?: string | null
          updated_at?: string | null
          whatsapp?: string | null
        }
        Relationships: []
      }
      shuttle_bookings: {
        Row: {
          admin_notes: string | null
          cancelled_at: string | null
          confirmed_at: string | null
          created_at: string | null
          customer_email: string
          customer_name: string
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
          customer_name: string
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
          customer_name?: string
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
