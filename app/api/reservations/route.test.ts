import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  getTranslations: vi.fn(),
  checkRateLimitShared: vi.fn(),
  getClientIP: vi.fn(),
  sendTourConfirmationEmails: vi.fn(),
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
  sendTourConfirmationEmails: mocks.sendTourConfirmationEmails,
}));

vi.mock('@/app/lib/internal-notifications', () => ({
  recordInternalNotification: mocks.recordInternalNotification,
}));

vi.mock('@/app/lib/notification-jobs', () => ({
  recordNotificationJobsForRecipients: mocks.recordNotificationJobsForRecipients,
}));

vi.mock('@/app/lib/admin-auth', () => ({
  getAuthorizedAdminContext: vi.fn(),
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
  name: 'E2E Tour Unit',
  email: 'tour-unit@example.com',
  phone: '50255550001',
  date: '2099-05-05',
  time: '10:00',
  guests: 2,
  type: 'tour',
  tourId: '550e8400-e29b-41d4-a716-446655440000',
  totalPrice: 700,
  notes: 'Unit test reservation',
};

const reservationRow = {
  id: 'reservation-1',
  created_at: '2099-05-01T00:00:00Z',
  full_name: 'E2E Tour Unit',
  email: 'tour-unit@example.com',
  whatsapp: '50255550001',
  date: '2099-05-05',
  requested_time: '10:00',
  number_of_people: 2,
  reservation_type: 'tour',
  tour_id: '550e8400-e29b-41d4-a716-446655440000',
  tour_name: null,
  total_price: 700,
  notes: 'Unit test reservation',
  status: 'pending',
  email_attempts: 0,
};

function createRequest(body: unknown): Request {
  return new Request('http://localhost/api/reservations', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'accept-language': 'es',
      'x-forwarded-for': '203.0.113.20',
    },
    body: JSON.stringify(body),
  });
}

function createInsertQuerySequence(results: Array<{ data: unknown; error: unknown }>, insertSpy = vi.fn()) {
  return {
    insert: insertSpy.mockImplementation(() => {
      const result = results.shift();
      return {
        select: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue(result),
        }),
      };
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

function createTourLookupQuery() {
  let selectedColumns = '';
  const query = {
    select: vi.fn((columns: string) => {
      selectedColumns = columns;
      return query;
    }),
    eq: vi.fn().mockReturnThis(),
    maybeSingle: vi.fn(async () => {
      if (selectedColumns.includes('meeting_point')) {
        return {
          data: {
            title: 'Free Riders Horseback Volcano View Trail Adventure',
            meeting_point: 'San Pedro Dock',
          },
          error: null,
        };
      }
      return {
        data: {
          agency_id: null,
          title: 'Free Riders Horseback Volcano View Trail Adventure',
        },
        error: null,
      };
    }),
  };
  return query;
}

describe('POST /api/reservations', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mocks.getTranslations.mockResolvedValue((key: string) => key);
    mocks.getClientIP.mockReturnValue('203.0.113.20');
    mocks.checkRateLimitShared.mockResolvedValue({
      allowed: true,
      remaining: 4,
      resetAt: Date.now() + 60_000,
    });
    mocks.sendTourConfirmationEmails.mockResolvedValue({
      success: true,
      recipients: [
        { label: 'tour_customer', to: 'tour-unit@example.com', subject: 'Customer', success: true, id: 'mail_1' },
        { label: 'tour_admin', to: 'ops@example.com', subject: 'Admin', success: true, id: 'mail_2' },
        { label: 'tour_agency', to: 'agency@example.com', subject: 'Agency', success: true, id: 'mail_3' },
      ],
    });
    mocks.recordInternalNotification.mockResolvedValue({ error: null });
    mocks.recordNotificationJobsForRecipients.mockResolvedValue(undefined);
  });

  it('creates a tour reservation, sends email, and tracks delivery', async () => {
    const insertSpy = vi.fn();
    const updateSpy = vi.fn();
    const insertQuery = createInsertQuerySequence([{ data: reservationRow, error: null }], insertSpy);
    const updateQuery = createUpdateQuery({ error: null }, updateSpy);

    mocks.from.mockImplementation((table: string) => {
      if (table === 'reservations') {
        return insertSpy.mock.calls.length === 0 ? insertQuery : updateQuery;
      }
      if (table === 'tours') return createTourLookupQuery();
      throw new Error(`Unexpected table ${table}`);
    });

    const response = await POST(createRequest(validBody));
    const json = await response.json();

    expect(response.status).toBe(201);
    expect(json).toMatchObject({
      success: true,
      reservation: {
        id: 'reservation-1',
        customer_email: 'tour-unit@example.com',
        status: 'pending',
      },
      email: {
        sent: true,
        status: 'sent',
      },
    });
    expect(insertSpy).toHaveBeenCalledWith([expect.objectContaining({
      full_name: 'E2E Tour Unit',
      tour_id: validBody.tourId,
      customer_locale: 'es',
      admin_notes: expect.stringContaining('[[meta:price=700.00]]'),
    })]);
    expect(mocks.sendTourConfirmationEmails).toHaveBeenCalledWith(expect.objectContaining({
      reservationId: 'reservation-1',
      tourName: 'Free Riders Horseback Volcano View Trail Adventure',
      requestedTime: '10:00',
      totalPrice: 700,
    }));
    expect(mocks.recordInternalNotification).toHaveBeenCalledTimes(3);
    expect(mocks.recordNotificationJobsForRecipients).toHaveBeenCalledWith(expect.objectContaining({
      requestKind: 'tour',
      requestId: 'reservation-1',
      recipients: expect.arrayContaining([
        expect.objectContaining({ label: 'tour_customer', to: 'tour-unit@example.com' }),
      ]),
      triggeredBy: 'system',
      payload: expect.objectContaining({
        locale: 'es',
        reservation_type: 'tour',
      }),
    }));
    expect(updateSpy).toHaveBeenCalledWith(expect.objectContaining({
      email_delivery_status: 'sent',
      email_attempts: 1,
      email_last_error: null,
    }));
  });

  it('falls back without optional metadata columns when admin_notes is unavailable', async () => {
    const insertSpy = vi.fn();
    const insertQuery = createInsertQuerySequence([
      {
        data: null,
        error: {
          message: "Could not find the 'admin_notes' column of 'reservations' in the schema cache",
        },
      },
      { data: reservationRow, error: null },
    ], insertSpy);
    const updateQuery = createUpdateQuery({ error: null });

    mocks.from.mockImplementation((table: string) => {
      if (table === 'reservations') {
        return insertSpy.mock.calls.length < 2 ? insertQuery : updateQuery;
      }
      if (table === 'tours') return createTourLookupQuery();
      throw new Error(`Unexpected table ${table}`);
    });

    const response = await POST(createRequest(validBody));

    expect(response.status).toBe(201);
    expect(insertSpy).toHaveBeenCalledTimes(2);
    expect(insertSpy.mock.calls[0][0][0]).toEqual(expect.objectContaining({
      admin_notes: expect.any(String),
      customer_locale: 'es',
    }));
    expect(insertSpy.mock.calls[1][0][0]).not.toHaveProperty('admin_notes');
    expect(insertSpy.mock.calls[1][0][0]).not.toHaveProperty('customer_locale');
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
