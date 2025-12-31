'use client';

/**
 * InteractiveGrid Component
 * Premium cursor-following glow effect on grid background
 *
 * Inspired by modern landing pages with interactive backgrounds
 * Performance optimized with RAF and CSS transforms
 * Respects prefers-reduced-motion
 */

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react';

import { cn } from '@/lib/utils';

interface MousePosition {
  x: number;
  y: number;
}

const GRID_SIZE = 64; // 4rem = 64px
const GLOW_RADIUS = 250; // pixels

// Hook to detect reduced motion preference without causing cascading renders
function usePrefersReducedMotion(): boolean {
  const subscribe = useCallback((callback: () => void) => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    mediaQuery.addEventListener('change', callback);
    return () => mediaQuery.removeEventListener('change', callback);
  }, []);

  const getSnapshot = useCallback(() => {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  const getServerSnapshot = useCallback(() => false, []);

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function InteractiveGrid(): React.ReactElement {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mousePos, setMousePos] = useState<MousePosition>({ x: -1000, y: -1000 });
  const [isHovering, setIsHovering] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();
  const rafRef = useRef<number | null>(null);
  const lastMousePos = useRef<MousePosition>({ x: -1000, y: -1000 });

  // Canvas setup and resize
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const resizeCanvas = () => {
      const rect = container.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;

      const ctx = canvas.getContext('2d');
      if (ctx) ctx.scale(dpr, dpr);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
  }, []);

  // Draw grid with glow effect
  useEffect(() => {
    if (prefersReducedMotion) return;

    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = container.getBoundingClientRect();
    const cols = Math.ceil(rect.width / GRID_SIZE) + 1;
    const rows = Math.ceil(rect.height / GRID_SIZE) + 1;

    // Clear canvas
    ctx.clearRect(0, 0, rect.width, rect.height);

    // Draw grid lines with glow
    for (let row = 0; row <= rows; row++) {
      for (let col = 0; col <= cols; col++) {
        const x = col * GRID_SIZE;
        const y = row * GRID_SIZE;

        // Calculate distance from mouse
        const distance = Math.sqrt(
          Math.pow(mousePos.x - x, 2) + Math.pow(mousePos.y - y, 2)
        );

        // Calculate glow intensity
        let intensity = 0;
        if (isHovering && distance < GLOW_RADIUS) {
          intensity = 1 - distance / GLOW_RADIUS;
          intensity = Math.pow(intensity, 1.5); // Smooth falloff
        }

        // Draw intersection dot
        if (intensity > 0.05) {
          const dotRadius = 2 + intensity * 3;
          const gradient = ctx.createRadialGradient(x, y, 0, x, y, dotRadius * 2);
          gradient.addColorStop(0, `rgba(99, 102, 241, ${intensity * 0.9})`);
          gradient.addColorStop(0.5, `rgba(129, 140, 248, ${intensity * 0.5})`);
          gradient.addColorStop(1, 'rgba(129, 140, 248, 0)');

          ctx.beginPath();
          ctx.arc(x, y, dotRadius * 2, 0, Math.PI * 2);
          ctx.fillStyle = gradient;
          ctx.fill();

          // Inner bright dot
          ctx.beginPath();
          ctx.arc(x, y, dotRadius * 0.5, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${intensity * 0.8})`;
          ctx.fill();
        }

        // Draw horizontal line segment with glow
        if (col < cols) {
          const nextX = (col + 1) * GRID_SIZE;
          const midX = (x + nextX) / 2;
          const midDistance = Math.sqrt(
            Math.pow(mousePos.x - midX, 2) + Math.pow(mousePos.y - y, 2)
          );

          let lineIntensity = 0;
          if (isHovering && midDistance < GLOW_RADIUS) {
            lineIntensity = 1 - midDistance / GLOW_RADIUS;
            lineIntensity = Math.pow(lineIntensity, 2);
          }

          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(nextX, y);
          ctx.strokeStyle = lineIntensity > 0.05
            ? `rgba(99, 102, 241, ${0.15 + lineIntensity * 0.6})`
            : 'rgba(200, 200, 200, 0.15)';
          ctx.lineWidth = lineIntensity > 0.05 ? 1 + lineIntensity : 1;
          ctx.stroke();
        }

        // Draw vertical line segment with glow
        if (row < rows) {
          const nextY = (row + 1) * GRID_SIZE;
          const midY = (y + nextY) / 2;
          const midDistance = Math.sqrt(
            Math.pow(mousePos.x - x, 2) + Math.pow(mousePos.y - midY, 2)
          );

          let lineIntensity = 0;
          if (isHovering && midDistance < GLOW_RADIUS) {
            lineIntensity = 1 - midDistance / GLOW_RADIUS;
            lineIntensity = Math.pow(lineIntensity, 2);
          }

          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(x, nextY);
          ctx.strokeStyle = lineIntensity > 0.05
            ? `rgba(99, 102, 241, ${0.15 + lineIntensity * 0.6})`
            : 'rgba(200, 200, 200, 0.15)';
          ctx.lineWidth = lineIntensity > 0.05 ? 1 + lineIntensity : 1;
          ctx.stroke();
        }
      }
    }
  }, [mousePos, isHovering, prefersReducedMotion]);

  // Smooth mouse tracking with RAF
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (prefersReducedMotion) return;
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    lastMousePos.current = { x, y };

    if (rafRef.current === null) {
      rafRef.current = requestAnimationFrame(() => {
        setMousePos(lastMousePos.current);
        rafRef.current = null;
      });
    }
  }, [prefersReducedMotion]);

  const handleMouseEnter = useCallback(() => {
    if (!prefersReducedMotion) setIsHovering(true);
  }, [prefersReducedMotion]);

  const handleMouseLeave = useCallback(() => {
    setIsHovering(false);
    setMousePos({ x: -1000, y: -1000 });
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseenter', handleMouseEnter);
    container.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseenter', handleMouseEnter);
      container.removeEventListener('mouseleave', handleMouseLeave);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [handleMouseMove, handleMouseEnter, handleMouseLeave]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 -z-10 overflow-hidden"
      aria-hidden="true"
    >
      {/* Fallback static grid for reduced motion */}
      {prefersReducedMotion && (
        <div
          className={cn(
            'absolute inset-0',
            'bg-[linear-gradient(to_right,oklch(0.87_0_0/0.3)_1px,transparent_1px),linear-gradient(to_bottom,oklch(0.87_0_0/0.3)_1px,transparent_1px)]',
            'bg-size-[4rem_4rem]',
            'mask-[linear-gradient(to_bottom,#000_0%,#000_60%,transparent_100%)]'
          )}
        />
      )}

      {/* Interactive canvas grid */}
      {!prefersReducedMotion && (
        <>
          <canvas
            ref={canvasRef}
            className={cn(
              'absolute inset-0',
              'mask-[linear-gradient(to_bottom,#000_0%,#000_50%,transparent_100%)]'
            )}
          />

          {/* Cursor spotlight glow */}
          {isHovering && (
            <div
              className="pointer-events-none absolute h-[500px] w-[500px] rounded-full transition-opacity duration-300"
              style={{
                left: mousePos.x - 250,
                top: mousePos.y - 250,
                background: `radial-gradient(circle, oklch(0.50 0.22 275 / 0.12) 0%, oklch(0.58 0.20 275 / 0.06) 35%, transparent 70%)`,
                opacity: isHovering ? 1 : 0,
              }}
            />
          )}
        </>
      )}
    </div>
  );
}
