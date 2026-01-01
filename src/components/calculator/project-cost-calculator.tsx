'use client';

/**
 * ProjectCostCalculator Component
 * Interactive cost estimation tool
 *
 * Client Component - requires state for calculations
 * Protected by reCAPTCHA v3
 */

import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';

import { Button } from '@/components/ui';
import { useRecaptcha } from '@/hooks/use-recaptcha';
import { cn } from '@/lib/utils';
import { submitCalculatorForm } from '@/services/forms';
import type { ProjectType } from '@/types/database';

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
  const { executeRecaptcha } = useRecaptcha();
  const [inputs, setInputs] = useState<CalculatorInputs>(defaultInputs);
  const [showSaveForm, setShowSaveForm] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [saveMessage, setSaveMessage] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactName, setContactName] = useState('');
  const [website, setWebsite] = useState(''); // Honeypot
  const estimate = calculateEstimate(inputs);

  const updateInput = useCallback(
    (key: keyof CalculatorInputs) => (value: string) => {
      setInputs((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const handleSaveQuote = async () => {
    if (!contactEmail.trim()) {
      setSaveStatus('error');
      setSaveMessage('Please enter your email');
      return;
    }

    setSaveStatus('loading');

    // Get CAPTCHA token
    const captchaToken = await executeRecaptcha('calculator_form');

    // Map calculator inputs to API format
    const features = [
      `Scope: ${inputs.projectScope}`,
      `Pages: ${inputs.pageCount}`,
      `Design: ${inputs.designComplexity}`,
      `Timeline: ${inputs.timeline}`,
      `Maintenance: ${inputs.maintenance}`,
    ];

    const result = await submitCalculatorForm({
      project_type: inputs.projectType as ProjectType,
      features,
      timeline: inputs.timeline,
      estimated_min: estimate.minPrice,
      estimated_max: estimate.maxPrice,
      contact_email: contactEmail.trim(),
      contact_name: contactName.trim() || undefined,
      website, // Honeypot
      captchaToken,
    });

    if (result.success) {
      setSaveStatus('success');
      setSaveMessage('Quote saved! We\'ll be in touch soon.');
      setShowSaveForm(false);
    } else {
      setSaveStatus('error');
      setSaveMessage(result.error || 'Failed to save quote');
    }
  };

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
          {saveStatus === 'success' ? (
            <div className="rounded-lg bg-green-50 px-4 py-3 text-center text-green-700">
              <svg className="mx-auto mb-1 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              {saveMessage}
            </div>
          ) : showSaveForm ? (
            <div className="w-full space-y-3">
              <div className="grid gap-3 sm:grid-cols-2">
                <input
                  type="text"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  placeholder="Your name (optional)"
                  className="rounded-lg border border-neutral-200 px-4 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                />
                <input
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  placeholder="Your email *"
                  required
                  className="rounded-lg border border-neutral-200 px-4 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                />
              </div>
              {/* Honeypot */}
              <input
                type="text"
                name="website"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                className="absolute -left-[9999px] opacity-0"
                tabIndex={-1}
                autoComplete="off"
              />
              {saveStatus === 'error' && (
                <p className="text-sm text-red-600">{saveMessage}</p>
              )}
              <div className="flex gap-2">
                <Button
                  onClick={handleSaveQuote}
                  disabled={saveStatus === 'loading'}
                  size="lg"
                  className="flex-1"
                >
                  {saveStatus === 'loading' ? 'Saving...' : 'Save My Quote'}
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => setShowSaveForm(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <>
              <Button onClick={() => setShowSaveForm(true)} size="lg">
                Save Quote
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/contact">Get Exact Quote</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
