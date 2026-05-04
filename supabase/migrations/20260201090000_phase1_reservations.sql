-- Nómada Fantasma - Universal Setup: Phase 1 Reservations
-- This script handles both:
-- 1. Initial creation if the table is missing.
-- 2. Migration if the table already existed with old names.

DO $$ 
BEGIN
    -- 1. CREATE TABLE IF MISSING
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'reservations') THEN
        CREATE TABLE public.reservations (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          created_at TIMESTAMPTZ DEFAULT NOW(),
          updated_at TIMESTAMPTZ DEFAULT NOW(),
          full_name TEXT NOT NULL,
          email TEXT NOT NULL,
          whatsapp TEXT,
          "date" DATE NOT NULL,
          number_of_people INTEGER NOT NULL CHECK (number_of_people > 0),
          tour_id UUID, -- Will link to tours table later if needed
          notes TEXT,
          status TEXT DEFAULT 'new_request' CHECK (status IN ('new_request', 'manually_processing', 'confirmed', 'rejected'))
        );
        RAISE NOTICE 'Table "reservations" created from scratch.';
    ELSE
        -- 2. MIGRATE EXISTING TABLE
        RAISE NOTICE 'Table "reservations" exists. Applying migrations...';

        -- Rename columns safely only if they exist
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='reservations' AND column_name='customer_name') THEN
            ALTER TABLE public.reservations RENAME COLUMN customer_name TO full_name;
        END IF;
        
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='reservations' AND column_name='customer_email') THEN
            ALTER TABLE public.reservations RENAME COLUMN customer_email TO email;
        END IF;
        
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='reservations' AND column_name='customer_phone') THEN
            ALTER TABLE public.reservations RENAME COLUMN customer_phone TO whatsapp;
        END IF;
        
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='reservations' AND column_name='reservation_date') THEN
            ALTER TABLE public.reservations RENAME COLUMN reservation_date TO "date";
        END IF;
        
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='reservations' AND column_name='guests') THEN
            ALTER TABLE public.reservations RENAME COLUMN guests TO number_of_people;
        END IF;
        
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='reservations' AND column_name='customer_notes') THEN
            ALTER TABLE public.reservations RENAME COLUMN customer_notes TO notes;
        END IF;

        -- Update statuses to the new system
        ALTER TABLE public.reservations DROP CONSTRAINT IF EXISTS reservations_status_check;
        
        UPDATE public.reservations SET status = 'new_request' WHERE status NOT IN ('new_request', 'manually_processing', 'confirmed', 'rejected');
        
        ALTER TABLE public.reservations ALTER COLUMN status SET DEFAULT 'new_request';

        ALTER TABLE public.reservations 
          ADD CONSTRAINT reservations_status_check 
          CHECK (status IN ('new_request', 'manually_processing', 'confirmed', 'rejected'));
          
        RAISE NOTICE 'Migrations applied to existing table.';
    END IF;
END $$;

-- 3. Ensure RLS is enabled and public can insert (Lead Capture)
ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can create leads" ON public.reservations;
CREATE POLICY "Anyone can create leads" ON public.reservations
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Only service role can view leads" ON public.reservations;
CREATE POLICY "Only service role can view leads" ON public.reservations
  FOR SELECT USING (auth.role() = 'service_role');
