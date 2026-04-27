import { NextResponse } from 'next/server';
import { getTranslations } from 'next-intl/server';
import { sendShuttleConfirmationEmails } from '@/app/lib/email';
import { supabaseAdmin } from '@/app/lib/supabase/server';
import { checkRateLimitShared, getClientIP } from '@/app/lib/rate-limit';
import { getLocaleFromRequest } from '@/app/lib/locale';
import logger from '@/app/lib/logger';
import { buildRequestMetadataNote } from '@/app/lib/request-metadata';
import { recordInternalNotification } from '@/app/lib/internal-notifications';
import { ShuttleRequestSchema, mapZodErrorToTranslationKey } from '@/app/lib/validations';
import type { Database } from '@/types/database.types';

type ShuttleBookingInsert = Database['public']['Tables']['shuttle_bookings']['Insert'];
type ShuttleBookingRow = Database['public']['Tables']['shuttle_bookings']['Row'];
type ShuttleBookingUpdate = Database['public']['Tables']['shuttle_bookings']['Update'];
const DEFAULT_AGENCY_EMAIL =
    process.env.DEFAULT_AGENCY_EMAIL?.trim() ||
    process.env.ADMIN_EMAIL?.trim() ||
    null;

type ShuttleRouteAssignment = {
    routeId: string | null;
    agencyId: string | null;
    agencyEmail: string | null;
    price?: number;
    schedule: string[];
    routeFound: boolean;
};

function normalizeEmail(value: string | null | undefined): string | null {
    const candidate = value?.trim();
    if (!candidate) return null;
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(candidate) ? candidate : null;
}

async function getShuttleRouteAssignment(
    origin: string,
    destination: string,
    type: string
): Promise<ShuttleRouteAssignment> {
    const fallbackAgencyEmail = normalizeEmail(DEFAULT_AGENCY_EMAIL);
    const routeResult = await supabaseAdmin
        .schema('public')
        .from('shuttle_routes')
        .select('id, agency_id, price, schedule')
        .eq('origin', origin)
        .eq('destination', destination)
        .eq('type', type)
        .limit(1)
        .maybeSingle<{ id: string; agency_id: string | null; price: number | null; schedule: string[] | null }>();

    if (routeResult.error) {
        logger.warn('Unable to resolve shuttle route agency assignment:', routeResult.error);
        return { routeId: null, agencyId: null, agencyEmail: fallbackAgencyEmail, schedule: [], routeFound: false };
    }

    if (!routeResult.data) {
        return { routeId: null, agencyId: null, agencyEmail: fallbackAgencyEmail, schedule: [], routeFound: false };
    }

    const agencyId = routeResult.data?.agency_id;
    const price = typeof routeResult.data?.price === 'number' ? routeResult.data.price : undefined;
    const base = {
        routeId: routeResult.data.id,
        agencyId,
        price,
        schedule: routeResult.data.schedule ?? [],
        routeFound: true,
    };
    if (!agencyId) return { ...base, agencyEmail: fallbackAgencyEmail };

    const agencyResult = await supabaseAdmin
        .schema('public')
        .from('agencies')
        .select('email, is_active')
        .eq('id', agencyId)
        .maybeSingle<{ email: string | null; is_active: boolean | null }>();

    if (agencyResult.error) {
        logger.warn('Unable to resolve agency email for shuttle route:', agencyResult.error);
        return { ...base, agencyEmail: fallbackAgencyEmail };
    }

    if (!agencyResult.data?.is_active) return { ...base, agencyEmail: fallbackAgencyEmail };
    return { ...base, agencyEmail: normalizeEmail(agencyResult.data.email) ?? fallbackAgencyEmail };
}

function scheduleAllowsTime(schedule: string[], requestedTime: string): boolean {
    if (schedule.length === 0) return true;
    return schedule.includes(requestedTime);
}

function getErrorMessage(error: unknown, fallback: string): string {
    if (error instanceof Error) return error.message;
    if (typeof error === 'string') return error;
    if (error) return JSON.stringify(error);
    return fallback;
}

export async function POST(request: Request) {
    try {
        // Detect locale FIRST (before rate limiting to use translations)
        const locale = getLocaleFromRequest(request);
        const tApi = await getTranslations({ locale, namespace: 'ReservationApi' });

        // Rate limiting
        const ip = getClientIP(request);
        const rateLimitResult = await checkRateLimitShared(ip);
        
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

        const body = await request.json();
        const validation = ShuttleRequestSchema.safeParse(body);

        if (!validation.success) {
            // Map Zod error to translation key
            const firstIssue = validation.error.issues[0];
            const translationKey = mapZodErrorToTranslationKey(firstIssue);
            const tValidation = await getTranslations({ locale, namespace: 'ValidationErrors' });
            
            return NextResponse.json(
                { error: tValidation(translationKey) },
                { status: 400 }
            );
        }

        const data = validation.data;
        const tEmail = await getTranslations({ locale, namespace: 'ShuttleEmail' });
        const bookingType = data.type || 'shared';
        const routeAssignment = await getShuttleRouteAssignment(data.routeOrigin, data.routeDestination, bookingType);
        const { routeId, agencyId, agencyEmail, price } = routeAssignment;

        if (bookingType === 'shared' && !routeAssignment.routeFound) {
            return NextResponse.json(
                { error: locale.startsWith('en') ? 'This shuttle route is not available.' : 'Esta ruta de shuttle no está disponible.' },
                { status: 400 }
            );
        }

        if (routeAssignment.routeFound && !scheduleAllowsTime(routeAssignment.schedule, data.time)) {
            return NextResponse.json(
                { error: locale.startsWith('en') ? 'This time is not available for the selected route.' : 'Ese horario no está disponible para la ruta seleccionada.' },
                { status: 400 }
            );
        }

        const metadataNote = buildRequestMetadataNote({ locale, price });

        // 1. Persist to Supabase
        const payload: ShuttleBookingInsert = {
            customer_name: data.customerName,
            customer_email: data.customerEmail,
            customer_whatsapp: data.customerWhatsapp,
            route_origin: data.routeOrigin,
            route_destination: data.routeDestination,
            travel_date: data.date,
            travel_time: data.time,
            passengers: data.passengers,
            pickup_location: data.pickupLocation,
            type: bookingType,
            status: 'pending',
            customer_locale: locale,
            admin_notes: metadataNote,
            route_id: routeId,
            agency_id: agencyId,
            price: price ?? null,
        };

        let booking: ShuttleBookingRow | null = null;
        let dbError: { message?: string } | null = null;

        const insertWithLocale = await supabaseAdmin
            .from('shuttle_bookings')
            .insert(payload)
            .select()
            .single<ShuttleBookingRow>();

        booking = insertWithLocale.data;
        dbError = insertWithLocale.error;

        if (
            dbError &&
            typeof dbError.message === 'string' &&
            (
                dbError.message.includes('customer_locale') ||
                dbError.message.includes('customer_whatsapp') ||
                dbError.message.includes('route_id') ||
                dbError.message.includes('agency_id') ||
                dbError.message.includes('price')
            )
        ) {
            const fallbackPayload: ShuttleBookingInsert = {
                customer_name: data.customerName,
                customer_email: data.customerEmail,
                route_origin: data.routeOrigin,
                route_destination: data.routeDestination,
                travel_date: data.date,
                travel_time: data.time,
                passengers: data.passengers,
                pickup_location: data.pickupLocation,
                type: bookingType,
                status: 'pending',
                admin_notes: metadataNote,
                route_id: routeId,
                agency_id: agencyId,
                price: price ?? null,
            };
            if ('customer_whatsapp' in fallbackPayload) {
                delete fallbackPayload.customer_whatsapp;
            }
            if ('route_id' in fallbackPayload) {
                delete fallbackPayload.route_id;
            }
            if ('agency_id' in fallbackPayload) {
                delete fallbackPayload.agency_id;
            }
            if ('price' in fallbackPayload) {
                delete fallbackPayload.price;
            }
            const fallbackInsert = await supabaseAdmin
                .from('shuttle_bookings')
                .insert(fallbackPayload)
                .select()
                .single<ShuttleBookingRow>();
            booking = fallbackInsert.data;
            dbError = fallbackInsert.error;
        }

        if (dbError) {
            console.error('Error saving to Supabase:', dbError);
            return NextResponse.json(
                { error: tApi('databaseError') },
                { status: 500 }
            );
        }

        // 2. Send confirmation to customer and notification to admin
        let emailError: string | null = null;
        const result = await sendShuttleConfirmationEmails({
            bookingId: booking?.id ?? undefined,
            customerName: data.customerName,
            customerEmail: data.customerEmail,
            customerWhatsapp: data.customerWhatsapp,
            agencyEmail,
            origin: data.routeOrigin,
            destination: data.routeDestination,
            travelDate: data.date,
            travelTime: data.time,
            passengers: data.passengers,
            pickupLocation: data.pickupLocation,
            type: bookingType,
            price,
            createdAt: booking?.created_at ?? undefined,
            t: tEmail,
            locale,
        });
        const emailSent = result.success;
        const customerRecipient = result.recipients.find((recipient) => recipient.label === 'shuttle_customer');
        const customerEmailSent = customerRecipient ? customerRecipient.success : result.success;
        const emailRecipientStatuses = result.recipients.map((recipient) => ({
            label: recipient.label,
            status: recipient.success ? 'sent' : 'failed',
        }));

        if (!result.success) {
            const rawError = result.error;
            emailError =
                rawError instanceof Error
                    ? rawError.message
                    : typeof rawError === 'string'
                      ? rawError
                      : rawError
                        ? JSON.stringify(rawError)
                        : 'Unknown email error';
            logger.warn('Email failed but booking was saved to DB');
        }

        if (booking?.id) {
            for (const recipient of result.recipients) {
                const recipientType =
                    recipient.label.endsWith('_customer')
                        ? 'customer'
                        : recipient.label.endsWith('_admin')
                            ? 'admin'
                            : 'agency';
                await recordInternalNotification({
                    requestKind: 'shuttle',
                    requestId: booking.id,
                    recipientType,
                    recipientEmail: recipient.to,
                    template: recipient.label.endsWith('_customer') ? 'booking_received_customer' : 'booking_received_ops',
                    deliveryStatus: recipient.success ? 'sent' : 'failed',
                    subject: recipient.subject,
                    providerMessageId: recipient.id,
                    errorMessage: recipient.success
                        ? null
                        : getErrorMessage(recipient.error, `No se pudo enviar ${recipient.label}.`),
                    triggeredBy: 'system',
                });
            }

            try {
                const updateData: ShuttleBookingUpdate = {
                    email_delivery_status: emailSent ? 'sent' : 'failed',
                    email_attempts: (booking.email_attempts ?? 0) + 1,
                    email_last_attempt_at: new Date().toISOString(),
                    email_last_error: emailSent ? null : emailError,
                };
                await supabaseAdmin
                    .from('shuttle_bookings')
                    .update(updateData)
                    .eq('id', booking.id);
            } catch (updateError) {
                logger.error('Failed to update shuttle email tracking fields:', updateError);
            }
        }

        return NextResponse.json({
            success: true,
            message: tApi('successMessage'),
            bookingId: booking?.id ?? null,
            email: {
                sent: customerEmailSent,
                status: customerEmailSent ? 'sent' : 'failed',
                recipients: emailRecipientStatuses,
            },
        });
    } catch (error) {
        logger.error('Error in shuttle reserve API:', error);
        // Need locale in catch block too
        const locale = getLocaleFromRequest(request);
        const tApi = await getTranslations({ locale, namespace: 'ReservationApi' });
        return NextResponse.json(
            { error: tApi('internalError') },
            { status: 500 }
        );
    }
}
