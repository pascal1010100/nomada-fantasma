import { NextResponse } from 'next/server';
import { getTranslations } from 'next-intl/server';
import { sendShuttleConfirmationEmails } from '@/app/lib/email';
import { supabaseAdmin } from '@/app/lib/supabase/server';
import { checkRateLimit, getClientIP } from '@/app/lib/rate-limit';
import { getLocaleFromRequest } from '@/app/lib/locale';
import logger from '@/app/lib/logger';
import { ShuttleRequestSchema, mapZodErrorToTranslationKey } from '@/app/lib/validations';
import type { Database } from '@/types/database.types';

type ShuttleBookingInsert = Database['public']['Tables']['shuttle_bookings']['Insert'];
type ShuttleBookingRow = Database['public']['Tables']['shuttle_bookings']['Row'];
type ShuttleBookingUpdate = Database['public']['Tables']['shuttle_bookings']['Update'];

export async function POST(request: Request) {
    try {
        // Detect locale FIRST (before rate limiting to use translations)
        const locale = getLocaleFromRequest(request);
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

        // 1. Persist to Supabase
        const payload: ShuttleBookingInsert = {
            customer_name: data.customerName,
            customer_email: data.customerEmail,
            route_origin: data.routeOrigin,
            route_destination: data.routeDestination,
            travel_date: data.date,
            travel_time: data.time,
            passengers: data.passengers,
            pickup_location: data.pickupLocation,
            type: data.type || 'shared',
            status: 'pending',
        };

        const { data: booking, error: dbError } = await supabaseAdmin
            .from('shuttle_bookings')
            .insert(payload)
            .select()
            .single<ShuttleBookingRow>();

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
            customerName: data.customerName,
            customerEmail: data.customerEmail,
            origin: data.routeOrigin,
            destination: data.routeDestination,
            travelDate: data.date,
            travelTime: data.time,
            passengers: data.passengers,
            pickupLocation: data.pickupLocation,
            type: data.type || 'shared',
            price: undefined,
        });
        const emailSent = result.success;

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
                sent: emailSent,
                status: emailSent ? 'sent' : 'failed',
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
