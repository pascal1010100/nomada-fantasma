begin;

create table if not exists public.internal_request_notifications (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  request_kind text not null check (request_kind in ('tour', 'shuttle')),
  request_id uuid not null,
  recipient_type text not null check (recipient_type in ('customer', 'agency', 'admin')),
  recipient_email text not null,
  channel text not null default 'email' check (channel in ('email')),
  template text not null,
  delivery_status text not null check (delivery_status in ('sent', 'failed')),
  subject text,
  provider_message_id text,
  error_message text,
  triggered_by text
);

create index if not exists idx_internal_request_notifications_request
  on public.internal_request_notifications (request_kind, request_id, created_at desc);

create index if not exists idx_internal_request_notifications_recipient
  on public.internal_request_notifications (recipient_email, created_at desc);

alter table public.internal_request_notifications enable row level security;

drop policy if exists "Service role can manage internal request notifications" on public.internal_request_notifications;
create policy "Service role can manage internal request notifications"
on public.internal_request_notifications
for all
using (auth.role() = 'service_role')
with check (auth.role() = 'service_role');

revoke all on table public.internal_request_notifications from anon;
revoke all on table public.internal_request_notifications from authenticated;
grant all on table public.internal_request_notifications to service_role;

comment on table public.internal_request_notifications is 'Operational delivery log for customer and agency notifications.';
comment on column public.internal_request_notifications.template is 'Business template or event identifier used to trigger the notification.';

commit;
