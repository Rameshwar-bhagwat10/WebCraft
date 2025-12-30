/**
 * SEO Utilities
 * Helper functions for metadata generation and SEO optimization
 */

import type { Metadata } from 'next';

import { siteConfig } from '@/config/site';

/**
 * Standard image sizes for different contexts
 * Following platform-specific recommendations
 */
export const IMAGE_SIZES = {
  // Open Graph (Facebook, LinkedIn)
  og: {
    width: 1200,
    height: 630,
  },
  // Twitter card
  twitter: {
    width: 1200,
    height: 600,
  },
  // Hero images
  hero: {
    width: 1920,
    height: 1080,
  },
  // Portfolio/work thumbnails
  thumbnail: {
    width: 800,
    height: 600,
  },
  // Avatar/profile
  avatar: {
    width: 400,
    height: 400,
  },
} as const;

/**
 * Generate absolute URL from relative path
 */
export function absoluteUrl(path: string): string {
  return `${siteConfig.url}${path.startsWith('/') ? path : `/${path}`}`;
}

/**
 * Generate page metadata with proper defaults
 * Use this in page components for consistent metadata
 *
 * @example
 * export const metadata = generatePageMetadata({
 *   title: 'About Us',
 *   description: 'Learn about our team and mission',
 * });
 */
export function generatePageMetadata({
  title,
  description,
  image,
  noIndex = false,
  pathname = '',
}: {
  title: string;
  description?: string;
  image?: string;
  noIndex?: boolean;
  pathname?: string;
}): Metadata {
  const pageDescription = description ?? siteConfig.description;
  const pageImage = image ?? siteConfig.ogImage.url;
  const pageUrl = absoluteUrl(pathname);

  return {
    title,
    description: pageDescription,
    openGraph: {
      title,
      description: pageDescription,
      url: pageUrl,
      images: [
        {
          url: pageImage,
          width: IMAGE_SIZES.og.width,
          height: IMAGE_SIZES.og.height,
          alt: title,
        },
      ],
    },
    twitter: {
      title,
      description: pageDescription,
      images: [pageImage],
    },
    alternates: {
      canonical: pageUrl,
    },
    ...(noIndex && {
      robots: {
        index: false,
        follow: false,
      },
    }),
  };
}

/**
 * Generate JSON-LD structured data for organization
 * Helps search engines understand the business
 */
export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    logo: absoluteUrl('/logo.png'),
    sameAs: [
      siteConfig.links.twitter,
      siteConfig.links.github,
      siteConfig.links.linkedin,
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      availableLanguage: ['English'],
    },
  };
}

/**
 * Generate JSON-LD structured data for a web page
 */
export function generateWebPageSchema({
  title,
  description,
  pathname = '',
}: {
  title: string;
  description: string;
  pathname?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: title,
    description,
    url: absoluteUrl(pathname),
    isPartOf: {
      '@type': 'WebSite',
      name: siteConfig.name,
      url: siteConfig.url,
    },
  };
}

/**
 * Generate JSON-LD structured data for services
 */
export function generateServiceSchema({
  name,
  description,
  pathname,
}: {
  name: string;
  description: string;
  pathname: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name,
    description,
    provider: {
      '@type': 'Organization',
      name: siteConfig.name,
      url: siteConfig.url,
    },
    url: absoluteUrl(pathname),
  };
}
