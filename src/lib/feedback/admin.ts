/**
 * Feedback Admin Backend
 * Server-side admin operations for visitor feedback
 */

import { createAdminClient } from '@/lib/supabase/server';
import type { VisitorFeedback } from '@/types/database';

/**
 * Feedback status type
 */
export type FeedbackStatus = 'pending' | 'approved' | 'rejected';

/**
 * Operation result
 */
export interface OperationResult<T = void> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * Get all feedback for admin (with optional status filter)
 */
export async function getAllFeedbackAdmin(
  status?: FeedbackStatus
): Promise<VisitorFeedback[]> {
  const supabase = createAdminClient();

  let query = supabase
    .from('visitor_feedback')
    .select('*')
    .order('created_at', { ascending: false });

  if (status) {
    query = query.eq('status', status);
  }

  const { data, error } = await query;

  if (error) {
    console.error('[Admin] Get all feedback error:', error);
    return [];
  }

  return (data ?? []) as VisitorFeedback[];
}

/**
 * Get feedback counts by status
 */
export interface FeedbackCounts {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
}

export async function getFeedbackCounts(): Promise<FeedbackCounts> {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from('visitor_feedback')
    .select('status');

  if (error) {
    console.error('[Admin] Get feedback counts error:', error);
    return { total: 0, pending: 0, approved: 0, rejected: 0 };
  }

  const counts = {
    total: data?.length ?? 0,
    pending: 0,
    approved: 0,
    rejected: 0,
  };

  data?.forEach((item: { status: string }) => {
    if (item.status === 'pending') counts.pending++;
    else if (item.status === 'approved') counts.approved++;
    else if (item.status === 'rejected') counts.rejected++;
  });

  return counts;
}

/**
 * Get feedback by ID
 */
export async function getFeedbackByIdAdmin(id: string): Promise<VisitorFeedback | null> {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from('visitor_feedback')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('[Admin] Get feedback error:', error);
    return null;
  }

  return data as VisitorFeedback;
}

/**
 * Update feedback status
 */
export async function updateFeedbackStatus(
  id: string,
  status: FeedbackStatus
): Promise<OperationResult<VisitorFeedback>> {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from('visitor_feedback')
    .update({ status } as never)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('[Admin] Update feedback status error:', error);
    return { success: false, error: error.message };
  }

  return { success: true, data: data as VisitorFeedback };
}

/**
 * Toggle featured status
 */
export async function toggleFeedbackFeatured(
  id: string,
  featured: boolean
): Promise<OperationResult<VisitorFeedback>> {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from('visitor_feedback')
    .update({ is_featured: featured } as never)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('[Admin] Toggle feedback featured error:', error);
    return { success: false, error: error.message };
  }

  return { success: true, data: data as VisitorFeedback };
}

/**
 * Delete feedback
 */
export async function deleteFeedback(id: string): Promise<OperationResult> {
  const supabase = createAdminClient();

  const { error } = await supabase
    .from('visitor_feedback')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('[Admin] Delete feedback error:', error);
    return { success: false, error: error.message };
  }

  return { success: true };
}
