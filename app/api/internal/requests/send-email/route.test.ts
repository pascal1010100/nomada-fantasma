import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  getAuthorizedAdminContext: vi.fn(),
  getTranslations: vi.fn(),
  from: vi.fn(),
  buildCustomerActionEmail: vi.fn(),
  sendManualCustomerEmail: vi.fn(),
  sendShuttleProviderConfirmationEmail: vi.fn(),
  sendTourProviderConfirmationEmail: vi.fn(),
  recordInternalNotification: vi.fn(),
}));

vi.mock('next-intl/server', () => ({
  getTranslations: mocks.getTranslations,
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
  sendShuttleProviderConfirmationEmail: mocks.sendShuttleProviderConfirmationEmail,
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

const { POST } = await import('./route');

function createRequest(body: unknown): Request {
  return new Request('http://localhost/api/internal/requests/send-email', {
    method: 'POST',
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

function createMaybeSingleSelectQuery(result: unknown) {
  return {
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    maybeSingle: vi.fn().mockResolvedValue(result),
  };
}

function createUpdateQuery(result: unknown, updateSpy = vi.fn()) {
  return {
    update: updateSpy.mockReturnValue({
      eq: vi.fn().mockResolvedValue(result),
    }),
  };
}

describe('POST /api/internal/requests/send-email', () => {
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
    mocks.getTranslations.mockResolvedValue(Object.assign((key: string) => key, { has: () => false }));
    mocks.buildCustomerActionEmail.mockReturnValue({
      subject: 'Instrucciones de pago',
      react: 'email-template',
    });
    mocks.sendManualCustomerEmail.mockResolvedValue({
      success: true,
      id: 'email-1',
    });
    mocks.sendShuttleProviderConfirmationEmail.mockResolvedValue({
      success: true,
      id: 'provider-email-1',
    });
    mocks.recordInternalNotification.mockResolvedValue({ error: null });
  });

  it('rejects unauthenticated manual email requests', async () => {
    mocks.getAuthorizedAdminContext.mockResolvedValue(null);

    const response = await POST(createRequest({
      kind: 'shuttle',
      id: 'shuttle-1',
      template: 'payment_instructions',
    }));
    const json = await response.json();

    expect(response.status).toBe(401);
    expect(json.error).toBe('Unauthorized');
    expect(mocks.from).not.toHaveBeenCalled();
  });

  it('rejects templates outside the whitelist', async () => {
    const response = await POST(createRequest({
      kind: 'shuttle',
      id: 'shuttle-1',
      template: 'surprise_email',
    }));
    const json = await response.json();

    expect(response.status).toBe(400);
    expect(json.error).toBe('template inválido.');
    expect(mocks.from).not.toHaveBeenCalled();
  });

  it('sends a shuttle customer email and records delivery status', async () => {
    const updateSpy = vi.fn();
    const shuttle = {
      id: 'shuttle-1',
      customer_name: 'Shuttle Customer',
      customer_email: 'customer@nomadafantasma.com',
      route_origin: 'Panajachel',
      route_destination: 'Antigua Guatemala',
      travel_date: '2099-05-05',
      travel_time: '09:00',
      passengers: 2,
      pickup_location: 'Hotel Unit',
      type: 'shared',
      price: 150,
      customer_locale: 'es',
      admin_notes: '[[meta:locale=es]]',
    };
    let shuttleCalls = 0;

    mocks.from.mockImplementation((table: string) => {
      if (table === 'shuttle_bookings') {
        shuttleCalls += 1;
        return shuttleCalls === 1
          ? createSingleSelectQuery({ data: shuttle, error: null })
          : createUpdateQuery({ error: null }, updateSpy);
      }
      throw new Error(`Unexpected table ${table}`);
    });

    const response = await POST(createRequest({
      kind: 'shuttle',
      id: 'shuttle-1',
      template: 'payment_instructions',
    }));
    const json = await response.json();

    expect(response.status).toBe(200);
    expect(json).toMatchObject({
      success: true,
      subject: 'Instrucciones de pago',
    });
    expect(mocks.buildCustomerActionEmail).toHaveBeenCalledWith(expect.objectContaining({
      template: 'payment_instructions',
      kind: 'shuttle',
      serviceName: 'Panajachel → Antigua Guatemala',
      price: 300,
      priceText: 'Q300.00',
      priceBreakdown: ['Q150.00 por persona x 2 pasajeros'],
      priceLabelOverride: 'Total a pagar',
      travelTime: '09:00',
      pickupLocation: 'Hotel Unit',
    }));
    expect(mocks.sendManualCustomerEmail).toHaveBeenCalledWith(expect.objectContaining({
      to: 'customer@nomadafantasma.com',
      subject: 'Instrucciones de pago',
      label: 'manual_payment_instructions_shuttle',
    }));
    expect(mocks.recordInternalNotification).toHaveBeenCalledWith(expect.objectContaining({
      requestKind: 'shuttle',
      requestId: 'shuttle-1',
      recipientType: 'customer',
      deliveryStatus: 'sent',
      triggeredBy: 'Recepcion Unit',
    }));
    expect(updateSpy).toHaveBeenCalledWith(expect.objectContaining({
      admin_notes: expect.stringContaining('email:payment_instructions'),
      email_delivery_status: 'sent',
      payment_status: 'payment_requested',
      payment_amount: 300,
    }));
  });

  it('sends a shuttle provider confirmation email and records agency notification', async () => {
    const updateSpy = vi.fn();
    const shuttle = {
      id: 'shuttle-1',
      agency_id: 'agency-1',
      customer_name: 'Shuttle Customer',
      customer_email: 'customer@example.com',
      customer_whatsapp: '50255550000',
      route_origin: 'Panajachel',
      route_destination: 'Antigua Guatemala',
      travel_date: '2099-05-05',
      travel_time: '09:00',
      passengers: 2,
      pickup_location: 'Hotel Unit',
      type: 'shared',
      admin_notes: null,
    };
    let shuttleCalls = 0;

    mocks.from.mockImplementation((table: string) => {
      if (table === 'shuttle_bookings') {
        shuttleCalls += 1;
        return shuttleCalls === 1
          ? createSingleSelectQuery({ data: shuttle, error: null })
          : createUpdateQuery({ error: null }, updateSpy);
      }
      if (table === 'agencies') {
        return createMaybeSingleSelectQuery({
          data: { email: 'agency@example.com', is_active: true },
          error: null,
        });
      }
      throw new Error(`Unexpected table ${table}`);
    });

    const response = await POST(createRequest({
      kind: 'shuttle',
      id: 'shuttle-1',
      template: 'provider_confirmation',
    }));
    const json = await response.json();

    expect(response.status).toBe(200);
    expect(json).toMatchObject({
      success: true,
      subject: 'Reserva de shuttle confirmada: Panajachel -> Antigua Guatemala',
    });
    expect(mocks.sendShuttleProviderConfirmationEmail).toHaveBeenCalledWith(expect.objectContaining({
      to: 'agency@example.com',
      bookingId: 'shuttle-1',
      origin: 'Panajachel',
      destination: 'Antigua Guatemala',
      customerWhatsapp: '50255550000',
    }));
    expect(mocks.recordInternalNotification).toHaveBeenCalledWith(expect.objectContaining({
      requestKind: 'shuttle',
      requestId: 'shuttle-1',
      recipientType: 'agency',
      recipientEmail: 'agency@example.com',
      template: 'booking_confirmed_provider',
      deliveryStatus: 'sent',
      triggeredBy: 'Recepcion Unit',
    }));
    expect(updateSpy).toHaveBeenCalledWith(expect.objectContaining({
      admin_notes: expect.stringContaining('email:provider_confirmation'),
    }));
  });
});
