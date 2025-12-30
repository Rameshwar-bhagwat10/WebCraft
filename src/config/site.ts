/**
 * Site configuration
 * Centralized metadata and SEO settings
 */

import type { Metadata } from 'next';

export const siteConfig = {
  name: 'WebCraft',
  description:
    'Professional web development services. We craft high-performance, scalable websites that drive results.',
  url: process.env.NEXT_PUBLIC_APP_URL ?? 'https://webcraft.com',
  ogImage: '/og-image.png',
  links: {
    twitter: 'https://twitter.com/webcraft',
    github: 'https://github.com/webcraft',
  },
  creator: 'WebCraft Team',
} as const;

export const defaultMetadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    'web development',
    'web design',
    'Next.js',
    'React',
    'TypeScript',
    'professional websites',
  ],
  authors: [{ name: siteConfig.creator }],
  creator: siteConfig.creator,
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.name,
    description: siteConfig.description,
    creator: '@webcraft',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};
