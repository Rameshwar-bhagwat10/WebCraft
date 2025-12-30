/**
 * Why WebCraft Section
 * Trust-building section answering "Why should I choose WebCraft?"
 *
 * Server Component - no client JS needed
 * Authentic, professional tone - no marketing fluff
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
}: {
  headline: string;
  description: string;
}): React.ReactElement {
  return (
    <div className="relative pl-8">
      {/* Accent line */}
      <div
        className="bg-primary-500 absolute left-0 top-1 h-6 w-1 rounded-full"
        aria-hidden="true"
      />
      <h3 className="text-foreground mb-2 text-lg font-semibold">{headline}</h3>
      <p className="text-foreground-secondary leading-relaxed">{description}</p>
    </div>
  );
}

export function WhyWebCraft(): React.ReactElement {
  return (
    <Section size="lg" background="primary" aria-labelledby="why-webcraft-heading">
      <Container>
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left column - heading */}
          <div>
            <Heading level={2} id="why-webcraft-heading" className="mb-4">
              Why Work With Us
            </Heading>
            <Text variant="secondary" size="lg" className="max-w-md">
              We&apos;re not the biggest agency, and that&apos;s by design. We focus on
              doing great work for clients who value quality over quantity.
            </Text>
          </div>

          {/* Right column - trust points */}
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-1 lg:gap-6">
            {trustPoints.map((point) => (
              <TrustPoint
                key={point.headline}
                headline={point.headline}
                description={point.description}
              />
            ))}
          </div>
        </div>
      </Container>
    </Section>
  );
}
