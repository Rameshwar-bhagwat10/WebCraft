/**
 * Form Validation Schemas
 * Server-side validation for all form submissions
 *
 * Security:
 * - Never trust client-side validation
 * - Sanitize all inputs
 * - Validate types and constraints
 */

import type { ProjectType } from '@/types/database';

/**
 * Validation result type
 */
export interface ValidationResult<T> {
  success: boolean;
  data?: T;
  errors?: Record<string, string>;
}

/**
 * Valid project types
 */
const PROJECT_TYPES: ProjectType[] = [
  'website',
  'webapp',
  'mobile',
  'dashboard',
  'maintenance',
  'other',
];

/**
 * Email regex pattern
 */
const EMAIL_REGEX = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

/**
 * Sanitize string input
 */
function sanitizeString(value: unknown): string {
  if (typeof value !== 'string') return '';
  return value.trim().slice(0, 10000); // Max 10k chars
}

/**
 * Validate email format
 */
function isValidEmail(email: string): boolean {
  return EMAIL_REGEX.test(email);
}

/**
 * Check honeypot field (spam protection)
 */
export function isHoneypotTriggered(data: Record<string, unknown>): boolean {
  // Honeypot field should be empty
  const honeypot = data.website || data.url || data.company_website;
  return typeof honeypot === 'string' && honeypot.length > 0;
}

// ============================================
// Contact Form Validation
// ============================================

export interface ContactFormData {
  name: string;
  email: string;
  phone: string | null;
  project_type: ProjectType;
  message: string;
}

export function validateContactForm(
  data: Record<string, unknown>
): ValidationResult<ContactFormData> {
  const errors: Record<string, string> = {};

  // Name
  const name = sanitizeString(data.name);
  if (!name) {
    errors.name = 'Name is required';
  } else if (name.length > 100) {
    errors.name = 'Name must be 100 characters or less';
  }

  // Email
  const email = sanitizeString(data.email).toLowerCase();
  if (!email) {
    errors.email = 'Email is required';
  } else if (!isValidEmail(email)) {
    errors.email = 'Invalid email format';
  }

  // Phone (optional)
  const phone = sanitizeString(data.phone) || null;
  if (phone && phone.length > 20) {
    errors.phone = 'Phone must be 20 characters or less';
  }

  // Project type
  const projectType = sanitizeString(data.project_type) as ProjectType;
  if (!PROJECT_TYPES.includes(projectType)) {
    errors.project_type = 'Invalid project type';
  }

  // Message
  const message = sanitizeString(data.message);
  if (!message) {
    errors.message = 'Message is required';
  } else if (message.length < 20) {
    errors.message = 'Message must be at least 20 characters';
  } else if (message.length > 5000) {
    errors.message = 'Message must be 5000 characters or less';
  }

  if (Object.keys(errors).length > 0) {
    return { success: false, errors };
  }

  return {
    success: true,
    data: {
      name,
      email,
      phone,
      project_type: projectType,
      message,
    },
  };
}

// ============================================
// Calculator Form Validation
// ============================================

export interface CalculatorFormData {
  project_type: ProjectType;
  features: string[];
  timeline: string;
  estimated_min: number;
  estimated_max: number;
  contact_email: string | null;
  contact_name: string | null;
}

export function validateCalculatorForm(
  data: Record<string, unknown>
): ValidationResult<CalculatorFormData> {
  const errors: Record<string, string> = {};

  // Project type
  const projectType = sanitizeString(data.project_type) as ProjectType;
  if (!PROJECT_TYPES.includes(projectType)) {
    errors.project_type = 'Invalid project type';
  }

  // Features (array of strings)
  let features: string[] = [];
  if (Array.isArray(data.features)) {
    features = data.features
      .filter((f): f is string => typeof f === 'string')
      .map((f) => f.trim().slice(0, 100))
      .slice(0, 50); // Max 50 features
  }

  // Timeline
  const timeline = sanitizeString(data.timeline);
  if (!timeline) {
    errors.timeline = 'Timeline is required';
  } else if (timeline.length > 50) {
    errors.timeline = 'Timeline must be 50 characters or less';
  }

  // Estimates
  const estimatedMin = Number(data.estimated_min);
  const estimatedMax = Number(data.estimated_max);

  if (isNaN(estimatedMin) || estimatedMin < 0) {
    errors.estimated_min = 'Invalid minimum estimate';
  }
  if (isNaN(estimatedMax) || estimatedMax < estimatedMin) {
    errors.estimated_max = 'Invalid maximum estimate';
  }

  // Contact email (optional)
  const contactEmail = sanitizeString(data.contact_email).toLowerCase() || null;
  if (contactEmail && !isValidEmail(contactEmail)) {
    errors.contact_email = 'Invalid email format';
  }

  // Contact name (optional)
  const contactName = sanitizeString(data.contact_name) || null;
  if (contactName && contactName.length > 100) {
    errors.contact_name = 'Name must be 100 characters or less';
  }

  if (Object.keys(errors).length > 0) {
    return { success: false, errors };
  }

  return {
    success: true,
    data: {
      project_type: projectType,
      features,
      timeline,
      estimated_min: estimatedMin,
      estimated_max: estimatedMax,
      contact_email: contactEmail,
      contact_name: contactName,
    },
  };
}

// ============================================
// Chat Message Validation
// ============================================

export interface ChatMessageData {
  session_id: string | null;
  visitor_id: string;
  message: string;
  visitor_email: string | null;
  visitor_name: string | null;
}

export function validateChatMessage(
  data: Record<string, unknown>
): ValidationResult<ChatMessageData> {
  const errors: Record<string, string> = {};

  // Session ID (optional for first message)
  const sessionId = sanitizeString(data.session_id) || null;

  // Visitor ID
  const visitorId = sanitizeString(data.visitor_id);
  if (!visitorId) {
    errors.visitor_id = 'Visitor ID is required';
  } else if (visitorId.length > 100) {
    errors.visitor_id = 'Invalid visitor ID';
  }

  // Message
  const message = sanitizeString(data.message);
  if (!message) {
    errors.message = 'Message is required';
  } else if (message.length > 2000) {
    errors.message = 'Message must be 2000 characters or less';
  }

  // Visitor email (optional)
  const visitorEmail = sanitizeString(data.visitor_email).toLowerCase() || null;
  if (visitorEmail && !isValidEmail(visitorEmail)) {
    errors.visitor_email = 'Invalid email format';
  }

  // Visitor name (optional)
  const visitorName = sanitizeString(data.visitor_name) || null;
  if (visitorName && visitorName.length > 100) {
    errors.visitor_name = 'Name must be 100 characters or less';
  }

  if (Object.keys(errors).length > 0) {
    return { success: false, errors };
  }

  return {
    success: true,
    data: {
      session_id: sessionId,
      visitor_id: visitorId,
      message,
      visitor_email: visitorEmail,
      visitor_name: visitorName,
    },
  };
}

// ============================================
// Newsletter Validation
// ============================================

export interface NewsletterData {
  email: string;
  source: string;
}

export function validateNewsletter(
  data: Record<string, unknown>
): ValidationResult<NewsletterData> {
  const errors: Record<string, string> = {};

  // Email
  const email = sanitizeString(data.email).toLowerCase();
  if (!email) {
    errors.email = 'Email is required';
  } else if (!isValidEmail(email)) {
    errors.email = 'Invalid email format';
  }

  // Source
  const source = sanitizeString(data.source) || 'unknown';
  if (source.length > 50) {
    errors.source = 'Invalid source';
  }

  if (Object.keys(errors).length > 0) {
    return { success: false, errors };
  }

  return {
    success: true,
    data: { email, source },
  };
}
