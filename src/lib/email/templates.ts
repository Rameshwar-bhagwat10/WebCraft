/**
 * Email Templates
 * Reusable HTML email templates for transactional emails
 */

/**
 * Base email wrapper with consistent styling
 */
function baseTemplate(content: string): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>WebCraft</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f5f5f5;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
          <!-- Header -->
          <tr>
            <td style="background-color: #171717; padding: 24px; text-align: center;">
              <span style="color: #ffffff; font-size: 24px; font-weight: bold;">WebCraft</span>
            </td>
          </tr>
          <!-- Content -->
          <tr>
            <td style="padding: 32px 24px;">
              ${content}
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background-color: #fafafa; padding: 24px; text-align: center; border-top: 1px solid #e5e5e5;">
              <p style="margin: 0; color: #737373; font-size: 14px;">
                © ${new Date().getFullYear()} WebCraft. All rights reserved.
              </p>
              <p style="margin: 8px 0 0; color: #a3a3a3; font-size: 12px;">
                This is an automated message. Please do not reply directly to this email.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

/**
 * Contact form confirmation email
 */
export interface ContactConfirmationData {
  name: string;
  projectType: string;
  messagePreview: string;
}

export function contactConfirmationTemplate(data: ContactConfirmationData): {
  subject: string;
  html: string;
  text: string;
} {
  const content = `
    <h1 style="margin: 0 0 16px; color: #171717; font-size: 24px; font-weight: 600;">
      Thank you for reaching out!
    </h1>
    <p style="margin: 0 0 24px; color: #525252; font-size: 16px; line-height: 1.6;">
      Hi ${escapeHtml(data.name)},
    </p>
    <p style="margin: 0 0 24px; color: #525252; font-size: 16px; line-height: 1.6;">
      We've received your message and our team will review it shortly. You can expect to hear back from us within 1-2 business days.
    </p>
    
    <!-- Summary Box -->
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f5f5f5; border-radius: 8px; margin-bottom: 24px;">
      <tr>
        <td style="padding: 20px;">
          <p style="margin: 0 0 8px; color: #737373; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">
            Your Inquiry
          </p>
          <p style="margin: 0 0 12px; color: #171717; font-size: 14px;">
            <strong>Project Type:</strong> ${escapeHtml(data.projectType)}
          </p>
          <p style="margin: 0; color: #525252; font-size: 14px; line-height: 1.5;">
            "${escapeHtml(data.messagePreview)}${data.messagePreview.length >= 100 ? '...' : ''}"
          </p>
        </td>
      </tr>
    </table>
    
    <p style="margin: 0 0 24px; color: #525252; font-size: 16px; line-height: 1.6;">
      In the meantime, feel free to explore our <a href="https://webcraft.com/work" style="color: #2563eb; text-decoration: none;">portfolio</a> or check out our <a href="https://webcraft.com/services" style="color: #2563eb; text-decoration: none;">services</a>.
    </p>
    
    <p style="margin: 0; color: #525252; font-size: 16px; line-height: 1.6;">
      Best regards,<br>
      <strong>The WebCraft Team</strong>
    </p>
  `;

  const text = `
Thank you for reaching out!

Hi ${data.name},

We've received your message and our team will review it shortly. You can expect to hear back from us within 1-2 business days.

Your Inquiry:
- Project Type: ${data.projectType}
- Message: "${data.messagePreview}${data.messagePreview.length >= 100 ? '...' : ''}"

Best regards,
The WebCraft Team
  `.trim();

  return {
    subject: 'We received your message - WebCraft',
    html: baseTemplate(content),
    text,
  };
}

/**
 * Calculator quote confirmation email
 */
export interface QuoteConfirmationData {
  name: string;
  projectType: string;
  estimatedMin: number;
  estimatedMax: number;
}

export function quoteConfirmationTemplate(data: QuoteConfirmationData): {
  subject: string;
  html: string;
  text: string;
} {
  const formatPrice = (n: number) => `$${n.toLocaleString()}`;

  const content = `
    <h1 style="margin: 0 0 16px; color: #171717; font-size: 24px; font-weight: 600;">
      Your Quote Has Been Saved!
    </h1>
    <p style="margin: 0 0 24px; color: #525252; font-size: 16px; line-height: 1.6;">
      Hi ${escapeHtml(data.name || 'there')},
    </p>
    <p style="margin: 0 0 24px; color: #525252; font-size: 16px; line-height: 1.6;">
      Thank you for using our project calculator. We've saved your estimate and will be in touch soon to discuss your project in detail.
    </p>
    
    <!-- Quote Box -->
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #eff6ff; border-radius: 8px; margin-bottom: 24px; border: 1px solid #bfdbfe;">
      <tr>
        <td style="padding: 24px; text-align: center;">
          <p style="margin: 0 0 8px; color: #1e40af; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">
            Estimated Investment
          </p>
          <p style="margin: 0 0 12px; color: #1e40af; font-size: 28px; font-weight: bold;">
            ${formatPrice(data.estimatedMin)} – ${formatPrice(data.estimatedMax)}
          </p>
          <p style="margin: 0; color: #3b82f6; font-size: 14px;">
            ${escapeHtml(data.projectType)} Project
          </p>
        </td>
      </tr>
    </table>
    
    <p style="margin: 0 0 24px; color: #525252; font-size: 16px; line-height: 1.6;">
      This is an estimated range based on your selections. Final pricing will be determined after we discuss your specific requirements.
    </p>
    
    <!-- CTA Button -->
    <table role="presentation" cellspacing="0" cellpadding="0" style="margin-bottom: 24px;">
      <tr>
        <td style="background-color: #171717; border-radius: 8px;">
          <a href="https://webcraft.com/contact" style="display: inline-block; padding: 14px 28px; color: #ffffff; text-decoration: none; font-weight: 600; font-size: 16px;">
            Schedule a Call
          </a>
        </td>
      </tr>
    </table>
    
    <p style="margin: 0; color: #525252; font-size: 16px; line-height: 1.6;">
      Best regards,<br>
      <strong>The WebCraft Team</strong>
    </p>
  `;

  const text = `
Your Quote Has Been Saved!

Hi ${data.name || 'there'},

Thank you for using our project calculator. We've saved your estimate and will be in touch soon.

Estimated Investment: ${formatPrice(data.estimatedMin)} – ${formatPrice(data.estimatedMax)}
Project Type: ${data.projectType}

This is an estimated range. Final pricing will be determined after we discuss your requirements.

Schedule a call: https://webcraft.com/contact

Best regards,
The WebCraft Team
  `.trim();

  return {
    subject: 'Your Project Quote - WebCraft',
    html: baseTemplate(content),
    text,
  };
}

/**
 * Admin notification email for new lead
 */
export interface AdminAlertData {
  leadSource: 'contact' | 'calculator' | 'chat';
  name: string;
  email: string;
  projectType: string;
  messagePreview?: string;
  estimatedRange?: string;
  adminDashboardUrl: string;
}

export function adminAlertTemplate(data: AdminAlertData): {
  subject: string;
  html: string;
  text: string;
} {
  const sourceLabels = {
    contact: 'Contact Form',
    calculator: 'Quote Calculator',
    chat: 'Chat Widget',
  };

  const content = `
    <h1 style="margin: 0 0 16px; color: #171717; font-size: 24px; font-weight: 600;">
      🔔 New Lead Received
    </h1>
    
    <!-- Alert Box -->
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #fef3c7; border-radius: 8px; margin-bottom: 24px; border: 1px solid #fcd34d;">
      <tr>
        <td style="padding: 16px;">
          <p style="margin: 0; color: #92400e; font-size: 14px; font-weight: 600;">
            Source: ${sourceLabels[data.leadSource]}
          </p>
        </td>
      </tr>
    </table>
    
    <!-- Lead Details -->
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f5f5f5; border-radius: 8px; margin-bottom: 24px;">
      <tr>
        <td style="padding: 20px;">
          <p style="margin: 0 0 12px; color: #171717; font-size: 16px;">
            <strong>Name:</strong> ${escapeHtml(data.name)}
          </p>
          <p style="margin: 0 0 12px; color: #171717; font-size: 16px;">
            <strong>Email:</strong> <a href="mailto:${escapeHtml(data.email)}" style="color: #2563eb;">${escapeHtml(data.email)}</a>
          </p>
          <p style="margin: 0 0 12px; color: #171717; font-size: 16px;">
            <strong>Project:</strong> ${escapeHtml(data.projectType)}
          </p>
          ${data.estimatedRange ? `
          <p style="margin: 0 0 12px; color: #171717; font-size: 16px;">
            <strong>Budget:</strong> ${escapeHtml(data.estimatedRange)}
          </p>
          ` : ''}
          ${data.messagePreview ? `
          <p style="margin: 12px 0 0; color: #525252; font-size: 14px; line-height: 1.5; border-top: 1px solid #e5e5e5; padding-top: 12px;">
            "${escapeHtml(data.messagePreview)}${data.messagePreview.length >= 150 ? '...' : ''}"
          </p>
          ` : ''}
        </td>
      </tr>
    </table>
    
    <!-- CTA Button -->
    <table role="presentation" cellspacing="0" cellpadding="0">
      <tr>
        <td style="background-color: #2563eb; border-radius: 8px;">
          <a href="${escapeHtml(data.adminDashboardUrl)}" style="display: inline-block; padding: 14px 28px; color: #ffffff; text-decoration: none; font-weight: 600; font-size: 16px;">
            View in Dashboard →
          </a>
        </td>
      </tr>
    </table>
  `;

  const text = `
🔔 New Lead Received

Source: ${sourceLabels[data.leadSource]}

Name: ${data.name}
Email: ${data.email}
Project: ${data.projectType}
${data.estimatedRange ? `Budget: ${data.estimatedRange}` : ''}
${data.messagePreview ? `\nMessage: "${data.messagePreview}${data.messagePreview.length >= 150 ? '...' : ''}"` : ''}

View in Dashboard: ${data.adminDashboardUrl}
  `.trim();

  return {
    subject: `New ${sourceLabels[data.leadSource]} Lead: ${data.name}`,
    html: baseTemplate(content),
    text,
  };
}

/**
 * Escape HTML to prevent XSS
 */
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
