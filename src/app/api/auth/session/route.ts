/**
 * Admin Session API Route
 * GET /api/auth/session - Get current session info
 *
 * Security:
 * - Returns minimal user info
 * - No sensitive data exposed
 */

import { NextResponse } from 'next/server';

import { getAdminSession } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getAdminSession();

    if (!session) {
      return NextResponse.json(
        { success: false, authenticated: false },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      authenticated: true,
      user: {
        id: session.userId,
        email: session.email,
        role: session.role,
      },
    });
  } catch (error) {
    console.error('Session check error:', error);
    return NextResponse.json(
      { success: false, error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
