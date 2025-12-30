/**
 * Home Page
 * Server Component - renders statically (SSG)
 *
 * Performance: Static generation for fastest load (best for LCP)
 * SEO: Uses page-specific metadata and JSON-LD
 */

import type { Metadata } from 'next';

import { Container, Section } from '@/components/layout';
import { JsonLd } from '@/components/shared';
import { Heading, Text } from '@/components/ui';
import { generatePageMetadata, generateWebPageSchema } from '@/lib/seo';

/**
 * Page-specific metadata
 * Extends default metadata with page-specific values
 */
export const metadata: Metadata = generatePageMetadata({
  title: 'WebCraft - Professional Web Development Services',
  description:
    'We craft high-performance, scalable websites that drive results. Expert web development, UI/UX design, and digital solutions.',
  pathname: '/',
});

export default function HomePage(): React.ReactElement {
  // Generate page-specific schema
  const pageSchema = generateWebPageSchema({
    title: 'WebCraft - Professional Web Development Services',
    description:
      'We craft high-performance, scalable websites that drive results.',
    pathname: '/',
  });

  return (
    <>
      {/* Page-specific JSON-LD - sanitized */}
      <JsonLd data={pageSchema} />

      <Section size="lg">
        <Container size="md" className="text-center">
          <Heading level={1} className="mb-4">
            WebCraft
          </Heading>
          <Text variant="secondary" size="lg" className="mb-8">
            Professional web development services
          </Text>
          <Text variant="muted" size="sm">
            Phase 4 Complete — SEO & Performance Ready
          </Text>
        </Container>
      </Section>
    </>
  );
}
