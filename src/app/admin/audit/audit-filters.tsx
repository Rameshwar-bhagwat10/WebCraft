'use client';

/**
 * Audit Log Filters Component
 */

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useTransition } from 'react';

interface AuditFiltersProps {
  currentAction?: string | undefined;
  currentResourceType?: string | undefined;
  currentStartDate?: string | undefined;
  currentEndDate?: string | undefined;
}

const actions = [
  { value: '', label: 'All Actions' },
  { value: 'login', label: 'Login' },
  { value: 'logout', label: 'Logout' },
  { value: 'login_failed', label: 'Login Failed' },
  { value: 'lead_status_update', label: 'Lead Status Update' },
  { value: 'lead_notes_update', label: 'Lead Notes Update' },
  { value: 'lead_view', label: 'Lead View' },
];

const resourceTypes = [
  { value: '', label: 'All Resources' },
  { value: 'auth', label: 'Authentication' },
  { value: 'lead', label: 'Leads' },
  { value: 'admin', label: 'Admin' },
  { value: 'settings', label: 'Settings' },
];

export function AuditFilters({
  currentAction,
  currentResourceType,
  currentStartDate,
  currentEndDate,
}: AuditFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const buildUrl = useCallback(
    (updates: Record<string, string | undefined>) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set('page', '1');

      Object.entries(updates).forEach(([key, value]) => {
        if (value) {
          params.set(key, value);
        } else {
          params.delete(key);
        }
      });

      return `/admin/audit?${params.toString()}`;
    },
    [searchParams]
  );

  const handleFilterChange = (key: string, value: string) => {
    startTransition(() => {
      router.push(buildUrl({ [key]: value || undefined }));
    });
  };

  const handleReset = () => {
    startTransition(() => {
      router.push('/admin/audit');
    });
  };

  const hasFilters = currentAction || currentResourceType || currentStartDate || currentEndDate;

  return (
    <div className="flex flex-wrap items-end gap-4 rounded-lg border border-neutral-200 bg-white p-4">
      {/* Action Filter */}
      <div className="w-44">
        <label className="block text-xs font-medium text-neutral-500 mb-1">
          Action
        </label>
        <select
          value={currentAction ?? ''}
          onChange={(e) => handleFilterChange('action', e.target.value)}
          disabled={isPending}
          className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 focus:outline-none"
        >
          {actions.map((a) => (
            <option key={a.value} value={a.value}>
              {a.label}
            </option>
          ))}
        </select>
      </div>

      {/* Resource Type Filter */}
      <div className="w-44">
        <label className="block text-xs font-medium text-neutral-500 mb-1">
          Resource
        </label>
        <select
          value={currentResourceType ?? ''}
          onChange={(e) => handleFilterChange('resourceType', e.target.value)}
          disabled={isPending}
          className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 focus:outline-none"
        >
          {resourceTypes.map((r) => (
            <option key={r.value} value={r.value}>
              {r.label}
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
          onChange={(e) => handleFilterChange('startDate', e.target.value)}
          disabled={isPending}
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
          onChange={(e) => handleFilterChange('endDate', e.target.value)}
          disabled={isPending}
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

      {/* Loading */}
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
