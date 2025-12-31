/**
 * Newsletter Subscription API Route
 * POST /api/newsletter
 *
 * HARDENED:
 * - Request body size limit (100KB)
 * - Safe JSON parsing
 * - Rate limiting fails closed
 * - UPSERT pattern for efficiency
 */

import { checkRateLimit, rateLimitHeaders } from '@/lib/rate-limit';
import {
  errorResponse,
  parseJsonBody,
  rateLimitResponse,
  successResponse,
} from '@/lib/request-utils';
import { createAdminClient } from '@/lib/supabase/server';
import { isHoneypotTriggered, validateNewsletter } from '@/lib/validations/forms';

export async function POST(request: Request) {
  // Parse body with size limit
  const parseResult = await parseJsonBody(request);
  if (!parseResult.success) {
    return parseResult.error;
  }

  const body = parseResult.data!;

  // Check honeypot (spam protection)
  if (isHoneypotTriggered(body)) {
    return successResponse({ message: 'Subscribed successfully' });
  }

  // Check rate limit (fails closed)
  const rateLimit = await checkRateLimit('newsletter');
  if (!rateLimit.allowed) {
    return rateLimitResponse(
      rateLimitHeaders('newsletter', rateLimit.remaining, rateLimit.resetIn),
      rateLimit.error === 'rate_limit_unavailable'
    );
  }

  // Validate data
  const validation = validateNewsletter(body);
  if (!validation.success) {
    return errorResponse('Validation failed', 400, validation.errors);
  }

  try {
    const supabase = createAdminClient();

    // Use UPSERT pattern: check and update/insert in one flow
    const { data: existing } = await supabase
      .from('newsletter_subscriptions')
      .select('id, status')
      .eq('email', validation.data!.email)
      .single();

    const existingRecord = existing as { id: string; status: string } | null;

    if (existingRecord) {
      // If unsubscribed, reactivate
      if (existingRecord.status === 'unsubscribed') {
        const { error: updateError } = await supabase
          .from('newsletter_subscriptions')
          .update({
            status: 'active',
            unsubscribed_at: null,
          } as never)
          .eq('id', existingRecord.id);

        if (updateError) {
          console.error('[Newsletter] Reactivation error:', updateError);
          return errorResponse('Failed to reactivate subscription', 500);
        }

        return successResponse(
          { message: 'Welcome back! Subscription reactivated.' },
          200,
          rateLimitHeaders('newsletter', rateLimit.remaining, rateLimit.resetIn)
        );
      }

      // Already subscribed - return success without revealing existence
      return successResponse(
        { message: 'Subscribed successfully!' },
        200,
        rateLimitHeaders('newsletter', rateLimit.remaining, rateLimit.resetIn)
      );
    }

    // Insert new subscription
    const { error: insertError } = await supabase
      .from('newsletter_subscriptions')
      .insert({
        email: validation.data!.email,
        source: validation.data!.source,
        status: 'active',
      } as never);

    if (insertError) {
      // Handle unique constraint violation gracefully
      if (insertError.code === '23505') {
        return successResponse(
          { message: 'Subscribed successfully!' },
          200,
          rateLimitHeaders('newsletter', rateLimit.remaining, rateLimit.resetIn)
        );
      }

      console.error('[Newsletter] Insert error:', {
        code: insertError.code,
        message: insertError.message,
      });
      return errorResponse('Failed to subscribe. Please try again.', 500);
    }

    return successResponse(
      { message: 'Subscribed successfully!' },
      200,
      rateLimitHeaders('newsletter', rateLimit.remaining, rateLimit.resetIn)
    );
  } catch (error) {
    console.error('[Newsletter] Unexpected error:', error);
    return errorResponse('An unexpected error occurred', 500);
  }
}
