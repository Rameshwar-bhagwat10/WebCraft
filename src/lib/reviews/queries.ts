/**
 * Reviews Queries
 * Server-side data access for client reviews
 * 
 * Performance: Cached queries for home page (60s revalidation)
 */

import { unstable_cache } from 'next/cache';

import { createAdminClient } from '@/lib/supabase/server';
import type { ClientReview, ClientReviewWithProject } from '@/types/database';

/**
 * Internal: Fetch featured reviews from database
 */
async function fetchFeaturedReviews(limit: number): Promise<ClientReviewWithProject[]> {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from('client_reviews')
    .select(`
      id, project_id, client_name, client_role, client_company, 
      client_avatar_url, review_text, rating, is_featured, 
      is_published, display_order, created_at, updated_at, published_at,
      projects:project_id (title, slug)
    `)
    .eq('is_published', true)
    .eq('is_featured', true)
    .order('display_order', { ascending: true })
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('[Reviews] Featured query error:', error);
    return [];
  }

  return (data ?? []).map((row) => {
    const r = row as {
      id: string;
      project_id: string | null;
      client_name: string;
      client_role: string | null;
      client_company: string | null;
      client_avatar_url: string | null;
      review_text: string;
      rating: number | null;
      is_featured: boolean;
      is_published: boolean;
      display_order: number;
      created_at: string;
      updated_at: string;
      published_at: string | null;
      projects: { title: string; slug: string } | null;
    };

    return {
      id: r.id,
      project_id: r.project_id,
      client_name: r.client_name,
      client_role: r.client_role,
      client_company: r.client_company,
      client_avatar_url: r.client_avatar_url,
      review_text: r.review_text,
      rating: r.rating,
      is_featured: r.is_featured,
      is_published: r.is_published,
      display_order: r.display_order,
      created_at: r.created_at,
      updated_at: r.updated_at,
      published_at: r.published_at,
      project_title: r.projects?.title ?? null,
      project_slug: r.projects?.slug ?? null,
    };
  });
}

/**
 * Get featured reviews for home page testimonials (CACHED)
 * Revalidates every 60 seconds
 */
export const getFeaturedReviews = unstable_cache(
  async (limit: number = 6) => fetchFeaturedReviews(limit),
  ['featured-reviews'],
  { revalidate: 60, tags: ['reviews'] }
);

/**
 * Get review for a specific project
 */
export async function getProjectReview(projectId: string): Promise<ClientReview | null> {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from('client_reviews')
    .select('*')
    .eq('project_id', projectId)
    .eq('is_published', true)
    .order('display_order', { ascending: true })
    .limit(1)
    .single();

  if (error) {
    if (error.code !== 'PGRST116') {
      console.error('[Reviews] Project review query error:', error);
    }
    return null;
  }

  return data as ClientReview;
}

/**
 * Get all published reviews
 */
export async function getPublishedReviews(): Promise<ClientReviewWithProject[]> {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from('client_reviews')
    .select(`
      id, project_id, client_name, client_role, client_company, 
      client_avatar_url, review_text, rating, is_featured, 
      is_published, display_order, created_at, updated_at, published_at,
      projects:project_id (title, slug)
    `)
    .eq('is_published', true)
    .order('display_order', { ascending: true })
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[Reviews] Published query error:', error);
    return [];
  }

  return (data ?? []).map((row) => {
    const r = row as {
      id: string;
      project_id: string | null;
      client_name: string;
      client_role: string | null;
      client_company: string | null;
      client_avatar_url: string | null;
      review_text: string;
      rating: number | null;
      is_featured: boolean;
      is_published: boolean;
      display_order: number;
      created_at: string;
      updated_at: string;
      published_at: string | null;
      projects: { title: string; slug: string } | null;
    };

    return {
      id: r.id,
      project_id: r.project_id,
      client_name: r.client_name,
      client_role: r.client_role,
      client_company: r.client_company,
      client_avatar_url: r.client_avatar_url,
      review_text: r.review_text,
      rating: r.rating,
      is_featured: r.is_featured,
      is_published: r.is_published,
      display_order: r.display_order,
      created_at: r.created_at,
      updated_at: r.updated_at,
      published_at: r.published_at,
      project_title: r.projects?.title ?? null,
      project_slug: r.projects?.slug ?? null,
    };
  });
}
