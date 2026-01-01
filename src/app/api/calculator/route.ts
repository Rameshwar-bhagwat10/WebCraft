/**
 * Calculator Submission API Route
 * POST /api/calculator
 *
 * HARDENED:
 * - Request body size limit (100KB)
 * - Safe JSON parsing
 * - Rate limiting fails closed
 * - CAPTCHA verification (reCAPTCHA v3)
 * - Idempotency support
 * - Honeypot spam protection
 */

import { verifyCaptcha } from '@/lib/captcha';
import { notifyNewCalculatorLead } from '@/lib/email';
import { checkIdempotency, storeIdempotencyResult } from '@/lib/idempotency';
import { checkRateLimit, rateLimitHeaders } from '@/lib/rate-limit';
import {
  errorResponse,
  parseJsonBody,
  rateLimitResponse,
  successResponse,
} from '@/lib/request-utils';
import { createAdminClient } from '@/lib/supabase/server';
import { isHoneypotTriggered, validateCalculatorForm } from '@/lib/validations/forms';

export async function POST(request: Request) {
  // Check idempotency first (return cached response if duplicate)
  const idempotency = await checkIdempotency('/api/calculator');
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
    return successResponse({ message: 'Quote saved successfully' });
  }

  // Verify CAPTCHA (fails closed in production)
  const captchaToken = body.captchaToken as string | undefined;
  const captchaResult = await verifyCaptcha(captchaToken);
  if (!captchaResult.success) {
    return errorResponse(captchaResult.error ?? 'Captcha verification failed', 400);
  }

  // Check rate limit (fails closed)
  const rateLimit = await checkRateLimit('calculator');
  if (!rateLimit.allowed) {
    return rateLimitResponse(
      rateLimitHeaders('calculator', rateLimit.remaining, rateLimit.resetIn),
      rateLimit.error === 'rate_limit_unavailable'
    );
  }

  // Validate form data
  const validation = validateCalculatorForm(body);
  if (!validation.success) {
    return errorResponse('Validation failed', 400, validation.errors);
  }

  // Insert into database
  try {
    const supabase = createAdminClient();
    const { error } = await supabase
      .from('calculator_submissions')
      .insert({
        project_type: validation.data!.project_type,
        features: validation.data!.features,
        timeline: validation.data!.timeline,
        estimated_min: validation.data!.estimated_min,
        estimated_max: validation.data!.estimated_max,
        contact_email: validation.data!.contact_email,
        contact_name: validation.data!.contact_name,
        status: 'new',
        lead_source: 'calculator',
      } as never);

    if (error) {
      console.error('[Calculator] Database error:', {
        code: error.code,
        message: error.message,
      });
      return errorResponse('Failed to save quote. Please try again.', 500);
    }

    // Send email notifications (async, non-blocking)
    const contactEmail = validation.data!.contact_email;
    if (contactEmail) {
      notifyNewCalculatorLead({
        name: validation.data!.contact_name ?? undefined,
        email: contactEmail,
        projectType: validation.data!.project_type,
        estimatedMin: validation.data!.estimated_min,
        estimatedMax: validation.data!.estimated_max,
      });
    }

    const responseData = { message: 'Quote saved successfully' };

    // Store idempotency result
    await storeIdempotencyResult(idempotency.key, '/api/calculator', responseData);

    return successResponse(
      responseData,
      200,
      rateLimitHeaders('calculator', rateLimit.remaining, rateLimit.resetIn)
    );
  } catch (error) {
    console.error('[Calculator] Unexpected error:', error);
    return errorResponse('An unexpected error occurred', 500);
  }
}
