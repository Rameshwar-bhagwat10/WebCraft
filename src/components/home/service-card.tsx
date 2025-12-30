/**
 * Service Card Component
 * Displays a single service offering with icon, title, and description
 *
 * Server Component - no client JS needed
 * Reusable across the site
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
}

export function ServiceCard({
  title,
  description,
  icon,
  className,
}: ServiceCardProps): React.ReactElement {
  return (
    <article
      className={cn(
        'bg-background group rounded-xl border border-border p-6 transition-all duration-200',
        'hover:border-primary-200 hover:shadow-lg',
        className
      )}
    >
      {/* Icon */}
      <div
        className="bg-primary-50 text-primary-600 mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg transition-colors duration-200 group-hover:bg-primary-100"
        aria-hidden="true"
      >
        {icon}
      </div>

      {/* Title */}
      <h3 className="text-foreground mb-2 text-lg font-semibold">{title}</h3>

      {/* Description */}
      <p className="text-foreground-secondary text-sm leading-relaxed">
        {description}
      </p>
    </article>
  );
}
