begin;

create table if not exists public.rate_limit_buckets (
  identifier text primary key,
  count integer not null default 0,
  window_start timestamptz not null default now(),
  expires_at timestamptz not null,
  updated_at timestamptz not null default now()
);

create index if not exists idx_rate_limit_buckets_expires_at
  on public.rate_limit_buckets (expires_at);

alter table public.rate_limit_buckets enable row level security;

drop policy if exists "Service role can manage rate limit buckets" on public.rate_limit_buckets;
create policy "Service role can manage rate limit buckets"
on public.rate_limit_buckets
for all
using (auth.role() = 'service_role')
with check (auth.role() = 'service_role');

revoke all on table public.rate_limit_buckets from anon;
revoke all on table public.rate_limit_buckets from authenticated;
grant all on table public.rate_limit_buckets to service_role;

create or replace function public.check_rate_limit(
  p_identifier text,
  p_max integer,
  p_window_ms integer
)
returns table (
  allowed boolean,
  remaining integer,
  reset_at timestamptz,
  retry_after integer
)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_now timestamptz := now();
  v_window interval := (p_window_ms::double precision / 1000.0) * interval '1 second';
  v_bucket public.rate_limit_buckets%rowtype;
begin
  if p_identifier is null or btrim(p_identifier) = '' then
    raise exception 'identifier is required';
  end if;

  if p_max < 1 then
    raise exception 'max must be positive';
  end if;

  if p_window_ms < 1000 then
    raise exception 'window_ms must be at least 1000';
  end if;

  loop
    select *
      into v_bucket
      from public.rate_limit_buckets
      where identifier = p_identifier
      for update;

    if not found then
      begin
        insert into public.rate_limit_buckets (identifier, count, window_start, expires_at, updated_at)
        values (p_identifier, 1, v_now, v_now + v_window, v_now)
        returning * into v_bucket;

        allowed := true;
        remaining := greatest(p_max - 1, 0);
        reset_at := v_bucket.expires_at;
        retry_after := null;
        return next;
        return;
      exception when unique_violation then
        -- Another request created the bucket first. Retry with row lock.
      end;
    else
      if v_now >= v_bucket.expires_at then
        update public.rate_limit_buckets
          set count = 1,
              window_start = v_now,
              expires_at = v_now + v_window,
              updated_at = v_now
          where identifier = p_identifier
          returning * into v_bucket;

        allowed := true;
        remaining := greatest(p_max - 1, 0);
        reset_at := v_bucket.expires_at;
        retry_after := null;
        return next;
        return;
      end if;

      if v_bucket.count >= p_max then
        allowed := false;
        remaining := 0;
        reset_at := v_bucket.expires_at;
        retry_after := greatest(ceil(extract(epoch from (v_bucket.expires_at - v_now)))::integer, 1);
        return next;
        return;
      end if;

      update public.rate_limit_buckets
        set count = count + 1,
            updated_at = v_now
        where identifier = p_identifier
        returning * into v_bucket;

      allowed := true;
      remaining := greatest(p_max - v_bucket.count, 0);
      reset_at := v_bucket.expires_at;
      retry_after := null;
      return next;
      return;
    end if;
  end loop;
end;
$$;

revoke all on function public.check_rate_limit(text, integer, integer) from public;
grant execute on function public.check_rate_limit(text, integer, integer) to service_role;

commit;
