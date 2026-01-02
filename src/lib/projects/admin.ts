/**
 * Projects Admin Backend
 * Server-side admin operations for projects
 *
 * NOTE: This is backend logic only. Admin UI will be added later.
 * All functions require admin authentication.
 */

import { createAdminClient } from '@/lib/supabase/server';
import type {
  Project,
  ProjectCategory,
  ProjectImage,
  ProjectStatus,
} from '@/types/database';

import { deleteProjectImages } from './storage';

/**
 * Project create input
 */
export interface CreateProjectInput {
  title: string;
  slug: string;
  short_description: string;
  full_description: string;
  category: ProjectCategory;
  tech_stack: string[];
  status?: ProjectStatus;
  is_featured?: boolean;
  priority?: number;
  display_order?: number;
  live_url?: string | null;
  github_url?: string | null;
  meta_title?: string | null;
  meta_description?: string | null;
}

/**
 * Project update input
 */
export interface UpdateProjectInput {
  title?: string;
  slug?: string;
  short_description?: string;
  full_description?: string;
  category?: ProjectCategory;
  tech_stack?: string[];
  status?: ProjectStatus;
  is_featured?: boolean;
  priority?: number;
  display_order?: number;
  live_url?: string | null;
  github_url?: string | null;
  meta_title?: string | null;
  meta_description?: string | null;
}

/**
 * Image create input
 */
export interface CreateImageInput {
  project_id: string;
  storage_path: string;
  alt_text: string;
  is_cover?: boolean;
  display_order?: number;
  width?: number | null;
  height?: number | null;
  file_size?: number | null;
}

/**
 * Operation result
 */
export interface OperationResult<T = void> {
  success: boolean;
  data?: T;
  error?: string;
}

// ============================================
// PROJECT CRUD OPERATIONS
// ============================================

/**
 * Create a new project
 */
export async function createProject(
  input: CreateProjectInput
): Promise<OperationResult<Project>> {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from('projects')
    .insert({
      title: input.title,
      slug: input.slug,
      short_description: input.short_description,
      full_description: input.full_description,
      category: input.category,
      tech_stack: input.tech_stack,
      status: input.status ?? 'draft',
      is_featured: input.is_featured ?? false,
      priority: input.priority ?? 0,
      display_order: input.display_order ?? 0,
      live_url: input.live_url ?? null,
      github_url: input.github_url ?? null,
      meta_title: input.meta_title ?? null,
      meta_description: input.meta_description ?? null,
    } as never)
    .select()
    .single();

  if (error) {
    console.error('[Admin] Create project error:', error);
    return { success: false, error: error.message };
  }

  return { success: true, data: data as Project };
}

/**
 * Update an existing project
 */
export async function updateProject(
  id: string,
  input: UpdateProjectInput
): Promise<OperationResult<Project>> {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from('projects')
    .update(input as never)
    .eq('id', id)
    .is('deleted_at', null)
    .select()
    .single();

  if (error) {
    console.error('[Admin] Update project error:', error);
    return { success: false, error: error.message };
  }

  return { success: true, data: data as Project };
}

/**
 * Soft delete a project
 */
export async function deleteProject(id: string): Promise<OperationResult> {
  const supabase = createAdminClient();

  // Soft delete the project
  const { error } = await supabase
    .from('projects')
    .update({ deleted_at: new Date().toISOString() } as never)
    .eq('id', id);

  if (error) {
    console.error('[Admin] Delete project error:', error);
    return { success: false, error: error.message };
  }

  // Delete associated images from storage
  await deleteProjectImages(supabase, id);

  return { success: true };
}

/**
 * Publish a project
 */
export async function publishProject(id: string): Promise<OperationResult<Project>> {
  return updateProject(id, { status: 'published' });
}

/**
 * Unpublish a project (set to draft)
 */
export async function unpublishProject(id: string): Promise<OperationResult<Project>> {
  return updateProject(id, { status: 'draft' });
}

/**
 * Toggle featured status
 */
export async function toggleFeatured(
  id: string,
  featured: boolean
): Promise<OperationResult<Project>> {
  return updateProject(id, { is_featured: featured });
}

/**
 * Update project priority
 */
export async function updatePriority(
  id: string,
  priority: number
): Promise<OperationResult<Project>> {
  return updateProject(id, { priority: Math.max(0, Math.min(100, priority)) });
}

/**
 * Reorder projects
 */
export async function reorderProjects(
  orderedIds: string[]
): Promise<OperationResult> {
  const supabase = createAdminClient();

  // Update display_order for each project
  const updates = orderedIds.map((id, index) =>
    supabase
      .from('projects')
      .update({ display_order: index } as never)
      .eq('id', id)
  );

  try {
    await Promise.all(updates);
    return { success: true };
  } catch (error) {
    console.error('[Admin] Reorder projects error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Reorder failed',
    };
  }
}

// ============================================
// IMAGE CRUD OPERATIONS
// ============================================

/**
 * Add image to project
 */
export async function addProjectImage(
  input: CreateImageInput
): Promise<OperationResult<ProjectImage>> {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from('project_images')
    .insert({
      project_id: input.project_id,
      storage_path: input.storage_path,
      alt_text: input.alt_text,
      is_cover: input.is_cover ?? false,
      display_order: input.display_order ?? 0,
      width: input.width ?? null,
      height: input.height ?? null,
      file_size: input.file_size ?? null,
    } as never)
    .select()
    .single();

  if (error) {
    console.error('[Admin] Add image error:', error);
    return { success: false, error: error.message };
  }

  return { success: true, data: data as ProjectImage };
}

/**
 * Update image metadata
 */
export async function updateProjectImage(
  id: string,
  input: Partial<Pick<ProjectImage, 'alt_text' | 'is_cover' | 'display_order'>>
): Promise<OperationResult<ProjectImage>> {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from('project_images')
    .update(input as never)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('[Admin] Update image error:', error);
    return { success: false, error: error.message };
  }

  return { success: true, data: data as ProjectImage };
}

/**
 * Delete image
 */
export async function removeProjectImage(id: string): Promise<OperationResult> {
  const supabase = createAdminClient();

  // Get image path first
  const { data: image } = await supabase
    .from('project_images')
    .select('storage_path')
    .eq('id', id)
    .single();

  const imageData = image as { storage_path: string } | null;

  // Delete from database
  const { error } = await supabase.from('project_images').delete().eq('id', id);

  if (error) {
    console.error('[Admin] Delete image error:', error);
    return { success: false, error: error.message };
  }

  // Delete from storage
  if (imageData?.storage_path) {
    const { error: storageError } = await supabase.storage
      .from('project-images')
      .remove([imageData.storage_path]);

    // Storage deletion is non-critical - image may already be deleted
    if (storageError && process.env.NODE_ENV !== 'production') {
      console.warn('[Admin] Storage delete warning:', storageError.message);
    }
  }

  return { success: true };
}

/**
 * Set cover image
 */
export async function setCoverImage(imageId: string): Promise<OperationResult> {
  const result = await updateProjectImage(imageId, { is_cover: true });
  return {
    success: result.success,
    ...(result.error ? { error: result.error } : {}),
  };
}

/**
 * Reorder images
 */
export async function reorderImages(
  projectId: string,
  orderedImageIds: string[]
): Promise<OperationResult> {
  const supabase = createAdminClient();

  const updates = orderedImageIds.map((id, index) =>
    supabase
      .from('project_images')
      .update({ display_order: index } as never)
      .eq('id', id)
      .eq('project_id', projectId)
  );

  try {
    await Promise.all(updates);
    return { success: true };
  } catch (error) {
    console.error('[Admin] Reorder images error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Reorder failed',
    };
  }
}

// ============================================
// ADMIN QUERIES
// ============================================

/**
 * Get all projects (including drafts) for admin
 */
export async function getAllProjectsAdmin(): Promise<Project[]> {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .is('deleted_at', null)
    .order('display_order', { ascending: true })
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[Admin] Get all projects error:', error);
    return [];
  }

  return (data ?? []) as Project[];
}

/**
 * Get single project by ID for admin
 */
export async function getProjectByIdAdmin(id: string): Promise<Project | null> {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('id', id)
    .is('deleted_at', null)
    .single();

  if (error) {
    console.error('[Admin] Get project error:', error);
    return null;
  }

  return data as Project;
}
