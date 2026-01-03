/**
 * Pricing Grid Component
 * Displays all pricing plans in a responsive grid
 *
 * Server Component - no client JS needed
 */

import Link from 'next/link';

import { Container, Section } from '@/components/layout';
import { Text } from '@/components/ui';

import { PricingCard } from './pricing-card';
import { pricingPlans } from './pricing-data';

export function PricingGrid(): React.ReactElement {
  return (
    <Section size="lg" background="secondary" aria-label="Pricing plans">
      <Container>
        {/* Calculator prompt */}
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary-200 bg-primary-50 px-4 py-2">
            <svg
              className="h-5 w-5 text-primary-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
              />
            </svg>
            <Text size="sm" className="text-primary-700">
              Want a personalized estimate?{' '}
              <Link
                href="#calculator"
                className="font-semibold underline underline-offset-2 hover:text-primary-800"
              >
                Use our Cost Calculator
              </Link>{' '}
              below
            </Text>
          </div>
        </div>

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
