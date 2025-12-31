'use client';

/**
 * Leads Table Component
 * Interactive table with inline status updates and optimistic UI
 */

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';

import { Button } from '@/components/ui';
import { cn } from '@/lib/utils';
import type { ContactStatus, ContactSubmission } from '@/types/database';
import { VALID_STATUS_TRANSITIONS } from '@/types/database';

interface LeadsTableProps {
  leads: ContactSubmission[];
  currentPage: number;
  totalPages: number;
  total: number;
  canEdit: boolean;
  filters: {
    status: string;
    source?: string | undefined;
    search?: string | undefined;
    startDate?: string | undefined;
    endDate?: string | undefined;
  };
}

export function LeadsTable({
  leads,
  currentPage,
  totalPages,
  total,
  canEdit,
  filters,
}: LeadsTableProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [selectedLead, setSelectedLead] = useState<ContactSubmission | null>(null);
  const [optimisticUpdates, setOptimisticUpdates] = useState<Record<string, ContactStatus>>({});

  // Build pagination URL
  const buildPageUrl = (page: number) => {
    const params = new URLSearchParams();
    if (filters.status !== 'all') params.set('status', filters.status);
    if (filters.source) params.set('source', filters.source);
    if (filters.search) params.set('search', filters.search);
    if (filters.startDate) params.set('startDate', filters.startDate);
    if (filters.endDate) params.set('endDate', filters.endDate);
    params.set('page', String(page));
    return `/admin/leads?${params.toString()}`;
  };

  // Inline status update with optimistic UI
  const handleInlineStatusChange = async (lead: ContactSubmission, newStatus: ContactStatus) => {
    if (!canEdit) return;
    
    const currentStatus = optimisticUpdates[lead.id] ?? lead.status;
    const validTransitions = VALID_STATUS_TRANSITIONS[currentStatus];
    
    if (!validTransitions.includes(newStatus)) return;

    // Optimistic update
    setOptimisticUpdates((prev) => ({ ...prev, [lead.id]: newStatus }));

    try {
      const response = await fetch(`/api/admin/leads/${lead.id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      const result = await response.json();

      if (!result.success) {
        // Rollback on error
        setOptimisticUpdates((prev) => {
          const updated = { ...prev };
          delete updated[lead.id];
          return updated;
        });
        alert(result.error || 'Failed to update status');
      } else {
        // Refresh data
        startTransition(() => {
          router.refresh();
        });
      }
    } catch {
      // Rollback on error
      setOptimisticUpdates((prev) => {
        const updated = { ...prev };
        delete updated[lead.id];
        return updated;
      });
      alert('Network error. Please try again.');
    }
  };

  // Get display status (optimistic or actual)
  const getDisplayStatus = (lead: ContactSubmission): ContactStatus => {
    return optimisticUpdates[lead.id] ?? lead.status;
  };

  return (
    <div className="space-y-4">
      {/* Desktop Table */}
      <div className="hidden overflow-hidden rounded-xl border border-neutral-200 bg-white md:block">
        <table className="min-w-full divide-y divide-neutral-200" role="table">
          <thead className="bg-neutral-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">
                Contact
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">
                Source
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">
                Date
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-neutral-500">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {leads.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center">
                  <EmptyState />
                </td>
              </tr>
            ) : (
              leads.map((lead) => {
                const displayStatus = getDisplayStatus(lead);
                const isNew = displayStatus === 'new';
                
                return (
                  <tr
                    key={lead.id}
                    className={cn(
                      'transition-colors hover:bg-neutral-50',
                      isNew && 'bg-blue-50/30'
                    )}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {isNew && (
                          <span className="h-2 w-2 rounded-full bg-blue-500" title="New lead" />
                        )}
                        <div>
                          <p className="font-medium text-neutral-900">{lead.name}</p>
                          <p className="text-sm text-neutral-500">{lead.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <SourceBadge source={lead.lead_source ?? 'contact'} />
                    </td>
                    <td className="px-6 py-4">
                      {canEdit ? (
                        <StatusDropdown
                          status={displayStatus}
                          onChange={(newStatus) => handleInlineStatusChange(lead, newStatus)}
                          disabled={isPending}
                        />
                      ) : (
                        <StatusBadge status={displayStatus} />
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-neutral-500">
                      {formatDate(lead.created_at)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedLead(lead)}
                      >
                        View
                      </Button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="space-y-3 md:hidden">
        {leads.length === 0 ? (
          <div className="rounded-xl border border-neutral-200 bg-white p-6">
            <EmptyState />
          </div>
        ) : (
          leads.map((lead) => {
            const displayStatus = getDisplayStatus(lead);
            const isNew = displayStatus === 'new';
            
            return (
              <div
                key={lead.id}
                className={cn(
                  'rounded-xl border border-neutral-200 bg-white p-4',
                  isNew && 'border-blue-200 bg-blue-50/30'
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      {isNew && <span className="h-2 w-2 rounded-full bg-blue-500" />}
                      <p className="font-medium text-neutral-900 truncate">{lead.name}</p>
                    </div>
                    <p className="text-sm text-neutral-500 truncate">{lead.email}</p>
                  </div>
                  <StatusBadge status={displayStatus} />
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <SourceBadge source={lead.lead_source ?? 'contact'} />
                    <span className="text-xs text-neutral-400">{formatDate(lead.created_at)}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedLead(lead)}
                  >
                    View
                  </Button>
                </div>
              </div>
            );
          })
        )}
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
              aria-disabled={currentPage <= 1}
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
              aria-disabled={currentPage >= totalPages}
            >
              Next
            </Link>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {selectedLead && (
        <LeadDetailModal
          lead={selectedLead}
          canEdit={canEdit}
          onClose={() => setSelectedLead(null)}
          onStatusChange={handleInlineStatusChange}
        />
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    new: 'bg-blue-100 text-blue-700',
    contacted: 'bg-yellow-100 text-yellow-700',
    qualified: 'bg-green-100 text-green-700',
    converted: 'bg-purple-100 text-purple-700',
    closed: 'bg-neutral-100 text-neutral-700',
  };

  return (
    <span className={cn('inline-flex rounded-full px-2.5 py-1 text-xs font-medium', colors[status] ?? colors.new)}>
      {status}
    </span>
  );
}

function SourceBadge({ source }: { source: string }) {
  const labels: Record<string, string> = {
    contact: 'Contact',
    calculator: 'Calculator',
    chat: 'Chat',
  };

  return (
    <span className="inline-flex rounded bg-neutral-100 px-2 py-0.5 text-xs font-medium text-neutral-600">
      {labels[source] ?? source}
    </span>
  );
}

function StatusDropdown({
  status,
  onChange,
  disabled,
}: {
  status: ContactStatus;
  onChange: (status: ContactStatus) => void;
  disabled: boolean;
}) {
  const validTransitions = VALID_STATUS_TRANSITIONS[status];
  const allStatuses: ContactStatus[] = ['new', 'contacted', 'qualified', 'converted', 'closed'];

  return (
    <select
      value={status}
      onChange={(e) => onChange(e.target.value as ContactStatus)}
      disabled={disabled}
      className={cn(
        'rounded-lg border px-2 py-1 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary-500',
        status === 'new' && 'border-blue-200 bg-blue-50 text-blue-700',
        status === 'contacted' && 'border-yellow-200 bg-yellow-50 text-yellow-700',
        status === 'qualified' && 'border-green-200 bg-green-50 text-green-700',
        status === 'converted' && 'border-purple-200 bg-purple-50 text-purple-700',
        status === 'closed' && 'border-neutral-200 bg-neutral-50 text-neutral-700',
        disabled && 'opacity-50 cursor-not-allowed'
      )}
    >
      <option value={status}>{status}</option>
      {allStatuses
        .filter((s) => s !== status && validTransitions.includes(s))
        .map((s) => (
          <option key={s} value={s}>
            → {s}
          </option>
        ))}
    </select>
  );
}

function EmptyState() {
  return (
    <div className="text-center">
      <svg className="mx-auto h-12 w-12 text-neutral-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
      </svg>
      <p className="mt-2 text-neutral-500">No leads found</p>
      <p className="text-sm text-neutral-400">Try adjusting your filters</p>
    </div>
  );
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  
  return date.toLocaleDateString();
}

function LeadDetailModal({
  lead,
  canEdit,
  onClose,
  onStatusChange,
}: {
  lead: ContactSubmission;
  canEdit: boolean;
  onClose: () => void;
  onStatusChange: (lead: ContactSubmission, status: ContactStatus) => void;
}) {
  const router = useRouter();
  const [notes, setNotes] = useState(lead.admin_notes ?? '');
  const [saving, setSaving] = useState(false);
  const validTransitions = VALID_STATUS_TRANSITIONS[lead.status];
  const allStatuses: ContactStatus[] = ['new', 'contacted', 'qualified', 'converted', 'closed'];

  const handleSaveNotes = async () => {
    if (!canEdit) return;
    setSaving(true);

    const response = await fetch(`/api/admin/leads/${lead.id}/notes`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ notes }),
    });

    const result = await response.json();
    setSaving(false);

    if (result.success) {
      router.refresh();
    } else {
      alert(result.error || 'Failed to save notes');
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl bg-white shadow-xl">
        <div className="sticky top-0 flex items-center justify-between border-b border-neutral-200 bg-white px-6 py-4">
          <h2 id="modal-title" className="text-lg font-semibold text-neutral-900">
            Lead Details
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600"
            aria-label="Close"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-6 p-6">
          {/* Contact Info */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-sm font-medium text-neutral-500">Name</p>
              <p className="text-neutral-900">{lead.name}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-neutral-500">Email</p>
              <a href={`mailto:${lead.email}`} className="text-primary-600 hover:underline">
                {lead.email}
              </a>
            </div>
            <div>
              <p className="text-sm font-medium text-neutral-500">Phone</p>
              <p className="text-neutral-900">{lead.phone || '—'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-neutral-500">Project Type</p>
              <p className="capitalize text-neutral-900">{lead.project_type.replace('_', ' ')}</p>
            </div>
          </div>

          {/* Message */}
          <div>
            <p className="text-sm font-medium text-neutral-500">Message</p>
            <p className="mt-1 whitespace-pre-wrap rounded-lg bg-neutral-50 p-3 text-neutral-900">
              {lead.message}
            </p>
          </div>

          {/* Status */}
          <div>
            <p className="mb-2 text-sm font-medium text-neutral-500">Status</p>
            <div className="flex flex-wrap gap-2">
              {allStatuses.map((s) => {
                const isCurrent = lead.status === s;
                const isValid = validTransitions.includes(s);
                const isDisabled = !canEdit || (!isCurrent && !isValid);

                return (
                  <button
                    key={s}
                    onClick={() => !isCurrent && canEdit && onStatusChange(lead, s)}
                    disabled={isDisabled}
                    className={cn(
                      'rounded-full px-4 py-1.5 text-sm font-medium transition-colors',
                      isCurrent
                        ? 'bg-primary-600 text-white'
                        : isDisabled
                        ? 'cursor-not-allowed bg-neutral-50 text-neutral-300'
                        : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                    )}
                  >
                    {s}
                  </button>
                );
              })}
            </div>
            {!canEdit && (
              <p className="mt-2 text-xs text-neutral-400">
                You don&apos;t have permission to change status
              </p>
            )}
          </div>

          {/* Admin Notes */}
          <div>
            <p className="mb-2 text-sm font-medium text-neutral-500">Admin Notes</p>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              disabled={!canEdit}
              rows={3}
              className="w-full rounded-lg border border-neutral-300 px-4 py-2 text-neutral-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-500 focus:outline-none disabled:bg-neutral-50 disabled:cursor-not-allowed"
              placeholder={canEdit ? 'Add internal notes...' : 'No notes'}
            />
            {canEdit && (
              <Button
                variant="secondary"
                size="sm"
                className="mt-2"
                onClick={handleSaveNotes}
                disabled={saving}
              >
                {saving ? 'Saving...' : 'Save Notes'}
              </Button>
            )}
          </div>

          {/* Metadata */}
          <div className="border-t border-neutral-200 pt-4 text-sm text-neutral-500">
            <p>Created: {new Date(lead.created_at).toLocaleString()}</p>
            <p>Updated: {new Date(lead.updated_at).toLocaleString()}</p>
            <p>Source: {lead.lead_source ?? 'contact'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
