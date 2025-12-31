'use client';

/**
 * ChatTrigger Component
 * Floating button that opens the chat widget
 * Lazy-loads the widget panel for performance
 */

import dynamic from 'next/dynamic';
import { useCallback, useRef, useState } from 'react';

import { cn } from '@/lib/utils';

// Lazy load the widget panel
const ChatWidget = dynamic(
  () => import('./chat-widget').then((mod) => ({ default: mod.ChatWidget })),
  { ssr: false }
);

/**
 * Chat/message icon
 */
function ChatIcon(): React.ReactElement {
  return (
    <svg
      className="h-6 w-6"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.5}
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z"
      />
    </svg>
  );
}

/**
 * Close icon
 */
function CloseIcon(): React.ReactElement {
  return (
    <svg
      className="h-6 w-6"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  );
}

export function ChatTrigger(): React.ReactElement {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const toggleWidget = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const closeWidget = useCallback(() => {
    setIsOpen(false);
  }, []);

  return (
    <>
      {/* Floating trigger button */}
      <button
        ref={triggerRef}
        type="button"
        onClick={toggleWidget}
        className={cn(
          'fixed right-4 bottom-4 z-50 sm:right-6 sm:bottom-6',
          'flex h-14 w-14 items-center justify-center rounded-full',
          'shadow-lg',
          'transition-all duration-200 ease-out',
          'hover:scale-105',
          'focus-visible:ring-primary-500 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
          'motion-reduce:transition-none motion-reduce:hover:scale-100',
          isOpen
            ? 'bg-neutral-800 text-white hover:bg-neutral-700'
            : 'bg-primary-600 hover:bg-primary-700 text-white'
        )}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        aria-label={isOpen ? 'Close chat' : 'Open chat'}
      >
        {isOpen ? <CloseIcon /> : <ChatIcon />}
      </button>

      {/* Widget panel (lazy loaded) */}
      <ChatWidget isOpen={isOpen} onClose={closeWidget} triggerRef={triggerRef} />
    </>
  );
}
