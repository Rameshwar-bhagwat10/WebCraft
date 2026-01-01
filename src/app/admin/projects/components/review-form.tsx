'use client';

/**
 * Review Form Component
 * Add/Edit client review for a project
 */

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { cn } from '@/lib/utils';
import type { ClientReview } from '@/types/database';

interface ReviewFormProps {
  projectId: string;
  review?: ClientReview | null;
}

export function ReviewForm({ projectId, review }: ReviewFormProps) {
  const router = useRouter();
  const isEditing = !!review;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Form state
  const [clientName, setClientName] = useState(review?.client_name ?? '');
  const [clientRole, setClientRole] = useState(review?.client_role ?? '');
  const [clientCompany, setClientCompany] = useState(review?.client_company ?? '');
  const [reviewText, setReviewText] = useState(review?.review_text ?? '');
  const [rating, setRating] = useState<number>(review?.rating ?? 5);
  const [isFeatured, setIsFeatured] = useState(review?.is_featured ?? false);
  const [isPublished, setIsPublished] = useState(review?.is_published ?? false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const payload = {
        project_id: projectId,
        client_name: clientName,
        client_role: clientRole || null,
        client_company: clientCompany || null,
        review_text: reviewText,
        rating,
        is_featured: isFeatured,
        is_published: isPublished,
      };

      const url = isEditing
        ? `/api/admin/reviews/${review.id}`
        : '/api/admin/reviews';

      const res = await fetch(url, {
        method: isEditing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to save review');
      }

      setSuccess(true);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!review || !confirm('Delete this review?')) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/admin/reviews/${review.id}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to delete');
      }

      // Reset form
      setClientName('');
      setClientRole('');
      setClientCompany('');
      setReviewText('');
      setRating(5);
      setIsFeatured(false);
      setIsPublished(false);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Delete failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</div>
      )}
      {success && (
        <div className="rounded-lg bg-green-50 p-3 text-sm text-green-700">
          Review saved successfully!
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-neutral-700">
            Client Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
            required
            maxLength={100}
            className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            placeholder="John Smith"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-neutral-700">
            Role
          </label>
          <input
            type="text"
            value={clientRole}
            onChange={(e) => setClientRole(e.target.value)}
            maxLength={100}
            className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            placeholder="CEO"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-neutral-700">
            Company
          </label>
          <input
            type="text"
            value={clientCompany}
            onChange={(e) => setClientCompany(e.target.value)}
            maxLength={100}
            className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            placeholder="Acme Inc."
          />
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-neutral-700">
          Review <span className="text-red-500">*</span>
        </label>
        <textarea
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
          required
          maxLength={1000}
          rows={3}
          className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
          placeholder="What the client said about the project..."
        />
        <p className="mt-1 text-xs text-neutral-500">{reviewText.length}/1000</p>
      </div>

      <div className="flex flex-wrap items-center gap-6">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-neutral-700">Rating</label>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className="p-0.5"
              >
                <svg
                  className={cn('h-6 w-6', star <= rating ? 'text-amber-400' : 'text-neutral-300')}
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="review-published"
            checked={isPublished}
            onChange={(e) => setIsPublished(e.target.checked)}
            className="h-4 w-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
          />
          <label htmlFor="review-published" className="text-sm font-medium text-neutral-700">
            Published
          </label>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="review-featured"
            checked={isFeatured}
            onChange={(e) => setIsFeatured(e.target.checked)}
            className="h-4 w-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
          />
          <label htmlFor="review-featured" className="text-sm font-medium text-neutral-700">
            Featured on homepage
          </label>
        </div>
      </div>

      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={loading}
          className={cn(
            'rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700',
            loading && 'cursor-not-allowed opacity-50'
          )}
        >
          {loading ? 'Saving...' : isEditing ? 'Update Review' : 'Add Review'}
        </button>

        {isEditing && (
          <button
            type="button"
            onClick={handleDelete}
            disabled={loading}
            className="rounded-lg border border-red-300 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
          >
            Delete
          </button>
        )}
      </div>
    </form>
  );
}
