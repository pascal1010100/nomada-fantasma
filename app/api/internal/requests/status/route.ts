import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/app/lib/supabase/server';
import { isAdminRequestAuthorized } from '@/app/lib/admin-auth';
import logger from '@/app/lib/logger';
import type { Database } from '@/types/database.types';

type ReservationRow = Database['public']['Tables']['reservations']['Row'];
type ShuttleBookingRow = Database['public']['Tables']['shuttle_bookings']['Row'];
type TransitionInsert = Database['public']['Tables']['internal_request_transitions']['Insert'];

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

const NOTE_REQUIRED_STATUSES = new Set<RequestStatus>(['confirmed', 'cancelled', 'completed']);

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

export async function PATCH(request: Request) {
    try {
        if (!isAdminRequestAuthorized(request)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const kind = body?.kind as RequestKind | undefined;
        const id = typeof body?.id === 'string' ? body.id.trim() : '';
        const nextStatusRaw = typeof body?.nextStatus === 'string' ? body.nextStatus.trim() : '';
        const expectedCurrentStatusRaw = typeof body?.currentStatus === 'string' ? body.currentStatus.trim() : '';
        const note = normalizeNote(body?.note);
        const actor = normalizeActor(request.headers.get('x-admin-actor'));

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

        if (NOTE_REQUIRED_STATUSES.has(nextStatusRaw) && !note) {
            return NextResponse.json(
                { error: `Nota requerida para mover a ${nextStatusRaw}.` },
                { status: 400 }
            );
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

            const updatePayload: Database['public']['Tables']['reservations']['Update'] = {
                status: nextStatusRaw,
            };

            if (nextStatusRaw === 'confirmed') updatePayload.confirmed_at = new Date().toISOString();
            if (nextStatusRaw === 'cancelled') updatePayload.cancelled_at = new Date().toISOString();
            if (note) {
                const previous = reservationResult.data.admin_notes?.trim();
                updatePayload.admin_notes = previous
                    ? `${previous}\n[${new Date().toISOString()}] (${actor}) ${nextStatusRaw}: ${note}`
                    : `[${new Date().toISOString()}] (${actor}) ${nextStatusRaw}: ${note}`;
            }

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

            return NextResponse.json({
                success: true,
                message: 'Estado actualizado.',
                data: updateResult.data,
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

        const updatePayload: Database['public']['Tables']['shuttle_bookings']['Update'] = {
            status: nextStatusRaw,
        };

        if (nextStatusRaw === 'confirmed') updatePayload.confirmed_at = new Date().toISOString();
        if (nextStatusRaw === 'cancelled') updatePayload.cancelled_at = new Date().toISOString();
        if (note) {
            const previous = shuttleResult.data.admin_notes?.trim();
            updatePayload.admin_notes = previous
                ? `${previous}\n[${new Date().toISOString()}] (${actor}) ${nextStatusRaw}: ${note}`
                : `[${new Date().toISOString()}] (${actor}) ${nextStatusRaw}: ${note}`;
        }

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

        return NextResponse.json({
            success: true,
            message: 'Estado actualizado.',
            data: updateResult.data,
        });
    } catch (error) {
        logger.error('Unexpected error updating internal request status:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
