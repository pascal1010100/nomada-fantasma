import { NextResponse } from 'next/server';
import { getAuthorizedAdminContext } from '@/app/lib/admin-auth';
import logger from '@/app/lib/logger';
import { calculateShuttleTotal } from '@/app/lib/shuttle-pricing';
import { supabaseAdmin } from '@/app/lib/supabase/server';
import type { Database } from '@/types/database.types';

type RequestKind = 'tour' | 'guide' | 'shuttle';
type PaymentStatus = 'unpaid' | 'payment_requested' | 'proof_received' | 'paid' | 'failed' | 'refunded';
type PaymentMethod = 'bank_transfer' | 'cash' | 'card' | 'other';
type ReservationRow = Database['public']['Tables']['reservations']['Row'];
type ShuttleBookingRow = Database['public']['Tables']['shuttle_bookings']['Row'];

const PAYMENT_STATUSES = new Set<PaymentStatus>(['unpaid', 'payment_requested', 'proof_received', 'paid', 'failed', 'refunded']);
const PAYMENT_METHODS = new Set<PaymentMethod>(['bank_transfer', 'cash', 'card', 'other']);

function normalizeActor(raw: string | null): string {
  const value = (raw ?? '').trim();
  return value ? value.slice(0, 80) : 'recepcion';
}

function appendAdminLine(previous: string | null | undefined, line: string): string {
  const trimmed = previous?.trim();
  return trimmed ? `${trimmed}\n${line}` : line;
}

function normalizePaymentStatus(value: unknown): PaymentStatus | null {
  return typeof value === 'string' && PAYMENT_STATUSES.has(value as PaymentStatus)
    ? (value as PaymentStatus)
    : null;
}

function normalizePaymentMethod(value: unknown): PaymentMethod | null {
  if (value === null || value === undefined || value === '') return null;
  return typeof value === 'string' && PAYMENT_METHODS.has(value as PaymentMethod)
    ? (value as PaymentMethod)
    : null;
}

function normalizePaymentAmount(value: unknown): number | null | undefined {
  if (value === null || value === undefined || value === '') return undefined;
  const amount = typeof value === 'number' ? value : Number(value);
  if (!Number.isFinite(amount) || amount <= 0) return null;
  return Number(amount.toFixed(2));
}

function resolveReservationAmount(row: ReservationRow, requestedAmount: number | undefined): number | null {
  if (typeof requestedAmount === 'number') return requestedAmount;
  if (typeof row.payment_amount === 'number') return row.payment_amount;
  return typeof row.total_price === 'number' ? row.total_price : null;
}

function resolveShuttleAmount(row: ShuttleBookingRow, requestedAmount: number | undefined): number | null {
  if (typeof requestedAmount === 'number') return requestedAmount;
  if (typeof row.payment_amount === 'number') return row.payment_amount;
  return calculateShuttleTotal(row.price, row.passengers, row.type);
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
    const paymentStatus = normalizePaymentStatus(body?.paymentStatus);
    const paymentMethod = normalizePaymentMethod(body?.paymentMethod);
    const normalizedAmount = normalizePaymentAmount(body?.paymentAmount);
    const actor = normalizeActor(adminContext.actor);

    if (!kind || !['tour', 'guide', 'shuttle'].includes(kind)) {
      return NextResponse.json({ error: 'kind es requerido (tour, guide o shuttle).' }, { status: 400 });
    }
    if (!id) {
      return NextResponse.json({ error: 'id es requerido.' }, { status: 400 });
    }
    if (!paymentStatus) {
      return NextResponse.json({ error: 'paymentStatus inválido.' }, { status: 400 });
    }
    if (normalizedAmount === null) {
      return NextResponse.json({ error: 'paymentAmount debe ser un número positivo.' }, { status: 400 });
    }

    const now = new Date().toISOString();
    const table = kind === 'shuttle' ? 'shuttle_bookings' : 'reservations';
    const rowResult = await supabaseAdmin
      .from(table)
      .select('*')
      .eq('id', id)
      .single<ReservationRow | ShuttleBookingRow>();

    if (rowResult.error || !rowResult.data) {
      return NextResponse.json({ error: 'Reserva no encontrada.' }, { status: 404 });
    }

    const existing = rowResult.data;
    const paymentAmount = kind === 'shuttle'
      ? resolveShuttleAmount(existing as ShuttleBookingRow, normalizedAmount)
      : resolveReservationAmount(existing as ReservationRow, normalizedAmount);
    const confirmedAt = paymentStatus === 'paid'
      ? ('payment_confirmed_at' in existing && existing.payment_confirmed_at ? existing.payment_confirmed_at : now)
      : paymentStatus === 'refunded' || paymentStatus === 'failed' || paymentStatus === 'unpaid'
        ? null
        : 'payment_confirmed_at' in existing
          ? existing.payment_confirmed_at
          : null;

    const updatePayload = {
      payment_status: paymentStatus,
      payment_method: paymentMethod,
      payment_amount: paymentAmount,
      payment_confirmed_at: confirmedAt,
      payment_updated_at: now,
      admin_notes: appendAdminLine(
        existing.admin_notes,
        `[${now}] (${actor}) payment:${paymentStatus}${paymentMethod ? ` method:${paymentMethod}` : ''}${paymentAmount ? ` amount:${paymentAmount}` : ''}`
      ),
    };

    const updateResult = await supabaseAdmin
      .from(table)
      .update(updatePayload)
      .eq('id', id)
      .select('id,payment_status,payment_method,payment_amount,payment_confirmed_at,payment_updated_at')
      .single();

    if (updateResult.error) {
      logger.error('Error updating payment status:', updateResult.error);
      return NextResponse.json({ error: 'No se pudo actualizar el estado de pago.' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      data: updateResult.data,
    });
  } catch (error) {
    logger.error('Unexpected error updating payment status:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
