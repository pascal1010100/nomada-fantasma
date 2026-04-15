ALTER TABLE public.reservations
  ADD COLUMN IF NOT EXISTS customer_locale TEXT;

ALTER TABLE public.shuttle_bookings
  ADD COLUMN IF NOT EXISTS customer_locale TEXT;

COMMENT ON COLUMN public.reservations.customer_locale IS 'Locale detected when the reservation was created (es/en).';
COMMENT ON COLUMN public.shuttle_bookings.customer_locale IS 'Locale detected when the shuttle booking was created (es/en).';
