/**
 * About Page
 * Server Component - renders statically (SSG)
 *
 * Purpose: Build trust and credibility
 * - Who WebCraft is
 * - Mission & Vision
 * - How we work
 * - Our values
 *
 * Performance:
 * - Static generation for fastest load
 * - No client JS
 * - CLS = 0
 */

import type { Metadata } from 'next';

import {
  AboutIntro,
  ClosingStatement,
  MissionVision,
  OurProcess,
  OurValues,
} from '@/components/about';
import { JsonLd } from '@/components/shared';
import { generatePageMetadata, generateWebPageSchema } from '@/lib/seo';

/**
 * Page-specific metadata
 */
export const metadata: Metadata = generatePageMetadata({
  title: 'About Us - WebCraft',
  description:
    'Learn about WebCraft, our mission, values, and how we work. We build high-performance websites and applications for businesses that value quality.',
  pathname: '/about',
});

export default function AboutPage(): React.ReactElement {
  // Generate page-specific schema
  const pageSchema = generateWebPageSchema({
    title: 'About Us - WebCraft',
    description:
      'Learn about WebCraft, our mission, values, and how we work.',
    pathname: '/about',
  });

  return (
    <>
      {/* Page-specific JSON-LD */}
      <JsonLd data={pageSchema} />

      {/* About Intro - Who we are (contains H1) */}
      <AboutIntro />

      {/* Mission & Vision */}
      <MissionVision />

      {/* Our Process - How we work */}
      <OurProcess />

      {/* Our Values - What we believe */}
      <OurValues />

      {/* Closing Statement - Trust builder */}
      <ClosingStatement />
    </>
  );
}
