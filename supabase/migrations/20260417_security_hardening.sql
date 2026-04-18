begin;

revoke all on table public.accommodations from anon;
revoke all on table public.accommodations from authenticated;
grant select on table public.accommodations to anon;
grant select on table public.accommodations to authenticated;

revoke all on table public.agencies from anon;
revoke all on table public.agencies from authenticated;

revoke all on table public.internal_request_transitions from anon;
revoke all on table public.internal_request_transitions from authenticated;

revoke all on table public.places from anon;
revoke all on table public.places from authenticated;
grant select on table public.places to anon;
grant select on table public.places to authenticated;

revoke all on table public.reservations from anon;
revoke all on table public.reservations from authenticated;

revoke all on table public.shuttle_bookings from anon;
revoke all on table public.shuttle_bookings from authenticated;
grant insert on table public.shuttle_bookings to anon;
grant insert on table public.shuttle_bookings to authenticated;

revoke all on table public.shuttle_routes from anon;
revoke all on table public.shuttle_routes from authenticated;
grant select on table public.shuttle_routes to anon;
grant select on table public.shuttle_routes to authenticated;

revoke all on table public.tours from anon;
revoke all on table public.tours from authenticated;
grant select on table public.tours to anon;
grant select on table public.tours to authenticated;

drop policy if exists "Only service role can view leads" on public.reservations;
create policy "Only service role can view leads"
on public.reservations
for select
using (auth.role() = 'service_role');

alter table public.internal_request_transitions enable row level security;

drop policy if exists "Service role can manage internal request transitions" on public.internal_request_transitions;
create policy "Service role can manage internal request transitions"
on public.internal_request_transitions
for all
using (auth.role() = 'service_role')
with check (auth.role() = 'service_role');

commit;
