/**
 * 404 Not Found Page
 * Server Component - renders statically
 */

import Link from 'next/link';

export default function NotFound(): React.ReactElement {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-neutral-900">404</h1>
        <p className="mt-4 text-xl text-neutral-600">Page not found</p>
        <p className="mt-2 text-neutral-500">
          The page you&apos;re looking for doesn&apos;t exist.
        </p>
        <Link
          href="/"
          className="bg-primary-600 hover:bg-primary-700 mt-8 inline-block rounded-lg px-6 py-3 text-sm font-medium text-white transition-colors"
        >
          Go back home
        </Link>
      </div>
    </main>
  );
}
