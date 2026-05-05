begin;

alter table public.reservations
  add column if not exists payment_status text not null default 'unpaid',
  add column if not exists payment_method text,
  add column if not exists payment_amount numeric(10,2),
  add column if not exists payment_confirmed_at timestamptz,
  add column if not exists payment_updated_at timestamptz;

alter table public.shuttle_bookings
  add column if not exists payment_status text not null default 'unpaid',
  add column if not exists payment_method text,
  add column if not exists payment_amount numeric(10,2),
  add column if not exists payment_confirmed_at timestamptz,
  add column if not exists payment_updated_at timestamptz;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'reservations_payment_status_check'
      and conrelid = 'public.reservations'::regclass
  ) then
    alter table public.reservations
      add constraint reservations_payment_status_check
      check (payment_status in ('unpaid', 'payment_requested', 'proof_received', 'paid', 'failed', 'refunded'));
  end if;

  if not exists (
    select 1
    from pg_constraint
    where conname = 'reservations_payment_method_check'
      and conrelid = 'public.reservations'::regclass
  ) then
    alter table public.reservations
      add constraint reservations_payment_method_check
      check (payment_method is null or payment_method in ('bank_transfer', 'cash', 'card', 'other'));
  end if;

  if not exists (
    select 1
    from pg_constraint
    where conname = 'shuttle_bookings_payment_status_check'
      and conrelid = 'public.shuttle_bookings'::regclass
  ) then
    alter table public.shuttle_bookings
      add constraint shuttle_bookings_payment_status_check
      check (payment_status in ('unpaid', 'payment_requested', 'proof_received', 'paid', 'failed', 'refunded'));
  end if;

  if not exists (
    select 1
    from pg_constraint
    where conname = 'shuttle_bookings_payment_method_check'
      and conrelid = 'public.shuttle_bookings'::regclass
  ) then
    alter table public.shuttle_bookings
      add constraint shuttle_bookings_payment_method_check
      check (payment_method is null or payment_method in ('bank_transfer', 'cash', 'card', 'other'));
  end if;
end $$;

create index if not exists idx_reservations_payment_status
  on public.reservations(payment_status);

create index if not exists idx_shuttle_bookings_payment_status
  on public.shuttle_bookings(payment_status);

update public.reservations
set
  payment_status = case
    when status in ('confirmed', 'completed') then 'paid'
    when admin_notes ~* 'email:payment_instructions' then 'payment_requested'
    else payment_status
  end,
  payment_amount = coalesce(payment_amount, total_price),
  payment_confirmed_at = case
    when status in ('confirmed', 'completed') then coalesce(payment_confirmed_at, confirmed_at, updated_at, created_at)
    else payment_confirmed_at
  end,
  payment_updated_at = coalesce(payment_updated_at, updated_at, created_at)
where payment_status = 'unpaid';

update public.shuttle_bookings
set
  payment_status = case
    when status in ('confirmed', 'completed') then 'paid'
    when admin_notes ~* 'email:payment_instructions' then 'payment_requested'
    else payment_status
  end,
  payment_amount = coalesce(
    payment_amount,
    case
      when price is null then null
      when type = 'private' then price
      else price * greatest(passengers, 1)
    end
  ),
  payment_confirmed_at = case
    when status in ('confirmed', 'completed') then coalesce(payment_confirmed_at, confirmed_at, created_at)
    else payment_confirmed_at
  end,
  payment_updated_at = coalesce(payment_updated_at, created_at)
where payment_status = 'unpaid';

comment on column public.reservations.payment_status is 'Payment lifecycle for internal operations: unpaid, payment_requested, proof_received, paid, failed, refunded.';
comment on column public.reservations.payment_method is 'Payment method used or expected: bank_transfer, cash, card, other.';
comment on column public.reservations.payment_amount is 'Confirmed or expected payment amount in GTQ.';
comment on column public.reservations.payment_confirmed_at is 'Timestamp when payment was marked as confirmed.';

comment on column public.shuttle_bookings.payment_status is 'Payment lifecycle for internal operations: unpaid, payment_requested, proof_received, paid, failed, refunded.';
comment on column public.shuttle_bookings.payment_method is 'Payment method used or expected: bank_transfer, cash, card, other.';
comment on column public.shuttle_bookings.payment_amount is 'Confirmed or expected payment amount in GTQ.';
comment on column public.shuttle_bookings.payment_confirmed_at is 'Timestamp when payment was marked as confirmed.';

commit;
