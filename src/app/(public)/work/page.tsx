/**
 * Work / Portfolio Page
 * Server Component with ISR (Incremental Static Regeneration)
 *
 * Purpose: Showcase projects and build credibility
 * - Fetches from database with caching
 * - Falls back to static data if database empty
 * - Revalidates every 60 seconds
 */

import type { Metadata } from 'next';

import { PortfolioGrid, WorkCTA } from '@/components/portfolio';
import { JsonLd } from '@/components/shared';
import { getPublishedProjects } from '@/lib/projects';
import { generatePageMetadata, generateWebPageSchema } from '@/lib/seo';

// Revalidate every 60 seconds (ISR)
export const revalidate = 60;

/**
 * Page-specific metadata
 */
export const metadata: Metadata = generatePageMetadata({
  title: 'Our Work - WebCraft',
  description:
    'Explore our portfolio of web development projects. See how we help businesses succeed online with high-performance websites, web applications, and dashboards.',
  pathname: '/work',
});

export default async function WorkPage(): Promise<React.ReactElement> {
  // Try to fetch from database, fall back to static data
  let projects = await getPublishedProjects();
  
  // If no database projects, use static demo data
  const useStaticData = projects.length === 0;
  
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
      <PortfolioGrid 
        projects={useStaticData ? undefined : projects} 
      />

      {/* Work CTA */}
      <WorkCTA />
    </>
  );
}
