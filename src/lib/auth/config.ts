/**
 * Authentication Configuration
 * Centralized auth settings for the application
 */

import type { AdminRole } from '@/types/database';

/**
 * Auth rate limiting configuration
 */
export const AUTH_RATE_LIMITS = {
  login: {
    maxAttempts: 5,
    windowMinutes: 15,
    lockoutMinutes: 30,
  },
  passwordReset: {
    maxAttempts: 3,
    windowMinutes: 60,
    lockoutMinutes: 60,
  },
} as const;

/**
 * Session configuration
 */
export const SESSION_CONFIG = {
  // Session expires after 8 hours of inactivity
  maxAge: 8 * 60 * 60,
  // Refresh session if less than 1 hour remaining
  refreshThreshold: 60 * 60,
} as const;

/**
 * Role hierarchy - higher index = more permissions
 */
export const ROLE_HIERARCHY: AdminRole[] = ['viewer', 'admin', 'super_admin'];

/**
 * Role permissions matrix
 */
export const ROLE_PERMISSIONS: Record<AdminRole, string[]> = {
  viewer: [
    'leads:read',
    'stats:read',
  ],
  admin: [
    'leads:read',
    'leads:update',
    'leads:notes',
    'stats:read',
    'newsletter:read',
    'chat:read',
    'chat:respond',
  ],
  super_admin: [
    'leads:read',
    'leads:update',
    'leads:delete',
    'leads:notes',
    'stats:read',
    'newsletter:read',
    'newsletter:manage',
    'chat:read',
    'chat:respond',
    'admin:manage',
    'audit:read',
    'settings:manage',
  ],
} as const;

/**
 * Check if role has permission
 */
export function hasPermission(role: AdminRole, permission: string): boolean {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}

/**
 * Check if role meets minimum required role
 */
export function meetsRoleRequirement(
  userRole: AdminRole,
  requiredRole: AdminRole
): boolean {
  const userIndex = ROLE_HIERARCHY.indexOf(userRole);
  const requiredIndex = ROLE_HIERARCHY.indexOf(requiredRole);
  return userIndex >= requiredIndex;
}
