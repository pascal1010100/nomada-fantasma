import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  getTranslations: vi.fn(),
  checkRateLimitShared: vi.fn(),
  getClientIP: vi.fn(),
  sendShuttleConfirmationEmails: vi.fn(),
  recordInternalNotification: vi.fn(),
  recordNotificationJobsForRecipients: vi.fn(),
  from: vi.fn(),
}));

vi.mock('next-intl/server', () => ({
  getTranslations: mocks.getTranslations,
}));

vi.mock('@/app/lib/rate-limit', () => ({
  checkRateLimitShared: mocks.checkRateLimitShared,
  getClientIP: mocks.getClientIP,
}));

vi.mock('@/app/lib/email', () => ({
  sendShuttleConfirmationEmails: mocks.sendShuttleConfirmationEmails,
}));

vi.mock('@/app/lib/internal-notifications', () => ({
  recordInternalNotification: mocks.recordInternalNotification,
}));

vi.mock('@/app/lib/notification-jobs', () => ({
  recordNotificationJobsForRecipients: mocks.recordNotificationJobsForRecipients,
}));

vi.mock('@/app/lib/supabase/server', () => ({
  supabaseAdmin: {
    schema: vi.fn(() => ({ from: mocks.from })),
    from: mocks.from,
  },
}));

vi.mock('@/app/lib/logger', () => ({
  default: {
    error: vi.fn(),
    warn: vi.fn(),
    info: vi.fn(),
  },
}));

const { POST } = await import('./route');

const validBody = {
  customerName: 'E2E Shuttle Unit',
  customerEmail: 'shuttle-unit@example.com',
  customerWhatsapp: '50255550000',
  routeOrigin: 'San Pedro La Laguna',
  routeDestination: 'Antigua Guatemala',
  date: '2099-05-05',
  time: '5:00 AM → 8:30 AM',
  passengers: 2,
  pickupLocation: 'Hotel Unit Test San Pedro',
  type: 'shared',
};

function createRequest(body: unknown): Request {
  return new Request('http://localhost/api/shuttles/reserve', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'accept-language': 'es',
      'x-forwarded-for': '203.0.113.10',
    },
    body: JSON.stringify(body),
  });
}

function createSelectQuery(result: unknown) {
  return {
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    limit: vi.fn().mockReturnThis(),
    maybeSingle: vi.fn().mockResolvedValue(result),
  };
}

function createInsertQuery(result: unknown, insertSpy = vi.fn()) {
  return {
    insert: insertSpy.mockReturnValue({
      select: vi.fn().mockReturnValue({
        single: vi.fn().mockResolvedValue(result),
      }),
    }),
  };
}

function createUpdateQuery(result: unknown, updateSpy = vi.fn()) {
  return {
    update: updateSpy.mockReturnValue({
      eq: vi.fn().mockResolvedValue(result),
    }),
  };
}

describe('POST /api/shuttles/reserve', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mocks.getTranslations.mockResolvedValue((key: string) => key);
    mocks.getClientIP.mockReturnValue('203.0.113.10');
    mocks.checkRateLimitShared.mockResolvedValue({
      allowed: true,
      remaining: 4,
      resetAt: Date.now() + 60_000,
    });
    mocks.sendShuttleConfirmationEmails.mockResolvedValue({
      success: true,
      recipients: [
        { label: 'shuttle_customer', to: 'shuttle-unit@example.com', subject: 'Customer', success: true, id: 'mail_1' },
        { label: 'shuttle_admin', to: 'ops@example.com', subject: 'Admin', success: true, id: 'mail_2' },
        { label: 'shuttle_agency', to: 'agency@example.com', subject: 'Agency', success: true, id: 'mail_3' },
      ],
    });
    mocks.recordInternalNotification.mockResolvedValue({ error: null });
    mocks.recordNotificationJobsForRecipients.mockResolvedValue(undefined);
  });

  it('persists route metadata, sends email, and records notifications', async () => {
    const insertSpy = vi.fn();
    const updateSpy = vi.fn();
    const routeQuery = createSelectQuery({
      data: {
        id: 'san-pedro-antigua',
        agency_id: null,
        price: 200,
        schedule: ['5:00 AM → 8:30 AM', '7:00 AM → 10:30 AM'],
      },
      error: null,
    });
    const insertQuery = createInsertQuery({
      data: {
        id: 'booking-1',
        created_at: '2099-05-01T00:00:00Z',
        email_attempts: 0,
      },
      error: null,
    }, insertSpy);
    const updateQuery = createUpdateQuery({ error: null }, updateSpy);

    mocks.from.mockImplementation((table: string) => {
      if (table === 'shuttle_routes') return routeQuery;
      if (table === 'shuttle_bookings') {
        return insertSpy.mock.calls.length === 0 ? insertQuery : updateQuery;
      }
      throw new Error(`Unexpected table ${table}`);
    });

    const response = await POST(createRequest(validBody));
    const json = await response.json();

    expect(response.status).toBe(200);
    expect(json).toMatchObject({
      success: true,
      bookingId: 'booking-1',
      email: {
        sent: true,
        status: 'sent',
      },
    });
    expect(insertSpy).toHaveBeenCalledWith(expect.objectContaining({
      route_id: 'san-pedro-antigua',
      price: 200,
      customer_locale: 'es',
      admin_notes: expect.stringContaining('[[meta:price=200.00]]'),
    }));
    expect(mocks.sendShuttleConfirmationEmails).toHaveBeenCalledWith(expect.objectContaining({
      bookingId: 'booking-1',
      price: 200,
    }));
    expect(mocks.recordInternalNotification).toHaveBeenCalledTimes(3);
    expect(mocks.recordNotificationJobsForRecipients).toHaveBeenCalledWith(expect.objectContaining({
      requestKind: 'shuttle',
      requestId: 'booking-1',
      recipients: expect.arrayContaining([
        expect.objectContaining({ label: 'shuttle_customer', to: 'shuttle-unit@example.com' }),
      ]),
      triggeredBy: 'system',
      payload: expect.objectContaining({
        locale: 'es',
        route_id: 'san-pedro-antigua',
      }),
    }));
    expect(updateSpy).toHaveBeenCalledWith(expect.objectContaining({
      email_delivery_status: 'sent',
      email_attempts: 1,
      email_last_error: null,
    }));
  });

  it('rejects an unavailable shared route before inserting', async () => {
    mocks.from.mockImplementation((table: string) => {
      if (table === 'shuttle_routes') return createSelectQuery({ data: null, error: null });
      throw new Error(`Unexpected table ${table}`);
    });

    const response = await POST(createRequest(validBody));
    const json = await response.json();

    expect(response.status).toBe(400);
    expect(json.error).toBe('Esta ruta de shuttle no está disponible.');
    expect(mocks.sendShuttleConfirmationEmails).not.toHaveBeenCalled();
  });

  it('returns rate-limit headers when blocked', async () => {
    mocks.checkRateLimitShared.mockResolvedValue({
      allowed: false,
      remaining: 0,
      resetAt: Date.now() + 600_000,
      retryAfter: 600,
    });

    const response = await POST(createRequest(validBody));
    const json = await response.json();

    expect(response.status).toBe(429);
    expect(json).toMatchObject({
      error: 'rateLimitExceeded',
      retryAfter: 600,
    });
    expect(response.headers.get('Retry-After')).toBe('600');
    expect(mocks.from).not.toHaveBeenCalled();
  });
});
