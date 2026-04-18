# Internal Ops Auth

This app now protects the internal reception panel with Supabase Auth plus an internal operator allowlist.

## Access model

- `Supabase Auth` verifies identity.
- `public.internal_admin_users` stores internal operator roles.
- `INTERNAL_ADMIN_EMAILS` remains as a temporary fallback allowlist for bootstrap access.

## Roles

- `admin`: full internal access and operator management.
- `ops`: day-to-day request handling.

## First-time setup

1. Create the operator in Supabase Auth.
2. Insert the operator in `public.internal_admin_users`.
3. Keep the email in `INTERNAL_ADMIN_EMAILS` only as a safety fallback during rollout.

## SQL example

```sql
insert into public.internal_admin_users (email, display_name, role)
values
  ('hola@nomadafantasma.com', 'Equipo Nomada', 'admin'),
  ('operaciones@nomadafantasma.com', 'Operaciones', 'ops')
on conflict (email) do update
set
  display_name = excluded.display_name,
  role = excluded.role,
  is_active = true,
  updated_at = now();
```

## Rollout recommendation

- Phase 1: auth + allowlist + operator table.
- Phase 2: remove emails from `INTERNAL_ADMIN_EMAILS` once all operators exist in the table.
- Phase 3: add a small admin UI to manage operators without touching SQL.
