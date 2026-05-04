import { supabaseAdmin } from '@/app/lib/supabase/server';
import logger from '@/app/lib/logger';

export type NotificationRequestKind = 'tour' | 'guide' | 'shuttle';
export type NotificationRecipientType = 'customer' | 'agency' | 'admin';
export type NotificationJobStatus = 'pending' | 'processing' | 'sent' | 'failed' | 'cancelled';

export type NotificationRecipientResult = {
  label: string;
  to: string;
  subject?: string | null;
  success: boolean;
  id?: string | null;
  error?: unknown;
};

type RecordNotificationJobInput = {
  requestKind: NotificationRequestKind;
  requestId: string;
  recipientType: NotificationRecipientType;
  recipientEmail: string;
  template: string;
  status: Extract<NotificationJobStatus, 'sent' | 'failed'>;
  subject?: string | null;
  providerMessageId?: string | null;
  errorMessage?: string | null;
  triggeredBy?: string | null;
  payload?: Record<string, unknown>;
};

type RecordRecipientJobsInput = {
  requestKind: NotificationRequestKind;
  requestId: string;
  recipients: NotificationRecipientResult[];
  templateForRecipient: (recipient: NotificationRecipientResult) => string;
  triggeredBy?: string | null;
  payload?: Record<string, unknown>;
};

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function getRecipientType(label: string): NotificationRecipientType {
  if (label.endsWith('_customer')) return 'customer';
  if (label.endsWith('_admin')) return 'admin';
  return 'agency';
}

function getErrorMessage(error: unknown): string | null {
  if (!error) return null;
  if (error instanceof Error && error.message) return error.message;
  if (typeof error === 'string' && error.trim()) return error;
  return JSON.stringify(error);
}

function buildIdempotencyKey(input: Pick<RecordNotificationJobInput, 'requestKind' | 'requestId' | 'template' | 'recipientType' | 'recipientEmail'>): string {
  return [
    input.requestKind,
    input.requestId,
    input.template,
    input.recipientType,
    normalizeEmail(input.recipientEmail),
  ].join(':');
}

export async function recordNotificationJob(input: RecordNotificationJobInput): Promise<void> {
  const now = new Date().toISOString();
  const normalizedEmail = normalizeEmail(input.recipientEmail);
  const status = input.status;
  const result = await supabaseAdmin
    .from('notification_jobs' as never)
    .upsert({
      request_kind: input.requestKind,
      request_id: input.requestId,
      recipient_type: input.recipientType,
      recipient_email: normalizedEmail,
      channel: 'email',
      template: input.template,
      subject: input.subject ?? null,
      payload: input.payload ?? {},
      idempotency_key: buildIdempotencyKey({ ...input, recipientEmail: normalizedEmail }),
      status,
      attempts: 1,
      processed_at: now,
      updated_at: now,
      provider_message_id: input.providerMessageId ?? null,
      last_error: status === 'failed' ? input.errorMessage ?? 'Unknown email error' : null,
    } as never, { onConflict: 'idempotency_key' });

  if (result.error) {
    logger.error('Unable to persist notification job:', result.error);
  }
}

export async function recordNotificationJobsForRecipients(input: RecordRecipientJobsInput): Promise<void> {
  await Promise.all(input.recipients.map((recipient) => recordNotificationJob({
    requestKind: input.requestKind,
    requestId: input.requestId,
    recipientType: getRecipientType(recipient.label),
    recipientEmail: recipient.to,
    template: input.templateForRecipient(recipient),
    status: recipient.success ? 'sent' : 'failed',
    subject: recipient.subject ?? null,
    providerMessageId: recipient.id ?? null,
    errorMessage: getErrorMessage(recipient.error),
    triggeredBy: input.triggeredBy ?? null,
    payload: {
      ...(input.payload ?? {}),
      provider_label: recipient.label,
      triggered_by: input.triggeredBy ?? null,
    },
  })));
}
