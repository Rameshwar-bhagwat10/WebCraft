/**
 * Form Submission Services
 * Client-side API calls for form submissions
 *
 * All submissions go through API routes which handle:
 * - Rate limiting
 * - Validation
 * - Spam protection
 * - Database insertion
 */

import type { ProjectType } from '@/types/database';

/**
 * API Response type
 */
interface ApiResponse {
  success: boolean;
  message?: string;
  error?: string;
  errors?: Record<string, string>;
  session_id?: string;
}

/**
 * Contact form submission data
 */
export interface ContactFormInput {
  name: string;
  email: string;
  phone?: string | undefined;
  project_type: ProjectType;
  message: string;
  // Honeypot field (should be empty)
  website?: string | undefined;
}

/**
 * Submit contact form
 */
export async function submitContactForm(data: ContactFormInput): Promise<ApiResponse> {
  try {
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: result.error || 'Failed to submit form',
        errors: result.errors,
      };
    }

    return { success: true, message: result.message };
  } catch {
    return { success: false, error: 'Network error. Please try again.' };
  }
}

/**
 * Calculator form submission data
 */
export interface CalculatorFormInput {
  project_type: ProjectType;
  features: string[];
  timeline: string;
  estimated_min: number;
  estimated_max: number;
  contact_email?: string | undefined;
  contact_name?: string | undefined;
  // Honeypot field
  website?: string | undefined;
}

/**
 * Submit calculator form
 */
export async function submitCalculatorForm(data: CalculatorFormInput): Promise<ApiResponse> {
  try {
    const response = await fetch('/api/calculator', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: result.error || 'Failed to save quote',
        errors: result.errors,
      };
    }

    return { success: true, message: result.message };
  } catch {
    return { success: false, error: 'Network error. Please try again.' };
  }
}

/**
 * Chat message submission data
 */
export interface ChatMessageInput {
  session_id?: string | null;
  visitor_id: string;
  message: string;
  visitor_email?: string;
  visitor_name?: string;
}

/**
 * Submit chat message
 */
export async function submitChatMessage(data: ChatMessageInput): Promise<ApiResponse> {
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: result.error || 'Failed to send message',
        errors: result.errors,
      };
    }

    return {
      success: true,
      message: result.message,
      session_id: result.session_id,
    };
  } catch {
    return { success: false, error: 'Network error. Please try again.' };
  }
}

/**
 * Newsletter subscription data
 */
export interface NewsletterInput {
  email: string;
  source: string;
  // Honeypot field
  website?: string;
}

/**
 * Subscribe to newsletter
 */
export async function subscribeNewsletter(data: NewsletterInput): Promise<ApiResponse> {
  try {
    const response = await fetch('/api/newsletter', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: result.error || 'Failed to subscribe',
        errors: result.errors,
      };
    }

    return { success: true, message: result.message };
  } catch {
    return { success: false, error: 'Network error. Please try again.' };
  }
}

/**
 * Generate unique visitor ID for chat
 * Stored in localStorage for session persistence
 */
export function getOrCreateVisitorId(): string {
  if (typeof window === 'undefined') return '';

  const key = 'webcraft_visitor_id';
  let visitorId = localStorage.getItem(key);

  if (!visitorId) {
    visitorId = `v_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
    localStorage.setItem(key, visitorId);
  }

  return visitorId;
}

/**
 * Get stored chat session ID
 */
export function getChatSessionId(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('webcraft_chat_session');
}

/**
 * Store chat session ID
 */
export function setChatSessionId(sessionId: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('webcraft_chat_session', sessionId);
}
