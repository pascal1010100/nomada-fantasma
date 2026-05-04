import { getTranslations } from 'next-intl/server';
import {
  sendShuttleInitialNotificationEmail,
  sendTourInitialNotificationEmail,
} from '@/app/lib/email';
import { recordInternalNotification } from '@/app/lib/internal-notifications';
import { normalizeLocale } from '@/app/lib/locale';
import logger from '@/app/lib/logger';
import { parseRequestMetadata } from '@/app/lib/request-metadata';
import { supabaseAdmin } from '@/app/lib/supabase/server';

type NotificationJobRow = {
  id: string;
  request_kind: 'tour' | 'guide' | 'shuttle';
  request_id: string;
  recipient_type: 'customer' | 'agency' | 'admin';
  recipient_email: string;
  template: string;
  status: 'pending' | 'processing' | 'sent' | 'failed' | 'cancelled';
  attempts: number;
  max_attempts: number;
  payload: Record<string, unknown> | null;
};

type ProcessNotificationJobsResult = {
  processed: number;
  sent: number;
  failed: number;
  skipped: number;
};

function getErrorMessage(error: unknown, fallback = 'Unknown notification job error'): string {
  if (error instanceof Error && error.message) return error.message;
  if (typeof error === 'string' && error.trim()) return error;
  if (error) return JSON.stringify(error);
  return fallback;
}

function getNextRetryAt(attempts: number): string {
  const waitSeconds = Math.min(60 * (2 ** Math.max(attempts - 1, 0)), 60 * 60);
  return new Date(Date.now() + waitSeconds * 1000).toISOString();
}

function getTourJobLabel(job: NotificationJobRow): 'tour_customer' | 'tour_admin' | 'tour_agency' | 'guide_customer' | 'guide_admin' | 'guide_agency' {
  return `${job.request_kind}_${job.recipient_type}` as ReturnType<typeof getTourJobLabel>;
}

function getShuttleJobLabel(job: NotificationJobRow): 'shuttle_customer' | 'shuttle_admin' | 'shuttle_agency' {
  return `shuttle_${job.recipient_type}` as ReturnType<typeof getShuttleJobLabel>;
}

function assertSupportedTemplate(job: NotificationJobRow): void {
  if (job.template === 'booking_received_customer' && job.recipient_type === 'customer') return;
  if (job.template === 'booking_received_ops' && job.recipient_type !== 'customer') return;
  throw new Error(`Unsupported notification job template: ${job.template}/${job.recipient_type}`);
}

async function sendTourOrGuideJob(job: NotificationJobRow) {
  const reservationResult = await supabaseAdmin
    .from('reservations')
    .select('*')
    .eq('id', job.request_id)
    .single<Record<string, unknown>>();

  if (reservationResult.error || !reservationResult.data) {
    throw new Error('Reservation not found for notification job.');
  }

  const reservation = reservationResult.data;
  const metadata = parseRequestMetadata(typeof reservation.admin_notes === 'string' ? reservation.admin_notes : null);
  const locale = normalizeLocale(
    typeof reservation.customer_locale === 'string' ? reservation.customer_locale : metadata.locale
  );
  const namespace = job.request_kind === 'guide' ? 'GuideEmail' : 'ReservationEmail';
  const t = await getTranslations({ locale, namespace });
  const tourId = typeof reservation.tour_id === 'string' ? reservation.tour_id : null;
  const tourResult = tourId
    ? await supabaseAdmin
      .from('tours')
      .select('title, meeting_point')
      .eq('id', tourId)
      .maybeSingle<{ title: string | null; meeting_point: string | null }>()
    : null;
  const serviceName =
    (typeof reservation.guide_service_name === 'string' && reservation.guide_service_name.trim()) ||
    (typeof reservation.tour_name === 'string' && reservation.tour_name.trim()) ||
    tourResult?.data?.title ||
    (job.request_kind === 'guide' ? 'Servicio de guia' : 'Tour Nómada Fantasma');

  return sendTourInitialNotificationEmail({
    requestKind: job.request_kind === 'guide' ? 'guide' : 'tour',
    label: getTourJobLabel(job),
    recipientEmail: job.recipient_email,
    to: typeof reservation.email === 'string' ? reservation.email : '',
    reservationId: job.request_id,
    customerName: typeof reservation.full_name === 'string' ? reservation.full_name : 'Cliente',
    customerPhone: typeof reservation.whatsapp === 'string' ? reservation.whatsapp : null,
    customerNotes: typeof reservation.notes === 'string' ? reservation.notes : null,
    tourName: serviceName,
    bookingOptionName: typeof reservation.booking_option_name === 'string' ? reservation.booking_option_name : null,
    date: typeof reservation.date === 'string' ? reservation.date : '',
    requestedTime: typeof reservation.requested_time === 'string' ? reservation.requested_time : null,
    meetingPoint: tourResult?.data?.meeting_point ?? null,
    guests: typeof reservation.number_of_people === 'number' ? reservation.number_of_people : 1,
    totalPrice: typeof reservation.total_price === 'number'
      ? reservation.total_price
      : typeof metadata.price === 'number'
        ? metadata.price
        : 0,
    locale,
    t,
  });
}

async function sendShuttleJob(job: NotificationJobRow) {
  const shuttleResult = await supabaseAdmin
    .from('shuttle_bookings')
    .select('*')
    .eq('id', job.request_id)
    .single<Record<string, unknown>>();

  if (shuttleResult.error || !shuttleResult.data) {
    throw new Error('Shuttle booking not found for notification job.');
  }

  const shuttle = shuttleResult.data;
  const metadata = parseRequestMetadata(typeof shuttle.admin_notes === 'string' ? shuttle.admin_notes : null);
  const locale = normalizeLocale(
    typeof shuttle.customer_locale === 'string' ? shuttle.customer_locale : metadata.locale
  );
  const t = await getTranslations({ locale, namespace: 'ShuttleEmail' });

  return sendShuttleInitialNotificationEmail({
    label: getShuttleJobLabel(job),
    recipientEmail: job.recipient_email,
    bookingId: job.request_id,
    customerName: typeof shuttle.customer_name === 'string' ? shuttle.customer_name : 'Cliente',
    customerEmail: typeof shuttle.customer_email === 'string' ? shuttle.customer_email : '',
    customerWhatsapp: typeof shuttle.customer_whatsapp === 'string' ? shuttle.customer_whatsapp : null,
    origin: typeof shuttle.route_origin === 'string' ? shuttle.route_origin : '',
    destination: typeof shuttle.route_destination === 'string' ? shuttle.route_destination : '',
    travelDate: typeof shuttle.travel_date === 'string' ? shuttle.travel_date : '',
    travelTime: typeof shuttle.travel_time === 'string' ? shuttle.travel_time : '',
    passengers: typeof shuttle.passengers === 'number' ? shuttle.passengers : 1,
    pickupLocation: typeof shuttle.pickup_location === 'string' ? shuttle.pickup_location : '',
    type: shuttle.type === 'private' ? 'private' : 'shared',
    price: typeof shuttle.price === 'number'
      ? shuttle.price
      : typeof metadata.price === 'number'
        ? metadata.price
        : undefined,
    createdAt: typeof shuttle.created_at === 'string' ? shuttle.created_at : undefined,
    t,
    locale,
  });
}

async function dispatchNotificationJob(job: NotificationJobRow) {
  assertSupportedTemplate(job);
  if (job.request_kind === 'shuttle') return sendShuttleJob(job);
  return sendTourOrGuideJob(job);
}

async function markProcessing(job: NotificationJobRow, attempts: number): Promise<void> {
  const result = await supabaseAdmin
    .from('notification_jobs' as never)
    .update({
      status: 'processing',
      attempts,
      locked_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    } as never)
    .eq('id', job.id);

  if (result.error) throw result.error;
}

async function markResult(
  job: NotificationJobRow,
  attempts: number,
  result: Awaited<ReturnType<typeof dispatchNotificationJob>>
): Promise<void> {
  const now = new Date().toISOString();
  const errorMessage = result.success ? null : getErrorMessage(result.error, 'No se pudo enviar el email.');
  const nextStatus = result.success ? 'sent' : 'failed';
  const updateResult = await supabaseAdmin
    .from('notification_jobs' as never)
    .update({
      status: nextStatus,
      subject: result.subject,
      provider_message_id: result.id ?? null,
      last_error: errorMessage,
      processed_at: result.success ? now : null,
      scheduled_at: result.success ? now : getNextRetryAt(attempts),
      locked_at: null,
      updated_at: now,
    } as never)
    .eq('id', job.id);

  if (updateResult.error) throw updateResult.error;

  await recordInternalNotification({
    requestKind: job.request_kind,
    requestId: job.request_id,
    recipientType: job.recipient_type,
    recipientEmail: job.recipient_email,
    template: job.template,
    deliveryStatus: result.success ? 'sent' : 'failed',
    subject: result.subject,
    providerMessageId: result.id,
    errorMessage,
    triggeredBy: 'notification_worker',
  });
}

async function markFailed(job: NotificationJobRow, attempts: number, error: unknown): Promise<void> {
  const errorMessage = getErrorMessage(error);
  const updateResult = await supabaseAdmin
    .from('notification_jobs' as never)
    .update({
      status: 'failed',
      last_error: errorMessage,
      scheduled_at: getNextRetryAt(attempts),
      locked_at: null,
      updated_at: new Date().toISOString(),
    } as never)
    .eq('id', job.id);

  if (updateResult.error) {
    logger.error('Unable to mark notification job failed:', updateResult.error);
  }
}

export async function processDueNotificationJobs(limit = 20): Promise<ProcessNotificationJobsResult> {
  const now = new Date().toISOString();
  const queryResult = await supabaseAdmin
    .from('notification_jobs' as never)
    .select('id, request_kind, request_id, recipient_type, recipient_email, template, status, attempts, max_attempts, payload')
    .in('status', ['pending', 'failed'])
    .lte('scheduled_at', now)
    .order('scheduled_at', { ascending: true })
    .limit(Math.max(limit * 3, limit));

  if (queryResult.error) throw queryResult.error;

  const rawJobs = (queryResult.data ?? []) as unknown as NotificationJobRow[];
  const jobs = rawJobs
    .filter((job) => job.attempts < job.max_attempts)
    .slice(0, limit);

  const summary: ProcessNotificationJobsResult = {
    processed: 0,
    sent: 0,
    failed: 0,
    skipped: rawJobs.length - jobs.length,
  };

  for (const job of jobs) {
    const attempts = job.attempts + 1;
    try {
      await markProcessing(job, attempts);
      const result = await dispatchNotificationJob(job);
      await markResult(job, attempts, result);
      summary.processed += 1;
      if (result.success) summary.sent += 1;
      else summary.failed += 1;
    } catch (error) {
      await markFailed(job, attempts, error);
      summary.processed += 1;
      summary.failed += 1;
    }
  }

  return summary;
}
