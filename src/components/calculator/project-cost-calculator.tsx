'use client';

/**
 * ProjectCostCalculator Component
 * Interactive cost estimation tool
 *
 * Client Component - requires state for calculations
 * Protected by reCAPTCHA v3
 */

import Link from 'next/link';
import { useCallback, useState } from 'react';

import { Button } from '@/components/ui';
import { useRecaptcha } from '@/hooks/use-recaptcha';
import { cn } from '@/lib/utils';
import { submitCalculatorForm } from '@/services/forms';
import type { ProjectType } from '@/types/database';

import { CalculatorField } from './calculator-field';
import {
  calculateEstimate,
  contentOptions,
  defaultInputs,
  designOptions,
  featureOptions,
  formatPrice,
  hostingOptions,
  maintenanceOptions,
  pageCountOptions,
  projectScopes,
  projectTypes,
  timelineOptions,
  type CalculatorInputs,
} from './calculator-logic';

/**
 * Price display - simple CSS transition instead of RAF animation
 * Much better performance, same visual effect
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
  return (
    <span className="tabular-nums transition-opacity duration-200">
      {prefix}
      {formatPrice(value)}
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
      `Type: ${inputs.projectType}`,
      `Scope: ${inputs.projectScope}`,
      `Pages: ${inputs.pageCount}`,
      `Design: ${inputs.designComplexity}`,
      `Features: ${inputs.features}`,
      `Content: ${inputs.content}`,
      `Timeline: ${inputs.timeline}`,
      `Hosting: ${inputs.hosting}`,
      `Maintenance: ${inputs.maintenance}`,
    ];

    const result = await submitCalculatorForm({
      project_type: inputs.projectType as ProjectType,
      features,
      timeline: inputs.timeline,
      estimated_min: estimate.minPrice + estimate.hostingCost,
      estimated_max: estimate.maxPrice + estimate.hostingCost,
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
        {/* Input fields grid - 8 fields in 2 columns */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
            label="Number of Pages"
            value={inputs.pageCount}
            options={pageCountOptions}
            onChange={updateInput('pageCount')}
          />

          <CalculatorField
            id="design-complexity"
            label="Design Level"
            value={inputs.designComplexity}
            options={designOptions}
            onChange={updateInput('designComplexity')}
          />

          <CalculatorField
            id="features"
            label="Features & Integrations"
            value={inputs.features}
            options={featureOptions}
            onChange={updateInput('features')}
          />

          <CalculatorField
            id="content"
            label="Content Management"
            value={inputs.content}
            options={contentOptions}
            onChange={updateInput('content')}
          />

          <CalculatorField
            id="timeline"
            label="Timeline"
            value={inputs.timeline}
            options={timelineOptions}
            onChange={updateInput('timeline')}
          />

          <CalculatorField
            id="hosting"
            label="Hosting & Domain"
            value={inputs.hosting}
            options={hostingOptions}
            onChange={updateInput('hosting')}
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
            <AnimatedPrice value={estimate.minPrice + estimate.hostingCost} /> –{' '}
            <AnimatedPrice value={estimate.maxPrice + estimate.hostingCost} />
          </p>
          {(estimate.hostingCost > 0 || estimate.monthlyMaintenance > 0) && (
            <div className="mt-3 space-y-1">
              {estimate.hostingCost > 0 && (
                <p className="text-foreground-secondary text-sm">
                  Includes {formatPrice(estimate.hostingCost)}/year for hosting & domain
                </p>
              )}
              {estimate.monthlyMaintenance > 0 && (
                <p className="text-foreground-secondary text-sm">
                  + {formatPrice(estimate.monthlyMaintenance)}/month for maintenance
                </p>
              )}
            </div>
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
                  placeholder="Full name (optional)"
                  className="rounded-lg border border-neutral-200 px-4 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                />
                <input
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  placeholder="Email address *"
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
                  {saveStatus === 'loading' ? 'Sending...' : 'Get My Quote'}
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
                Get Free Quote
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/contact">Contact Us</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
