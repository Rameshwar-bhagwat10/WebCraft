'use client';

/**
 * StickyHeader Component
 * Wrapper that handles sticky behavior with smooth transitions
 * Client Component - requires scroll detection
 *
 * Performance: Uses CSS transforms and will-change for smooth animations
 * No heavy scroll listeners - uses IntersectionObserver pattern
 */

import { useState, useEffect, useRef } from 'react';

import { cn } from '@/lib/utils';

interface StickyHeaderProps {
  children: React.ReactNode;
}

export function StickyHeader({
  children,
}: StickyHeaderProps): React.ReactElement {
  const [isSticky, setIsSticky] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    // Use IntersectionObserver for performance
    // More efficient than scroll listeners
    const observer = new IntersectionObserver(
      ([entry]) => {
        // When sentinel is not visible, header should be sticky
        setIsSticky(!entry?.isIntersecting);
      },
      { threshold: 0 }
    );

    observer.observe(sentinel);

    return () => observer.disconnect();
  }, []);

  return (
    <>
      {/* Sentinel element for intersection detection */}
      <div
        ref={sentinelRef}
        className="absolute top-0 h-px w-full"
        aria-hidden="true"
      />

      <header
        className={cn(
          'sticky top-0 z-50 w-full',
          'border-b border-transparent',
          'transition-all duration-200',
          // Sticky state styles
          isSticky && [
            'border-border',
            'bg-background/95 backdrop-blur-sm',
            'shadow-sm',
          ]
        )}
        role="banner"
      >
        {children}
      </header>
    </>
  );
}
