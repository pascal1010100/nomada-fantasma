import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  getAuthorizedAdminContext: vi.fn(),
  from: vi.fn(),
}));

vi.mock('@/app/lib/admin-auth', () => ({
  getAuthorizedAdminContext: mocks.getAuthorizedAdminContext,
}));

vi.mock('@/app/lib/supabase/server', () => ({
  supabaseAdmin: {
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

const { PATCH } = await import('./route');

function createRequest(body: unknown): Request {
  return new Request('http://localhost/api/internal/requests/payment', {
    method: 'PATCH',
    headers: {
      'content-type': 'application/json',
      'x-admin-actor': 'Recepcion Unit',
    },
    body: JSON.stringify(body),
  });
}

function createSelectThenUpdateQuery(rowResult: unknown, updateResult: unknown, updateSpy = vi.fn()) {
  let selectCalls = 0;
  return {
    select: vi.fn().mockImplementation(() => {
      selectCalls += 1;
      if (selectCalls === 1) {
        return {
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue(rowResult),
          }),
        };
      }
      return {
        single: vi.fn().mockResolvedValue(updateResult),
      };
    }),
    update: updateSpy.mockReturnValue({
      eq: vi.fn().mockReturnThis(),
      select: vi.fn().mockReturnValue({
        single: vi.fn().mockResolvedValue(updateResult),
      }),
    }),
    updateSpy,
  };
}

describe('PATCH /api/internal/requests/payment', () => {
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

  it('rejects unauthenticated payment updates', async () => {
    mocks.getAuthorizedAdminContext.mockResolvedValue(null);

    const response = await PATCH(createRequest({
      kind: 'tour',
      id: 'reservation-1',
      paymentStatus: 'paid',
    }));

    expect(response.status).toBe(401);
    expect(mocks.from).not.toHaveBeenCalled();
  });

  it('marks a tour reservation as paid with its stored total', async () => {
    const updateSpy = vi.fn();
    const query = createSelectThenUpdateQuery(
      {
        data: {
          id: 'reservation-1',
          admin_notes: null,
          payment_amount: null,
          payment_confirmed_at: null,
          total_price: 700,
        },
        error: null,
      },
      {
        data: {
          id: 'reservation-1',
          payment_status: 'paid',
          payment_amount: 700,
        },
        error: null,
      },
      updateSpy
    );

    mocks.from.mockImplementation((table: string) => {
      if (table === 'reservations') return query;
      throw new Error(`Unexpected table ${table}`);
    });

    const response = await PATCH(createRequest({
      kind: 'tour',
      id: 'reservation-1',
      paymentStatus: 'paid',
      paymentMethod: 'bank_transfer',
    }));
    const json = await response.json();

    expect(response.status).toBe(200);
    expect(json).toMatchObject({ success: true });
    expect(updateSpy).toHaveBeenCalledWith(expect.objectContaining({
      payment_status: 'paid',
      payment_method: 'bank_transfer',
      payment_amount: 700,
      payment_confirmed_at: expect.any(String),
      admin_notes: expect.stringContaining('payment:paid method:bank_transfer amount:700'),
    }));
  });

  it('calculates the shared shuttle payment amount from unit price and passengers', async () => {
    const updateSpy = vi.fn();
    const query = createSelectThenUpdateQuery(
      {
        data: {
          id: 'shuttle-1',
          admin_notes: null,
          payment_amount: null,
          payment_confirmed_at: null,
          price: 200,
          passengers: 2,
          type: 'shared',
        },
        error: null,
      },
      {
        data: {
          id: 'shuttle-1',
          payment_status: 'paid',
          payment_amount: 400,
        },
        error: null,
      },
      updateSpy
    );

    mocks.from.mockImplementation((table: string) => {
      if (table === 'shuttle_bookings') return query;
      throw new Error(`Unexpected table ${table}`);
    });

    const response = await PATCH(createRequest({
      kind: 'shuttle',
      id: 'shuttle-1',
      paymentStatus: 'paid',
    }));

    expect(response.status).toBe(200);
    expect(updateSpy).toHaveBeenCalledWith(expect.objectContaining({
      payment_status: 'paid',
      payment_amount: 400,
      payment_confirmed_at: expect.any(String),
    }));
  });
});
