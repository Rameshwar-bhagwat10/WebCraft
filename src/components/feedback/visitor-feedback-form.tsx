'use client';

/**
 * Visitor Feedback Form
 * Allows visitors to leave feedback on the home page
 * Protected by reCAPTCHA v3
 */

import { useState } from 'react';

import { useRecaptcha } from '@/hooks/use-recaptcha';
import { cn } from '@/lib/utils';
import { submitFeedback } from '@/services/forms';

export function VisitorFeedbackForm() {
  const { executeRecaptcha } = useRecaptcha();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [rating, setRating] = useState(5);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Get CAPTCHA token
      const captchaToken = await executeRecaptcha('feedback_form');

      const result = await submitFeedback({
        name,
        email: email || null,
        message,
        rating,
        captchaToken,
      });

      if (!result.success) {
        throw new Error(result.error || 'Failed to submit feedback');
      }

      setSuccess(true);
      setName('');
      setEmail('');
      setMessage('');
      setRating(5);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="rounded-2xl border border-green-200 bg-green-50 p-6 text-center sm:p-8">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
          <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="mb-2 text-lg font-semibold text-green-800">Thank You!</h3>
        <p className="text-sm text-green-700">
          Your feedback has been submitted and will be reviewed shortly.
        </p>
        <button
          onClick={() => setSuccess(false)}
          className="mt-4 text-sm font-medium text-green-600 hover:text-green-700"
        >
          Submit another feedback
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="feedback-name" className="mb-1.5 block text-sm font-medium text-neutral-700">
            Name <span className="text-red-500">*</span>
          </label>
          <input
            id="feedback-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            maxLength={100}
            className="w-full rounded-lg border border-neutral-300 px-4 py-2.5 text-sm transition-colors focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            placeholder="Enter your name"
          />
        </div>

        <div>
          <label htmlFor="feedback-email" className="mb-1.5 block text-sm font-medium text-neutral-700">
            Email <span className="text-neutral-400">(optional)</span>
          </label>
          <input
            id="feedback-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-neutral-300 px-4 py-2.5 text-sm transition-colors focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            placeholder="Enter your email"
          />
        </div>
      </div>

      <div>
        <label htmlFor="feedback-message" className="mb-1.5 block text-sm font-medium text-neutral-700">
          Feedback <span className="text-red-500">*</span>
        </label>
        <textarea
          id="feedback-message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
          maxLength={500}
          rows={3}
          className="w-full rounded-lg border border-neutral-300 px-4 py-2.5 text-sm transition-colors focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
          placeholder="Share your thoughts about our work..."
        />
        <p className="mt-1 text-xs text-neutral-500">{message.length}/500</p>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-neutral-700">
          Rating <span className="text-red-500">*</span>
        </label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              className="p-1 transition-transform hover:scale-110"
              aria-label={`Rate ${star} stars`}
            >
              <svg
                className={cn('h-8 w-8', star <= rating ? 'text-amber-400' : 'text-neutral-300')}
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            </button>
          ))}
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className={cn(
          'w-full rounded-lg bg-primary-600 px-6 py-3 text-sm font-semibold text-white',
          'transition-colors hover:bg-primary-700',
          'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
          loading && 'cursor-not-allowed opacity-50'
        )}
      >
        {loading ? 'Submitting...' : 'Submit Feedback'}
      </button>

      <p className="text-center text-xs text-neutral-500">
        Your feedback helps us improve. All submissions are reviewed before publishing.
      </p>
    </form>
  );
}
