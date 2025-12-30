/**
 * Home Page (Placeholder)
 * Server Component - renders statically
 *
 * This is a minimal placeholder for Phase 1.
 * UI sections will be built in Phase 2+.
 */

export default function HomePage(): React.ReactElement {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight text-neutral-900 sm:text-5xl">
          WebCraft
        </h1>
        <p className="mt-4 text-lg text-neutral-600">
          Professional web development services
        </p>
        <p className="mt-8 text-sm text-neutral-400">
          Phase 1 Complete — Foundation Ready
        </p>
      </div>
    </main>
  );
}
