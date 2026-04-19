import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/app/lib/supabase/server';
import { getAuthorizedAdminContext } from '@/app/lib/admin-auth';
import { listInternalNotificationsForRequests, type InternalNotificationRecord } from '@/app/lib/internal-notifications';
import logger from '@/app/lib/logger';
import type { Database } from '@/types/database.types';

type ReservationRow = Database['public']['Tables']['reservations']['Row'];
type ShuttleBookingRow = Database['public']['Tables']['shuttle_bookings']['Row'];
type TourRow = Database['public']['Tables']['tours']['Row'];
type LegacyReservationRow = {
    id: string;
    created_at: string;
    customer_name?: string | null;
    customer_email?: string | null;
    reservation_date?: string | null;
    tour_name?: string | null;
    customer_notes?: string | null;
    status?: string | null;
    email_delivery_status?: 'pending' | 'sent' | 'failed' | 'not_requested' | null;
    email_attempts?: number | null;
    email_last_error?: string | null;
    admin_notes?: string | null;
    confirmed_at?: string | null;
    cancelled_at?: string | null;
};

type InternalRequestItem = {
    id: string;
    kind: 'tour' | 'shuttle';
    createdAt: string;
    customerName: string;
    customerEmail: string;
    customerWhatsapp: string | null;
    date: string;
    details: string;
    status: string | null;
    emailStatus: string | null;
    emailAttempts: number;
    emailLastError: string | null;
    adminNotes: string | null;
    confirmedAt: string | null;
    cancelledAt: string | null;
    notifications: InternalNotificationRecord[];
};

function normalizeLimit(rawValue: string | null): number {
    const parsed = rawValue ? Number.parseInt(rawValue, 10) : 50;
    if (!Number.isFinite(parsed)) return 50;
    return Math.min(Math.max(parsed, 1), 200);
}

function mapReservation(row: ReservationRow | LegacyReservationRow): InternalRequestItem {
    const isModern = 'full_name' in row;
    const createdAt = row.created_at ?? '';
    const fallbackDate = createdAt ? createdAt.slice(0, 10) : '';
    return {
        id: row.id,
        kind: 'tour',
        createdAt,
        customerName: isModern ? row.full_name : (row.customer_name ?? 'Sin nombre'),
        customerEmail: isModern ? row.email : (row.customer_email ?? ''),
        customerWhatsapp: isModern ? row.whatsapp : null,
        date: isModern ? (row.date ?? fallbackDate) : (row.reservation_date ?? fallbackDate),
        details: isModern ? (row.tour_name || row.notes || 'Reserva de tour') : (row.tour_name || row.customer_notes || 'Reserva de tour'),
        status: row.status ?? null,
        emailStatus: row.email_delivery_status ?? null,
        emailAttempts: row.email_attempts ?? 0,
        emailLastError: row.email_last_error ?? null,
        adminNotes: row.admin_notes ?? null,
        confirmedAt: row.confirmed_at ?? null,
        cancelledAt: row.cancelled_at ?? null,
        notifications: [],
    };
}

function mapShuttle(row: ShuttleBookingRow): InternalRequestItem {
    const createdAt = row.created_at ?? '';
    return {
        id: row.id,
        kind: 'shuttle',
        createdAt,
        customerName: row.customer_name ?? 'Sin nombre',
        customerEmail: row.customer_email ?? '',
        customerWhatsapp: row.customer_whatsapp ?? null,
        date: row.travel_date ?? '',
        details: `${row.route_origin ?? ''} -> ${row.route_destination ?? ''} (${row.passengers ?? 0})`,
        status: row.status,
        emailStatus: row.email_delivery_status,
        emailAttempts: row.email_attempts ?? 0,
        emailLastError: row.email_last_error,
        adminNotes: row.admin_notes,
        confirmedAt: row.confirmed_at,
        cancelledAt: row.cancelled_at,
        notifications: [],
    };
}

export async function GET(request: Request) {
    try {
        const adminContext = await getAuthorizedAdminContext(request);
        if (!adminContext) {
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

        const sanPedroToursResult = await supabaseAdmin
            .from('tours')
            .select('id')
            .eq('pueblo_slug', 'san-pedro');

        if (sanPedroToursResult.error) {
            logger.error('Error fetching San Pedro tours for internal requests:', sanPedroToursResult.error);
            return NextResponse.json({ error: 'Error fetching tours' }, { status: 500 });
        }

        const sanPedroTourIds = new Set(
            (sanPedroToursResult.data ?? []).map((tour) => (tour as Pick<TourRow, 'id'>).id)
        );

        const reservationsResult = await supabaseAdmin
            .from('reservations')
            .select('*')
            .eq('reservation_type', 'tour')
            .order('created_at', { ascending: false })
            .limit(Math.min(Math.max(limit * 6, 120), 500));

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

            reservationItems = (legacyResult.data ?? [])
                .map((row) => mapReservation(row as LegacyReservationRow))
                .slice(0, limit);
        } else {
            const scopedReservations = (reservationsResult.data ?? [])
                .filter((row) => {
                    const typedRow = row as ReservationRow;
                    const matchesTourId = typedRow.tour_id ? sanPedroTourIds.has(typedRow.tour_id) : false;
                    const tourName = typedRow.tour_name?.toLowerCase() ?? '';
                    const customerNotes = typedRow.notes?.toLowerCase() ?? '';
                    const matchesText = tourName.includes('san pedro') || customerNotes.includes('san pedro');
                    return matchesTourId || matchesText;
                })
                .slice(0, limit);

            reservationItems = scopedReservations.map((row) =>
                mapReservation(row as ReservationRow)
            );
        }

        const shuttleItems = (shuttleResult.data ?? []).map(mapShuttle);
        const items = [...reservationItems, ...shuttleItems].sort((a, b) =>
            b.createdAt.localeCompare(a.createdAt)
        );
        const notificationsByRequest = await listInternalNotificationsForRequests(
            items.map((item) => ({ kind: item.kind, id: item.id }))
        );
        const enrichedItems = items.map((item) => ({
            ...item,
            notifications: notificationsByRequest[`${item.kind}:${item.id}`] ?? [],
        }));

        return NextResponse.json({
            success: true,
            summary: {
                total: enrichedItems.length,
                tours: reservationItems.length,
                shuttles: shuttleItems.length,
                emailFailed: enrichedItems.filter((item) => item.emailStatus === 'failed').length,
            },
            items: enrichedItems,
        });
    } catch (error) {
        logger.error('Unexpected error in internal requests API:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
