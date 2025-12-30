/**
 * Pricing Card Component
 * Displays a single pricing plan
 *
 * Server Component - no client JS needed
 */

import Link from 'next/link';

import { Button, Text } from '@/components/ui';
import { cn } from '@/lib/utils';

import type { PricingPlan } from './pricing-data';

interface PricingCardProps {
  plan: PricingPlan;
}

export function PricingCard({ plan }: PricingCardProps): React.ReactElement {
  const isRecommended = plan.recommended === true;

  return (
    <article
      className={cn(
        'bg-background relative flex flex-col rounded-2xl border p-6 sm:p-8',
        isRecommended
          ? 'border-primary-300 ring-primary-100 ring-2'
          : 'border-border'
      )}
    >
      {/* Recommended badge */}
      {isRecommended && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="bg-primary-600 inline-block rounded-full px-4 py-1 text-xs font-medium text-white">
            Recommended
          </span>
        </div>
      )}

      {/* Plan header */}
      <div className="mb-6">
        <h3 className="text-foreground mb-2 text-xl font-bold">{plan.name}</h3>
        <Text variant="secondary" size="sm" className="mb-4">
          {plan.description}
        </Text>
        <Text variant="muted" size="sm">
          Best for: {plan.bestFor}
        </Text>
      </div>

      {/* Price */}
      <div className="mb-6">
        <div className="flex items-baseline gap-1">
          <span className="text-foreground-muted text-lg">From</span>
          <span className="text-foreground text-4xl font-bold">
            ${plan.startingPrice.toLocaleString()}
          </span>
        </div>
        <Text variant="muted" size="sm">
          {plan.priceSuffix}
        </Text>
      </div>

      {/* Features list */}
      <ul className="mb-8 flex-1 space-y-3">
        {plan.features.map((feature) => (
          <li key={feature.name} className="flex items-start gap-3">
            {feature.included ? (
              <svg
                className="text-primary-500 mt-0.5 h-5 w-5 shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            ) : (
              <svg
                className="mt-0.5 h-5 w-5 shrink-0 text-neutral-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            )}
            <span
              className={cn(
                'text-sm',
                feature.included
                  ? 'text-foreground'
                  : 'text-foreground-muted line-through'
              )}
            >
              {feature.name}
              {feature.note && (
                <span className="text-foreground-muted ml-1">
                  ({feature.note})
                </span>
              )}
            </span>
          </li>
        ))}
      </ul>

      {/* CTA Button */}
      <Button
        asChild
        size="lg"
        variant={isRecommended ? 'primary' : 'outline'}
        fullWidth
      >
        <Link href="/contact">{plan.ctaText}</Link>
      </Button>
    </article>
  );
}
