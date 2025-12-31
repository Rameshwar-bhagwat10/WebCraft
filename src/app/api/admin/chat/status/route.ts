/**
 * Admin Chat Status API
 * PATCH /api/admin/chat/status
 */

import { NextResponse } from 'next/server';

import { getAdminSession } from '@/lib/auth/session';
import { createAdminClient } from '@/lib/supabase/server';
import type { ChatSessionStatus } from '@/types/database';

const VALID_STATUSES: ChatSessionStatus[] = ['active', 'closed', 'converted'];

export async function PATCH(request: Request) {
  try {
    // Check admin session
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Viewers cannot update status
    if (session.role === 'viewer') {
      return NextResponse.json(
        { success: false, error: 'Insufficient permissions' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { session_id, status } = body;

    if (!session_id || !status) {
      return NextResponse.json(
        { success: false, error: 'Session ID and status are required' },
        { status: 400 }
      );
    }

    if (!VALID_STATUSES.includes(status)) {
      return NextResponse.json(
        { success: false, error: 'Invalid status' },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();

    // Update session status
    const { error } = await supabase
      .from('chat_sessions')
      .update({ status } as never)
      .eq('id', session_id);

    if (error) {
      console.error('Status update error:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to update status' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, message: 'Status updated' });
  } catch (error) {
    console.error('Chat status error:', error);
    return NextResponse.json(
      { success: false, error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
