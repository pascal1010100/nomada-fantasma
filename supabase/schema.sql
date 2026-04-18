


SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


CREATE SCHEMA IF NOT EXISTS "public";


ALTER SCHEMA "public" OWNER TO "pg_database_owner";


COMMENT ON SCHEMA "public" IS 'standard public schema';


SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."accommodations" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "name" "text" NOT NULL,
    "slug" "text" NOT NULL,
    "description" "text",
    "type" "text",
    "amenities" "text"[] DEFAULT '{}'::"text"[],
    "pueblo_slug" "text" NOT NULL,
    "lat" numeric(10,8),
    "lng" numeric(11,8),
    "is_active" boolean DEFAULT true
);


ALTER TABLE "public"."accommodations" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."agencies" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "name" "text" NOT NULL,
    "slug" "text" NOT NULL,
    "contact_name" "text",
    "email" "text" NOT NULL,
    "phone" "text",
    "whatsapp" "text",
    "notes" "text",
    "is_active" boolean DEFAULT true NOT NULL
);


ALTER TABLE "public"."agencies" OWNER TO "postgres";


COMMENT ON TABLE "public"."agencies" IS 'Travel agencies that receive operational booking requests';



CREATE TABLE IF NOT EXISTS "public"."internal_request_transitions" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "request_kind" "text" NOT NULL,
    "request_id" "uuid" NOT NULL,
    "from_status" "text",
    "to_status" "text" NOT NULL,
    "note" "text",
    "actor" "text" DEFAULT 'recepcion'::"text" NOT NULL,
    CONSTRAINT "internal_request_transitions_request_kind_check" CHECK (("request_kind" = ANY (ARRAY['tour'::"text", 'shuttle'::"text"])))
);


ALTER TABLE "public"."internal_request_transitions" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."places" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "name" "text" NOT NULL,
    "slug" "text" NOT NULL,
    "category" "text" NOT NULL,
    "description" "text",
    "town_slug" "text" DEFAULT 'san-pedro'::"text" NOT NULL,
    "address" "text",
    "lat" numeric(10,8) NOT NULL,
    "lng" numeric(11,8) NOT NULL,
    "google_maps_url" "text",
    "website" "text",
    "phone" "text",
    "source" "text",
    "last_verified_at" "date",
    "verified_by" "text",
    "notes" "text",
    "is_active" boolean DEFAULT true,
    CONSTRAINT "places_category_check" CHECK (("category" = ANY (ARRAY['wifi'::"text", 'cowork'::"text", 'hospedaje'::"text", 'banco'::"text", 'puerto'::"text", 'landmark'::"text", 'activity'::"text"]))),
    CONSTRAINT "places_lat_check" CHECK ((("lat" >= ('-90'::integer)::numeric) AND ("lat" <= (90)::numeric))),
    CONSTRAINT "places_lng_check" CHECK ((("lng" >= ('-180'::integer)::numeric) AND ("lng" <= (180)::numeric))),
    CONSTRAINT "places_town_slug_check" CHECK (("town_slug" = 'san-pedro'::"text"))
);


ALTER TABLE "public"."places" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."reservations" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "full_name" "text" NOT NULL,
    "email" "text" NOT NULL,
    "whatsapp" "text",
    "date" "date" NOT NULL,
    "number_of_people" integer NOT NULL,
    "tour_id" "uuid",
    "notes" "text",
    "status" "text" DEFAULT 'pending'::"text",
    "tour_name" "text",
    "total_price" numeric(10,2),
    "reservation_type" "text" DEFAULT 'tour'::"text",
    "accommodation_id" "uuid",
    "guide_id" "uuid",
    "email_delivery_status" "text" DEFAULT 'pending'::"text",
    "email_attempts" integer DEFAULT 0,
    "email_last_attempt_at" timestamp with time zone,
    "email_last_error" "text",
    "admin_notes" "text",
    "confirmed_at" timestamp with time zone,
    "cancelled_at" timestamp with time zone,
    CONSTRAINT "reservations_email_delivery_status_check" CHECK (("email_delivery_status" = ANY (ARRAY['pending'::"text", 'sent'::"text", 'failed'::"text", 'not_requested'::"text"]))),
    CONSTRAINT "reservations_number_of_people_check" CHECK (("number_of_people" > 0)),
    CONSTRAINT "reservations_status_check" CHECK (("status" = ANY (ARRAY['pending'::"text", 'processing'::"text", 'confirmed'::"text", 'cancelled'::"text", 'completed'::"text"])))
);


ALTER TABLE "public"."reservations" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."shuttle_bookings" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "customer_name" "text" NOT NULL,
    "customer_email" "text" NOT NULL,
    "route_origin" "text" NOT NULL,
    "route_destination" "text" NOT NULL,
    "travel_date" "date" NOT NULL,
    "travel_time" "text" NOT NULL,
    "passengers" integer DEFAULT 1 NOT NULL,
    "pickup_location" "text" NOT NULL,
    "type" "text" DEFAULT 'shared'::"text",
    "status" "text" DEFAULT 'pending'::"text",
    "created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    "email_delivery_status" "text" DEFAULT 'pending'::"text",
    "email_attempts" integer DEFAULT 0,
    "email_last_attempt_at" timestamp with time zone,
    "email_last_error" "text",
    "admin_notes" "text",
    "confirmed_at" timestamp with time zone,
    "cancelled_at" timestamp with time zone,
    CONSTRAINT "shuttle_bookings_email_delivery_status_check" CHECK (("email_delivery_status" = ANY (ARRAY['pending'::"text", 'sent'::"text", 'failed'::"text", 'not_requested'::"text"]))),
    CONSTRAINT "shuttle_bookings_status_check" CHECK (("status" = ANY (ARRAY['pending'::"text", 'processing'::"text", 'confirmed'::"text", 'cancelled'::"text", 'completed'::"text"])))
);


ALTER TABLE "public"."shuttle_bookings" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."shuttle_routes" (
    "id" "text" NOT NULL,
    "origin" "text" NOT NULL,
    "destination" "text" NOT NULL,
    "price" numeric(10,2) NOT NULL,
    "schedule" "text"[] NOT NULL,
    "duration" "text" NOT NULL,
    "image" "text",
    "type" "text" DEFAULT 'shared'::"text",
    "description" "text",
    "created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    "agency_id" "uuid"
);


ALTER TABLE "public"."shuttle_routes" OWNER TO "postgres";


COMMENT ON COLUMN "public"."shuttle_routes"."agency_id" IS 'Agency responsible for handling this shuttle route workflow';



CREATE TABLE IF NOT EXISTS "public"."tours" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "title" "text" NOT NULL,
    "slug" "text" NOT NULL,
    "pueblo_slug" "text" NOT NULL,
    "description" "text",
    "full_description" "text",
    "price" numeric,
    "child_price" numeric,
    "currency" character varying DEFAULT 'GTQ'::character varying NOT NULL,
    "duration_text" "text",
    "pickup_time" time without time zone,
    "min_guests" integer DEFAULT 1 NOT NULL,
    "max_guests" integer DEFAULT 10 NOT NULL,
    "cover_image_url" "text",
    "is_active" boolean DEFAULT true NOT NULL,
    "images" "text"[] DEFAULT '{}'::"text"[],
    "highlights" "text"[] DEFAULT '{}'::"text"[],
    "included" "text"[] DEFAULT '{}'::"text"[],
    "not_included" "text"[] DEFAULT '{}'::"text"[],
    "itinerary" "jsonb" DEFAULT '[]'::"jsonb",
    "faqs" "jsonb" DEFAULT '[]'::"jsonb",
    "is_featured" boolean DEFAULT false,
    "price_min" integer DEFAULT 0,
    "price_max" integer,
    "duration_hours" numeric(4,2),
    "difficulty" "text",
    "category" "text",
    "meeting_point" "text",
    "what_to_bring" "text"[] DEFAULT '{}'::"text"[],
    "cover_image" "text",
    "rating" numeric(3,2) DEFAULT 5.0,
    "available_days" "text"[] DEFAULT '{}'::"text"[],
    "start_times" "text"[] DEFAULT '{}'::"text"[],
    "title_en" "text",
    "description_en" "text",
    "full_description_en" "text",
    "agency_id" "uuid"
);


ALTER TABLE "public"."tours" OWNER TO "postgres";


COMMENT ON TABLE "public"."tours" IS 'Almacena todos los tours ofrecidos.';



COMMENT ON COLUMN "public"."tours"."pueblo_slug" IS 'Relaciona el tour con un pueblo específico.';



COMMENT ON COLUMN "public"."tours"."agency_id" IS 'Agency responsible for handling this tour booking workflow';



ALTER TABLE ONLY "public"."accommodations"
    ADD CONSTRAINT "accommodations_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."accommodations"
    ADD CONSTRAINT "accommodations_slug_key" UNIQUE ("slug");



ALTER TABLE ONLY "public"."agencies"
    ADD CONSTRAINT "agencies_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."agencies"
    ADD CONSTRAINT "agencies_slug_key" UNIQUE ("slug");



ALTER TABLE ONLY "public"."internal_request_transitions"
    ADD CONSTRAINT "internal_request_transitions_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."places"
    ADD CONSTRAINT "places_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."places"
    ADD CONSTRAINT "places_slug_key" UNIQUE ("slug");



ALTER TABLE ONLY "public"."reservations"
    ADD CONSTRAINT "reservations_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."shuttle_bookings"
    ADD CONSTRAINT "shuttle_bookings_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."shuttle_routes"
    ADD CONSTRAINT "shuttle_routes_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."tours"
    ADD CONSTRAINT "tours_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."tours"
    ADD CONSTRAINT "tours_slug_key" UNIQUE ("slug");



CREATE INDEX "idx_internal_request_transitions_request" ON "public"."internal_request_transitions" USING "btree" ("request_kind", "request_id", "created_at" DESC);



CREATE INDEX "idx_places_category_active" ON "public"."places" USING "btree" ("category") WHERE ("is_active" = true);



CREATE INDEX "idx_places_slug" ON "public"."places" USING "btree" ("slug");



CREATE INDEX "idx_places_town_active" ON "public"."places" USING "btree" ("town_slug") WHERE ("is_active" = true);



CREATE INDEX "idx_reservations_email_delivery_status" ON "public"."reservations" USING "btree" ("email_delivery_status");



CREATE INDEX "idx_shuttle_bookings_email_delivery_status" ON "public"."shuttle_bookings" USING "btree" ("email_delivery_status");



CREATE INDEX "idx_shuttle_routes_agency_id" ON "public"."shuttle_routes" USING "btree" ("agency_id");



CREATE INDEX "idx_tours_agency_id" ON "public"."tours" USING "btree" ("agency_id");



ALTER TABLE ONLY "public"."shuttle_routes"
    ADD CONSTRAINT "shuttle_routes_agency_id_fkey" FOREIGN KEY ("agency_id") REFERENCES "public"."agencies"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."tours"
    ADD CONSTRAINT "tours_agency_id_fkey" FOREIGN KEY ("agency_id") REFERENCES "public"."agencies"("id") ON DELETE SET NULL;



CREATE POLICY "Allow public read access for routes" ON "public"."shuttle_routes" FOR SELECT USING (true);



CREATE POLICY "Allow public read access to active tours" ON "public"."tours" FOR SELECT USING (("is_active" = true));



CREATE POLICY "Allow public to insert bookings" ON "public"."shuttle_bookings" FOR INSERT WITH CHECK (true);



CREATE POLICY "Anyone can create leads" ON "public"."reservations" FOR INSERT WITH CHECK (true);



CREATE POLICY "Only service role can view leads" ON "public"."reservations" FOR SELECT USING (("auth"."role"() = 'service_role'::"text"));



CREATE POLICY "Public can view active accommodations" ON "public"."accommodations" FOR SELECT USING (("is_active" = true));



CREATE POLICY "Public can view active places" ON "public"."places" FOR SELECT USING (("is_active" = true));



CREATE POLICY "Service role can manage agencies" ON "public"."agencies" USING (("auth"."role"() = 'service_role'::"text"));



CREATE POLICY "Service role can manage places" ON "public"."places" USING (("auth"."role"() = 'service_role'::"text"));



CREATE POLICY "Service role can manage internal request transitions" ON "public"."internal_request_transitions" USING (("auth"."role"() = 'service_role'::"text")) WITH CHECK (("auth"."role"() = 'service_role'::"text"));



ALTER TABLE "public"."accommodations" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."agencies" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."places" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."reservations" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."internal_request_transitions" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."shuttle_bookings" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."shuttle_routes" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."tours" ENABLE ROW LEVEL SECURITY;


GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";



GRANT SELECT ON TABLE "public"."accommodations" TO "anon";
GRANT SELECT ON TABLE "public"."accommodations" TO "authenticated";
GRANT ALL ON TABLE "public"."accommodations" TO "service_role";



REVOKE ALL ON TABLE "public"."agencies" FROM "anon";
REVOKE ALL ON TABLE "public"."agencies" FROM "authenticated";
GRANT ALL ON TABLE "public"."agencies" TO "service_role";



REVOKE ALL ON TABLE "public"."internal_request_transitions" FROM "anon";
REVOKE ALL ON TABLE "public"."internal_request_transitions" FROM "authenticated";
GRANT ALL ON TABLE "public"."internal_request_transitions" TO "service_role";



GRANT SELECT ON TABLE "public"."places" TO "anon";
GRANT SELECT ON TABLE "public"."places" TO "authenticated";
GRANT ALL ON TABLE "public"."places" TO "service_role";



REVOKE ALL ON TABLE "public"."reservations" FROM "anon";
REVOKE ALL ON TABLE "public"."reservations" FROM "authenticated";
GRANT ALL ON TABLE "public"."reservations" TO "service_role";



GRANT INSERT ON TABLE "public"."shuttle_bookings" TO "anon";
GRANT INSERT ON TABLE "public"."shuttle_bookings" TO "authenticated";
GRANT ALL ON TABLE "public"."shuttle_bookings" TO "service_role";



GRANT SELECT ON TABLE "public"."shuttle_routes" TO "anon";
GRANT SELECT ON TABLE "public"."shuttle_routes" TO "authenticated";
GRANT ALL ON TABLE "public"."shuttle_routes" TO "service_role";



GRANT SELECT ON TABLE "public"."tours" TO "anon";
GRANT SELECT ON TABLE "public"."tours" TO "authenticated";
GRANT ALL ON TABLE "public"."tours" TO "service_role";



ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "service_role";





