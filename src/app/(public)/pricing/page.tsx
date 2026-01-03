/**
 * Pricing Page
 * Server Component - renders statically (SSG)
 *
 * Purpose: Clarify expectations and pre-qualify clients
 * - Transparent pricing structure
 * - Clear plan comparison
 * - Honest disclaimers
 *
 * Performance:
 * - Static generation for fastest load
 * - No client JS
 * - CLS = 0
 */

import type { Metadata } from 'next';

import { CalculatorSection } from '@/components/calculator';
import {
  PricingCTA,
  PricingGrid,
  PricingIntro,
  PricingNotes,
} from '@/components/pricing';
import { JsonLd } from '@/components/shared';
import { generatePageMetadata, generateWebPageSchema } from '@/lib/seo';

/**
 * Page-specific metadata
 */
export const metadata: Metadata = generatePageMetadata({
  title: 'Pricing - WebCraft',
  description:
    'Transparent pricing for web development services. From simple websites to complex applications, find the right plan for your business needs.',
  pathname: '/pricing',
});

export default function PricingPage(): React.ReactElement {
  // Generate page-specific schema
  const pageSchema = generateWebPageSchema({
    title: 'Pricing - WebCraft',
    description:
      'Transparent pricing for web development services. Starting points for common project types.',
    pathname: '/pricing',
  });

  return (
    <>
      {/* Page-specific JSON-LD */}
      <JsonLd data={pageSchema} />

      {/* Pricing Intro - Sets expectations */}
      <PricingIntro />

      {/* Pricing Grid - Plan cards */}
      <PricingGrid />

      {/* Project Cost Calculator */}
      <CalculatorSection />

      {/* Pricing Notes - Important disclaimers */}
      <PricingNotes />

      {/* Final CTA */}
      <PricingCTA />
    </>
  );
}
