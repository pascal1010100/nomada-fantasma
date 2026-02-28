-- Internal status workflow hardening for reception operations

-- 1) Reservations: normalize status check to include processing
DO $$
DECLARE
    status_attnum INT;
    constraint_record RECORD;
BEGIN
    SELECT attnum
    INTO status_attnum
    FROM pg_attribute
    WHERE attrelid = 'public.reservations'::regclass
      AND attname = 'status'
      AND NOT attisdropped;

    IF status_attnum IS NOT NULL THEN
        FOR constraint_record IN
            SELECT conname
            FROM pg_constraint
            WHERE conrelid = 'public.reservations'::regclass
              AND contype = 'c'
              AND conkey @> ARRAY[status_attnum]::smallint[]
        LOOP
            EXECUTE format(
                'ALTER TABLE public.reservations DROP CONSTRAINT IF EXISTS %I',
                constraint_record.conname
            );
        END LOOP;
    END IF;
END $$;

ALTER TABLE public.reservations
  ADD CONSTRAINT reservations_status_check
  CHECK (status IN ('pending', 'processing', 'confirmed', 'cancelled', 'completed'));

-- 2) Audit trail table for manual status transitions from reception
CREATE TABLE IF NOT EXISTS public.internal_request_transitions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  request_kind TEXT NOT NULL CHECK (request_kind IN ('tour', 'shuttle')),
  request_id UUID NOT NULL,
  from_status TEXT,
  to_status TEXT NOT NULL,
  note TEXT,
  actor TEXT NOT NULL DEFAULT 'recepcion'
);

CREATE INDEX IF NOT EXISTS idx_internal_request_transitions_request
  ON public.internal_request_transitions(request_kind, request_id, created_at DESC);
