/**
 * Closing Statement Section
 * Final trust-building statement with quote
 *
 * Server Component - no client JS needed
 * Enhanced with animations and visual polish
 */

import { Container, Section } from '@/components/layout';
import { Text } from '@/components/ui';

export function ClosingStatement(): React.ReactElement {
  return (
    <Section
      size="lg"
      background="secondary"
      aria-label="Closing statement"
      className="relative overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10" aria-hidden="true">
        <div className="motion-float bg-primary-50 absolute -top-1/4 -left-1/4 h-[400px] w-[400px] rounded-full opacity-50 blur-3xl" />
        <div
          className="motion-float bg-primary-100 absolute -right-1/4 -bottom-1/4 h-[300px] w-[300px] rounded-full opacity-40 blur-3xl"
          style={{ animationDelay: '-8s' }}
        />
      </div>

      <Container size="sm">
        <figure
          className="motion-slide-up mx-auto max-w-2xl text-center"
          style={
            {
              '--motion-delay': '0s',
              '--motion-duration': '0.6s',
            } as React.CSSProperties
          }
        >
          {/* Decorative quote mark */}
          <div
            className="motion-scale-in text-primary-200 mx-auto mb-6 font-serif text-7xl leading-none sm:text-8xl"
            aria-hidden="true"
            style={
              {
                '--motion-delay': '0.1s',
                '--motion-duration': '0.5s',
              } as React.CSSProperties
            }
          >
            &ldquo;
          </div>

          <blockquote
            className="motion-slide-up"
            style={
              {
                '--motion-delay': '0.2s',
                '--motion-duration': '0.5s',
              } as React.CSSProperties
            }
          >
            <Text
              as="p"
              variant="body"
              className="mb-6 text-xl leading-relaxed text-balance sm:text-2xl lg:text-3xl"
            >
              We measure success by the quality of our work and the trust of our
              clients. Every project is an opportunity to build something we can
              all be proud of.
            </Text>
          </blockquote>

          <figcaption
            className="motion-fade-in"
            style={
              {
                '--motion-delay': '0.4s',
                '--motion-duration': '0.5s',
              } as React.CSSProperties
            }
          >
            <div className="bg-primary-500 mx-auto mb-4 h-1 w-12 rounded-full" />
            <Text variant="muted" as="span" className="text-sm font-medium">
              — Rameshwar Bhagwat, Founder
            </Text>
          </figcaption>
        </figure>
      </Container>
    </Section>
  );
}
