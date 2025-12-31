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
      console.error('Rate limit check error:', error);
      // Fail open - allow attempt if check fails
      return { allowed: true, locked: false, attempts: 0 };
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
    console.error('Rate limit error:', error);
    return { allowed: true, locked: false, attempts: 0 };
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
      return { allowed: true, locked: false, attempts: 0 };
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
  } catch {
    return { allowed: true, locked: false, attempts: 0 };
  }
}
