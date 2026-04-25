begin;

create table if not exists public.guides (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  slug text not null unique,
  town_slug text not null references public.towns (slug) on update cascade on delete restrict,
  agency_id uuid null references public.agencies (id) on update cascade on delete set null,
  name text not null,
  bio text,
  photo_url text,
  languages text[] not null default '{}'::text[],
  whatsapp text,
  email text,
  is_active boolean not null default true,
  is_verified boolean not null default false,
  sort_order integer not null default 0
);

create index if not exists idx_guides_town_slug on public.guides (town_slug);
create index if not exists idx_guides_active_sort on public.guides (town_slug, sort_order) where is_active = true;
create index if not exists idx_guides_agency_id on public.guides (agency_id);

create table if not exists public.guide_services (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  guide_id uuid not null references public.guides (id) on update cascade on delete cascade,
  slug text not null,
  title text not null,
  description text,
  duration_hours numeric(6,2),
  price_from numeric(10,2),
  price_to numeric(10,2),
  currency text not null default 'GTQ',
  meeting_point text,
  available_days text[] not null default '{}'::text[],
  start_times text[] not null default '{}'::text[],
  is_active boolean not null default true,
  sort_order integer not null default 0,
  constraint guide_services_guide_slug_unique unique (guide_id, slug)
);

create index if not exists idx_guide_services_guide_id on public.guide_services (guide_id);
create index if not exists idx_guide_services_active_sort on public.guide_services (guide_id, sort_order) where is_active = true;

alter table public.reservations
  add column if not exists guide_service_id uuid null references public.guide_services (id) on update cascade on delete set null,
  add column if not exists guide_service_name text null;

create index if not exists idx_reservations_guide_service_id on public.reservations (guide_service_id);

alter table public.guides enable row level security;
alter table public.guide_services enable row level security;

drop policy if exists "Public can view active guides" on public.guides;
create policy "Public can view active guides"
on public.guides
for select
using (is_active = true);

drop policy if exists "Service role can manage guides" on public.guides;
create policy "Service role can manage guides"
on public.guides
for all
using (auth.role() = 'service_role')
with check (auth.role() = 'service_role');

drop policy if exists "Public can view active guide services" on public.guide_services;
create policy "Public can view active guide services"
on public.guide_services
for select
using (
  is_active = true
  and exists (
    select 1
    from public.guides
    where guides.id = guide_services.guide_id
      and guides.is_active = true
  )
);

drop policy if exists "Service role can manage guide services" on public.guide_services;
create policy "Service role can manage guide services"
on public.guide_services
for all
using (auth.role() = 'service_role')
with check (auth.role() = 'service_role');

grant select on table public.guides to anon;
grant select on table public.guides to authenticated;
grant all on table public.guides to service_role;

grant select on table public.guide_services to anon;
grant select on table public.guide_services to authenticated;
grant all on table public.guide_services to service_role;

commit;
