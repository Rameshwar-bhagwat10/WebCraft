/**
 * Application-wide constants
 * Centralized location for magic values
 */

// Site metadata
export const SITE_CONFIG = {
  name: 'WebCraft',
  description: 'Professional web development services',
  url: process.env.NEXT_PUBLIC_APP_URL ?? 'https://webcraft.com',
} as const;

// Navigation (placeholder for Phase 2+)
export const NAV_ITEMS = [] as const;

// API endpoints
export const API_ROUTES = {
  health: '/api/health',
} as const;

// Revalidation times (in seconds)
export const REVALIDATE = {
  static: false, // Never revalidate (static)
  short: 60, // 1 minute
  medium: 300, // 5 minutes
  long: 3600, // 1 hour
  day: 86400, // 24 hours
} as const;

// Breakpoints (matching Tailwind defaults)
export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;
