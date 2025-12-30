/**
 * Pricing Notes Section
 * Important disclaimers and clarifications
 *
 * Server Component - no client JS needed
 */

import { Container, Section } from '@/components/layout';
import { Heading, Text } from '@/components/ui';

import { pricingNotes } from './pricing-data';

export function PricingNotes(): React.ReactElement {
  return (
    <Section
      size="md"
      background="primary"
      aria-labelledby="pricing-notes-heading"
    >
      <Container size="md">
        <div className="mx-auto max-w-2xl">
          <Heading
            level={2}
            id="pricing-notes-heading"
            className="mb-6 text-center"
          >
            Good to Know
          </Heading>

          <ul className="space-y-4">
            {pricingNotes.map((note, index) => (
              <li key={index} className="flex items-start gap-3">
                <svg
                  className="text-primary-500 mt-1 h-5 w-5 shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <Text variant="secondary">{note}</Text>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </Section>
  );
}
