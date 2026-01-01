/**
 * Admin Projects API
 * POST /api/admin/projects - Create new project
 * GET /api/admin/projects - List all projects (admin)
 */

import { NextRequest, NextResponse } from 'next/server';

import { getAdminSession } from '@/lib/auth/session';
import { createProject, getAllProjectsAdmin } from '@/lib/projects/admin';
import { validateProjectInput } from '@/lib/validations/projects';

export async function GET() {
  try {
    // Verify admin session
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const projects = await getAllProjectsAdmin();
    return NextResponse.json({ projects });
  } catch (error) {
    console.error('[API] Get projects error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Verify admin session
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse body
    let body: Record<string, unknown>;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
    }

    // Validate input
    const validation = validateProjectInput(body, false);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.errors },
        { status: 400 }
      );
    }

    // Create project
    const result = await createProject({
      title: body.title as string,
      slug: body.slug as string,
      short_description: body.short_description as string,
      full_description: body.full_description as string,
      category: body.category as 'website' | 'webapp' | 'mobile' | 'ecommerce' | 'dashboard' | 'landing' | 'other',
      tech_stack: body.tech_stack as string[],
      status: (body.status as 'draft' | 'published') ?? 'draft',
      is_featured: (body.is_featured as boolean) ?? false,
      priority: (body.priority as number) ?? 0,
      live_url: (body.live_url as string) ?? null,
      github_url: (body.github_url as string) ?? null,
      meta_title: (body.meta_title as string) ?? null,
      meta_description: (body.meta_description as string) ?? null,
    });

    if (!result.success) {
      return NextResponse.json(
        { error: result.error ?? 'Failed to create project' },
        { status: 500 }
      );
    }

    return NextResponse.json({ project: result.data }, { status: 201 });
  } catch (error) {
    console.error('[API] Create project error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
