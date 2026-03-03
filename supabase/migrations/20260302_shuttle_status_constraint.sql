-- Align shuttle_bookings status semantics with reservations workflow

DO $$
DECLARE
    status_attnum INT;
    constraint_record RECORD;
BEGIN
    SELECT attnum
    INTO status_attnum
    FROM pg_attribute
    WHERE attrelid = 'public.shuttle_bookings'::regclass
      AND attname = 'status'
      AND NOT attisdropped;

    IF status_attnum IS NOT NULL THEN
        FOR constraint_record IN
            SELECT conname
            FROM pg_constraint
            WHERE conrelid = 'public.shuttle_bookings'::regclass
              AND contype = 'c'
              AND conkey @> ARRAY[status_attnum]::smallint[]
        LOOP
            EXECUTE format(
                'ALTER TABLE public.shuttle_bookings DROP CONSTRAINT IF EXISTS %I',
                constraint_record.conname
            );
        END LOOP;
    END IF;
END $$;

UPDATE public.shuttle_bookings
SET status = CASE
    WHEN status IN ('pending', 'processing', 'confirmed', 'cancelled', 'completed') THEN status
    WHEN status = 'new_request' THEN 'pending'
    WHEN status = 'manually_processing' THEN 'processing'
    WHEN status = 'rejected' THEN 'cancelled'
    ELSE 'pending'
END;

ALTER TABLE public.shuttle_bookings
  ALTER COLUMN status SET DEFAULT 'pending';

ALTER TABLE public.shuttle_bookings
  ADD CONSTRAINT shuttle_bookings_status_check
  CHECK (status IN ('pending', 'processing', 'confirmed', 'cancelled', 'completed'));
