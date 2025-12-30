/**
 * Services CTA Section
 * Final call-to-action at the bottom of the services page
 *
 * Server Component - no client JS needed
 */

import Link from 'next/link';

import { Container, Section } from '@/components/layout';
import { Button } from '@/components/ui';
import { Heading, Text } from '@/components/ui';

export function ServicesCTA(): React.ReactElement {
  return (
    <Section size="lg" background="primary" aria-label="Get started">
      <Container size="md">
        <div className="mx-auto max-w-2xl text-center">
          <Heading level={2} className="mb-4">
            Ready to Get Started?
          </Heading>
          <Text variant="secondary" size="lg" className="mb-8">
            Not sure which service is right for you? Let&apos;s talk. We&apos;ll
            help you figure out the best approach for your specific situation.
          </Text>

          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Button asChild size="lg">
              <Link href="/contact">Get Free Consultation</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/about">Learn About Our Process</Link>
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
