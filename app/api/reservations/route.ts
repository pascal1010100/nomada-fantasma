import { NextResponse } from 'next/server';
import { getTranslations } from 'next-intl/server';
import { supabaseAdmin } from '@/app/lib/supabase/server';
import { sendConfirmationEmail } from '@/app/lib/email';
import {
    CreateReservationSchema,
    sanitizeReservationInput,
    validateRequestBody,
} from '@/app/lib/validations';
import type { Database } from '@/types/database.types';

// POST: Create a new reservation
export async function POST(request: Request) {
    try {
        // 1. Get locale from URL
        const url = new URL(request.url);
        const locale = url.pathname.split('/')[1] || 'es'; // Default to 'es'

        // 2. Load translations
        const t = await getTranslations({ locale, namespace: 'ReservationEmail' });

        // Validate request body with Zod
        const validation = await validateRequestBody(request, CreateReservationSchema);

        if (validation.error || !validation.data) {
            return NextResponse.json(
                { error: validation.error || 'Invalid request data' },
                { status: 400 }
            );
        }

        // Sanitize and normalize input
        const reservationData = sanitizeReservationInput(validation.data);

        // Insert into Supabase
        const { data: newReservation, error: dbError } = await supabaseAdmin
            .from('reservations')
            .insert(reservationData)
            .select()
            .single();

        if (dbError) {
            console.error('Supabase error:', dbError);
            return NextResponse.json(
                { error: 'Error al crear la reserva en la base de datos' },
                { status: 500 }
            );
        }

        if (!newReservation) {
            return NextResponse.json(
                { error: 'No se pudo crear la reserva' },
                { status: 500 }
            );
        }

        // Send confirmation email (don't await to avoid blocking the response)
        sendConfirmationEmail({
            to: newReservation.customer_email,
            reservationId: newReservation.id,
            customerName: newReservation.customer_name,
            tourName: newReservation.tour_name || 'Tour Nómada Fantasma',
            date: newReservation.reservation_date,
            guests: newReservation.guests,
            totalPrice: newReservation.total_price || 0,
            t: t,
        }).catch((emailError) => {
            console.error('Email sending failed (non-blocking):', emailError);
        });

        // Update confirmation_sent_at timestamp
        await supabaseAdmin
            .from('reservations')
            .update({ confirmation_sent_at: new Date().toISOString() })
            .eq('id', newReservation.id);

        return NextResponse.json(
            {
                success: true,
                message: 'Reserva creada exitosamente',
                reservation: {
                    id: newReservation.id,
                    customer_name: newReservation.customer_name,
                    customer_email: newReservation.customer_email,
                    reservation_date: newReservation.reservation_date,
                    guests: newReservation.guests,
                    status: newReservation.status,
                    created_at: newReservation.created_at,
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
        const limit = parseInt(searchParams.get('limit') || '100', 10);

        // Build query
        let query = supabaseAdmin
            .from('reservations')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(limit);

        // Apply filters if provided
        if (status) {
            query = query.eq('status', status);
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
        const validStatuses = ['pending', 'confirmed', 'cancelled', 'completed'];
        if (!validStatuses.includes(status)) {
            return NextResponse.json(
                { error: 'Status inválido' },
                { status: 400 }
            );
        }

        const updateData: { [key: string]: string | Date } = { status };

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
            .single();

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
