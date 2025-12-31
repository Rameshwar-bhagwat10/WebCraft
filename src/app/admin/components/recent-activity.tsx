'use client';

/**
 * Recent Activity Component
 * Shows recent leads with animations
 */

import Link from 'next/link';
import { useEffect, useState } from 'react';

import { cn } from '@/lib/utils';

interface Lead {
  id: string;
  name: string;
  email: string;
  project_type: string;
  status: string;
  lead_source: string;
  created_at: string;
}

interface RecentActivityProps {
  leads: Lead[];
}

export function RecentActivity({ leads }: RecentActivityProps) {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white overflow-hidden">
      <div className="flex items-center justify-between border-b border-neutral-100 px-6 py-4">
        <div>
          <h2 className="font-semibold text-neutral-900">Recent Activity</h2>
          <p className="text-sm text-neutral-500">Latest lead submissions</p>
        </div>
        <Link
          href="/admin/leads"
          className={cn(
            'inline-flex items-center gap-1 text-sm font-medium',
            'text-primary-600 hover:text-primary-700 transition-colors'
          )}
        >
          View all
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>

      {leads.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="divide-y divide-neutral-100">
          {leads.map((lead, index) => (
            <LeadRow key={lead.id} lead={lead} index={index} />
          ))}
        </div>
      )}
    </div>
  );
}

function LeadRow({ lead, index }: { lead: Lead; index: number }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), index * 100);
    return () => clearTimeout(timer);
  }, [index]);

  return (
    <Link
      href={`/admin/leads?search=${encodeURIComponent(lead.email)}`}
      className={cn(
        'flex items-center justify-between px-6 py-4',
        'transition-all duration-300 hover:bg-neutral-50',
        'opacity-0 translate-x-4',
        isVisible && 'opacity-100 translate-x-0'
      )}
      style={{ transitionDelay: `${index * 50}ms` }}
    >
      <div className="flex items-center gap-4">
        {/* Avatar */}
        <div className={cn(
          'flex h-10 w-10 items-center justify-center rounded-full',
          'bg-linear-to-br from-primary-400 to-primary-600 text-white font-medium'
        )}>
          {lead.name.charAt(0).toUpperCase()}
        </div>

        {/* Info */}
        <div>
          <div className="flex items-center gap-2">
            <p className="font-medium text-neutral-900">{lead.name}</p>
            {lead.status === 'new' && (
              <span className="inline-flex h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
            )}
          </div>
          <p className="text-sm text-neutral-500">{lead.email}</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="text-right hidden sm:block">
          <StatusBadge status={lead.status} />
          <p className="mt-1 text-xs text-neutral-400">
            {formatRelativeDate(lead.created_at)}
          </p>
        </div>
        <SourceIcon source={lead.lead_source} />
      </div>
    </Link>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    new: 'bg-blue-100 text-blue-700',
    contacted: 'bg-amber-100 text-amber-700',
    qualified: 'bg-emerald-100 text-emerald-700',
    converted: 'bg-purple-100 text-purple-700',
    closed: 'bg-neutral-100 text-neutral-600',
  };

  return (
    <span className={cn(
      'inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium capitalize',
      styles[status] ?? styles.new
    )}>
      {status}
    </span>
  );
}

function SourceIcon({ source }: { source: string }) {
  const icons: Record<string, React.ReactNode> = {
    contact: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
      </svg>
    ),
    calculator: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 15.75V18m-7.5-6.75h.008v.008H8.25v-.008zm0 2.25h.008v.008H8.25V13.5zm0 2.25h.008v.008H8.25v-.008zm0 2.25h.008v.008H8.25V18zm2.498-6.75h.007v.008h-.007v-.008zm0 2.25h.007v.008h-.007V13.5zm0 2.25h.007v.008h-.007v-.008zm0 2.25h.007v.008h-.007V18zm2.504-6.75h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V13.5zm0 2.25h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V18zm2.498-6.75h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V13.5zM8.25 6h7.5v2.25h-7.5V6zM12 2.25c-1.892 0-3.758.11-5.593.322C5.307 2.7 4.5 3.65 4.5 4.757V19.5a2.25 2.25 0 002.25 2.25h10.5a2.25 2.25 0 002.25-2.25V4.757c0-1.108-.806-2.057-1.907-2.185A48.507 48.507 0 0012 2.25z" />
      </svg>
    ),
    chat: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
      </svg>
    ),
  };

  const colors: Record<string, string> = {
    contact: 'text-blue-500 bg-blue-50',
    calculator: 'text-emerald-500 bg-emerald-50',
    chat: 'text-purple-500 bg-purple-50',
  };

  return (
    <div className={cn(
      'flex h-8 w-8 items-center justify-center rounded-lg',
      colors[source] ?? 'text-neutral-500 bg-neutral-50'
    )}>
      {icons[source] ?? icons.contact}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="px-6 py-16 text-center">
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-neutral-100">
        <svg className="h-8 w-8 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
        </svg>
      </div>
      <p className="font-medium text-neutral-700">No leads yet</p>
      <p className="mt-1 text-sm text-neutral-500">
        Leads will appear here when visitors submit forms
      </p>
    </div>
  );
}

function formatRelativeDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString();
}
