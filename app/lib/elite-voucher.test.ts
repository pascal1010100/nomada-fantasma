import { describe, it, expect, vi } from 'vitest';
import { buildCustomerActionEmail } from './email';

// Mock components to avoid rendering complexity during logic testing
vi.mock('@/app/components/emails/CustomerActionEmail', () => ({
  default: () => 'MockedEmailComponent'
}));

describe('Elite Voucher Logic (buildCustomerActionEmail)', () => {
    const baseData = {
        customerName: 'John Doe',
        serviceName: 'Test Adventure',
        date: '2026-12-25',
        requestId: 'req_123',
        price: 500,
        travelers: 2,
    };

    describe('Shuttle Scenarios', () => {
        it('should generate a correct shuttle voucher with logistics in English', () => {
            const result = buildCustomerActionEmail({
                ...baseData,
                template: 'booking_confirmed',
                kind: 'shuttle',
                locale: 'en-US',
                travelTime: '08:00 AM',
                pickupLocation: 'Hotel Atitlan',
            });

            expect(result.subject).toBe('Booking confirmed: Test Adventure');
            // Testing the return structure
            expect(result.react).toBeDefined();
        });

        it('should generate a correct shuttle voucher in Spanish', () => {
            const result = buildCustomerActionEmail({
                ...baseData,
                template: 'booking_confirmed',
                kind: 'shuttle',
                locale: 'es-GT',
                travelTime: '09:00 AM',
                pickupLocation: 'Parque Central',
            });

            expect(result.subject).toBe('Reserva confirmada: Test Adventure');
        });
    });

    describe('Tour Scenarios', () => {
        it('should generate a correct tour voucher with logistics in English', () => {
            const result = buildCustomerActionEmail({
                ...baseData,
                template: 'booking_confirmed',
                kind: 'tour',
                locale: 'en-US',
                pickupTime: '04:30 AM',
                meetingPoint: 'Dock 1',
            });

            expect(result.subject).toBe('Booking confirmed: Test Adventure');
        });

        it('should generate a correct tour voucher in Spanish', () => {
            const result = buildCustomerActionEmail({
                ...baseData,
                template: 'booking_confirmed',
                kind: 'tour',
                locale: 'es-GT',
                pickupTime: '05:00 AM',
                meetingPoint: 'Muelle Principal',
            });

            expect(result.subject).toBe('Reserva confirmada: Test Adventure');
        });
    });

    describe('Template Variations', () => {
        it('should handle payment instructions subject correctly', () => {
            const result = buildCustomerActionEmail({
                ...baseData,
                template: 'payment_instructions',
                kind: 'tour',
                locale: 'en-US',
            });

            expect(result.subject).toBe('Payment instructions: Test Adventure');
        });

        it('should handle not available subject correctly', () => {
            const result = buildCustomerActionEmail({
                ...baseData,
                template: 'not_available',
                kind: 'shuttle',
                locale: 'es-GT',
            });

            expect(result.subject).toBe('Actualización de disponibilidad: Test Adventure');
        });
    });
});
