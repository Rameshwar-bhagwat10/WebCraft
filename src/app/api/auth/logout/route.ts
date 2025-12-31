/**
 * Admin Logout API Route
 * POST /api/auth/logout
 *
 * Security:
 * - Clears Supabase session
 * - Audit logging
 */

import { NextResponse } from 'next/server';

import { logLogout } from '@/lib/auth';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export async function POST() {
  try {
    const supabase = await createServerSupabaseClient();

    // Get current user before logout for audit
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      await logLogout(user.id);
    }

    // Sign out
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error('Logout error:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to logout' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { success: false, error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
