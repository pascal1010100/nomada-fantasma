import { NextResponse } from 'next/server';
import { getTranslations } from 'next-intl/server';
import { supabaseAdmin } from '@/app/lib/supabase/server';
import { isAdminRequestAuthorized } from '@/app/lib/admin-auth';
import logger from '@/app/lib/logger';
import { buildCustomerActionEmail, sendManualCustomerEmail } from '@/app/lib/email';
import { normalizeLocale } from '@/app/lib/locale';
import { parseRequestMetadata } from '@/app/lib/request-metadata';
import type { Database } from '@/types/database.types';

type RequestKind = 'tour' | 'shuttle';
type ManualTemplate = 'payment_instructions' | 'not_available' | 'booking_confirmed';
type ReservationRow = Database['public']['Tables']['reservations']['Row'];
type ShuttleBookingRow = Database['public']['Tables']['shuttle_bookings']['Row'];

type ReservationEmailRow = ReservationRow & {
  customer_locale?: string | null;
};

type ShuttleEmailRow = ShuttleBookingRow & {
  customer_locale?: string | null;
};

const TEMPLATE_WHITELIST: ManualTemplate[] = ['payment_instructions', 'not_available', 'booking_confirmed'];

function normalizeActor(raw: string | null): string {
  const value = (raw ?? '').trim();
  return value ? value.slice(0, 80) : 'recepcion';
}

type PaymentOption = {
  title: string;
  details: string[];
  ctaLabel?: string;
  ctaHref?: string;
  isPrimary?: boolean;
};

function getPaymentOptions(locale: string, requestId: string, serviceName: string): PaymentOption[] {
  const isEnglish = locale.startsWith('en');
  const bankName = process.env.BANK_BANK_NAME || 'Banrural';
  const bankAccountName = process.env.BANK_ACCOUNT_NAME || 'Hostal Mandalas';
  const bankAccountNumber = process.env.BANK_ACCOUNT_NUMBER || '4093219169';
  const bankCurrency = process.env.BANK_CURRENCY || 'GTQ';
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '50242900009';
  const whatsappBase = `https://wa.me/${whatsappNumber}`;

  const options: PaymentOption[] = [];
  
  // 1. Bank Transfer
  if (bankName && bankAccountNumber) {
    const waTransferMessage = isEnglish
        ? `Hi! I just made the transfer for my booking ${requestId} (${serviceName}). Here is the receipt.`
        : `¡Hola! Ya realicé la transferencia para mi reserva ${requestId} (${serviceName}). Aquí les adjunto el comprobante.`;
    
    options.push({
        title: isEnglish ? 'Bank Transfer' : 'Transferencia Bancaria',
        details: [
            bankName,
            isEnglish ? `Account: ${bankAccountNumber}` : `Cuenta: ${bankAccountNumber}`,
            isEnglish ? `Name: ${bankAccountName}` : `Nombre: ${bankAccountName}`,
            `${bankCurrency} (GTQ)`
        ],
        ctaLabel: isEnglish ? 'I have made the transfer' : 'Ya realicé la transferencia',
        ctaHref: `${whatsappBase}?text=${encodeURIComponent(waTransferMessage)}`,
        isPrimary: true
    });
  }

  // 2. Card Payment (TAB manual QR)
  const waCardMessage = isEnglish
    ? `Hi! I want to pay my booking ${requestId} (${serviceName}) with card. Please send me the TAB QR/Link.`
    : `¡Hola! Quiero pagar mi reserva ${requestId} (${serviceName}) con tarjeta. Por favor envíenme el link/QR de TAB.`;

  options.push({
    title: isEnglish ? 'Credit/Debit Card' : 'Tarjeta de Crédito/Débito',
    details: [
        isEnglish 
            ? 'We use TAB for secure card payments. Request your payment link or QR code below.'
            : 'Usamos TAB para pagos seguros con tarjeta. Solicita tu link de pago o código QR abajo.',
        isEnglish
            ? '⚠️ Note: Card payments include a 10% administrative fee.'
            : '⚠️ Nota: Los pagos con tarjeta incluyen un 10% de recargo por comisión administrativa.'
    ],
    ctaLabel: isEnglish ? 'Request Payment Link (QR)' : 'Solicitar Link de Pago (QR)',
    ctaHref: `${whatsappBase}?text=${encodeURIComponent(waCardMessage)}`
  });

  // 3. Cash Payment (Hostals)
  options.push({
    title: isEnglish ? 'Cash Payment' : 'Pago en Efectivo',
    details: [
        isEnglish
            ? 'You can pay directly at the reception of Hostal Mandalas or Hostal Mandalas Hideout in San Pedro La Laguna.'
            : 'Puedes pagar directamente en la recepción de Hostal Mandalas o Hostal Mandalas Hideout en San Pedro La Laguna.'
    ]
  });

  return options;
}


async function getShuttleRoutePrice(origin: string, destination: string, type: string): Promise<number | undefined> {
  const routeResult = await supabaseAdmin
    .from('shuttle_routes')
    .select('price')
    .eq('origin', origin)
    .eq('destination', destination)
    .eq('type', type)
    .limit(1)
    .maybeSingle<{ price: number | null }>();

  if (routeResult.error) {
    logger.warn('Unable to resolve shuttle route price for manual email:', routeResult.error);
    return undefined;
  }

  return typeof routeResult.data?.price === 'number' ? routeResult.data.price : undefined;
}

function appendAuditNote(previous: string | null, actor: string, template: ManualTemplate): string {
  const line = `[${new Date().toISOString()}] (${actor}) email:${template}`;
  return previous?.trim() ? `${previous.trim()}\n${line}` : line;
}

function normalizeTemplate(value: unknown): ManualTemplate | null {
  return typeof value === 'string' && TEMPLATE_WHITELIST.includes(value as ManualTemplate)
    ? (value as ManualTemplate)
    : null;
}

export async function POST(request: Request) {
  try {
    if (!isAdminRequestAuthorized(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const kind = body?.kind as RequestKind | undefined;
    const id = typeof body?.id === 'string' ? body.id.trim() : '';
    const template = normalizeTemplate(body?.template);
    const actor = normalizeActor(request.headers.get('x-admin-actor'));

    if (!kind || !['tour', 'shuttle'].includes(kind)) {
      return NextResponse.json({ error: 'kind es requerido (tour o shuttle).' }, { status: 400 });
    }
    if (!id) {
      return NextResponse.json({ error: 'id es requerido.' }, { status: 400 });
    }
    if (!template) {
      return NextResponse.json({ error: 'template inválido.' }, { status: 400 });
    }

    if (kind === 'tour') {
      const reservationResult = await supabaseAdmin
        .from('reservations')
        .select('*')
        .eq('id', id)
        .single<ReservationEmailRow>();

      if (reservationResult.error || !reservationResult.data) {
        return NextResponse.json({ error: 'Reserva no encontrada.' }, { status: 404 });
      }

      const reservation = reservationResult.data;
      const metadata = parseRequestMetadata(reservation.admin_notes);
      const locale = normalizeLocale(reservation.customer_locale ?? metadata.locale);
      const tTours = await getTranslations({ locale, namespace: 'Data.tours' });
      const fallbackService = reservation.tour_name || (locale.startsWith('en') ? 'Nomada Fantasma tour' : 'Tour Nómada Fantasma');
      const tourKey = reservation.tour_name?.toLowerCase().replace(/\s+/g, '-') || '';
      const serviceName = tourKey && tTours.has(`${tourKey}.title`) ? tTours(`${tourKey}.title`) : fallbackService;
      const { subject, react } = buildCustomerActionEmail({
        template,
        locale,
        customerName: reservation.full_name,
        kind: 'tour',
        serviceName,
        date: reservation.date,
        travelers: reservation.number_of_people,
        price: typeof reservation.total_price === 'number' ? reservation.total_price : metadata.price,
        requestId: reservation.id,
        paymentOptions: getPaymentOptions(locale, reservation.id, serviceName),
      });

      const emailResult = await sendManualCustomerEmail({
        to: reservation.email,
        subject,
        react,
        label: `manual_${template}_tour`,
      });

      if (!emailResult.success) {
        const errorMessage = emailResult.error instanceof Error ? emailResult.error.message : 'No se pudo enviar el correo manual.';
        return NextResponse.json({ error: errorMessage }, { status: 502 });
      }

      await supabaseAdmin
        .from('reservations')
        .update({
          admin_notes: appendAuditNote(reservation.admin_notes, actor, template),
        } as Database['public']['Tables']['reservations']['Update'])
        .eq('id', reservation.id);

      return NextResponse.json({ success: true, subject });
    }

    const shuttleResult = await supabaseAdmin
      .from('shuttle_bookings')
      .select('*')
      .eq('id', id)
      .single<ShuttleEmailRow>();

    if (shuttleResult.error || !shuttleResult.data) {
      return NextResponse.json({ error: 'Shuttle no encontrado.' }, { status: 404 });
    }

    const shuttle = shuttleResult.data;
    const metadata = parseRequestMetadata(shuttle.admin_notes);
    const locale = normalizeLocale(shuttle.customer_locale ?? metadata.locale);
    const serviceName = `${shuttle.route_origin} → ${shuttle.route_destination}`;
    const price = typeof metadata.price === 'number'
      ? metadata.price
      : await getShuttleRoutePrice(shuttle.route_origin, shuttle.route_destination, shuttle.type ?? 'shared');
    const { subject, react } = buildCustomerActionEmail({
      template,
      locale,
      customerName: shuttle.customer_name,
      kind: 'shuttle',
      serviceName,
      date: shuttle.travel_date,
      travelers: shuttle.passengers,
      price,
      requestId: shuttle.id,
      paymentOptions: getPaymentOptions(locale, shuttle.id, serviceName),
    });

    const emailResult = await sendManualCustomerEmail({
      to: shuttle.customer_email,
      subject,
      react,
      label: `manual_${template}_shuttle`,
    });

    if (!emailResult.success) {
      const errorMessage = emailResult.error instanceof Error ? emailResult.error.message : 'No se pudo enviar el correo manual.';
      return NextResponse.json({ error: errorMessage }, { status: 502 });
    }

    await supabaseAdmin
      .from('shuttle_bookings')
      .update({
        admin_notes: appendAuditNote(shuttle.admin_notes, actor, template),
      } as Database['public']['Tables']['shuttle_bookings']['Update'])
      .eq('id', shuttle.id);

    return NextResponse.json({ success: true, subject });
  } catch (error) {
    logger.error('Unexpected error sending manual customer email:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
