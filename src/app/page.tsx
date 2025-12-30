/**
 * Home Page
 * Server Component - renders statically (SSG)
 *
 * Performance:
 * - Static generation for fastest load (best for LCP)
 * - No client JS in hero section
 * - CLS = 0 (no layout shifts)
 *
 * SEO:
 * - Single H1 in hero section
 * - Page-specific metadata
 * - JSON-LD structured data
 */

import type { Metadata } from 'next';

import { Hero } from '@/components/home';
import { JsonLd } from '@/components/shared';
import { generatePageMetadata, generateWebPageSchema } from '@/lib/seo';

/**
 * Page-specific metadata
 * Optimized for search and social sharing
 */
export const metadata: Metadata = generatePageMetadata({
  title: 'WebCraft - Websites That Grow Your Business',
  description:
    'We craft high-performance websites that convert visitors into customers. Expert web development, UI/UX design, and digital solutions for startups to enterprises.',
  pathname: '/',
});

export default function HomePage(): React.ReactElement {
  // Generate page-specific schema
  const pageSchema = generateWebPageSchema({
    title: 'WebCraft - Websites That Grow Your Business',
    description:
      'We craft high-performance websites that convert visitors into customers.',
    pathname: '/',
  });

  return (
    <>
      {/* Page-specific JSON-LD */}
      <JsonLd data={pageSchema} />

      {/* Hero Section - Above the fold */}
      <Hero />

      {/* Additional sections will be added in future phases */}
    </>
  );
}
