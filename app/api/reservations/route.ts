
import { NextResponse } from 'next/server';
import { getTranslations } from 'next-intl/server';
import { supabaseAdmin } from '@/app/lib/supabase/server';
import { sendTourConfirmationEmails } from '@/app/lib/email';
import {
    CreateReservationSchema,
    sanitizeReservationInput,
    validateRequestBody,
} from '@/app/lib/validations';
import type { Database } from '@/types/database.types';
import type { ZodIssue } from 'zod';

type ReservationInsert = Database['public']['Tables']['reservations']['Insert'];
type ReservationRow = Database['public']['Tables']['reservations']['Row'];
type ReservationUpdate = Database['public']['Tables']['reservations']['Update'];
type LegacyReservationRow = {
    id: string;
    full_name?: string | null;
    email?: string | null;
    whatsapp?: string | null;
    date?: string | null;
    number_of_people?: number | null;
    tour_id?: string | null;
    tour_name?: string | null;
    total_price?: number | null;
    reservation_type?: string | null;
    status?: string | null;
    notes?: string | null;
    created_at?: string | null;
};
type ReservationRecord = ReservationRow | LegacyReservationRow;

const rateLimitStore = new Map<string, { count: number; start: number }>();
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;

// POST: Create a new reservation
export async function POST(request: Request) {
    try {
        const ipHeader = request.headers.get('x-forwarded-for') || '';
        const ip = ipHeader.split(',')[0].trim() || 'unknown';
        const now = Date.now();
        const entry = rateLimitStore.get(ip);
        if (!entry || now - entry.start > RATE_LIMIT_WINDOW_MS) {
            rateLimitStore.set(ip, { count: 1, start: now });
        } else {
            if (entry.count >= RATE_LIMIT_MAX) {
                return NextResponse.json(
                    { error: 'Demasiadas solicitudes. Intenta más tarde.' },
                    { status: 429 }
                );
            }
            entry.count += 1;
            rateLimitStore.set(ip, entry);
        }

        const url = new URL(request.url);
        const urlLocale = url.pathname.split('/')[1];
        const headerLocale = request.headers.get('x-locale');
        const acceptLanguage = request.headers.get('accept-language');
        const candidateLocale = headerLocale || acceptLanguage?.split(',')[0] || urlLocale || 'es';
        const localeToken = candidateLocale.split('-')[0].toLowerCase();
        const supportedLocales = ['es', 'en'] as const;
        const locale = supportedLocales.includes(localeToken as (typeof supportedLocales)[number])
            ? localeToken
            : 'es';

        // 2. Load translations
        const t = await getTranslations({ locale, namespace: 'ReservationEmail' });
        const tApi = await getTranslations({ locale, namespace: 'ReservationApi' });

        const getIssueKey = (issue: ZodIssue) => {
            const field = issue.path[0];
            if (field === 'tourId') return 'requiredTour';
            if (field === 'accommodationId') return 'requiredAccommodation';
            if (field === 'guideId') return 'requiredGuide';
            if (field === 'email') return 'invalidEmail';
            if (field === 'date') return 'invalidDate';
            if (field === 'guests') return 'invalidGuests';
            if (field === 'type') return 'invalidType';
            if (field === 'name') return 'invalidName';
            return 'invalidRequest';
        };

        // Validate request body with Zod
        const validation = await validateRequestBody(request, CreateReservationSchema);

        if (validation.error || !validation.data) {
            const issue = validation.issues?.[0];
            const key = issue ? getIssueKey(issue) : 'invalidRequest';
            return NextResponse.json(
                { error: tApi(`errors.${key}`) },
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
            customer_name: sanitizedData.customer_name,
            customer_email: sanitizedData.customer_email,
            customer_phone: sanitizedData.customer_phone,
            customer_country: sanitizedData.customer_country,
            reservation_date: sanitizedData.reservation_date,
            guests: sanitizedData.guests,
            reservation_type: sanitizedData.reservation_type,
            tour_id: sanitizedData.tour_id,
            accommodation_id: sanitizedData.accommodation_id,
            guide_id: sanitizedData.guide_id,
            tour_name: sanitizedData.tour_name,
            total_price: sanitizedData.total_price,
            customer_notes: sanitizedData.customer_notes,
        };

        // Insert into Supabase
        const insertResult = await supabaseAdmin
            .schema('public')
            .from('reservations')
            .insert(dataToInsert)
            .select()
            .single<ReservationRow>();
        let newReservation: ReservationRecord | null = insertResult.data;
        let dbError = insertResult.error;

        if (dbError) {
            const legacyInsert = {
                full_name: sanitizedData.customer_name,
                email: sanitizedData.customer_email,
                whatsapp: sanitizedData.customer_phone,
                date: sanitizedData.reservation_date,
                number_of_people: sanitizedData.guests,
                tour_id: sanitizedData.tour_id,
                tour_name: sanitizedData.tour_name,
                total_price: sanitizedData.total_price,
                reservation_type: sanitizedData.reservation_type,
                notes: sanitizedData.customer_notes,
            } as unknown as ReservationInsert;

            const legacyResult = await supabaseAdmin
                .schema('public')
                .from('reservations')
                .insert(legacyInsert)
                .select()
                .single<LegacyReservationRow>();

            if (legacyResult.error) {
                console.error('Supabase error:', dbError, legacyResult.error);
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
                    { error: 'Error al crear la reserva en la base de datos', debug },
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
            ('customer_email' in reservation ? reservation.customer_email : reservation.email) || '';
        const reservationName =
            ('customer_name' in reservation ? reservation.customer_name : reservation.full_name) || '';
        const reservationDate =
            ('reservation_date' in reservation ? reservation.reservation_date : reservation.date) || '';
        const reservationGuests =
            ('guests' in reservation ? reservation.guests : reservation.number_of_people) || 1;

        let emailSent: boolean | null = null;
        if (reservationEmail) {
            const emailResult = await sendTourConfirmationEmails({
                to: reservationEmail,
                reservationId: newReservation.id,
                customerName: reservationName,
                tourName:
                    ('tour_name' in reservation ? reservation.tour_name : reservation.tour_name) ||
                    'Tour Nómada Fantasma',
                date: reservationDate,
                guests: reservationGuests,
                totalPrice: ('total_price' in reservation ? reservation.total_price : reservation.total_price) || 0,
                t: t,
            });
            emailSent = emailResult.success;
            if (!emailResult.success) {
                console.warn('Email failed but reservation was saved to DB');
            }
        }

        // Update the reservation with the confirmation sent timestamp
        try {
            const updateConfirmation: ReservationUpdate = { confirmation_sent_at: new Date().toISOString() };
            await supabaseAdmin
                .from('reservations')
                .update(updateConfirmation)
                .eq('id', newReservation.id);
        } catch (updateError) {
            console.error('Failed to update confirmation timestamp:', updateError);
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
                    sent: emailSent,
                },
            },
            { status: 201 }
        );
    } catch (error) {
        console.error('Unexpected error creating reservation:', error);
        return NextResponse.json(
            { error: 'Error interno del servidor al procesar la reserva' },
            { status: 500 }
        );
    }
}

// GET: Retrieve all reservations (admin only - requires authentication in future)
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const status = searchParams.get('status');
        const email = searchParams.get('email');
        const limitParam = searchParams.get('limit');
        const parsedLimit = limitParam ? parseInt(limitParam, 10) : 100;
        const limit = Number.isFinite(parsedLimit) ? Math.min(Math.max(parsedLimit, 1), 200) : 100;

        // Build query
        let query = supabaseAdmin
            .from('reservations')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(limit);

        // Apply filters if provided
        if (status) {
            const validStatuses = ['pending', 'confirmed', 'cancelled', 'completed'] as const;
            if (validStatuses.includes(status as (typeof validStatuses)[number])) {
                query = query.eq('status', status as (typeof validStatuses)[number]);
            }
        }

        if (email) {
            query = query.eq('customer_email', email.toLowerCase());
        }

        const { data: reservations, error } = await query;

        if (error) {
            console.error('Supabase error:', error);
            return NextResponse.json(
                { error: 'Error al obtener las reservas' },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            reservations,
            total: reservations?.length || 0,
        });
    } catch (error) {
        console.error('Unexpected error fetching reservations:', error);
        return NextResponse.json(
            { error: 'Error interno del servidor' },
            { status: 500 }
        );
    }
}

// PATCH: Update reservation status (for future admin dashboard)
export async function PATCH(request: Request) {
    try {
        const body = await request.json();
        const { id, status, admin_notes } = body;

        if (!id || !status) {
            return NextResponse.json(
                { error: 'Se requiere ID y status' },
                { status: 400 }
            );
        }

        // Validate status
        const validStatuses = ['pending', 'confirmed', 'cancelled', 'completed'] as const;
        const statusValue = typeof status === 'string' ? status : '';
        if (!validStatuses.includes(statusValue as (typeof validStatuses)[number])) {
            return NextResponse.json(
                { error: 'Status inválido' },
                { status: 400 }
            );
        }

        const updateData: ReservationUpdate = { status: statusValue as (typeof validStatuses)[number] };

        if (status === 'confirmed' && !body.confirmed_at) {
            updateData.confirmed_at = new Date().toISOString();
        }

        if (status === 'cancelled' && !body.cancelled_at) {
            updateData.cancelled_at = new Date().toISOString();
        }

        if (admin_notes) {
            updateData.admin_notes = admin_notes;
        }

        const { data, error } = await supabaseAdmin
            .from('reservations')
            .update(updateData)
            .eq('id', id)
            .select()
            .single<ReservationRow>();

        if (error) {
            console.error('Supabase error:', error);
            return NextResponse.json(
                { error: 'Error al actualizar la reserva' },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            message: 'Reserva actualizada exitosamente',
            reservation: data,
        });
    } catch (error) {
        console.error('Unexpected error updating reservation:', error);
        return NextResponse.json(
            { error: 'Error interno del servidor' },
            { status: 500 }
        );
    }
}
