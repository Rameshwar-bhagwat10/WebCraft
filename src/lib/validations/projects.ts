/**
 * Project Validation
 * Server-side validation for project data
 */

import type { ProjectCategory, ProjectStatus } from '@/types/database';

/**
 * Valid project categories
 */
const PROJECT_CATEGORIES: ProjectCategory[] = [
  'website',
  'webapp',
  'mobile',
  'ecommerce',
  'dashboard',
  'landing',
  'other',
];

/**
 * Valid project statuses
 */
const PROJECT_STATUSES: ProjectStatus[] = ['draft', 'published'];

/**
 * Slug regex pattern (lowercase, numbers, hyphens)
 */
const SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/**
 * URL regex pattern
 */
const URL_REGEX = /^https?:\/\/.+/;

/**
 * Validation result
 */
export interface ProjectValidationResult {
  success: boolean;
  errors?: Record<string, string>;
}

/**
 * Sanitize string input
 */
function sanitizeString(value: unknown): string {
  if (typeof value !== 'string') return '';
  return value.trim();
}

/**
 * Validate project create/update input
 */
export function validateProjectInput(
  data: Record<string, unknown>,
  isUpdate: boolean = false
): ProjectValidationResult {
  const errors: Record<string, string> = {};

  // Title
  if (!isUpdate || data.title !== undefined) {
    const title = sanitizeString(data.title);
    if (!title) {
      errors.title = 'Title is required';
    } else if (title.length > 100) {
      errors.title = 'Title must be 100 characters or less';
    }
  }

  // Slug
  if (!isUpdate || data.slug !== undefined) {
    const slug = sanitizeString(data.slug).toLowerCase();
    if (!slug) {
      errors.slug = 'Slug is required';
    } else if (slug.length > 100) {
      errors.slug = 'Slug must be 100 characters or less';
    } else if (!SLUG_REGEX.test(slug)) {
      errors.slug = 'Slug must contain only lowercase letters, numbers, and hyphens';
    }
  }

  // Short description
  if (!isUpdate || data.short_description !== undefined) {
    const shortDesc = sanitizeString(data.short_description);
    if (!shortDesc) {
      errors.short_description = 'Short description is required';
    } else if (shortDesc.length < 10) {
      errors.short_description = 'Short description must be at least 10 characters';
    } else if (shortDesc.length > 200) {
      errors.short_description = 'Short description must be 200 characters or less';
    }
  }

  // Full description
  if (!isUpdate || data.full_description !== undefined) {
    const fullDesc = sanitizeString(data.full_description);
    if (!fullDesc) {
      errors.full_description = 'Full description is required';
    } else if (fullDesc.length < 50) {
      errors.full_description = 'Full description must be at least 50 characters';
    } else if (fullDesc.length > 5000) {
      errors.full_description = 'Full description must be 5000 characters or less';
    }
  }

  // Category
  if (!isUpdate || data.category !== undefined) {
    const category = sanitizeString(data.category) as ProjectCategory;
    if (!PROJECT_CATEGORIES.includes(category)) {
      errors.category = 'Invalid project category';
    }
  }

  // Tech stack
  if (!isUpdate || data.tech_stack !== undefined) {
    if (!Array.isArray(data.tech_stack)) {
      errors.tech_stack = 'Tech stack must be an array';
    } else if (data.tech_stack.length > 20) {
      errors.tech_stack = 'Tech stack can have at most 20 items';
    } else {
      const invalidItems = data.tech_stack.filter(
        (item) => typeof item !== 'string' || item.length > 50
      );
      if (invalidItems.length > 0) {
        errors.tech_stack = 'Tech stack items must be strings of 50 characters or less';
      }
    }
  }

  // Status (optional)
  if (data.status !== undefined) {
    const status = sanitizeString(data.status) as ProjectStatus;
    if (!PROJECT_STATUSES.includes(status)) {
      errors.status = 'Invalid project status';
    }
  }

  // Priority (optional)
  if (data.priority !== undefined) {
    const priority = Number(data.priority);
    if (isNaN(priority) || priority < 0 || priority > 100) {
      errors.priority = 'Priority must be a number between 0 and 100';
    }
  }

  // Display order (optional)
  if (data.display_order !== undefined) {
    const order = Number(data.display_order);
    if (isNaN(order) || order < 0) {
      errors.display_order = 'Display order must be a non-negative number';
    }
  }

  // Live URL (optional)
  if (data.live_url !== undefined && data.live_url !== null && data.live_url !== '') {
    const url = sanitizeString(data.live_url);
    if (url.length > 500) {
      errors.live_url = 'URL must be 500 characters or less';
    } else if (!URL_REGEX.test(url)) {
      errors.live_url = 'Invalid URL format';
    }
  }

  // GitHub URL (optional)
  if (data.github_url !== undefined && data.github_url !== null && data.github_url !== '') {
    const url = sanitizeString(data.github_url);
    if (url.length > 500) {
      errors.github_url = 'URL must be 500 characters or less';
    } else if (!URL_REGEX.test(url)) {
      errors.github_url = 'Invalid URL format';
    }
  }

  // Meta title (optional)
  if (data.meta_title !== undefined && data.meta_title !== null && data.meta_title !== '') {
    const metaTitle = sanitizeString(data.meta_title);
    if (metaTitle.length > 70) {
      errors.meta_title = 'Meta title must be 70 characters or less';
    }
  }

  // Meta description (optional)
  if (
    data.meta_description !== undefined &&
    data.meta_description !== null &&
    data.meta_description !== ''
  ) {
    const metaDesc = sanitizeString(data.meta_description);
    if (metaDesc.length > 160) {
      errors.meta_description = 'Meta description must be 160 characters or less';
    }
  }

  if (Object.keys(errors).length > 0) {
    return { success: false, errors };
  }

  return { success: true };
}

/**
 * Validate image metadata input
 */
export function validateImageInput(
  data: Record<string, unknown>
): ProjectValidationResult {
  const errors: Record<string, string> = {};

  // Alt text
  const altText = sanitizeString(data.alt_text);
  if (!altText) {
    errors.alt_text = 'Alt text is required';
  } else if (altText.length > 200) {
    errors.alt_text = 'Alt text must be 200 characters or less';
  }

  // Display order (optional)
  if (data.display_order !== undefined) {
    const order = Number(data.display_order);
    if (isNaN(order) || order < 0) {
      errors.display_order = 'Display order must be a non-negative number';
    }
  }

  if (Object.keys(errors).length > 0) {
    return { success: false, errors };
  }

  return { success: true };
}

/**
 * Generate slug from title
 */
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
}
