/**
 * Newsletter Subscriptions Admin Page
 * View and manage newsletter subscribers
 */

import Link from 'next/link';

import { Button } from '@/components/ui';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { cn } from '@/lib/utils';
import type { NewsletterSubscription } from '@/types/database';

export const metadata = {
  title: 'Newsletter | Admin',
};

interface PageProps {
  searchParams: Promise<{
    status?: string;
    page?: string;
  }>;
}

export default async function NewsletterPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const status = params.status ?? 'all';
  const page = parseInt(params.page ?? '1', 10);
  const perPage = 20;

  const supabase = await createServerSupabaseClient();

  let query = supabase
    .from('newsletter_subscriptions')
    .select('*', { count: 'exact' })
    .order('subscribed_at', { ascending: false })
    .range((page - 1) * perPage, page * perPage - 1);

  if (status !== 'all') {
    query = query.eq('status', status as NewsletterSubscription['status']);
  }

  const { data, count } = await query;
  const subscriptions = data as NewsletterSubscription[] | null;
  const totalPages = Math.ceil((count ?? 0) / perPage);

  // Export function (client-side would handle actual download)
  const exportUrl = `/api/admin/export/newsletter?status=${status}`;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Newsletter Subscriptions</h1>
          <p className="text-neutral-600">{count ?? 0} total subscribers</p>
        </div>
        <Button variant="secondary" size="sm" asChild>
          <a href={exportUrl} download>Export CSV</a>
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {[
          { value: 'all', label: 'All' },
          { value: 'active', label: 'Active' },
          { value: 'unsubscribed', label: 'Unsubscribed' },
        ].map((s) => (
          <Link
            key={s.value}
            href={`/admin/newsletter?status=${s.value}`}
            className={cn(
              'rounded-full px-4 py-1.5 text-sm font-medium transition-colors',
              status === s.value
                ? 'bg-primary-100 text-primary-700'
                : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
            )}
          >
            {s.label}
          </Link>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white">
        <table className="min-w-full divide-y divide-neutral-200">
          <thead className="bg-neutral-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">
                Source
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">
                Subscribed
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {subscriptions?.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-neutral-500">
                  No subscriptions found
                </td>
              </tr>
            ) : (
              subscriptions?.map((sub) => (
                <tr key={sub.id} className="hover:bg-neutral-50">
                  <td className="px-6 py-4">
                    <a href={`mailto:${sub.email}`} className="text-primary-600 hover:underline">
                      {sub.email}
                    </a>
                  </td>
                  <td className="px-6 py-4 text-neutral-600">{sub.source}</td>
                  <td className="px-6 py-4">
                    <span
                      className={cn(
                        'inline-flex rounded-full px-2.5 py-1 text-xs font-medium',
                        sub.status === 'active'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-neutral-100 text-neutral-600'
                      )}
                    >
                      {sub.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-neutral-500">
                    {new Date(sub.subscribed_at).toLocaleDateString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-neutral-500">
            Page {page} of {totalPages}
          </p>
          <div className="flex gap-2">
            <Link
              href={`/admin/newsletter?status=${status}&page=${page - 1}`}
              className={cn(
                'rounded-lg px-4 py-2 text-sm font-medium',
                page <= 1
                  ? 'pointer-events-none opacity-50'
                  : 'bg-neutral-100 hover:bg-neutral-200'
              )}
            >
              Previous
            </Link>
            <Link
              href={`/admin/newsletter?status=${status}&page=${page + 1}`}
              className={cn(
                'rounded-lg px-4 py-2 text-sm font-medium',
                page >= totalPages
                  ? 'pointer-events-none opacity-50'
                  : 'bg-neutral-100 hover:bg-neutral-200'
              )}
            >
              Next
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
