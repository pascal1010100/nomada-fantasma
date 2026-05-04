import { spawn, execFileSync, type ChildProcessWithoutNullStreams } from 'node:child_process';
import { createClient } from '@supabase/supabase-js';

type SupabaseEnv = {
  API_URL: string;
  ANON_KEY: string;
  SERVICE_ROLE_KEY: string;
};

type ShuttleRoute = {
  id: string;
  agency_id: string | null;
  origin: string;
  destination: string;
  type: 'shared' | 'private';
  schedule: string[] | null;
  price: number | null;
};

type Tour = {
  id: string;
  title: string | null;
  start_times: string[] | null;
};

type ApiResponse = {
  success?: boolean;
  bookingId?: string;
  reservation?: {
    id?: string;
  };
};

const E2E_PORT = Number(process.env.E2E_PORT ?? 3100);
const BASE_URL = process.env.E2E_BASE_URL ?? `http://127.0.0.1:${E2E_PORT}`;
const USE_EXISTING_SERVER = process.env.E2E_USE_EXISTING_SERVER === '1';
const KEEP_RECORDS = process.env.E2E_KEEP_RECORDS === '1';
const REQUEST_TIMEOUT_MS = 20_000;
const SERVER_START_TIMEOUT_MS = 60_000;

function parseEnvOutput(output: string): Record<string, string> {
  return Object.fromEntries(
    output
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const separatorIndex = line.indexOf('=');
        const key = line.slice(0, separatorIndex);
        let value = line.slice(separatorIndex + 1).trim();
        if (
          (value.startsWith('"') && value.endsWith('"')) ||
          (value.startsWith("'") && value.endsWith("'"))
        ) {
          value = value.slice(1, -1);
        }
        return [key, value];
      })
  );
}

function getSupabaseEnv(): SupabaseEnv {
  const explicitEnv = {
    API_URL: process.env.E2E_SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL,
    ANON_KEY: process.env.E2E_SUPABASE_ANON_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    SERVICE_ROLE_KEY: process.env.E2E_SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY,
  };

  if (explicitEnv.API_URL && explicitEnv.ANON_KEY && explicitEnv.SERVICE_ROLE_KEY) {
    return explicitEnv as SupabaseEnv;
  }

  try {
    const output = execFileSync('supabase', ['status', '-o', 'env'], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    const supabaseEnv = parseEnvOutput(output);
    if (supabaseEnv.API_URL && supabaseEnv.ANON_KEY && supabaseEnv.SERVICE_ROLE_KEY) {
      return supabaseEnv as SupabaseEnv;
    }
  } catch (error) {
    throw new Error(
      `Could not read Supabase local status. Start Supabase with "supabase start" or provide E2E_SUPABASE_URL, E2E_SUPABASE_ANON_KEY, and E2E_SUPABASE_SERVICE_ROLE_KEY. ${String(error)}`
    );
  }

  throw new Error('Supabase local status did not include API_URL, ANON_KEY, and SERVICE_ROLE_KEY.');
}

function assertLocalUrl(url: string, label: string): void {
  const parsed = new URL(url);
  const localHosts = new Set(['localhost', '127.0.0.1', '::1']);
  if (!localHosts.has(parsed.hostname) && process.env.E2E_ALLOW_REMOTE !== '1') {
    throw new Error(`${label} must be local for this E2E test. Set E2E_ALLOW_REMOTE=1 to override.`);
  }
}

function startServer(supabaseEnv: SupabaseEnv): ChildProcessWithoutNullStreams | null {
  if (USE_EXISTING_SERVER) return null;

  const child = spawn(
    'pnpm',
    ['exec', 'next', 'dev', '--turbopack', '--hostname', '127.0.0.1', '--port', String(E2E_PORT)],
    {
      env: {
        ...process.env,
        NEXT_PUBLIC_SUPABASE_URL: supabaseEnv.API_URL,
        NEXT_PUBLIC_SUPABASE_ANON_KEY: supabaseEnv.ANON_KEY,
        SUPABASE_SERVICE_ROLE_KEY: supabaseEnv.SERVICE_ROLE_KEY,
        RATE_LIMIT_STORE: 'supabase',
        RESEND_API_KEY: '',
        NEXT_PUBLIC_SITE_URL: BASE_URL,
      },
    }
  );

  const logs: string[] = [];
  const collectLog = (chunk: Buffer) => {
    logs.push(chunk.toString());
    if (logs.length > 40) logs.shift();
  };
  child.stdout.on('data', collectLog);
  child.stderr.on('data', collectLog);
  child.on('exit', (code) => {
    if (code !== null && code !== 0) {
      console.error(logs.join(''));
    }
  });

  return child;
}

async function stopServer(child: ChildProcessWithoutNullStreams | null): Promise<void> {
  if (!child || child.killed) return;
  child.kill('SIGINT');
  await new Promise<void>((resolve) => {
    const timeout = setTimeout(() => {
      child.kill('SIGKILL');
      resolve();
    }, 5_000);
    child.once('exit', () => {
      clearTimeout(timeout);
      resolve();
    });
  });
}

async function waitForServer(): Promise<void> {
  const deadline = Date.now() + SERVER_START_TIMEOUT_MS;
  let lastError: unknown = null;

  while (Date.now() < deadline) {
    try {
      const response = await fetch(`${BASE_URL}/es`, { signal: AbortSignal.timeout(5_000) });
      if (response.status < 500) return;
      lastError = `${response.status} ${response.statusText}`;
    } catch (error) {
      lastError = error;
    }
    await new Promise((resolve) => setTimeout(resolve, 1_000));
  }

  throw new Error(`Next server did not become ready at ${BASE_URL}. Last error: ${String(lastError)}`);
}

async function postJson(path: string, body: unknown, ip: string): Promise<{ status: number; json: ApiResponse | null }> {
  const response = await fetch(`${BASE_URL}${path}`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'accept-language': 'es',
      'x-forwarded-for': ip,
    },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });
  const json = await response.json().catch(() => null);
  return { status: response.status, json };
}

function futureDate(): string {
  return new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
}

async function main() {
  const supabaseEnv = getSupabaseEnv();
  assertLocalUrl(BASE_URL, 'E2E_BASE_URL');
  assertLocalUrl(supabaseEnv.API_URL, 'E2E_SUPABASE_URL');

  const supabase = createClient(supabaseEnv.API_URL, supabaseEnv.SERVICE_ROLE_KEY);
  const server = startServer(supabaseEnv);
  const createdIds: { shuttle?: string; tour?: string } = {};
  const testIp = `203.0.113.${Math.floor(Math.random() * 200) + 1}`;

  try {
    await waitForServer();

    const { data: routes, error: routesError } = await supabase
      .from('shuttle_routes')
      .select('id, agency_id, origin, destination, type, schedule, price')
      .eq('type', 'shared')
      .limit(20);

    if (routesError) throw routesError;
    const route = (routes as ShuttleRoute[] | null)?.find((item) => item.schedule?.length);
    if (!route) throw new Error('No shared shuttle route with schedule was found.');

    const { data: tours, error: toursError } = await supabase
      .from('tours')
      .select('id, title, start_times')
      .eq('is_active', true)
      .limit(20);

    if (toursError) throw toursError;
    const tour = (tours as Tour[] | null)?.find((item) => item.start_times?.length) ?? tours?.[0];
    if (!tour) throw new Error('No active tour was found.');

    const travelDate = futureDate();
    const runId = Date.now();

    const shuttleResponse = await postJson(
      '/api/shuttles/reserve',
      {
        customerName: `E2E Shuttle ${runId}`,
        customerEmail: `e2e-shuttle-${runId}@example.com`,
        customerWhatsapp: '50255550002',
        routeOrigin: route.origin,
        routeDestination: route.destination,
        date: travelDate,
        time: route.schedule?.[0] ?? '09:00',
        passengers: 2,
        pickupLocation: 'Hotel E2E Panajachel',
        type: route.type,
      },
      testIp
    );

    if (shuttleResponse.status !== 200 || !shuttleResponse.json?.success || !shuttleResponse.json?.bookingId) {
      throw new Error(`Shuttle request failed: ${shuttleResponse.status} ${JSON.stringify(shuttleResponse.json)}`);
    }
    createdIds.shuttle = shuttleResponse.json.bookingId;

    const tourResponse = await postJson(
      '/api/reservations',
      {
        name: `E2E Tour ${runId}`,
        email: `e2e-tour-${runId}@example.com`,
        phone: '50255550001',
        date: travelDate,
        time: tour.start_times?.[0] ?? '10:00',
        guests: 2,
        type: 'tour',
        tourId: tour.id,
        totalPrice: 700,
        notes: 'Automated local E2E test',
      },
      testIp
    );

    if (tourResponse.status !== 201 || !tourResponse.json?.success || !tourResponse.json?.reservation?.id) {
      throw new Error(`Tour request failed: ${tourResponse.status} ${JSON.stringify(tourResponse.json)}`);
    }
    createdIds.tour = tourResponse.json.reservation.id;

    const [shuttleResult, tourResult, notificationResult, jobResult, bucketResult] = await Promise.all([
      supabase
        .from('shuttle_bookings')
        .select('id, route_id, agency_id, price, status, email_delivery_status, email_attempts, admin_notes')
        .eq('id', createdIds.shuttle)
        .single(),
      supabase
        .from('reservations')
        .select('id, tour_id, total_price, status, email_delivery_status, email_attempts, admin_notes')
        .eq('id', createdIds.tour)
        .single(),
      supabase
        .from('internal_request_notifications')
        .select('request_kind, request_id, recipient_type, delivery_status')
        .in('request_id', [createdIds.shuttle, createdIds.tour]),
      supabase
        .from('notification_jobs')
        .select('request_kind, request_id, recipient_type, status')
        .in('request_id', [createdIds.shuttle, createdIds.tour]),
      supabase
        .from('rate_limit_buckets')
        .select('identifier, count')
        .eq('identifier', testIp)
        .single(),
    ]);

    if (shuttleResult.error) throw shuttleResult.error;
    if (tourResult.error) throw tourResult.error;
    if (notificationResult.error) throw notificationResult.error;
    if (jobResult.error) throw jobResult.error;
    if (bucketResult.error) throw bucketResult.error;

    if (shuttleResult.data.route_id !== route.id) throw new Error('Shuttle route_id was not persisted.');
    if (shuttleResult.data.agency_id !== route.agency_id) throw new Error('Shuttle agency_id was not persisted.');
    if (Number(shuttleResult.data.price) !== Number(route.price)) throw new Error('Shuttle price was not persisted.');
    if (shuttleResult.data.email_delivery_status !== 'sent') throw new Error('Shuttle email status was not sent.');
    if (tourResult.data.tour_id !== tour.id) throw new Error('Tour id was not persisted.');
    if (tourResult.data.email_delivery_status !== 'sent') throw new Error('Tour email status was not sent.');
    if ((notificationResult.data?.length ?? 0) !== 6) throw new Error('Expected 6 internal notifications.');
    if ((jobResult.data?.length ?? 0) !== 6) throw new Error('Expected 6 notification jobs.');
    if (jobResult.data?.some((job) => job.status !== 'sent')) throw new Error('Expected notification jobs to be marked sent.');
    if (bucketResult.data.count !== 2) throw new Error('Expected the Supabase rate limit bucket to count 2 requests.');

    console.log('Booking E2E passed');
    console.log(`- Shuttle booking: ${createdIds.shuttle}`);
    console.log(`- Tour reservation: ${createdIds.tour}`);
    console.log('- Internal notifications: 6');
    console.log('- Notification jobs: 6');
    console.log(`- Rate limit bucket: ${testIp} count=2`);
  } finally {
    if (!KEEP_RECORDS) {
      const ids = [createdIds.shuttle, createdIds.tour].filter(Boolean) as string[];
      if (ids.length > 0) {
        await supabase.from('internal_request_notifications').delete().in('request_id', ids);
        await supabase.from('notification_jobs').delete().in('request_id', ids);
      }
      if (createdIds.shuttle) {
        await supabase.from('shuttle_bookings').delete().eq('id', createdIds.shuttle);
      }
      if (createdIds.tour) {
        await supabase.from('reservations').delete().eq('id', createdIds.tour);
      }
      await supabase.from('rate_limit_buckets').delete().eq('identifier', testIp);
    }
    await stopServer(server);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
