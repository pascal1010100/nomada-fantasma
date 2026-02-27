import { describe, it, expect, beforeEach } from 'vitest';
import { checkRateLimit, getClientIP, cleanupRateLimitStore } from './rate-limit';

describe('Rate Limit', () => {
  beforeEach(() => {
    // Reset store before each test
    cleanupRateLimitStore(0);
  });

  describe('checkRateLimit', () => {
    it('should allow first request', () => {
      const result = checkRateLimit('192.168.1.1');
      expect(result.allowed).toBe(true);
      expect(result.remaining).toBe(4); // 5 max - 1 used
    });

    it('should allow multiple requests within limit', () => {
      for (let i = 0; i < 5; i++) {
        const result = checkRateLimit('192.168.1.1');
        expect(result.allowed).toBe(true);
      }
    });

    it('should block when exceeding limit', () => {
      for (let i = 0; i < 5; i++) {
        checkRateLimit('192.168.1.1');
      }
      const result = checkRateLimit('192.168.1.1');
      expect(result.allowed).toBe(false);
      expect(result.remaining).toBe(0);
    });

    it('should have retryAfter on blocked request', () => {
      for (let i = 0; i < 5; i++) {
        checkRateLimit('192.168.1.2');
      }
      const result = checkRateLimit('192.168.1.2');
      expect(result.retryAfter).toBeGreaterThan(0);
      expect(result.retryAfter).toBeLessThanOrEqual(600); // default 10 min
    });

    it('should isolate by identifier', () => {
      for (let i = 0; i < 5; i++) {
        checkRateLimit('192.168.1.3');
      }
      const result = checkRateLimit('192.168.1.4');
      expect(result.allowed).toBe(true);
    });

    it('should respect custom config', () => {
      const result = checkRateLimit('192.168.1.5', { max: 2, windowMs: 1000 });
      expect(result.remaining).toBe(1);

      checkRateLimit('192.168.1.5', { max: 2, windowMs: 1000 });
      const blocked = checkRateLimit('192.168.1.5', { max: 2, windowMs: 1000 });
      expect(blocked.allowed).toBe(false);
    });

    it('should reset after window expires', async () => {
      const config = { max: 1, windowMs: 100 };
      checkRateLimit('192.168.1.6', config);
      let blocked = checkRateLimit('192.168.1.6', config);
      expect(blocked.allowed).toBe(false);

      await new Promise(resolve => setTimeout(resolve, 150));

      const unblocked = checkRateLimit('192.168.1.6', config);
      expect(unblocked.allowed).toBe(true);
    });
  });

  describe('getClientIP', () => {
    it('should extract IP from x-forwarded-for header', () => {
      const request = new Request('http://example.com', {
        headers: {
          'x-forwarded-for': '203.0.113.1, 198.51.100.2',
        },
      });
      const ip = getClientIP(request);
      expect(ip).toBe('203.0.113.1');
    });

    it('should trim whitespace in x-forwarded-for', () => {
      const request = new Request('http://example.com', {
        headers: {
          'x-forwarded-for': '  192.168.1.1  , 10.0.0.1',
        },
      });
      const ip = getClientIP(request);
      expect(ip).toBe('192.168.1.1');
    });

    it('should fallback to x-real-ip', () => {
      const request = new Request('http://example.com', {
        headers: {
          'x-real-ip': '172.16.0.1',
        },
      });
      const ip = getClientIP(request);
      expect(ip).toBe('172.16.0.1');
    });

    it('should return unknown when no IP headers', () => {
      const request = new Request('http://example.com');
      const ip = getClientIP(request);
      expect(ip).toBe('unknown');
    });

    it('should prefer x-forwarded-for over x-real-ip', () => {
      const request = new Request('http://example.com', {
        headers: {
          'x-forwarded-for': '203.0.113.1',
          'x-real-ip': '172.16.0.1',
        },
      });
      const ip = getClientIP(request);
      expect(ip).toBe('203.0.113.1');
    });
  });

  describe('cleanupRateLimitStore', () => {
    it('should remove old entries', () => {
      // Add an entry
      checkRateLimit('192.168.1.7');
      
      // Manually age it (in real scenario this would be time-based)
      // This test verifies the cleanup function exists and doesn't error
      expect(() => cleanupRateLimitStore(0)).not.toThrow();
    });
  });
});
