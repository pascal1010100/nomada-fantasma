-- Foundation table for accommodation catalog entries.

create table if not exists public.accommodations (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  name text not null,
  slug text not null unique,
  description text,
  type text,
  amenities text[] default '{}',
  pueblo_slug text not null,
  lat numeric(10,8),
  lng numeric(11,8),
  is_active boolean default true
);

alter table public.accommodations enable row level security;

drop policy if exists "Public can view active accommodations" on public.accommodations;
create policy "Public can view active accommodations"
on public.accommodations
for select
using (is_active = true);

grant select on table public.accommodations to anon;
grant select on table public.accommodations to authenticated;
grant all on table public.accommodations to service_role;
