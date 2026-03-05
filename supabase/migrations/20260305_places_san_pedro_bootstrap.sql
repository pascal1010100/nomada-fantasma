-- =====================================================
-- Places table (San Pedro bootstrap)
-- =====================================================
-- Goal:
-- 1) Start with verified real places in San Pedro La Laguna only
-- 2) Feed the map from a dedicated POI table (not only accommodations)

CREATE TABLE IF NOT EXISTS public.places (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Basic info
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL CHECK (
    category IN ('wifi', 'cowork', 'hospedaje', 'banco', 'puerto', 'landmark', 'activity')
  ),
  description TEXT,

  -- Location
  town_slug TEXT NOT NULL DEFAULT 'san-pedro' CHECK (town_slug = 'san-pedro'),
  address TEXT,
  lat DECIMAL(10,8) NOT NULL CHECK (lat BETWEEN -90 AND 90),
  lng DECIMAL(11,8) NOT NULL CHECK (lng BETWEEN -180 AND 180),

  -- Verification metadata
  google_maps_url TEXT,
  website TEXT,
  phone TEXT,
  source TEXT,
  last_verified_at DATE,
  verified_by TEXT,
  notes TEXT,

  -- Visibility
  is_active BOOLEAN DEFAULT TRUE
);

CREATE INDEX IF NOT EXISTS idx_places_town_active ON public.places (town_slug) WHERE is_active = TRUE;
CREATE INDEX IF NOT EXISTS idx_places_category_active ON public.places (category) WHERE is_active = TRUE;
CREATE INDEX IF NOT EXISTS idx_places_slug ON public.places (slug);

ALTER TABLE public.places ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view active places" ON public.places;
CREATE POLICY "Public can view active places" ON public.places
  FOR SELECT USING (is_active = TRUE);

DROP POLICY IF EXISTS "Service role can manage places" ON public.places;
CREATE POLICY "Service role can manage places" ON public.places
  FOR ALL USING (auth.role() = 'service_role');

COMMENT ON TABLE public.places IS 'Verified map points of interest (POIs), bootstrapped for San Pedro La Laguna';
COMMENT ON COLUMN public.places.town_slug IS 'Bootstrapped scope locked to san-pedro';
COMMENT ON COLUMN public.places.last_verified_at IS 'Date when place data was last manually verified';
