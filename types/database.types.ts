// TypeScript types for Supabase database
// These types mirror the schema defined in supabase/schema.sql

export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[];

export interface Database {
    public: {
        Tables: {
            guides: {
                Row: {
                    id: string;
                    created_at: string;
                    updated_at: string;
                    name: string;
                    bio: string | null;
                    photo: string | null;
                    rating: number;
                    reviews_count: number;
                    whatsapp: string | null;
                    email: string | null;
                    specialties: string[];
                    languages: string[];
                    pueblo_slug: string | null;
                    is_active: boolean;
                };
                Insert: {
                    id?: string;
                    created_at?: string;
                    updated_at?: string;
                    name: string;
                    bio?: string | null;
                    photo?: string | null;
                    rating?: number;
                    reviews_count?: number;
                    whatsapp?: string | null;
                    email?: string | null;
                    specialties?: string[];
                    languages?: string[];
                    pueblo_slug?: string | null;
                    is_active?: boolean;
                };
                Update: {
                    id?: string;
                    created_at?: string;
                    updated_at?: string;
                    name?: string;
                    bio?: string | null;
                    photo?: string | null;
                    rating?: number;
                    reviews_count?: number;
                    whatsapp?: string | null;
                    email?: string | null;
                    specialties?: string[];
                    languages?: string[];
                    pueblo_slug?: string | null;
                    is_active?: boolean;
                };
                Relationships: [];
            };
            tours: {
                Row: {
                    id: string;
                    created_at: string;
                    updated_at: string;
                    title: string;
                    slug: string;
                    description: string | null;
                    full_description: string | null;
                    price_min: number | null;
                    price_max: number | null;
                    currency: string;
                    duration_hours: number | null;
                    difficulty: 'FÁCIL' | 'MEDIO' | 'DIFÍCIL' | 'EXTREMO' | null;
                    category: string | null;
                    min_guests: number;
                    max_guests: number;
                    pueblo_slug: string;
                    guide_id: string | null;
                    cover_image: string | null;
                    images: string[];
                    highlights: string[];
                    included: string[];
                    not_included: string[];
                    is_active: boolean;
                    is_featured: boolean;
                };
                Insert: {
                    id?: string;
                    created_at?: string;
                    updated_at?: string;
                    title: string;
                    slug: string;
                    description?: string | null;
                    full_description?: string | null;
                    price_min?: number | null;
                    price_max?: number | null;
                    currency?: string;
                    duration_hours?: number | null;
                    difficulty?: 'FÁCIL' | 'MEDIO' | 'DIFÍCIL' | 'EXTREMO' | null;
                    category?: string | null;
                    min_guests?: number;
                    max_guests?: number;
                    pueblo_slug: string;
                    guide_id?: string | null;
                    cover_image?: string | null;
                    images?: string[];
                    highlights?: string[];
                    included?: string[];
                    not_included?: string[];
                    is_active?: boolean;
                    is_featured?: boolean;
                };
                Update: {
                    id?: string;
                    created_at?: string;
                    updated_at?: string;
                    title?: string;
                    slug?: string;
                    description?: string | null;
                    full_description?: string | null;
                    price_min?: number | null;
                    price_max?: number | null;
                    currency?: string;
                    duration_hours?: number | null;
                    difficulty?: 'FÁCIL' | 'MEDIO' | 'DIFÍCIL' | 'EXTREMO' | null;
                    category?: string | null;
                    min_guests?: number;
                    max_guests?: number;
                    pueblo_slug?: string;
                    guide_id?: string | null;
                    cover_image?: string | null;
                    images?: string[];
                    highlights?: string[];
                    included?: string[];
                    not_included?: string[];
                    is_active?: boolean;
                    is_featured?: boolean;
                };
                Relationships: [];
            };
            accommodations: {
                Row: {
                    id: string;
                    created_at: string;
                    updated_at: string;
                    name: string;
                    slug: string;
                    description: string | null;
                    price_per_night_min: number | null;
                    price_per_night_max: number | null;
                    type: string | null;
                    amenities: string[];
                    pueblo_slug: string;
                    address: string | null;
                    lat: number | null;
                    lng: number | null;
                    whatsapp: string | null;
                    email: string | null;
                    website: string | null;
                    cover_image: string | null;
                    images: string[];
                    rating: number;
                    reviews_count: number;
                    is_active: boolean;
                };
                Insert: {
                    id?: string;
                    created_at?: string;
                    updated_at?: string;
                    name: string;
                    slug: string;
                    description?: string | null;
                    price_per_night_min?: number | null;
                    price_per_night_max?: number | null;
                    type?: string | null;
                    amenities?: string[];
                    pueblo_slug: string;
                    address?: string | null;
                    lat?: number | null;
                    lng?: number | null;
                    whatsapp?: string | null;
                    email?: string | null;
                    website?: string | null;
                    cover_image?: string | null;
                    images?: string[];
                    rating?: number;
                    reviews_count?: number;
                    is_active?: boolean;
                };
                Update: {
                    id?: string;
                    created_at?: string;
                    updated_at?: string;
                    name?: string;
                    slug?: string;
                    description?: string | null;
                    price_per_night_min?: number | null;
                    price_per_night_max?: number | null;
                    type?: string | null;
                    amenities?: string[];
                    pueblo_slug?: string;
                    address?: string | null;
                    lat?: number | null;
                    lng?: number | null;
                    whatsapp?: string | null;
                    email?: string | null;
                    website?: string | null;
                    cover_image?: string | null;
                    images?: string[];
                    rating?: number;
                    reviews_count?: number;
                    is_active?: boolean;
                };
                Relationships: [];
            };
            shuttle_routes: {
                Row: {
                    id: string;
                    origin: string;
                    destination: string;
                    price: number;
                    schedule: string[];
                    duration: string;
                    image: string | null;
                    type: string | null;
                    description: string | null;
                    created_at: string;
                };
                Insert: {
                    id: string;
                    origin: string;
                    destination: string;
                    price: number;
                    schedule: string[];
                    duration: string;
                    image?: string | null;
                    type?: string | null;
                    description?: string | null;
                    created_at?: string;
                };
                Update: {
                    id?: string;
                    origin?: string;
                    destination?: string;
                    price?: number;
                    schedule?: string[];
                    duration?: string;
                    image?: string | null;
                    type?: string | null;
                    description?: string | null;
                    created_at?: string;
                };
                Relationships: [];
            };
            shuttle_bookings: {
                Row: {
                    id: string;
                    customer_name: string;
                    customer_email: string;
                    route_origin: string;
                    route_destination: string;
                    travel_date: string;
                    travel_time: string;
                    passengers: number;
                    pickup_location: string;
                    type: string | null;
                    status: string | null;
                    email_delivery_status: 'pending' | 'sent' | 'failed' | 'not_requested' | null;
                    email_attempts: number;
                    email_last_attempt_at: string | null;
                    email_last_error: string | null;
                    created_at: string;
                };
                Insert: {
                    id?: string;
                    customer_name: string;
                    customer_email: string;
                    route_origin: string;
                    route_destination: string;
                    travel_date: string;
                    travel_time: string;
                    passengers: number;
                    pickup_location: string;
                    type?: string | null;
                    status?: string | null;
                    email_delivery_status?: 'pending' | 'sent' | 'failed' | 'not_requested' | null;
                    email_attempts?: number;
                    email_last_attempt_at?: string | null;
                    email_last_error?: string | null;
                    created_at?: string;
                };
                Update: {
                    id?: string;
                    customer_name?: string;
                    customer_email?: string;
                    route_origin?: string;
                    route_destination?: string;
                    travel_date?: string;
                    travel_time?: string;
                    passengers?: number;
                    pickup_location?: string;
                    type?: string | null;
                    status?: string | null;
                    email_delivery_status?: 'pending' | 'sent' | 'failed' | 'not_requested' | null;
                    email_attempts?: number;
                    email_last_attempt_at?: string | null;
                    email_last_error?: string | null;
                    created_at?: string;
                };
                Relationships: [];
            };
            reservations: {
                Row: {
                    id: string;
                    created_at: string;
                    updated_at: string;
                    customer_name: string;
                    customer_email: string;
                    customer_phone: string | null;
                    customer_country: string | null;
                    reservation_date: string;
                    guests: number;
                    reservation_type: 'tour' | 'accommodation' | 'guide';
                    tour_id: string | null;
                    accommodation_id: string | null;
                    guide_id: string | null;
                    tour_name: string | null;
                    total_price: number | null;
                    currency: string;
                    status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
                    customer_notes: string | null;
                    admin_notes: string | null;
                    confirmation_sent_at: string | null;
                    email_delivery_status: 'pending' | 'sent' | 'failed' | 'not_requested' | null;
                    email_attempts: number;
                    email_last_attempt_at: string | null;
                    email_last_error: string | null;
                    confirmed_at: string | null;
                    cancelled_at: string | null;
                };
                Insert: {
                    id?: string;
                    created_at?: string;
                    updated_at?: string;
                    customer_name: string;
                    customer_email: string;
                    customer_phone?: string | null;
                    customer_country?: string | null;
                    reservation_date: string;
                    guests: number;
                    reservation_type: 'tour' | 'accommodation' | 'guide';
                    tour_id?: string | null;
                    accommodation_id?: string | null;
                    guide_id?: string | null;
                    tour_name?: string | null;
                    total_price?: number | null;
                    currency?: string;
                    status?: 'pending' | 'confirmed' | 'cancelled' | 'completed';
                    customer_notes?: string | null;
                    admin_notes?: string | null;
                    confirmation_sent_at?: string | null;
                    email_delivery_status?: 'pending' | 'sent' | 'failed' | 'not_requested' | null;
                    email_attempts?: number;
                    email_last_attempt_at?: string | null;
                    email_last_error?: string | null;
                    confirmed_at?: string | null;
                    cancelled_at?: string | null;
                };
                Update: {
                    id?: string;
                    created_at?: string;
                    updated_at?: string;
                    customer_name?: string;
                    customer_email?: string;
                    customer_phone?: string | null;
                    customer_country?: string | null;
                    reservation_date?: string;
                    guests?: number;
                    reservation_type?: 'tour' | 'accommodation' | 'guide';
                    tour_id?: string | null;
                    accommodation_id?: string | null;
                    guide_id?: string | null;
                    tour_name?: string | null;
                    total_price?: number | null;
                    currency?: string;
                    status?: 'pending' | 'confirmed' | 'cancelled' | 'completed';
                    customer_notes?: string | null;
                    admin_notes?: string | null;
                    confirmation_sent_at?: string | null;
                    email_delivery_status?: 'pending' | 'sent' | 'failed' | 'not_requested' | null;
                    email_attempts?: number;
                    email_last_attempt_at?: string | null;
                    email_last_error?: string | null;
                    confirmed_at?: string | null;
                    cancelled_at?: string | null;
                };
                Relationships: [];
            };
        };
        Views: {
            [_ in never]: never;
        };
        Functions: {
            [_ in never]: never;
        };
        Enums: {
            [_ in never]: never;
        };
    };
}
