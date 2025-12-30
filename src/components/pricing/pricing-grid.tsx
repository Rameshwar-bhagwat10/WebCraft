/**
 * Pricing Grid Component
 * Displays all pricing plans in a responsive grid
 *
 * Server Component - no client JS needed
 */

import { Container, Section } from '@/components/layout';

import { PricingCard } from './pricing-card';
import { pricingPlans } from './pricing-data';

export function PricingGrid(): React.ReactElement {
  return (
    <Section size="lg" background="secondary" aria-label="Pricing plans">
      <Container>
        {/* Pricing cards grid */}
        <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-3">
          {pricingPlans.map((plan) => (
            <PricingCard key={plan.id} plan={plan} />
          ))}
        </div>
      </Container>
    </Section>
  );
}
