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

const { POST } = await import('./route');

function createRequest(secret?: string): Request {
  return new Request('http://localhost/api/internal/jobs/process-notifications?limit=3', {
    method: 'POST',
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
});
