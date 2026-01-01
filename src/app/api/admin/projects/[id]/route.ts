/**
 * Admin Project API
 * GET /api/admin/projects/[id] - Get single project
 * PUT /api/admin/projects/[id] - Update project
 * DELETE /api/admin/projects/[id] - Delete project
 */

import { NextRequest, NextResponse } from 'next/server';

import { getAdminSession } from '@/lib/auth/session';
import {
  deleteProject,
  getProjectByIdAdmin,
  updateProject,
} from '@/lib/projects/admin';
import { validateProjectInput } from '@/lib/validations/projects';

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
    const project = await getProjectByIdAdmin(id);

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    return NextResponse.json({ project });
  } catch (error) {
    console.error('[API] Get project error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    // Parse body
    let body: Record<string, unknown>;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
    }

    // Validate input (partial update)
    const validation = validateProjectInput(body, true);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.errors },
        { status: 400 }
      );
    }

    // Build update object
    const updateData: Record<string, unknown> = {};
    if (body.title !== undefined) updateData.title = body.title;
    if (body.slug !== undefined) updateData.slug = body.slug;
    if (body.short_description !== undefined) updateData.short_description = body.short_description;
    if (body.full_description !== undefined) updateData.full_description = body.full_description;
    if (body.category !== undefined) updateData.category = body.category;
    if (body.tech_stack !== undefined) updateData.tech_stack = body.tech_stack;
    if (body.status !== undefined) updateData.status = body.status;
    if (body.is_featured !== undefined) updateData.is_featured = body.is_featured;
    if (body.priority !== undefined) updateData.priority = body.priority;
    if (body.live_url !== undefined) updateData.live_url = body.live_url || null;
    if (body.github_url !== undefined) updateData.github_url = body.github_url || null;
    if (body.meta_title !== undefined) updateData.meta_title = body.meta_title || null;
    if (body.meta_description !== undefined) updateData.meta_description = body.meta_description || null;

    const result = await updateProject(id, updateData);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error ?? 'Failed to update project' },
        { status: 500 }
      );
    }

    return NextResponse.json({ project: result.data });
  } catch (error) {
    console.error('[API] Update project error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const result = await deleteProject(id);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error ?? 'Failed to delete project' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[API] Delete project error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
