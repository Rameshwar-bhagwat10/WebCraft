/**
 * Admin Lead Status API Route
 * PATCH /api/admin/leads/:id/status - Update lead status
 *
 * Security:
 * - Requires admin authentication
 * - Validates status transitions server-side
 */

import { NextRequest, NextResponse } from 'next/server';

import { unauthorizedResponse, verifyAdminSession } from '@/lib/admin-auth';
import { updateContactStatus } from '@/services/leads';
import type { ContactStatus } from '@/types/database';

interface RouteParams {
  params: Promise<{ id: string }>;
}

const VALID_STATUSES: ContactStatus[] = ['new', 'contacted', 'qualified', 'converted', 'closed'];

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    // Verify admin session
    const session = await verifyAdminSession();
    if (!session) {
      return unauthorizedResponse();
    }

    const { id } = await params;
    const body = await request.json();
    const { status } = body;

    // Validate status value
    if (!status || !VALID_STATUSES.includes(status)) {
      return NextResponse.json(
        { success: false, error: 'Invalid status value' },
        { status: 400 }
      );
    }

    // Update status with validation
    const result = await updateContactStatus(id, status as ContactStatus);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Status updated successfully',
    });
  } catch (error) {
    console.error('Admin lead status API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
