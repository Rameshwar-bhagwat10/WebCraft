/**
 * About Intro Section (Enhanced Hero)
 * Who we are - the opening section of the About page
 *
 * Server Component - no client JS needed
 * Contains the only H1 on the page
 * Enhanced with gradient background and animations
 */

import { Container, Section } from '@/components/layout';
import { Text } from '@/components/ui';

export function AboutIntro(): React.ReactElement {
  return (
    <Section
      size="lg"
      background="primary"
      aria-labelledby="about-heading"
      className="relative overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10" aria-hidden="true">
        {/* Primary gradient blob */}
        <div className="motion-float motion-pulse-glow bg-primary-100 absolute -top-1/2 left-1/2 h-[800px] w-[800px] -translate-x-1/2 rounded-full opacity-60 blur-3xl" />
        {/* Secondary accent */}
        <div
          className="motion-float bg-primary-50 absolute -right-1/4 -bottom-1/4 h-[500px] w-[500px] rounded-full opacity-50 blur-3xl"
          style={{ animationDelay: '-10s' }}
        />
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8882_1px,transparent_1px),linear-gradient(to_bottom,#8882_1px,transparent_1px)] mask-[radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)] bg-size-[4rem_4rem]" />
      </div>

      <Container size="md">
        <div className="mx-auto max-w-3xl pt-8 text-center sm:pt-12">
          {/* Eyebrow */}
          <div
            className="motion-slide-up"
            style={
              {
                '--motion-delay': '0s',
                '--motion-duration': '0.6s',
              } as React.CSSProperties
            }
          >
            <p className="text-primary-600 mb-4 text-sm font-semibold tracking-wider uppercase">
              About WebCraft
            </p>
          </div>

          {/* Page H1 - only one per page */}
          <div
            className="motion-slide-up"
            style={
              {
                '--motion-delay': '0.1s',
                '--motion-duration': '0.6s',
              } as React.CSSProperties
            }
          >
            <h1
              id="about-heading"
              className="text-foreground mb-6 text-4xl font-bold tracking-tight text-balance sm:text-5xl lg:text-6xl"
            >
              We Build Websites{' '}
              <span className="text-primary-600 relative">
                That Work
                <span
                  className="bg-primary-200 absolute -bottom-1 left-0 h-1 w-full rounded-full opacity-60"
                  aria-hidden="true"
                />
              </span>
            </h1>
          </div>

          {/* Description */}
          <div
            className="motion-slide-up"
            style={
              {
                '--motion-delay': '0.2s',
                '--motion-duration': '0.6s',
              } as React.CSSProperties
            }
          >
            <Text
              variant="secondary"
              size="lg"
              className="mx-auto max-w-2xl text-pretty sm:text-xl"
            >
              WebCraft is a web development studio focused on creating
              high-performance websites and applications for businesses that
              value quality. We believe great digital products come from
              understanding real problems and solving them with clean,
              maintainable code.
            </Text>
          </div>

          {/* Quick stats */}
          <div
            className="motion-slide-up mt-12 grid grid-cols-3 gap-8 sm:mt-16"
            style={
              {
                '--motion-delay': '0.3s',
                '--motion-duration': '0.6s',
              } as React.CSSProperties
            }
          >
            {[
              { value: '50+', label: 'Projects Delivered' },
              { value: '100%', label: 'Client Satisfaction' },
              { value: '24h', label: 'Response Time' },
            ].map((stat, index) => (
              <div
                key={stat.label}
                className="motion-scale-in"
                style={
                  {
                    '--motion-delay': `${0.4 + index * 0.1}s`,
                    '--motion-duration': '0.4s',
                  } as React.CSSProperties
                }
              >
                <div className="text-primary-600 text-3xl font-bold sm:text-4xl">
                  {stat.value}
                </div>
                <div className="text-foreground-muted mt-1 text-sm">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  );
}
