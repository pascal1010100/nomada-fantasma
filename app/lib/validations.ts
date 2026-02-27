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
    date: z.string().refine((value) => {
        const trimmed = value.trim();
        const parsed = /^\d{4}-\d{2}-\d{2}$/.test(trimmed)
            ? new Date(`${trimmed}T12:00:00`)
            : new Date(trimmed);
        if (isNaN(parsed.getTime())) {
            return false;
        }
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return parsed.getTime() > today.getTime();
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
}).superRefine((data, ctx) => {
    if (data.type === 'tour' && !data.tourId && !data.tourName) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['tourId'],
            message: 'tourId or tourName is required for tour reservations',
        });
    }
    if (data.type === 'accommodation' && !data.accommodationId) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['accommodationId'],
            message: 'accommodationId is required for accommodation reservations',
        });
    }
    if (data.type === 'guide' && !data.guideId) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['guideId'],
            message: 'guideId is required for guide reservations',
        });
    }
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
// SHUTTLE SCHEMAS
// =====================================================

// ShuttleRequestSchema - Messages are generic since we map to translations
// The mapZodErrorToTranslationKey function will provide localized messages
export const ShuttleRequestSchema = z.object({
    customerName: z.string().min(2), // Mapped to 'nameTooShort'
    customerEmail: z.string().email(), // Mapped to 'invalidEmail'
    routeOrigin: z.string().min(1), // Mapped to 'originRequired'
    routeDestination: z.string().min(1), // Mapped to 'destinationRequired'
    date: z.string().min(1), // Mapped to 'dateRequired'
    time: z.string().min(1), // Mapped to 'timeRequired'
    passengers: z.number().int().min(1), // Mapped to 'minPassengers'
    pickupLocation: z.string().min(5), // Mapped to 'pickupLocationRequired'
    type: z.enum(['shared', 'private']).optional(),
});

export type ShuttleRequestInput = z.infer<typeof ShuttleRequestSchema>;

// =====================================================
// HELPER FUNCTIONS
// =====================================================

/**
 * Maps Zod validation errors to translation keys
 * This allows us to use translations for validation messages
 * 
 * @param issue - Zod validation issue
 * @returns Translation key for the error
 */
export function mapZodErrorToTranslationKey(issue: z.ZodIssue): string {
    const field = issue.path[0]?.toString() || '';
    const code = issue.code;

    // Map field names to translation keys
    const fieldMap: Record<string, string> = {
        'customerName': 'name',
        'name': 'name',
        'customerEmail': 'email',
        'email': 'email',
        'routeOrigin': 'origin',
        'routeDestination': 'destination',
        'date': 'date',
        'time': 'time',
        'passengers': 'passengers',
        'pickupLocation': 'pickupLocation',
    };

    const mappedField = fieldMap[field] || field;

    // Map error codes to translation keys
    switch (code) {
        case z.ZodIssueCode.too_small:
            if (mappedField === 'name') return 'nameTooShort';
            if (mappedField === 'passengers') return 'minPassengers';
            if (mappedField === 'pickupLocation') return 'pickupLocationRequired';
            return 'nameTooShort'; // fallback

        case z.ZodIssueCode.invalid_type:
            if (mappedField === 'email') return 'invalidEmail';
            return 'invalidEmail'; // fallback

        case z.ZodIssueCode.invalid_format:
            if (mappedField === 'email') return 'invalidEmail';
            return 'invalidEmail'; // fallback

        case z.ZodIssueCode.too_big:
            // Handle max length errors if needed
            return 'nameTooShort'; // fallback

        case z.ZodIssueCode.invalid_value:
            return 'invalidEmail'; // fallback

        case z.ZodIssueCode.custom: {
            // For custom errors, try to extract from message
            const message = issue.message.toLowerCase();
            if (message.includes('origen')) return 'originRequired';
            if (message.includes('destino')) return 'destinationRequired';
            if (message.includes('fecha')) return 'dateRequired';
            if (message.includes('hora')) return 'timeRequired';
            if (message.includes('nombre')) return 'nameRequired';
            if (message.includes('email')) return 'invalidEmail';
            return 'nameRequired'; // fallback
        }

        default:
            // Default mappings based on field
            if (mappedField === 'origin') return 'originRequired';
            if (mappedField === 'destination') return 'destinationRequired';
            if (mappedField === 'date') return 'dateRequired';
            if (mappedField === 'time') return 'timeRequired';
            if (mappedField === 'name') return 'nameRequired';
            if (mappedField === 'email') return 'invalidEmail';
            return 'nameRequired'; // fallback
    }
}

// Validate and parse request body
export async function validateRequestBody<T>(
    request: Request,
    schema: z.ZodSchema<T>
): Promise<
    | { data: T; error: null; issues: null }
    | { data: null; error: string; issues: z.ZodIssue[] | null }
> {
    try {
        const body = await request.json();
        const data = schema.parse(body);
        return { data, error: null, issues: null };
    } catch (error) {
        if (error instanceof z.ZodError) {
            return { data: null, error: 'ValidationError', issues: error.issues };
        }
        return { data: null, error: 'Invalid request body', issues: null };
    }
}

// Sanitize string input to prevent XSS
export function sanitizeString(input: string): string {
    return input
        .trim()
        .replace(/[<>]/g, '') // Remove potential HTML tags
        .slice(0, 1000); // Limit length
}
