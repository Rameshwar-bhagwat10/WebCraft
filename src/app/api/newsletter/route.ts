/**
 * Newsletter Subscription API Route
 * POST /api/newsletter
 *
 * Security:
 * - Rate limited (3/hour/IP)
 * - Honeypot spam protection
 * - Server-side validation
 * - Handles duplicate emails gracefully
 */

import { NextResponse } from 'next/server';

import {
  checkRateLimit,
  rateLimitHeaders,
} from '@/lib/rate-limit';
import { createAdminClient } from '@/lib/supabase/server';
import {
  isHoneypotTriggered,
  validateNewsletter,
} from '@/lib/validations/forms';

export async function POST(request: Request) {
  try {
    // Parse request body
    const body = await request.json();

    // Check honeypot (spam protection)
    if (isHoneypotTriggered(body)) {
      return NextResponse.json(
        { success: true, message: 'Subscribed successfully' },
        { status: 200 }
      );
    }

    // Check rate limit
    const rateLimit = await checkRateLimit('newsletter');
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { success: false, error: 'Too many requests. Please try again later.' },
        {
          status: 429,
          headers: rateLimitHeaders('newsletter', rateLimit.remaining, rateLimit.resetIn),
        }
      );
    }

    // Validate data
    const validation = validateNewsletter(body);
    if (!validation.success) {
      return NextResponse.json(
        { success: false, errors: validation.errors },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();

    // Check if email already exists
    const { data } = await supabase
      .from('newsletter_subscriptions')
      .select('id, status')
      .eq('email', validation.data!.email)
      .single();

    const existing = data as { id: string; status: string } | null;

    if (existing) {
      // If unsubscribed, reactivate
      if (existing.status === 'unsubscribed') {
        await supabase
          .from('newsletter_subscriptions')
          .update({
            status: 'active',
            unsubscribed_at: null,
          } as never)
          .eq('id', existing.id);

        return NextResponse.json(
          { success: true, message: 'Welcome back! Subscription reactivated.' },
          { status: 200 }
        );
      }

      // Already subscribed
      return NextResponse.json(
        { success: true, message: 'You are already subscribed!' },
        { status: 200 }
      );
    }

    // Insert new subscription
    const { error } = await supabase
      .from('newsletter_subscriptions')
      .insert({
        email: validation.data!.email,
        source: validation.data!.source,
        status: 'active',
      } as never);

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to subscribe. Please try again.' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, message: 'Subscribed successfully!' },
      {
        status: 200,
        headers: rateLimitHeaders('newsletter', rateLimit.remaining, rateLimit.resetIn),
      }
    );
  } catch (error) {
    console.error('Newsletter error:', error);
    return NextResponse.json(
      { success: false, error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
