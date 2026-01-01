/**
 * Admin Review API
 * GET /api/admin/reviews/[id] - Get single review
 * PUT /api/admin/reviews/[id] - Update review
 * DELETE /api/admin/reviews/[id] - Delete review
 */

import { NextRequest, NextResponse } from 'next/server';

import { getAdminSession } from '@/lib/auth/session';
import { deleteReview, getReviewByIdAdmin, updateReview } from '@/lib/reviews/admin';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const review = await getReviewByIdAdmin(id);

    if (!review) {
      return NextResponse.json({ error: 'Review not found' }, { status: 404 });
    }

    return NextResponse.json({ review });
  } catch (error) {
    console.error('[API] Get review error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    let body: Record<string, unknown>;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
    }

    const result = await updateReview(id, {
      project_id: body.project_id !== undefined ? (body.project_id as string | null) : undefined,
      client_name: body.client_name as string | undefined,
      client_role: body.client_role !== undefined ? (body.client_role as string | null) : undefined,
      client_company: body.client_company !== undefined ? (body.client_company as string | null) : undefined,
      client_avatar_url: body.client_avatar_url !== undefined ? (body.client_avatar_url as string | null) : undefined,
      review_text: body.review_text as string | undefined,
      rating: body.rating !== undefined ? (body.rating as number | null) : undefined,
      is_featured: body.is_featured as boolean | undefined,
      is_published: body.is_published as boolean | undefined,
      display_order: body.display_order as number | undefined,
    });

    if (!result.success) {
      return NextResponse.json({ error: result.error ?? 'Failed to update review' }, { status: 500 });
    }

    return NextResponse.json({ review: result.data });
  } catch (error) {
    console.error('[API] Update review error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const result = await deleteReview(id);

    if (!result.success) {
      return NextResponse.json({ error: result.error ?? 'Failed to delete review' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[API] Delete review error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
