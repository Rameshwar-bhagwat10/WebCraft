/**
 * Projects Types
 * Additional types for the projects system
 */

import type { ProjectCategory, ProjectStatus } from '@/types/database';

/**
 * Project filters for listing
 */
export interface ProjectFilters {
  category?: ProjectCategory;
  status?: ProjectStatus;
  featured?: boolean;
  limit?: number;
  offset?: number;
}

/**
 * Image upload result
 */
export interface ImageUploadResult {
  success: boolean;
  path?: string;
  error?: string;
}

/**
 * Allowed image formats
 */
export const ALLOWED_IMAGE_FORMATS = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/avif',
] as const;

export type AllowedImageFormat = (typeof ALLOWED_IMAGE_FORMATS)[number];

/**
 * Image constraints
 */
export const IMAGE_CONSTRAINTS = {
  maxFileSize: 5 * 1024 * 1024, // 5MB
  maxWidth: 4096,
  maxHeight: 4096,
  minWidth: 200,
  minHeight: 200,
} as const;

/**
 * Storage bucket name
 */
export const PROJECT_IMAGES_BUCKET = 'project-images';

/**
 * Project categories with labels
 */
export const PROJECT_CATEGORY_LABELS: Record<ProjectCategory, string> = {
  website: 'Website',
  webapp: 'Web Application',
  mobile: 'Mobile App',
  ecommerce: 'E-Commerce',
  dashboard: 'Dashboard',
  landing: 'Landing Page',
  other: 'Other',
};
