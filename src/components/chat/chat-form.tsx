'use client';

/**
 * ChatForm Component
 * Quick message form for the chat widget
 * Protected by reCAPTCHA v3 for first message
 */

import { useCallback, useState } from 'react';

import { Button } from '@/components/ui';
import { useRecaptcha } from '@/hooks/use-recaptcha';
import { cn } from '@/lib/utils';
import {
  getChatSessionId,
  getOrCreateVisitorId,
  setChatSessionId,
  submitChatMessage,
} from '@/services/forms';

interface ChatFormProps {
  onSuccess?: () => void;
}

export function ChatForm({ onSuccess }: ChatFormProps): React.ReactElement {
  const { executeRecaptcha } = useRecaptcha();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setIsSubmitting(true);
      setError(null);

      const form = e.currentTarget;
      const formData = new FormData(form);

      const name = formData.get('name') as string;
      const email = formData.get('email') as string;
      const message = formData.get('message') as string;

      // Get or create visitor ID and session
      const visitorId = getOrCreateVisitorId();
      const sessionId = getChatSessionId();

      // Get CAPTCHA token only for first message (no session yet)
      const captchaToken = !sessionId ? await executeRecaptcha('chat_form') : null;

      const result = await submitChatMessage({
        visitor_id: visitorId,
        session_id: sessionId,
        message,
        visitor_name: name,
        visitor_email: email,
        captchaToken,
      });

      setIsSubmitting(false);

      if (result.success) {
        // Store session ID for future messages
        if (result.session_id) {
          setChatSessionId(result.session_id);
        }
        setIsSubmitted(true);
        onSuccess?.();
      } else {
        setError(result.error ?? 'Failed to send message');
      }
    },
    [onSuccess, executeRecaptcha]
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
      {error && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
          {error}
        </div>
      )}

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
