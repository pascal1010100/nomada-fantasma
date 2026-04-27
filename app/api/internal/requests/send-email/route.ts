import { NextResponse } from 'next/server';
import { getTranslations } from 'next-intl/server';
import { supabaseAdmin } from '@/app/lib/supabase/server';
import { getAuthorizedAdminContext } from '@/app/lib/admin-auth';
import logger from '@/app/lib/logger';
import { buildCustomerActionEmail, sendManualCustomerEmail, sendTourProviderConfirmationEmail } from '@/app/lib/email';
import { recordInternalNotification } from '@/app/lib/internal-notifications';
import { normalizeLocale } from '@/app/lib/locale';
import { parseRequestMetadata } from '@/app/lib/request-metadata';
import type { Database } from '@/types/database.types';

type RequestKind = 'tour' | 'guide' | 'shuttle';
type ManualTemplate = 'payment_instructions' | 'not_available' | 'booking_confirmed' | 'provider_confirmation';
type ReservationRow = Database['public']['Tables']['reservations']['Row'];
type ShuttleBookingRow = Database['public']['Tables']['shuttle_bookings']['Row'];

type ReservationEmailRow = ReservationRow & {
  customer_locale?: string | null;
};

type ShuttleEmailRow = ShuttleBookingRow & {
  customer_locale?: string | null;
};

type GuidePriceDetails = {
  price?: number;
  priceText?: string;
  priceLabelOverride?: string;
};

const TEMPLATE_WHITELIST: ManualTemplate[] = ['payment_instructions', 'not_available', 'booking_confirmed', 'provider_confirmation'];

type ProviderContext = {
  email: string | null;
  meetingPoint: string | null;
};

function normalizeActor(raw: string | null): string {
  const value = (raw ?? '').trim();
  return value ? value.slice(0, 80) : 'recepcion';
}

function normalizeEmail(value: string | null | undefined): string | null {
  const candidate = value?.trim();
  if (!candidate) return null;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(candidate) ? candidate : null;
}

function getFallbackAgencyEmail(): string | null {
  return normalizeEmail(process.env.DEFAULT_AGENCY_EMAIL) ?? normalizeEmail(process.env.ADMIN_EMAIL);
}

function getErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof Error && error.message) return error.message;
  if (typeof error === 'string' && error.trim()) return error;
  return fallback;
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
  const bankAccountName = process.env.BANK_ACCOUNT_NAME || 'José Manuel Aguilar Cruz';
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

async function getGuidePriceDetails(
  reservation: ReservationEmailRow,
  locale: string,
  metadataPrice?: number
): Promise<GuidePriceDetails> {
  if (typeof reservation.total_price === 'number') {
    return { price: reservation.total_price };
  }

  if (typeof metadataPrice === 'number') {
    return { price: metadataPrice };
  }

  if (!reservation.guide_service_id) {
    return {};
  }

  const serviceResult = await supabaseAdmin
    .from('guide_services')
    .select('price_from, price_to')
    .eq('id', reservation.guide_service_id)
    .maybeSingle<{ price_from: number | null; price_to: number | null }>();

  if (serviceResult.error) {
    logger.warn('Unable to resolve guide service price for manual email:', serviceResult.error);
    return {};
  }

  const from = serviceResult.data?.price_from;
  const to = serviceResult.data?.price_to;

  if (typeof from === 'number' && typeof to === 'number') {
    if (from === to) {
      return { price: from };
    }

    return {
      priceText: `Q${from.toFixed(2)} - Q${to.toFixed(2)}`,
      priceLabelOverride: locale.startsWith('en') ? 'Estimated range' : 'Rango estimado',
    };
  }

  if (typeof from === 'number') {
    return { price: from };
  }

  if (typeof to === 'number') {
    return { price: to };
  }

  return {};
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

async function getTourAgencyEmail(tourId: string | null | undefined): Promise<string | null> {
  const fallbackAgencyEmail = getFallbackAgencyEmail();
  if (!tourId) return fallbackAgencyEmail;

  const tourResult = await supabaseAdmin
    .from('tours')
    .select('agency_id')
    .eq('id', tourId)
    .maybeSingle<{ agency_id: string | null }>();

  if (tourResult.error) {
    logger.warn('Unable to resolve tour provider for manual provider email:', tourResult.error);
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
    logger.warn('Unable to resolve tour provider email for manual provider email:', agencyResult.error);
    return fallbackAgencyEmail;
  }

  if (!agencyResult.data?.is_active) return fallbackAgencyEmail;
  return normalizeEmail(agencyResult.data.email) ?? fallbackAgencyEmail;
}

async function getGuideProviderContext(
  guideId: string | null | undefined,
  guideServiceId: string | null | undefined
): Promise<ProviderContext> {
  const fallbackEmail = getFallbackAgencyEmail();
  let providerEmail: string | null = fallbackEmail;
  let meetingPoint: string | null = null;

  if (guideId) {
    const guideResult = await supabaseAdmin
      .from('guides')
      .select('agency_id, email, is_active')
      .eq('id', guideId)
      .maybeSingle<{ agency_id: string | null; email: string | null; is_active: boolean | null }>();

    if (guideResult.error) {
      logger.warn('Unable to resolve guide provider for manual provider email:', guideResult.error);
    } else if (guideResult.data?.is_active) {
      const guideEmail = normalizeEmail(guideResult.data.email);
      if (guideEmail) {
        providerEmail = guideEmail;
      } else if (guideResult.data.agency_id) {
        const agencyResult = await supabaseAdmin
          .from('agencies')
          .select('email, is_active')
          .eq('id', guideResult.data.agency_id)
          .maybeSingle<{ email: string | null; is_active: boolean | null }>();

        if (agencyResult.error) {
          logger.warn('Unable to resolve guide agency for manual provider email:', agencyResult.error);
        } else if (agencyResult.data?.is_active) {
          providerEmail = normalizeEmail(agencyResult.data.email) ?? fallbackEmail;
        }
      }
    }
  }

  if (guideServiceId) {
    const serviceResult = await supabaseAdmin
      .from('guide_services')
      .select('meeting_point')
      .eq('id', guideServiceId)
      .maybeSingle<{ meeting_point: string | null }>();

    if (serviceResult.error) {
      logger.warn('Unable to resolve guide meeting point for manual provider email:', serviceResult.error);
    } else {
      meetingPoint = serviceResult.data?.meeting_point ?? null;
    }
  }

  return { email: providerEmail, meetingPoint };
}

export async function POST(request: Request) {
  try {
    const adminContext = await getAuthorizedAdminContext(request);
    if (!adminContext) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const kind = body?.kind as RequestKind | undefined;
    const id = typeof body?.id === 'string' ? body.id.trim() : '';
    const template = normalizeTemplate(body?.template);
    const actor = normalizeActor(adminContext.actor);

    if (!kind || !['tour', 'guide', 'shuttle'].includes(kind)) {
      return NextResponse.json({ error: 'kind es requerido (tour, guide o shuttle).' }, { status: 400 });
    }
    if (!id) {
      return NextResponse.json({ error: 'id es requerido.' }, { status: 400 });
    }
    if (!template) {
      return NextResponse.json({ error: 'template inválido.' }, { status: 400 });
    }

    if (kind === 'tour' || kind === 'guide') {
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
      const fallbackService =
        kind === 'guide'
          ? reservation.guide_service_name || reservation.tour_name || (locale.startsWith('en') ? 'Nomada Fantasma guide service' : 'Servicio de guia Nómada Fantasma')
          : reservation.tour_name || (locale.startsWith('en') ? 'Nomada Fantasma tour' : 'Tour Nómada Fantasma');
      let serviceName = fallbackService;
      if (kind === 'tour') {
        const tTours = await getTranslations({ locale, namespace: 'Data.tours' });
        const tourKey = reservation.tour_name?.toLowerCase().replace(/\s+/g, '-') || '';
        serviceName = tourKey && tTours.has(`${tourKey}.title`) ? tTours(`${tourKey}.title`) : fallbackService;
      }

      if (template === 'provider_confirmation') {
        const guideProviderContext =
          kind === 'guide'
            ? await getGuideProviderContext(reservation.guide_id, reservation.guide_service_id)
            : null;
        const providerEmail = kind === 'guide'
          ? guideProviderContext?.email ?? null
          : await getTourAgencyEmail(reservation.tour_id);

        if (!providerEmail) {
          return NextResponse.json({ error: 'No hay correo de proveedor configurado para esta solicitud.' }, { status: 400 });
        }

        let meetingPoint: string | null = null;
        if (kind === 'guide') {
          meetingPoint = guideProviderContext?.meetingPoint ?? null;
        } else if (reservation.tour_id) {
          const tourResult = await supabaseAdmin
            .from('tours')
            .select('meeting_point')
            .eq('id', reservation.tour_id)
            .maybeSingle<{ meeting_point: string | null }>();

          if (tourResult.error) {
            logger.warn('Unable to resolve meeting point for manual provider email:', tourResult.error);
          } else {
            meetingPoint = tourResult.data?.meeting_point ?? null;
          }
        }

        const providerResult = await sendTourProviderConfirmationEmail({
          serviceKind: kind,
          to: providerEmail,
          reservationId: reservation.id,
          tourName: fallbackService,
          bookingOptionName: metadata.bookingOptionName,
          tourDate: reservation.date,
          requestedTime: reservation.requested_time,
          meetingPoint,
          customerName: reservation.full_name,
          customerEmail: reservation.email,
          customerWhatsapp: reservation.whatsapp,
          customerNotes: reservation.notes,
          guests: reservation.number_of_people,
        });
        const subject = `${kind === 'guide' ? 'Servicio de guia confirmado para operar' : 'Tour confirmado para operar'}: ${fallbackService}`;

        await recordInternalNotification({
          requestKind: kind,
          requestId: reservation.id,
          recipientType: 'agency',
          recipientEmail: providerEmail,
          template: 'booking_confirmed_provider',
          deliveryStatus: providerResult.success ? 'sent' : 'failed',
          subject,
          providerMessageId: providerResult.id,
          errorMessage: providerResult.success ? null : getErrorMessage(providerResult.error, 'No se pudo enviar la confirmación al proveedor.'),
          triggeredBy: actor,
        });

        if (!providerResult.success) {
          return NextResponse.json(
            { error: getErrorMessage(providerResult.error, 'No se pudo enviar la confirmación al proveedor.') },
            { status: 502 }
          );
        }

        await supabaseAdmin
          .from('reservations')
          .update({
            admin_notes: appendAuditNote(reservation.admin_notes, actor, template),
          } as Database['public']['Tables']['reservations']['Update'])
          .eq('id', reservation.id);

        return NextResponse.json({ success: true, subject, recipientEmail: providerEmail });
      }

      const guidePriceDetails =
        kind === 'guide'
          ? await getGuidePriceDetails(reservation, locale, metadata.price)
          : {};

      let pickupTime: string | undefined;
      let meetingPoint: string | undefined;

      if (kind === 'tour' && reservation.tour_id) {
          const { data: tourData } = await supabaseAdmin
              .from('tours')
              .select('pickup_time, meeting_point')
              .eq('id', reservation.tour_id)
              .maybeSingle();
          if (tourData) {
              pickupTime = tourData.pickup_time ? tourData.pickup_time.toString().slice(0, 5) : undefined;
              meetingPoint = tourData.meeting_point || undefined;
          }
      }

      const { subject, react } = buildCustomerActionEmail({
        template,
        locale,
        customerName: reservation.full_name,
        kind,
        serviceName,
        bookingOptionName: metadata.bookingOptionName,
        date: reservation.date,
        travelers: reservation.number_of_people,
        price:
          kind === 'guide'
            ? guidePriceDetails.price
            : typeof reservation.total_price === 'number'
              ? reservation.total_price
              : metadata.price,
        priceText: kind === 'guide' ? guidePriceDetails.priceText : undefined,
        priceLabelOverride: kind === 'guide' ? guidePriceDetails.priceLabelOverride : undefined,
        requestId: reservation.id,
        paymentOptions: getPaymentOptions(locale, reservation.id, serviceName),
        pickupTime,
        meetingPoint,
      });

      const emailResult = await sendManualCustomerEmail({
        to: reservation.email,
        subject,
        react,
        label: `manual_${template}_${kind}`,
      });

      if (!emailResult.success) {
        const errorMessage = emailResult.error instanceof Error ? emailResult.error.message : 'No se pudo enviar el correo manual.';
        await recordInternalNotification({
          requestKind: kind,
          requestId: reservation.id,
          recipientType: 'customer',
          recipientEmail: reservation.email,
          template,
          deliveryStatus: 'failed',
          subject,
          providerMessageId: emailResult.id,
          errorMessage,
          triggeredBy: actor,
        });
        return NextResponse.json({ error: errorMessage }, { status: 502 });
      }

      await recordInternalNotification({
        requestKind: kind,
        requestId: reservation.id,
        recipientType: 'customer',
        recipientEmail: reservation.email,
        template,
        deliveryStatus: 'sent',
        subject,
        providerMessageId: emailResult.id,
        triggeredBy: actor,
      });

      await supabaseAdmin
        .from('reservations')
        .update({
          admin_notes: appendAuditNote(reservation.admin_notes, actor, template),
          email_delivery_status: 'sent',
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

    if (template === 'provider_confirmation') {
      return NextResponse.json(
        { error: 'El reenvío operativo al proveedor todavía está disponible solo para tours y guías.' },
        { status: 400 }
      );
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
      travelTime: shuttle.travel_time,
      pickupLocation: shuttle.pickup_location,
    });

    const emailResult = await sendManualCustomerEmail({
      to: shuttle.customer_email,
      subject,
      react,
      label: `manual_${template}_shuttle`,
    });

    if (!emailResult.success) {
      const errorMessage = emailResult.error instanceof Error ? emailResult.error.message : 'No se pudo enviar el correo manual.';
      await recordInternalNotification({
        requestKind: 'shuttle',
        requestId: shuttle.id,
        recipientType: 'customer',
        recipientEmail: shuttle.customer_email,
        template,
        deliveryStatus: 'failed',
        subject,
        providerMessageId: emailResult.id,
        errorMessage,
        triggeredBy: actor,
      });
      return NextResponse.json({ error: errorMessage }, { status: 502 });
    }

    await recordInternalNotification({
      requestKind: 'shuttle',
      requestId: shuttle.id,
      recipientType: 'customer',
      recipientEmail: shuttle.customer_email,
      template,
      deliveryStatus: 'sent',
      subject,
      providerMessageId: emailResult.id,
      triggeredBy: actor,
    });

    await supabaseAdmin
      .from('shuttle_bookings')
      .update({
        admin_notes: appendAuditNote(shuttle.admin_notes, actor, template),
        email_delivery_status: 'sent',
      } as Database['public']['Tables']['shuttle_bookings']['Update'])
      .eq('id', shuttle.id);

    return NextResponse.json({ success: true, subject });
  } catch (error) {
    logger.error('Unexpected error sending manual customer email:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
