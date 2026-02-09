import { NextResponse } from 'next/server';
import { sendShuttleRequestEmail } from '@/app/lib/email';
import { supabaseAdmin } from '@/app/lib/supabase/server';
import { z } from 'zod';

const ShuttleRequestSchema = z.object({
    customerName: z.string().min(2, 'El nombre es muy corto'),
    customerEmail: z.string().email('Email inválido'),
    routeOrigin: z.string(),
    routeDestination: z.string(),
    date: z.string(),
    time: z.string(),
    passengers: z.number().min(1),
    pickupLocation: z.string().min(5, 'Por favor indica un lugar de recogida claro'),
    type: z.enum(['shared', 'private']).optional(),
});

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const validation = ShuttleRequestSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                { error: validation.error.issues[0].message },
                { status: 400 }
            );
        }

        const data = validation.data;

        // 1. Persist to Supabase
        const { error: dbError } = await (supabaseAdmin as any)
            .from('shuttle_bookings')
            .insert([{
                customer_name: data.customerName,
                customer_email: data.customerEmail,
                route_origin: data.routeOrigin,
                route_destination: data.routeDestination,
                travel_date: data.date,
                travel_time: data.time,
                passengers: data.passengers,
                pickup_location: data.pickupLocation,
                type: data.type || 'shared',
                status: 'pending'
            }]);

        if (dbError) {
            console.error('Error saving to Supabase:', dbError);
            return NextResponse.json(
                { error: 'Error al registrar la reserva en la base de datos.' },
                { status: 500 }
            );
        }

        // 2. Trigger Email
        const result = await sendShuttleRequestEmail(data);

        if (!result.success) {
            // We don't block the response here since the DB record is already saved
            console.warn('Email failed but booking was saved to DB');
        }

        return NextResponse.json({
            success: true,
            message: 'Solicitud enviada exitosamente. Nos pondremos en contacto contigo pronto.',
        });
    } catch (error) {
        console.error('Error in shuttle reserve API:', error);
        return NextResponse.json(
            { error: 'Error interno del servidor' },
            { status: 500 }
        );
    }
}
