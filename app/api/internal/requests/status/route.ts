import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/app/lib/supabase/server';
import { getAuthorizedAdminContext } from '@/app/lib/admin-auth';
import {
    buildCustomerActionEmail,
    sendManualCustomerEmail,
    sendShuttleCancellationAgencyEmail,
    sendTourCancellationAgencyEmail,
} from '@/app/lib/email';
import { recordInternalNotification } from '@/app/lib/internal-notifications';
import { normalizeLocale } from '@/app/lib/locale';
import logger from '@/app/lib/logger';
import { parseRequestMetadata } from '@/app/lib/request-metadata';
import type { Database } from '@/types/database.types';

type ReservationRow = Database['public']['Tables']['reservations']['Row'];
type ShuttleBookingRow = Database['public']['Tables']['shuttle_bookings']['Row'];
type TransitionInsert = Database['public']['Tables']['internal_request_transitions']['Insert'];
type ReservationUpdate = Database['public']['Tables']['reservations']['Update'];
type ShuttleBookingUpdate = Database['public']['Tables']['shuttle_bookings']['Update'];
type ReservationStatusRow = ReservationRow & { customer_locale?: string | null };
type ShuttleStatusRow = ShuttleBookingRow & { customer_locale?: string | null };

type RequestKind = 'tour' | 'shuttle';
type RequestStatus = 'pending' | 'processing' | 'confirmed' | 'cancelled' | 'completed';
const CONFLICT_MESSAGE = 'Conflict: request was updated by another operator. Please refresh.';

const TRANSITION_MATRIX: Record<RequestStatus, RequestStatus[]> = {
    pending: ['processing', 'cancelled'],
    processing: ['confirmed', 'cancelled'],
    confirmed: ['completed', 'cancelled'],
    cancelled: [],
    completed: [],
};

const NOTE_REQUIRED_STATUSES = new Set<RequestStatus>(['cancelled']);
const MIN_NOTE_LENGTH = 3;

function normalizeEmail(value: string | null | undefined): string | null {
    const candidate = value?.trim();
    if (!candidate) return null;
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(candidate) ? candidate : null;
}

function appendAdminLine(previous: string | null | undefined, line: string): string {
    const trimmed = previous?.trim();
    return trimmed ? `${trimmed}\n${line}` : line;
}

function appendStatusNote(previous: string | null | undefined, actor: string, nextStatus: RequestStatus, note: string | null): string | null {
    if (!note) return previous?.trim() || null;
    return appendAdminLine(previous, `[${new Date().toISOString()}] (${actor}) ${nextStatus}: ${note}`);
}

function getErrorMessage(error: unknown, fallback: string): string {
    if (error instanceof Error && error.message) return error.message;
    if (typeof error === 'string' && error.trim()) return error;
    return fallback;
}

async function getTourAgencyEmail(tourId: string | null | undefined): Promise<string | null> {
    const fallbackAgencyEmail = normalizeEmail(process.env.DEFAULT_AGENCY_EMAIL);
    if (!tourId) return fallbackAgencyEmail;

    const tourResult = await supabaseAdmin
        .from('tours')
        .select('agency_id')
        .eq('id', tourId)
        .maybeSingle<{ agency_id: string | null }>();

    if (tourResult.error) {
        logger.warn('Unable to resolve tour agency assignment for cancellation:', tourResult.error);
        return fallbackAgencyEmail;
    }

    const agencyId = tourResult.data?.agency_id;
    if (!agencyId) return fallbackAgencyEmail;

    const agencyResult = await supabaseAdmin
        .from('agencies')
        .select('email, is_active')
        .eq('id', agencyId)
        .maybeSingle<{ email: string | null; is_active: boolean | null }>();

    if (agencyResult.error) {
        logger.warn('Unable to resolve tour agency email for cancellation:', agencyResult.error);
        return fallbackAgencyEmail;
    }

    if (!agencyResult.data?.is_active) return fallbackAgencyEmail;
    return normalizeEmail(agencyResult.data.email) ?? fallbackAgencyEmail;
}

async function getShuttleAgencyEmail(origin: string, destination: string, type: string): Promise<string | null> {
    const fallbackAgencyEmail = normalizeEmail(process.env.DEFAULT_AGENCY_EMAIL);

    const routeResult = await supabaseAdmin
        .from('shuttle_routes')
        .select('agency_id')
        .eq('origin', origin)
        .eq('destination', destination)
        .eq('type', type)
        .limit(1)
        .maybeSingle<{ agency_id: string | null }>();

    if (routeResult.error) {
        logger.warn('Unable to resolve shuttle agency assignment for cancellation:', routeResult.error);
        return fallbackAgencyEmail;
    }

    const agencyId = routeResult.data?.agency_id;
    if (!agencyId) return fallbackAgencyEmail;

    const agencyResult = await supabaseAdmin
        .from('agencies')
        .select('email, is_active')
        .eq('id', agencyId)
        .maybeSingle<{ email: string | null; is_active: boolean | null }>();

    if (agencyResult.error) {
        logger.warn('Unable to resolve shuttle agency email for cancellation:', agencyResult.error);
        return fallbackAgencyEmail;
    }

    if (!agencyResult.data?.is_active) return fallbackAgencyEmail;
    return normalizeEmail(agencyResult.data.email) ?? fallbackAgencyEmail;
}

type CancellationNotificationResult = {
    auditNotes: string | null;
    emailStatus?: 'sent' | 'failed';
    emailAttemptsDelta: number;
    emailLastAttemptAt?: string;
    emailLastError?: string | null;
    warnings: string[];
};

async function notifyTourCancellation(
    reservation: ReservationStatusRow,
    note: string,
    actor: string,
    adminNotes: string | null
): Promise<CancellationNotificationResult> {
    const metadata = parseRequestMetadata(reservation.admin_notes);
    const locale = normalizeLocale(reservation.customer_locale ?? metadata.locale);
    const serviceName =
        reservation.tour_name || (locale.startsWith('en') ? 'Nomada Fantasma tour' : 'Tour Nómada Fantasma');
    const { subject, react } = buildCustomerActionEmail({
        template: 'booking_cancelled',
        locale,
        customerName: reservation.full_name,
        kind: 'tour',
        serviceName,
        date: reservation.date,
        travelers: reservation.number_of_people,
        price: typeof reservation.total_price === 'number' ? reservation.total_price : metadata.price,
        requestId: reservation.id,
        cancellationReason: note,
    });

    let nextNotes = adminNotes;
    const warnings: string[] = [];
    const emailLastAttemptAt = new Date().toISOString();

    const customerResult = await sendManualCustomerEmail({
        to: reservation.email,
        subject,
        react,
        label: 'auto_booking_cancelled_tour',
    });
    await recordInternalNotification({
        requestKind: 'tour',
        requestId: reservation.id,
        recipientType: 'customer',
        recipientEmail: reservation.email,
        template: 'booking_cancelled',
        deliveryStatus: customerResult.success ? 'sent' : 'failed',
        subject,
        providerMessageId: customerResult.id,
        errorMessage: customerResult.success ? null : getErrorMessage(customerResult.error, 'No se pudo notificar la cancelación al cliente.'),
        triggeredBy: actor,
    });

    if (customerResult.success) {
        nextNotes = appendAdminLine(nextNotes, `[${emailLastAttemptAt}] (${actor}) email:auto_booking_cancelled_customer:sent`);
    } else {
        const errorMessage = getErrorMessage(customerResult.error, 'No se pudo notificar la cancelación al cliente.');
        warnings.push(errorMessage);
        nextNotes = appendAdminLine(nextNotes, `[${emailLastAttemptAt}] (${actor}) email:auto_booking_cancelled_customer:failed ${errorMessage}`);
    }

    const agencyEmail = await getTourAgencyEmail(reservation.tour_id);
    if (agencyEmail) {
        const agencyResult = await sendTourCancellationAgencyEmail({
            to: agencyEmail,
            reservationId: reservation.id,
            tourName: serviceName,
            tourDate: reservation.date,
            customerName: reservation.full_name,
            customerEmail: reservation.email,
            customerWhatsapp: reservation.whatsapp,
            guests: reservation.number_of_people,
            cancellationReason: note,
        });
        await recordInternalNotification({
            requestKind: 'tour',
            requestId: reservation.id,
            recipientType: 'agency',
            recipientEmail: agencyEmail,
            template: 'booking_cancelled',
            deliveryStatus: agencyResult.success ? 'sent' : 'failed',
            subject: `Tour cancelado: ${serviceName}`,
            providerMessageId: agencyResult.id,
            errorMessage: agencyResult.success ? null : getErrorMessage(agencyResult.error, 'No se pudo notificar la cancelación a la agencia.'),
            triggeredBy: actor,
        });

        if (agencyResult.success) {
            nextNotes = appendAdminLine(nextNotes, `[${new Date().toISOString()}] (${actor}) email:auto_booking_cancelled_agency:sent`);
        } else {
            const errorMessage = getErrorMessage(agencyResult.error, 'No se pudo notificar la cancelación a la agencia.');
            warnings.push(errorMessage);
            nextNotes = appendAdminLine(nextNotes, `[${new Date().toISOString()}] (${actor}) email:auto_booking_cancelled_agency:failed ${errorMessage}`);
        }
    }

    return {
        auditNotes: nextNotes,
        emailStatus: customerResult.success ? 'sent' : 'failed',
        emailAttemptsDelta: 1,
        emailLastAttemptAt,
        emailLastError: customerResult.success ? null : getErrorMessage(customerResult.error, 'No se pudo notificar la cancelación al cliente.'),
        warnings,
    };
}

async function notifyShuttleCancellation(
    shuttle: ShuttleStatusRow,
    note: string,
    actor: string,
    adminNotes: string | null
): Promise<CancellationNotificationResult> {
    const metadata = parseRequestMetadata(shuttle.admin_notes);
    const locale = normalizeLocale(shuttle.customer_locale ?? metadata.locale);
    const serviceName = `${shuttle.route_origin} → ${shuttle.route_destination}`;
    const { subject, react } = buildCustomerActionEmail({
        template: 'booking_cancelled',
        locale,
        customerName: shuttle.customer_name,
        kind: 'shuttle',
        serviceName,
        date: shuttle.travel_date,
        travelers: shuttle.passengers,
        price: typeof metadata.price === 'number' ? metadata.price : undefined,
        requestId: shuttle.id,
        cancellationReason: note,
    });

    let nextNotes = adminNotes;
    const warnings: string[] = [];
    const emailLastAttemptAt = new Date().toISOString();

    const customerResult = await sendManualCustomerEmail({
        to: shuttle.customer_email,
        subject,
        react,
        label: 'auto_booking_cancelled_shuttle',
    });
    await recordInternalNotification({
        requestKind: 'shuttle',
        requestId: shuttle.id,
        recipientType: 'customer',
        recipientEmail: shuttle.customer_email,
        template: 'booking_cancelled',
        deliveryStatus: customerResult.success ? 'sent' : 'failed',
        subject,
        providerMessageId: customerResult.id,
        errorMessage: customerResult.success ? null : getErrorMessage(customerResult.error, 'No se pudo notificar la cancelación al cliente.'),
        triggeredBy: actor,
    });

    if (customerResult.success) {
        nextNotes = appendAdminLine(nextNotes, `[${emailLastAttemptAt}] (${actor}) email:auto_booking_cancelled_customer:sent`);
    } else {
        const errorMessage = getErrorMessage(customerResult.error, 'No se pudo notificar la cancelación al cliente.');
        warnings.push(errorMessage);
        nextNotes = appendAdminLine(nextNotes, `[${emailLastAttemptAt}] (${actor}) email:auto_booking_cancelled_customer:failed ${errorMessage}`);
    }

    const agencyEmail = await getShuttleAgencyEmail(shuttle.route_origin, shuttle.route_destination, shuttle.type ?? 'shared');
    if (agencyEmail) {
        const agencyResult = await sendShuttleCancellationAgencyEmail({
            to: agencyEmail,
            bookingId: shuttle.id,
            origin: shuttle.route_origin,
            destination: shuttle.route_destination,
            travelDate: shuttle.travel_date,
            travelTime: shuttle.travel_time,
            passengers: shuttle.passengers,
            pickupLocation: shuttle.pickup_location,
            customerName: shuttle.customer_name,
            customerEmail: shuttle.customer_email,
            cancellationReason: note,
        });
        await recordInternalNotification({
            requestKind: 'shuttle',
            requestId: shuttle.id,
            recipientType: 'agency',
            recipientEmail: agencyEmail,
            template: 'booking_cancelled',
            deliveryStatus: agencyResult.success ? 'sent' : 'failed',
            subject: `Shuttle cancelado: ${shuttle.route_origin} -> ${shuttle.route_destination}`,
            providerMessageId: agencyResult.id,
            errorMessage: agencyResult.success ? null : getErrorMessage(agencyResult.error, 'No se pudo notificar la cancelación a la agencia.'),
            triggeredBy: actor,
        });

        if (agencyResult.success) {
            nextNotes = appendAdminLine(nextNotes, `[${new Date().toISOString()}] (${actor}) email:auto_booking_cancelled_agency:sent`);
        } else {
            const errorMessage = getErrorMessage(agencyResult.error, 'No se pudo notificar la cancelación a la agencia.');
            warnings.push(errorMessage);
            nextNotes = appendAdminLine(nextNotes, `[${new Date().toISOString()}] (${actor}) email:auto_booking_cancelled_agency:failed ${errorMessage}`);
        }
    }

    return {
        auditNotes: nextNotes,
        emailStatus: customerResult.success ? 'sent' : 'failed',
        emailAttemptsDelta: 1,
        emailLastAttemptAt,
        emailLastError: customerResult.success ? null : getErrorMessage(customerResult.error, 'No se pudo notificar la cancelación al cliente.'),
        warnings,
    };
}

function isValidStatus(status: string): status is RequestStatus {
    return ['pending', 'processing', 'confirmed', 'cancelled', 'completed'].includes(status);
}

function normalizeStoredStatus(status: string | null): RequestStatus {
    if (isValidStatus(status ?? '')) return status as RequestStatus;
    return 'pending';
}

function normalizeActor(raw: string | null): string {
    const value = (raw ?? '').trim();
    if (!value) return 'recepcion';
    return value.slice(0, 80);
}

function normalizeNote(raw: unknown): string | null {
    if (typeof raw !== 'string') return null;
    const value = raw.trim();
    return value ? value.slice(0, 2000) : null;
}

function assertTransitionAllowed(fromStatus: RequestStatus, toStatus: RequestStatus): string | null {
    if (fromStatus === toStatus) {
        return 'El estado nuevo debe ser diferente al estado actual.';
    }
    if (!TRANSITION_MATRIX[fromStatus].includes(toStatus)) {
        return `Transicion invalida: ${fromStatus} -> ${toStatus}.`;
    }
    return null;
}

function validateTransitionNote(fromStatus: RequestStatus, toStatus: RequestStatus, note: string | null): string | null {
    if (NOTE_REQUIRED_STATUSES.has(toStatus) && !note) {
        return `Nota requerida para mover a ${toStatus}.`;
    }
    if (!note) return null;

    if (note.length < MIN_NOTE_LENGTH) {
        return `La nota para ${toStatus} debe tener al menos ${MIN_NOTE_LENGTH} caracteres.`;
    }

    // Strict evidence requirements removed for a more fluid admin experience.
    // The previous evidence checks (agency, confirmation, etc.) are no longer enforced.

    return null;
}

export async function PATCH(request: Request) {
    try {
        const adminContext = await getAuthorizedAdminContext(request);
        if (!adminContext) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const kind = body?.kind as RequestKind | undefined;
        const id = typeof body?.id === 'string' ? body.id.trim() : '';
        const nextStatusRaw = typeof body?.nextStatus === 'string' ? body.nextStatus.trim() : '';
        const expectedCurrentStatusRaw = typeof body?.currentStatus === 'string' ? body.currentStatus.trim() : '';
        const note = normalizeNote(body?.note);
        const actor = normalizeActor(adminContext.actor);

        if (!kind || !['tour', 'shuttle'].includes(kind)) {
            return NextResponse.json({ error: 'kind es requerido (tour o shuttle).' }, { status: 400 });
        }

        if (!id) {
            return NextResponse.json({ error: 'id es requerido.' }, { status: 400 });
        }

        if (!isValidStatus(nextStatusRaw)) {
            return NextResponse.json({ error: 'Estado invalido.' }, { status: 400 });
        }
        if (!isValidStatus(expectedCurrentStatusRaw)) {
            return NextResponse.json({ error: 'currentStatus es requerido y debe ser valido.' }, { status: 400 });
        }

        if (kind === 'tour') {
            const reservationResult = await supabaseAdmin
                .from('reservations')
                .select('*')
                .eq('id', id)
                .single<ReservationRow>();

            if (reservationResult.error || !reservationResult.data) {
                return NextResponse.json({ error: 'Reserva no encontrada.' }, { status: 404 });
            }

            const persistedCurrentStatusRaw = reservationResult.data.status;
            const currentStatus = normalizeStoredStatus(persistedCurrentStatusRaw);
            if (expectedCurrentStatusRaw !== currentStatus) {
                return NextResponse.json({ error: CONFLICT_MESSAGE }, { status: 409 });
            }

            const transitionError = assertTransitionAllowed(currentStatus, nextStatusRaw);
            if (transitionError) {
                return NextResponse.json({ error: transitionError }, { status: 400 });
            }
            const noteValidationError = validateTransitionNote(currentStatus, nextStatusRaw, note);
            if (noteValidationError) {
                return NextResponse.json({ error: noteValidationError }, { status: 400 });
            }

            const updatePayload: Database['public']['Tables']['reservations']['Update'] = {
                status: nextStatusRaw,
            };

            if (nextStatusRaw === 'confirmed') updatePayload.confirmed_at = new Date().toISOString();
            if (nextStatusRaw === 'cancelled') updatePayload.cancelled_at = new Date().toISOString();
            updatePayload.admin_notes = appendStatusNote(reservationResult.data.admin_notes, actor, nextStatusRaw, note);

            let updateQuery = supabaseAdmin
                .from('reservations')
                .update(updatePayload)
                .eq('id', id);

            updateQuery = persistedCurrentStatusRaw === null
                ? updateQuery.is('status', null)
                : updateQuery.eq('status', persistedCurrentStatusRaw);

            const updateResult = await updateQuery
                .select('id,status')
                .maybeSingle();

            if (updateResult.error) {
                logger.error('Error updating reservation status:', updateResult.error);
                return NextResponse.json({ error: 'No se pudo actualizar la reserva.' }, { status: 500 });
            }
            if (!updateResult.data) {
                return NextResponse.json({ error: CONFLICT_MESSAGE }, { status: 409 });
            }

            const transitionInsert: TransitionInsert = {
                request_kind: 'tour',
                request_id: id,
                from_status: currentStatus,
                to_status: nextStatusRaw,
                note,
                actor,
            };

            const transitionResult = await supabaseAdmin
                .from('internal_request_transitions')
                .insert(transitionInsert);

            if (transitionResult.error) {
                logger.error('Error inserting transition audit event:', transitionResult.error);
                const rollbackPayload: Database['public']['Tables']['reservations']['Update'] = {
                    status: reservationResult.data.status,
                    confirmed_at: reservationResult.data.confirmed_at,
                    cancelled_at: reservationResult.data.cancelled_at,
                    admin_notes: reservationResult.data.admin_notes,
                };
                const rollbackResult = await supabaseAdmin
                    .from('reservations')
                    .update(rollbackPayload)
                    .eq('id', id);
                if (rollbackResult.error) {
                    logger.error('Error rolling back reservation after audit failure:', rollbackResult.error);
                }
                return NextResponse.json(
                    { error: 'No se pudo registrar la auditoria del cambio.' },
                    { status: 500 }
                );
            }

            let warning: string | undefined;

            if (nextStatusRaw === 'cancelled' && note) {
                const notificationResult = await notifyTourCancellation(
                    reservationResult.data as ReservationStatusRow,
                    note,
                    actor,
                    updatePayload.admin_notes ?? reservationResult.data.admin_notes
                );

                const notificationUpdate: ReservationUpdate = {
                    admin_notes: notificationResult.auditNotes,
                    email_delivery_status: notificationResult.emailStatus,
                    email_attempts: (reservationResult.data.email_attempts ?? 0) + notificationResult.emailAttemptsDelta,
                    email_last_attempt_at: notificationResult.emailLastAttemptAt,
                    email_last_error: notificationResult.emailLastError,
                };

                const notificationPersist = await supabaseAdmin
                    .from('reservations')
                    .update(notificationUpdate)
                    .eq('id', id);

                if (notificationPersist.error) {
                    logger.error('Error persisting reservation cancellation notification metadata:', notificationPersist.error);
                }

                if (notificationResult.warnings.length > 0) {
                    warning = notificationResult.warnings.join(' ');
                }
            }

            return NextResponse.json({
                success: true,
                message: 'Estado actualizado.',
                data: updateResult.data,
                warning,
            });
        }

        const shuttleResult = await supabaseAdmin
            .from('shuttle_bookings')
            .select('*')
            .eq('id', id)
            .single<ShuttleBookingRow>();

        if (shuttleResult.error || !shuttleResult.data) {
            return NextResponse.json({ error: 'Shuttle no encontrado.' }, { status: 404 });
        }

        const persistedCurrentStatusRaw = shuttleResult.data.status;
        const currentStatus = normalizeStoredStatus(persistedCurrentStatusRaw);
        if (expectedCurrentStatusRaw !== currentStatus) {
            return NextResponse.json({ error: CONFLICT_MESSAGE }, { status: 409 });
        }

        const transitionError = assertTransitionAllowed(currentStatus, nextStatusRaw);
        if (transitionError) {
            return NextResponse.json({ error: transitionError }, { status: 400 });
        }
        const noteValidationError = validateTransitionNote(currentStatus, nextStatusRaw, note);
        if (noteValidationError) {
            return NextResponse.json({ error: noteValidationError }, { status: 400 });
        }

        const updatePayload: Database['public']['Tables']['shuttle_bookings']['Update'] = {
            status: nextStatusRaw,
        };

        if (nextStatusRaw === 'confirmed') updatePayload.confirmed_at = new Date().toISOString();
        if (nextStatusRaw === 'cancelled') updatePayload.cancelled_at = new Date().toISOString();
        updatePayload.admin_notes = appendStatusNote(shuttleResult.data.admin_notes, actor, nextStatusRaw, note);

        let updateQuery = supabaseAdmin
            .from('shuttle_bookings')
            .update(updatePayload)
            .eq('id', id);

        updateQuery = persistedCurrentStatusRaw === null
            ? updateQuery.is('status', null)
            : updateQuery.eq('status', persistedCurrentStatusRaw);

        const updateResult = await updateQuery
            .select('id,status')
            .maybeSingle();

        if (updateResult.error) {
            logger.error('Error updating shuttle status:', updateResult.error);
            return NextResponse.json({ error: 'No se pudo actualizar el shuttle.' }, { status: 500 });
        }
        if (!updateResult.data) {
            return NextResponse.json({ error: CONFLICT_MESSAGE }, { status: 409 });
        }

        const transitionInsert: TransitionInsert = {
            request_kind: 'shuttle',
            request_id: id,
            from_status: currentStatus,
            to_status: nextStatusRaw,
            note,
            actor,
        };

        const transitionResult = await supabaseAdmin
            .from('internal_request_transitions')
            .insert(transitionInsert);

        if (transitionResult.error) {
            logger.error('Error inserting transition audit event:', transitionResult.error);
            const rollbackPayload: Database['public']['Tables']['shuttle_bookings']['Update'] = {
                status: shuttleResult.data.status,
                confirmed_at: shuttleResult.data.confirmed_at,
                cancelled_at: shuttleResult.data.cancelled_at,
                admin_notes: shuttleResult.data.admin_notes,
            };
            const rollbackResult = await supabaseAdmin
                .from('shuttle_bookings')
                .update(rollbackPayload)
                .eq('id', id);
            if (rollbackResult.error) {
                logger.error('Error rolling back shuttle after audit failure:', rollbackResult.error);
            }
            return NextResponse.json(
                { error: 'No se pudo registrar la auditoria del cambio.' },
                { status: 500 }
            );
        }

        let warning: string | undefined;

        if (nextStatusRaw === 'cancelled' && note) {
            const notificationResult = await notifyShuttleCancellation(
                shuttleResult.data as ShuttleStatusRow,
                note,
                actor,
                updatePayload.admin_notes ?? shuttleResult.data.admin_notes
            );

            const notificationUpdate: ShuttleBookingUpdate = {
                admin_notes: notificationResult.auditNotes,
                email_delivery_status: notificationResult.emailStatus,
                email_attempts: (shuttleResult.data.email_attempts ?? 0) + notificationResult.emailAttemptsDelta,
                email_last_attempt_at: notificationResult.emailLastAttemptAt,
                email_last_error: notificationResult.emailLastError,
            };

            const notificationPersist = await supabaseAdmin
                .from('shuttle_bookings')
                .update(notificationUpdate)
                .eq('id', id);

            if (notificationPersist.error) {
                logger.error('Error persisting shuttle cancellation notification metadata:', notificationPersist.error);
            }

            if (notificationResult.warnings.length > 0) {
                warning = notificationResult.warnings.join(' ');
            }
        }

        return NextResponse.json({
            success: true,
            message: 'Estado actualizado.',
            data: updateResult.data,
            warning,
        });
    } catch (error) {
        logger.error('Unexpected error updating internal request status:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
