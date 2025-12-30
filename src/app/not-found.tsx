/**
 * 404 Not Found Page
 * Server Component - renders statically
 */

import Link from 'next/link';

import { Container, Section } from '@/components/layout';
import { Button, Heading, Text } from '@/components/ui';

export default function NotFound(): React.ReactElement {
  return (
    <Section size="lg">
      <Container size="sm" className="text-center">
        <Heading level={1} className="mb-2">
          404
        </Heading>
        <Heading level={2} visualLevel={4} className="mb-4">
          Page not found
        </Heading>
        <Text variant="muted" className="mb-8">
          The page you&apos;re looking for doesn&apos;t exist.
        </Text>
        <Button asChild>
          <Link href="/">Go back home</Link>
        </Button>
      </Container>
    </Section>
  );
}
