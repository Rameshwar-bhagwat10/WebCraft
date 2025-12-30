/**
 * Our Values Section
 * Core principles that guide our work
 *
 * Server Component - no client JS needed
 */

import { Container, Section } from '@/components/layout';
import { Heading, Text } from '@/components/ui';

/**
 * Core values - authentic, no corporate jargon
 */
const values = [
  {
    title: 'Quality Over Shortcuts',
    description:
      'We take the time to do things right. Cutting corners creates problems later, and we build for the long term.',
    icon: (
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
        <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    ),
  },
  {
    title: 'Performance Matters',
    description:
      'Speed affects everything—user experience, search rankings, and conversions. We optimize from the start.',
    icon: (
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
        <path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z" />
      </svg>
    ),
  },
  {
    title: 'Clear Communication',
    description:
      'No jargon, no surprises. We explain things plainly and keep you informed throughout the project.',
    icon: (
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
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
  },
  {
    title: 'Long-Term Thinking',
    description:
      'We build relationships, not just websites. Your success is our success, and we plan for growth.',
    icon: (
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
        <path d="M12 20V10" />
        <path d="M18 20V4" />
        <path d="M6 20v-4" />
      </svg>
    ),
  },
];

function ValueCard({
  title,
  description,
  icon,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
}): React.ReactElement {
  return (
    <div className="flex gap-4">
      {/* Icon */}
      <div
        className="bg-primary-50 text-primary-600 flex h-12 w-12 shrink-0 items-center justify-center rounded-lg"
        aria-hidden="true"
      >
        {icon}
      </div>

      {/* Content */}
      <div>
        <h3 className="text-foreground mb-2 text-lg font-semibold">{title}</h3>
        <Text variant="secondary" className="leading-relaxed">
          {description}
        </Text>
      </div>
    </div>
  );
}

export function OurValues(): React.ReactElement {
  return (
    <Section size="lg" background="secondary" aria-labelledby="values-heading">
      <Container>
        <div className="mx-auto mb-12 max-w-2xl text-center sm:mb-16">
          <Heading level={2} id="values-heading" className="mb-4">
            What We Believe
          </Heading>
          <Text variant="secondary" size="lg">
            The principles that guide how we work and the decisions we make.
          </Text>
        </div>

        {/* Values grid */}
        <div className="mx-auto grid max-w-4xl gap-10 sm:grid-cols-2 lg:gap-12">
          {values.map((value) => (
            <ValueCard
              key={value.title}
              title={value.title}
              description={value.description}
              icon={value.icon}
            />
          ))}
        </div>
      </Container>
    </Section>
  );
}
