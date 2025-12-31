/**
 * Chat Message API Route
 * POST /api/chat
 *
 * HARDENED:
 * - Request body size limit (100KB)
 * - Safe JSON parsing
 * - Rate limiting fails closed
 * - Session ownership validation
 * - Server-side visitor ID validation
 */

import { notifyNewChatMessage } from '@/lib/email/notifications';
import { checkRateLimit, rateLimitHeaders } from '@/lib/rate-limit';
import {
  errorResponse,
  parseJsonBody,
  rateLimitResponse,
  successResponse,
} from '@/lib/request-utils';
import { createAdminClient } from '@/lib/supabase/server';
import { validateChatMessage } from '@/lib/validations/forms';
import { validateSessionOwnership, validateVisitorId } from '@/lib/visitor';

export async function POST(request: Request) {
  // Parse body with size limit
  const parseResult = await parseJsonBody(request);
  if (!parseResult.success) {
    return parseResult.error;
  }

  const body = parseResult.data!;

  // Validate message data
  const validation = validateChatMessage(body);
  if (!validation.success) {
    return errorResponse('Validation failed', 400, validation.errors);
  }

  // Validate and normalize visitor ID
  const visitorValidation = await validateVisitorId(validation.data!.visitor_id);
  if (!visitorValidation.valid) {
    return errorResponse('Invalid visitor identity', 400);
  }
  const visitorId = visitorValidation.visitorId;

  // Check rate limit using validated visitor_id (fails closed)
  const rateLimit = await checkRateLimit('chat', visitorId);
  if (!rateLimit.allowed) {
    return rateLimitResponse(
      rateLimitHeaders('chat', rateLimit.remaining, rateLimit.resetIn),
      rateLimit.error === 'rate_limit_unavailable'
    );
  }

  const supabase = createAdminClient();
  let sessionId = validation.data!.session_id;

  // Validate session ownership if session ID provided
  if (sessionId) {
    const ownershipCheck = await validateSessionOwnership(sessionId, visitorId, supabase);
    if (!ownershipCheck.valid) {
      return errorResponse(ownershipCheck.error ?? 'Session access denied', 403);
    }
  }

  try {
    // Create new session if needed
    if (!sessionId) {
      const { data: session, error: sessionError } = await supabase
        .from('chat_sessions')
        .insert({
          visitor_id: visitorId,
          status: 'active',
        } as never)
        .select('id')
        .single();

      if (sessionError || !session) {
        console.error('[Chat] Session creation error:', sessionError);
        return errorResponse('Failed to start chat session', 500);
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
      console.error('[Chat] Message insert error:', messageError);
      return errorResponse('Failed to send message', 500);
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
      sessionId: sessionId,
    });

    return successResponse(
      { message: 'Message sent', session_id: sessionId },
      200,
      rateLimitHeaders('chat', rateLimit.remaining, rateLimit.resetIn)
    );
  } catch (error) {
    console.error('[Chat] Unexpected error:', error);
    return errorResponse('An unexpected error occurred', 500);
  }
}
