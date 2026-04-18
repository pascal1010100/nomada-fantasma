begin;

create table if not exists public.internal_admin_users (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  email text not null unique,
  display_name text,
  role text not null default 'ops' check (role in ('admin', 'ops')),
  is_active boolean not null default true,
  notes text
);

create index if not exists idx_internal_admin_users_email
  on public.internal_admin_users (email);

alter table public.internal_admin_users enable row level security;

drop policy if exists "Service role can manage internal admin users" on public.internal_admin_users;
create policy "Service role can manage internal admin users"
on public.internal_admin_users
for all
using (auth.role() = 'service_role')
with check (auth.role() = 'service_role');

revoke all on table public.internal_admin_users from anon;
revoke all on table public.internal_admin_users from authenticated;
grant all on table public.internal_admin_users to service_role;

comment on table public.internal_admin_users is 'Authorized internal operators for the backoffice panel.';
comment on column public.internal_admin_users.role is 'Internal access level: admin can manage everything, ops can operate requests.';

commit;
