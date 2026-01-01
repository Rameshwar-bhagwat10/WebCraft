/**
 * TestimonialCard Component
 * Individual testimonial card with client info
 *
 * Server Component - no client JS needed
 */

import Link from 'next/link';

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
 * Star rating display
 */
function StarRating({ rating }: { rating: number }): React.ReactElement {
  return (
    <div className="flex gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={cn('h-4 w-4', star <= rating ? 'text-amber-400' : 'text-neutral-200')}
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
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
  const { name, role, company, quote, initials, rating, projectSlug } = testimonial;

  const cardClassName = cn(
    'motion-slide-up group relative flex flex-col',
    'rounded-xl bg-white sm:rounded-2xl',
    'p-4 sm:p-6',
    'border border-neutral-100',
    'shadow-sm',
    'transition-all duration-300 ease-out',
    'hover:-translate-y-1 hover:shadow-md',
    'motion-reduce:transform-none motion-reduce:transition-none',
    projectSlug && 'cursor-pointer'
  );

  const cardStyle = {
    '--motion-delay': `${0.1 + index * 0.1}s`,
    '--motion-duration': '0.5s',
  } as React.CSSProperties;

  const cardContent = (
    <>
      {/* Header with quote icon and rating */}
      <div className="mb-3 flex items-start justify-between sm:mb-4">
        <QuoteIcon />
        {rating && <StarRating rating={rating} />}
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
            {role}{role && company ? ', ' : ''}{company}
          </p>
        </div>
        {projectSlug && (
          <span className="text-primary-600 text-xs font-medium opacity-0 transition-opacity group-hover:opacity-100">
            View project →
          </span>
        )}
      </footer>
    </>
  );

  if (projectSlug) {
    return (
      <Link href={`/work/${projectSlug}`} className={cardClassName} style={cardStyle}>
        {cardContent}
      </Link>
    );
  }

  return (
    <article className={cardClassName} style={cardStyle}>
      {cardContent}
    </article>
  );
}
