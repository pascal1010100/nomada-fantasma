-- Phase 1 Fix: Add missing columns to reservations table

ALTER TABLE public.reservations 
ADD COLUMN IF NOT EXISTS tour_name TEXT,
ADD COLUMN IF NOT EXISTS total_price DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS reservation_type TEXT DEFAULT 'tour',
ADD COLUMN IF NOT EXISTS accommodation_id UUID,
ADD COLUMN IF NOT EXISTS guide_id UUID;

-- Optional: Add constraint for reservation_type if you want validation
-- ALTER TABLE public.reservations 
-- ADD CONSTRAINT reservations_type_check 
-- CHECK (reservation_type IN ('tour', 'accommodation', 'guide'));
