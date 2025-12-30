/**
 * Why WebCraft Section
 * Trust-building section answering "Why should I choose WebCraft?"
 *
 * Server Component - no client JS needed
 * Authentic, professional tone - no marketing fluff
 * Enhanced with subtle animations and improved visual rhythm
 */

import { Container, Section } from '@/components/layout';
import { Heading, Text } from '@/components/ui';

/**
 * Trust point data - authentic, no exaggeration
 */
const trustPoints = [
  {
    headline: 'Performance-First Development',
    description:
      'Every line of code is written with speed in mind. Fast sites rank better and convert more.',
  },
  {
    headline: 'Clean, Scalable Code',
    description:
      'We build maintainable systems that grow with your business, not technical debt that holds you back.',
  },
  {
    headline: 'Clear Communication',
    description:
      "No jargon, no surprises. You'll always know where your project stands and what comes next.",
  },
  {
    headline: 'Reliable Delivery',
    description:
      'We set realistic timelines and meet them. Your launch date matters to us as much as it does to you.',
  },
];

function TrustPoint({
  headline,
  description,
  index,
}: {
  headline: string;
  description: string;
  index: number;
}): React.ReactElement {
  return (
    <div
      className="motion-slide-up group hover:bg-primary-50/50 relative rounded-lg py-4 pl-8 transition-colors duration-200"
      style={
        {
          '--motion-delay': `${0.2 + index * 0.1}s`,
          '--motion-duration': '0.5s',
        } as React.CSSProperties
      }
    >
      {/* Animated accent line */}
      <div
        className="bg-primary-500 group-hover:bg-primary-600 absolute top-4 left-0 h-6 w-1 origin-top rounded-full transition-all duration-300 group-hover:h-8"
        aria-hidden="true"
      />
      <h3 className="text-foreground group-hover:text-primary-700 mb-2 text-lg font-semibold transition-colors duration-200">
        {headline}
      </h3>
      <p className="text-foreground-secondary leading-relaxed">{description}</p>
    </div>
  );
}

export function WhyWebCraft(): React.ReactElement {
  return (
    <Section
      size="lg"
      background="primary"
      aria-labelledby="why-webcraft-heading"
    >
      <Container>
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left column - heading */}
          <div>
            <div
              className="motion-slide-up"
              style={
                {
                  '--motion-delay': '0s',
                  '--motion-duration': '0.5s',
                } as React.CSSProperties
              }
            >
              <Heading level={2} id="why-webcraft-heading" className="mb-4">
                Why Work With Us
              </Heading>
            </div>
            <div
              className="motion-slide-up"
              style={
                {
                  '--motion-delay': '0.1s',
                  '--motion-duration': '0.5s',
                } as React.CSSProperties
              }
            >
              <Text variant="secondary" size="lg" className="max-w-md">
                We&apos;re not the biggest agency, and that&apos;s by design. We
                focus on doing great work for clients who value quality over
                quantity.
              </Text>
            </div>
          </div>

          {/* Right column - trust points with improved spacing */}
          <div className="space-y-2">
            {trustPoints.map((point, index) => (
              <TrustPoint
                key={point.headline}
                headline={point.headline}
                description={point.description}
                index={index}
              />
            ))}
          </div>
        </div>
      </Container>
    </Section>
  );
}
