/**
 * Project Image Component
 * Handles project images with fallback placeholder
 *
 * Server Component - no client JS needed
 */

import { cn } from '@/lib/utils';

interface ProjectImageProps {
  src: string;
  alt: string;
  className?: string;
}

/**
 * Placeholder SVG for missing images
 * Shows a professional placeholder instead of broken image
 */
function ImagePlaceholder({ alt }: { alt: string }): React.ReactElement {
  return (
    <div
      className="flex h-full w-full items-center justify-center bg-neutral-100"
      role="img"
      aria-label={alt}
    >
      <svg
        className="h-16 w-16 text-neutral-300"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1}
          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      </svg>
    </div>
  );
}

export function ProjectImage({
  src,
  alt,
  className,
}: ProjectImageProps): React.ReactElement {
  // For demo purposes, show placeholder for project images
  // In production, this would use actual images with next/image
  const isPlaceholder = src.startsWith('/projects/');

  if (isPlaceholder) {
    return (
      <div className={cn('h-full w-full', className)}>
        <ImagePlaceholder alt={alt} />
      </div>
    );
  }

  // For real images, we would use next/image here
  // This is a fallback that shouldn't be reached in demo
  return (
    <div className={cn('h-full w-full', className)}>
      <ImagePlaceholder alt={alt} />
    </div>
  );
}
