/**
 * Hero Section Component
 * Above-the-fold content for maximum conversion
 *
 * Server Component - no client JS needed
 * Performance: Optimized for LCP, CLS = 0
 * SEO: Semantic HTML with proper heading hierarchy
 */

import Link from 'next/link';

import { Container } from '@/components/layout';
import { Button } from '@/components/ui';

/**
 * Hero headline - the primary value proposition
 * Uses H1 for SEO (only one per page)
 */
function HeroHeadline(): React.ReactElement {
  return (
    <h1 className="text-foreground text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
      Websites that <span className="text-primary-600">grow your business</span>
    </h1>
  );
}

/**
 * Hero subheadline - supporting value proposition
 * Explains what we do and for whom
 */
function HeroSubheadline(): React.ReactElement {
  return (
    <p className="text-foreground-secondary mt-6 max-w-2xl text-lg leading-relaxed sm:text-xl">
      We craft high-performance websites that convert visitors into customers.
      From startups to enterprises, we build digital experiences that drive real
      results.
    </p>
  );
}

/**
 * Hero CTA buttons
 * Primary: High-conversion action
 * Secondary: Lower commitment option
 */
function HeroCTA(): React.ReactElement {
  return (
    <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:gap-4">
      {/* Primary CTA - most prominent */}
      <Button asChild size="lg">
        <Link href="/contact">Get Free Consultation</Link>
      </Button>

      {/* Secondary CTA - lower commitment */}
      <Button asChild variant="outline" size="lg">
        <Link href="/work">View Our Work</Link>
      </Button>
    </div>
  );
}

/**
 * Trust indicators - social proof snippet
 * Builds credibility without heavy content
 */
function TrustIndicators(): React.ReactElement {
  return (
    <div className="mt-12 flex flex-col items-center gap-4 sm:flex-row sm:gap-8">
      <p className="text-foreground-muted text-sm">Trusted by companies like</p>
      <div className="text-foreground-muted flex items-center gap-6">
        {/* Placeholder for client logos - text only for now */}
        <span className="text-sm font-medium">TechCorp</span>
        <span className="text-sm font-medium">StartupX</span>
        <span className="text-sm font-medium">GrowthCo</span>
      </div>
    </div>
  );
}

/**
 * Main Hero Section
 * Clean, focused, conversion-optimized
 */
export function Hero(): React.ReactElement {
  return (
    <section
      aria-labelledby="hero-heading"
      className="bg-background relative overflow-hidden py-20 sm:py-28 lg:py-32"
    >
      <Container size="lg">
        <div className="mx-auto max-w-3xl text-center">
          {/* Visually hidden label for accessibility */}
          <span id="hero-heading" className="sr-only">
            WebCraft Hero Section
          </span>

          {/* Main content */}
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
        <div className="bg-primary-50 absolute -top-1/2 left-1/2 h-[800px] w-[800px] -translate-x-1/2 rounded-full opacity-50 blur-3xl" />
      </div>
    </section>
  );
}
