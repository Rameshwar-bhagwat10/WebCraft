/**
 * Email Service
 * Server-side email sending with Nodemailer
 */

import nodemailer from 'nodemailer';

import { EMAIL_CONFIG, isEmailEnabled } from './config';

export interface SendEmailParams {
  to: string | string[];
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
}

export interface SendEmailResult {
  success: boolean;
  messageId?: string | undefined;
  error?: string | undefined;
}

// Create reusable transporter
let transporter: nodemailer.Transporter | null = null;

/**
 * Get or create email transporter
 */
function getTransporter(): nodemailer.Transporter {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: EMAIL_CONFIG.smtp.host,
      port: EMAIL_CONFIG.smtp.port,
      secure: EMAIL_CONFIG.smtp.secure,
      auth: {
        user: EMAIL_CONFIG.smtp.auth.user,
        pass: EMAIL_CONFIG.smtp.auth.pass,
      },
      connectionTimeout: EMAIL_CONFIG.timeout,
      greetingTimeout: EMAIL_CONFIG.timeout,
      socketTimeout: EMAIL_CONFIG.timeout,
    });
  }
  return transporter;
}

/**
 * Send email via Nodemailer
 * Non-blocking with retry logic
 */
export async function sendEmail(params: SendEmailParams): Promise<SendEmailResult> {
  if (!isEmailEnabled()) {
    // Skip silently in development
    return { success: true, messageId: 'skipped-not-configured' };
  }

  const { to, subject, html, text, replyTo } = params;

  // Prepare recipients
  const recipients = Array.isArray(to) ? to.join(', ') : to;

  // Attempt to send with retry
  let lastError: string | undefined;

  for (let attempt = 0; attempt <= EMAIL_CONFIG.maxRetries; attempt++) {
    try {
      const mailer = getTransporter();

      const info = await mailer.sendMail({
        from: EMAIL_CONFIG.fromAddress,
        to: recipients,
        subject,
        html,
        text,
        replyTo,
      });

      // Email sent successfully - intentionally kept for operational visibility
      if (process.env.NODE_ENV !== 'production') {
        console.info('[Email] Sent successfully', {
          messageId: info.messageId,
          to: recipients,
        });
      }

      return { success: true, messageId: info.messageId };
    } catch (error) {
      lastError = error instanceof Error ? error.message : 'Unknown error';

      // Log retry attempt in development only
      if (attempt < EMAIL_CONFIG.maxRetries && process.env.NODE_ENV !== 'production') {
        console.warn(`[Email] Attempt ${attempt + 1} failed, retrying...`);
        // Brief delay before retry
        await new Promise((resolve) => setTimeout(resolve, 500));
      } else if (attempt < EMAIL_CONFIG.maxRetries) {
        await new Promise((resolve) => setTimeout(resolve, 500));
      }
    }
  }

  // All attempts failed
  console.error('[Email] Failed to send after retries', {
    error: lastError,
    to: recipients,
  });

  return { success: false, error: lastError };
}

/**
 * Send email asynchronously (fire and forget)
 * Use this for non-critical emails that shouldn't block the response
 */
export function sendEmailAsync(params: SendEmailParams): void {
  // Fire and forget - don't await
  sendEmail(params).catch((error) => {
    console.error('[Email] Async send failed', { error });
  });
}

/**
 * Verify SMTP connection
 * Use this to test configuration
 */
export async function verifyEmailConnection(): Promise<{ success: boolean; error?: string }> {
  if (!isEmailEnabled()) {
    return { success: false, error: 'Email not configured' };
  }

  try {
    const mailer = getTransporter();
    await mailer.verify();
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
