/**
 * Pricing Intro Section
 * Sets expectations before showing pricing
 *
 * Server Component - no client JS needed
 */

import { Container, Section } from '@/components/layout';
import { Text } from '@/components/ui';

export function PricingIntro(): React.ReactElement {
  return (
    <Section size="lg" background="primary" aria-labelledby="pricing-heading">
      <Container size="md">
        <div className="mx-auto max-w-3xl text-center">
          <h1
            id="pricing-heading"
            className="text-foreground mb-6 text-4xl font-bold tracking-tight sm:text-5xl"
          >
            Transparent Pricing
          </h1>
          <Text variant="secondary" size="lg" className="text-pretty">
            Every project is unique, so our pricing reflects that. Below are
            starting points for common project types. We&apos;ll provide a
            detailed quote after understanding your specific needs.
          </Text>
        </div>
      </Container>
    </Section>
  );
}
