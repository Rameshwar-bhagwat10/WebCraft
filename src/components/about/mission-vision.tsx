/**
 * Mission & Vision Section
 * Shows long-term intent and seriousness
 *
 * Server Component - no client JS needed
 */

import { Container, Section } from '@/components/layout';
import { Heading, Text } from '@/components/ui';

export function MissionVision(): React.ReactElement {
  return (
    <Section
      size="lg"
      background="secondary"
      aria-labelledby="mission-vision-heading"
    >
      <Container size="md">
        <div className="mx-auto max-w-3xl">
          <Heading
            level={2}
            id="mission-vision-heading"
            className="mb-12 text-center"
          >
            Mission & Vision
          </Heading>

          <div className="grid gap-12 md:grid-cols-2 md:gap-16">
            {/* Mission */}
            <div>
              <h3 className="text-primary-600 mb-3 text-sm font-semibold uppercase tracking-wider">
                Our Mission
              </h3>
              <Text variant="body" size="lg" className="leading-relaxed">
                To help businesses succeed online by building fast, reliable,
                and user-friendly digital products that solve real problems.
              </Text>
            </div>

            {/* Vision */}
            <div>
              <h3 className="text-primary-600 mb-3 text-sm font-semibold uppercase tracking-wider">
                Our Vision
              </h3>
              <Text variant="body" size="lg" className="leading-relaxed">
                To be the trusted partner for businesses that want quality over
                shortcuts, building long-term relationships through honest work.
              </Text>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
