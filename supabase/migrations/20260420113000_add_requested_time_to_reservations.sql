alter table public.reservations
  add column if not exists requested_time text;

comment on column public.reservations.requested_time is 'Requested start time selected by the customer for tour reservations.';
