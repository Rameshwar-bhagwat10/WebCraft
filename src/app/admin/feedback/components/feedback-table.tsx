'use client';

/**
 * Feedback Table Component
 * Interactive table for managing visitor feedback
 */

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { cn } from '@/lib/utils';
import type { VisitorFeedback } from '@/types/database';

type FeedbackStatus = 'pending' | 'approved' | 'rejected';

interface FeedbackTableProps {
  initialFeedback: VisitorFeedback[];
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    pending: 'bg-amber-100 text-amber-700',
    approved: 'bg-green-100 text-green-700',
    rejected: 'bg-red-100 text-red-700',
  };

  return (
    <span className={cn('rounded-full px-2.5 py-0.5 text-xs font-medium', styles[status])}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={cn('h-4 w-4', star <= rating ? 'text-amber-400' : 'text-neutral-200')}
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  );
}

export function FeedbackTable({ initialFeedback }: FeedbackTableProps) {
  const router = useRouter();
  const [feedback, setFeedback] = useState<VisitorFeedback[]>(initialFeedback);
  const [filter, setFilter] = useState<FeedbackStatus | 'all'>('all');
  const [loading, setLoading] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filteredFeedback = filter === 'all' 
    ? feedback 
    : feedback.filter((f) => f.status === filter);

  const updateStatus = async (id: string, status: FeedbackStatus) => {
    setLoading(id);
    try {
      const res = await fetch(`/api/admin/feedback/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });

      if (res.ok) {
        setFeedback((prev) =>
          prev.map((f) => (f.id === id ? { ...f, status } : f))
        );
        router.refresh();
      }
    } catch (error) {
      console.error('Failed to update status:', error);
    } finally {
      setLoading(null);
    }
  };

  const toggleFeatured = async (id: string, featured: boolean) => {
    setLoading(id);
    try {
      const res = await fetch(`/api/admin/feedback/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_featured: featured }),
      });

      if (res.ok) {
        setFeedback((prev) =>
          prev.map((f) => (f.id === id ? { ...f, is_featured: featured } : f))
        );
        router.refresh();
      }
    } catch (error) {
      console.error('Failed to toggle featured:', error);
    } finally {
      setLoading(null);
    }
  };

  const deleteFeedback = async (id: string) => {
    if (!confirm('Delete this feedback?')) return;

    setLoading(id);
    try {
      const res = await fetch(`/api/admin/feedback/${id}`, { method: 'DELETE' });

      if (res.ok) {
        setFeedback((prev) => prev.filter((f) => f.id !== id));
        router.refresh();
      }
    } catch (error) {
      console.error('Failed to delete:', error);
    } finally {
      setLoading(null);
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="rounded-xl border border-neutral-200 bg-white">
      {/* Filter tabs */}
      <div className="flex gap-1 border-b border-neutral-200 p-2">
        {(['all', 'pending', 'approved', 'rejected'] as const).map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={cn(
              'rounded-lg px-3 py-1.5 text-sm font-medium transition-colors',
              filter === status
                ? 'bg-primary-100 text-primary-700'
                : 'text-neutral-600 hover:bg-neutral-100'
            )}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
            {status !== 'all' && (
              <span className="ml-1.5 text-xs">
                ({feedback.filter((f) => f.status === status).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Table */}
      {filteredFeedback.length === 0 ? (
        <div className="p-8 text-center text-sm text-neutral-500">
          No feedback found
        </div>
      ) : (
        <div className="divide-y divide-neutral-100">
          {filteredFeedback.map((item) => (
            <div key={item.id} className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-3">
                    <span className="font-medium text-neutral-900">{item.name}</span>
                    <StatusBadge status={item.status} />
                    {item.is_featured && (
                      <span className="rounded-full bg-purple-100 px-2 py-0.5 text-xs font-medium text-purple-700">
                        Featured
                      </span>
                    )}
                  </div>
                  {item.email && (
                    <p className="mt-0.5 text-sm text-neutral-500">{item.email}</p>
                  )}
                  <div className="mt-2 flex items-center gap-3">
                    <StarRating rating={item.rating} />
                    <span className="text-xs text-neutral-400">
                      {formatDate(item.created_at)}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  {item.status === 'pending' && (
                    <>
                      <button
                        onClick={() => updateStatus(item.id, 'approved')}
                        disabled={loading === item.id}
                        className="rounded-lg bg-green-100 px-3 py-1.5 text-xs font-medium text-green-700 hover:bg-green-200 disabled:opacity-50"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => updateStatus(item.id, 'rejected')}
                        disabled={loading === item.id}
                        className="rounded-lg bg-red-100 px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-200 disabled:opacity-50"
                      >
                        Reject
                      </button>
                    </>
                  )}
                  {item.status === 'approved' && (
                    <button
                      onClick={() => toggleFeatured(item.id, !item.is_featured)}
                      disabled={loading === item.id}
                      className={cn(
                        'rounded-lg px-3 py-1.5 text-xs font-medium disabled:opacity-50',
                        item.is_featured
                          ? 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                          : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                      )}
                    >
                      {item.is_featured ? 'Unfeature' : 'Feature'}
                    </button>
                  )}
                  <button
                    onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
                    className="rounded-lg bg-neutral-100 px-3 py-1.5 text-xs font-medium text-neutral-700 hover:bg-neutral-200"
                  >
                    {expandedId === item.id ? 'Hide' : 'View'}
                  </button>
                  <button
                    onClick={() => deleteFeedback(item.id)}
                    disabled={loading === item.id}
                    className="rounded-lg bg-neutral-100 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
                  >
                    Delete
                  </button>
                </div>
              </div>

              {/* Expanded content */}
              {expandedId === item.id && (
                <div className="mt-4 rounded-lg bg-neutral-50 p-4">
                  <p className="text-sm leading-relaxed text-neutral-700">
                    &ldquo;{item.message}&rdquo;
                  </p>
                  {(item.ip_address || item.user_agent) && (
                    <div className="mt-3 border-t border-neutral-200 pt-3 text-xs text-neutral-400">
                      {item.ip_address && <p>IP: {item.ip_address}</p>}
                      {item.user_agent && (
                        <p className="mt-1 truncate">UA: {item.user_agent}</p>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
