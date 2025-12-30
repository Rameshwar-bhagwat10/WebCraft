/**
 * About CTA Section Component
 * Final call-to-action for the About page
 *
 * Server Component - no client JS needed
 * Drives conversions with compelling messaging
 */

import Link from 'next/link';

import { Container, Section } from '@/components/layout';
import { Button } from '@/components/ui';
import { cn } from '@/lib/utils';

export function AboutCTA(): React.ReactElement {
  return (
    <Section size="lg" background="primary" aria-labelledby="about-cta-heading">
      <Container size="md">
        <div
          className={cn(
            'motion-slide-up relative overflow-hidden rounded-3xl',
            'from-primary-600 via-primary-700 to-primary-800 bg-gradient-to-br',
            'px-6 py-16 text-center sm:px-12 sm:py-20'
          )}
          style={
            {
              '--motion-delay': '0s',
              '--motion-duration': '0.6s',
            } as React.CSSProperties
          }
        >
          {/* Background decoration */}
          <div
            className="absolute inset-0 overflow-hidden opacity-10"
            aria-hidden="true"
          >
            {/* Grid pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] [background-size:3rem_3rem]" />
            {/* Gradient orbs */}
            <div className="absolute -top-1/2 -right-1/4 h-[500px] w-[500px] rounded-full bg-white/20 blur-3xl" />
            <div className="absolute -bottom-1/2 -left-1/4 h-[400px] w-[400px] rounded-full bg-white/10 blur-3xl" />
          </div>

          {/* Content */}
          <div className="relative z-10">
            {/* Eyebrow */}
            <p
              className="motion-slide-up mb-4 text-sm font-medium tracking-wider text-white/80 uppercase"
              style={
                {
                  '--motion-delay': '0.1s',
                  '--motion-duration': '0.5s',
                } as React.CSSProperties
              }
            >
              Ready to work together?
            </p>

            {/* Headline */}
            <h2
              id="about-cta-heading"
              className="motion-slide-up mx-auto mb-6 max-w-2xl text-3xl font-bold tracking-tight text-balance text-white sm:text-4xl lg:text-5xl"
              style={
                {
                  '--motion-delay': '0.2s',
                  '--motion-duration': '0.5s',
                } as React.CSSProperties
              }
            >
              Let&apos;s discuss your project
            </h2>

            {/* Supporting text */}
            <p
              className="motion-slide-up mx-auto mb-10 max-w-lg text-lg text-pretty text-white/80"
              style={
                {
                  '--motion-delay': '0.3s',
                  '--motion-duration': '0.5s',
                } as React.CSSProperties
              }
            >
              We&apos;d love to hear about your goals and explore how we can
              help. Schedule a free consultation — no strings attached.
            </p>

            {/* CTA buttons */}
            <div
              className="motion-slide-up flex flex-col items-center justify-center gap-4 sm:flex-row"
              style={
                {
                  '--motion-delay': '0.4s',
                  '--motion-duration': '0.5s',
                } as React.CSSProperties
              }
            >
              {/* Primary CTA */}
              <Button
                asChild
                size="lg"
                className="text-primary-700 min-w-[200px] bg-white shadow-lg transition-all duration-200 hover:scale-[1.02] hover:bg-white/90 hover:shadow-xl active:scale-[0.98]"
              >
                <Link href="/contact">Get in Touch</Link>
              </Button>

              {/* Secondary option */}
              <Button
                asChild
                variant="ghost"
                size="lg"
                className="min-w-[160px] text-white hover:bg-white/10"
              >
                <Link href="/work">
                  See Our Work
                  <span aria-hidden="true" className="ml-2">
                    →
                  </span>
                </Link>
              </Button>
            </div>

            {/* Trust reassurance */}
            <p
              className="motion-fade-in mt-8 text-sm text-white/60"
              style={
                {
                  '--motion-delay': '0.6s',
                  '--motion-duration': '0.5s',
                } as React.CSSProperties
              }
            >
              ✓ Free consultation &nbsp;·&nbsp; ✓ No commitment &nbsp;·&nbsp; ✓
              Response within 24 hours
            </p>
          </div>
        </div>
      </Container>
    </Section>
  );
}
