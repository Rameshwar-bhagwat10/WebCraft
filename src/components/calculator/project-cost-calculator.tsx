'use client';

/**
 * ProjectCostCalculator Component
 * Interactive cost estimation tool
 *
 * Client Component - requires state for calculations
 */

import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';

import { Button } from '@/components/ui';
import { cn } from '@/lib/utils';

import { CalculatorField } from './calculator-field';
import {
  calculateEstimate,
  defaultInputs,
  designOptions,
  formatPrice,
  maintenanceOptions,
  pageCountOptions,
  projectScopes,
  projectTypes,
  timelineOptions,
  type CalculatorInputs,
} from './calculator-logic';

/**
 * Animated number display with count-up effect
 */
function AnimatedPrice({
  value,
  prefix = '',
  suffix = '',
}: {
  value: number;
  prefix?: string;
  suffix?: string;
}): React.ReactElement {
  const [displayValue, setDisplayValue] = useState(value);
  const animationRef = useRef<number | null>(null);
  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    if (prefersReducedMotion) {
      setDisplayValue(value);
      return;
    }

    const startValue = displayValue;
    const diff = value - startValue;
    const duration = 400;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(startValue + diff * eased);
      setDisplayValue(current);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, prefersReducedMotion]);

  return (
    <span>
      {prefix}
      {formatPrice(displayValue)}
      {suffix}
    </span>
  );
}

export function ProjectCostCalculator(): React.ReactElement {
  const [inputs, setInputs] = useState<CalculatorInputs>(defaultInputs);
  const estimate = calculateEstimate(inputs);

  const updateInput = useCallback(
    (key: keyof CalculatorInputs) => (value: string) => {
      setInputs((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  return (
    <div
      className={cn(
        'rounded-2xl bg-white',
        'border border-neutral-100',
        'shadow-lg',
        'overflow-hidden'
      )}
    >
      {/* Calculator header */}
      <div className="border-border border-b bg-neutral-50 px-4 py-4 sm:px-6">
        <h3 className="text-foreground text-lg font-semibold">
          Project Cost Calculator
        </h3>
        <p className="text-foreground-secondary mt-1 text-sm">
          Get an instant estimate for your project
        </p>
      </div>

      {/* Calculator body */}
      <div className="p-4 sm:p-6">
        {/* Input fields grid */}
        <div className="grid gap-4 sm:grid-cols-2">
          <CalculatorField
            id="project-type"
            label="Project Type"
            value={inputs.projectType}
            options={projectTypes}
            onChange={updateInput('projectType')}
          />

          <CalculatorField
            id="project-scope"
            label="Project Scope"
            value={inputs.projectScope}
            options={projectScopes}
            onChange={updateInput('projectScope')}
          />

          <CalculatorField
            id="page-count"
            label="Pages / Features"
            value={inputs.pageCount}
            options={pageCountOptions}
            onChange={updateInput('pageCount')}
          />

          <CalculatorField
            id="design-complexity"
            label="Design Complexity"
            value={inputs.designComplexity}
            options={designOptions}
            onChange={updateInput('designComplexity')}
          />

          <CalculatorField
            id="timeline"
            label="Timeline"
            value={inputs.timeline}
            options={timelineOptions}
            onChange={updateInput('timeline')}
          />

          <CalculatorField
            id="maintenance"
            label="Ongoing Maintenance"
            value={inputs.maintenance}
            options={maintenanceOptions}
            onChange={updateInput('maintenance')}
          />
        </div>

        {/* Result display */}
        <div
          className={cn(
            'mt-6 rounded-xl',
            'bg-primary-50 border-primary-100 border',
            'p-4 sm:p-6',
            'text-center'
          )}
          role="status"
          aria-live="polite"
          aria-atomic="true"
        >
          <p className="text-foreground-secondary mb-2 text-sm">
            Estimated Investment
          </p>
          <p className="text-primary-700 text-2xl font-bold sm:text-3xl">
            <AnimatedPrice value={estimate.minPrice} /> –{' '}
            <AnimatedPrice value={estimate.maxPrice} />
          </p>
          {estimate.monthlyMaintenance > 0 && (
            <p className="text-foreground-secondary mt-2 text-sm">
              + {formatPrice(estimate.monthlyMaintenance)}/month for maintenance
            </p>
          )}
          <p className="text-foreground-muted mt-3 text-xs">
            Based on your selected options
          </p>
        </div>

        {/* Disclaimer */}
        <p className="text-foreground-muted mt-4 text-center text-xs leading-relaxed">
          This is an estimated range. Final pricing depends on detailed
          requirements and project complexity.
        </p>

        {/* CTA buttons */}
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button asChild size="lg">
            <Link href="/contact">Get Exact Quote</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/contact">Contact Us</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
