/**
 * About Intro Section
 * Who we are - the opening section of the About page
 *
 * Server Component - no client JS needed
 * Contains the only H1 on the page
 */

import { Container, Section } from '@/components/layout';
import { Text } from '@/components/ui';

export function AboutIntro(): React.ReactElement {
  return (
    <Section size="lg" background="primary" aria-labelledby="about-heading">
      <Container size="md">
        <div className="mx-auto max-w-3xl text-center">
          {/* Page H1 - only one per page */}
          <h1
            id="about-heading"
            className="text-foreground mb-6 text-4xl font-bold tracking-tight sm:text-5xl"
          >
            We Build Websites That Work
          </h1>

          <Text variant="secondary" size="lg" className="text-pretty">
            WebCraft is a web development studio focused on creating
            high-performance websites and applications for businesses that value
            quality. We believe great digital products come from understanding
            real problems and solving them with clean, maintainable code.
          </Text>
        </div>
      </Container>
    </Section>
  );
}
