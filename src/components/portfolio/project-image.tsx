/**
 * Project Image Component
 * Displays project images with fallback placeholder
 *
 * Server Component - no client JS needed
 */

import Image from 'next/image';

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
  // Check if it's a placeholder path (static demo)
  const isPlaceholder = src.startsWith('/projects/');
  
  // Check if it's a real image URL (Supabase storage or external)
  const isRealImage = src.startsWith('http') || src.startsWith('https');

  if (isPlaceholder) {
    return (
      <div className={cn('relative h-full w-full', className)}>
        <ImagePlaceholder alt={alt} title={title} />
      </div>
    );
  }

  if (isRealImage) {
    return (
      <div className={cn('relative h-full w-full', className)}>
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          unoptimized={src.includes('supabase')}
        />
      </div>
    );
  }

  // Fallback to placeholder
  return (
    <div className={cn('relative h-full w-full', className)}>
      <ImagePlaceholder alt={alt} title={title} />
    </div>
  );
}
