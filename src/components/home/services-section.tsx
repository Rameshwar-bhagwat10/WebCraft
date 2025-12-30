/**
 * Services Section Component
 * Displays WebCraft's service offerings in a grid layout
 *
 * Server Component - no client JS needed
 * Mobile-first responsive grid
 */

import { Container, Section } from '@/components/layout';
import { Heading, Text } from '@/components/ui';

import { ServiceCard } from './service-card';

/**
 * SVG Icons for services
 * Lightweight, accessible, consistent sizing
 */
const icons = {
  website: (
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
  webapp: (
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
  mobile: (
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
  dashboard: (
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
  support: (
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

/**
 * Service data - outcome-focused descriptions
 */
const services = [
  {
    title: 'Business Websites',
    description:
      'Professional websites that represent your brand and convert visitors into customers.',
    icon: icons.website,
  },
  {
    title: 'Web Applications',
    description:
      'Custom web apps that streamline your operations and solve real business problems.',
    icon: icons.webapp,
  },
  {
    title: 'Mobile Apps',
    description:
      'Native and cross-platform apps that keep your customers engaged on any device.',
    icon: icons.mobile,
  },
  {
    title: 'UI & Dashboards',
    description:
      'Intuitive interfaces and data dashboards that make complex information actionable.',
    icon: icons.dashboard,
  },
  {
    title: 'Maintenance & Support',
    description:
      'Ongoing care to keep your digital products secure, fast, and up-to-date.',
    icon: icons.support,
  },
];

export function ServicesSection(): React.ReactElement {
  return (
    <Section size="lg" background="secondary" aria-labelledby="services-heading">
      <Container>
        {/* Section header */}
        <div className="mx-auto mb-12 max-w-2xl text-center sm:mb-16">
          <Heading level={2} id="services-heading" className="mb-4">
            What We Build
          </Heading>
          <Text variant="secondary" size="lg">
            From concept to launch, we create digital products that help
            businesses grow.
          </Text>
        </div>

        {/* Services grid - auto-fit for flexible layout */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {services.map((service) => (
            <ServiceCard
              key={service.title}
              title={service.title}
              description={service.description}
              icon={service.icon}
            />
          ))}
        </div>
      </Container>
    </Section>
  );
}
