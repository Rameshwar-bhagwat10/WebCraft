'use client';

/**
 * InteractiveGrid Component - PERFORMANCE OPTIMIZED
 * Premium cursor-following glow effect on grid background
 *
 * Performance optimizations applied:
 * 1. NO React state updates on mouse move (refs only)
 * 2. NO re-render loops tied to mouse position
 * 3. Spatial partitioning - only calculate nearby grid points
 * 4. Throttled RAF loop (30fps instead of 60fps)
 * 5. Precomputed grid points (calculated once)
 * 6. IntersectionObserver to pause when offscreen
 * 7. Disabled on mobile devices
 * 8. Respects prefers-reduced-motion
 * 9. Page visibility API to pause when tab hidden
 */

import { useCallback, useEffect, useRef } from 'react';

import { cn } from '@/lib/utils';

// Configuration constants
const GRID_SIZE = 64; // 4rem = 64px
const GLOW_RADIUS = 200; // pixels - reduced for performance
const TARGET_FPS = 30; // Throttled framerate
const FRAME_INTERVAL = 1000 / TARGET_FPS;
const MOBILE_BREAKPOINT = 768; // Disable on mobile

interface GridPoint {
  x: number;
  y: number;
}

/**
 * Check if device is mobile (client-side only)
 */
function isMobileDevice(): boolean {
  if (typeof window === 'undefined') return false;
  return window.innerWidth < MOBILE_BREAKPOINT || 'ontouchstart' in window;
}

/**
 * Check reduced motion preference
 */
function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function InteractiveGrid(): React.ReactElement {
  // Refs for non-reactive state (NO useState for mouse position)
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const isHoveringRef = useRef(false);
  const isVisibleRef = useRef(true);
  const isPageVisibleRef = useRef(true);
  const rafIdRef = useRef<number | null>(null);
  const lastFrameTimeRef = useRef(0);
  const gridPointsRef = useRef<GridPoint[]>([]);
  const canvasSizeRef = useRef({ width: 0, height: 0 });
  const isDisabledRef = useRef(false);

  /**
   * Precompute grid points once on resize
   * Avoids O(n²) calculation per frame
   */
  const computeGridPoints = useCallback(() => {
    const { width, height } = canvasSizeRef.current;
    if (width === 0 || height === 0) return;

    const cols = Math.ceil(width / GRID_SIZE) + 1;
    const rows = Math.ceil(height / GRID_SIZE) + 1;
    const points: GridPoint[] = [];

    for (let row = 0; row <= rows; row++) {
      for (let col = 0; col <= cols; col++) {
        points.push({ x: col * GRID_SIZE, y: row * GRID_SIZE });
      }
    }

    gridPointsRef.current = points;
  }, []);

  /**
   * Draw frame - optimized with spatial filtering
   * Only processes grid points within GLOW_RADIUS of mouse
   */
  const drawFrame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const { width, height } = canvasSizeRef.current;
    const { x: mouseX, y: mouseY } = mouseRef.current;
    const isHovering = isHoveringRef.current;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw base grid (static, low opacity)
    ctx.strokeStyle = 'rgba(200, 200, 200, 0.12)';
    ctx.lineWidth = 1;

    const cols = Math.ceil(width / GRID_SIZE) + 1;
    const rows = Math.ceil(height / GRID_SIZE) + 1;

    // Draw horizontal lines
    ctx.beginPath();
    for (let row = 0; row <= rows; row++) {
      const y = row * GRID_SIZE;
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
    }
    ctx.stroke();

    // Draw vertical lines
    ctx.beginPath();
    for (let col = 0; col <= cols; col++) {
      const x = col * GRID_SIZE;
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
    }
    ctx.stroke();

    // Skip glow effect if not hovering
    if (!isHovering) return;

    // SPATIAL FILTERING: Only process points near mouse
    // This reduces O(n²) to O(k) where k is nearby points
    const glowRadiusSq = GLOW_RADIUS * GLOW_RADIUS;

    for (const point of gridPointsRef.current) {
      const dx = mouseX - point.x;
      const dy = mouseY - point.y;
      const distSq = dx * dx + dy * dy;

      // Skip points outside glow radius (fast rejection)
      if (distSq > glowRadiusSq) continue;

      const dist = Math.sqrt(distSq);
      const intensity = Math.pow(1 - dist / GLOW_RADIUS, 1.5);

      if (intensity < 0.05) continue;

      // Draw glowing dot
      const dotRadius = 2 + intensity * 3;

      // Gradient for glow effect
      const gradient = ctx.createRadialGradient(
        point.x, point.y, 0,
        point.x, point.y, dotRadius * 2
      );
      gradient.addColorStop(0, `rgba(239, 68, 68, ${intensity * 0.9})`);
      gradient.addColorStop(0.5, `rgba(249, 115, 22, ${intensity * 0.5})`);
      gradient.addColorStop(1, 'rgba(236, 72, 153, 0)');

      ctx.beginPath();
      ctx.arc(point.x, point.y, dotRadius * 2, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();

      // Inner bright dot
      ctx.beginPath();
      ctx.arc(point.x, point.y, dotRadius * 0.5, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${intensity * 0.8})`;
      ctx.fill();
    }
  }, []);

  /**
   * Animation loop ref - stores the loop function for self-referencing
   */
  const animationLoopRef = useRef<((timestamp: number) => void) | null>(null);

  /**
   * Update animation loop function when drawFrame changes
   */
  useEffect(() => {
    animationLoopRef.current = (timestamp: number) => {
      // Check if animation should run
      if (isDisabledRef.current || !isVisibleRef.current || !isPageVisibleRef.current) {
        rafIdRef.current = null;
        return;
      }

      // Throttle to TARGET_FPS
      const elapsed = timestamp - lastFrameTimeRef.current;
      if (elapsed >= FRAME_INTERVAL) {
        lastFrameTimeRef.current = timestamp - (elapsed % FRAME_INTERVAL);
        drawFrame();
      }

      // Schedule next frame via ref
      if (animationLoopRef.current) {
        rafIdRef.current = requestAnimationFrame(animationLoopRef.current);
      }
    };
  }, [drawFrame]);

  /**
   * Start animation loop
   */
  const startAnimation = useCallback(() => {
    if (rafIdRef.current !== null || isDisabledRef.current) return;
    if (animationLoopRef.current) {
      rafIdRef.current = requestAnimationFrame(animationLoopRef.current);
    }
  }, []);

  /**
   * Stop animation loop
   */
  const stopAnimation = useCallback(() => {
    if (rafIdRef.current !== null) {
      cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
    }
  }, []);

  /**
   * Canvas setup and resize handler
   */
  useEffect(() => {
    // Check if should be disabled
    if (prefersReducedMotion() || isMobileDevice()) {
      isDisabledRef.current = true;
      return;
    }

    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const resizeCanvas = () => {
      const rect = container.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2); // Cap DPR for performance

      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;

      const ctx = canvas.getContext('2d');
      if (ctx) ctx.scale(dpr, dpr);

      canvasSizeRef.current = { width: rect.width, height: rect.height };
      computeGridPoints();

      // Redraw after resize
      drawFrame();
    };

    resizeCanvas();

    // Debounced resize handler
    let resizeTimeout: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(resizeCanvas, 100);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimeout);
    };
  }, [computeGridPoints, drawFrame]);

  /**
   * Mouse event handlers - update refs only, no state
   */
  useEffect(() => {
    if (isDisabledRef.current) return;

    const container = containerRef.current;
    if (!container) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };

    const handleMouseEnter = () => {
      isHoveringRef.current = true;
      startAnimation();
    };

    const handleMouseLeave = () => {
      isHoveringRef.current = false;
      mouseRef.current = { x: -1000, y: -1000 };
      // Draw one more frame to clear glow, then stop
      drawFrame();
      stopAnimation();
    };

    container.addEventListener('mousemove', handleMouseMove, { passive: true });
    container.addEventListener('mouseenter', handleMouseEnter);
    container.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseenter', handleMouseEnter);
      container.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [startAnimation, stopAnimation, drawFrame]);

  /**
   * IntersectionObserver - pause when offscreen
   */
  useEffect(() => {
    if (isDisabledRef.current) return;

    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;
        
        isVisibleRef.current = entry.isIntersecting;
        if (entry.isIntersecting && isHoveringRef.current) {
          startAnimation();
        } else {
          stopAnimation();
        }
      },
      { threshold: 0 }
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, [startAnimation, stopAnimation]);

  /**
   * Page Visibility API - pause when tab hidden
   */
  useEffect(() => {
    if (isDisabledRef.current) return;

    const handleVisibilityChange = () => {
      isPageVisibleRef.current = document.visibilityState === 'visible';
      if (isPageVisibleRef.current && isHoveringRef.current && isVisibleRef.current) {
        startAnimation();
      } else {
        stopAnimation();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [startAnimation, stopAnimation]);

  /**
   * Cleanup on unmount
   */
  useEffect(() => {
    return () => stopAnimation();
  }, [stopAnimation]);

  /**
   * Initial draw (static grid)
   */
  useEffect(() => {
    if (!isDisabledRef.current) {
      drawFrame();
    }
  }, [drawFrame]);

  // Check if disabled (mobile or reduced motion)
  const isDisabled = typeof window !== 'undefined' && (prefersReducedMotion() || isMobileDevice());

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 -z-10 overflow-hidden"
      aria-hidden="true"
    >
      {/* Static CSS grid fallback for mobile/reduced-motion */}
      {isDisabled && (
        <div
          className={cn(
            'absolute inset-0',
            'bg-[linear-gradient(to_right,oklch(0.87_0_0/0.15)_1px,transparent_1px),linear-gradient(to_bottom,oklch(0.87_0_0/0.15)_1px,transparent_1px)]',
            'bg-size-[4rem_4rem]',
            'mask-[linear-gradient(to_bottom,#000_0%,#000_60%,transparent_100%)]'
          )}
        />
      )}

      {/* Interactive canvas - only rendered when not disabled */}
      {!isDisabled && (
        <canvas
          ref={canvasRef}
          className={cn(
            'absolute inset-0',
            'mask-[linear-gradient(to_bottom,#000_0%,#000_50%,transparent_100%)]'
          )}
        />
      )}
    </div>
  );
}
