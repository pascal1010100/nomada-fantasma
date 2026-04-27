import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/app/lib/supabase/server';
import { getAuthorizedAdminContext } from '@/app/lib/admin-auth';
import { listInternalNotificationsForRequests, type InternalNotificationRecord } from '@/app/lib/internal-notifications';
import logger from '@/app/lib/logger';
import type { Database } from '@/types/database.types';

type ReservationRow = Database['public']['Tables']['reservations']['Row'];
type ShuttleBookingRow = Database['public']['Tables']['shuttle_bookings']['Row'];
type TourRow = Database['public']['Tables']['tours']['Row'];
type ProviderInfo = {
    name: string | null;
    email: string | null;
    isActive: boolean;
};
type AgencyLite = {
    id: string;
    name: string | null;
    email: string | null;
    is_active: boolean | null;
};
type GuideLite = {
    id: string;
    name: string | null;
    agency_id: string | null;
    email: string | null;
    is_active: boolean | null;
};
type ShuttleRouteLite = {
    origin: string;
    destination: string;
    type: string | null;
    agency_id: string | null;
};
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
    kind: 'tour' | 'guide' | 'shuttle';
    createdAt: string;
    customerName: string;
    customerEmail: string;
    customerWhatsapp: string | null;
    date: string;
    serviceName: string;
    serviceSlug: string | null;
    requestedTime: string | null;
    partySize: number | null;
    locationLabel: string | null;
    totalPrice: number | null;
    details: string;
    status: string | null;
    emailStatus: string | null;
    emailAttempts: number;
    emailLastError: string | null;
    adminNotes: string | null;
    confirmedAt: string | null;
    cancelledAt: string | null;
    provider: ProviderInfo | null;
    notifications: InternalNotificationRecord[];
};

function normalizeLimit(rawValue: string | null): number {
    const parsed = rawValue ? Number.parseInt(rawValue, 10) : 50;
    if (!Number.isFinite(parsed)) return 50;
    return Math.min(Math.max(parsed, 1), 200);
}

function mapReservation(
    row: ReservationRow | LegacyReservationRow,
    relatedTour?: Pick<TourRow, 'id' | 'title' | 'slug' | 'meeting_point' | 'pickup_time'> | null,
    provider: ProviderInfo | null = null
): InternalRequestItem {
    const isModern = 'full_name' in row;
    const reservationKind =
        isModern && row.reservation_type === 'guide'
            ? 'guide'
            : 'tour';
    const createdAt = row.created_at ?? '';
    const fallbackDate = createdAt ? createdAt.slice(0, 10) : '';
    const serviceName = isModern
        ? reservationKind === 'guide'
            ? row.guide_service_name || row.tour_name || 'Servicio de guia sin nombre'
            : relatedTour?.title || row.tour_name || 'Tour sin nombre'
        : row.tour_name || relatedTour?.title || 'Tour sin nombre';
    const details = isModern
        ? row.notes || serviceName
        : row.customer_notes || serviceName;
    return {
        id: row.id,
        kind: reservationKind,
        createdAt,
        customerName: isModern ? row.full_name : (row.customer_name ?? 'Sin nombre'),
        customerEmail: isModern ? row.email : (row.customer_email ?? ''),
        customerWhatsapp: isModern ? row.whatsapp : null,
        date: isModern ? (row.date ?? fallbackDate) : (row.reservation_date ?? fallbackDate),
        serviceName,
        serviceSlug: reservationKind === 'tour' ? (relatedTour?.slug ?? null) : null,
        requestedTime: isModern
            ? reservationKind === 'tour'
                ? (row.requested_time ?? relatedTour?.pickup_time ?? null)
                : (row.requested_time ?? null)
            : null,
        partySize: isModern ? (row.number_of_people ?? null) : null,
        locationLabel: reservationKind === 'tour' ? (relatedTour?.meeting_point ?? null) : null,
        totalPrice: isModern ? (row.total_price ?? null) : null,
        details,
        status: row.status ?? null,
        emailStatus: row.email_delivery_status ?? null,
        emailAttempts: row.email_attempts ?? 0,
        emailLastError: row.email_last_error ?? null,
        adminNotes: row.admin_notes ?? null,
        confirmedAt: row.confirmed_at ?? null,
        cancelledAt: row.cancelled_at ?? null,
        provider,
        notifications: [],
    };
}

function mapShuttle(row: ShuttleBookingRow, provider: ProviderInfo | null = null): InternalRequestItem {
    const createdAt = row.created_at ?? '';
    const serviceName = `${row.route_origin ?? ''} → ${row.route_destination ?? ''}`;
    const shuttleType = row.type === 'private' ? 'Privado' : row.type === 'shared' ? 'Compartido' : 'Shuttle';
    return {
        id: row.id,
        kind: 'shuttle',
        createdAt,
        customerName: row.customer_name ?? 'Sin nombre',
        customerEmail: row.customer_email ?? '',
        customerWhatsapp: row.customer_whatsapp ?? null,
        date: row.travel_date ?? '',
        serviceName,
        serviceSlug: null,
        requestedTime: row.travel_time ?? null,
        partySize: row.passengers ?? null,
        locationLabel: row.pickup_location ?? null,
        totalPrice: row.price ?? null,
        details: `${shuttleType} · ${row.route_origin ?? ''} -> ${row.route_destination ?? ''}`,
        status: row.status,
        emailStatus: row.email_delivery_status,
        emailAttempts: row.email_attempts ?? 0,
        emailLastError: row.email_last_error,
        adminNotes: row.admin_notes,
        confirmedAt: row.confirmed_at,
        cancelledAt: row.cancelled_at,
        provider,
        notifications: [],
    };
}

function mapAgencyProvider(agency: AgencyLite | null | undefined): ProviderInfo | null {
    if (!agency) return null;
    return {
        name: agency.name,
        email: agency.email,
        isActive: agency.is_active ?? false,
    };
}

function mapGuideProvider(guide: GuideLite | null | undefined, agenciesById: Map<string, AgencyLite>): ProviderInfo | null {
    if (!guide || guide.is_active === false) return null;
    const guideEmail = guide.email?.trim() || null;
    if (guideEmail) {
        return {
            name: guide.name,
            email: guideEmail,
            isActive: true,
        };
    }
    return mapAgencyProvider(guide.agency_id ? agenciesById.get(guide.agency_id) : null);
}

function getShuttleRouteKey(origin: string | null | undefined, destination: string | null | undefined, type: string | null | undefined): string {
    return `${origin ?? ''}::${destination ?? ''}::${type ?? 'shared'}`.toLowerCase();
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
            .select('id, title, slug, meeting_point, pickup_time, agency_id')
            .eq('pueblo_slug', 'san-pedro');

        if (sanPedroToursResult.error) {
            logger.error('Error fetching San Pedro tours for internal requests:', sanPedroToursResult.error);
            return NextResponse.json({ error: 'Error fetching tours' }, { status: 500 });
        }

        const sanPedroTours = (sanPedroToursResult.data ?? []) as Array<
            Pick<TourRow, 'id' | 'title' | 'slug' | 'meeting_point' | 'pickup_time' | 'agency_id'>
        >;
        const sanPedroTourIds = new Set(sanPedroTours.map((tour) => tour.id));
        const toursById = new Map(sanPedroTours.map((tour) => [tour.id, tour]));
        const agenciesResult = await supabaseAdmin
            .from('agencies')
            .select('id, name, email, is_active');

        if (agenciesResult.error) {
            logger.warn('Unable to fetch provider agencies for internal panel:', agenciesResult.error);
        }

        const agenciesById = new Map(
            ((agenciesResult.data ?? []) as AgencyLite[]).map((agency) => [agency.id, agency])
        );

        const reservationsResult = await supabaseAdmin
            .from('reservations')
            .select('*')
            .in('reservation_type', ['tour', 'guide'])
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
                    if (typedRow.reservation_type === 'guide') return true;
                    const matchesTourId = typedRow.tour_id ? sanPedroTourIds.has(typedRow.tour_id) : false;
                    const tourName = typedRow.tour_name?.toLowerCase() ?? '';
                    const customerNotes = typedRow.notes?.toLowerCase() ?? '';
                    const matchesText = tourName.includes('san pedro') || customerNotes.includes('san pedro');
                    return matchesTourId || matchesText;
                })
                .slice(0, limit);

            const guideIds = Array.from(new Set(
                scopedReservations
                    .map((row) => (row as ReservationRow).guide_id)
                    .filter((value): value is string => Boolean(value))
            ));
            let guidesById = new Map<string, GuideLite>();

            if (guideIds.length > 0) {
                const guidesResult = await supabaseAdmin
                    .from('guides')
                    .select('id, name, agency_id, email, is_active')
                    .in('id', guideIds);

                if (guidesResult.error) {
                    logger.warn('Unable to fetch guide providers for internal panel:', guidesResult.error);
                } else {
                    guidesById = new Map(
                        ((guidesResult.data ?? []) as GuideLite[]).map((guide) => [guide.id, guide])
                    );
                }
            }

            reservationItems = scopedReservations.map((row) => {
                const typedRow = row as ReservationRow;
                const relatedTour = typedRow.tour_id ? toursById.get(typedRow.tour_id) ?? null : null;
                const provider = typedRow.reservation_type === 'guide'
                    ? mapGuideProvider(typedRow.guide_id ? guidesById.get(typedRow.guide_id) : null, agenciesById)
                    : mapAgencyProvider(relatedTour?.agency_id ? agenciesById.get(relatedTour.agency_id) : null);
                return mapReservation(typedRow, relatedTour, provider);
            });
        }

        const shuttleRoutesResult = await supabaseAdmin
            .from('shuttle_routes')
            .select('origin, destination, type, agency_id');

        if (shuttleRoutesResult.error) {
            logger.warn('Unable to fetch shuttle providers for internal panel:', shuttleRoutesResult.error);
        }

        const shuttleAgencyByRoute = new Map(
            ((shuttleRoutesResult.data ?? []) as ShuttleRouteLite[]).map((route) => [
                getShuttleRouteKey(route.origin, route.destination, route.type),
                route.agency_id,
            ])
        );

        const shuttleItems = (shuttleResult.data ?? []).map((row) => {
            const agencyId = row.agency_id ?? shuttleAgencyByRoute.get(getShuttleRouteKey(row.route_origin, row.route_destination, row.type));
            return mapShuttle(row, mapAgencyProvider(agencyId ? agenciesById.get(agencyId) : null));
        });
        const items = [...reservationItems, ...shuttleItems].sort((a, b) =>
            b.createdAt.localeCompare(a.createdAt)
        );
        const notificationsByRequest = await listInternalNotificationsForRequests(
            items.map((item) => ({ kind: item.kind, id: item.id })),
            8
        );
        const enrichedItems = items.map((item) => ({
            ...item,
            notifications: notificationsByRequest[`${item.kind}:${item.id}`] ?? [],
        }));

        return NextResponse.json({
            success: true,
            summary: {
                total: enrichedItems.length,
                tours: reservationItems.filter((item) => item.kind === 'tour').length,
                guides: reservationItems.filter((item) => item.kind === 'guide').length,
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
