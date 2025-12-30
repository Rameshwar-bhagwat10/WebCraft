/**
 * Project Card Component
 * Displays a project preview in the portfolio grid
 *
 * Server Component - no client JS needed
 * Uses next/image for optimization
 */

import Link from 'next/link';

import { cn } from '@/lib/utils';

import { ProjectImage } from './project-image';

export interface ProjectCardProps {
  slug: string;
  title: string;
  shortDescription: string;
  type: string;
  thumbnail: string;
  className?: string;
}

/**
 * Type badge colors
 */
const typeBadgeStyles: Record<string, string> = {
  Website: 'bg-primary-50 text-primary-700',
  'Web App': 'bg-success-50 text-success-700',
  'Mobile App': 'bg-warning-50 text-warning-700',
  Dashboard: 'bg-neutral-100 text-neutral-700',
};

export function ProjectCard({
  slug,
  title,
  shortDescription,
  type,
  thumbnail,
  className,
}: ProjectCardProps): React.ReactElement {
  return (
    <article className={cn('group', className)}>
      <Link
        href={`/work/${slug}`}
        className="border-border bg-background hover:border-primary-200 block overflow-hidden rounded-xl border transition-all duration-200 hover:shadow-lg"
      >
        {/* Thumbnail */}
        <div className="relative aspect-[16/10] overflow-hidden bg-neutral-100">
          <ProjectImage
            src={thumbnail}
            alt={`${title} project screenshot`}
            className="transition-transform duration-300 group-hover:scale-105"
          />
        </div>

        {/* Content */}
        <div className="p-5">
          {/* Type badge */}
          <span
            className={cn(
              'mb-3 inline-block rounded-full px-3 py-1 text-xs font-medium',
              typeBadgeStyles[type] || typeBadgeStyles.Website
            )}
          >
            {type}
          </span>

          {/* Title */}
          <h3 className="text-foreground group-hover:text-primary-600 mb-2 text-lg font-semibold">
            {title}
          </h3>

          {/* Description */}
          <p className="text-foreground-secondary text-sm leading-relaxed">
            {shortDescription}
          </p>

          {/* View project indicator */}
          <span className="text-primary-600 mt-4 inline-flex items-center text-sm font-medium">
            View project
            <svg
              className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </span>
        </div>
      </Link>
    </article>
  );
}
