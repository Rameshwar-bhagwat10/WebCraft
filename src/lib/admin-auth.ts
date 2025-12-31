/**
 * Admin Authentication Utilities
 * Server-side admin verification for API routes
 */

import { createServerSupabaseClient } from '@/lib/supabase/server';
import type { AdminRole } from '@/types/database';

export interface AdminSession {
  userId: string;
  email: string;
  role: AdminRole;
}

/**
 * Verify admin session and return admin info
 * Returns null if not authenticated or not an admin
 */
export async function verifyAdminSession(): Promise<AdminSession | null> {
  try {
    const supabase = await createServerSupabaseClient();

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return null;
    }

    // Check if user is admin
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
 * Check if admin has required role
 */
export function hasRole(
  session: AdminSession,
  requiredRoles: AdminRole[]
): boolean {
  return requiredRoles.includes(session.role);
}

/**
 * Create unauthorized response
 */
export function unauthorizedResponse(message = 'Unauthorized') {
  return Response.json(
    { success: false, error: message },
    { status: 401 }
  );
}

/**
 * Create forbidden response
 */
export function forbiddenResponse(message = 'Forbidden') {
  return Response.json(
    { success: false, error: message },
    { status: 403 }
  );
}
