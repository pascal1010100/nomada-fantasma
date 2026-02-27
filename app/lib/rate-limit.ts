/**
 * Rate Limiting Utility
 * 
 * Centralized rate limiting logic that can be easily replaced with Redis/Upstash
 * in the future without changing API route code.
 * 
 * Current implementation: In-memory Map (works for single instance)
 * Future: Replace with Redis for distributed rate limiting
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
