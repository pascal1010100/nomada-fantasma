begin;

alter table public.internal_request_transitions
  drop constraint if exists internal_request_transitions_request_kind_check;

alter table public.internal_request_transitions
  add constraint internal_request_transitions_request_kind_check
  check (request_kind in ('tour', 'guide', 'shuttle'));

alter table public.internal_request_notifications
  drop constraint if exists internal_request_notifications_request_kind_check;

alter table public.internal_request_notifications
  add constraint internal_request_notifications_request_kind_check
  check (request_kind in ('tour', 'guide', 'shuttle'));

alter table public.reservations
  drop constraint if exists reservations_guide_service_required_check;

alter table public.reservations
  drop constraint if exists reservations_reservation_type_check;

alter table public.reservations
  drop constraint if exists reservations_guide_id_fkey;

alter table public.reservations
  drop constraint if exists reservations_guide_service_id_fkey;

alter table public.reservations
  drop constraint if exists reservations_guide_service_guide_fkey;

alter table public.guide_services
  drop constraint if exists guide_services_id_guide_id_unique;

alter table public.guide_services
  add constraint guide_services_id_guide_id_unique
  unique (id, guide_id);

alter table public.reservations
  add constraint reservations_guide_id_fkey
  foreign key (guide_id)
  references public.guides (id)
  on update cascade
  on delete restrict;

alter table public.reservations
  add constraint reservations_guide_service_guide_fkey
  foreign key (guide_service_id, guide_id)
  references public.guide_services (id, guide_id)
  on update cascade
  on delete restrict;

alter table public.reservations
  add constraint reservations_reservation_type_check
  check (reservation_type in ('tour', 'accommodation', 'guide'));

alter table public.reservations
  add constraint reservations_guide_service_required_check
  check (
    reservation_type <> 'guide'
    or (
      guide_id is not null
      and guide_service_id is not null
      and nullif(btrim(guide_service_name), '') is not null
    )
  );

commit;
