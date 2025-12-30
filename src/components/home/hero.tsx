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
 * - Premium entrance animations (CSS-only)
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
    <div
      className="motion-slide-up"
      style={
        {
          '--motion-delay': '0s',
          '--motion-duration': '0.6s',
        } as React.CSSProperties
      }
    >
      <p className="text-primary-600 mb-4 text-sm font-semibold tracking-wider uppercase sm:text-base">
        Web Development Agency
      </p>
    </div>
  );
}

/**
 * Hero headline - the primary value proposition
 * Uses H1 for SEO (only one per page)
 * Balanced line length for readability
 */
function HeroHeadline(): React.ReactElement {
  return (
    <div
      className="motion-slide-up"
      style={
        {
          '--motion-delay': '0.1s',
          '--motion-duration': '0.6s',
        } as React.CSSProperties
      }
    >
      <h1 className="text-foreground text-4xl font-bold tracking-tight text-balance sm:text-5xl lg:text-6xl xl:text-7xl">
        Websites that{' '}
        <span className="text-primary-600 relative">
          grow your business
          {/* Subtle underline accent */}
          <span
            className="bg-primary-200 absolute -bottom-1 left-0 h-1 w-full rounded-full opacity-60"
            aria-hidden="true"
          />
        </span>
      </h1>
    </div>
  );
}

/**
 * Hero subheadline - supporting value proposition
 * Explains what we do and for whom
 * Optimized line length (50-75 chars) for readability
 */
function HeroSubheadline(): React.ReactElement {
  return (
    <div
      className="motion-slide-up"
      style={
        {
          '--motion-delay': '0.2s',
          '--motion-duration': '0.6s',
        } as React.CSSProperties
      }
    >
      <p className="text-foreground-secondary mx-auto mt-6 max-w-xl text-lg leading-relaxed text-pretty sm:text-xl lg:mt-8 lg:text-2xl">
        We craft high-performance websites that convert visitors into customers.
        From startups to enterprises.
      </p>
    </div>
  );
}

/**
 * Hero CTA buttons
 * Primary: High-conversion action (stands out)
 * Secondary: Lower commitment option (subtle)
 *
 * Enhanced with micro-interactions
 */
function HeroCTA(): React.ReactElement {
  return (
    <div
      className="motion-slide-up mt-10 flex flex-col items-center gap-4 sm:mt-12 sm:flex-row sm:justify-center sm:gap-6 lg:mt-14"
      style={
        {
          '--motion-delay': '0.3s',
          '--motion-duration': '0.6s',
        } as React.CSSProperties
      }
    >
      {/* Primary CTA - most prominent, action-oriented */}
      <Button
        asChild
        size="lg"
        className="min-w-[200px] shadow-lg transition-all duration-200 hover:scale-[1.02] hover:shadow-xl active:scale-[0.98]"
      >
        <Link href="/contact">Get Free Consultation</Link>
      </Button>

      {/* Secondary CTA - lower commitment */}
      <Button
        asChild
        variant="ghost"
        size="lg"
        className="group min-w-[160px] transition-all duration-200 hover:scale-[1.02]"
      >
        <Link href="/work">
          View Our Work
          <span
            aria-hidden="true"
            className="ml-2 inline-block transition-transform duration-200 group-hover:translate-x-1"
          >
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
 * Enhanced with pill-style badges
 */
function TrustBadges(): React.ReactElement {
  const companies = ['TechCorp', 'StartupX', 'GrowthCo', 'InnovateLab'];

  return (
    <div
      className="motion-fade-in border-border/50 mt-16 border-t pt-8 sm:mt-20 sm:pt-10"
      style={
        {
          '--motion-delay': '0.5s',
          '--motion-duration': '0.8s',
        } as React.CSSProperties
      }
    >
      <p className="text-foreground-muted mb-6 text-sm">
        Trusted by innovative companies
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
        {companies.map((company, index) => (
          <span
            key={company}
            className="motion-scale-in border-border/60 bg-background/80 text-foreground-secondary hover:border-primary-200 hover:bg-primary-50/50 rounded-full border px-4 py-1.5 text-sm font-medium backdrop-blur-sm transition-all duration-200"
            style={
              {
                '--motion-delay': `${0.6 + index * 0.1}s`,
                '--motion-duration': '0.4s',
              } as React.CSSProperties
            }
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
 * Background: Enhanced gradient with subtle ambient motion
 */
export function Hero(): React.ReactElement {
  return (
    <section
      aria-label="Hero"
      className="bg-background relative isolate overflow-hidden pt-24 pb-16 sm:pt-32 sm:pb-24 lg:pt-40 lg:pb-32"
    >
      <Container size="lg">
        <div className="mx-auto max-w-4xl text-center">
          {/* Main content with clear hierarchy */}
          <HeroEyebrow />
          <HeroHeadline />
          <HeroSubheadline />
          <HeroCTA />
          <TrustBadges />
        </div>
      </Container>

      {/* Enhanced background decoration - CSS only, no images */}
      <div
        className="absolute inset-0 -z-10 overflow-hidden"
        aria-hidden="true"
      >
        {/* Primary gradient blob - enhanced with ambient motion */}
        <div className="motion-float motion-pulse-glow bg-primary-100 absolute -top-1/2 left-1/2 h-[1000px] w-[1000px] -translate-x-1/2 rounded-full opacity-70 blur-3xl" />
        {/* Secondary accent - offset animation timing */}
        <div
          className="motion-float bg-primary-50 absolute right-0 -bottom-1/4 h-[600px] w-[600px] rounded-full opacity-50 blur-3xl"
          style={{ animationDelay: '-10s' }}
        />
        {/* Tertiary accent for depth */}
        <div
          className="motion-float bg-primary-200/30 absolute top-1/4 -left-1/4 h-[400px] w-[400px] rounded-full blur-3xl"
          style={{ animationDelay: '-5s' }}
        />
      </div>

      {/* Subtle grid pattern for depth */}
      <div
        className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#8882_1px,transparent_1px),linear-gradient(to_bottom,#8882_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)] [background-size:4rem_4rem]"
        aria-hidden="true"
      />
    </section>
  );
}
