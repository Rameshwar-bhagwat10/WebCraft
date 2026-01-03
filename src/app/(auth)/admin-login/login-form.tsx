'use client';

/**
 * Admin Login Form
 * Client component for handling login with rate limiting
 */

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { Button } from '@/components/ui';
import { createClient } from '@/lib/supabase/client';

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [attemptsRemaining, setAttemptsRemaining] = useState<number | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Use API route for rate-limited login
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

      if (!response.ok) {
        if (result.locked) {
          setIsLocked(true);
          setError(result.error);
        } else {
          setError(result.error || 'Login failed');
          if (result.remaining !== undefined) {
            setAttemptsRemaining(result.remaining);
          }
        }
        setLoading(false);
        return;
      }

      // API login successful, now sign in on client for session cookie
      const supabase = createClient();
      const { error: clientError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (clientError) {
        setError('Session error. Please try again.');
        setLoading(false);
        return;
      }

      // Redirect to admin dashboard
      router.push('/admin');
      router.refresh();
    } catch {
      setError('An unexpected error occurred');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className={`rounded-lg p-3 text-sm ${isLocked ? 'bg-orange-50 text-orange-700' : 'bg-red-50 text-red-700'}`}>
          {error}
          {attemptsRemaining !== null && attemptsRemaining > 0 && !isLocked && (
            <p className="mt-1 text-xs">
              {attemptsRemaining} attempt{attemptsRemaining !== 1 ? 's' : ''} remaining
            </p>
          )}
        </div>
      )}

      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-neutral-700"
        >
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={isLocked}
          className="mt-1 block w-full rounded-lg border border-neutral-300 px-4 py-2.5 text-neutral-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-500 focus:outline-none disabled:bg-neutral-100 disabled:cursor-not-allowed"
          placeholder="your-email@example.com"
        />
      </div>

      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-neutral-700"
        >
          Password
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={isLocked}
          className="mt-1 block w-full rounded-lg border border-neutral-300 px-4 py-2.5 text-neutral-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-500 focus:outline-none disabled:bg-neutral-100 disabled:cursor-not-allowed"
          placeholder="••••••••"
        />
      </div>

      <Button
        type="submit"
        disabled={loading || isLocked}
        fullWidth
        className="mt-6"
      >
        {loading ? 'Signing in...' : isLocked ? 'Account Locked' : 'Sign In'}
      </Button>

      {isLocked && (
        <p className="text-center text-xs text-neutral-500">
          Your account has been temporarily locked due to too many failed attempts.
          Please wait and try again later.
        </p>
      )}
    </form>
  );
}
