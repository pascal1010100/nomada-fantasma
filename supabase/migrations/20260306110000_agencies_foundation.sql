-- Step 1 foundation: agencies catalog + assignments for tours and shuttle routes

CREATE TABLE IF NOT EXISTS public.agencies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  contact_name TEXT,
  email TEXT NOT NULL,
  phone TEXT,
  whatsapp TEXT,
  notes TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true
);

ALTER TABLE public.agencies ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Service role can manage agencies" ON public.agencies;
CREATE POLICY "Service role can manage agencies" ON public.agencies
  FOR ALL USING (auth.role() = 'service_role');

ALTER TABLE public.tours
  ADD COLUMN IF NOT EXISTS agency_id UUID;

ALTER TABLE public.shuttle_routes
  ADD COLUMN IF NOT EXISTS agency_id UUID;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'tours_agency_id_fkey'
      AND conrelid = 'public.tours'::regclass
  ) THEN
    ALTER TABLE public.tours
      ADD CONSTRAINT tours_agency_id_fkey
      FOREIGN KEY (agency_id) REFERENCES public.agencies(id) ON DELETE SET NULL;
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'shuttle_routes_agency_id_fkey'
      AND conrelid = 'public.shuttle_routes'::regclass
  ) THEN
    ALTER TABLE public.shuttle_routes
      ADD CONSTRAINT shuttle_routes_agency_id_fkey
      FOREIGN KEY (agency_id) REFERENCES public.agencies(id) ON DELETE SET NULL;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_tours_agency_id
  ON public.tours(agency_id);

CREATE INDEX IF NOT EXISTS idx_shuttle_routes_agency_id
  ON public.shuttle_routes(agency_id);

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM pg_proc
    WHERE proname = 'update_updated_at_column'
      AND pg_function_is_visible(oid)
  ) THEN
    DROP TRIGGER IF EXISTS update_agencies_updated_at ON public.agencies;
    CREATE TRIGGER update_agencies_updated_at
      BEFORE UPDATE ON public.agencies
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

COMMENT ON TABLE public.agencies IS 'Travel agencies that receive operational booking requests';
COMMENT ON COLUMN public.tours.agency_id IS 'Agency responsible for handling this tour booking workflow';
COMMENT ON COLUMN public.shuttle_routes.agency_id IS 'Agency responsible for handling this shuttle route workflow';
