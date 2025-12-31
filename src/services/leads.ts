/**
 * Lead Management Service
 * Server-side lead operations with status validation
 *
 * Phase 13: Full lead lifecycle management
 */

import { createAdminClient, createServerSupabaseClient } from '@/lib/supabase/server';
import type {
  ContactStatus,
  ContactSubmission,
  LeadSource,
} from '@/types/database';
import { VALID_STATUS_TRANSITIONS } from '@/types/database';

/**
 * Unified lead type for combined views
 */
export interface UnifiedLead {
  id: string;
  type: 'contact' | 'calculator';
  name: string;
  email: string;
  phone?: string | null;
  project_type: string;
  status: string;
  lead_source: LeadSource;
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
  // Contact-specific
  message?: string;
  // Calculator-specific
  estimated_min?: number;
  estimated_max?: number;
  timeline?: string;
  features?: string[];
}

/**
 * Lead filter options
 */
export interface LeadFilters {
  status?: string | undefined;
  source?: LeadSource | undefined;
  search?: string | undefined;
  startDate?: string | undefined;
  endDate?: string | undefined;
}

/**
 * Pagination options
 */
export interface PaginationOptions {
  page: number;
  perPage: number;
}

/**
 * Validate status transition
 */
export function isValidStatusTransition(
  currentStatus: ContactStatus,
  newStatus: ContactStatus
): boolean {
  const allowedTransitions = VALID_STATUS_TRANSITIONS[currentStatus];
  return allowedTransitions.includes(newStatus);
}

/**
 * Get all contact leads with filters and pagination
 */
export async function getContactLeads(
  filters: LeadFilters = {},
  pagination: PaginationOptions = { page: 1, perPage: 20 }
): Promise<{ data: ContactSubmission[]; total: number }> {
  const supabase = await createServerSupabaseClient();
  const { page, perPage } = pagination;

  let query = supabase
    .from('contact_submissions')
    .select('id, name, email, phone, project_type, message, status, lead_source, admin_notes, created_at, updated_at', { count: 'exact' })
    .order('created_at', { ascending: false });

  // Apply filters
  if (filters.status && filters.status !== 'all') {
    query = query.eq('status', filters.status);
  }
  if (filters.source) {
    query = query.eq('lead_source', filters.source);
  }
  if (filters.search) {
    query = query.or(`name.ilike.%${filters.search}%,email.ilike.%${filters.search}%`);
  }
  if (filters.startDate) {
    query = query.gte('created_at', filters.startDate);
  }
  if (filters.endDate) {
    query = query.lte('created_at', filters.endDate);
  }

  // Apply pagination
  query = query.range((page - 1) * perPage, page * perPage - 1);

  const { data, count, error } = await query;

  if (error) {
    console.error('Error fetching contact leads:', error);
    return { data: [], total: 0 };
  }

  return {
    data: (data as ContactSubmission[]) ?? [],
    total: count ?? 0,
  };
}

/**
 * Get single contact lead by ID
 */
export async function getContactLeadById(
  id: string
): Promise<ContactSubmission | null> {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from('contact_submissions')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching contact lead:', error);
    return null;
  }

  return data as ContactSubmission;
}

/**
 * Update contact lead status with validation
 */
export async function updateContactStatus(
  id: string,
  newStatus: ContactStatus
): Promise<{ success: boolean; error?: string }> {
  const supabase = createAdminClient();

  // Get current status
  const { data: current, error: fetchError } = await supabase
    .from('contact_submissions')
    .select('status')
    .eq('id', id)
    .single();

  if (fetchError || !current) {
    return { success: false, error: 'Lead not found' };
  }

  const currentStatus = (current as { status: ContactStatus }).status;

  // Validate transition
  if (!isValidStatusTransition(currentStatus, newStatus)) {
    return {
      success: false,
      error: `Invalid status transition from "${currentStatus}" to "${newStatus}"`,
    };
  }

  // Update status
  const { error: updateError } = await supabase
    .from('contact_submissions')
    .update({ status: newStatus } as never)
    .eq('id', id);

  if (updateError) {
    console.error('Error updating status:', updateError);
    return { success: false, error: 'Failed to update status' };
  }

  return { success: true };
}

/**
 * Update contact lead notes
 */
export async function updateContactNotes(
  id: string,
  notes: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = createAdminClient();

  const { error } = await supabase
    .from('contact_submissions')
    .update({ admin_notes: notes } as never)
    .eq('id', id);

  if (error) {
    console.error('Error updating notes:', error);
    return { success: false, error: 'Failed to update notes' };
  }

  return { success: true };
}

/**
 * Get lead statistics for dashboard
 */
export async function getLeadStatistics(): Promise<{
  total: number;
  byStatus: Record<string, number>;
  bySource: Record<string, number>;
  recentCount: number;
}> {
  const supabase = await createServerSupabaseClient();

  // Get contact submissions stats
  const { data: contacts, count: contactCount } = await supabase
    .from('contact_submissions')
    .select('status, lead_source, created_at', { count: 'exact' });

  // Get calculator submissions stats
  const { data: calculators, count: calcCount } = await supabase
    .from('calculator_submissions')
    .select('status, lead_source, created_at', { count: 'exact' });

  const total = (contactCount ?? 0) + (calcCount ?? 0);

  // Count by status
  const byStatus: Record<string, number> = {};
  const bySource: Record<string, number> = {};
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  let recentCount = 0;

  // Process contacts
  (contacts ?? []).forEach((c) => {
    const contact = c as { status: string; lead_source: string; created_at: string };
    byStatus[contact.status] = (byStatus[contact.status] ?? 0) + 1;
    bySource[contact.lead_source ?? 'contact'] = (bySource[contact.lead_source ?? 'contact'] ?? 0) + 1;
    if (new Date(contact.created_at) > sevenDaysAgo) recentCount++;
  });

  // Process calculators
  (calculators ?? []).forEach((c) => {
    const calc = c as { status: string; lead_source: string; created_at: string };
    byStatus[calc.status] = (byStatus[calc.status] ?? 0) + 1;
    bySource[calc.lead_source ?? 'calculator'] = (bySource[calc.lead_source ?? 'calculator'] ?? 0) + 1;
    if (new Date(calc.created_at) > sevenDaysAgo) recentCount++;
  });

  return { total, byStatus, bySource, recentCount };
}
