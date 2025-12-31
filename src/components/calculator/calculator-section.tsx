/**
 * CalculatorSection Component
 * Wrapper section for the project cost calculator
 *
 * Server Component - calculator is client component
 */

import { Container, Section } from '@/components/layout';
import { Heading, Text } from '@/components/ui';

import { ProjectCostCalculator } from './project-cost-calculator';

export function CalculatorSection(): React.ReactElement {
  return (
    <Section
      size="lg"
      background="secondary"
      aria-labelledby="calculator-heading"
    >
      <Container size="sm">
        {/* Section header */}
        <div className="mx-auto mb-8 max-w-xl text-center sm:mb-10">
          <div
            className="motion-slide-up"
            style={
              {
                '--motion-delay': '0s',
                '--motion-duration': '0.5s',
              } as React.CSSProperties
            }
          >
            <p className="text-primary-600 mb-2 text-xs font-semibold tracking-wider uppercase sm:mb-3 sm:text-sm">
              Estimate Your Project
            </p>
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
            <Heading
              level={2}
              id="calculator-heading"
              className="mb-3 text-2xl sm:mb-4 sm:text-3xl"
            >
              Get an Instant Estimate
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
            <Text
              variant="secondary"
              size="lg"
              className="text-sm text-pretty sm:text-base"
            >
              Use our calculator to get a quick budget estimate for your
              project. No commitment required.
            </Text>
          </div>
        </div>

        {/* Calculator */}
        <div
          className="motion-slide-up"
          style={
            {
              '--motion-delay': '0.3s',
              '--motion-duration': '0.5s',
            } as React.CSSProperties
          }
        >
          <ProjectCostCalculator />
        </div>
      </Container>
    </Section>
  );
}
