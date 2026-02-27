import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/app/lib/supabase/server';
import { isAdminRequestAuthorized } from '@/app/lib/admin-auth';
import logger from '@/app/lib/logger';
import type { Database } from '@/types/database.types';

type ReservationRow = Database['public']['Tables']['reservations']['Row'];
type ShuttleBookingRow = Database['public']['Tables']['shuttle_bookings']['Row'];

type InternalRequestItem = {
    id: string;
    kind: 'tour' | 'shuttle';
    createdAt: string;
    customerName: string;
    customerEmail: string;
    date: string;
    details: string;
    status: string | null;
    emailStatus: string | null;
    emailAttempts: number;
    emailLastError: string | null;
};

function normalizeLimit(rawValue: string | null): number {
    const parsed = rawValue ? Number.parseInt(rawValue, 10) : 50;
    if (!Number.isFinite(parsed)) return 50;
    return Math.min(Math.max(parsed, 1), 200);
}

function mapReservation(row: ReservationRow): InternalRequestItem {
    return {
        id: row.id,
        kind: 'tour',
        createdAt: row.created_at,
        customerName: row.customer_name,
        customerEmail: row.customer_email,
        date: row.reservation_date,
        details: row.tour_name || row.customer_notes || 'Reserva de tour',
        status: row.status,
        emailStatus: row.email_delivery_status,
        emailAttempts: row.email_attempts,
        emailLastError: row.email_last_error,
    };
}

function mapShuttle(row: ShuttleBookingRow): InternalRequestItem {
    return {
        id: row.id,
        kind: 'shuttle',
        createdAt: row.created_at,
        customerName: row.customer_name,
        customerEmail: row.customer_email,
        date: row.travel_date,
        details: `${row.route_origin} -> ${row.route_destination} (${row.passengers})`,
        status: row.status,
        emailStatus: row.email_delivery_status,
        emailAttempts: row.email_attempts,
        emailLastError: row.email_last_error,
    };
}

export async function GET(request: Request) {
    try {
        if (!isAdminRequestAuthorized(request)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const limit = normalizeLimit(searchParams.get('limit'));

        const [reservationsResult, shuttleResult] = await Promise.all([
            supabaseAdmin
                .from('reservations')
                .select('*')
                .eq('reservation_type', 'tour')
                .or('tour_name.ilike.%san%pedro%,customer_notes.ilike.%san%pedro%')
                .order('created_at', { ascending: false })
                .limit(limit),
            supabaseAdmin
                .from('shuttle_bookings')
                .select('*')
                .or('route_origin.ilike.%san%pedro%,route_destination.ilike.%san%pedro%')
                .order('created_at', { ascending: false })
                .limit(limit),
        ]);

        if (reservationsResult.error) {
            logger.error('Error fetching reservations for internal requests:', reservationsResult.error);
            return NextResponse.json({ error: 'Error fetching reservations' }, { status: 500 });
        }

        if (shuttleResult.error) {
            logger.error('Error fetching shuttles for internal requests:', shuttleResult.error);
            return NextResponse.json({ error: 'Error fetching shuttles' }, { status: 500 });
        }

        const reservationItems = (reservationsResult.data ?? []).map(mapReservation);
        const shuttleItems = (shuttleResult.data ?? []).map(mapShuttle);
        const items = [...reservationItems, ...shuttleItems].sort((a, b) =>
            b.createdAt.localeCompare(a.createdAt)
        );

        return NextResponse.json({
            success: true,
            summary: {
                total: items.length,
                tours: reservationItems.length,
                shuttles: shuttleItems.length,
                emailFailed: items.filter((item) => item.emailStatus === 'failed').length,
            },
            items,
        });
    } catch (error) {
        logger.error('Unexpected error in internal requests API:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
