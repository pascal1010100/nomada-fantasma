import { NextResponse } from 'next/server';
import { sendShuttleConfirmationEmails } from '@/app/lib/email';
import { supabaseAdmin } from '@/app/lib/supabase/server';
import type { Database } from '@/types/database.types';
import { z } from 'zod';

const rateLimitStore = new Map<string, { count: number; start: number }>();
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;

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
        const payload: Database['public']['Tables']['shuttle_bookings']['Insert'] = {
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

        const { error: dbError } = await supabaseAdmin
            .from('shuttle_bookings')
            .insert([payload] as unknown as never[]);

        if (dbError) {
            console.error('Error saving to Supabase:', dbError);
            return NextResponse.json(
                { error: 'Error al registrar la reserva en la base de datos.' },
                { status: 500 }
            );
        }

        // 2. Send confirmation to customer and notification to admin
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
            console.warn('Email failed but booking was saved to DB');
        }

        return NextResponse.json({
            success: true,
            message: 'Solicitud enviada exitosamente. Nos pondremos en contacto contigo pronto.',
            email: {
                sent: emailSent,
            },
        });
    } catch (error) {
        console.error('Error in shuttle reserve API:', error);
        return NextResponse.json(
            { error: 'Error interno del servidor' },
            { status: 500 }
        );
    }
}
