'use client';

/**
 * Session Actions
 * Update chat session status
 */

import { useRouter } from 'next/navigation';
import { useCallback, useState, useTransition } from 'react';

import { cn } from '@/lib/utils';
import type { ChatSessionStatus } from '@/types/database';

interface SessionActionsProps {
  sessionId: string;
  currentStatus: ChatSessionStatus;
}

export function SessionActions({ sessionId, currentStatus }: SessionActionsProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const updateStatus = useCallback(
    async (newStatus: ChatSessionStatus) => {
      setError(null);

      try {
        const response = await fetch('/api/admin/chat/status', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            session_id: sessionId,
            status: newStatus,
          }),
        });

        const result = await response.json();

        if (!response.ok) {
          setError(result.error ?? 'Failed to update status');
          return;
        }

        startTransition(() => {
          router.refresh();
        });
      } catch {
        setError('Network error. Please try again.');
      }
    },
    [sessionId, router]
  );

  return (
    <div className="flex flex-col gap-2">
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
      <div className="flex gap-2">
        {currentStatus === 'active' && (
          <>
            <button
              onClick={() => updateStatus('converted')}
              disabled={isPending}
              className={cn(
                'rounded-lg px-3 py-2 text-sm font-medium',
                'bg-blue-100 text-blue-700',
                'hover:bg-blue-200 transition-colors',
                'disabled:opacity-50'
              )}
            >
              Mark Converted
            </button>
            <button
              onClick={() => updateStatus('closed')}
              disabled={isPending}
              className={cn(
                'rounded-lg px-3 py-2 text-sm font-medium',
                'bg-neutral-100 text-neutral-700',
                'hover:bg-neutral-200 transition-colors',
                'disabled:opacity-50'
              )}
            >
              Close Session
            </button>
          </>
        )}
        {currentStatus === 'closed' && (
          <button
            onClick={() => updateStatus('active')}
            disabled={isPending}
            className={cn(
              'rounded-lg px-3 py-2 text-sm font-medium',
              'bg-green-100 text-green-700',
              'hover:bg-green-200 transition-colors',
              'disabled:opacity-50'
            )}
          >
            Reopen Session
          </button>
        )}
      </div>
    </div>
  );
}
