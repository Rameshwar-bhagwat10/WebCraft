'use client';

/**
 * Global Error Boundary
 * Catches errors in the root layout itself
 * Must include its own <html> and <body> tags
 */

import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log critical error (replace with Sentry in production)
    console.error('[Global Error]', {
      message: error.message,
      digest: error.digest,
      stack: error.stack,
    });
  }, [error]);

  return (
    <html lang="en">
      <body className="bg-white text-neutral-900 antialiased">
        <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
          <div className="max-w-md">
            {/* Icon */}
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
              <svg
                className="h-10 w-10 text-red-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>

            {/* Message */}
            <h1 className="mb-2 text-3xl font-bold text-neutral-900">
              Critical Error
            </h1>
            <p className="mb-8 text-lg text-neutral-600">
              Something went seriously wrong. We&apos;re sorry for the inconvenience.
            </p>

            {/* Actions */}
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <button
                onClick={reset}
                className="inline-flex items-center justify-center rounded-lg bg-red-600 px-6 py-3 text-base font-medium text-white transition-colors hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                Try again
              </button>
              <button
                onClick={() => window.location.href = '/'}
                className="inline-flex items-center justify-center rounded-lg border border-neutral-300 bg-white px-6 py-3 text-base font-medium text-neutral-700 transition-colors hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:ring-offset-2"
              >
                Return home
              </button>
            </div>

            {/* Error reference */}
            {error.digest && (
              <p className="mt-8 text-sm text-neutral-400">
                Reference: {error.digest}
              </p>
            )}
          </div>
        </div>
      </body>
    </html>
  );
}
