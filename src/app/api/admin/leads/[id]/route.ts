/**
 * Admin Single Lead API Route
 * GET /api/admin/leads/:id - Get lead details
 *
 * Security:
 * - Requires admin authentication
 */

import { NextRequest, NextResponse } from 'next/server';

import { unauthorizedResponse, verifyAdminSession } from '@/lib/admin-auth';
import { getContactLeadById } from '@/services/leads';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    // Verify admin session
    const session = await verifyAdminSession();
    if (!session) {
      return unauthorizedResponse();
    }

    const { id } = await params;

    // Fetch lead
    const lead = await getContactLeadById(id);

    if (!lead) {
      return NextResponse.json(
        { success: false, error: 'Lead not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: lead,
    });
  } catch (error) {
    console.error('Admin lead detail API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
