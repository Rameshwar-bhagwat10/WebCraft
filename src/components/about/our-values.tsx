/**
 * Our Values Section
 * Core principles that guide our work
 *
 * Server Component - no client JS needed
 * Enhanced with animations and card effects
 */

import { Container, Section } from '@/components/layout';
import { Heading, Text } from '@/components/ui';
import { cn } from '@/lib/utils';

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
    gradient: 'from-green-500/10 to-emerald-500/10',
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
    gradient: 'from-yellow-500/10 to-orange-500/10',
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
    gradient: 'from-blue-500/10 to-cyan-500/10',
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
    gradient: 'from-purple-500/10 to-pink-500/10',
  },
];

interface ValueCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  gradient: string;
  index: number;
}

function ValueCard({
  title,
  description,
  icon,
  gradient,
  index,
}: ValueCardProps): React.ReactElement {
  return (
    <div
      className={cn(
        'motion-slide-up group relative overflow-hidden rounded-2xl p-6',
        'bg-background border-border border',
        'transition-all duration-300',
        'hover:border-primary-200 hover:-translate-y-1 hover:shadow-xl'
      )}
      style={
        {
          '--motion-delay': `${0.2 + index * 0.1}s`,
          '--motion-duration': '0.5s',
        } as React.CSSProperties
      }
    >
      {/* Background gradient on hover */}
      <div
        className={cn(
          'absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity duration-300 group-hover:opacity-100',
          gradient
        )}
        aria-hidden="true"
      />

      {/* Content */}
      <div className="relative z-10">
        {/* Icon */}
        <div
          className="bg-primary-50 text-primary-600 group-hover:bg-primary-100 mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl transition-all duration-300 group-hover:scale-110"
          aria-hidden="true"
        >
          {icon}
        </div>

        {/* Title */}
        <h3 className="text-foreground group-hover:text-primary-700 mb-2 text-lg font-semibold transition-colors duration-200">
          {title}
        </h3>

        {/* Description */}
        <Text variant="secondary" className="leading-relaxed">
          {description}
        </Text>
      </div>
    </div>
  );
}

export function OurValues(): React.ReactElement {
  return (
    <Section size="lg" background="primary" aria-labelledby="values-heading">
      <Container>
        {/* Section header */}
        <div className="mx-auto mb-12 max-w-2xl text-center sm:mb-16">
          <div
            className="motion-slide-up"
            style={
              {
                '--motion-delay': '0s',
                '--motion-duration': '0.5s',
              } as React.CSSProperties
            }
          >
            <Heading level={2} id="values-heading" className="mb-4">
              What We Believe
            </Heading>
          </div>
          <div
            className="motion-slide-up"
            style={
              {
                '--motion-delay': '0.1s',
                '--motion-duration': '0.5s',
              } as React.CSSProperties
            }
          >
            <Text variant="secondary" size="lg">
              The principles that guide how we work and the decisions we make.
            </Text>
          </div>
        </div>

        {/* Values grid */}
        <div className="mx-auto grid max-w-4xl gap-6 sm:grid-cols-2">
          {values.map((value, index) => (
            <ValueCard
              key={value.title}
              title={value.title}
              description={value.description}
              icon={value.icon}
              gradient={value.gradient}
              index={index}
            />
          ))}
        </div>
      </Container>
    </Section>
  );
}
