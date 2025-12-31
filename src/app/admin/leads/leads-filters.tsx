'use client';

/**
 * Leads Filters Component
 * Server-side filtering with URL state
 */

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useState, useTransition } from 'react';

import { cn } from '@/lib/utils';
import type { LeadSource } from '@/types/database';

interface LeadsFiltersProps {
  currentStatus: string;
  currentSource?: LeadSource | undefined;
  currentSearch?: string | undefined;
  currentStartDate?: string | undefined;
  currentEndDate?: string | undefined;
}

const statuses = [
  { value: 'all', label: 'All' },
  { value: 'new', label: 'New' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'qualified', label: 'Qualified' },
  { value: 'converted', label: 'Converted' },
  { value: 'closed', label: 'Closed' },
];

const sources: { value: LeadSource | 'all'; label: string }[] = [
  { value: 'all', label: 'All Sources' },
  { value: 'contact', label: 'Contact Form' },
  { value: 'calculator', label: 'Calculator' },
  { value: 'chat', label: 'Chat' },
];

export function LeadsFilters({
  currentStatus,
  currentSource,
  currentSearch,
  currentStartDate,
  currentEndDate,
}: LeadsFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [search, setSearch] = useState(currentSearch ?? '');

  // Build URL with filters
  const buildUrl = useCallback(
    (updates: Record<string, string | undefined>) => {
      const params = new URLSearchParams(searchParams.toString());
      
      // Reset to page 1 when filters change
      params.set('page', '1');
      
      Object.entries(updates).forEach(([key, value]) => {
        if (value && value !== 'all') {
          params.set(key, value);
        } else {
          params.delete(key);
        }
      });
      
      return `/admin/leads?${params.toString()}`;
    },
    [searchParams]
  );

  const handleStatusChange = (status: string) => {
    startTransition(() => {
      router.push(buildUrl({ status }));
    });
  };

  const handleSourceChange = (source: string) => {
    startTransition(() => {
      router.push(buildUrl({ source }));
    });
  };

  const handleSearch = () => {
    startTransition(() => {
      router.push(buildUrl({ search: search || undefined }));
    });
  };

  const handleDateChange = (startDate?: string, endDate?: string) => {
    startTransition(() => {
      router.push(buildUrl({ startDate, endDate }));
    });
  };

  const handleReset = () => {
    setSearch('');
    startTransition(() => {
      router.push('/admin/leads');
    });
  };

  const hasFilters = currentStatus !== 'all' || currentSource || currentSearch || currentStartDate || currentEndDate;

  return (
    <div className="space-y-4">
      {/* Status Pills */}
      <div className="flex flex-wrap gap-2">
        {statuses.map((s) => (
          <button
            key={s.value}
            onClick={() => handleStatusChange(s.value)}
            disabled={isPending}
            className={cn(
              'rounded-full px-4 py-1.5 text-sm font-medium transition-colors',
              currentStatus === s.value
                ? 'bg-primary-100 text-primary-700'
                : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200',
              isPending && 'opacity-50'
            )}
          >
            {s.label}
            {s.value === 'new' && (
              <span className="ml-1.5 inline-flex h-2 w-2 rounded-full bg-blue-500" />
            )}
          </button>
        ))}
      </div>

      {/* Advanced Filters */}
      <div className="flex flex-wrap items-end gap-4 rounded-lg border border-neutral-200 bg-white p-4">
        {/* Search */}
        <div className="flex-1 min-w-[200px]">
          <label className="block text-xs font-medium text-neutral-500 mb-1">
            Search
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Name or email..."
              className="flex-1 rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 focus:outline-none"
            />
            <button
              onClick={handleSearch}
              disabled={isPending}
              className="rounded-lg bg-neutral-100 px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-200 disabled:opacity-50"
            >
              Search
            </button>
          </div>
        </div>

        {/* Source */}
        <div className="w-40">
          <label className="block text-xs font-medium text-neutral-500 mb-1">
            Source
          </label>
          <select
            value={currentSource ?? 'all'}
            onChange={(e) => handleSourceChange(e.target.value)}
            disabled={isPending}
            className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 focus:outline-none"
          >
            {sources.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>

        {/* Date Range */}
        <div className="w-36">
          <label className="block text-xs font-medium text-neutral-500 mb-1">
            From
          </label>
          <input
            type="date"
            value={currentStartDate ?? ''}
            onChange={(e) => handleDateChange(e.target.value || undefined, currentEndDate)}
            className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 focus:outline-none"
          />
        </div>
        <div className="w-36">
          <label className="block text-xs font-medium text-neutral-500 mb-1">
            To
          </label>
          <input
            type="date"
            value={currentEndDate ?? ''}
            onChange={(e) => handleDateChange(currentStartDate, e.target.value || undefined)}
            className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 focus:outline-none"
          />
        </div>

        {/* Reset */}
        {hasFilters && (
          <button
            onClick={handleReset}
            disabled={isPending}
            className="rounded-lg px-3 py-2 text-sm font-medium text-neutral-500 hover:text-neutral-700 disabled:opacity-50"
          >
            Reset
          </button>
        )}
      </div>

      {/* Loading indicator */}
      {isPending && (
        <div className="flex items-center gap-2 text-sm text-neutral-500">
          <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          Loading...
        </div>
      )}
    </div>
  );
}
