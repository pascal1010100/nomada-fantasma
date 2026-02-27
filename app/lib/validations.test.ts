import { describe, it, expect } from 'vitest';
import {
  CreateReservationSchema,
  ShuttleRequestSchema,
  mapZodErrorToTranslationKey,
  sanitizeReservationInput,
} from './validations';
import { z } from 'zod';

describe('Validations', () => {
  describe('CreateReservationSchema', () => {
    it('should validate correct reservation', () => {
      const data = {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '1234567890',
        country: 'USA',
        date: '2026-12-25',
        guests: 2,
        type: 'tour' as const,
        tourId: '550e8400-e29b-41d4-a716-446655440000',
      };
      const result = CreateReservationSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it('should reject invalid email', () => {
      const data = {
        name: 'John',
        email: 'not-an-email',
        date: '2026-12-25',
        guests: 1,
        type: 'tour' as const,
      };
      const result = CreateReservationSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it('should reject name too short', () => {
      const data = {
        name: 'J',
        email: 'john@example.com',
        date: '2026-12-25',
        guests: 1,
        type: 'tour' as const,
      };
      const result = CreateReservationSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it('should reject past dates', () => {
      const data = {
        name: 'John Doe',
        email: 'john@example.com',
        date: '2020-01-01',
        guests: 1,
        type: 'tour' as const,
      };
      const result = CreateReservationSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it('should reject invalid guests count', () => {
      const data = {
        name: 'John Doe',
        email: 'john@example.com',
        date: '2026-12-25',
        guests: 0,
        type: 'tour' as const,
      };
      const result = CreateReservationSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it('should reject guest count > 50', () => {
      const data = {
        name: 'John Doe',
        email: 'john@example.com',
        date: '2026-12-25',
        guests: 51,
        type: 'tour' as const,
      };
      const result = CreateReservationSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it('should require tourId for tour type', () => {
      const data = {
        name: 'John Doe',
        email: 'john@example.com',
        date: '2026-12-25',
        guests: 1,
        type: 'tour' as const,
      };
      const result = CreateReservationSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it('should accept tourName as alternative to tourId', () => {
      const data = {
        name: 'John Doe',
        email: 'john@example.com',
        date: '2026-12-25',
        guests: 1,
        type: 'tour' as const,
        tourName: 'Hike to Lake',
      };
      const result = CreateReservationSchema.safeParse(data);
      expect(result.success).toBe(true);
    });
  });

  describe('ShuttleRequestSchema', () => {
    it('should validate correct shuttle request', () => {
      const data = {
        customerName: 'John Doe',
        customerEmail: 'john@example.com',
        routeOrigin: 'Panajachel',
        routeDestination: 'Chichicastenango',
        date: '2026-03-15',
        time: '10:00',
        passengers: 4,
        pickupLocation: 'Hotel Example, Panajachel',
        type: 'shared' as const,
      };
      const result = ShuttleRequestSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it('should reject invalid email', () => {
      const data = {
        customerName: 'John',
        customerEmail: 'invalid',
        routeOrigin: 'A',
        routeDestination: 'B',
        date: '2026-03-15',
        time: '10:00',
        passengers: 1,
        pickupLocation: 'Location here',
      };
      const result = ShuttleRequestSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it('should reject name too short', () => {
      const data = {
        customerName: 'J',
        customerEmail: 'john@example.com',
        routeOrigin: 'A',
        routeDestination: 'B',
        date: '2026-03-15',
        time: '10:00',
        passengers: 1,
        pickupLocation: 'Location here',
      };
      const result = ShuttleRequestSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it('should reject zero passengers', () => {
      const data = {
        customerName: 'John Doe',
        customerEmail: 'john@example.com',
        routeOrigin: 'A',
        routeDestination: 'B',
        date: '2026-03-15',
        time: '10:00',
        passengers: 0,
        pickupLocation: 'Location here',
      };
      const result = ShuttleRequestSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it('should reject pickup location too short', () => {
      const data = {
        customerName: 'John Doe',
        customerEmail: 'john@example.com',
        routeOrigin: 'A',
        routeDestination: 'B',
        date: '2026-03-15',
        time: '10:00',
        passengers: 1,
        pickupLocation: 'Loc',
      };
      const result = ShuttleRequestSchema.safeParse(data);
      expect(result.success).toBe(false);
    });
  });

  describe('mapZodErrorToTranslationKey', () => {
    it('should map name too short error', () => {
      const schema = z.object({ name: z.string().min(2) });
      const result = schema.safeParse({ name: 'J' });
      if (!result.success) {
        const key = mapZodErrorToTranslationKey(result.error.issues[0]);
        expect(key).toBe('nameTooShort');
      }
    });

    it('should map invalid email error', () => {
      const schema = z.object({ email: z.string().email() });
      const result = schema.safeParse({ email: 'invalid' });
      if (!result.success) {
        const key = mapZodErrorToTranslationKey(result.error.issues[0]);
        expect(key).toBe('invalidEmail');
      }
    });

    it('should map custom errors', () => {
      const schema = z.object({
        origin: z.string().min(1),
      });
      const result = schema.safeParse({ origin: '' });
      if (!result.success) {
        const key = mapZodErrorToTranslationKey(result.error.issues[0]);
        expect(['originRequired', 'nameTooShort']).toContain(key);
      }
    });
  });

  describe('sanitizeReservationInput', () => {
    it('should trim and lowercase email', () => {
      const input = {
        name: 'John Doe',
        email: '  JOHN@EXAMPLE.COM  ',
        type: 'tour' as const,
        date: '2026-12-25',
        guests: 1,
        tourId: '550e8400-e29b-41d4-a716-446655440000',
      };
      const sanitized = sanitizeReservationInput(input);
      expect(sanitized.customer_email).toBe('john@example.com');
    });

    it('should trim name', () => {
      const input = {
        name: '  John Doe  ',
        email: 'john@example.com',
        type: 'tour' as const,
        date: '2026-12-25',
        guests: 1,
        tourId: '550e8400-e29b-41d4-a716-446655440000',
      };
      const sanitized = sanitizeReservationInput(input);
      expect(sanitized.customer_name).toBe('John Doe');
    });

    it('should handle optional fields', () => {
      const input = {
        name: 'John Doe',
        email: 'john@example.com',
        type: 'accommodation' as const,
        date: '2026-12-25',
        guests: 1,
      };
      const sanitized = sanitizeReservationInput(input);
      expect(sanitized.customer_phone).toBeNull();
      expect(sanitized.tour_id).toBeNull();
    });
  });
});
