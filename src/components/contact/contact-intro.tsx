/**
 * Contact Intro Section
 * Reassures visitors and reduces hesitation
 *
 * Server Component - no client JS needed
 */

import { Container, Section } from '@/components/layout';
import { Text } from '@/components/ui';

export function ContactIntro(): React.ReactElement {
  return (
    <Section size="lg" background="primary" aria-labelledby="contact-heading">
      <Container size="md">
        <div className="mx-auto max-w-2xl text-center">
          <h1
            id="contact-heading"
            className="text-foreground mb-6 text-4xl font-bold tracking-tight sm:text-5xl"
          >
            Let&apos;s Talk About Your Project
          </h1>
          <Text variant="secondary" size="lg" className="text-pretty">
            Have a project in mind? We&apos;d love to hear about it. Fill out
            the form below and we&apos;ll get back to you within one business
            day.
          </Text>
        </div>
      </Container>
    </Section>
  );
}
