export type BookingOptionConfig = {
  id: string;
  name: string;
  description: string;
  price: number;
  pricingMode?: 'per_person' | 'per_group';
  availabilityMode?: 'fixed_schedule' | 'request_based';
  minGuests?: number;
  maxGuests?: number;
  availableDays?: string[];
  startTimes?: string[];
  pickupTime?: string;
  durationLabel?: string;
};

const normalizeDayName = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

const dayNameToIndex: Record<string, number> = {
  sunday: 0,
  monday: 1,
  tuesday: 2,
  wednesday: 3,
  thursday: 4,
  friday: 5,
  saturday: 6,
  domingo: 0,
  lunes: 1,
  martes: 2,
  miercoles: 3,
  jueves: 4,
  viernes: 5,
  sabado: 6,
};

const toDateKey = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const parseLocalDate = (value: string) => {
  const trimmed = value.trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    return new Date(`${trimmed}T00:00:00`);
  }
  return new Date(trimmed);
};

export function buildAvailableDates(availableDays: string[], now = new Date()) {
  const today = new Date(now);
  today.setHours(0, 0, 0, 0);

  const weekdayIndexes: number[] = [];
  const dateKeys: string[] = [];
  const dateSet = new Set<string>();
  const everyDayTokens = new Set([
    'todos los dias',
    'every day',
    'everyday',
    'daily',
    'all days',
  ]);
  let hasEveryDay = false;

  availableDays.forEach((value) => {
    const parsedDate = parseLocalDate(value);
    if (!Number.isNaN(parsedDate.getTime())) {
      parsedDate.setHours(0, 0, 0, 0);
      if (parsedDate <= today) {
        return;
      }
      const key = toDateKey(parsedDate);
      if (!dateSet.has(key)) {
        dateSet.add(key);
        dateKeys.push(key);
      }
      return;
    }

    const normalized = normalizeDayName(value);
    if (everyDayTokens.has(normalized)) {
      hasEveryDay = true;
      return;
    }
    const mappedIndex = dayNameToIndex[normalized];
    if (mappedIndex !== undefined) {
      if (!weekdayIndexes.includes(mappedIndex)) {
        weekdayIndexes.push(mappedIndex);
      }
      return;
    }

    const numericIndex = Number.parseInt(normalized, 10);
    if (!Number.isNaN(numericIndex)) {
      const normalizedIndex = numericIndex >= 0 && numericIndex <= 6
        ? numericIndex
        : numericIndex >= 1 && numericIndex <= 7
          ? numericIndex % 7
          : null;
      if (normalizedIndex !== null && !weekdayIndexes.includes(normalizedIndex)) {
        weekdayIndexes.push(normalizedIndex);
      }
    }
  });

  if (hasEveryDay) {
    for (let offset = 1; offset < 29; offset += 1) {
      const date = new Date(today);
      date.setDate(today.getDate() + offset);
      const key = toDateKey(date);
      if (!dateSet.has(key)) {
        dateSet.add(key);
        dateKeys.push(key);
      }
    }
  }

  if (weekdayIndexes.length > 0) {
    for (let offset = 1; offset < 29; offset += 1) {
      const date = new Date(today);
      date.setDate(today.getDate() + offset);
      if (weekdayIndexes.includes(date.getDay())) {
        const key = toDateKey(date);
        if (!dateSet.has(key)) {
          dateSet.add(key);
          dateKeys.push(key);
        }
      }
    }
  }

  if (dateKeys.length === 0) {
    for (let offset = 1; offset < 29; offset += 1) {
      const date = new Date(today);
      date.setDate(today.getDate() + offset);
      const key = toDateKey(date);
      if (!dateSet.has(key)) {
        dateSet.add(key);
        dateKeys.push(key);
      }
    }
  }

  return dateKeys.sort();
}

export function calculateBookingTotal(
  price: number,
  guests: number,
  pricingMode: BookingOptionConfig['pricingMode'] = 'per_person'
) {
  return pricingMode === 'per_group' ? price : price * guests;
}

export function resolveBookingOptionConfig(params: {
  option: BookingOptionConfig | null | undefined;
  availableDays: string[];
  startTimes?: string[];
  pickupTime?: string;
  minCapacity?: number;
  maxCapacity: number;
  now?: Date;
}) {
  const {
    option,
    availableDays,
    startTimes = [],
    pickupTime,
    minCapacity = 1,
    maxCapacity,
    now,
  } = params;

  const effectiveAvailableDays = option?.availableDays?.length ? option.availableDays : availableDays;
  const effectiveStartTimes = (option?.startTimes?.length ? option.startTimes : startTimes)
    .map((value) => value.trim())
    .filter(Boolean);
  const effectivePickupTime = (option?.pickupTime?.trim() ?? '') || (pickupTime?.trim() ?? '');
  const minGuests = Math.max(1, option?.minGuests ?? minCapacity);
  const maxGuests = Math.max(minGuests, option?.maxGuests ?? maxCapacity);

  return {
    availabilityMode: option?.availabilityMode ?? 'fixed_schedule',
    availableDates: buildAvailableDates(effectiveAvailableDays, now),
    startTimes: effectiveStartTimes,
    pickupTime: effectivePickupTime,
    minGuests,
    maxGuests,
    pricingMode: option?.pricingMode ?? 'per_person',
    price: option?.price ?? 0,
  };
}
