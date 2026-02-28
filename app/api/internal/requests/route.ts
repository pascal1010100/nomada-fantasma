import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/app/lib/supabase/server';
import { isAdminRequestAuthorized } from '@/app/lib/admin-auth';
import logger from '@/app/lib/logger';
import type { Database } from '@/types/database.types';

type ReservationRow = Database['public']['Tables']['reservations']['Row'];
type ShuttleBookingRow = Database['public']['Tables']['shuttle_bookings']['Row'];
type LegacyReservationRow = {
    id: string;
    created_at: string;
    full_name?: string | null;
    email?: string | null;
    date?: string | null;
    tour_name?: string | null;
    notes?: string | null;
    status?: string | null;
    email_delivery_status?: 'pending' | 'sent' | 'failed' | 'not_requested' | null;
    email_attempts?: number | null;
    email_last_error?: string | null;
};

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

function mapReservation(row: ReservationRow | LegacyReservationRow): InternalRequestItem {
    const isModern = 'customer_name' in row;
    return {
        id: row.id,
        kind: 'tour',
        createdAt: row.created_at,
        customerName: isModern ? row.customer_name : (row.full_name ?? 'Sin nombre'),
        customerEmail: isModern ? row.customer_email : (row.email ?? ''),
        date: isModern ? row.reservation_date : (row.date ?? row.created_at.slice(0, 10)),
        details: isModern ? (row.tour_name || row.customer_notes || 'Reserva de tour') : (row.tour_name || row.notes || 'Reserva de tour'),
        status: row.status ?? null,
        emailStatus: row.email_delivery_status ?? null,
        emailAttempts: row.email_attempts ?? 0,
        emailLastError: row.email_last_error ?? null,
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

        const shuttleResult = await supabaseAdmin
            .from('shuttle_bookings')
            .select('*')
            .or('route_origin.ilike.%san%pedro%,route_destination.ilike.%san%pedro%')
            .order('created_at', { ascending: false })
            .limit(limit);

        if (shuttleResult.error) {
            logger.error('Error fetching shuttles for internal requests:', shuttleResult.error);
            return NextResponse.json({ error: 'Error fetching shuttles' }, { status: 500 });
        }

        const reservationsResult = await supabaseAdmin
            .from('reservations')
            .select('*')
            .eq('reservation_type', 'tour')
            .or('tour_name.ilike.%san%pedro%,customer_notes.ilike.%san%pedro%')
            .order('created_at', { ascending: false })
            .limit(limit);

        let reservationItems: InternalRequestItem[] = [];
        if (reservationsResult.error) {
            logger.warn('Modern reservations query failed, trying legacy fallback:', reservationsResult.error);
            const legacyResult = await supabaseAdmin
                .from('reservations')
                .select('*')
                .or('tour_name.ilike.%san%pedro%,notes.ilike.%san%pedro%')
                .order('created_at', { ascending: false })
                .limit(limit);

            if (legacyResult.error) {
                logger.error('Legacy reservations query also failed:', legacyResult.error);
                return NextResponse.json({ error: 'Error fetching reservations' }, { status: 500 });
            }

            reservationItems = (legacyResult.data ?? []).map((row) =>
                mapReservation(row as LegacyReservationRow)
            );
        } else {
            reservationItems = (reservationsResult.data ?? []).map((row) =>
                mapReservation(row as ReservationRow)
            );
        }

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
