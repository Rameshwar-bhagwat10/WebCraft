/**
 * Shared TypeScript types
 * Central location for application-wide type definitions
 */

// Generic API response wrapper
export type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: string;
};

// Health check response
export type HealthCheckResponse = {
  status: 'healthy' | 'degraded' | 'unhealthy';
  version: string;
  timestamp: string;
};

// Common component props
export type WithClassName = {
  className?: string;
};

export type WithChildren = {
  children: React.ReactNode;
};

// Page params for dynamic routes (Next.js 15+)
export type PageParams<
  T extends Record<string, string> = Record<string, string>,
> = {
  params: Promise<T>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};
