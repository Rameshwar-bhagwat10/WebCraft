/**
 * Authentication Rate Limiting
 * Brute-force protection for login attempts
 */

import { createAdminClient } from '@/lib/supabase/server';

import { AUTH_RATE_LIMITS } from './config';

export interface RateLimitResult {
  allowed: boolean;
  locked: boolean;
  lockedUntil?: string | undefined;
  attempts: number;
  remaining?: number | undefined;
}

/**
 * Check if login attempt is allowed
 * HARDENED: Fails CLOSED - denies on error to prevent brute-force during DB issues
 */
export async function checkLoginRateLimit(
  identifier: string
): Promise<RateLimitResult> {
  try {
    const supabase = createAdminClient();
    const config = AUTH_RATE_LIMITS.login;

    const { data, error } = await supabase.rpc('check_auth_rate_limit' as never, {
      p_identifier: identifier,
      p_attempt_type: 'login',
      p_max_attempts: config.maxAttempts,
      p_window_minutes: config.windowMinutes,
      p_lockout_minutes: config.lockoutMinutes,
    } as never);

    if (error) {
      // FAIL CLOSED: Deny login attempts when rate limit check fails
      console.error('[AuthRateLimit] Database error - DENYING request for safety', {
        error: error.message,
        identifier: identifier.slice(0, 3) + '***',
      });
      return {
        allowed: false,
        locked: true,
        attempts: 999,
        lockedUntil: new Date(Date.now() + 60000).toISOString(),
      };
    }

    const result = data as {
      allowed: boolean;
      locked: boolean;
      locked_until?: string;
      attempts: number;
      remaining?: number;
    };

    return {
      allowed: result.allowed,
      locked: result.locked,
      lockedUntil: result.locked_until,
      attempts: result.attempts,
      remaining: result.remaining,
    };
  } catch (error) {
    // FAIL CLOSED: Deny on any exception
    console.error('[AuthRateLimit] Exception - DENYING request for safety', {
      error: error instanceof Error ? error.message : 'Unknown',
    });
    return {
      allowed: false,
      locked: true,
      attempts: 999,
      lockedUntil: new Date(Date.now() + 60000).toISOString(),
    };
  }
}

/**
 * Reset rate limit after successful login
 */
export async function resetLoginRateLimit(identifier: string): Promise<void> {
  try {
    const supabase = createAdminClient();

    await supabase.rpc('reset_auth_rate_limit' as never, {
      p_identifier: identifier,
      p_attempt_type: 'login',
    } as never);
  } catch (error) {
    console.error('Reset rate limit error:', error);
  }
}

/**
 * Check password reset rate limit
 * HARDENED: Fails CLOSED - denies on error to prevent abuse during DB issues
 */
export async function checkPasswordResetRateLimit(
  identifier: string
): Promise<RateLimitResult> {
  try {
    const supabase = createAdminClient();
    const config = AUTH_RATE_LIMITS.passwordReset;

    const { data, error } = await supabase.rpc('check_auth_rate_limit' as never, {
      p_identifier: identifier,
      p_attempt_type: 'password_reset',
      p_max_attempts: config.maxAttempts,
      p_window_minutes: config.windowMinutes,
      p_lockout_minutes: config.lockoutMinutes,
    } as never);

    if (error) {
      // FAIL CLOSED: Deny password reset attempts when rate limit check fails
      console.error('[AuthRateLimit] Password reset check failed - DENYING for safety', {
        error: error.message,
        identifier: identifier.slice(0, 3) + '***',
      });
      return {
        allowed: false,
        locked: true,
        attempts: 999,
        lockedUntil: new Date(Date.now() + 60000).toISOString(),
      };
    }

    const result = data as {
      allowed: boolean;
      locked: boolean;
      locked_until?: string;
      attempts: number;
      remaining?: number;
    };

    return {
      allowed: result.allowed,
      locked: result.locked,
      lockedUntil: result.locked_until,
      attempts: result.attempts,
      remaining: result.remaining,
    };
  } catch (error) {
    // FAIL CLOSED: Deny on any exception
    console.error('[AuthRateLimit] Password reset exception - DENYING for safety', {
      error: error instanceof Error ? error.message : 'Unknown',
    });
    return {
      allowed: false,
      locked: true,
      attempts: 999,
      lockedUntil: new Date(Date.now() + 60000).toISOString(),
    };
  }
}
