'use client';

/**
 * Newsletter Subscription Form
 * Reusable component for newsletter signups
 * Connected to Supabase backend
 * Protected by reCAPTCHA v3
 */

import { useState } from 'react';

import { useRecaptcha } from '@/hooks/use-recaptcha';
import { cn } from '@/lib/utils';
import { subscribeNewsletter } from '@/services/forms';

interface NewsletterFormProps {
  source?: string;
  variant?: 'default' | 'dark';
  className?: string;
}

export function NewsletterForm({
  source = 'website',
  variant = 'default',
  className,
}: NewsletterFormProps) {
  const { executeRecaptcha } = useRecaptcha();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  // Honeypot field
  const [website, setWebsite] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setStatus('error');
      setMessage('Please enter your email');
      return;
    }

    setStatus('loading');

    // Get CAPTCHA token
    const captchaToken = await executeRecaptcha('newsletter_form');
    
    const result = await subscribeNewsletter({
      email: email.trim(),
      source,
      website, // Honeypot
      captchaToken,
    });

    if (result.success) {
      setStatus('success');
      setMessage(result.message || 'Subscribed successfully!');
      setEmail('');
    } else {
      setStatus('error');
      setMessage(result.error || 'Failed to subscribe');
    }
  };

  const isDark = variant === 'dark';

  if (status === 'success') {
    return (
      <div className={cn('text-center', className)}>
        <div className={cn(
          'inline-flex items-center gap-2 rounded-lg px-4 py-3',
          isDark ? 'bg-white/20 text-white' : 'bg-green-50 text-green-700'
        )}>
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          {message}
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={cn('flex flex-col gap-3 sm:flex-row', className)}>
      <div className="relative flex-1">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          disabled={status === 'loading'}
          className={cn(
            'w-full rounded-lg border-0 px-4 py-3 focus:ring-2 focus:outline-none',
            isDark
              ? 'bg-white/10 text-white placeholder:text-white/60 focus:ring-white/50'
              : 'bg-white text-neutral-900 placeholder:text-neutral-400 focus:ring-primary-500 border border-neutral-200'
          )}
        />
        {/* Honeypot - hidden from users */}
        <input
          type="text"
          name="website"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
          className="absolute -left-[9999px] opacity-0"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>
      
      <button
        type="submit"
        disabled={status === 'loading'}
        className={cn(
          'rounded-lg px-6 py-3 font-medium transition-colors disabled:opacity-50',
          isDark
            ? 'bg-white text-primary-700 hover:bg-white/90'
            : 'bg-primary-600 text-white hover:bg-primary-700'
        )}
      >
        {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
      </button>

      {status === 'error' && (
        <p className={cn(
          'text-sm sm:absolute sm:-bottom-6 sm:left-0',
          isDark ? 'text-red-300' : 'text-red-600'
        )}>
          {message}
        </p>
      )}
    </form>
  );
}
