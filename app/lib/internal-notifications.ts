import { supabaseAdmin } from '@/app/lib/supabase/server';
import logger from '@/app/lib/logger';

export type InternalNotificationRecipient = 'customer' | 'agency' | 'admin';
export type InternalNotificationChannel = 'email';
export type InternalNotificationStatus = 'sent' | 'failed';

export type InternalNotificationRecord = {
    id: string;
    created_at: string;
    request_kind: 'tour' | 'shuttle';
    request_id: string;
    recipient_type: InternalNotificationRecipient;
    recipient_email: string;
    channel: InternalNotificationChannel;
    template: string;
    delivery_status: InternalNotificationStatus;
    subject: string | null;
    provider_message_id: string | null;
    error_message: string | null;
    triggered_by: string | null;
};

type InsertNotificationInput = {
    requestKind: 'tour' | 'shuttle';
    requestId: string;
    recipientType: InternalNotificationRecipient;
    recipientEmail: string;
    template: string;
    deliveryStatus: InternalNotificationStatus;
    subject?: string | null;
    providerMessageId?: string | null;
    errorMessage?: string | null;
    triggeredBy?: string | null;
};

function normalizeEmail(email: string): string {
    return email.trim().toLowerCase();
}

export async function recordInternalNotification(input: InsertNotificationInput): Promise<void> {
    const result = await supabaseAdmin
        .from('internal_request_notifications' as never)
        .insert({
            request_kind: input.requestKind,
            request_id: input.requestId,
            recipient_type: input.recipientType,
            recipient_email: normalizeEmail(input.recipientEmail),
            channel: 'email',
            template: input.template,
            delivery_status: input.deliveryStatus,
            subject: input.subject ?? null,
            provider_message_id: input.providerMessageId ?? null,
            error_message: input.errorMessage ?? null,
            triggered_by: input.triggeredBy ?? null,
        } as never);

    if (result.error) {
        logger.error('Unable to persist internal notification trace:', result.error);
    }
}

export async function listInternalNotificationsForRequests(
    refs: Array<{ kind: 'tour' | 'shuttle'; id: string }>,
    limitPerRequest = 4
): Promise<Record<string, InternalNotificationRecord[]>> {
    if (refs.length === 0) return {};

    const uniqueTourIds = [...new Set(refs.filter((ref) => ref.kind === 'tour').map((ref) => ref.id))];
    const uniqueShuttleIds = [...new Set(refs.filter((ref) => ref.kind === 'shuttle').map((ref) => ref.id))];

    const orClauses: string[] = [];
    if (uniqueTourIds.length > 0) {
        orClauses.push(`and(request_kind.eq.tour,request_id.in.(${uniqueTourIds.join(',')}))`);
    }
    if (uniqueShuttleIds.length > 0) {
        orClauses.push(`and(request_kind.eq.shuttle,request_id.in.(${uniqueShuttleIds.join(',')}))`);
    }

    if (orClauses.length === 0) return {};

    const result = await supabaseAdmin
        .from('internal_request_notifications' as never)
        .select('id, created_at, request_kind, request_id, recipient_type, recipient_email, channel, template, delivery_status, subject, provider_message_id, error_message, triggered_by')
        .or(orClauses.join(','))
        .order('created_at', { ascending: false });

    if (result.error) {
        logger.error('Unable to fetch internal notification traces:', result.error);
        return {};
    }

    const grouped: Record<string, InternalNotificationRecord[]> = {};
    for (const row of (result.data ?? []) as InternalNotificationRecord[]) {
        const key = `${row.request_kind}:${row.request_id}`;
        const entries = grouped[key] ?? [];
        if (entries.length >= limitPerRequest) continue;
        entries.push(row);
        grouped[key] = entries;
    }

    return grouped;
}
