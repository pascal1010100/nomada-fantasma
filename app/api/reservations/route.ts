
import { NextResponse } from 'next/server';
import { getTranslations } from 'next-intl/server';
import { supabaseAdmin } from '@/app/lib/supabase/server';
import { sendTourConfirmationEmails } from '@/app/lib/email';
import { checkRateLimit, getClientIP } from '@/app/lib/rate-limit';
import { getLocaleFromRequest } from '@/app/lib/locale';
import logger from '@/app/lib/logger';
import { isAdminRequestAuthorized } from '@/app/lib/admin-auth';
import {
    CreateReservationSchema,
    sanitizeReservationInput,
    validateRequestBody,
    mapZodErrorToTranslationKey,
} from '@/app/lib/validations';
import type { Database } from '@/types/database.types';

type ReservationInsert = Database['public']['Tables']['reservations']['Insert'];
type ReservationRow = Database['public']['Tables']['reservations']['Row'];
type ReservationUpdate = Database['public']['Tables']['reservations']['Update'];
type LegacyReservationRow = {
    id: string;
    customer_name?: string | null;
    customer_email?: string | null;
    customer_phone?: string | null;
    reservation_date?: string | null;
    guests?: number | null;
    tour_id?: string | null;
    tour_name?: string | null;
    total_price?: number | null;
    reservation_type?: string | null;
    status?: string | null;
    customer_notes?: string | null;
    created_at?: string | null;
};
type ReservationRecord = ReservationRow | LegacyReservationRow;
const DEFAULT_AGENCY_EMAIL = process.env.DEFAULT_AGENCY_EMAIL?.trim() || null;

function normalizeEmail(value: string | null | undefined): string | null {
    const candidate = value?.trim();
    if (!candidate) return null;
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(candidate) ? candidate : null;
}

async function getTourAgencyEmail(tourId: string | null | undefined): Promise<string | null> {
    if (!tourId) return normalizeEmail(DEFAULT_AGENCY_EMAIL);

    const tourResult = await supabaseAdmin
        .schema('public')
        .from('tours')
        .select('agency_id, title')
        .eq('id', tourId)
        .maybeSingle<{ agency_id: string | null; title: string | null }>();

    if (tourResult.error) {
        logger.warn('Unable to resolve tour agency assignment:', tourResult.error);
        return normalizeEmail(DEFAULT_AGENCY_EMAIL);
    }

    const agencyId = tourResult.data?.agency_id;
    if (!agencyId) return normalizeEmail(DEFAULT_AGENCY_EMAIL);

    const agencyResult = await supabaseAdmin
        .schema('public')
        .from('agencies')
        .select('email, is_active')
        .eq('id', agencyId)
        .maybeSingle<{ email: string | null; is_active: boolean | null }>();

    if (agencyResult.error) {
        logger.warn('Unable to resolve agency email for tour:', agencyResult.error);
        return normalizeEmail(DEFAULT_AGENCY_EMAIL);
    }

    if (!agencyResult.data?.is_active) return normalizeEmail(DEFAULT_AGENCY_EMAIL);
    return normalizeEmail(agencyResult.data.email) ?? normalizeEmail(DEFAULT_AGENCY_EMAIL);
}

// POST: Create a new reservation
export async function POST(request: Request) {
    try {
        // Detect locale FIRST (before rate limiting to use translations)
        const locale = getLocaleFromRequest(request);
        const t = await getTranslations({ locale, namespace: 'ReservationEmail' });
        const tApi = await getTranslations({ locale, namespace: 'ReservationApi' });

        // Rate limiting
        const ip = getClientIP(request);
        const rateLimitResult = checkRateLimit(ip);
        
        if (!rateLimitResult.allowed) {
            return NextResponse.json(
                { 
                    error: tApi('rateLimitExceeded'),
                    retryAfter: rateLimitResult.retryAfter 
                },
                { 
                    status: 429,
                    headers: {
                        'Retry-After': rateLimitResult.retryAfter?.toString() || '600',
                        'X-RateLimit-Limit': '5',
                        'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
                        'X-RateLimit-Reset': new Date(rateLimitResult.resetAt).toISOString(),
                    }
                }
            );
        }

        // Validate request body with Zod
        const validation = await validateRequestBody(request, CreateReservationSchema);

        if (validation.error || !validation.data) {
            const issue = validation.issues?.[0];
            if (issue) {
                // Check if it's a custom error (tourId, accommodationId, guideId)
                const field = issue.path[0]?.toString() || '';
                if (field === 'tourId' && issue.code === 'custom') {
                    return NextResponse.json(
                        { error: tApi('errors.requiredTour') },
                        { status: 400 }
                    );
                }
                if (field === 'accommodationId' && issue.code === 'custom') {
                    return NextResponse.json(
                        { error: tApi('errors.requiredAccommodation') },
                        { status: 400 }
                    );
                }
                if (field === 'guideId' && issue.code === 'custom') {
                    return NextResponse.json(
                        { error: tApi('errors.requiredGuide') },
                        { status: 400 }
                    );
                }
                // For other errors, use the mapper
                const translationKey = mapZodErrorToTranslationKey(issue);
                const tValidation = await getTranslations({ locale, namespace: 'ValidationErrors' });
                // Try ValidationErrors first, fallback to ReservationApi.errors
                try {
                    return NextResponse.json(
                        { error: tValidation(translationKey) },
                        { status: 400 }
                    );
                } catch {
                    // Fallback to ReservationApi if ValidationErrors key doesn't exist
                    const errorKey = translationKey === 'invalidEmail' ? 'invalidEmail' : 'invalidRequest';
                    return NextResponse.json(
                        { error: tApi(`errors.${errorKey}`) },
                        { status: 400 }
                    );
                }
            }
            return NextResponse.json(
                { error: tApi('errors.invalidRequest') },
                { status: 400 }
            );
        }

        // Sanitize and normalize input
        const sanitizedData = sanitizeReservationInput(validation.data);

        if (sanitizedData.reservation_type === 'tour' && !sanitizedData.tour_id && !sanitizedData.tour_name) {
            return NextResponse.json(
                { error: tApi('errors.requiredTour') },
                { status: 400 }
            );
        }

        if (sanitizedData.reservation_type === 'accommodation' && !sanitizedData.accommodation_id) {
            return NextResponse.json(
                { error: tApi('errors.requiredAccommodation') },
                { status: 400 }
            );
        }

        if (sanitizedData.reservation_type === 'guide' && !sanitizedData.guide_id) {
            return NextResponse.json(
                { error: tApi('errors.requiredGuide') },
                { status: 400 }
            );
        }

        // Explicitly create an object with only the fields for insertion
        const dataToInsert: ReservationInsert = {
            full_name: sanitizedData.full_name,
            email: sanitizedData.email,
            whatsapp: sanitizedData.whatsapp,
            date: sanitizedData.date,
            number_of_people: sanitizedData.number_of_people,
            reservation_type: sanitizedData.reservation_type,
            tour_id: sanitizedData.tour_id,
            accommodation_id: sanitizedData.accommodation_id,
            guide_id: sanitizedData.guide_id,
            tour_name: sanitizedData.tour_name,
            total_price: sanitizedData.total_price,
            notes: sanitizedData.notes,
            status: 'pending',
        };

        // Insert into Supabase
        const insertResult = await supabaseAdmin
            .schema('public')
            .from('reservations')
            .insert([dataToInsert])
            .select()
            .single<ReservationRow>();
        let newReservation: ReservationRecord | null = insertResult.data;
        let dbError = insertResult.error;

        if (dbError) {
            const legacyInsert = {
                customer_name: sanitizedData.full_name,
                customer_email: sanitizedData.email,
                customer_phone: sanitizedData.whatsapp,
                reservation_date: sanitizedData.date,
                guests: sanitizedData.number_of_people,
                tour_id: sanitizedData.tour_id,
                tour_name: sanitizedData.tour_name,
                total_price: sanitizedData.total_price,
                reservation_type: sanitizedData.reservation_type,
                customer_notes: sanitizedData.notes,
                status: 'pending',
            } as unknown as ReservationInsert;

            const legacyResult = await supabaseAdmin
                .schema('public')
                .from('reservations')
                .insert([legacyInsert])
                .select()
                .single<LegacyReservationRow>();

            if (legacyResult.error) {
                logger.error('Supabase error:', dbError, legacyResult.error);
                const debug =
                    process.env.NODE_ENV !== 'production'
                        ? {
                              message: legacyResult.error.message,
                              code: legacyResult.error.code,
                              details: legacyResult.error.details,
                              hint: legacyResult.error.hint,
                          }
                        : undefined;
                return NextResponse.json(
                    { error: tApi('databaseErrorCreate'), debug },
                    { status: 500 }
                );
            }

            newReservation = legacyResult.data;
        }

        if (!newReservation) {
            const debug =
                process.env.NODE_ENV !== 'production'
                    ? {
                          message: dbError?.message,
                          code: dbError?.code,
                          details: dbError?.details,
                          hint: dbError?.hint,
                      }
                    : undefined;
            return NextResponse.json(
                { error: 'No se pudo crear la reserva', debug },
                { status: 500 }
            );
        }

        const reservation = newReservation as ReservationRecord;
        const reservationEmail =
            ('email' in reservation ? reservation.email : reservation.customer_email) || '';
        const reservationName =
            ('full_name' in reservation ? reservation.full_name : reservation.customer_name) || '';
        const reservationDate =
            ('date' in reservation ? reservation.date : reservation.reservation_date) || '';
        const reservationGuests =
            ('number_of_people' in reservation ? reservation.number_of_people : reservation.guests) || 1;
        const reservationPhone =
            ('whatsapp' in reservation ? reservation.whatsapp : reservation.customer_phone) || '';
        const reservationNotes =
            ('notes' in reservation ? reservation.notes : reservation.customer_notes) || '';
        const currentAttempts =
            'email_attempts' in reservation && typeof reservation.email_attempts === 'number'
                ? reservation.email_attempts
                : 0;

        let emailSent: boolean | null = null;
        let customerEmailSent: boolean | null = null;
        let emailRecipientStatuses: Array<{ label: string; status: 'sent' | 'failed' }> = [];
        let emailError: string | null = null;
        let emailAttempted = false;

        if (reservationEmail) {
            emailAttempted = true;
            const reservationTourId = 'tour_id' in reservation ? reservation.tour_id : null;
            let resolvedTourName =
                ('tour_name' in reservation ? reservation.tour_name : reservation.tour_name) ||
                null;

            if (!resolvedTourName && reservationTourId) {
                const tourLookup = await supabaseAdmin
                    .schema('public')
                    .from('tours')
                    .select('title')
                    .eq('id', reservationTourId)
                    .maybeSingle<{ title: string | null }>();

                if (tourLookup.data?.title) {
                    resolvedTourName = tourLookup.data.title;
                }
            }

            if (!resolvedTourName) {
                resolvedTourName = 'Tour Nómada Fantasma';
            }

            const agencyEmail = await getTourAgencyEmail(reservationTourId);
            const emailResult = await sendTourConfirmationEmails({
                to: reservationEmail,
                agencyEmail,
                reservationId: newReservation.id,
                customerName: reservationName,
                customerPhone: reservationPhone,
                customerNotes: reservationNotes,
                tourName: resolvedTourName,
                date: reservationDate,
                guests: reservationGuests,
                totalPrice: ('total_price' in reservation ? reservation.total_price : reservation.total_price) || 0,
                t: t,
            });
            emailSent = emailResult.success;
            const customerRecipient = emailResult.recipients.find((recipient) => recipient.label === 'tour_customer');
            customerEmailSent = customerRecipient ? customerRecipient.success : emailResult.success;
            emailRecipientStatuses = emailResult.recipients.map((recipient) => ({
                label: recipient.label,
                status: recipient.success ? 'sent' : 'failed',
            }));
            if (!emailResult.success) {
                const rawError = emailResult.error;
                emailError =
                    rawError instanceof Error
                        ? rawError.message
                        : typeof rawError === 'string'
                          ? rawError
                          : rawError
                            ? JSON.stringify(rawError)
                            : 'Unknown email error';
                logger.warn('Email failed but reservation was saved to DB');
            }
        }

        // Track email delivery outcome for operations
        try {
            const nowIso = new Date().toISOString();
            const updateConfirmation: ReservationUpdate = {
                email_delivery_status: emailAttempted
                    ? emailSent
                        ? 'sent'
                        : 'failed'
                    : 'not_requested',
                email_attempts: currentAttempts + (emailAttempted ? 1 : 0),
                email_last_attempt_at: emailAttempted ? nowIso : null,
                email_last_error: emailAttempted && emailSent === false ? emailError : null,
            };

            const updateResult = await supabaseAdmin
                .schema('public')
                .from('reservations')
                .update(updateConfirmation)
                .eq('id', newReservation.id);

            if (updateResult.error) {
                logger.error('Failed to update email tracking fields:', updateResult.error);
            }
        } catch (updateError) {
            logger.error('Failed to update email tracking fields:', updateError);
        }

        return NextResponse.json(
            {
                success: true,
                message: 'Reserva creada exitosamente',
                reservation: {
                    id: newReservation.id,
                    customer_name: reservationName,
                    customer_email: reservationEmail,
                    reservation_date: reservationDate,
                    guests: reservationGuests,
                    status: newReservation.status,
                    created_at: newReservation.created_at,
                },
                email: {
                    sent: emailAttempted ? (customerEmailSent ?? emailSent) : null,
                    status: emailAttempted ? ((customerEmailSent ?? emailSent) ? 'sent' : 'failed') : 'not_requested',
                    recipients: emailRecipientStatuses,
                },
            },
            { status: 201 }
        );
    } catch (error) {
        logger.error('Unexpected error creating reservation:', error);
        return NextResponse.json(
            { error: 'Error interno del servidor al procesar la reserva' },
            { status: 500 }
        );
    }
}

// GET: Retrieve all reservations (admin only - requires authentication in future)
export async function GET(request: Request) {
    try {
        if (!isAdminRequestAuthorized(request)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Detect locale from request
        const locale = getLocaleFromRequest(request);
        const tApi = await getTranslations({ locale, namespace: 'ReservationApi' });

        const { searchParams } = new URL(request.url);
        const status = searchParams.get('status');
        const email = searchParams.get('email');
        const limitParam = searchParams.get('limit');
        const parsedLimit = limitParam ? parseInt(limitParam, 10) : 100;
        const limit = Number.isFinite(parsedLimit) ? Math.min(Math.max(parsedLimit, 1), 200) : 100;

        // Build query
        let query = supabaseAdmin
            .schema('public')
            .from('reservations')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(limit);

        // Apply filters if provided
        if (status) {
            const validStatuses = ['pending', 'processing', 'confirmed', 'cancelled', 'completed'] as const;
            if (validStatuses.includes(status as (typeof validStatuses)[number])) {
                query = query.eq('status', status as (typeof validStatuses)[number]);
            }
        }

        if (email) {
            query = query.eq('email', email.toLowerCase());
        }

        const { data: reservations, error } = await query;

        if (error) {
            console.error('Supabase error:', error);
            return NextResponse.json(
                { error: tApi('databaseErrorFetch') },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            reservations,
            total: reservations?.length || 0,
        });
    } catch (error) {
        logger.error('Unexpected error fetching reservations:', error);
        const locale = getLocaleFromRequest(request);
        const tApi = await getTranslations({ locale, namespace: 'ReservationApi' });
        return NextResponse.json(
            { error: tApi('internalError') },
            { status: 500 }
        );
    }
}

// PATCH: Deprecated for status updates.
// Status transitions must go through /api/internal/requests/status
// to enforce operational rules, audit trail, and conflict handling.
export async function PATCH(request: Request) {
    try {
        if (!isAdminRequestAuthorized(request)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        return NextResponse.json({
            error: 'Deprecated endpoint. Use /api/internal/requests/status for operational transitions.',
        }, { status: 410 });
    } catch (error) {
        logger.error('Unexpected error in deprecated reservations PATCH endpoint:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
