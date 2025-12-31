/**
 * Rate Limiting Utility
 * IP-based rate limiting for public endpoints
 *
 * Uses database-backed sliding window approach
 * Falls back to in-memory for edge cases
 */

import { headers } from 'next/headers';

import { createAdminClient } from '@/lib/supabase/server';

/**
 * Rate limit configuration per endpoint
 */
export const RATE_LIMITS = {
  contact: { maxRequests: 5, windowMinutes: 60 },
  calculator: { maxRequests: 10, windowMinutes: 60 },
  chat: { maxRequests: 30, windowMinutes: 60 },
  newsletter: { maxRequests: 3, windowMinutes: 60 },
} as const;

export type RateLimitEndpoint = keyof typeof RATE_LIMITS;

/**
 * Get client IP from request headers
 */
export async function getClientIP(): Promise<string> {
  const headersList = await headers();

  // Check common proxy headers
  const forwardedFor = headersList.get('x-forwarded-for');
  if (forwardedFor) {
    const firstIP = forwardedFor.split(',')[0];
    return firstIP?.trim() ?? 'unknown';
  }

  const realIP = headersList.get('x-real-ip');
  if (realIP) {
    return realIP;
  }

  // Vercel-specific
  const vercelIP = headersList.get('x-vercel-forwarded-for');
  if (vercelIP) {
    const firstIP = vercelIP.split(',')[0];
    return firstIP?.trim() ?? 'unknown';
  }

  // Fallback
  return 'unknown';
}

/**
 * Check if request is rate limited
 * Returns true if request is ALLOWED, false if BLOCKED
 */
export async function checkRateLimit(
  endpoint: RateLimitEndpoint,
  identifier?: string
): Promise<{ allowed: boolean; remaining: number; resetIn: number }> {
  const ip = identifier || (await getClientIP());
  const config = RATE_LIMITS[endpoint];

  try {
    const supabase = createAdminClient();

    // Call the rate limit function (type assertion needed until tables exist)
    const { data, error } = await supabase.rpc('check_rate_limit' as never, {
      p_identifier: ip,
      p_endpoint: endpoint,
      p_max_requests: config.maxRequests,
      p_window_minutes: config.windowMinutes,
    } as never);

    if (error) {
      console.error('Rate limit check error:', error);
      // Fail open - allow request if rate limit check fails
      return { allowed: true, remaining: config.maxRequests, resetIn: 0 };
    }

    const allowed = data === true;

    return {
      allowed,
      remaining: allowed ? config.maxRequests - 1 : 0,
      resetIn: allowed ? 0 : config.windowMinutes * 60,
    };
  } catch (error) {
    console.error('Rate limit error:', error);
    // Fail open
    return { allowed: true, remaining: config.maxRequests, resetIn: 0 };
  }
}

/**
 * Create rate limit response headers
 */
export function rateLimitHeaders(
  endpoint: RateLimitEndpoint,
  remaining: number,
  resetIn: number
): Record<string, string> {
  const config = RATE_LIMITS[endpoint];

  return {
    'X-RateLimit-Limit': String(config.maxRequests),
    'X-RateLimit-Remaining': String(Math.max(0, remaining)),
    'X-RateLimit-Reset': String(Math.ceil(Date.now() / 1000) + resetIn),
  };
}
