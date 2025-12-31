'use client';

/**
 * StickyHeader Component
 * Glassmorphism navbar with blur effect
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
          'transition-all duration-300 ease-out',
          // Glassmorphism effect - always visible with blur
          'bg-white/70 backdrop-blur-xl',
          'border-b border-white/20',
          // Enhanced shadow on scroll
          isSticky ? 'shadow-lg shadow-black/5' : 'shadow-sm shadow-black/[0.02]'
        )}
        role="banner"
      >
        {children}
      </header>
    </>
  );
}
