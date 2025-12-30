/**
 * Our Process Section
 * Explains how WebCraft works with clients
 *
 * Server Component - no client JS needed
 * Enhanced with animations and visual polish
 */

import { Container, Section } from '@/components/layout';
import { Heading, Text } from '@/components/ui';
import { cn } from '@/lib/utils';

/**
 * Process steps - clear and realistic
 */
const processSteps = [
  {
    number: '01',
    title: 'Understand',
    description:
      'We start by listening. Understanding your business, goals, and challenges helps us build the right solution.',
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
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.3-4.3" />
      </svg>
    ),
  },
  {
    number: '02',
    title: 'Design & Build',
    description:
      'We create clean, purposeful designs and write maintainable code that performs well and scales with your needs.',
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
        <path d="m18 16 4-4-4-4" />
        <path d="m6 8-4 4 4 4" />
        <path d="m14.5 4-5 16" />
      </svg>
    ),
  },
  {
    number: '03',
    title: 'Test & Refine',
    description:
      'Every feature is tested across devices and browsers. We refine until the experience feels right.',
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
    number: '04',
    title: 'Launch & Support',
    description:
      'We handle deployment and stay available for questions, updates, and ongoing improvements.',
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
        <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
        <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
        <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
        <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
      </svg>
    ),
  },
];

interface ProcessStepProps {
  number: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  index: number;
  isLast: boolean;
}

function ProcessStep({
  number,
  title,
  description,
  icon,
  index,
  isLast,
}: ProcessStepProps): React.ReactElement {
  return (
    <li
      className={cn(
        'motion-slide-up group relative list-none',
        'flex flex-col items-center text-center'
      )}
      style={
        {
          '--motion-delay': `${0.2 + index * 0.1}s`,
          '--motion-duration': '0.5s',
        } as React.CSSProperties
      }
    >
      {/* Connector line - visible on lg */}
      {!isLast && (
        <div
          className="from-primary-200 via-primary-300 to-primary-200 absolute top-12 left-1/2 hidden h-0.5 w-full bg-gradient-to-r lg:block"
          aria-hidden="true"
        />
      )}

      {/* Step card */}
      <div
        className={cn(
          'relative z-10 mb-6 flex h-24 w-24 flex-col items-center justify-center rounded-2xl',
          'bg-background border-border border-2 shadow-lg',
          'transition-all duration-300',
          'group-hover:border-primary-300 group-hover:shadow-primary-100/50 group-hover:shadow-xl'
        )}
      >
        {/* Icon */}
        <div
          className="text-primary-600 mb-1 transition-transform duration-300 group-hover:scale-110"
          aria-hidden="true"
        >
          {icon}
        </div>
        {/* Step number */}
        <span className="text-primary-600 text-xs font-bold" aria-hidden="true">
          {number}
        </span>
      </div>

      {/* Content */}
      <h3 className="text-foreground group-hover:text-primary-700 mb-2 text-xl font-semibold transition-colors duration-200">
        {title}
      </h3>

      <Text
        variant="secondary"
        className="max-w-[250px] text-sm leading-relaxed"
      >
        {description}
      </Text>
    </li>
  );
}

export function OurProcess(): React.ReactElement {
  return (
    <Section size="lg" background="secondary" aria-labelledby="process-heading">
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
            <Heading level={2} id="process-heading" className="mb-4">
              How We Work
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
              A straightforward process focused on understanding your needs and
              delivering quality results.
            </Text>
          </div>
        </div>

        {/* Process steps - ordered list for semantics */}
        <ol className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {processSteps.map((step, index) => (
            <ProcessStep
              key={step.number}
              number={step.number}
              title={step.title}
              description={step.description}
              icon={step.icon}
              index={index}
              isLast={index === processSteps.length - 1}
            />
          ))}
        </ol>
      </Container>
    </Section>
  );
}
