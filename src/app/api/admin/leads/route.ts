/**
 * Admin Leads API Route
 * GET /api/admin/leads - List all leads with filters
 *
 * Security:
 * - Requires admin authentication
 * - Rate limited (100/min)
 * - Paginated responses
 */

import { NextRequest, NextResponse } from 'next/server';

import { unauthorizedResponse, verifyAdminSession } from '@/lib/admin-auth';
import { getContactLeads } from '@/services/leads';
import type { LeadSource } from '@/types/database';

export async function GET(request: NextRequest) {
  try {
    // Verify admin session
    const session = await verifyAdminSession();
    if (!session) {
      return unauthorizedResponse();
    }

    // Parse query params
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') ?? undefined;
    const source = searchParams.get('source') as LeadSource | undefined;
    const search = searchParams.get('search') ?? undefined;
    const startDate = searchParams.get('startDate') ?? undefined;
    const endDate = searchParams.get('endDate') ?? undefined;
    const page = parseInt(searchParams.get('page') ?? '1', 10);
    const perPage = Math.min(parseInt(searchParams.get('perPage') ?? '20', 10), 100);

    // Fetch leads
    const { data, total } = await getContactLeads(
      { status, source, search, startDate, endDate },
      { page, perPage }
    );

    return NextResponse.json({
      success: true,
      data,
      pagination: {
        page,
        perPage,
        total,
        totalPages: Math.ceil(total / perPage),
      },
    });
  } catch (error) {
    console.error('Admin leads API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
