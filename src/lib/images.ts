/**
 * Image Optimization Utilities
 * Strict rules and helpers for image handling
 *
 * RULES:
 * 1. ALWAYS use next/image - never raw <img> tags
 * 2. Define explicit width/height to prevent CLS
 * 3. Use priority={true} ONLY for above-the-fold images
 * 4. Use lazy loading (default) for below-the-fold images
 * 5. Use responsive sizes for fluid layouts
 */

/**
 * Standard image dimensions
 * Use these to maintain consistency and prevent CLS
 */
export const IMAGE_DIMENSIONS = {
  // Hero section images
  hero: {
    width: 1920,
    height: 1080,
    aspectRatio: '16/9',
  },
  // Portfolio/work showcase
  portfolio: {
    width: 800,
    height: 600,
    aspectRatio: '4/3',
  },
  // Team member photos
  team: {
    width: 400,
    height: 400,
    aspectRatio: '1/1',
  },
  // Blog post thumbnails
  blogThumb: {
    width: 600,
    height: 400,
    aspectRatio: '3/2',
  },
  // Blog post featured image
  blogFeatured: {
    width: 1200,
    height: 630,
    aspectRatio: '1.91/1',
  },
  // Service icons/illustrations
  icon: {
    width: 64,
    height: 64,
    aspectRatio: '1/1',
  },
  // Logo
  logo: {
    width: 180,
    height: 40,
    aspectRatio: '4.5/1',
  },
} as const;

/**
 * Responsive image sizes for different contexts
 * Use with next/image sizes prop
 */
export const RESPONSIVE_SIZES = {
  // Full width hero
  fullWidth: '100vw',
  // Container constrained
  container: '(max-width: 1280px) 100vw, 1280px',
  // Half width on desktop
  halfWidth: '(max-width: 768px) 100vw, 50vw',
  // Third width on desktop
  thirdWidth: '(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw',
  // Quarter width on desktop
  quarterWidth: '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw',
  // Fixed small
  small: '(max-width: 640px) 100vw, 400px',
} as const;

/**
 * Image quality settings
 * Balance between quality and file size
 */
export const IMAGE_QUALITY = {
  // High quality for hero/featured images
  high: 90,
  // Standard quality for most images
  standard: 80,
  // Lower quality for thumbnails
  thumbnail: 75,
} as const;

/**
 * Placeholder blur data URL
 * Use for images without custom blur placeholder
 * This is a tiny transparent placeholder
 */
export const PLACEHOLDER_BLUR =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

/**
 * Get image props for consistent usage
 * Ensures all images follow optimization rules
 */
export function getImageProps(
  type: keyof typeof IMAGE_DIMENSIONS,
  options?: {
    priority?: boolean;
    quality?: keyof typeof IMAGE_QUALITY;
    sizes?: keyof typeof RESPONSIVE_SIZES;
  }
) {
  const dimensions = IMAGE_DIMENSIONS[type];
  const quality = IMAGE_QUALITY[options?.quality ?? 'standard'];
  const sizes = options?.sizes ? RESPONSIVE_SIZES[options.sizes] : undefined;

  return {
    width: dimensions.width,
    height: dimensions.height,
    quality,
    sizes,
    priority: options?.priority ?? false,
    placeholder: 'blur' as const,
    blurDataURL: PLACEHOLDER_BLUR,
  };
}
