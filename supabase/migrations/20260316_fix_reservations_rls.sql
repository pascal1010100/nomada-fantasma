-- Fix RLS for reservations: restrict SELECT to service_role only
-- This is idempotent and safe to re-run.

-- Ensure RLS is enabled
alter table public.reservations enable row level security;

-- Drop overly-permissive policy if it exists
drop policy if exists "Only service role can view leads" on public.reservations;

-- Allow inserts for lead capture (keep existing behavior)
drop policy if exists "Anyone can create leads" on public.reservations;

create policy "Anyone can create leads"
on public.reservations
for insert
with check (true);

-- Restrict SELECT to service_role only
drop policy if exists "Service role can view leads" on public.reservations;

create policy "Service role can view leads"
on public.reservations
for select
using (auth.role() = 'service_role');
