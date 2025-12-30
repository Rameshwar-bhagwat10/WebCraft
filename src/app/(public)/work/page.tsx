/**
 * Work / Portfolio Page
 * Server Component - renders statically (SSG)
 *
 * Purpose: Showcase projects and build credibility
 * - Overview of completed projects
 * - Links to individual case studies
 * - CTA for new projects
 *
 * Performance:
 * - Static generation for fastest load
 * - Optimized images with next/image
 * - Priority loading for above-fold images
 */

import type { Metadata } from 'next';

import { PortfolioGrid, WorkCTA } from '@/components/portfolio';
import { JsonLd } from '@/components/shared';
import { generatePageMetadata, generateWebPageSchema } from '@/lib/seo';

/**
 * Page-specific metadata
 */
export const metadata: Metadata = generatePageMetadata({
  title: 'Our Work - WebCraft',
  description:
    'Explore our portfolio of web development projects. See how we help businesses succeed online with high-performance websites, web applications, and dashboards.',
  pathname: '/work',
});

export default function WorkPage(): React.ReactElement {
  // Generate page-specific schema
  const pageSchema = generateWebPageSchema({
    title: 'Our Work - WebCraft Portfolio',
    description:
      'A selection of projects demonstrating our approach to solving real business problems.',
    pathname: '/work',
  });

  return (
    <>
      {/* Page-specific JSON-LD */}
      <JsonLd data={pageSchema} />

      {/* Portfolio Grid */}
      <PortfolioGrid />

      {/* Work CTA */}
      <WorkCTA />
    </>
  );
}
