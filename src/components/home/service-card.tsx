/**
 * Service Card Component
 * Displays a single service offering with icon, title, and description
 *
 * Server Component - no client JS needed
 * Enhanced with premium hover effects and visual depth
 */

import { cn } from '@/lib/utils';

export interface ServiceCardProps {
  /** Service title */
  title: string;
  /** Outcome-focused description (1-2 lines) */
  description: string;
  /** SVG icon component */
  icon: React.ReactNode;
  /** Optional additional className */
  className?: string;
  /** Animation delay for staggered entrance */
  index?: number;
}

export function ServiceCard({
  title,
  description,
  icon,
  className,
  index = 0,
}: ServiceCardProps): React.ReactElement {
  return (
    <article
      className={cn(
        'motion-slide-up',
        'bg-background group border-border relative rounded-xl border p-6',
        'transition-all duration-300 ease-out',
        'hover:shadow-primary-100/50 hover:-translate-y-1 hover:shadow-xl',
        'hover:border-primary-200',
        className
      )}
      style={
        {
          '--motion-delay': `${0.1 + index * 0.08}s`,
          '--motion-duration': '0.5s',
        } as React.CSSProperties
      }
    >
      {/* Top accent gradient - visible on hover */}
      <div
        className="from-primary-400 via-primary-500 to-primary-400 absolute inset-x-0 top-0 h-0.5 rounded-t-xl bg-gradient-to-r opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        aria-hidden="true"
      />

      {/* Icon with enhanced depth */}
      <div
        className="relative mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg transition-all duration-300 group-hover:scale-105"
        aria-hidden="true"
      >
        {/* Background with radial gradient for depth */}
        <div className="bg-primary-50 group-hover:bg-primary-100 absolute inset-0 rounded-lg transition-colors duration-300" />
        {/* Subtle glow effect */}
        <div className="from-primary-100/50 absolute inset-0 rounded-lg bg-gradient-to-br to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        {/* Icon */}
        <span className="text-primary-600 relative transition-transform duration-300 group-hover:scale-110">
          {icon}
        </span>
      </div>

      {/* Title */}
      <h3 className="text-foreground group-hover:text-primary-700 mb-2 text-lg font-semibold transition-colors duration-200">
        {title}
      </h3>

      {/* Description */}
      <p className="text-foreground-secondary text-sm leading-relaxed">
        {description}
      </p>
    </article>
  );
}
