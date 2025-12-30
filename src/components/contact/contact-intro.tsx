/**
 * Contact Intro Section
 * Premium hero with reassurance and trust indicators
 *
 * Server Component - no client JS needed
 */

import { Container, Section } from '@/components/layout';
import { Text } from '@/components/ui';

/**
 * Trust indicators for contact page
 */
const trustPoints = [
  {
    icon: (
      <svg
        className="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
    text: 'Response within 24 hours',
  },
  {
    icon: (
      <svg
        className="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
        />
      </svg>
    ),
    text: 'No obligation consultation',
  },
  {
    icon: (
      <svg
        className="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"
        />
      </svg>
    ),
    text: 'Direct communication',
  },
];

export function ContactIntro(): React.ReactElement {
  return (
    <Section
      size="lg"
      background="primary"
      aria-labelledby="contact-heading"
      className="relative overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10" aria-hidden="true">
        <div className="motion-float motion-pulse-glow bg-primary-100 absolute -top-1/2 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full opacity-50 blur-3xl" />
        <div
          className="motion-float bg-primary-50 absolute -right-1/4 -bottom-1/4 h-[400px] w-[400px] rounded-full opacity-40 blur-3xl"
          style={{ animationDelay: '-10s' }}
        />
      </div>

      <Container size="md">
        <div className="mx-auto max-w-2xl pt-8 text-center sm:pt-12">
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
              Get In Touch
            </p>
          </div>

          {/* H1 */}
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
              id="contact-heading"
              className="text-foreground mb-6 text-4xl font-bold tracking-tight text-balance sm:text-5xl"
            >
              Let&apos;s Talk About{' '}
              <span className="text-primary-600 relative">
                Your Project
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
              className="mx-auto max-w-xl text-pretty sm:text-xl"
            >
              Have a project in mind? We&apos;d love to hear about it. Fill out
              the form below and we&apos;ll get back to you within one business
              day.
            </Text>
          </div>

          {/* Trust indicators */}
          <div
            className="motion-slide-up mt-10 flex flex-wrap items-center justify-center gap-6"
            style={
              {
                '--motion-delay': '0.3s',
                '--motion-duration': '0.5s',
              } as React.CSSProperties
            }
          >
            {trustPoints.map((point) => (
              <div key={point.text} className="flex items-center gap-2 text-sm">
                <span className="text-primary-600">{point.icon}</span>
                <span className="text-foreground-secondary">{point.text}</span>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  );
}
