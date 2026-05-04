import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  getAuthorizedAdminContext: vi.fn(),
  from: vi.fn(),
  buildCustomerActionEmail: vi.fn(),
  sendManualCustomerEmail: vi.fn(),
  sendShuttleCancellationAgencyEmail: vi.fn(),
  sendShuttleProviderConfirmationEmail: vi.fn(),
  sendTourCancellationAgencyEmail: vi.fn(),
  sendTourProviderConfirmationEmail: vi.fn(),
  recordInternalNotification: vi.fn(),
}));

vi.mock('@/app/lib/admin-auth', () => ({
  getAuthorizedAdminContext: mocks.getAuthorizedAdminContext,
}));

vi.mock('@/app/lib/supabase/server', () => ({
  supabaseAdmin: {
    from: mocks.from,
  },
}));

vi.mock('@/app/lib/email', () => ({
  buildCustomerActionEmail: mocks.buildCustomerActionEmail,
  sendManualCustomerEmail: mocks.sendManualCustomerEmail,
  sendShuttleCancellationAgencyEmail: mocks.sendShuttleCancellationAgencyEmail,
  sendShuttleProviderConfirmationEmail: mocks.sendShuttleProviderConfirmationEmail,
  sendTourCancellationAgencyEmail: mocks.sendTourCancellationAgencyEmail,
  sendTourProviderConfirmationEmail: mocks.sendTourProviderConfirmationEmail,
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

const { PATCH } = await import('./route');

function createRequest(body: unknown): Request {
  return new Request('http://localhost/api/internal/requests/status', {
    method: 'PATCH',
    headers: {
      'content-type': 'application/json',
      'x-admin-actor': 'Recepcion Unit',
    },
    body: JSON.stringify(body),
  });
}

function createSingleSelectQuery(result: unknown) {
  return {
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    single: vi.fn().mockResolvedValue(result),
  };
}

function createStatusUpdateQuery(result: unknown, updateSpy = vi.fn()) {
  const query = {
    update: updateSpy.mockReturnValue({
      eq: vi.fn().mockReturnThis(),
      is: vi.fn().mockReturnThis(),
      select: vi.fn().mockReturnThis(),
      maybeSingle: vi.fn().mockResolvedValue(result),
    }),
  };
  return { query, updateSpy };
}

function createInsertQuery(result: unknown, insertSpy = vi.fn()) {
  return {
    insert: insertSpy.mockResolvedValue(result),
  };
}

describe('PATCH /api/internal/requests/status', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.getAuthorizedAdminContext.mockResolvedValue({
      actor: 'Recepcion Unit',
      email: 'ops@example.com',
      role: 'admin',
      displayName: 'Recepcion Unit',
      source: 'env_fallback',
      user: {},
    });
  });

  it('rejects unauthenticated internal status changes', async () => {
    mocks.getAuthorizedAdminContext.mockResolvedValue(null);

    const response = await PATCH(createRequest({
      kind: 'tour',
      id: 'reservation-1',
      currentStatus: 'pending',
      nextStatus: 'processing',
    }));
    const json = await response.json();

    expect(response.status).toBe(401);
    expect(json.error).toBe('Unauthorized');
    expect(mocks.from).not.toHaveBeenCalled();
  });

  it('updates a reservation status and records an audit transition', async () => {
    const updateSpy = vi.fn();
    const insertSpy = vi.fn();
    const reservation = {
      id: 'reservation-1',
      status: 'pending',
      admin_notes: null,
      confirmed_at: null,
      cancelled_at: null,
    };
    const statusUpdate = createStatusUpdateQuery({
      data: { id: 'reservation-1', status: 'processing' },
      error: null,
    }, updateSpy);
    const transitionInsert = createInsertQuery({ error: null }, insertSpy);
    let reservationCalls = 0;

    mocks.from.mockImplementation((table: string) => {
      if (table === 'reservations') {
        reservationCalls += 1;
        return reservationCalls === 1
          ? createSingleSelectQuery({ data: reservation, error: null })
          : statusUpdate.query;
      }
      if (table === 'internal_request_transitions') return transitionInsert;
      throw new Error(`Unexpected table ${table}`);
    });

    const response = await PATCH(createRequest({
      kind: 'tour',
      id: 'reservation-1',
      currentStatus: 'pending',
      nextStatus: 'processing',
      note: 'Tomado por recepción',
    }));
    const json = await response.json();

    expect(response.status).toBe(200);
    expect(json).toMatchObject({
      success: true,
      data: { id: 'reservation-1', status: 'processing' },
    });
    expect(updateSpy).toHaveBeenCalledWith(expect.objectContaining({
      status: 'processing',
      admin_notes: expect.stringContaining('(Recepcion Unit) processing: Tomado por recepción'),
    }));
    expect(insertSpy).toHaveBeenCalledWith(expect.objectContaining({
      request_kind: 'tour',
      request_id: 'reservation-1',
      from_status: 'pending',
      to_status: 'processing',
      note: 'Tomado por recepción',
      actor: 'Recepcion Unit',
    }));
  });

  it('requires a note when cancelling', async () => {
    mocks.from.mockImplementation((table: string) => {
      if (table === 'shuttle_bookings') {
        return createSingleSelectQuery({
          data: {
            id: 'shuttle-1',
            status: 'processing',
            admin_notes: null,
          },
          error: null,
        });
      }
      throw new Error(`Unexpected table ${table}`);
    });

    const response = await PATCH(createRequest({
      kind: 'shuttle',
      id: 'shuttle-1',
      currentStatus: 'processing',
      nextStatus: 'cancelled',
    }));
    const json = await response.json();

    expect(response.status).toBe(400);
    expect(json.error).toBe('Nota requerida para mover a cancelled.');
  });
});
