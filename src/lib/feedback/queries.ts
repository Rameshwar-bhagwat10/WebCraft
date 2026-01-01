/**
 * Feedback Queries
 * Server-side data access for visitor feedback
 */

import { createAdminClient } from '@/lib/supabase/server';
import type { VisitorFeedback } from '@/types/database';

/**
 * Get approved feedback for public display
 */
export async function getApprovedFeedback(limit: number = 10): Promise<VisitorFeedback[]> {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from('visitor_feedback')
    .select('id, name, message, rating, created_at')
    .eq('status', 'approved')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('[Feedback] Approved query error:', error);
    return [];
  }

  return (data ?? []) as VisitorFeedback[];
}

/**
 * Get featured feedback for homepage
 */
export async function getFeaturedFeedback(limit: number = 6): Promise<VisitorFeedback[]> {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from('visitor_feedback')
    .select('id, name, message, rating, created_at')
    .eq('status', 'approved')
    .eq('is_featured', true)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('[Feedback] Featured query error:', error);
    return [];
  }

  return (data ?? []) as VisitorFeedback[];
}

/**
 * Submit new feedback (public)
 */
export interface SubmitFeedbackInput {
  name: string;
  email?: string | null;
  message: string;
  rating: number;
  ip_address?: string | null;
  user_agent?: string | null;
}

export interface SubmitResult {
  success: boolean;
  error?: string;
}

export async function submitFeedback(input: SubmitFeedbackInput): Promise<SubmitResult> {
  const supabase = createAdminClient();

  const { error } = await supabase
    .from('visitor_feedback')
    .insert({
      name: input.name,
      email: input.email ?? null,
      message: input.message,
      rating: input.rating,
      ip_address: input.ip_address ?? null,
      user_agent: input.user_agent ?? null,
      status: 'pending',
    } as never);

  if (error) {
    console.error('[Feedback] Submit error:', error);
    return { success: false, error: error.message };
  }

  return { success: true };
}
