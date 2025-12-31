/**
 * Contact Form API Route
 * POST /api/contact
 *
 * HARDENED:
 * - Request body size limit (100KB)
 * - Safe JSON parsing
 * - Rate limiting fails closed
 * - Trusted IP extraction
 */

import { notifyNewContactLead } from '@/lib/email';
import { checkRateLimit, rateLimitHeaders } from '@/lib/rate-limit';
import {
  errorResponse,
  parseJsonBody,
  rateLimitResponse,
  successResponse,
} from '@/lib/request-utils';
import { createAdminClient } from '@/lib/supabase/server';
import { isHoneypotTriggered, validateContactForm } from '@/lib/validations/forms';

export async function POST(request: Request) {
  // Parse body with size limit
  const parseResult = await parseJsonBody(request);
  if (!parseResult.success) {
    return parseResult.error;
  }

  const body = parseResult.data!;

  // Check honeypot (spam protection) - silently accept
  if (isHoneypotTriggered(body)) {
    return successResponse({ message: 'Message sent successfully' });
  }

  // Check rate limit (fails closed)
  const rateLimit = await checkRateLimit('contact');
  if (!rateLimit.allowed) {
    return rateLimitResponse(
      rateLimitHeaders('contact', rateLimit.remaining, rateLimit.resetIn),
      rateLimit.error === 'rate_limit_unavailable'
    );
  }

  // Validate form data
  const validation = validateContactForm(body);
  if (!validation.success) {
    return errorResponse('Validation failed', 400, validation.errors);
  }

  // Insert into database
  try {
    const supabase = createAdminClient();
    const { error } = await supabase
      .from('contact_submissions')
      .insert({
        name: validation.data!.name,
        email: validation.data!.email,
        phone: validation.data!.phone,
        project_type: validation.data!.project_type,
        message: validation.data!.message,
        status: 'new',
        lead_source: 'contact',
      } as never);

    if (error) {
      console.error('[Contact] Database error:', {
        code: error.code,
        message: error.message,
      });
      return errorResponse('Failed to submit form. Please try again.', 500);
    }

    // Send email notifications (async, non-blocking)
    notifyNewContactLead({
      name: validation.data!.name,
      email: validation.data!.email,
      projectType: validation.data!.project_type,
      message: validation.data!.message,
    });

    return successResponse(
      { message: 'Message sent successfully' },
      200,
      rateLimitHeaders('contact', rateLimit.remaining, rateLimit.resetIn)
    );
  } catch (error) {
    console.error('[Contact] Unexpected error:', error);
    return errorResponse('An unexpected error occurred', 500);
  }
}
