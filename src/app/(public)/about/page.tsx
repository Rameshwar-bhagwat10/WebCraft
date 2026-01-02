/**
 * About Page
 * Server Component - renders statically (SSG)
 *
 * Purpose: Build trust and credibility
 * - Who WebCraft is
 * - Our journey and story
 * - Mission & Vision
 * - How we work
 * - Our values
 * - Tech stack
 * - CTA
 *
 * Performance:
 * - Static generation for fastest load
 * - No client JS
 * - CLS = 0
 *
 * SEO:
 * - Single H1 in AboutIntro
 * - H2 for each major section
 * - Proper heading hierarchy
 */

import type { Metadata } from 'next';

import {
  AboutCTA,
  AboutIntro,
  ClosingStatement,
  MissionVision,
  OurProcess,
  OurStory,
  OurValues,
  TechStack,
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
    description: 'Learn about WebCraft, our mission, values, and how we work.',
    pathname: '/about',
  });

  return (
    <>
      {/* Page-specific JSON-LD */}
      <JsonLd data={pageSchema} />

      {/* About Intro - Hero with H1 */}
      <AboutIntro />

      {/* Mission & Vision */}
      <MissionVision />

      {/* Our Story / Timeline */}
      <OurStory />

      {/* Our Process - How we work */}
      <OurProcess />

      {/* Our Values - What we believe */}
      <OurValues />

      {/* TODO: Add TeamSection back when team data is ready */}

      {/* Tech Stack */}
      <TechStack />

      {/* Closing Statement */}
      <ClosingStatement />

      {/* About CTA */}
      <AboutCTA />
    </>
  );
}
