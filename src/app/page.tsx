/**
 * Home Page (Placeholder)
 * Server Component - renders statically
 *
 * This is a minimal placeholder for Phase 1-3.
 * Page sections will be built in Phase 4+.
 */

import { Container, Section } from '@/components/layout';
import { Heading, Text } from '@/components/ui';

export default function HomePage(): React.ReactElement {
  return (
    <Section size="lg">
      <Container size="md" className="text-center">
        <Heading level={1} className="mb-4">
          WebCraft
        </Heading>
        <Text variant="secondary" size="lg" className="mb-8">
          Professional web development services
        </Text>
        <Text variant="muted" size="sm">
          Phase 3 Complete — Layout & Navigation Ready
        </Text>
      </Container>
    </Section>
  );
}
