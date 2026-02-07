-- Nómada Fantasma - Supabase Database Schema
-- This schema creates all necessary tables for the tourism platform

-- =====================================================
-- 1. GUIDES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS guides (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Basic Info
  name TEXT NOT NULL,
  bio TEXT,
  photo TEXT, -- URL to photo
  rating DECIMAL(3,2) DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
  reviews_count INTEGER DEFAULT 0,
  
  -- Contact
  whatsapp TEXT,
  email TEXT,
  
  -- Professional Info
  specialties TEXT[] DEFAULT '{}',
  languages TEXT[] DEFAULT '{}',
  
  -- Location
  pueblo_slug TEXT, -- e.g., 'san-marcos', 'san-pedro'
  
  -- Status
  is_active BOOLEAN DEFAULT true
);

-- =====================================================
-- 2. TOURS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS tours (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Basic Info
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  full_description TEXT,
  
  -- Pricing
  price_min INTEGER, -- in USD
  price_max INTEGER,
  currency TEXT DEFAULT 'USD',
  
  -- Tour Details
  duration_hours DECIMAL(4,2),
  difficulty TEXT CHECK (difficulty IN ('FÁCIL', 'MEDIO', 'DIFÍCIL', 'EXTREMO')),
  category TEXT, -- e.g., 'adventure', 'cultural', 'wellness'
  
  -- Capacity
  min_guests INTEGER DEFAULT 1,
  max_guests INTEGER DEFAULT 20,
  
  -- Location
  pueblo_slug TEXT NOT NULL,
  
  -- Relations
  guide_id UUID REFERENCES guides(id) ON DELETE SET NULL,
  
  -- Media
  cover_image TEXT,
  images TEXT[] DEFAULT '{}',
  
  -- Meta
  highlights TEXT[] DEFAULT '{}',
  included TEXT[] DEFAULT '{}',
  not_included TEXT[] DEFAULT '{}',
  
  -- Status
  is_active BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false
);

-- =====================================================
-- 3. ACCOMMODATIONS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS accommodations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Basic Info
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  
  -- Pricing
  price_per_night_min INTEGER,
  price_per_night_max INTEGER,
  
  -- Details
  type TEXT, -- e.g., 'hostel', 'hotel', 'airbnb'
  amenities TEXT[] DEFAULT '{}',
  
  -- Location
  pueblo_slug TEXT NOT NULL,
  address TEXT,
  lat DECIMAL(10,8),
  lng DECIMAL(11,8),
  
  -- Contact
  whatsapp TEXT,
  email TEXT,
  website TEXT,
  
  -- Media
  cover_image TEXT,
  images TEXT[] DEFAULT '{}',
  
  -- Ratings
  rating DECIMAL(3,2) DEFAULT 0,
  reviews_count INTEGER DEFAULT 0,
  
  -- Status
  is_active BOOLEAN DEFAULT true
);

-- =====================================================
-- 4. RESERVATIONS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS reservations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Customer Info
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT,
  customer_country TEXT,
  
  -- Reservation Details
  reservation_date DATE NOT NULL,
  guests INTEGER NOT NULL CHECK (guests > 0),
  
  -- Type and Relations
  reservation_type TEXT NOT NULL CHECK (reservation_type IN ('tour', 'accommodation', 'guide')),
  tour_id UUID REFERENCES tours(id) ON DELETE SET NULL,
  accommodation_id UUID REFERENCES accommodations(id) ON DELETE SET NULL,
  guide_id UUID REFERENCES guides(id) ON DELETE SET NULL,
  
  -- Backward compatibility (for free-form bookings)
  tour_name TEXT,
  
  -- Pricing
  total_price DECIMAL(10,2),
  currency TEXT DEFAULT 'USD',
  
  -- Status
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  
  -- Notes
  customer_notes TEXT,
  admin_notes TEXT,
  
  -- Confirmation
  confirmation_sent_at TIMESTAMPTZ,
  confirmed_at TIMESTAMPTZ,
  cancelled_at TIMESTAMPTZ
);

-- =====================================================
-- 5. INDEXES FOR PERFORMANCE
-- =====================================================

-- Guides indexes
CREATE INDEX IF NOT EXISTS idx_guides_pueblo ON guides(pueblo_slug) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_guides_rating ON guides(rating DESC) WHERE is_active = true;

-- Tours indexes
CREATE INDEX IF NOT EXISTS idx_tours_pueblo ON tours(pueblo_slug) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_tours_slug ON tours(slug);
CREATE INDEX IF NOT EXISTS idx_tours_featured ON tours(is_featured) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_tours_guide ON tours(guide_id);

-- Accommodations indexes
CREATE INDEX IF NOT EXISTS idx_accommodations_pueblo ON accommodations(pueblo_slug) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_accommodations_slug ON accommodations(slug);
CREATE INDEX IF NOT EXISTS idx_accommodations_rating ON accommodations(rating DESC) WHERE is_active = true;

-- Reservations indexes
CREATE INDEX IF NOT EXISTS idx_reservations_email ON reservations(customer_email);
CREATE INDEX IF NOT EXISTS idx_reservations_date ON reservations(reservation_date);
CREATE INDEX IF NOT EXISTS idx_reservations_status ON reservations(status);
CREATE INDEX IF NOT EXISTS idx_reservations_type ON reservations(reservation_type);
CREATE INDEX IF NOT EXISTS idx_reservations_created ON reservations(created_at DESC);

-- =====================================================
-- 6. ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE guides ENABLE ROW LEVEL SECURITY;
ALTER TABLE tours ENABLE ROW LEVEL SECURITY;
ALTER TABLE accommodations ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;

-- Public read access for active content
CREATE POLICY "Public can view active guides" ON guides
  FOR SELECT USING (is_active = true);

CREATE POLICY "Public can view active tours" ON tours
  FOR SELECT USING (is_active = true);

CREATE POLICY "Public can view active accommodations" ON accommodations
  FOR SELECT USING (is_active = true);

-- Reservations: only allow insert from public, read with service role
CREATE POLICY "Anyone can create reservations" ON reservations
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Service role can view all reservations" ON reservations
  FOR SELECT USING (auth.role() = 'service_role');

-- Admin policies (for future admin dashboard)
-- These will be used when we add authentication
CREATE POLICY "Service role can manage guides" ON guides
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role can manage tours" ON tours
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role can manage accommodations" ON accommodations
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role can manage reservations" ON reservations
  FOR ALL USING (auth.role() = 'service_role');

-- =====================================================
-- 7. UPDATED_AT TRIGGER
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to all tables
CREATE TRIGGER update_guides_updated_at BEFORE UPDATE ON guides
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tours_updated_at BEFORE UPDATE ON tours
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_accommodations_updated_at BEFORE UPDATE ON accommodations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reservations_updated_at BEFORE UPDATE ON reservations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 8. COMMENTS FOR DOCUMENTATION
-- =====================================================

COMMENT ON TABLE guides IS 'Local tour guides available in different pueblos around Lake Atitlán';
COMMENT ON TABLE tours IS 'Available tours and experiences offered by guides';
COMMENT ON TABLE accommodations IS 'Hotels, hostels, and other lodging options around the lake';
COMMENT ON TABLE reservations IS 'Customer bookings for tours, accommodations, or private guides';

COMMENT ON COLUMN reservations.reservation_type IS 'Type of reservation: tour (guided tour), accommodation (lodging), guide (private guide hire)';
COMMENT ON COLUMN reservations.status IS 'Booking status: pending (awaiting confirmation), confirmed, cancelled, completed';
