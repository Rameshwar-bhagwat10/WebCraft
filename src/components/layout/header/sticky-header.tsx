'use client';

/**
 * StickyHeader Component
 * Glassmorphism navbar with blur effect
 * Server Component - no scroll detection needed for consistent blur
 */

import { cn } from '@/lib/utils';

interface StickyHeaderProps {
  children: React.ReactNode;
}

export function StickyHeader({
  children,
}: StickyHeaderProps): React.ReactElement {
  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full',
        'transition-all duration-300 ease-out',
        // Glassmorphism effect - more blur and transparency
        'bg-white/50 backdrop-blur-2xl',
        'border-b border-neutral-200/30'
      )}
      role="banner"
    >
      {children}
    </header>
  );
}
