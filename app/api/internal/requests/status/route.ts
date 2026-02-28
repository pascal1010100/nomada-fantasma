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

            const currentStatus = reservationResult.data.status;
            if (!isValidStatus(currentStatus)) {
                return NextResponse.json({ error: 'Estado actual invalido en reserva.' }, { status: 400 });
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

            const updateResult = await supabaseAdmin
                .from('reservations')
                .update(updatePayload)
                .eq('id', id)
                .select('id,status')
                .single();

            if (updateResult.error) {
                logger.error('Error updating reservation status:', updateResult.error);
                return NextResponse.json({ error: 'No se pudo actualizar la reserva.' }, { status: 500 });
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

        const currentStatusRaw = shuttleResult.data.status ?? 'pending';
        const currentStatus = isValidStatus(currentStatusRaw) ? currentStatusRaw : 'pending';

        const transitionError = assertTransitionAllowed(currentStatus, nextStatusRaw);
        if (transitionError) {
            return NextResponse.json({ error: transitionError }, { status: 400 });
        }

        const updateResult = await supabaseAdmin
            .from('shuttle_bookings')
            .update({ status: nextStatusRaw })
            .eq('id', id)
            .select('id,status')
            .single();

        if (updateResult.error) {
            logger.error('Error updating shuttle status:', updateResult.error);
            return NextResponse.json({ error: 'No se pudo actualizar el shuttle.' }, { status: 500 });
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
