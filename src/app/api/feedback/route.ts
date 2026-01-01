/**
 * Public Feedback API
 * POST /api/feedback - Submit visitor feedback
 *
 * HARDENED:
 * - Rate limiting fails closed
 * - CAPTCHA verification (reCAPTCHA v3)
 * - Idempotency support
 * - Input validation
 */

import { headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

import { verifyCaptcha } from '@/lib/captcha';
import { submitFeedback } from '@/lib/feedback/queries';
import { checkIdempotency, storeIdempotencyResult } from '@/lib/idempotency';
import { checkRateLimit, getClientIP } from '@/lib/rate-limit';

export async function POST(request: NextRequest) {
  try {
    // Check idempotency first (return cached response if duplicate)
    const idempotency = await checkIdempotency('/api/feedback');
    if (idempotency.isDuplicate && idempotency.cachedResponse) {
      return NextResponse.json(idempotency.cachedResponse, { status: 201 });
    }

    // Rate limiting
    const ip = await getClientIP();
    const rateLimitResult = await checkRateLimit('contact', ip); // Use contact limit (5/hour)
    
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { error: 'Too many submissions. Please try again later.' },
        { status: 429 }
      );
    }

    let body: Record<string, unknown>;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
    }

    // Verify CAPTCHA (fails closed in production)
    const captchaToken = body.captchaToken as string | undefined;
    const captchaResult = await verifyCaptcha(captchaToken);
    if (!captchaResult.success) {
      return NextResponse.json(
        { error: captchaResult.error ?? 'Captcha verification failed' },
        { status: 400 }
      );
    }

    // Validate required fields
    const name = body.name as string | undefined;
    const message = body.message as string | undefined;
    const rating = body.rating as number | undefined;

    if (!name || typeof name !== 'string' || name.length < 2) {
      return NextResponse.json({ error: 'Name is required (min 2 characters)' }, { status: 400 });
    }

    if (!message || typeof message !== 'string' || message.length < 10) {
      return NextResponse.json({ error: 'Message is required (min 10 characters)' }, { status: 400 });
    }

    if (message.length > 500) {
      return NextResponse.json({ error: 'Message too long (max 500 characters)' }, { status: 400 });
    }

    if (!rating || typeof rating !== 'number' || rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'Rating must be between 1 and 5' }, { status: 400 });
    }

    // Optional email validation
    const email = body.email as string | undefined;
    if (email && typeof email === 'string') {
      const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
      if (!emailRegex.test(email)) {
        return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
      }
    }

    // Get user agent
    const headersList = await headers();
    const userAgent = headersList.get('user-agent');

    const result = await submitFeedback({
      name: name.trim(),
      email: email?.trim() ?? null,
      message: message.trim(),
      rating,
      ip_address: ip,
      user_agent: userAgent,
    });

    if (!result.success) {
      return NextResponse.json(
        { error: result.error ?? 'Failed to submit feedback' },
        { status: 500 }
      );
    }

    const responseData = { success: true, message: 'Thank you for your feedback!' };

    // Store idempotency result
    await storeIdempotencyResult(idempotency.key, '/api/feedback', responseData);

    return NextResponse.json(responseData, { status: 201 });
  } catch (error) {
    console.error('[API] Submit feedback error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
