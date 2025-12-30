/**
 * Home Page (Placeholder)
 * Server Component - renders statically
 *
 * This is a minimal placeholder for Phase 1-2.
 * UI sections will be built in Phase 3+.
 */

import { Container, Section } from '@/components/layout';
import { Heading, Text } from '@/components/ui';

export default function HomePage(): React.ReactElement {
  return (
    <main id="main-content">
      <Section size="lg">
        <Container size="md" className="text-center">
          <Heading level={1} className="mb-4">
            WebCraft
          </Heading>
          <Text variant="secondary" size="lg" className="mb-8">
            Professional web development services
          </Text>
          <Text variant="muted" size="sm">
            Phase 2 Complete — Design System Ready
          </Text>
        </Container>
      </Section>
    </main>
  );
}
