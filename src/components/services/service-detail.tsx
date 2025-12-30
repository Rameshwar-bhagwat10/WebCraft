/**
 * Service Detail Section
 * Detailed information about a single service
 *
 * Server Component - no client JS needed
 */

import Link from 'next/link';

import { Container, Section } from '@/components/layout';
import { Button } from '@/components/ui';
import { Heading, Text } from '@/components/ui';

import type { ServiceData } from './services-data';

interface ServiceDetailProps {
  service: ServiceData;
  /** Alternate background for visual rhythm */
  alternate?: boolean;
}

export function ServiceDetail({
  service,
  alternate = false,
}: ServiceDetailProps): React.ReactElement {
  return (
    <Section
      id={service.id}
      size="lg"
      background={alternate ? 'secondary' : 'primary'}
      aria-labelledby={`${service.id}-heading`}
      className="scroll-mt-20"
    >
      <Container size="lg">
        <div className="mx-auto max-w-4xl">
          {/* Section heading */}
          <Heading level={2} id={`${service.id}-heading`} className="mb-4">
            {service.title}
          </Heading>

          {/* Description */}
          <Text variant="secondary" size="lg" className="mb-10 max-w-3xl">
            {service.description}
          </Text>

          {/* Content grid */}
          <div className="grid gap-8 md:grid-cols-3 md:gap-12">
            {/* Who it's for */}
            <div>
              <h3 className="text-foreground mb-4 text-lg font-semibold">
                Who it&apos;s for
              </h3>
              <ul className="space-y-3">
                {service.whoItsFor.map((item, index) => (
                  <li
                    key={index}
                    className="text-foreground-secondary flex items-start gap-2 text-sm"
                  >
                    <svg
                      className="text-primary-500 mt-1 h-4 w-4 shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* What you get */}
            <div>
              <h3 className="text-foreground mb-4 text-lg font-semibold">
                What you get
              </h3>
              <ul className="space-y-3">
                {service.whatYouGet.map((item, index) => (
                  <li
                    key={index}
                    className="text-foreground-secondary flex items-start gap-2 text-sm"
                  >
                    <svg
                      className="text-primary-500 mt-1 h-4 w-4 shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Expected outcome */}
            <div>
              <h3 className="text-foreground mb-4 text-lg font-semibold">
                Expected outcome
              </h3>
              <div className="rounded-lg border border-primary-200 bg-primary-50 p-4">
                <Text variant="body" className="text-sm leading-relaxed">
                  {service.outcome}
                </Text>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
            <Button asChild size="lg">
              <Link href="/contact">Discuss Your Project</Link>
            </Button>
            <Text variant="muted" size="sm">
              Free consultation, no commitment required
            </Text>
          </div>
        </div>
      </Container>
    </Section>
  );
}
