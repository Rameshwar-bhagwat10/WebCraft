/**
 * Admin Feedback API
 * GET /api/admin/feedback - List all feedback
 */

import { NextRequest, NextResponse } from 'next/server';

import { getAdminSession } from '@/lib/auth/session';
import { getAllFeedbackAdmin, getFeedbackCounts, type FeedbackStatus } from '@/lib/feedback/admin';

export async function GET(request: NextRequest) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') as FeedbackStatus | null;

    const [feedback, counts] = await Promise.all([
      getAllFeedbackAdmin(status ?? undefined),
      getFeedbackCounts(),
    ]);

    return NextResponse.json({ feedback, counts });
  } catch (error) {
    console.error('[API] Get feedback error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
