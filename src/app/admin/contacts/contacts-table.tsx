'use client';

/**
 * Contacts Table Component
 * Interactive table for managing contact submissions
 */

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { Button } from '@/components/ui';
import { cn } from '@/lib/utils';
import type { ContactStatus, ContactSubmission } from '@/types/database';
import { VALID_STATUS_TRANSITIONS } from '@/types/database';

interface ContactsTableProps {
  contacts: ContactSubmission[];
  currentPage: number;
  totalPages: number;
  currentStatus?: string;
}

const statuses: { value: string; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'new', label: 'New' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'qualified', label: 'Qualified' },
  { value: 'converted', label: 'Converted' },
  { value: 'closed', label: 'Closed' },
];

export function ContactsTable({
  contacts,
  currentPage,
  totalPages,
  currentStatus = 'all',
}: ContactsTableProps) {
  const router = useRouter();
  const [selectedContact, setSelectedContact] = useState<ContactSubmission | null>(null);
  const [updating, setUpdating] = useState(false);

  const handleStatusChange = async (id: string, currentStatus: ContactStatus, newStatus: ContactStatus) => {
    // Validate transition client-side first
    const allowedTransitions = VALID_STATUS_TRANSITIONS[currentStatus];
    if (!allowedTransitions.includes(newStatus)) {
      alert(`Cannot change status from "${currentStatus}" to "${newStatus}"`);
      return;
    }

    setUpdating(true);
    
    // Use API route for server-side validation
    const response = await fetch(`/api/admin/leads/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    });

    const result = await response.json();
    
    if (!result.success) {
      alert(result.error || 'Failed to update status');
    }

    router.refresh();
    setUpdating(false);
  };

  const handleNotesUpdate = async (id: string, notes: string) => {
    // Use API route
    const response = await fetch(`/api/admin/leads/${id}/notes`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ notes }),
    });

    const result = await response.json();
    
    if (!result.success) {
      alert(result.error || 'Failed to update notes');
    }
    
    router.refresh();
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {statuses.map((s) => (
          <Link
            key={s.value}
            href={`/admin/contacts?status=${s.value}`}
            className={cn(
              'rounded-full px-4 py-1.5 text-sm font-medium transition-colors',
              currentStatus === s.value
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
                Contact
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">
                Project
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">
                Date
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-neutral-500">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {contacts.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-neutral-500">
                  No submissions found
                </td>
              </tr>
            ) : (
              contacts.map((contact) => (
                <tr key={contact.id} className="hover:bg-neutral-50">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-neutral-900">{contact.name}</p>
                      <p className="text-sm text-neutral-500">{contact.email}</p>
                      {contact.phone && (
                        <p className="text-sm text-neutral-400">{contact.phone}</p>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="capitalize text-neutral-700">
                      {contact.project_type.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={contact.status} />
                  </td>
                  <td className="px-6 py-4 text-sm text-neutral-500">
                    {new Date(contact.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedContact(contact)}
                    >
                      View
                    </Button>
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
            Page {currentPage} of {totalPages}
          </p>
          <div className="flex gap-2">
            <Link
              href={`/admin/contacts?status=${currentStatus}&page=${currentPage - 1}`}
              className={cn(
                'rounded-lg px-4 py-2 text-sm font-medium',
                currentPage <= 1
                  ? 'pointer-events-none opacity-50'
                  : 'bg-neutral-100 hover:bg-neutral-200'
              )}
            >
              Previous
            </Link>
            <Link
              href={`/admin/contacts?status=${currentStatus}&page=${currentPage + 1}`}
              className={cn(
                'rounded-lg px-4 py-2 text-sm font-medium',
                currentPage >= totalPages
                  ? 'pointer-events-none opacity-50'
                  : 'bg-neutral-100 hover:bg-neutral-200'
              )}
            >
              Next
            </Link>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {selectedContact && (
        <ContactDetailModal
          contact={selectedContact}
          onClose={() => setSelectedContact(null)}
          onStatusChange={handleStatusChange}
          onNotesUpdate={handleNotesUpdate}
          updating={updating}
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
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${colors[status] ?? colors.new}`}
    >
      {status}
    </span>
  );
}

function ContactDetailModal({
  contact,
  onClose,
  onStatusChange,
  onNotesUpdate,
  updating,
}: {
  contact: ContactSubmission;
  onClose: () => void;
  onStatusChange: (id: string, currentStatus: ContactStatus, newStatus: ContactStatus) => void;
  onNotesUpdate: (id: string, notes: string) => void;
  updating: boolean;
}) {
  const [notes, setNotes] = useState(contact.admin_notes ?? '');
  
  // Get valid next statuses based on current status
  const validNextStatuses = VALID_STATUS_TRANSITIONS[contact.status] ?? [];
  const allStatuses: ContactStatus[] = ['new', 'contacted', 'qualified', 'converted', 'closed'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-2xl rounded-xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-neutral-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-neutral-900">Contact Details</h2>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-neutral-600"
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
              <p className="text-neutral-900">{contact.name}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-neutral-500">Email</p>
              <a href={`mailto:${contact.email}`} className="text-primary-600 hover:underline">
                {contact.email}
              </a>
            </div>
            <div>
              <p className="text-sm font-medium text-neutral-500">Phone</p>
              <p className="text-neutral-900">{contact.phone || '—'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-neutral-500">Project Type</p>
              <p className="capitalize text-neutral-900">{contact.project_type.replace('_', ' ')}</p>
            </div>
          </div>

          {/* Message */}
          <div>
            <p className="text-sm font-medium text-neutral-500">Message</p>
            <p className="mt-1 whitespace-pre-wrap text-neutral-900">{contact.message}</p>
          </div>

          {/* Status */}
          <div>
            <p className="mb-2 text-sm font-medium text-neutral-500">
              Status <span className="text-neutral-400">(click to change)</span>
            </p>
            <div className="flex flex-wrap gap-2">
              {allStatuses.map((s) => {
                const isCurrent = contact.status === s;
                const isValidTransition = validNextStatuses.includes(s);
                const isDisabled = !isCurrent && !isValidTransition;
                
                return (
                  <button
                    key={s}
                    onClick={() => !isCurrent && onStatusChange(contact.id, contact.status, s)}
                    disabled={updating || isDisabled}
                    title={isDisabled ? `Cannot transition from "${contact.status}" to "${s}"` : undefined}
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
          </div>

          {/* Admin Notes */}
          <div>
            <p className="mb-2 text-sm font-medium text-neutral-500">Admin Notes</p>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full rounded-lg border border-neutral-300 px-4 py-2 text-neutral-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-500 focus:outline-none"
              placeholder="Add internal notes..."
            />
            <Button
              variant="secondary"
              size="sm"
              className="mt-2"
              onClick={() => onNotesUpdate(contact.id, notes)}
            >
              Save Notes
            </Button>
          </div>

          {/* Metadata */}
          <div className="border-t border-neutral-200 pt-4 text-sm text-neutral-500">
            <p>Created: {new Date(contact.created_at).toLocaleString()}</p>
            <p>Updated: {new Date(contact.updated_at).toLocaleString()}</p>
            <p>Source: {contact.lead_source ?? 'contact'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
