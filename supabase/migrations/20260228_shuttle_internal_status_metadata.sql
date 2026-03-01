-- Shuttle internal status metadata for reception workflow

ALTER TABLE public.shuttle_bookings
  ADD COLUMN IF NOT EXISTS admin_notes TEXT;

ALTER TABLE public.shuttle_bookings
  ADD COLUMN IF NOT EXISTS confirmed_at TIMESTAMPTZ;

ALTER TABLE public.shuttle_bookings
  ADD COLUMN IF NOT EXISTS cancelled_at TIMESTAMPTZ;
