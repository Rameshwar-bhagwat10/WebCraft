/**
 * Contact Form API Route
 * POST /api/contact
 *
 * Security:
 * - Rate limited (5/hour/IP)
 * - Honeypot spam protection
 * - Server-side validation
 * - RLS enforced
 */

import { NextResponse } from 'next/server';

import { notifyNewContactLead } from '@/lib/email';
import {
  checkRateLimit,
  rateLimitHeaders,
} from '@/lib/rate-limit';
import { createAdminClient } from '@/lib/supabase/server';
import {
  isHoneypotTriggered,
  validateContactForm,
} from '@/lib/validations/forms';

export async function POST(request: Request) {
  try {
    // Parse request body
    const body = await request.json();

    // Check honeypot (spam protection)
    if (isHoneypotTriggered(body)) {
      // Silently accept but don't store (fool bots)
      return NextResponse.json(
        { success: true, message: 'Message sent successfully' },
        { status: 200 }
      );
    }

    // Check rate limit
    const rateLimit = await checkRateLimit('contact');
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { success: false, error: 'Too many requests. Please try again later.' },
        {
          status: 429,
          headers: rateLimitHeaders('contact', rateLimit.remaining, rateLimit.resetIn),
        }
      );
    }

    // Validate form data
    const validation = validateContactForm(body);
    if (!validation.success) {
      return NextResponse.json(
        { success: false, errors: validation.errors },
        { status: 400 }
      );
    }

    // Insert into database using admin client (bypasses RLS for insert)
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
      } as never);

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to submit form. Please try again.' },
        { status: 500 }
      );
    }

    // Send email notifications (async, non-blocking)
    notifyNewContactLead({
      name: validation.data!.name,
      email: validation.data!.email,
      projectType: validation.data!.project_type,
      message: validation.data!.message,
    });

    return NextResponse.json(
      { success: true, message: 'Message sent successfully' },
      {
        status: 200,
        headers: rateLimitHeaders('contact', rateLimit.remaining, rateLimit.resetIn),
      }
    );
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { success: false, error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
