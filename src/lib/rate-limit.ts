/**
 * Rate Limiting Utility
 * IP-based rate limiting for public endpoints
 *
 * HARDENED:
 * - Fails CLOSED (denies on error)
 * - Trusted IP extraction (last proxy hop only)
 * - Strict IP validation
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
 * IPv4 regex pattern
 */
const IPV4_REGEX = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;

/**
 * IPv6 regex pattern (simplified, covers most cases)
 */
const IPV6_REGEX = /^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$|^::(?:[0-9a-fA-F]{1,4}:){0,6}[0-9a-fA-F]{1,4}$|^(?:[0-9a-fA-F]{1,4}:){1,7}:$|^(?:[0-9a-fA-F]{1,4}:){0,6}::(?:[0-9a-fA-F]{1,4}:){0,5}[0-9a-fA-F]{1,4}$/;

/**
 * Validate IP address format
 */
function isValidIP(ip: string): boolean {
  if (!ip || ip.length > 45) return false;
  return IPV4_REGEX.test(ip) || IPV6_REGEX.test(ip);
}

/**
 * Extract and sanitize IP from string
 */
function sanitizeIP(ip: string | null | undefined): string | null {
  if (!ip) return null;
  const trimmed = ip.trim();
  return isValidIP(trimmed) ? trimmed : null;
}

/**
 * Get client IP from request headers
 * HARDENED: Trust only last proxy hop, validate format
 */
export async function getClientIP(): Promise<string> {
  const headersList = await headers();

  // Priority 1: Vercel-specific header (most trusted on Vercel)
  const vercelIP = sanitizeIP(headersList.get('x-vercel-forwarded-for')?.split(',').pop());
  if (vercelIP) return vercelIP;

  // Priority 2: X-Real-IP (set by reverse proxy)
  const realIP = sanitizeIP(headersList.get('x-real-ip'));
  if (realIP) return realIP;

  // Priority 3: X-Forwarded-For - LAST entry only (closest proxy)
  const forwardedFor = headersList.get('x-forwarded-for');
  if (forwardedFor) {
    const ips = forwardedFor.split(',');
    const lastIP = sanitizeIP(ips[ips.length - 1]);
    if (lastIP) return lastIP;
  }

  // Fallback: Use hash of user-agent + timestamp for uniqueness
  // This prevents complete bypass but limits effectiveness
  const userAgent = headersList.get('user-agent') ?? '';
  const fallbackId = `unknown_${hashString(userAgent).slice(0, 8)}`;
  return fallbackId;
}

/**
 * Simple string hash for fallback identification
 */
function hashString(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(36);
}

/**
 * Rate limit check result
 */
export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetIn: number;
  error?: string;
}

/**
 * Check if request is rate limited
 * HARDENED: Fails CLOSED - denies on error
 */
export async function checkRateLimit(
  endpoint: RateLimitEndpoint,
  identifier?: string
): Promise<RateLimitResult> {
  const ip = identifier ?? (await getClientIP());
  const config = RATE_LIMITS[endpoint];

  try {
    const supabase = createAdminClient();

    const { data, error } = await supabase.rpc('check_rate_limit' as never, {
      p_identifier: ip,
      p_endpoint: endpoint,
      p_max_requests: config.maxRequests,
      p_window_minutes: config.windowMinutes,
    } as never);

    if (error) {
      // FAIL CLOSED: Deny request on database error
      console.error('[RateLimit] Database error - DENYING request', {
        endpoint,
        error: error.message,
        requestId: await getRequestId(),
      });
      return {
        allowed: false,
        remaining: 0,
        resetIn: 60, // Suggest retry in 1 minute
        error: 'rate_limit_unavailable',
      };
    }

    const allowed = data === true;

    return {
      allowed,
      remaining: allowed ? Math.max(0, config.maxRequests - 1) : 0,
      resetIn: allowed ? 0 : config.windowMinutes * 60,
    };
  } catch (error) {
    // FAIL CLOSED: Deny on any exception
    console.error('[RateLimit] Exception - DENYING request', {
      endpoint,
      error: error instanceof Error ? error.message : 'Unknown',
      requestId: await getRequestId(),
    });
    return {
      allowed: false,
      remaining: 0,
      resetIn: 60,
      error: 'rate_limit_error',
    };
  }
}

/**
 * Get request ID from headers for tracing
 */
async function getRequestId(): Promise<string> {
  try {
    const headersList = await headers();
    return headersList.get('x-request-id') ?? 'unknown';
  } catch {
    return 'unknown';
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
