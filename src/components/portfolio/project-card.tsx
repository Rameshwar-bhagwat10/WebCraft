/**
 * Project Card Component
 * Enhanced project preview with animations and hover effects
 *
 * Server Component - no client JS needed
 */

import Link from 'next/link';

import { cn } from '@/lib/utils';

import { ProjectImage } from './project-image';

export interface ProjectCardProps {
  slug: string;
  title: string;
  shortDescription: string;
  type: string;
  thumbnail: string | null;
  thumbnailAlt?: string | null | undefined;
  result?: string | undefined;
  index?: number | undefined;
  className?: string | undefined;
}

/**
 * Category to display name mapping
 */
const categoryLabels: Record<string, string> = {
  website: 'Website',
  webapp: 'Web App',
  mobile: 'Mobile App',
  ecommerce: 'E-Commerce',
  dashboard: 'Dashboard',
  landing: 'Landing Page',
  other: 'Other',
  // Also support already-formatted values
  Website: 'Website',
  'Web App': 'Web App',
  'Mobile App': 'Mobile App',
  'E-Commerce': 'E-Commerce',
  Dashboard: 'Dashboard',
  'Landing Page': 'Landing Page',
  Other: 'Other',
};

/**
 * Type badge styles with icons
 */
const typeConfig: Record<string, { style: string; icon: React.ReactNode }> = {
  Website: {
    style: 'bg-primary-50 text-primary-700 border-primary-200',
    icon: (
      <svg
        className="h-3 w-3"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <path d="M8 21h8M12 17v4" />
      </svg>
    ),
  },
  website: {
    style: 'bg-primary-50 text-primary-700 border-primary-200',
    icon: (
      <svg
        className="h-3 w-3"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <path d="M8 21h8M12 17v4" />
      </svg>
    ),
  },
  'Web App': {
    style: 'bg-success-50 text-success-700 border-success-200',
    icon: (
      <svg
        className="h-3 w-3"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M18 3a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3H6a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3V6a3 3 0 0 0-3-3 3 3 0 0 0-3 3 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 3 3 0 0 0-3-3z" />
      </svg>
    ),
  },
  webapp: {
    style: 'bg-success-50 text-success-700 border-success-200',
    icon: (
      <svg
        className="h-3 w-3"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M18 3a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3H6a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3V6a3 3 0 0 0-3-3 3 3 0 0 0-3 3 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 3 3 0 0 0-3-3z" />
      </svg>
    ),
  },
  'Mobile App': {
    style: 'bg-warning-50 text-warning-700 border-warning-200',
    icon: (
      <svg
        className="h-3 w-3"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <rect x="5" y="2" width="14" height="20" rx="2" />
        <path d="M12 18h.01" />
      </svg>
    ),
  },
  mobile: {
    style: 'bg-warning-50 text-warning-700 border-warning-200',
    icon: (
      <svg
        className="h-3 w-3"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <rect x="5" y="2" width="14" height="20" rx="2" />
        <path d="M12 18h.01" />
      </svg>
    ),
  },
  Dashboard: {
    style: 'bg-neutral-100 text-neutral-700 border-neutral-200',
    icon: (
      <svg
        className="h-3 w-3"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <rect x="3" y="3" width="7" height="9" rx="1" />
        <rect x="14" y="3" width="7" height="5" rx="1" />
        <rect x="14" y="12" width="7" height="9" rx="1" />
        <rect x="3" y="16" width="7" height="5" rx="1" />
      </svg>
    ),
  },
  dashboard: {
    style: 'bg-neutral-100 text-neutral-700 border-neutral-200',
    icon: (
      <svg
        className="h-3 w-3"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <rect x="3" y="3" width="7" height="9" rx="1" />
        <rect x="14" y="3" width="7" height="5" rx="1" />
        <rect x="14" y="12" width="7" height="9" rx="1" />
        <rect x="3" y="16" width="7" height="5" rx="1" />
      </svg>
    ),
  },
  ecommerce: {
    style: 'bg-success-50 text-success-700 border-success-200',
    icon: (
      <svg
        className="h-3 w-3"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <circle cx="9" cy="21" r="1" />
        <circle cx="20" cy="21" r="1" />
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
      </svg>
    ),
  },
  landing: {
    style: 'bg-primary-50 text-primary-700 border-primary-200',
    icon: (
      <svg
        className="h-3 w-3"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <path d="M8 21h8M12 17v4" />
      </svg>
    ),
  },
  other: {
    style: 'bg-neutral-100 text-neutral-700 border-neutral-200',
    icon: (
      <svg
        className="h-3 w-3"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <rect x="3" y="3" width="18" height="18" rx="2" />
      </svg>
    ),
  },
};

/**
 * Gradient colors for project placeholders
 */
const gradientColors: Record<string, string> = {
  'freshbite-restaurant': 'from-orange-500/20 to-red-500/20',
  'taskflow-app': 'from-blue-500/20 to-purple-500/20',
  'greenleaf-ecommerce': 'from-green-500/20 to-emerald-500/20',
  'healthtrack-dashboard': 'from-cyan-500/20 to-blue-500/20',
};

/**
 * Default config for unknown project types
 */
const defaultConfig = {
  style: 'bg-primary-50 text-primary-700 border-primary-200',
  icon: (
    <svg
      className="h-3 w-3"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <rect x="2" y="3" width="20" height="14" rx="2" />
      <path d="M8 21h8M12 17v4" />
    </svg>
  ),
};

export function ProjectCard({
  slug,
  title,
  shortDescription,
  type,
  thumbnail,
  thumbnailAlt,
  result,
  index = 0,
  className,
}: ProjectCardProps): React.ReactElement {
  const config = typeConfig[type] ?? defaultConfig;
  const displayType = categoryLabels[type] ?? type;
  const gradient =
    gradientColors[slug] ?? 'from-primary-500/20 to-primary-600/20';
  
  // Handle both static paths and Supabase storage URLs
  const imageUrl = thumbnail 
    ? thumbnail.startsWith('/') 
      ? thumbnail 
      : `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/project-images/${thumbnail}`
    : null;

  return (
    <article
      className={cn('motion-slide-up group', className)}
      style={
        {
          '--motion-delay': `${0.1 + index * 0.1}s`,
          '--motion-duration': '0.5s',
        } as React.CSSProperties
      }
    >
      <Link
        href={`/work/${slug}`}
        className={cn(
          'relative block overflow-hidden rounded-2xl',
          'bg-background border-border border',
          'transition-all duration-300',
          'hover:border-primary-200 hover:-translate-y-1 hover:shadow-xl'
        )}
      >
        {/* Top accent gradient - visible on hover */}
        <div
          className="from-primary-400 via-primary-500 to-primary-400 absolute inset-x-0 top-0 z-10 h-1 bg-linear-to-r opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          aria-hidden="true"
        />

        {/* Thumbnail */}
        <div
          className={cn(
            'relative aspect-video overflow-hidden bg-linear-to-br',
            gradient
          )}
        >
          {imageUrl ? (
            <ProjectImage
              src={imageUrl}
              alt={thumbnailAlt ?? `${title} project screenshot`}
              title={title}
              className="transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <span className="text-foreground-muted text-lg font-medium">{title}</span>
            </div>
          )}

          {/* Hover overlay */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors duration-300 group-hover:bg-black/20">
            <span className="translate-y-4 rounded-full bg-white px-5 py-2.5 text-sm font-medium text-neutral-900 opacity-0 shadow-lg transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
              View Case Study →
            </span>
          </div>

          {/* Result badge */}
          {result && (
            <div className="absolute right-4 bottom-4 left-4">
              <div className="bg-background/95 border-border inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-medium shadow-lg backdrop-blur-sm">
                <svg
                  className="text-success-600 h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  />
                </svg>
                <span className="text-foreground-secondary line-clamp-1">
                  {result}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Type badge with icon */}
          <span
            className={cn(
              'mb-3 inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium',
              config.style
            )}
          >
            {config.icon}
            {displayType}
          </span>

          {/* Title */}
          <h3 className="text-foreground group-hover:text-primary-700 mb-2 text-xl font-semibold transition-colors duration-200">
            {title}
          </h3>

          {/* Description */}
          <p className="text-foreground-secondary text-sm leading-relaxed">
            {shortDescription}
          </p>

          {/* View project indicator */}
          <span className="text-primary-600 mt-4 inline-flex items-center text-sm font-medium">
            Read case study
            <svg
              className="ml-1 h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
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
