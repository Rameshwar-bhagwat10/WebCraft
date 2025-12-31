/**
 * Audit Log Service
 * Server-side audit log operations
 */

import { createServerSupabaseClient } from '@/lib/supabase/server';

export interface AuditLogEntry {
  id: string;
  admin_id: string;
  action: string;
  resource_type: string;
  resource_id: string | null;
  details: Record<string, unknown> | null;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
  // Joined admin info
  admin_email?: string;
}

export interface AuditLogFilters {
  action?: string | undefined;
  resourceType?: string | undefined;
  adminId?: string | undefined;
  startDate?: string | undefined;
  endDate?: string | undefined;
}

export interface PaginationOptions {
  page: number;
  perPage: number;
}

/**
 * Get audit logs with filters and pagination
 * Only accessible by super_admin
 */
export async function getAuditLogs(
  filters: AuditLogFilters = {},
  pagination: PaginationOptions = { page: 1, perPage: 50 }
): Promise<{ data: AuditLogEntry[]; total: number }> {
  const supabase = await createServerSupabaseClient();
  const { page, perPage } = pagination;

  // Build query with explicit columns
  let query = supabase
    .from('admin_audit_logs')
    .select('id, admin_id, action, resource_type, resource_id, details, ip_address, user_agent, created_at', { count: 'exact' })
    .order('created_at', { ascending: false });

  // Apply filters
  if (filters.action) {
    query = query.eq('action', filters.action);
  }
  if (filters.resourceType) {
    query = query.eq('resource_type', filters.resourceType);
  }
  if (filters.adminId) {
    query = query.eq('admin_id', filters.adminId);
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
    console.error('Error fetching audit logs:', error);
    return { data: [], total: 0 };
  }

  // Get admin emails for display
  const logs = (data as AuditLogEntry[]) ?? [];
  const adminIds = [...new Set(logs.map((l) => l.admin_id))];

  if (adminIds.length > 0) {
    const { data: admins } = await supabase
      .from('admin_users')
      .select('id, email')
      .in('id', adminIds);

    const adminMap = new Map((admins as { id: string; email: string }[] ?? []).map((a) => [a.id, a.email]));

    logs.forEach((log) => {
      log.admin_email = adminMap.get(log.admin_id) ?? 'Unknown';
    });
  }

  return {
    data: logs,
    total: count ?? 0,
  };
}

/**
 * Get unique action types for filter dropdown
 */
export async function getAuditActionTypes(): Promise<string[]> {
  const supabase = await createServerSupabaseClient();

  const { data } = await supabase
    .from('admin_audit_logs')
    .select('action')
    .limit(100);

  const actions = new Set((data as { action: string }[] ?? []).map((d) => d.action));
  return Array.from(actions).sort();
}

/**
 * Get unique resource types for filter dropdown
 */
export async function getAuditResourceTypes(): Promise<string[]> {
  const supabase = await createServerSupabaseClient();

  const { data } = await supabase
    .from('admin_audit_logs')
    .select('resource_type')
    .limit(100);

  const types = new Set((data as { resource_type: string }[] ?? []).map((d) => d.resource_type));
  return Array.from(types).sort();
}
