-- Email delivery tracking for operational visibility
-- Applies to both tour reservations and shuttle bookings

ALTER TABLE public.reservations
  ADD COLUMN IF NOT EXISTS email_delivery_status TEXT DEFAULT 'pending'
  CHECK (email_delivery_status IN ('pending', 'sent', 'failed', 'not_requested'));

ALTER TABLE public.reservations
  ADD COLUMN IF NOT EXISTS email_attempts INTEGER DEFAULT 0;

ALTER TABLE public.reservations
  ADD COLUMN IF NOT EXISTS email_last_attempt_at TIMESTAMPTZ;

ALTER TABLE public.reservations
  ADD COLUMN IF NOT EXISTS email_last_error TEXT;

ALTER TABLE public.shuttle_bookings
  ADD COLUMN IF NOT EXISTS email_delivery_status TEXT DEFAULT 'pending'
  CHECK (email_delivery_status IN ('pending', 'sent', 'failed', 'not_requested'));

ALTER TABLE public.shuttle_bookings
  ADD COLUMN IF NOT EXISTS email_attempts INTEGER DEFAULT 0;

ALTER TABLE public.shuttle_bookings
  ADD COLUMN IF NOT EXISTS email_last_attempt_at TIMESTAMPTZ;

ALTER TABLE public.shuttle_bookings
  ADD COLUMN IF NOT EXISTS email_last_error TEXT;

CREATE INDEX IF NOT EXISTS idx_reservations_email_delivery_status
  ON public.reservations(email_delivery_status);

CREATE INDEX IF NOT EXISTS idx_shuttle_bookings_email_delivery_status
  ON public.shuttle_bookings(email_delivery_status);
