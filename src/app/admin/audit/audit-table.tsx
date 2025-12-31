'use client';

/**
 * Audit Log Table Component
 */

import Link from 'next/link';
import { useState } from 'react';

import { cn } from '@/lib/utils';
import type { AuditLogEntry } from '@/services/audit';

interface AuditTableProps {
  logs: AuditLogEntry[];
  currentPage: number;
  totalPages: number;
  total: number;
  filters: {
    action?: string | undefined;
    resourceType?: string | undefined;
    startDate?: string | undefined;
    endDate?: string | undefined;
  };
}

export function AuditTable({
  logs,
  currentPage,
  totalPages,
  total,
  filters,
}: AuditTableProps) {
  const [selectedLog, setSelectedLog] = useState<AuditLogEntry | null>(null);

  // Build pagination URL
  const buildPageUrl = (page: number) => {
    const params = new URLSearchParams();
    if (filters.action) params.set('action', filters.action);
    if (filters.resourceType) params.set('resourceType', filters.resourceType);
    if (filters.startDate) params.set('startDate', filters.startDate);
    if (filters.endDate) params.set('endDate', filters.endDate);
    params.set('page', String(page));
    return `/admin/audit?${params.toString()}`;
  };

  return (
    <div className="space-y-4">
      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-neutral-200">
            <thead className="bg-neutral-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">
                  Time
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">
                  Admin
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">
                  Action
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">
                  Resource
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">
                  IP Address
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-neutral-500">
                  Details
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {logs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center">
                    <EmptyState />
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="hover:bg-neutral-50">
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-neutral-500">
                      {formatDateTime(log.created_at)}
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm text-neutral-900 truncate max-w-[150px]">
                        {log.admin_email ?? 'Unknown'}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <ActionBadge action={log.action} />
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-neutral-600">
                        {log.resource_type}
                        {log.resource_id && (
                          <span className="text-neutral-400 ml-1">
                            #{log.resource_id.slice(0, 8)}
                          </span>
                        )}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-neutral-500">
                      {log.ip_address ?? '—'}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => setSelectedLog(log)}
                        className="text-sm font-medium text-primary-600 hover:text-primary-700"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-neutral-500">
            Page {currentPage} of {totalPages} ({total} total)
          </p>
          <div className="flex gap-2">
            <Link
              href={buildPageUrl(currentPage - 1)}
              className={cn(
                'rounded-lg px-4 py-2 text-sm font-medium',
                currentPage <= 1
                  ? 'pointer-events-none opacity-50 bg-neutral-100'
                  : 'bg-neutral-100 hover:bg-neutral-200'
              )}
            >
              Previous
            </Link>
            <Link
              href={buildPageUrl(currentPage + 1)}
              className={cn(
                'rounded-lg px-4 py-2 text-sm font-medium',
                currentPage >= totalPages
                  ? 'pointer-events-none opacity-50 bg-neutral-100'
                  : 'bg-neutral-100 hover:bg-neutral-200'
              )}
            >
              Next
            </Link>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {selectedLog && (
        <LogDetailModal
          log={selectedLog}
          onClose={() => setSelectedLog(null)}
        />
      )}
    </div>
  );
}

function ActionBadge({ action }: { action: string }) {
  const colors: Record<string, string> = {
    login: 'bg-green-100 text-green-700',
    logout: 'bg-neutral-100 text-neutral-700',
    login_failed: 'bg-red-100 text-red-700',
    lead_status_update: 'bg-blue-100 text-blue-700',
    lead_notes_update: 'bg-purple-100 text-purple-700',
    lead_view: 'bg-neutral-100 text-neutral-600',
    settings_update: 'bg-yellow-100 text-yellow-700',
    admin_create: 'bg-green-100 text-green-700',
    admin_update: 'bg-blue-100 text-blue-700',
    admin_delete: 'bg-red-100 text-red-700',
  };

  return (
    <span className={cn(
      'inline-flex rounded-full px-2 py-0.5 text-xs font-medium',
      colors[action] ?? 'bg-neutral-100 text-neutral-600'
    )}>
      {action.replace(/_/g, ' ')}
    </span>
  );
}

function EmptyState() {
  return (
    <div className="text-center">
      <svg className="mx-auto h-12 w-12 text-neutral-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
      </svg>
      <p className="mt-2 text-neutral-500">No audit logs found</p>
      <p className="text-sm text-neutral-400">Try adjusting your filters</p>
    </div>
  );
}

function formatDateTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function LogDetailModal({
  log,
  onClose,
}: {
  log: AuditLogEntry;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-lg rounded-xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-neutral-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-neutral-900">Audit Log Details</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-4 p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-sm font-medium text-neutral-500">Timestamp</p>
              <p className="text-neutral-900">
                {new Date(log.created_at).toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-neutral-500">Admin</p>
              <p className="text-neutral-900">{log.admin_email ?? 'Unknown'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-neutral-500">Action</p>
              <ActionBadge action={log.action} />
            </div>
            <div>
              <p className="text-sm font-medium text-neutral-500">Resource</p>
              <p className="text-neutral-900">
                {log.resource_type}
                {log.resource_id && ` (${log.resource_id})`}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-neutral-500">IP Address</p>
              <p className="text-neutral-900">{log.ip_address ?? '—'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-neutral-500">Admin ID</p>
              <p className="text-neutral-900 text-xs font-mono">{log.admin_id}</p>
            </div>
          </div>

          {/* User Agent */}
          {log.user_agent && (
            <div>
              <p className="text-sm font-medium text-neutral-500">User Agent</p>
              <p className="text-xs text-neutral-600 break-all bg-neutral-50 rounded p-2 mt-1">
                {log.user_agent}
              </p>
            </div>
          )}

          {/* Details JSON */}
          {log.details && Object.keys(log.details).length > 0 && (
            <div>
              <p className="text-sm font-medium text-neutral-500">Details</p>
              <pre className="mt-1 overflow-x-auto rounded-lg bg-neutral-900 p-3 text-xs text-neutral-100">
                {JSON.stringify(log.details, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
