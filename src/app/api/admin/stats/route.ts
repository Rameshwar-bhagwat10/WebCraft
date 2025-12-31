/**
 * Admin Statistics API Route
 * GET /api/admin/stats - Get lead statistics
 *
 * Security:
 * - Requires admin authentication
 */

import { NextResponse } from 'next/server';

import { unauthorizedResponse, verifyAdminSession } from '@/lib/admin-auth';
import { getLeadStatistics } from '@/services/leads';

export async function GET() {
  try {
    // Verify admin session
    const session = await verifyAdminSession();
    if (!session) {
      return unauthorizedResponse();
    }

    // Fetch statistics
    const stats = await getLeadStatistics();

    return NextResponse.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error('Admin stats API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
