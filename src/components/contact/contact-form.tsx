/**
 * Contact Form Component
 * Main contact form with validation and UX feedback
 *
 * Client Component - handles form state and submission
 * Integrates with Supabase backend via API routes
 * Protected by reCAPTCHA v3
 */

'use client';

import { useState } from 'react';

import { Button, Text } from '@/components/ui';
import { useRecaptcha } from '@/hooks/use-recaptcha';
import { submitContactForm } from '@/services/forms';
import type { ProjectType } from '@/types/database';

import { FormField } from './form-field';

/**
 * Project type options
 */
const projectTypes = [
  { value: 'website', label: 'Business Website' },
  { value: 'webapp', label: 'Web Application' },
  { value: 'mobile', label: 'Mobile App' },
  { value: 'dashboard', label: 'UI / Dashboard' },
  { value: 'maintenance', label: 'Maintenance & Support' },
  { value: 'other', label: 'Other / Not Sure' },
];

/**
 * Form state type
 */
interface FormData {
  name: string;
  email: string;
  phone: string;
  projectType: string;
  message: string;
  // Honeypot field for spam protection
  website: string;
}

/**
 * Form errors type
 */
type FormErrors = Partial<Record<keyof FormData, string>>;

/**
 * Submission status
 */
type SubmitStatus = 'idle' | 'submitting' | 'success' | 'error';

/**
 * Validate email format
 */
function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Validate form data
 */
function validateForm(data: FormData): FormErrors {
  const errors: FormErrors = {};

  if (!data.name.trim()) {
    errors.name = 'Please enter your name';
  }

  if (!data.email.trim()) {
    errors.email = 'Please enter your email address';
  } else if (!isValidEmail(data.email)) {
    errors.email = 'Please enter a valid email address';
  }

  if (!data.projectType) {
    errors.projectType = 'Please select a project type';
  }

  if (!data.message.trim()) {
    errors.message = 'Please tell us about your project';
  } else if (data.message.trim().length < 20) {
    errors.message =
      'Please provide a bit more detail (at least 20 characters)';
  }

  return errors;
}

export function ContactForm(): React.ReactElement {
  const { executeRecaptcha } = useRecaptcha();
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    projectType: '',
    message: '',
    website: '', // Honeypot - should remain empty
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<SubmitStatus>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  /**
   * Update a single field
   */
  const updateField = (field: keyof FormData) => (value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  /**
   * Handle form submission
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    // Validate
    const validationErrors = validateForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setStatus('submitting');

    // Get CAPTCHA token
    const captchaToken = await executeRecaptcha('contact_form');

    // Submit to API
    const result = await submitContactForm({
      name: formData.name,
      email: formData.email,
      phone: formData.phone || undefined,
      project_type: formData.projectType as ProjectType,
      message: formData.message,
      website: formData.website, // Honeypot
      captchaToken,
    });

    if (result.success) {
      setStatus('success');
    } else {
      setStatus('error');
      setErrorMessage(result.error || 'Something went wrong');
      if (result.errors) {
        setErrors(result.errors as FormErrors);
      }
    }
  };

  // Success state
  if (status === 'success') {
    return (
      <div className="border-success-200 bg-success-50 rounded-xl border p-8 text-center">
        <div className="bg-success-100 mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full">
          <svg
            className="text-success-600 h-6 w-6"
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
        </div>
        <h3 className="text-foreground mb-2 text-xl font-semibold">
          Message Sent!
        </h3>
        <Text variant="secondary">
          Thank you for reaching out. We&apos;ll get back to you within one
          business day.
        </Text>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      {/* Name and Email row */}
      <div className="grid gap-6 sm:grid-cols-2">
        <FormField
          id="name"
          label="Full Name"
          type="text"
          placeholder="Enter your full name"
          required
          value={formData.name}
          onChange={updateField('name')}
          error={errors.name}
        />
        <FormField
          id="email"
          label="Email Address"
          type="email"
          placeholder="Enter your email address"
          required
          value={formData.email}
          onChange={updateField('email')}
          error={errors.email}
        />
      </div>

      {/* Phone and Project Type row */}
      <div className="grid gap-6 sm:grid-cols-2">
        <FormField
          id="phone"
          label="Phone Number"
          type="tel"
          placeholder="Enter your phone number"
          value={formData.phone}
          onChange={updateField('phone')}
        />
        <FormField
          id="projectType"
          label="Project Type"
          type="select"
          placeholder="Select project type"
          required
          value={formData.projectType}
          onChange={updateField('projectType')}
          error={errors.projectType}
          options={projectTypes}
        />
      </div>

      {/* Message */}
      <FormField
        id="message"
        label="Tell Us About Your Project"
        type="textarea"
        placeholder="Describe your project, goals, and any specific requirements..."
        required
        value={formData.message}
        onChange={updateField('message')}
        error={errors.message}
      />

      {/* Error state */}
      {status === 'error' && (
        <div
          className="border-error-200 bg-error-50 text-error-700 rounded-lg border p-4 text-sm"
          role="alert"
        >
          {errorMessage || 'Something went wrong. Please try again or contact us directly via email.'}
        </div>
      )}

      {/* Honeypot field - hidden from users, catches bots */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input
          type="text"
          id="website"
          name="website"
          value={formData.website}
          onChange={(e) => updateField('website')(e.target.value)}
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      {/* Submit button */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Button
          type="submit"
          size="lg"
          disabled={status === 'submitting'}
          className="sm:min-w-[200px]"
        >
          {status === 'submitting' ? (
            <span className="flex items-center gap-2">
              <svg
                className="h-4 w-4 animate-spin"
                fill="none"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Sending...
            </span>
          ) : (
            'Send Message'
          )}
        </Button>
        <Text variant="muted" size="sm">
          We respond within one business day
        </Text>
      </div>
    </form>
  );
}
