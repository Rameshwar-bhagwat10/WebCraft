/**
 * Admin Forbidden Page
 * Shown when user lacks required permissions
 */

import Link from 'next/link';

import { Button } from '@/components/ui';

export const metadata = {
  title: 'Access Denied | Admin',
  robots: { index: false, follow: false },
};

export default function ForbiddenPage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <div className="rounded-full bg-red-100 p-4 mb-6">
        <svg
          className="h-12 w-12 text-red-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      </div>
      <h1 className="text-2xl font-bold text-neutral-900 mb-2">Access Denied</h1>
      <p className="text-neutral-600 mb-6 max-w-md">
        You don&apos;t have permission to access this page. 
        Please contact your administrator if you believe this is an error.
      </p>
      <Button asChild>
        <Link href="/admin">Back to Dashboard</Link>
      </Button>
    </div>
  );
}
