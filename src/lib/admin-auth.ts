/**
 * Admin Authentication Utilities
 * Server-side admin verification for API routes
 *
 * Re-exports from auth module for backward compatibility
 */

import type { AdminRole } from '@/types/database';
import {
  getAdminSession,
  hasPermission,
  meetsRoleRequirement,
  type AdminSession,
} from './auth';

// Re-export types and functions
export type { AdminSession };
export { getAdminSession, hasPermission, meetsRoleRequirement };

/**
 * Verify admin session and return admin info
 * Returns null if not authenticated or not an admin
 */
export async function verifyAdminSession(): Promise<AdminSession | null> {
  return getAdminSession();
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

/**
 * Require permission for API route
 */
export async function requireApiPermission(
  permission: string
): Promise<{ session: AdminSession } | Response> {
  const session = await getAdminSession();

  if (!session) {
    return unauthorizedResponse();
  }

  if (!hasPermission(session.role, permission)) {
    return forbiddenResponse('Insufficient permissions');
  }

  return { session };
}
