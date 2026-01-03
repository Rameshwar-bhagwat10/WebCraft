/**
 * Email Configuration
 * Centralized email settings for Nodemailer
 */

import { siteConfig } from '@/config/site';

/**
 * Email configuration from environment
 */
export const EMAIL_CONFIG = {
  // SMTP Configuration
  smtp: {
    host: process.env.SMTP_HOST ?? 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT ?? '587', 10),
    secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER ?? '',
      pass: process.env.SMTP_PASS ?? '',
    },
  },
  
  // From address
  fromAddress: process.env.EMAIL_FROM_ADDRESS ?? `${siteConfig.name} <${siteConfig.email}>`,
  
  // Admin notification emails (comma-separated)
  adminEmails: (process.env.ADMIN_NOTIFICATION_EMAILS ?? siteConfig.email)
    .split(',')
    .map((e) => e.trim())
    .filter(Boolean),
  
  // Timeouts and retries
  timeout: 10000, // 10 seconds
  maxRetries: 1,
} as const;

/**
 * Validate email configuration
 * Call this at startup in development
 */
export function validateEmailConfig(): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!EMAIL_CONFIG.smtp.auth.user) {
    errors.push('SMTP_USER is not set');
  }

  if (!EMAIL_CONFIG.smtp.auth.pass) {
    errors.push('SMTP_PASS is not set');
  }

  if (!EMAIL_CONFIG.fromAddress) {
    errors.push('EMAIL_FROM_ADDRESS is not set');
  }

  if (EMAIL_CONFIG.adminEmails.length === 0) {
    errors.push('ADMIN_NOTIFICATION_EMAILS is not set (no admin alerts will be sent)');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Check if email is enabled
 */
export function isEmailEnabled(): boolean {
  return Boolean(EMAIL_CONFIG.smtp.auth.user && EMAIL_CONFIG.smtp.auth.pass);
}
