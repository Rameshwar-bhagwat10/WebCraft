/**
 * Admin Login API Route
 * POST /api/auth/login
 *
 * Security:
 * - Rate limited (5 attempts/15 min)
 * - Brute-force protection with lockout
 * - Audit logging
 */

import { NextResponse } from 'next/server';

import { checkLoginRateLimit, logFailedLogin, logLogin, resetLoginRateLimit } from '@/lib/auth';
import { createAdminClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Check rate limit
    const rateLimit = await checkLoginRateLimit(email.toLowerCase());

    if (!rateLimit.allowed) {
      const lockedUntil = rateLimit.lockedUntil
        ? new Date(rateLimit.lockedUntil).toLocaleTimeString()
        : 'later';

      await logFailedLogin(email, 'rate_limited');

      return NextResponse.json(
        {
          success: false,
          error: `Too many login attempts. Please try again after ${lockedUntil}.`,
          locked: true,
        },
        { status: 429 }
      );
    }

    // Attempt login with Supabase Auth
    const supabase = createAdminClient();
    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError || !data.user) {
      await logFailedLogin(email, authError?.message ?? 'invalid_credentials');

      // Generic error message to prevent user enumeration
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid email or password',
          remaining: rateLimit.remaining,
        },
        { status: 401 }
      );
    }

    // Verify user is an admin
    const { data: adminUser, error: adminError } = await supabase
      .from('admin_users')
      .select('id, role')
      .eq('id', data.user.id)
      .single();

    if (adminError || !adminUser) {
      // User exists but not an admin - sign them out
      await supabase.auth.signOut();
      await logFailedLogin(email, 'not_admin');

      return NextResponse.json(
        { success: false, error: 'You do not have admin access' },
        { status: 403 }
      );
    }

    // Success - reset rate limit and log
    await resetLoginRateLimit(email.toLowerCase());
    await logLogin(data.user.id, email);

    return NextResponse.json({
      success: true,
      message: 'Login successful',
      user: {
        id: data.user.id,
        email: data.user.email,
        role: (adminUser as { role: string }).role,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
