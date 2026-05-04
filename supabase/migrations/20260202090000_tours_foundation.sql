-- Foundation table for tour catalog and booking references.

create table if not exists public.tours (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  title text not null,
  slug text not null unique,
  pueblo_slug text not null,
  description text,
  full_description text,
  price numeric,
  child_price numeric,
  currency varchar not null default 'GTQ',
  duration_text text,
  pickup_time time without time zone,
  min_guests integer not null default 1,
  max_guests integer not null default 10,
  cover_image_url text,
  is_active boolean not null default true,
  images text[] default '{}',
  highlights text[] default '{}',
  included text[] default '{}',
  not_included text[] default '{}',
  itinerary jsonb default '[]'::jsonb,
  faqs jsonb default '[]'::jsonb,
  is_featured boolean default false,
  price_min integer default 0,
  price_max integer,
  duration_hours numeric(4,2),
  difficulty text,
  category text,
  meeting_point text,
  what_to_bring text[] default '{}',
  cover_image text,
  rating numeric(3,2) default 5.0,
  available_days text[] default '{}',
  start_times text[] default '{}'
);

comment on table public.tours is 'Almacena todos los tours ofrecidos.';
comment on column public.tours.pueblo_slug is 'Relaciona el tour con un pueblo específico.';

alter table public.tours enable row level security;

drop policy if exists "Allow public read access to active tours" on public.tours;
create policy "Allow public read access to active tours"
on public.tours
for select
using (is_active = true);

grant select on table public.tours to anon;
grant select on table public.tours to authenticated;
grant all on table public.tours to service_role;
