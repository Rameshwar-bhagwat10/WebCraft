/**
 * Service Detail Section
 * Detailed information about a single service
 *
 * Server Component - no client JS needed
 * Enhanced with animations and visual polish
 */

import Link from 'next/link';

import { Container, Section } from '@/components/layout';
import { Button, Heading, Text } from '@/components/ui';
import { cn } from '@/lib/utils';

import type { ServiceData } from './services-data';

/**
 * SVG Icons for services
 */
const icons: Record<string, React.ReactNode> = {
  'business-websites': (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-10 w-10"
    >
      <rect x="2" y="3" width="20" height="14" rx="2" />
      <path d="M8 21h8" />
      <path d="M12 17v4" />
    </svg>
  ),
  'web-applications': (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-10 w-10"
    >
      <path d="M18 3a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3H6a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3V6a3 3 0 0 0-3-3 3 3 0 0 0-3 3 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 3 3 0 0 0-3-3z" />
    </svg>
  ),
  'mobile-apps': (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-10 w-10"
    >
      <rect x="5" y="2" width="14" height="20" rx="2" />
      <path d="M12 18h.01" />
    </svg>
  ),
  'ui-dashboards': (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-10 w-10"
    >
      <rect x="3" y="3" width="7" height="9" rx="1" />
      <rect x="14" y="3" width="7" height="5" rx="1" />
      <rect x="14" y="12" width="7" height="9" rx="1" />
      <rect x="3" y="16" width="7" height="5" rx="1" />
    </svg>
  ),
  'maintenance-support': (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-10 w-10"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  ),
};

interface FeatureListProps {
  title: string;
  items: string[];
  delay: number;
}

function FeatureList({
  title,
  items,
  delay,
}: FeatureListProps): React.ReactElement {
  return (
    <div
      className="motion-slide-up"
      style={
        {
          '--motion-delay': `${delay}s`,
          '--motion-duration': '0.5s',
        } as React.CSSProperties
      }
    >
      <h3 className="text-foreground mb-4 text-lg font-semibold">{title}</h3>
      <ul className="space-y-3">
        {items.map((item, index) => (
          <li key={index} className="group flex items-start gap-3 text-sm">
            <span className="bg-primary-100 text-primary-600 group-hover:bg-primary-200 mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full transition-all duration-200 group-hover:scale-110">
              <svg
                className="h-3 w-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </span>
            <span className="text-foreground-secondary leading-relaxed">
              {item}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

interface ServiceDetailProps {
  service: ServiceData;
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
        <div className="mx-auto max-w-5xl">
          {/* Header with icon */}
          <div className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-start sm:gap-8">
            {/* Icon */}
            <div
              className="motion-scale-in bg-primary-50 text-primary-600 flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl"
              style={
                {
                  '--motion-delay': '0s',
                  '--motion-duration': '0.4s',
                } as React.CSSProperties
              }
              aria-hidden="true"
            >
              {icons[service.id]}
            </div>

            {/* Title and description */}
            <div>
              <div
                className="motion-slide-up"
                style={
                  {
                    '--motion-delay': '0.1s',
                    '--motion-duration': '0.5s',
                  } as React.CSSProperties
                }
              >
                <Heading
                  level={2}
                  id={`${service.id}-heading`}
                  className="mb-4"
                >
                  {service.title}
                </Heading>
              </div>
              <div
                className="motion-slide-up"
                style={
                  {
                    '--motion-delay': '0.2s',
                    '--motion-duration': '0.5s',
                  } as React.CSSProperties
                }
              >
                <Text variant="secondary" size="lg" className="max-w-3xl">
                  {service.description}
                </Text>
              </div>
            </div>
          </div>

          {/* Content grid */}
          <div className="grid gap-8 md:grid-cols-3 md:gap-10">
            <FeatureList
              title="Who it's for"
              items={service.whoItsFor}
              delay={0.3}
            />
            <FeatureList
              title="What you get"
              items={service.whatYouGet}
              delay={0.4}
            />

            {/* Expected outcome - special styling */}
            <div
              className="motion-slide-up"
              style={
                {
                  '--motion-delay': '0.5s',
                  '--motion-duration': '0.5s',
                } as React.CSSProperties
              }
            >
              <h3 className="text-foreground mb-4 text-lg font-semibold">
                Expected outcome
              </h3>
              <div
                className={cn(
                  'relative overflow-hidden rounded-xl p-5',
                  'from-primary-50 to-primary-100/50 bg-gradient-to-br',
                  'border-primary-200/50 border'
                )}
              >
                {/* Decorative accent */}
                <div
                  className="bg-primary-500 absolute top-0 left-0 h-full w-1 rounded-l-xl"
                  aria-hidden="true"
                />
                <Text variant="body" className="text-sm leading-relaxed">
                  {service.outcome}
                </Text>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div
            className="motion-slide-up mt-10 flex flex-col gap-4 sm:flex-row sm:items-center"
            style={
              {
                '--motion-delay': '0.6s',
                '--motion-duration': '0.5s',
              } as React.CSSProperties
            }
          >
            <Button
              asChild
              size="lg"
              className="transition-all duration-200 hover:scale-[1.02] hover:shadow-lg active:scale-[0.98]"
            >
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
