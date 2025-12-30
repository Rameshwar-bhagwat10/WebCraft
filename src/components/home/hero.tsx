/**
 * Hero Section Component
 * Above-the-fold content for maximum conversion
 *
 * Server Component - no client JS needed
 * Performance: Optimized for LCP, CLS = 0
 * SEO: Semantic HTML with proper heading hierarchy
 *
 * 2025 Best Practices Applied:
 * - Speed and clarity over design flair
 * - 1 primary CTA + 1 secondary link
 * - Action-oriented CTA text
 * - Generous whitespace around CTAs
 * - Clear visual hierarchy
 */

import Link from 'next/link';

import { Container } from '@/components/layout';
import { Button } from '@/components/ui';

/**
 * Hero eyebrow - establishes context before headline
 * Helps with scannability and sets expectations
 */
function HeroEyebrow(): React.ReactElement {
  return (
    <p className="text-primary-600 mb-4 text-sm font-semibold uppercase tracking-wider sm:text-base">
      Web Development Agency
    </p>
  );
}

/**
 * Hero headline - the primary value proposition
 * Uses H1 for SEO (only one per page)
 * Balanced line length for readability
 */
function HeroHeadline(): React.ReactElement {
  return (
    <h1 className="text-foreground text-balance text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl xl:text-7xl">
      Websites that{' '}
      <span className="text-primary-600">grow your business</span>
    </h1>
  );
}

/**
 * Hero subheadline - supporting value proposition
 * Explains what we do and for whom
 * Optimized line length (50-75 chars) for readability
 */
function HeroSubheadline(): React.ReactElement {
  return (
    <p className="text-foreground-secondary mx-auto mt-6 max-w-xl text-pretty text-lg leading-relaxed sm:text-xl lg:mt-8 lg:text-2xl">
      We craft high-performance websites that convert visitors into customers.
      From startups to enterprises.
    </p>
  );
}

/**
 * Hero CTA buttons
 * Primary: High-conversion action (stands out)
 * Secondary: Lower commitment option (subtle)
 *
 * Best practice: More whitespace around CTAs increases conversions
 */
function HeroCTA(): React.ReactElement {
  return (
    <div className="mt-10 flex flex-col items-center gap-4 sm:mt-12 sm:flex-row sm:justify-center sm:gap-6 lg:mt-14">
      {/* Primary CTA - most prominent, action-oriented */}
      <Button asChild size="lg" className="min-w-[200px] shadow-lg">
        <Link href="/contact">Get Free Consultation</Link>
      </Button>

      {/* Secondary CTA - lower commitment */}
      <Button asChild variant="ghost" size="lg" className="min-w-[160px]">
        <Link href="/work">
          View Our Work
          <span aria-hidden="true" className="ml-2">
            →
          </span>
        </Link>
      </Button>
    </div>
  );
}

/**
 * Trust indicators - social proof snippet
 * Builds credibility without heavy content
 * Separated visually from CTA for clarity
 */
function TrustIndicators(): React.ReactElement {
  return (
    <div className="border-border/50 mt-16 border-t pt-8 sm:mt-20 sm:pt-10">
      <p className="text-foreground-muted mb-6 text-sm">
        Trusted by innovative companies
      </p>
      <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 sm:gap-x-12">
        {/* Placeholder for client logos - styled text for now */}
        {['TechCorp', 'StartupX', 'GrowthCo', 'InnovateLab'].map((company) => (
          <span
            key={company}
            className="text-foreground-muted/70 text-lg font-semibold tracking-tight"
          >
            {company}
          </span>
        ))}
      </div>
    </div>
  );
}

/**
 * Main Hero Section
 * Clean, focused, conversion-optimized
 *
 * Layout: Generous vertical padding for breathing room
 * Background: Subtle gradient, doesn't compete with content
 */
export function Hero(): React.ReactElement {
  return (
    <section
      aria-labelledby="hero-heading"
      className="bg-background relative isolate overflow-hidden pb-16 pt-24 sm:pb-24 sm:pt-32 lg:pb-32 lg:pt-40"
    >
      <Container size="lg">
        <div className="mx-auto max-w-4xl text-center">
          {/* Visually hidden label for accessibility */}
          <span id="hero-heading" className="sr-only">
            WebCraft - Professional Web Development
          </span>

          {/* Main content with clear hierarchy */}
          <HeroEyebrow />
          <HeroHeadline />
          <HeroSubheadline />
          <HeroCTA />
          <TrustIndicators />
        </div>
      </Container>

      {/* Subtle background decoration - CSS only, no images */}
      <div
        className="absolute inset-0 -z-10 overflow-hidden"
        aria-hidden="true"
      >
        {/* Primary gradient blob */}
        <div className="bg-primary-100/60 absolute -top-1/2 left-1/2 h-[1000px] w-[1000px] -translate-x-1/2 rounded-full blur-3xl" />
        {/* Secondary accent */}
        <div className="bg-primary-50/40 absolute -bottom-1/4 right-0 h-[600px] w-[600px] rounded-full blur-3xl" />
      </div>

      {/* Subtle grid pattern for depth (optional visual enhancement) */}
      <div
        className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#8882_1px,transparent_1px),linear-gradient(to_bottom,#8882_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]"
        aria-hidden="true"
      />
    </section>
  );
}
