/**
 * Admin Lead Notes API Route
 * PATCH /api/admin/leads/:id/notes - Update lead notes
 *
 * Security:
 * - Requires admin authentication
 */

import { NextRequest, NextResponse } from 'next/server';

import { unauthorizedResponse, verifyAdminSession } from '@/lib/admin-auth';
import { updateContactNotes } from '@/services/leads';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    // Verify admin session
    const session = await verifyAdminSession();
    if (!session) {
      return unauthorizedResponse();
    }

    const { id } = await params;
    const body = await request.json();
    const { notes } = body;

    // Validate notes
    if (typeof notes !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Notes must be a string' },
        { status: 400 }
      );
    }

    // Limit notes length
    if (notes.length > 5000) {
      return NextResponse.json(
        { success: false, error: 'Notes too long (max 5000 characters)' },
        { status: 400 }
      );
    }

    // Update notes
    const result = await updateContactNotes(id, notes);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Notes updated successfully',
    });
  } catch (error) {
    console.error('Admin lead notes API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
