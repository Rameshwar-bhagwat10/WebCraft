/**
 * Calculator Submissions Admin Page
 * View and manage quote requests
 */

import Link from 'next/link';

import { createServerSupabaseClient } from '@/lib/supabase/server';
import { cn } from '@/lib/utils';
import type { CalculatorSubmission } from '@/types/database';

export const metadata = {
  title: 'Quote Requests | Admin',
};

interface PageProps {
  searchParams: Promise<{
    status?: string;
    page?: string;
  }>;
}

export default async function CalculatorPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const status = params.status ?? 'all';
  const page = parseInt(params.page ?? '1', 10);
  const perPage = 20;

  const supabase = await createServerSupabaseClient();

  let query = supabase
    .from('calculator_submissions')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range((page - 1) * perPage, page * perPage - 1);

  if (status !== 'all') {
    query = query.eq('status', status as CalculatorSubmission['status']);
  }

  const { data, count } = await query;
  const submissions = data as CalculatorSubmission[] | null;
  const totalPages = Math.ceil((count ?? 0) / perPage);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Quote Requests</h1>
        <p className="text-neutral-600">Calculator submissions from potential clients</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {[
          { value: 'all', label: 'All' },
          { value: 'new', label: 'New' },
          { value: 'reviewed', label: 'Reviewed' },
          { value: 'converted', label: 'Converted' },
        ].map((s) => (
          <Link
            key={s.value}
            href={`/admin/calculator?status=${s.value}`}
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

      {/* Cards Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {submissions?.length === 0 ? (
          <p className="col-span-full py-12 text-center text-neutral-500">
            No quote requests found
          </p>
        ) : (
          submissions?.map((sub) => (
            <div
              key={sub.id}
              className="rounded-xl border border-neutral-200 bg-white p-6"
            >
              <div className="mb-4 flex items-start justify-between">
                <span className="capitalize text-neutral-900 font-medium">
                  {sub.project_type.replace('_', ' ')}
                </span>
                <StatusBadge status={sub.status} />
              </div>

              <div className="mb-4">
                <p className="text-2xl font-bold text-neutral-900">
                  ${sub.estimated_min.toLocaleString()} - ${sub.estimated_max.toLocaleString()}
                </p>
                <p className="text-sm text-neutral-500">Estimated budget</p>
              </div>

              <div className="mb-4 space-y-2 text-sm">
                <p className="text-neutral-600">
                  <span className="font-medium">Timeline:</span> {sub.timeline}
                </p>
                {sub.contact_email && (
                  <p className="text-neutral-600">
                    <span className="font-medium">Email:</span>{' '}
                    <a href={`mailto:${sub.contact_email}`} className="text-primary-600 hover:underline">
                      {sub.contact_email}
                    </a>
                  </p>
                )}
                {sub.contact_name && (
                  <p className="text-neutral-600">
                    <span className="font-medium">Name:</span> {sub.contact_name}
                  </p>
                )}
              </div>

              {Array.isArray(sub.features) && sub.features.length > 0 && (
                <div className="mb-4">
                  <p className="mb-2 text-sm font-medium text-neutral-500">Features:</p>
                  <div className="flex flex-wrap gap-1">
                    {(sub.features as string[]).slice(0, 5).map((feature, i) => (
                      <span
                        key={i}
                        className="rounded-full bg-neutral-100 px-2 py-0.5 text-xs text-neutral-600"
                      >
                        {feature}
                      </span>
                    ))}
                    {(sub.features as string[]).length > 5 && (
                      <span className="text-xs text-neutral-400">
                        +{(sub.features as string[]).length - 5} more
                      </span>
                    )}
                  </div>
                </div>
              )}

              <p className="text-xs text-neutral-400">
                {new Date(sub.created_at).toLocaleDateString()}
              </p>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-neutral-500">
            Page {page} of {totalPages}
          </p>
          <div className="flex gap-2">
            <Link
              href={`/admin/calculator?status=${status}&page=${page - 1}`}
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
              href={`/admin/calculator?status=${status}&page=${page + 1}`}
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

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    new: 'bg-blue-100 text-blue-700',
    reviewed: 'bg-yellow-100 text-yellow-700',
    converted: 'bg-green-100 text-green-700',
  };

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${colors[status] ?? colors.new}`}
    >
      {status}
    </span>
  );
}
