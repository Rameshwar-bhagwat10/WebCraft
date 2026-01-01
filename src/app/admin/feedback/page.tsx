/**
 * Admin Feedback Page
 * View and manage visitor feedback
 */

import { getAllFeedbackAdmin, getFeedbackCounts } from '@/lib/feedback/admin';

import { FeedbackTable } from './components/feedback-table';

export const metadata = {
  title: 'Visitor Feedback | Admin Dashboard',
};

export const dynamic = 'force-dynamic';

export default async function FeedbackPage() {
  const [feedback, counts] = await Promise.all([
    getAllFeedbackAdmin(),
    getFeedbackCounts(),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Visitor Feedback</h1>
        <p className="mt-1 text-sm text-neutral-500">
          Review and manage feedback submitted by visitors
        </p>
      </div>

      {/* Stats cards */}
      <div className="grid gap-4 sm:grid-cols-4">
        <div className="rounded-xl border border-neutral-200 bg-white p-4">
          <p className="text-sm font-medium text-neutral-500">Total</p>
          <p className="mt-1 text-2xl font-bold text-neutral-900">{counts.total}</p>
        </div>
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
          <p className="text-sm font-medium text-amber-700">Pending</p>
          <p className="mt-1 text-2xl font-bold text-amber-900">{counts.pending}</p>
        </div>
        <div className="rounded-xl border border-green-200 bg-green-50 p-4">
          <p className="text-sm font-medium text-green-700">Approved</p>
          <p className="mt-1 text-2xl font-bold text-green-900">{counts.approved}</p>
        </div>
        <div className="rounded-xl border border-red-200 bg-red-50 p-4">
          <p className="text-sm font-medium text-red-700">Rejected</p>
          <p className="mt-1 text-2xl font-bold text-red-900">{counts.rejected}</p>
        </div>
      </div>

      {/* Feedback table */}
      <FeedbackTable initialFeedback={feedback} />
    </div>
  );
}
