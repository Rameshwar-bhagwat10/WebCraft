/**
 * Closing Statement Section
 * Final trust-building statement (non-CTA)
 *
 * Server Component - no client JS needed
 */

import { Container, Section } from '@/components/layout';
import { Text } from '@/components/ui';

export function ClosingStatement(): React.ReactElement {
  return (
    <Section size="lg" background="primary" aria-label="Closing statement">
      <Container size="sm">
        <div className="mx-auto max-w-2xl text-center">
          {/* Decorative quote mark */}
          <div
            className="text-primary-100 mx-auto mb-6 text-6xl font-serif leading-none"
            aria-hidden="true"
          >
            &ldquo;
          </div>

          <Text
            variant="body"
            size="lg"
            className="mb-6 text-xl leading-relaxed sm:text-2xl"
          >
            We measure success by the quality of our work and the trust of our
            clients. Every project is an opportunity to build something we can
            all be proud of.
          </Text>

          <Text variant="muted" className="text-sm">
            — The WebCraft Team
          </Text>
        </div>
      </Container>
    </Section>
  );
}
