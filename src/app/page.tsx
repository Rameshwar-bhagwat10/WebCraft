/**
 * Home Page
 * Server Component - renders statically (SSG)
 *
 * Performance:
 * - Static generation for fastest load (best for LCP)
 * - Cached database queries (60s revalidation)
 * - Suspense boundaries for progressive loading
 * - CLS = 0 (no layout shifts)
 *
 * SEO:
 * - Single H1 in hero section
 * - H2 for each major section
 * - Page-specific metadata
 * - JSON-LD structured data
 */

import type { Metadata } from 'next';
import { Suspense } from 'react';

import { CalculatorSection } from '@/components/calculator';
import { VisitorFeedbackSection } from '@/components/feedback';
import {
  FeaturedWork,
  FinalCTA,
  Hero,
  ProcessSection,
  ServicesSection,
  StatsSection,
  TechStack,
  WhyWebCraft,
} from '@/components/home';
import { Container, Section } from '@/components/layout';
import { JsonLd } from '@/components/shared';
import { TestimonialsSection } from '@/components/testimonials';
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

/**
 * Loading skeleton for async sections
 */
function SectionSkeleton(): React.ReactElement {
  return (
    <Section size="lg" background="secondary">
      <Container>
        <div className="animate-pulse">
          <div className="mx-auto mb-8 h-8 w-48 rounded bg-neutral-200" />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-64 rounded-xl bg-neutral-200" />
            ))}
          </div>
        </div>
      </Container>
    </Section>
  );
}

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

      {/* Hero Section - Above the fold (critical) */}
      <Hero />

      {/* Tech Stack - Technologies we use */}
      <TechStack />

      {/* Services Overview */}
      <ServicesSection />

      {/* Stats Section - Credibility boost */}
      <StatsSection />

      {/* Process Section - How we work */}
      <ProcessSection />

      {/* Featured Work - Social proof (async with Suspense) */}
      <Suspense fallback={<SectionSkeleton />}>
        <FeaturedWork />
      </Suspense>

      {/* Project Cost Calculator */}
      <CalculatorSection />

      {/* Why WebCraft - Trust builder */}
      <WhyWebCraft />

      {/* Client Testimonials - Social proof (async with Suspense) */}
      <Suspense fallback={<SectionSkeleton />}>
        <TestimonialsSection />
      </Suspense>

      {/* Visitor Feedback - Community engagement (async with Suspense) */}
      <Suspense fallback={<SectionSkeleton />}>
        <VisitorFeedbackSection />
      </Suspense>

      {/* Final CTA - Conversion */}
      <FinalCTA />
    </>
  );
}
