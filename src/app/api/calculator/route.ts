/**
 * Calculator Submission API Route
 * POST /api/calculator
 *
 * Security:
 * - Rate limited (10/hour/IP)
 * - Honeypot spam protection
 * - Server-side validation
 * - RLS enforced
 */

import { NextResponse } from 'next/server';

import { notifyNewCalculatorLead } from '@/lib/email';
import {
  checkRateLimit,
  rateLimitHeaders,
} from '@/lib/rate-limit';
import { createAdminClient } from '@/lib/supabase/server';
import {
  isHoneypotTriggered,
  validateCalculatorForm,
} from '@/lib/validations/forms';

export async function POST(request: Request) {
  try {
    // Parse request body
    const body = await request.json();

    // Check honeypot (spam protection)
    if (isHoneypotTriggered(body)) {
      return NextResponse.json(
        { success: true, message: 'Quote saved successfully' },
        { status: 200 }
      );
    }

    // Check rate limit
    const rateLimit = await checkRateLimit('calculator');
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { success: false, error: 'Too many requests. Please try again later.' },
        {
          status: 429,
          headers: rateLimitHeaders('calculator', rateLimit.remaining, rateLimit.resetIn),
        }
      );
    }

    // Validate form data
    const validation = validateCalculatorForm(body);
    if (!validation.success) {
      return NextResponse.json(
        { success: false, errors: validation.errors },
        { status: 400 }
      );
    }

    // Insert into database
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
      } as never);

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to save quote. Please try again.' },
        { status: 500 }
      );
    }

    // Send email notifications (async, non-blocking) - only if email provided
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

    return NextResponse.json(
      { success: true, message: 'Quote saved successfully' },
      {
        status: 200,
        headers: rateLimitHeaders('calculator', rateLimit.remaining, rateLimit.resetIn),
      }
    );
  } catch (error) {
    console.error('Calculator form error:', error);
    return NextResponse.json(
      { success: false, error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
