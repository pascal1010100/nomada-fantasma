// Validation schemas using Zod
// These schemas ensure data integrity before database operations

import { z } from 'zod';

// =====================================================
// RESERVATION SCHEMAS
// =====================================================

export const CreateReservationSchema = z.object({
    // Customer Info
    name: z.string().min(2, 'Name must be at least 2 characters').max(100),
    email: z.string().email('Invalid email address'),
    phone: z.string().optional(),
    country: z.string().optional(),

    // Reservation Details
    date: z.string().refine((date) => {
        const parsed = new Date(date);
        return !isNaN(parsed.getTime()) && parsed > new Date();
    }, 'Date must be in the future'),

    guests: z.number().int().positive('Number of guests must be positive').max(50, 'Too many guests'),

    // Type and Relations
    type: z.enum(['tour', 'accommodation', 'guide'], {
        message: 'Type must be tour, accommodation, or guide',
    }),

    tourId: z.string().uuid().optional(),
    accommodationId: z.string().uuid().optional(),
    guideId: z.string().uuid().optional(),

    // Backward compatibility
    tourName: z.string().optional(),

    // Pricing
    totalPrice: z.number().positive().optional(),

    // Notes
    notes: z.string().max(1000, 'Notes too long').optional(),
});

export type CreateReservationInput = z.infer<typeof CreateReservationSchema>;

// Sanitize and normalize reservation data
export function sanitizeReservationInput(input: CreateReservationInput) {
    return {
        customer_name: input.name.trim(),
        customer_email: input.email.toLowerCase().trim(),
        customer_phone: input.phone?.trim() || null,
        customer_country: input.country?.trim() || null,
        reservation_date: input.date,
        guests: input.guests,
        reservation_type: input.type,
        tour_id: input.tourId || null,
        accommodation_id: input.accommodationId || null,
        guide_id: input.guideId || null,
        tour_name: input.tourName?.trim() || null,
        total_price: input.totalPrice || null,
        customer_notes: input.notes?.trim() || null,
        status: 'pending' as const,
    };
}

// =====================================================
// TOUR SCHEMAS
// =====================================================

export const TourFilterSchema = z.object({
    puebloSlug: z.string().optional(),
    category: z.string().optional(),
    minPrice: z.number().positive().optional(),
    maxPrice: z.number().positive().optional(),
    difficulty: z.enum(['FÁCIL', 'MEDIO', 'DIFÍCIL', 'EXTREMO']).optional(),
    featured: z.boolean().optional(),
});

export type TourFilters = z.infer<typeof TourFilterSchema>;

// =====================================================
// GUIDE SCHEMAS
// =====================================================

export const GuideFilterSchema = z.object({
    puebloSlug: z.string().optional(),
    specialties: z.array(z.string()).optional(),
    languages: z.array(z.string()).optional(),
    minRating: z.number().min(0).max(5).optional(),
});

export type GuideFilters = z.infer<typeof GuideFilterSchema>;

// =====================================================
// HELPER FUNCTIONS
// =====================================================

// Validate and parse request body
export async function validateRequestBody<T>(
    request: Request,
    schema: z.ZodSchema<T>
): Promise<{ data: T; error: null } | { data: null; error: string }> {
    try {
        const body = await request.json();
        const data = schema.parse(body);
        return { data, error: null };
    } catch (error) {
        if (error instanceof z.ZodError) {
            const errorMessage = error.issues.map((e) => `${e.path.join('.')}: ${e.message}`).join(', ');
            return { data: null, error: errorMessage };
        }
        return { data: null, error: 'Invalid request body' };
    }
}

// Sanitize string input to prevent XSS
export function sanitizeString(input: string): string {
    return input
        .trim()
        .replace(/[<>]/g, '') // Remove potential HTML tags
        .slice(0, 1000); // Limit length
}
