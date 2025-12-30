/**
 * Services Overview Section
 * Top section with H1 and service cards grid
 *
 * Server Component - no client JS needed
 */

import Link from 'next/link';

import { Container, Section } from '@/components/layout';
import { Text } from '@/components/ui';

import { servicesData } from './services-data';

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
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-6 w-6"
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
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-6 w-6"
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
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-6 w-6"
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
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-6 w-6"
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
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-6 w-6"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  ),
};

function ServiceOverviewCard({
  id,
  title,
  shortDescription,
}: {
  id: string;
  title: string;
  shortDescription: string;
}): React.ReactElement {
  return (
    <Link
      href={`#${id}`}
      className="bg-background group block rounded-xl border border-border p-6 transition-all duration-200 hover:border-primary-200 hover:shadow-lg"
    >
      {/* Icon */}
      <div
        className="bg-primary-50 text-primary-600 mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg transition-colors duration-200 group-hover:bg-primary-100"
        aria-hidden="true"
      >
        {icons[id]}
      </div>

      {/* Title */}
      <h3 className="text-foreground mb-2 text-lg font-semibold">{title}</h3>

      {/* Description */}
      <p className="text-foreground-secondary text-sm leading-relaxed">
        {shortDescription}
      </p>

      {/* Learn more indicator */}
      <span className="text-primary-600 mt-4 inline-flex items-center text-sm font-medium">
        Learn more
        <svg
          className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </span>
    </Link>
  );
}

export function ServicesOverview(): React.ReactElement {
  return (
    <Section size="lg" background="primary" aria-labelledby="services-heading">
      <Container>
        {/* Page header */}
        <div className="mx-auto mb-12 max-w-3xl text-center sm:mb-16">
          <h1
            id="services-heading"
            className="text-foreground mb-6 text-4xl font-bold tracking-tight sm:text-5xl"
          >
            Services Built for Results
          </h1>
          <Text variant="secondary" size="lg" className="text-pretty">
            We offer a focused set of services designed to help your business
            succeed online. Each service is delivered with the same commitment
            to quality, performance, and clear communication.
          </Text>
        </div>

        {/* Services grid - using list for semantics */}
        <ul className="grid list-none gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {servicesData.map((service) => (
            <li key={service.id}>
              <ServiceOverviewCard
                id={service.id}
                title={service.title}
                shortDescription={service.shortDescription}
              />
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
