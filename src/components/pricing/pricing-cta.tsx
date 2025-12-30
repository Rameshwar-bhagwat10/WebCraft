/**
 * Pricing CTA Section
 * Final call-to-action for the pricing page
 *
 * Server Component - no client JS needed
 */

import Link from 'next/link';

import { Container, Section } from '@/components/layout';
import { Button, Heading, Text } from '@/components/ui';

export function PricingCTA(): React.ReactElement {
  return (
    <Section size="lg" background="secondary" aria-label="Get a quote">
      <Container size="md">
        <div className="mx-auto max-w-2xl text-center">
          <Heading level={2} className="mb-4">
            Not Sure Which Plan Fits?
          </Heading>
          <Text variant="secondary" size="lg" className="mb-8">
            Every project is different. Tell us about yours and we&apos;ll
            recommend the best approach—no obligation, no pressure.
          </Text>

          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Button asChild size="lg">
              <Link href="/contact">Get a Custom Quote</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/work">See Our Work</Link>
            </Button>
          </div>

          <Text variant="muted" size="sm" className="mt-6">
            We respond to all inquiries within one business day.
          </Text>
        </div>
      </Container>
    </Section>
  );
}
