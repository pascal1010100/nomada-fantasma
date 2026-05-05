import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  from: vi.fn(),
  getTranslations: vi.fn(),
  sendShuttleInitialNotificationEmail: vi.fn(),
  sendTourInitialNotificationEmail: vi.fn(),
  recordInternalNotification: vi.fn(),
}));

vi.mock('next-intl/server', () => ({
  getTranslations: mocks.getTranslations,
}));

vi.mock('@/app/lib/supabase/server', () => ({
  supabaseAdmin: {
    from: mocks.from,
  },
}));

vi.mock('@/app/lib/email', () => ({
  sendShuttleInitialNotificationEmail: mocks.sendShuttleInitialNotificationEmail,
  sendTourInitialNotificationEmail: mocks.sendTourInitialNotificationEmail,
}));

vi.mock('@/app/lib/internal-notifications', () => ({
  recordInternalNotification: mocks.recordInternalNotification,
}));

vi.mock('@/app/lib/logger', () => ({
  default: {
    error: vi.fn(),
    warn: vi.fn(),
    info: vi.fn(),
  },
}));

const { processDueNotificationJobs } = await import('./notification-job-processor');

function createJobSelectQuery(data: unknown[]) {
  return {
    select: vi.fn().mockReturnThis(),
    in: vi.fn().mockReturnThis(),
    lte: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
    limit: vi.fn().mockResolvedValue({ data, error: null }),
  };
}

function createSingleSelectQuery(result: unknown) {
  return {
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    single: vi.fn().mockResolvedValue(result),
  };
}

function createUpdateQuery(updateSpy: ReturnType<typeof vi.fn>) {
  return {
    update: updateSpy.mockReturnValue({
      eq: vi.fn().mockResolvedValue({ error: null }),
    }),
  };
}

describe('processDueNotificationJobs', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.getTranslations.mockResolvedValue((key: string) => key);
    mocks.recordInternalNotification.mockResolvedValue(undefined);
  });

  it('retries a failed shuttle job and marks it sent', async () => {
    const processingUpdate = vi.fn();
    const resultUpdate = vi.fn();
    const jobs = [{
      id: 'job-1',
      request_kind: 'shuttle',
      request_id: '550e8400-e29b-41d4-a716-446655440000',
      recipient_type: 'agency',
      recipient_email: 'agency@example.com',
      template: 'booking_received_ops',
      status: 'failed',
      attempts: 1,
      max_attempts: 5,
      payload: {},
    }];

    mocks.sendShuttleInitialNotificationEmail.mockResolvedValue({
      label: 'shuttle_agency',
      to: 'agency@example.com',
      subject: '¿Puedes operar este shuttle?',
      success: true,
      id: 'mail_2',
    });

    let notificationJobCalls = 0;
    mocks.from.mockImplementation((table: string) => {
      if (table === 'notification_jobs') {
        notificationJobCalls += 1;
        if (notificationJobCalls === 1) return createJobSelectQuery(jobs);
        if (notificationJobCalls === 2) return createUpdateQuery(processingUpdate);
        return createUpdateQuery(resultUpdate);
      }
      if (table === 'shuttle_bookings') {
        return createSingleSelectQuery({
          data: {
            id: '550e8400-e29b-41d4-a716-446655440000',
            customer_name: 'Cliente',
            customer_email: 'cliente@example.com',
            customer_whatsapp: '50255550000',
            route_origin: 'San Pedro La Laguna',
            route_destination: 'Antigua Guatemala',
            travel_date: '2099-05-05',
            travel_time: '09:00',
            passengers: 2,
            pickup_location: 'Hotel Unit',
            type: 'shared',
            price: 150,
            created_at: '2099-05-01T00:00:00Z',
            customer_locale: 'es',
            admin_notes: '[[meta:locale=es,price=150.00]]',
          },
          error: null,
        });
      }
      throw new Error(`Unexpected table ${table}`);
    });

    const summary = await processDueNotificationJobs(5);

    expect(summary).toEqual({
      processed: 1,
      sent: 1,
      failed: 0,
      skipped: 0,
    });
    expect(processingUpdate).toHaveBeenCalledWith(expect.objectContaining({
      status: 'processing',
      attempts: 2,
    }));
    expect(mocks.sendShuttleInitialNotificationEmail).toHaveBeenCalledWith(expect.objectContaining({
      label: 'shuttle_agency',
      recipientEmail: 'agency@example.com',
      bookingId: '550e8400-e29b-41d4-a716-446655440000',
      price: 150,
    }));
    expect(resultUpdate).toHaveBeenCalledWith(expect.objectContaining({
      status: 'sent',
      subject: '¿Puedes operar este shuttle?',
      provider_message_id: 'mail_2',
      last_error: null,
    }));
    expect(mocks.recordInternalNotification).toHaveBeenCalledWith(expect.objectContaining({
      requestKind: 'shuttle',
      requestId: '550e8400-e29b-41d4-a716-446655440000',
      recipientType: 'agency',
      recipientEmail: 'agency@example.com',
      deliveryStatus: 'sent',
      triggeredBy: 'notification_worker',
    }));
  });
});
