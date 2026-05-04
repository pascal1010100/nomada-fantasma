import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  from: vi.fn(),
  loggerError: vi.fn(),
}));

vi.mock('@/app/lib/supabase/server', () => ({
  supabaseAdmin: {
    from: mocks.from,
  },
}));

vi.mock('@/app/lib/logger', () => ({
  default: {
    error: mocks.loggerError,
    warn: vi.fn(),
    info: vi.fn(),
  },
}));

const { recordNotificationJobsForRecipients } = await import('./notification-jobs');

describe('notification jobs outbox', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('records recipient email results as idempotent notification jobs', async () => {
    const upsert = vi.fn().mockResolvedValue({ error: null });
    mocks.from.mockReturnValue({ upsert });

    await recordNotificationJobsForRecipients({
      requestKind: 'shuttle',
      requestId: '550e8400-e29b-41d4-a716-446655440000',
      recipients: [
        { label: 'shuttle_customer', to: 'CLIENTE@Example.com', subject: 'Cliente', success: true, id: 'mail_1' },
        { label: 'shuttle_agency', to: 'agency@example.com', subject: 'Agencia', success: false, error: new Error('Resend timeout') },
      ],
      templateForRecipient: (recipient) =>
        recipient.label.endsWith('_customer') ? 'booking_received_customer' : 'booking_received_ops',
      triggeredBy: 'system',
      payload: { locale: 'es' },
    });

    expect(mocks.from).toHaveBeenCalledWith('notification_jobs');
    expect(upsert).toHaveBeenCalledTimes(2);
    expect(upsert).toHaveBeenNthCalledWith(1, expect.objectContaining({
      request_kind: 'shuttle',
      recipient_type: 'customer',
      recipient_email: 'cliente@example.com',
      template: 'booking_received_customer',
      status: 'sent',
      attempts: 1,
      provider_message_id: 'mail_1',
      idempotency_key: 'shuttle:550e8400-e29b-41d4-a716-446655440000:booking_received_customer:customer:cliente@example.com',
      last_error: null,
    }), { onConflict: 'idempotency_key' });
    expect(upsert).toHaveBeenNthCalledWith(2, expect.objectContaining({
      recipient_type: 'agency',
      recipient_email: 'agency@example.com',
      status: 'failed',
      last_error: 'Resend timeout',
    }), { onConflict: 'idempotency_key' });
  });
});
