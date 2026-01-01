/**
 * Reviews Admin Backend
 * Server-side admin operations for client reviews
 */

import { createAdminClient } from '@/lib/supabase/server';
import type { ClientReview } from '@/types/database';

/**
 * Review create input
 */
export interface CreateReviewInput {
  project_id?: string | null;
  client_name: string;
  client_role?: string | null;
  client_company?: string | null;
  client_avatar_url?: string | null;
  review_text: string;
  rating?: number | null;
  is_featured?: boolean;
  is_published?: boolean;
  display_order?: number;
}

/**
 * Review update input
 */
export interface UpdateReviewInput {
  project_id?: string | null | undefined;
  client_name?: string | undefined;
  client_role?: string | null | undefined;
  client_company?: string | null | undefined;
  client_avatar_url?: string | null | undefined;
  review_text?: string | undefined;
  rating?: number | null | undefined;
  is_featured?: boolean | undefined;
  is_published?: boolean | undefined;
  display_order?: number | undefined;
}

/**
 * Operation result
 */
export interface OperationResult<T = void> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * Get all reviews for admin
 */
export async function getAllReviewsAdmin(): Promise<ClientReview[]> {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from('client_reviews')
    .select('*')
    .order('display_order', { ascending: true })
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[Admin] Get all reviews error:', error);
    return [];
  }

  return (data ?? []) as ClientReview[];
}

/**
 * Get review by ID for admin
 */
export async function getReviewByIdAdmin(id: string): Promise<ClientReview | null> {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from('client_reviews')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('[Admin] Get review error:', error);
    return null;
  }

  return data as ClientReview;
}

/**
 * Get review for a project (admin)
 */
export async function getProjectReviewAdmin(projectId: string): Promise<ClientReview | null> {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from('client_reviews')
    .select('*')
    .eq('project_id', projectId)
    .limit(1)
    .single();

  if (error) {
    if (error.code !== 'PGRST116') {
      console.error('[Admin] Get project review error:', error);
    }
    return null;
  }

  return data as ClientReview;
}

/**
 * Create a new review
 */
export async function createReview(
  input: CreateReviewInput
): Promise<OperationResult<ClientReview>> {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from('client_reviews')
    .insert({
      project_id: input.project_id ?? null,
      client_name: input.client_name,
      client_role: input.client_role ?? null,
      client_company: input.client_company ?? null,
      client_avatar_url: input.client_avatar_url ?? null,
      review_text: input.review_text,
      rating: input.rating ?? null,
      is_featured: input.is_featured ?? false,
      is_published: input.is_published ?? false,
      display_order: input.display_order ?? 0,
    } as never)
    .select()
    .single();

  if (error) {
    console.error('[Admin] Create review error:', error);
    return { success: false, error: error.message };
  }

  return { success: true, data: data as ClientReview };
}

/**
 * Update a review
 */
export async function updateReview(
  id: string,
  input: UpdateReviewInput
): Promise<OperationResult<ClientReview>> {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from('client_reviews')
    .update(input as never)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('[Admin] Update review error:', error);
    return { success: false, error: error.message };
  }

  return { success: true, data: data as ClientReview };
}

/**
 * Delete a review
 */
export async function deleteReview(id: string): Promise<OperationResult> {
  const supabase = createAdminClient();

  const { error } = await supabase
    .from('client_reviews')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('[Admin] Delete review error:', error);
    return { success: false, error: error.message };
  }

  return { success: true };
}

/**
 * Toggle featured status
 */
export async function toggleReviewFeatured(
  id: string,
  featured: boolean
): Promise<OperationResult<ClientReview>> {
  return updateReview(id, { is_featured: featured });
}

/**
 * Toggle published status
 */
export async function toggleReviewPublished(
  id: string,
  published: boolean
): Promise<OperationResult<ClientReview>> {
  return updateReview(id, { is_published: published });
}
