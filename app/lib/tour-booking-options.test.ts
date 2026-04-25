import { describe, expect, it } from 'vitest';
import {
  buildAvailableDates,
  calculateBookingTotal,
  resolveBookingOptionConfig,
  type BookingOptionConfig,
} from './tour-booking-options';

const referenceNow = new Date('2026-04-25T12:00:00');

describe('tour booking option logic', () => {
  it('builds only Tuesday and Thursday dates for fixed weekday availability', () => {
    const dates = buildAvailableDates(['tuesday', 'thursday'], referenceNow);
    expect(dates.slice(0, 4)).toEqual([
      '2026-04-28',
      '2026-04-30',
      '2026-05-05',
      '2026-05-07',
    ]);
  });

  it('builds rolling dates for every-day request-based availability', () => {
    const dates = buildAvailableDates(['Every day'], referenceNow);
    expect(dates[0]).toBe('2026-04-26');
    expect(dates[1]).toBe('2026-04-27');
    expect(dates.length).toBeGreaterThan(20);
  });

  it('resolves basic group option with fixed schedule and 10:00 start time', () => {
    const option: BookingOptionConfig = {
      id: 'basic-group',
      name: 'Basic group ride',
      description: '',
      price: 350,
      pricingMode: 'per_person',
      availabilityMode: 'fixed_schedule',
      minGuests: 1,
      maxGuests: 10,
      availableDays: ['tuesday', 'thursday'],
      startTimes: ['10:00'],
    };

    const config = resolveBookingOptionConfig({
      option,
      availableDays: ['Every day'],
      maxCapacity: 10,
      now: referenceNow,
    });

    expect(config.availabilityMode).toBe('fixed_schedule');
    expect(config.startTimes).toEqual(['10:00']);
    expect(config.availableDates.slice(0, 2)).toEqual(['2026-04-28', '2026-04-30']);
    expect(config.minGuests).toBe(1);
  });

  it('resolves split-private option with request-based availability and minimum 2 guests', () => {
    const option: BookingOptionConfig = {
      id: 'extended-split-private',
      name: 'Extended / split-private ride',
      description: '',
      price: 500,
      pricingMode: 'per_person',
      availabilityMode: 'request_based',
      minGuests: 2,
      maxGuests: 10,
      availableDays: ['Every day'],
    };

    const config = resolveBookingOptionConfig({
      option,
      availableDays: ['tuesday', 'thursday'],
      startTimes: ['10:00'],
      maxCapacity: 10,
      now: referenceNow,
    });

    expect(config.availabilityMode).toBe('request_based');
    expect(config.startTimes).toEqual(['10:00']);
    expect(config.availableDates[0]).toBe('2026-04-26');
    expect(config.minGuests).toBe(2);
  });

  it('calculates per-person totals correctly', () => {
    expect(calculateBookingTotal(500, 2, 'per_person')).toBe(1000);
  });

  it('calculates per-group totals correctly', () => {
    expect(calculateBookingTotal(1000, 4, 'per_group')).toBe(1000);
  });

  it('resolves private ride with a minimum of 1 guest', () => {
    const option: BookingOptionConfig = {
      id: 'private-ride',
      name: 'Private ride',
      description: '',
      price: 1000,
      pricingMode: 'per_group',
      availabilityMode: 'request_based',
      minGuests: 1,
      maxGuests: 10,
      availableDays: ['Every day'],
    };

    const config = resolveBookingOptionConfig({
      option,
      availableDays: ['tuesday', 'thursday'],
      startTimes: ['10:00'],
      maxCapacity: 10,
      now: referenceNow,
    });

    expect(config.minGuests).toBe(1);
    expect(config.pricingMode).toBe('per_group');
    expect(config.availableDates[0]).toBe('2026-04-26');
  });
});
