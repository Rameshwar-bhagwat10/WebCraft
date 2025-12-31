'use client';

/**
 * ChatForm Component
 * Quick message form for the chat widget
 */

import { useCallback, useState } from 'react';

import { Button } from '@/components/ui';
import { cn } from '@/lib/utils';

interface ChatFormProps {
  onSuccess?: () => void;
}

export function ChatForm({ onSuccess }: ChatFormProps): React.ReactElement {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setIsSubmitting(true);

      // Simulate form submission (replace with actual API call)
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setIsSubmitting(false);
      setIsSubmitted(true);
      onSuccess?.();
    },
    [onSuccess]
  );

  if (isSubmitted) {
    return (
      <div className="py-6 text-center">
        <div className="bg-success-100 text-success-600 mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full">
          <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <p className="text-foreground font-medium">Message sent!</p>
        <p className="text-foreground-secondary mt-1 text-sm">
          We&apos;ll get back to you soon.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <label htmlFor="chat-name" className="sr-only">
          Your name
        </label>
        <input
          id="chat-name"
          name="name"
          type="text"
          required
          placeholder="Your name"
          className={cn(
            'w-full rounded-lg border px-3 py-2.5',
            'border-border bg-background text-foreground',
            'placeholder:text-foreground-muted text-sm',
            'transition-colors duration-200',
            'hover:border-primary-300',
            'focus:border-primary-500 focus:ring-primary-500/20 focus:ring-2 focus:outline-none'
          )}
        />
      </div>

      <div>
        <label htmlFor="chat-email" className="sr-only">
          Email address
        </label>
        <input
          id="chat-email"
          name="email"
          type="email"
          required
          placeholder="Email address"
          className={cn(
            'w-full rounded-lg border px-3 py-2.5',
            'border-border bg-background text-foreground',
            'placeholder:text-foreground-muted text-sm',
            'transition-colors duration-200',
            'hover:border-primary-300',
            'focus:border-primary-500 focus:ring-primary-500/20 focus:ring-2 focus:outline-none'
          )}
        />
      </div>

      <div>
        <label htmlFor="chat-message" className="sr-only">
          Your message
        </label>
        <textarea
          id="chat-message"
          name="message"
          required
          rows={3}
          placeholder="How can we help?"
          className={cn(
            'w-full rounded-lg border px-3 py-2.5',
            'border-border bg-background text-foreground',
            'placeholder:text-foreground-muted text-sm',
            'resize-none transition-colors duration-200',
            'hover:border-primary-300',
            'focus:border-primary-500 focus:ring-primary-500/20 focus:ring-2 focus:outline-none'
          )}
        />
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? 'Sending...' : 'Send Message'}
      </Button>
    </form>
  );
}
