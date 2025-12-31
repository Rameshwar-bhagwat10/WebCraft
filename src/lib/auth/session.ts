/**
 * Session Management
 * Server-side session handling for admin authentication
 */

import { createServerSupabaseClient } from '@/lib/supabase/server';
import type { AdminRole } from '@/types/database';

import { hasPermission, meetsRoleRequirement } from './config';

export interface AdminSession {
  userId: string;
  email: string;
  role: AdminRole;
}

/**
 * Get current admin session
 * Returns null if not authenticated or not an admin
 */
export async function getAdminSession(): Promise<AdminSession | null> {
  try {
    const supabase = await createServerSupabaseClient();

    // Get current user from Supabase Auth
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return null;
    }

    // Verify user is an admin
    const { data: adminUser, error: adminError } = await supabase
      .from('admin_users')
      .select('id, email, role')
      .eq('id', user.id)
      .single();

    if (adminError || !adminUser) {
      return null;
    }

    const admin = adminUser as { id: string; email: string; role: AdminRole };

    return {
      userId: admin.id,
      email: admin.email,
      role: admin.role,
    };
  } catch {
    return null;
  }
}

/**
 * Require admin session - throws if not authenticated
 */
export async function requireAdminSession(): Promise<AdminSession> {
  const session = await getAdminSession();
  
  if (!session) {
    throw new Error('Unauthorized');
  }
  
  return session;
}

/**
 * Require specific role
 */
export async function requireRole(requiredRole: AdminRole): Promise<AdminSession> {
  const session = await requireAdminSession();
  
  if (!meetsRoleRequirement(session.role, requiredRole)) {
    throw new Error('Forbidden');
  }
  
  return session;
}

/**
 * Require specific permission
 */
export async function requirePermission(permission: string): Promise<AdminSession> {
  const session = await requireAdminSession();
  
  if (!hasPermission(session.role, permission)) {
    throw new Error('Forbidden');
  }
  
  return session;
}

/**
 * Check if current user has permission (non-throwing)
 */
export async function checkPermission(permission: string): Promise<boolean> {
  const session = await getAdminSession();
  
  if (!session) {
    return false;
  }
  
  return hasPermission(session.role, permission);
}
