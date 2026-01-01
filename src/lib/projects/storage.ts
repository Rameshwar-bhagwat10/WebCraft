/**
 * Projects Storage
 * Supabase Storage utilities for project images
 *
 * Security:
 * - File type validation
 * - Size limits enforced
 * - Secure paths
 */

import {
  ALLOWED_IMAGE_FORMATS,
  IMAGE_CONSTRAINTS,
  PROJECT_IMAGES_BUCKET,
  type AllowedImageFormat,
  type ImageUploadResult,
} from './types';

/**
 * Validate image file before upload
 */
export function validateImageFile(file: File): { valid: boolean; error?: string } {
  // Check file type
  if (!ALLOWED_IMAGE_FORMATS.includes(file.type as AllowedImageFormat)) {
    return {
      valid: false,
      error: `Invalid file type. Allowed: ${ALLOWED_IMAGE_FORMATS.join(', ')}`,
    };
  }

  // Check file size
  if (file.size > IMAGE_CONSTRAINTS.maxFileSize) {
    const maxMB = IMAGE_CONSTRAINTS.maxFileSize / (1024 * 1024);
    return {
      valid: false,
      error: `File too large. Maximum size: ${maxMB}MB`,
    };
  }

  return { valid: true };
}

/**
 * Generate secure storage path for project image
 */
export function generateImagePath(
  projectId: string,
  filename: string,
  index: number = 0
): string {
  // Sanitize filename
  const ext = filename.split('.').pop()?.toLowerCase() ?? 'jpg';
  const timestamp = Date.now();
  const safeName = `${timestamp}_${index}.${ext}`;

  return `${projectId}/${safeName}`;
}

/**
 * Get public URL for project image
 */
export function getProjectImageUrl(
  storagePath: string,
  supabaseUrl: string
): string {
  return `${supabaseUrl}/storage/v1/object/public/${PROJECT_IMAGES_BUCKET}/${storagePath}`;
}

/**
 * Get optimized image URL with transformations
 * Uses Supabase Image Transformation (if enabled)
 */
export function getOptimizedImageUrl(
  storagePath: string,
  supabaseUrl: string,
  options?: {
    width?: number;
    height?: number;
    quality?: number;
    format?: 'webp' | 'avif';
  }
): string {
  const baseUrl = `${supabaseUrl}/storage/v1/render/image/public/${PROJECT_IMAGES_BUCKET}/${storagePath}`;

  const params = new URLSearchParams();
  if (options?.width) params.set('width', String(options.width));
  if (options?.height) params.set('height', String(options.height));
  if (options?.quality) params.set('quality', String(options.quality));
  if (options?.format) params.set('format', options.format);

  const queryString = params.toString();
  return queryString ? `${baseUrl}?${queryString}` : baseUrl;
}

/**
 * Upload project image (admin only)
 * This is a server-side utility for admin operations
 */
export async function uploadProjectImage(
  supabase: ReturnType<typeof import('@/lib/supabase/server').createAdminClient>,
  projectId: string,
  file: File,
  index: number = 0
): Promise<ImageUploadResult> {
  // Validate file
  const validation = validateImageFile(file);
  if (!validation.valid) {
    return { success: false, error: validation.error ?? 'Validation failed' };
  }

  // Generate path
  const path = generateImagePath(projectId, file.name, index);

  try {
    // Upload to storage
    const { error } = await supabase.storage
      .from(PROJECT_IMAGES_BUCKET)
      .upload(path, file, {
        cacheControl: '31536000', // 1 year cache
        upsert: false,
      });

    if (error) {
      console.error('[Storage] Upload error:', error);
      return { success: false, error: error.message };
    }

    return { success: true, path };
  } catch (error) {
    console.error('[Storage] Upload exception:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Upload failed',
    };
  }
}

/**
 * Delete project image (admin only)
 */
export async function deleteProjectImage(
  supabase: ReturnType<typeof import('@/lib/supabase/server').createAdminClient>,
  storagePath: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase.storage
      .from(PROJECT_IMAGES_BUCKET)
      .remove([storagePath]);

    if (error) {
      console.error('[Storage] Delete error:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('[Storage] Delete exception:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Delete failed',
    };
  }
}

/**
 * Delete all images for a project (admin only)
 */
export async function deleteProjectImages(
  supabase: ReturnType<typeof import('@/lib/supabase/server').createAdminClient>,
  projectId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // List all files in project folder
    const { data: files, error: listError } = await supabase.storage
      .from(PROJECT_IMAGES_BUCKET)
      .list(projectId);

    if (listError) {
      console.error('[Storage] List error:', listError);
      return { success: false, error: listError.message };
    }

    if (!files || files.length === 0) {
      return { success: true };
    }

    // Delete all files
    const paths = files.map((file) => `${projectId}/${file.name}`);
    const { error: deleteError } = await supabase.storage
      .from(PROJECT_IMAGES_BUCKET)
      .remove(paths);

    if (deleteError) {
      console.error('[Storage] Bulk delete error:', deleteError);
      return { success: false, error: deleteError.message };
    }

    return { success: true };
  } catch (error) {
    console.error('[Storage] Delete all exception:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Delete failed',
    };
  }
}
