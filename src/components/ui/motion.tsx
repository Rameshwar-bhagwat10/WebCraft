/**
 * Motion Components
 * Lightweight animation primitives using CSS animations
 *
 * Performance: CSS-only animations, no JS runtime
 * Accessibility: Respects prefers-reduced-motion
 *
 * @example
 * <FadeIn delay={0.1}>Content</FadeIn>
 * <SlideUp stagger={0.05} index={2}>Staggered item</SlideUp>
 */

'use client';

import { cn } from '@/lib/utils';

interface MotionProps {
  children: React.ReactNode;
  className?: string;
  /** Delay in seconds */
  delay?: number;
  /** Duration in seconds */
  duration?: number;
  /** For staggered animations: base delay + (index * stagger) */
  index?: number;
  /** Stagger delay between items in seconds */
  stagger?: number;
}

/**
 * FadeIn animation - opacity 0 to 1
 */
export function FadeIn({
  children,
  className,
  delay = 0,
  duration = 0.5,
  index = 0,
  stagger = 0,
}: MotionProps): React.ReactElement {
  const totalDelay = delay + index * stagger;

  return (
    <div
      className={cn('motion-fade-in', className)}
      style={
        {
          '--motion-delay': `${totalDelay}s`,
          '--motion-duration': `${duration}s`,
        } as React.CSSProperties
      }
    >
      {children}
    </div>
  );
}

/**
 * SlideUp animation - fade + translate Y
 */
export function SlideUp({
  children,
  className,
  delay = 0,
  duration = 0.5,
  index = 0,
  stagger = 0,
}: MotionProps): React.ReactElement {
  const totalDelay = delay + index * stagger;

  return (
    <div
      className={cn('motion-slide-up', className)}
      style={
        {
          '--motion-delay': `${totalDelay}s`,
          '--motion-duration': `${duration}s`,
        } as React.CSSProperties
      }
    >
      {children}
    </div>
  );
}

/**
 * ScaleIn animation - fade + scale
 */
export function ScaleIn({
  children,
  className,
  delay = 0,
  duration = 0.4,
  index = 0,
  stagger = 0,
}: MotionProps): React.ReactElement {
  const totalDelay = delay + index * stagger;

  return (
    <div
      className={cn('motion-scale-in', className)}
      style={
        {
          '--motion-delay': `${totalDelay}s`,
          '--motion-duration': `${duration}s`,
        } as React.CSSProperties
      }
    >
      {children}
    </div>
  );
}
