'use client';

/**
 * ChatWidget Component
 * Floating contact widget panel
 */

import { useCallback, useEffect, useRef } from 'react';

import { cn } from '@/lib/utils';

import { ChatForm } from './chat-form';

interface ChatWidgetProps {
  isOpen: boolean;
  onClose: () => void;
  /** Ref to the trigger button for focus return */
  triggerRef?: React.RefObject<HTMLButtonElement | null>;
}

/**
 * Close icon
 */
function CloseIcon(): React.ReactElement {
  return (
    <svg
      className="h-5 w-5"
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

/**
 * Email icon
 */
function EmailIcon(): React.ReactElement {
  return (
    <svg
      className="h-4 w-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.5}
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
      />
    </svg>
  );
}

/**
 * WhatsApp icon
 */
function WhatsAppIcon(): React.ReactElement {
  return (
    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

export function ChatWidget({
  isOpen,
  onClose,
  triggerRef,
}: ChatWidgetProps): React.ReactElement | null {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Focus trap - keep focus within widget
  useEffect(() => {
    if (!isOpen || !panelRef.current) return;

    const panel = panelRef.current;
    const focusableElements = panel.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        // Shift + Tab: if on first element, go to last
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        // Tab: if on last element, go to first
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    document.addEventListener('keydown', handleTabKey);
    return () => document.removeEventListener('keydown', handleTabKey);
  }, [isOpen]);

  // Focus close button when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => closeButtonRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Return focus to trigger when closed
  const handleClose = useCallback(() => {
    onClose();
    // Return focus to trigger button after close
    setTimeout(() => triggerRef?.current?.focus(), 0);
  }, [onClose, triggerRef]);

  // Close on click outside
  const handleBackdropClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) {
        handleClose();
      }
    },
    [handleClose]
  );

  // Handle escape key with focus return
  useEffect(() => {
    if (!isOpen) return;
    const handleEscapeWithFocus = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };
    document.addEventListener('keydown', handleEscapeWithFocus);
    return () => document.removeEventListener('keydown', handleEscapeWithFocus);
  }, [isOpen, handleClose]);

  if (!isOpen) return null;

  return (
    <>
      {/* Invisible backdrop for click-outside */}
      <div
        className="fixed inset-0 z-40"
        onClick={handleBackdropClick}
        aria-hidden="true"
      />

      {/* Widget panel */}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="chat-widget-title"
        className={cn(
          'fixed right-4 bottom-20 z-50 w-[300px] sm:right-6 sm:w-[320px]',
          'rounded-2xl bg-white shadow-2xl',
          'border border-neutral-100',
          'overflow-hidden',
          // Animation using motion classes
          'motion-scale-in'
        )}
        style={
          {
            transformOrigin: 'bottom right',
            '--motion-delay': '0s',
            '--motion-duration': '0.2s',
          } as React.CSSProperties
        }
      >
        {/* Header */}
        <div className="bg-primary-600 px-4 py-4 text-white">
          <div className="flex items-start justify-between">
            <div>
              <h2 id="chat-widget-title" className="text-base font-semibold">
                Quick question?
              </h2>
              <p className="mt-0.5 text-sm text-white/80">
                We usually reply within a few hours
              </p>
            </div>
            <button
              ref={closeButtonRef}
              type="button"
              onClick={handleClose}
              className={cn(
                '-mt-1 -mr-1.5 rounded-lg p-1.5',
                'text-white/80 hover:bg-white/10 hover:text-white',
                'transition-colors duration-150',
                'focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:outline-none'
              )}
              aria-label="Close chat"
            >
              <CloseIcon />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-4">
          <ChatForm onSuccess={onClose} />

          {/* Divider */}
          <div className="my-4 flex items-center gap-3">
            <div className="border-border h-px flex-1 border-t" />
            <span className="text-foreground-muted text-xs">
              or reach us via
            </span>
            <div className="border-border h-px flex-1 border-t" />
          </div>

          {/* Contact shortcuts */}
          <div className="flex gap-2">
            <a
              href="mailto:hello@webcraft.com"
              className={cn(
                'flex flex-1 items-center justify-center gap-2 rounded-lg',
                'border-border bg-background border px-3 py-2.5',
                'text-foreground-secondary text-sm font-medium',
                'transition-colors duration-150',
                'hover:border-primary-200 hover:bg-primary-50 hover:text-primary-600',
                'focus-visible:ring-primary-500 focus-visible:ring-2 focus-visible:outline-none'
              )}
            >
              <EmailIcon />
              Email
            </a>
            <a
              href="https://wa.me/919876543210"
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                'flex flex-1 items-center justify-center gap-2 rounded-lg',
                'border-border bg-background border px-3 py-2.5',
                'text-foreground-secondary text-sm font-medium',
                'transition-colors duration-150',
                'hover:border-success-200 hover:bg-success-50 hover:text-success-600',
                'focus-visible:ring-success-500 focus-visible:ring-2 focus-visible:outline-none'
              )}
            >
              <WhatsAppIcon />
              WhatsApp
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
