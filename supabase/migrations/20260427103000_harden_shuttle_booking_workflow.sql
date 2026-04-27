begin;

alter table public.shuttle_bookings
  add column if not exists route_id text,
  add column if not exists agency_id uuid,
  add column if not exists price numeric(10,2);

create index if not exists idx_shuttle_bookings_route_id
  on public.shuttle_bookings(route_id);

create index if not exists idx_shuttle_bookings_agency_id
  on public.shuttle_bookings(agency_id);

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'shuttle_bookings_route_id_fkey'
      and conrelid = 'public.shuttle_bookings'::regclass
  ) then
    alter table public.shuttle_bookings
      add constraint shuttle_bookings_route_id_fkey
      foreign key (route_id)
      references public.shuttle_routes(id)
      on update cascade
      on delete set null;
  end if;

  if not exists (
    select 1
    from pg_constraint
    where conname = 'shuttle_bookings_agency_id_fkey'
      and conrelid = 'public.shuttle_bookings'::regclass
  ) then
    alter table public.shuttle_bookings
      add constraint shuttle_bookings_agency_id_fkey
      foreign key (agency_id)
      references public.agencies(id)
      on update cascade
      on delete set null;
  end if;
end $$;

commit;
