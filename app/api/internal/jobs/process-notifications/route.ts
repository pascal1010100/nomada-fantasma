import { NextResponse } from 'next/server';
import { getAuthorizedAdminContext } from '@/app/lib/admin-auth';
import logger from '@/app/lib/logger';
import { processDueNotificationJobs } from '@/app/lib/notification-job-processor';

function normalizeLimit(value: string | null): number {
  const parsed = value ? Number.parseInt(value, 10) : 20;
  if (!Number.isFinite(parsed)) return 20;
  return Math.min(Math.max(parsed, 1), 50);
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === 'string') return error;

  try {
    return JSON.stringify(error);
  } catch {
    return 'Error desconocido';
  }
}

async function isAuthorized(request: Request): Promise<boolean> {
  const configuredSecrets = [process.env.INTERNAL_JOBS_SECRET, process.env.CRON_SECRET].filter(Boolean);
  const bearer = request.headers.get('authorization')?.replace(/^Bearer\s+/i, '').trim();
  const headerSecret = request.headers.get('x-internal-job-secret')?.trim();

  if (configuredSecrets.some((secret) => bearer === secret || headerSecret === secret)) {
    return true;
  }

  return Boolean(await getAuthorizedAdminContext(request));
}

export async function POST(request: Request) {
  if (!(await isAuthorized(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const summary = await processDueNotificationJobs(normalizeLimit(searchParams.get('limit')));
    return NextResponse.json({ success: true, summary });
  } catch (error) {
    logger.error('Error processing notification jobs:', error);
    return NextResponse.json(
      {
        error: 'No se pudieron procesar las notificaciones.',
        detail: process.env.NODE_ENV === 'production' ? undefined : getErrorMessage(error),
      },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  return POST(request);
}
