/**
 * Projects Queries
 * Server-side data access for projects
 *
 * Performance optimized:
 * - Explicit column selection (no SELECT *)
 * - Uses indexes for hot paths
 * - Avoids N+1 queries
 * - Lightweight featured projects query
 */

import { createAdminClient } from '@/lib/supabase/server';
import type {
  FeaturedProject,
  ProjectCategory,
  ProjectListItem,
  ProjectWithImages,
} from '@/types/database';

import type { ProjectFilters } from './types';

/**
 * Get featured projects for Home page
 * Optimized: Uses index, minimal columns, single query with join
 * Target: < 150ms
 */
export async function getFeaturedProjects(
  limit: number = 3
): Promise<FeaturedProject[]> {
  const supabase = createAdminClient();

  // First get featured projects
  const { data: projects, error: projectsError } = await supabase
    .from('projects')
    .select('id, title, slug, short_description, category, tech_stack')
    .eq('status', 'published')
    .eq('is_featured', true)
    .is('deleted_at', null)
    .order('priority', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(limit);

  if (projectsError || !projects) {
    console.error('[Projects] Featured query error:', projectsError);
    return [];
  }

  // Get cover images for these projects
  const projectIds = projects.map((p) => (p as { id: string }).id);
  const { data: images } = await supabase
    .from('project_images')
    .select('project_id, storage_path, alt_text')
    .in('project_id', projectIds)
    .eq('is_cover', true);

  const imageMap = new Map<string, { storage_path: string; alt_text: string }>();
  for (const img of (images ?? []) as Array<{
    project_id: string;
    storage_path: string;
    alt_text: string;
  }>) {
    imageMap.set(img.project_id, img);
  }

  // Transform to FeaturedProject type
  return projects.map((project) => {
    const p = project as {
      id: string;
      title: string;
      slug: string;
      short_description: string;
      category: ProjectCategory;
      tech_stack: string[];
    };
    const coverImage = imageMap.get(p.id);

    return {
      id: p.id,
      title: p.title,
      slug: p.slug,
      short_description: p.short_description,
      category: p.category,
      tech_stack: p.tech_stack ?? [],
      cover_image_path: coverImage?.storage_path ?? null,
      cover_image_alt: coverImage?.alt_text ?? null,
    };
  });
}

/**
 * Get all published projects for Work page
 * Target: < 200ms
 */
export async function getPublishedProjects(
  filters?: ProjectFilters
): Promise<ProjectListItem[]> {
  const supabase = createAdminClient();

  let query = supabase
    .from('projects')
    .select('id, title, slug, short_description, category, tech_stack')
    .eq('status', 'published')
    .is('deleted_at', null);

  // Apply category filter
  if (filters?.category) {
    query = query.eq('category', filters.category);
  }

  // Apply ordering
  query = query
    .order('display_order', { ascending: true })
    .order('created_at', { ascending: false });

  // Apply pagination
  if (filters?.limit) {
    query = query.limit(filters.limit);
  }
  if (filters?.offset) {
    query = query.range(filters.offset, filters.offset + (filters.limit ?? 10) - 1);
  }

  const { data: projects, error } = await query;

  if (error || !projects) {
    console.error('[Projects] List query error:', error);
    return [];
  }

  // Get cover images for these projects
  const projectIds = projects.map((p) => (p as { id: string }).id);
  
  if (projectIds.length === 0) {
    return [];
  }

  const { data: images } = await supabase
    .from('project_images')
    .select('project_id, storage_path, alt_text')
    .in('project_id', projectIds)
    .eq('is_cover', true);

  const imageMap = new Map<string, { storage_path: string; alt_text: string }>();
  for (const img of (images ?? []) as Array<{
    project_id: string;
    storage_path: string;
    alt_text: string;
  }>) {
    imageMap.set(img.project_id, img);
  }

  // Transform to ProjectListItem type
  return projects.map((project) => {
    const p = project as {
      id: string;
      title: string;
      slug: string;
      short_description: string;
      category: ProjectCategory;
      tech_stack: string[];
    };
    const coverImage = imageMap.get(p.id);

    return {
      id: p.id,
      title: p.title,
      slug: p.slug,
      short_description: p.short_description,
      category: p.category,
      tech_stack: p.tech_stack ?? [],
      cover_image_path: coverImage?.storage_path ?? null,
      cover_image_alt: coverImage?.alt_text ?? null,
    };
  });
}

/**
 * Get single project by slug with all images
 * Target: < 200ms
 */
export async function getProjectBySlug(
  slug: string
): Promise<ProjectWithImages | null> {
  const supabase = createAdminClient();

  // Get project
  const { data: project, error } = await supabase
    .from('projects')
    .select(
      'id, title, slug, short_description, full_description, category, tech_stack, live_url, github_url, meta_title, meta_description, published_at, created_at, updated_at, status, is_featured, priority, display_order, deleted_at'
    )
    .eq('slug', slug)
    .eq('status', 'published')
    .is('deleted_at', null)
    .single();

  if (error || !project) {
    if (error?.code !== 'PGRST116') {
      // Not a "not found" error
      console.error('[Projects] Detail query error:', error);
    }
    return null;
  }

  const p = project as {
    id: string;
    title: string;
    slug: string;
    short_description: string;
    full_description: string;
    category: ProjectCategory;
    tech_stack: string[];
    live_url: string | null;
    github_url: string | null;
    meta_title: string | null;
    meta_description: string | null;
    published_at: string | null;
    created_at: string;
    updated_at: string;
    status: string;
    is_featured: boolean;
    priority: number;
    display_order: number;
    deleted_at: string | null;
  };

  // Get images
  const { data: images } = await supabase
    .from('project_images')
    .select('id, storage_path, alt_text, is_cover, display_order, width, height, file_size, created_at')
    .eq('project_id', p.id)
    .order('display_order', { ascending: true });

  const projectImages = ((images ?? []) as Array<{
    id: string;
    storage_path: string;
    alt_text: string;
    is_cover: boolean;
    display_order: number;
    width: number | null;
    height: number | null;
    file_size: number | null;
    created_at: string;
  }>).map((img) => ({
    id: img.id,
    project_id: p.id,
    storage_path: img.storage_path,
    alt_text: img.alt_text,
    is_cover: img.is_cover,
    display_order: img.display_order,
    width: img.width,
    height: img.height,
    file_size: img.file_size,
    created_at: img.created_at,
  }));

  return {
    id: p.id,
    title: p.title,
    slug: p.slug,
    short_description: p.short_description,
    full_description: p.full_description,
    category: p.category,
    tech_stack: p.tech_stack,
    live_url: p.live_url,
    github_url: p.github_url,
    meta_title: p.meta_title,
    meta_description: p.meta_description,
    published_at: p.published_at,
    created_at: p.created_at,
    updated_at: p.updated_at,
    status: p.status as 'draft' | 'published',
    is_featured: p.is_featured,
    priority: p.priority,
    display_order: p.display_order,
    deleted_at: p.deleted_at,
    images: projectImages,
  };
}

/**
 * Get project count by category
 */
export async function getProjectCountByCategory(): Promise<
  Record<ProjectCategory, number>
> {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from('projects')
    .select('category')
    .eq('status', 'published')
    .is('deleted_at', null);

  if (error) {
    console.error('[Projects] Count query error:', error);
    return {
      website: 0,
      webapp: 0,
      mobile: 0,
      ecommerce: 0,
      dashboard: 0,
      landing: 0,
      other: 0,
    };
  }

  const counts: Record<ProjectCategory, number> = {
    website: 0,
    webapp: 0,
    mobile: 0,
    ecommerce: 0,
    dashboard: 0,
    landing: 0,
    other: 0,
  };

  for (const row of (data ?? []) as Array<{ category: ProjectCategory }>) {
    counts[row.category] = (counts[row.category] ?? 0) + 1;
  }

  return counts;
}

/**
 * Check if slug exists (for admin validation)
 */
export async function isSlugAvailable(
  slug: string,
  excludeId?: string
): Promise<boolean> {
  const supabase = createAdminClient();

  let query = supabase
    .from('projects')
    .select('id')
    .eq('slug', slug)
    .is('deleted_at', null);

  if (excludeId) {
    query = query.neq('id', excludeId);
  }

  const { data } = await query.limit(1);

  return !data || data.length === 0;
}

/**
 * Get all project slugs (for static generation)
 */
export async function getAllProjectSlugs(): Promise<string[]> {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from('projects')
    .select('slug')
    .eq('status', 'published')
    .is('deleted_at', null);

  if (error) {
    console.error('[Projects] Slugs query error:', error);
    return [];
  }

  return ((data ?? []) as Array<{ slug: string }>).map((row) => row.slug);
}
