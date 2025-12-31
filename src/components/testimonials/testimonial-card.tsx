/**
 * TestimonialCard Component
 * Individual testimonial card with client info
 *
 * Server Component - no client JS needed
 */

import { cn } from '@/lib/utils';

import type { Testimonial } from './testimonials-data';

interface TestimonialCardProps {
  testimonial: Testimonial;
  /** Animation delay index for staggered entrance */
  index?: number;
}

/**
 * Quote icon SVG
 */
function QuoteIcon(): React.ReactElement {
  return (
    <svg
      className="text-primary-200 h-6 w-6 sm:h-8 sm:w-8"
      fill="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
    </svg>
  );
}

/**
 * Avatar with initials fallback
 */
function Avatar({ initials }: { initials: string }): React.ReactElement {
  return (
    <div
      className="bg-primary-100 text-primary-700 flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-semibold sm:h-12 sm:w-12 sm:text-sm"
      aria-hidden="true"
    >
      {initials}
    </div>
  );
}

export function TestimonialCard({
  testimonial,
  index = 0,
}: TestimonialCardProps): React.ReactElement {
  const { name, role, company, quote, initials } = testimonial;

  return (
    <article
      className={cn(
        'motion-slide-up group relative flex flex-col',
        'rounded-xl bg-white sm:rounded-2xl',
        'p-4 sm:p-6',
        'border border-neutral-100',
        'shadow-sm',
        'transition-all duration-300 ease-out',
        'hover:-translate-y-1 hover:shadow-md',
        'motion-reduce:transform-none motion-reduce:transition-none'
      )}
      style={
        {
          '--motion-delay': `${0.1 + index * 0.1}s`,
          '--motion-duration': '0.5s',
        } as React.CSSProperties
      }
    >
      {/* Quote icon */}
      <div className="mb-3 sm:mb-4">
        <QuoteIcon />
      </div>

      {/* Testimonial text */}
      <blockquote className="mb-4 flex-1 sm:mb-6">
        <p className="text-foreground-secondary text-sm leading-relaxed text-pretty sm:text-base">
          &ldquo;{quote}&rdquo;
        </p>
      </blockquote>

      {/* Client info */}
      <footer className="border-border flex items-center gap-3 border-t pt-3 sm:pt-4">
        <Avatar initials={initials ?? name.charAt(0)} />
        <div className="min-w-0 flex-1">
          <p className="text-foreground truncate text-sm font-semibold sm:text-base">
            {name}
          </p>
          <p className="text-foreground-muted truncate text-xs sm:text-sm">
            {role}, {company}
          </p>
        </div>
      </footer>
    </article>
  );
}
