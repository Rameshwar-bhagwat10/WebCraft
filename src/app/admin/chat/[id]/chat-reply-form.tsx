'use client';

/**
 * Chat Reply Form
 * Admin can reply to chat messages
 */

import { useRouter } from 'next/navigation';
import { useCallback, useState, useTransition } from 'react';

import { cn } from '@/lib/utils';

interface ChatReplyFormProps {
  sessionId: string;
  visitorEmail?: string | null;
}

export function ChatReplyForm({ sessionId }: ChatReplyFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!message.trim()) return;

      setError(null);

      try {
        const response = await fetch('/api/admin/chat/reply', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            session_id: sessionId,
            message: message.trim(),
          }),
        });

        const result = await response.json();

        if (!response.ok) {
          setError(result.error ?? 'Failed to send reply');
          return;
        }

        setMessage('');
        startTransition(() => {
          router.refresh();
        });
      } catch {
        setError('Network error. Please try again.');
      }
    },
    [sessionId, message, router]
  );

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border border-neutral-200 bg-white p-4"
    >
      <h3 className="mb-3 font-semibold text-neutral-900">Reply</h3>

      {error && (
        <div className="mb-3 rounded-lg bg-red-50 p-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="flex gap-3">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your reply..."
          rows={2}
          className={cn(
            'flex-1 rounded-lg border px-3 py-2.5',
            'border-neutral-200 bg-white text-neutral-900',
            'placeholder:text-neutral-400 text-sm',
            'resize-none transition-colors',
            'hover:border-neutral-300',
            'focus:border-primary-500 focus:ring-primary-500/20 focus:ring-2 focus:outline-none'
          )}
        />
        <button
          type="submit"
          disabled={isPending || !message.trim()}
          className={cn(
            'self-end rounded-lg px-4 py-2.5',
            'bg-primary-600 text-white font-medium text-sm',
            'hover:bg-primary-700 transition-colors',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            'focus:ring-primary-500/20 focus:ring-2 focus:outline-none'
          )}
        >
          {isPending ? 'Sending...' : 'Send'}
        </button>
      </div>
    </form>
  );
}
