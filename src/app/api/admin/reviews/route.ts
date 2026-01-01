/**
 * Admin Reviews API
 * POST /api/admin/reviews - Create new review
 * GET /api/admin/reviews - List all reviews
 */

import { NextRequest, NextResponse } from 'next/server';

import { getAdminSession } from '@/lib/auth/session';
import { createReview, getAllReviewsAdmin } from '@/lib/reviews/admin';

export async function GET() {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const reviews = await getAllReviewsAdmin();
    return NextResponse.json({ reviews });
  } catch (error) {
    console.error('[API] Get reviews error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let body: Record<string, unknown>;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
    }

    // Validate required fields
    if (!body.client_name || typeof body.client_name !== 'string') {
      return NextResponse.json({ error: 'Client name is required' }, { status: 400 });
    }
    if (!body.review_text || typeof body.review_text !== 'string') {
      return NextResponse.json({ error: 'Review text is required' }, { status: 400 });
    }

    const result = await createReview({
      project_id: (body.project_id as string) ?? null,
      client_name: body.client_name as string,
      client_role: (body.client_role as string) ?? null,
      client_company: (body.client_company as string) ?? null,
      client_avatar_url: (body.client_avatar_url as string) ?? null,
      review_text: body.review_text as string,
      rating: (body.rating as number) ?? null,
      is_featured: (body.is_featured as boolean) ?? false,
      is_published: (body.is_published as boolean) ?? false,
      display_order: (body.display_order as number) ?? 0,
    });

    if (!result.success) {
      return NextResponse.json({ error: result.error ?? 'Failed to create review' }, { status: 500 });
    }

    return NextResponse.json({ review: result.data }, { status: 201 });
  } catch (error) {
    console.error('[API] Create review error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
