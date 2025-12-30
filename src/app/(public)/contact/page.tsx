/**
 * Contact Page
 * Server Component with Client Component form
 *
 * Purpose: Primary conversion point
 * - Easy contact form
 * - Alternative contact methods
 * - Clear UX feedback
 *
 * Performance:
 * - Static shell with client form
 * - Minimal client JS (form only)
 */

import type { Metadata } from 'next';

import { ContactFormSection, ContactIntro } from '@/components/contact';
import { JsonLd } from '@/components/shared';
import { generatePageMetadata, generateWebPageSchema } from '@/lib/seo';

/**
 * Page-specific metadata
 */
export const metadata: Metadata = generatePageMetadata({
  title: 'Contact Us - WebCraft',
  description:
    'Get in touch with WebCraft. Tell us about your project and we will respond within one business day. Free consultation, no obligation.',
  pathname: '/contact',
});

export default function ContactPage(): React.ReactElement {
  // Generate page-specific schema
  const pageSchema = generateWebPageSchema({
    title: 'Contact Us - WebCraft',
    description:
      'Get in touch with WebCraft. Tell us about your project and we will respond within one business day.',
    pathname: '/contact',
  });

  return (
    <>
      {/* Page-specific JSON-LD */}
      <JsonLd data={pageSchema} />

      {/* Contact Intro - Reassurance */}
      <ContactIntro />

      {/* Contact Form Section */}
      <ContactFormSection />
    </>
  );
}
