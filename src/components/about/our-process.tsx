/**
 * Our Process Section
 * Explains how WebCraft works with clients
 *
 * Server Component - no client JS needed
 */

import { Container, Section } from '@/components/layout';
import { Heading, Text } from '@/components/ui';

/**
 * Process steps - clear and realistic
 */
const processSteps = [
  {
    number: '01',
    title: 'Understand',
    description:
      'We start by listening. Understanding your business, goals, and challenges helps us build the right solution.',
  },
  {
    number: '02',
    title: 'Design & Build',
    description:
      'We create clean, purposeful designs and write maintainable code that performs well and scales with your needs.',
  },
  {
    number: '03',
    title: 'Test & Refine',
    description:
      'Every feature is tested across devices and browsers. We refine until the experience feels right.',
  },
  {
    number: '04',
    title: 'Launch & Support',
    description:
      'We handle deployment and stay available for questions, updates, and ongoing improvements.',
  },
];

function ProcessStep({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}): React.ReactElement {
  return (
    <div className="relative">
      {/* Step number */}
      <span
        className="text-primary-200 mb-4 block text-5xl font-bold"
        aria-hidden="true"
      >
        {number}
      </span>

      {/* Step title */}
      <h3 className="text-foreground mb-2 text-xl font-semibold">{title}</h3>

      {/* Step description */}
      <Text variant="secondary" className="leading-relaxed">
        {description}
      </Text>
    </div>
  );
}

export function OurProcess(): React.ReactElement {
  return (
    <Section size="lg" background="primary" aria-labelledby="process-heading">
      <Container>
        <div className="mx-auto mb-12 max-w-2xl text-center sm:mb-16">
          <Heading level={2} id="process-heading" className="mb-4">
            How We Work
          </Heading>
          <Text variant="secondary" size="lg">
            A straightforward process focused on understanding your needs and
            delivering quality results.
          </Text>
        </div>

        {/* Process steps grid */}
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {processSteps.map((step) => (
            <ProcessStep
              key={step.number}
              number={step.number}
              title={step.title}
              description={step.description}
            />
          ))}
        </div>
      </Container>
    </Section>
  );
}
