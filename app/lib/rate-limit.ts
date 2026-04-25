/**
 * Rate Limiting Utility
 * 
 * Centralized rate limiting logic.
 *
 * Default implementation: in-memory Map for local/dev.
 * Production option: set RATE_LIMIT_STORE=supabase and run the rate_limit_buckets
 * migration to use a shared Postgres-backed limiter across serverless instances.
 */

type RateLimitEntry = {
  count: number;
  start: number;
};

// In-memory store (will be replaced with Redis in production)
const rateLimitStore = new Map<string, RateLimitEntry>();

export interface RateLimitConfig {
  max: number;
  windowMs: number;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number;
  retryAfter?: number;
}

const DEFAULT_CONFIG: RateLimitConfig = {
  max: 5,
  windowMs: 10 * 60 * 1000, // 10 minutes
};

type SupabaseRateLimitRow = {
  allowed: boolean;
  remaining: number;
  reset_at: string;
  retry_after: number | null;
};

/**
 * Check if a request should be rate limited
 * 
 * @param identifier - Unique identifier (usually IP address)
 * @param config - Rate limit configuration (optional, uses defaults)
 * @returns Rate limit result with status and metadata
 */
export function checkRateLimit(
  identifier: string,
  config: RateLimitConfig = DEFAULT_CONFIG
): RateLimitResult {
  const now = Date.now();
  const entry = rateLimitStore.get(identifier);

  // No entry or window expired - reset
  if (!entry || now - entry.start > config.windowMs) {
    rateLimitStore.set(identifier, { count: 1, start: now });
    return {
      allowed: true,
      remaining: config.max - 1,
      resetAt: now + config.windowMs,
    };
  }

  // Within window - check count
  if (entry.count >= config.max) {
    const retryAfter = Math.ceil((config.windowMs - (now - entry.start)) / 1000);
    return {
      allowed: false,
      remaining: 0,
      resetAt: entry.start + config.windowMs,
      retryAfter,
    };
  }

  // Increment count
  entry.count += 1;
  rateLimitStore.set(identifier, entry);

  return {
    allowed: true,
    remaining: config.max - entry.count,
    resetAt: entry.start + config.windowMs,
  };
}

function shouldUseSupabaseRateLimit(): boolean {
  return process.env.RATE_LIMIT_STORE?.trim().toLowerCase() === 'supabase';
}

/**
 * Shared rate limit check for API routes.
 *
 * Uses Supabase when RATE_LIMIT_STORE=supabase, and falls back to the local
 * in-memory limiter if the RPC is unavailable so requests do not fail closed
 * during deploys before migrations are applied.
 */
export async function checkRateLimitShared(
  identifier: string,
  config: RateLimitConfig = DEFAULT_CONFIG
): Promise<RateLimitResult> {
  if (!shouldUseSupabaseRateLimit()) {
    return checkRateLimit(identifier, config);
  }

  try {
    const { supabaseAdmin } = await import('./supabase/server');
    const { data, error } = await supabaseAdmin.rpc('check_rate_limit' as never, {
      p_identifier: identifier,
      p_max: config.max,
      p_window_ms: config.windowMs,
    } as never);

    if (error) {
      console.warn('Supabase rate limit unavailable, falling back to local store:', error.message);
      return checkRateLimit(identifier, config);
    }

    const row = Array.isArray(data)
      ? (data[0] as SupabaseRateLimitRow | undefined)
      : (data as SupabaseRateLimitRow | null);

    if (!row) {
      return checkRateLimit(identifier, config);
    }

    return {
      allowed: row.allowed,
      remaining: row.remaining,
      resetAt: new Date(row.reset_at).getTime(),
      retryAfter: row.retry_after ?? undefined,
    };
  } catch (error) {
    console.warn('Supabase rate limit failed, falling back to local store:', error);
    return checkRateLimit(identifier, config);
  }
}

/**
 * Extract IP address from request headers
 * Handles x-forwarded-for (proxies) and falls back to 'unknown'
 */
export function getClientIP(request: Request): string {
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    // x-forwarded-for can contain multiple IPs, take the first one
    return forwardedFor.split(',')[0].trim();
  }
  
  const realIP = request.headers.get('x-real-ip');
  if (realIP) {
    return realIP.trim();
  }

  return 'unknown';
}

/**
 * Clean up old entries from the rate limit store
 * Call this periodically to prevent memory leaks
 * 
 * Note: In production with Redis, this won't be needed
 */
export function cleanupRateLimitStore(windowMs: number = DEFAULT_CONFIG.windowMs): void {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (now - entry.start > windowMs * 2) {
      // Remove entries older than 2x the window
      rateLimitStore.delete(key);
    }
  }
}
