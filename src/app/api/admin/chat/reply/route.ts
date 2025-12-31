/**
 * Admin Chat Reply API
 * POST /api/admin/chat/reply
 */

import { NextResponse } from 'next/server';

import { getAdminSession } from '@/lib/auth/session';
import { createAdminClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  try {
    // Check admin session
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Viewers cannot reply
    if (session.role === 'viewer') {
      return NextResponse.json(
        { success: false, error: 'Insufficient permissions' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { session_id, message } = body;

    if (!session_id || !message?.trim()) {
      return NextResponse.json(
        { success: false, error: 'Session ID and message are required' },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();

    // Verify session exists and is active
    const { data: chatSession } = await supabase
      .from('chat_sessions')
      .select('status')
      .single();

    if (!chatSession) {
      return NextResponse.json(
        { success: false, error: 'Chat session not found' },
        { status: 404 }
      );
    }

    const typedSession = chatSession as { status: string };
    if (typedSession.status !== 'active') {
      return NextResponse.json(
        { success: false, error: 'Cannot reply to closed session' },
        { status: 400 }
      );
    }

    // Insert admin reply
    const { error: messageError } = await supabase
      .from('chat_messages')
      .insert({
        session_id,
        sender: 'admin',
        message: message.trim(),
        is_read: true,
      } as never);

    if (messageError) {
      console.error('Message insert error:', messageError);
      return NextResponse.json(
        { success: false, error: 'Failed to send reply' },
        { status: 500 }
      );
    }

    // Update session last_message_at
    await supabase
      .from('chat_sessions')
      .update({ last_message_at: new Date().toISOString() } as never)
      .eq('id', session_id);

    return NextResponse.json({ success: true, message: 'Reply sent' });
  } catch (error) {
    console.error('Chat reply error:', error);
    return NextResponse.json(
      { success: false, error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
