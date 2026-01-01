/**
 * Admin Project Featured API
 * PATCH /api/admin/projects/[id]/featured - Toggle featured status
 */

import { NextRequest, NextResponse } from 'next/server';

import { getAdminSession } from '@/lib/auth/session';
import { toggleFeatured } from '@/lib/projects/admin';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    let body: { is_featured?: boolean };
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
    }

    if (typeof body.is_featured !== 'boolean') {
      return NextResponse.json({ error: 'Invalid is_featured value' }, { status: 400 });
    }

    const result = await toggleFeatured(id, body.is_featured);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error ?? 'Failed to update featured status' },
        { status: 500 }
      );
    }

    return NextResponse.json({ project: result.data });
  } catch (error) {
    console.error('[API] Update featured error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
