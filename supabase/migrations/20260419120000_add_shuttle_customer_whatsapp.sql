alter table public.shuttle_bookings
  add column if not exists customer_whatsapp text;

comment on column public.shuttle_bookings.customer_whatsapp is 'Customer WhatsApp number captured during shuttle booking.';
