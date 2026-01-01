/**
 * Admin Feedback API
 * GET /api/admin/feedback/[id] - Get single feedback
 * PATCH /api/admin/feedback/[id] - Update feedback status
 * DELETE /api/admin/feedback/[id] - Delete feedback
 */

import { NextRequest, NextResponse } from 'next/server';

import { getAdminSession } from '@/lib/auth/session';
import {
  deleteFeedback,
  getFeedbackByIdAdmin,
  toggleFeedbackFeatured,
  updateFeedbackStatus,
  type FeedbackStatus,
} from '@/lib/feedback/admin';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const feedback = await getFeedbackByIdAdmin(id);

    if (!feedback) {
      return NextResponse.json({ error: 'Feedback not found' }, { status: 404 });
    }

    return NextResponse.json({ feedback });
  } catch (error) {
    console.error('[API] Get feedback error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    let body: Record<string, unknown>;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
    }

    // Handle status update
    if (body.status !== undefined) {
      const status = body.status as FeedbackStatus;
      if (!['pending', 'approved', 'rejected'].includes(status)) {
        return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
      }

      const result = await updateFeedbackStatus(id, status);
      if (!result.success) {
        return NextResponse.json({ error: result.error ?? 'Failed to update' }, { status: 500 });
      }

      return NextResponse.json({ feedback: result.data });
    }

    // Handle featured toggle
    if (body.is_featured !== undefined) {
      const result = await toggleFeedbackFeatured(id, body.is_featured as boolean);
      if (!result.success) {
        return NextResponse.json({ error: result.error ?? 'Failed to update' }, { status: 500 });
      }

      return NextResponse.json({ feedback: result.data });
    }

    return NextResponse.json({ error: 'No valid update field provided' }, { status: 400 });
  } catch (error) {
    console.error('[API] Update feedback error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const result = await deleteFeedback(id);

    if (!result.success) {
      return NextResponse.json({ error: result.error ?? 'Failed to delete' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[API] Delete feedback error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
