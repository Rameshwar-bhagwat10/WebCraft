/**
 * Chat Session Detail Page
 * View and reply to chat messages
 */

import Link from 'next/link';
import { notFound } from 'next/navigation';

import { createServerSupabaseClient } from '@/lib/supabase/server';
import { cn } from '@/lib/utils';
import type { ChatMessage, ChatSession } from '@/types/database';

import { ChatReplyForm } from './chat-reply-form';
import { SessionActions } from './session-actions';

export const metadata = {
  title: 'Chat Session | Admin',
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ChatDetailPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createServerSupabaseClient();

  // Get session
  const { data: session } = await supabase
    .from('chat_sessions')
    .select('*')
    .eq('id', id)
    .single();

  if (!session) {
    notFound();
  }

  // Get messages
  const { data: messages } = await supabase
    .from('chat_messages')
    .select('*')
    .eq('session_id', id)
    .order('created_at', { ascending: true });

  // Mark visitor messages as read
  await supabase
    .from('chat_messages')
    .update({ is_read: true } as never)
    .eq('session_id', id)
    .eq('sender', 'visitor')
    .eq('is_read', false);

  const typedSession = session as ChatSession;
  const typedMessages = (messages ?? []) as ChatMessage[];

  // Get visitor info from first message
  const visitorMessage = typedMessages.find((m) => m.sender === 'visitor');
  const visitorName = visitorMessage?.visitor_name ?? 'Anonymous';
  const visitorEmail = visitorMessage?.visitor_email;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link
            href="/admin/chat"
            className="mb-2 inline-flex items-center gap-1 text-sm text-neutral-500 hover:text-neutral-700"
          >
            <BackIcon />
            Back to chats
          </Link>
          <h1 className="text-2xl font-bold text-neutral-900">{visitorName}</h1>
          {visitorEmail && (
            <p className="text-neutral-600">
              <a href={`mailto:${visitorEmail}`} className="hover:underline">
                {visitorEmail}
              </a>
            </p>
          )}
        </div>
        <SessionActions sessionId={id} currentStatus={typedSession.status} />
      </div>

      {/* Session Info */}
      <div className="flex flex-wrap gap-4 rounded-xl border border-neutral-200 bg-white p-4">
        <InfoItem label="Session ID" value={id.slice(0, 8)} />
        <InfoItem label="Visitor ID" value={typedSession.visitor_id.slice(0, 12)} />
        <InfoItem
          label="Started"
          value={new Date(typedSession.started_at).toLocaleString()}
        />
        <InfoItem
          label="Last Message"
          value={new Date(typedSession.last_message_at).toLocaleString()}
        />
        <div>
          <p className="text-xs text-neutral-500">Status</p>
          <StatusBadge status={typedSession.status} />
        </div>
      </div>

      {/* Messages */}
      <div className="rounded-xl border border-neutral-200 bg-white">
        <div className="border-b border-neutral-200 px-4 py-3">
          <h2 className="font-semibold text-neutral-900">
            Messages ({typedMessages.length})
          </h2>
        </div>
        <div className="max-h-[500px] space-y-4 overflow-y-auto p-4">
          {typedMessages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}
        </div>
      </div>

      {/* Reply Form */}
      {typedSession.status === 'active' && (
        <ChatReplyForm sessionId={id} visitorEmail={visitorEmail ?? null} />
      )}
    </div>
  );
}


function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-neutral-500">{label}</p>
      <p className="font-medium text-neutral-900">{value}</p>
    </div>
  );
}

function MessageBubble({ message }: { message: ChatMessage }) {
  const isAdmin = message.sender === 'admin';

  return (
    <div className={cn('flex', isAdmin ? 'justify-end' : 'justify-start')}>
      <div
        className={cn(
          'max-w-[80%] rounded-2xl px-4 py-2.5',
          isAdmin
            ? 'bg-primary-600 text-white'
            : 'bg-neutral-100 text-neutral-900'
        )}
      >
        <p className="whitespace-pre-wrap text-sm">{message.message}</p>
        <p
          className={cn(
            'mt-1 text-xs',
            isAdmin ? 'text-white/70' : 'text-neutral-500'
          )}
        >
          {new Date(message.created_at).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </p>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    active: 'bg-green-100 text-green-700',
    closed: 'bg-neutral-100 text-neutral-600',
    converted: 'bg-blue-100 text-blue-700',
  };

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${colors[status] ?? colors.active}`}
    >
      {status}
    </span>
  );
}

function BackIcon() {
  return (
    <svg
      className="h-4 w-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
    </svg>
  );
}
