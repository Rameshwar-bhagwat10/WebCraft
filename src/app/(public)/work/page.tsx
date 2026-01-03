/**
 * Work / Portfolio Page
 * Server Component with ISR (Incremental Static Regeneration)
 *
 * Purpose: Showcase projects and build credibility
 * - Fetches from database with caching (60s)
 * - Falls back to static data if database empty
 * - Suspense for progressive loading
 */

import type { Metadata } from 'next';
import { Suspense } from 'react';

import { Container, Section } from '@/components/layout';
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

/**
 * Loading skeleton for portfolio grid
 */
function PortfolioSkeleton(): React.ReactElement {
  return (
    <Section size="lg" background="primary" className="relative overflow-hidden">
      <Container>
        <div className="animate-pulse">
          {/* Header skeleton */}
          <div className="mx-auto mb-12 max-w-3xl pt-8 text-center sm:mb-16 sm:pt-12">
            <div className="mx-auto mb-4 h-4 w-24 rounded bg-neutral-200" />
            <div className="mx-auto mb-6 h-12 w-96 rounded bg-neutral-200" />
            <div className="mx-auto h-6 w-80 rounded bg-neutral-200" />
          </div>
          {/* Grid skeleton */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-80 rounded-2xl bg-neutral-200" />
            ))}
          </div>
        </div>
      </Container>
    </Section>
  );
}

/**
 * Async portfolio content
 */
async function PortfolioContent(): Promise<React.ReactElement> {
  const projects = await getPublishedProjects();
  const useStaticData = projects.length === 0;
  
  return (
    <PortfolioGrid projects={useStaticData ? undefined : projects} />
  );
}

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

      {/* Portfolio Grid with Suspense */}
      <Suspense fallback={<PortfolioSkeleton />}>
        <PortfolioContent />
      </Suspense>

      {/* Work CTA */}
      <WorkCTA />
    </>
  );
}
