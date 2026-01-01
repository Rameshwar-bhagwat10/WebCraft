/**
 * Admin Project Images API
 * POST /api/admin/projects/[id]/images - Upload image
 * DELETE /api/admin/projects/[id]/images - Delete image
 * PATCH /api/admin/projects/[id]/images - Update image (set cover)
 */

import { NextRequest, NextResponse } from 'next/server';

import { getAdminSession } from '@/lib/auth/session';
import {
  addProjectImage,
  removeProjectImage,
  setCoverImage,
} from '@/lib/projects/admin';
import {
  generateImagePath,
  validateImageFile,
} from '@/lib/projects/storage';
import { createAdminClient } from '@/lib/supabase/server';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: projectId } = await params;

    // Parse form data
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const altText = (formData.get('alt_text') as string) || 'Project image';

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate file
    const validation = validateImageFile(file);
    if (!validation.valid) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    // Upload to storage
    const supabase = createAdminClient();
    const path = generateImagePath(projectId, file.name, Date.now());

    const { error: uploadError } = await supabase.storage
      .from('project-images')
      .upload(path, file, {
        cacheControl: '31536000',
        upsert: false,
      });

    if (uploadError) {
      console.error('[API] Upload error:', uploadError);
      return NextResponse.json(
        { error: 'Failed to upload image' },
        { status: 500 }
      );
    }

    // Check if this is the first image for the project (auto-set as cover)
    const { count } = await supabase
      .from('project_images')
      .select('id', { count: 'exact', head: true })
      .eq('project_id', projectId);
    
    const isFirstImage = (count ?? 0) === 0;

    // Add to database
    const result = await addProjectImage({
      project_id: projectId,
      storage_path: path,
      alt_text: altText,
      is_cover: isFirstImage, // Auto-set first image as cover
      display_order: 0,
      file_size: file.size,
    });

    if (!result.success) {
      // Cleanup uploaded file
      await supabase.storage.from('project-images').remove([path]);
      return NextResponse.json(
        { error: result.error ?? 'Failed to save image' },
        { status: 500 }
      );
    }

    return NextResponse.json({ image: result.data }, { status: 201 });
  } catch (error) {
    console.error('[API] Upload image error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await params; // Consume params

    const { searchParams } = new URL(request.url);
    const imageId = searchParams.get('imageId');

    if (!imageId) {
      return NextResponse.json({ error: 'Image ID required' }, { status: 400 });
    }

    const result = await removeProjectImage(imageId);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error ?? 'Failed to delete image' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[API] Delete image error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await params; // Consume params

    let body: { imageId?: string; is_cover?: boolean };
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
    }

    if (!body.imageId) {
      return NextResponse.json({ error: 'Image ID required' }, { status: 400 });
    }

    if (body.is_cover) {
      const result = await setCoverImage(body.imageId);
      if (!result.success) {
        return NextResponse.json(
          { error: result.error ?? 'Failed to set cover' },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[API] Update image error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
