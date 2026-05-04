begin;

create table if not exists public.notification_jobs (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  scheduled_at timestamptz not null default now(),
  locked_at timestamptz,
  processed_at timestamptz,
  status text not null default 'pending'
    check (status in ('pending', 'processing', 'sent', 'failed', 'cancelled')),
  attempts integer not null default 0 check (attempts >= 0),
  max_attempts integer not null default 5 check (max_attempts > 0),
  request_kind text not null check (request_kind in ('tour', 'guide', 'shuttle')),
  request_id uuid not null,
  recipient_type text not null check (recipient_type in ('customer', 'agency', 'admin')),
  recipient_email text not null,
  channel text not null default 'email' check (channel = 'email'),
  template text not null,
  subject text,
  payload jsonb not null default '{}'::jsonb,
  idempotency_key text not null unique,
  provider_message_id text,
  last_error text
);

create index if not exists idx_notification_jobs_status_schedule
  on public.notification_jobs(status, scheduled_at, created_at);

create index if not exists idx_notification_jobs_request
  on public.notification_jobs(request_kind, request_id, created_at desc);

create index if not exists idx_notification_jobs_recipient
  on public.notification_jobs(recipient_email, created_at desc);

alter table public.notification_jobs enable row level security;

drop policy if exists "Service role can manage notification jobs" on public.notification_jobs;
create policy "Service role can manage notification jobs"
  on public.notification_jobs
  for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

revoke all on table public.notification_jobs from anon;
revoke all on table public.notification_jobs from authenticated;
grant all on table public.notification_jobs to service_role;

comment on table public.notification_jobs is 'Durable outbox for operational email jobs and future retry processing.';
comment on column public.notification_jobs.idempotency_key is 'Stable key used to avoid duplicate email jobs for the same request/template/recipient.';

commit;
