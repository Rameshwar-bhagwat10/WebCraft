/**
 * Project Image Component
 * Enhanced placeholder with gradient and project initial
 *
 * Server Component - no client JS needed
 */

import { cn } from '@/lib/utils';

interface ProjectImageProps {
  src: string;
  alt: string;
  title?: string;
  className?: string;
}

/**
 * Enhanced placeholder with project initial
 */
function ImagePlaceholder({
  alt,
  title,
}: {
  alt: string;
  title?: string | undefined;
}): React.ReactElement {
  const initial = title ? title.charAt(0).toUpperCase() : '?';

  return (
    <div
      className="flex h-full w-full items-center justify-center"
      role="img"
      aria-label={alt}
    >
      {/* Large initial */}
      <span className="text-foreground-muted/20 text-7xl font-bold select-none sm:text-8xl">
        {initial}
      </span>

      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8881_1px,transparent_1px),linear-gradient(to_bottom,#8881_1px,transparent_1px)] bg-size-[2rem_2rem] opacity-50" />

        {/* Corner accents */}
        <div className="bg-foreground-muted/10 absolute top-4 left-4 h-8 w-8 rounded-lg" />
        <div className="bg-foreground-muted/10 absolute top-4 right-4 h-4 w-16 rounded-lg" />
        <div className="bg-foreground-muted/10 absolute bottom-4 left-4 h-4 w-24 rounded-lg" />
        <div className="bg-foreground-muted/10 absolute right-4 bottom-4 h-8 w-8 rounded-lg" />
      </div>
    </div>
  );
}

export function ProjectImage({
  src,
  alt,
  title,
  className,
}: ProjectImageProps): React.ReactElement {
  // For demo purposes, show enhanced placeholder for project images
  // In production, this would use actual images with next/image
  const isPlaceholder = src.startsWith('/projects/');

  if (isPlaceholder) {
    return (
      <div className={cn('relative h-full w-full', className)}>
        <ImagePlaceholder alt={alt} title={title} />
      </div>
    );
  }

  // For real images, we would use next/image here
  return (
    <div className={cn('relative h-full w-full', className)}>
      <ImagePlaceholder alt={alt} title={title} />
    </div>
  );
}
