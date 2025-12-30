/**
 * Process Section Component
 * Shows the step-by-step workflow to build trust and transparency
 *
 * Server Component - no client JS needed
 * Mobile-first responsive design
 */

import { Container, Section } from '@/components/layout';
import { Heading, Text } from '@/components/ui';
import { cn } from '@/lib/utils';

/**
 * Process step data
 */
const processSteps = [
  {
    number: '01',
    title: 'Discovery',
    description:
      'We learn about your business, goals, and target audience to create a tailored strategy.',
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
    title: 'Design',
    description:
      'We craft wireframes and visual designs that align with your brand and user expectations.',
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
        <path d="M12 19V5" />
        <path d="M5 12l7-7 7 7" />
        <rect x="3" y="3" width="18" height="18" rx="2" />
      </svg>
    ),
  },
  {
    number: '03',
    title: 'Development',
    description:
      'We build your solution with clean, performant code and keep you updated throughout.',
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
    number: '04',
    title: 'Launch',
    description:
      'We deploy, test thoroughly, and provide ongoing support to ensure your success.',
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
    <div
      className="motion-slide-up group relative"
      style={
        {
          '--motion-delay': `${0.1 + index * 0.1}s`,
          '--motion-duration': '0.5s',
        } as React.CSSProperties
      }
    >
      {/* Connector line - hidden on mobile, visible on lg */}
      {!isLast && (
        <div
          className="from-primary-200 via-primary-300 to-primary-200 absolute top-12 left-1/2 hidden h-0.5 w-full bg-gradient-to-r lg:block"
          aria-hidden="true"
        />
      )}

      {/* Step card */}
      <div className="relative flex flex-col items-center text-center">
        {/* Number badge */}
        <div
          className={cn(
            'relative z-10 mb-4 flex h-24 w-24 flex-col items-center justify-center rounded-2xl',
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
          <span className="text-primary-600 text-xs font-bold">{number}</span>
        </div>

        {/* Content */}
        <h3 className="text-foreground group-hover:text-primary-700 mb-2 text-xl font-semibold transition-colors duration-200">
          {title}
        </h3>
        <p className="text-foreground-secondary max-w-[250px] text-sm leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
}

export function ProcessSection(): React.ReactElement {
  return (
    <Section size="lg" background="primary" aria-labelledby="process-heading">
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
              A transparent, collaborative process that keeps you informed every
              step of the way.
            </Text>
          </div>
        </div>

        {/* Process steps grid */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
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
        </div>
      </Container>
    </Section>
  );
}
