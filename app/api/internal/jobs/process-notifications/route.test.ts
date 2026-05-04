import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  getAuthorizedAdminContext: vi.fn(),
  processDueNotificationJobs: vi.fn(),
}));

vi.mock('@/app/lib/admin-auth', () => ({
  getAuthorizedAdminContext: mocks.getAuthorizedAdminContext,
}));

vi.mock('@/app/lib/notification-job-processor', () => ({
  processDueNotificationJobs: mocks.processDueNotificationJobs,
}));

vi.mock('@/app/lib/logger', () => ({
  default: {
    error: vi.fn(),
    warn: vi.fn(),
    info: vi.fn(),
  },
}));

const { GET, POST } = await import('./route');

function createRequest(secret?: string, method = 'POST'): Request {
  return new Request('http://localhost/api/internal/jobs/process-notifications?limit=3', {
    method,
    headers: secret ? { authorization: `Bearer ${secret}` } : undefined,
  });
}

describe('POST /api/internal/jobs/process-notifications', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    delete process.env.INTERNAL_JOBS_SECRET;
    delete process.env.CRON_SECRET;
    mocks.processDueNotificationJobs.mockResolvedValue({
      processed: 1,
      sent: 1,
      failed: 0,
      skipped: 0,
    });
  });

  it('processes jobs with a configured internal secret', async () => {
    process.env.INTERNAL_JOBS_SECRET = 'test-secret';

    const response = await POST(createRequest('test-secret'));
    const json = await response.json();

    expect(response.status).toBe(200);
    expect(json).toEqual({
      success: true,
      summary: {
        processed: 1,
        sent: 1,
        failed: 0,
        skipped: 0,
      },
    });
    expect(mocks.processDueNotificationJobs).toHaveBeenCalledWith(3);
    expect(mocks.getAuthorizedAdminContext).not.toHaveBeenCalled();
  });

  it('rejects unauthenticated requests without a valid secret or admin session', async () => {
    process.env.INTERNAL_JOBS_SECRET = 'test-secret';
    mocks.getAuthorizedAdminContext.mockResolvedValue(null);

    const response = await POST(createRequest('wrong-secret'));
    const json = await response.json();

    expect(response.status).toBe(401);
    expect(json.error).toBe('Unauthorized');
    expect(mocks.processDueNotificationJobs).not.toHaveBeenCalled();
  });

  it('returns a development error detail when processing fails', async () => {
    process.env.INTERNAL_JOBS_SECRET = 'test-secret';
    mocks.processDueNotificationJobs.mockRejectedValue(new Error('relation "notification_jobs" does not exist'));

    const response = await POST(createRequest('test-secret'));
    const json = await response.json();

    expect(response.status).toBe(500);
    expect(json).toEqual({
      error: 'No se pudieron procesar las notificaciones.',
      detail: 'relation "notification_jobs" does not exist',
    });
  });

  it('allows cron GET requests with CRON_SECRET', async () => {
    process.env.CRON_SECRET = 'cron-secret';

    const response = await GET(createRequest('cron-secret', 'GET'));
    const json = await response.json();

    expect(response.status).toBe(200);
    expect(json.success).toBe(true);
    expect(mocks.processDueNotificationJobs).toHaveBeenCalledWith(3);
  });

  it('accepts CRON_SECRET even when INTERNAL_JOBS_SECRET is also configured', async () => {
    process.env.INTERNAL_JOBS_SECRET = 'internal-secret';
    process.env.CRON_SECRET = 'cron-secret';

    const response = await GET(createRequest('cron-secret', 'GET'));

    expect(response.status).toBe(200);
    expect(mocks.processDueNotificationJobs).toHaveBeenCalledWith(3);
  });
});
