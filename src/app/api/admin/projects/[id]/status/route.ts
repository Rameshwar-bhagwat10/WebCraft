/**
 * Admin Project Status API
 * PATCH /api/admin/projects/[id]/status - Update project status
 */

import { NextRequest, NextResponse } from 'next/server';

import { getAdminSession } from '@/lib/auth/session';
import { updateProject } from '@/lib/projects/admin';

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

    let body: { status?: string };
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
    }

    if (!body.status || !['draft', 'published'].includes(body.status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    const result = await updateProject(id, { 
      status: body.status as 'draft' | 'published' 
    });

    if (!result.success) {
      return NextResponse.json(
        { error: result.error ?? 'Failed to update status' },
        { status: 500 }
      );
    }

    return NextResponse.json({ project: result.data });
  } catch (error) {
    console.error('[API] Update status error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
