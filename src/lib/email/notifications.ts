/**
 * Email Notifications
 * High-level notification functions for common events
 */

import { EMAIL_CONFIG } from './config';
import { sendEmailAsync } from './service';
import {
  adminAlertTemplate,
  contactConfirmationTemplate,
  quoteConfirmationTemplate,
  type AdminAlertData,
  type ContactConfirmationData,
  type QuoteConfirmationData,
} from './templates';

/**
 * Send contact form confirmation to user
 */
export function sendContactConfirmation(
  userEmail: string,
  data: ContactConfirmationData
): void {
  const template = contactConfirmationTemplate(data);

  sendEmailAsync({
    to: userEmail,
    subject: template.subject,
    html: template.html,
    text: template.text,
  });
}

/**
 * Send quote confirmation to user
 */
export function sendQuoteConfirmation(
  userEmail: string,
  data: QuoteConfirmationData
): void {
  const template = quoteConfirmationTemplate(data);

  sendEmailAsync({
    to: userEmail,
    subject: template.subject,
    html: template.html,
    text: template.text,
  });
}

/**
 * Send admin alert for new lead
 */
export function sendAdminLeadAlert(data: Omit<AdminAlertData, 'adminDashboardUrl'>): void {
  const adminEmails = EMAIL_CONFIG.adminEmails;

  if (adminEmails.length === 0) {
    // No admin emails configured, skip silently
    return;
  }

  // Build dashboard URL
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';
  const adminDashboardUrl = `${baseUrl}/admin/leads?status=new`;

  const template = adminAlertTemplate({
    ...data,
    adminDashboardUrl,
  });

  sendEmailAsync({
    to: adminEmails,
    subject: template.subject,
    html: template.html,
    text: template.text,
    replyTo: data.email, // Allow admin to reply directly to lead
  });
}

/**
 * Notify admins of new contact form submission
 */
export function notifyNewContactLead(lead: {
  name: string;
  email: string;
  projectType: string;
  message: string;
}): void {
  // Send confirmation to user
  sendContactConfirmation(lead.email, {
    name: lead.name,
    projectType: formatProjectType(lead.projectType),
    messagePreview: lead.message.slice(0, 100),
  });

  // Send alert to admins
  sendAdminLeadAlert({
    leadSource: 'contact',
    name: lead.name,
    email: lead.email,
    projectType: formatProjectType(lead.projectType),
    messagePreview: lead.message.slice(0, 150),
  });
}

/**
 * Notify admins of new calculator submission
 */
export function notifyNewCalculatorLead(lead: {
  name?: string | undefined;
  email: string;
  projectType: string;
  estimatedMin: number;
  estimatedMax: number;
}): void {
  const formatPrice = (n: number) => `$${n.toLocaleString()}`;

  // Send confirmation to user
  sendQuoteConfirmation(lead.email, {
    name: lead.name ?? '',
    projectType: formatProjectType(lead.projectType),
    estimatedMin: lead.estimatedMin,
    estimatedMax: lead.estimatedMax,
  });

  // Send alert to admins
  sendAdminLeadAlert({
    leadSource: 'calculator',
    name: lead.name ?? 'Anonymous',
    email: lead.email,
    projectType: formatProjectType(lead.projectType),
    estimatedRange: `${formatPrice(lead.estimatedMin)} – ${formatPrice(lead.estimatedMax)}`,
  });
}

/**
 * Notify admins of new chat message
 */
export function notifyNewChatMessage(chat: {
  name?: string | undefined;
  email?: string | undefined;
  message: string;
  sessionId: string;
}): void {
  const adminEmails = EMAIL_CONFIG.adminEmails;

  if (adminEmails.length === 0) {
    return;
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';
  const adminDashboardUrl = `${baseUrl}/admin/chat/${chat.sessionId}`;

  const template = adminAlertTemplate({
    leadSource: 'chat',
    name: chat.name ?? 'Anonymous Visitor',
    email: chat.email ?? 'No email provided',
    projectType: 'Quick Question',
    messagePreview: chat.message.slice(0, 150),
    adminDashboardUrl,
  });

  sendEmailAsync({
    to: adminEmails,
    subject: template.subject,
    html: template.html,
    text: template.text,
    ...(chat.email ? { replyTo: chat.email } : {}),
  });
}

/**
 * Format project type for display
 */
function formatProjectType(type: string): string {
  return type
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}
