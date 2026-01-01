/**
 * Newsletter Subscription API Route
 * POST /api/newsletter
 *
 * HARDENED:
 * - Request body size limit (100KB)
 * - Safe JSON parsing
 * - Rate limiting fails closed
 * - CAPTCHA verification (reCAPTCHA v3)
 * - Idempotency support
 * - UPSERT pattern for efficiency
 */

import { verifyCaptcha } from '@/lib/captcha';
import { checkIdempotency, storeIdempotencyResult } from '@/lib/idempotency';
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
  // Check idempotency first (return cached response if duplicate)
  const idempotency = await checkIdempotency('/api/newsletter');
  if (idempotency.isDuplicate && idempotency.cachedResponse) {
    return successResponse(idempotency.cachedResponse as Record<string, unknown>);
  }

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

  // Verify CAPTCHA (fails closed in production)
  const captchaToken = body.captchaToken as string | undefined;
  const captchaResult = await verifyCaptcha(captchaToken);
  if (!captchaResult.success) {
    return errorResponse(captchaResult.error ?? 'Captcha verification failed', 400);
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
    let responseData: { message: string };

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

        responseData = { message: 'Welcome back! Subscription reactivated.' };
      } else {
        // Already subscribed - return success without revealing existence
        responseData = { message: 'Subscribed successfully!' };
      }
    } else {
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
          responseData = { message: 'Subscribed successfully!' };
        } else {
          console.error('[Newsletter] Insert error:', {
            code: insertError.code,
            message: insertError.message,
          });
          return errorResponse('Failed to subscribe. Please try again.', 500);
        }
      } else {
        responseData = { message: 'Subscribed successfully!' };
      }
    }

    // Store idempotency result
    await storeIdempotencyResult(idempotency.key, '/api/newsletter', responseData);

    return successResponse(
      responseData,
      200,
      rateLimitHeaders('newsletter', rateLimit.remaining, rateLimit.resetIn)
    );
  } catch (error) {
    console.error('[Newsletter] Unexpected error:', error);
    return errorResponse('An unexpected error occurred', 500);
  }
}
