-- Align reservations status data/default/constraint to operational workflow

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

UPDATE public.reservations
SET status = CASE
    WHEN status IN ('pending', 'processing', 'confirmed', 'cancelled', 'completed') THEN status
    WHEN status = 'new_request' THEN 'pending'
    WHEN status = 'manually_processing' THEN 'processing'
    WHEN status = 'rejected' THEN 'cancelled'
    ELSE 'pending'
END;

ALTER TABLE public.reservations
  ALTER COLUMN status SET DEFAULT 'pending';

ALTER TABLE public.reservations
  ADD CONSTRAINT reservations_status_check
  CHECK (status IN ('pending', 'processing', 'confirmed', 'cancelled', 'completed'));
