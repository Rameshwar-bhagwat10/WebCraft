/**
 * Admin Audit Logging
 * Track admin actions for security and compliance
 */

import { headers } from 'next/headers';

import { createAdminClient } from '@/lib/supabase/server';

export type AuditAction =
  | 'login'
  | 'logout'
  | 'login_failed'
  | 'lead_view'
  | 'lead_status_update'
  | 'lead_notes_update'
  | 'settings_update'
  | 'admin_create'
  | 'admin_update'
  | 'admin_delete';

export type ResourceType =
  | 'auth'
  | 'lead'
  | 'admin'
  | 'settings'
  | 'newsletter'
  | 'chat';

interface AuditLogParams {
  adminId: string;
  action: AuditAction;
  resourceType: ResourceType;
  resourceId?: string;
  details?: Record<string, unknown>;
}

/**
 * Log an admin action
 */
export async function logAdminAction(params: AuditLogParams): Promise<void> {
  try {
    const headersList = await headers();
    const ipAddress = headersList.get('x-forwarded-for')?.split(',')[0]?.trim() 
      ?? headersList.get('x-real-ip') 
      ?? 'unknown';
    const userAgent = headersList.get('user-agent') ?? 'unknown';

    const supabase = createAdminClient();

    await supabase.rpc('log_admin_action' as never, {
      p_admin_id: params.adminId,
      p_action: params.action,
      p_resource_type: params.resourceType,
      p_resource_id: params.resourceId ?? null,
      p_details: params.details ?? null,
      p_ip_address: ipAddress,
      p_user_agent: userAgent,
    } as never);
  } catch (error) {
    // Don't fail the request if audit logging fails
    console.error('Audit log error:', error);
  }
}

/**
 * Log successful login
 */
export async function logLogin(adminId: string, email: string): Promise<void> {
  await logAdminAction({
    adminId,
    action: 'login',
    resourceType: 'auth',
    details: { email },
  });
}

/**
 * Log failed login attempt
 */
export async function logFailedLogin(email: string, reason: string): Promise<void> {
  // Use a placeholder ID for failed logins
  const supabase = createAdminClient();
  const headersList = await headers();
  const ipAddress = headersList.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';

  try {
    // Insert directly since we don't have an admin_id
    await supabase.from('admin_audit_logs').insert({
      admin_id: '00000000-0000-0000-0000-000000000000', // Placeholder
      action: 'login_failed',
      resource_type: 'auth',
      details: { email, reason },
      ip_address: ipAddress,
      user_agent: headersList.get('user-agent') ?? 'unknown',
    } as never);
  } catch (error) {
    console.error('Failed login audit error:', error);
  }
}

/**
 * Log logout
 */
export async function logLogout(adminId: string): Promise<void> {
  await logAdminAction({
    adminId,
    action: 'logout',
    resourceType: 'auth',
  });
}
