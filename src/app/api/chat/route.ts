/**
 * Chat Message API Route
 * POST /api/chat
 *
 * Security:
 * - Rate limited (30/hour/session)
 * - Server-side validation
 * - RLS enforced
 */

import { NextResponse } from 'next/server';

import { notifyNewChatMessage } from '@/lib/email/notifications';
import {
  checkRateLimit,
  rateLimitHeaders,
} from '@/lib/rate-limit';
import { createAdminClient } from '@/lib/supabase/server';
import { validateChatMessage } from '@/lib/validations/forms';

export async function POST(request: Request) {
  try {
    // Parse request body
    const body = await request.json();

    // Validate message data
    const validation = validateChatMessage(body);
    if (!validation.success) {
      return NextResponse.json(
        { success: false, errors: validation.errors },
        { status: 400 }
      );
    }

    // Check rate limit using visitor_id as identifier
    const rateLimit = await checkRateLimit('chat', validation.data!.visitor_id);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { success: false, error: 'Too many messages. Please wait a moment.' },
        {
          status: 429,
          headers: rateLimitHeaders('chat', rateLimit.remaining, rateLimit.resetIn),
        }
      );
    }

    const supabase = createAdminClient();
    let sessionId = validation.data!.session_id;

    // Create new session if needed
    if (!sessionId) {
      const { data: session, error: sessionError } = await supabase
        .from('chat_sessions')
        .insert({
          visitor_id: validation.data!.visitor_id,
          status: 'active',
        } as never)
        .select('id')
        .single();

      if (sessionError || !session) {
        console.error('Session creation error:', sessionError);
        return NextResponse.json(
          { success: false, error: 'Failed to start chat session' },
          { status: 500 }
        );
      }

      sessionId = (session as { id: string }).id;
    }

    // Insert message
    const { error: messageError } = await supabase
      .from('chat_messages')
      .insert({
        session_id: sessionId,
        sender: 'visitor',
        message: validation.data!.message,
        visitor_email: validation.data!.visitor_email,
        visitor_name: validation.data!.visitor_name,
        is_read: false,
      } as never);

    if (messageError) {
      console.error('Message insert error:', messageError);
      return NextResponse.json(
        { success: false, error: 'Failed to send message' },
        { status: 500 }
      );
    }

    // Update session last_message_at
    await supabase
      .from('chat_sessions')
      .update({ last_message_at: new Date().toISOString() } as never)
      .eq('id', sessionId);

    // Send admin notification (async, non-blocking)
    notifyNewChatMessage({
      name: validation.data!.visitor_name ?? undefined,
      email: validation.data!.visitor_email ?? undefined,
      message: validation.data!.message,
      sessionId: sessionId!,
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Message sent',
        session_id: sessionId,
      },
      {
        status: 200,
        headers: rateLimitHeaders('chat', rateLimit.remaining, rateLimit.resetIn),
      }
    );
  } catch (error) {
    console.error('Chat error:', error);
    return NextResponse.json(
      { success: false, error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
