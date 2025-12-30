/**
 * Sitemap Generation
 * Dynamic sitemap using Next.js App Router conventions
 *
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap
 */

import type { MetadataRoute } from 'next';

import { siteConfig } from '@/config/site';

/**
 * Static routes for the sitemap
 * Add new public routes here as they are created
 */
const staticRoutes = [
  '',
  '/about',
  '/services',
  '/work',
  '/pricing',
  '/contact',
  '/blog',
  '/faq',
] as const;

/**
 * Generate sitemap entries
 * In production, this can be extended to fetch dynamic routes
 * (e.g., blog posts, portfolio items) from a database
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = siteConfig.url;

  // Static pages
  const staticPages: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' ? 'weekly' : 'monthly',
    priority: route === '' ? 1 : 0.8,
  }));

  // Future: Add dynamic routes here
  // const blogPosts = await getBlogPosts();
  // const dynamicPages = blogPosts.map(post => ({
  //   url: `${baseUrl}/blog/${post.slug}`,
  //   lastModified: post.updatedAt,
  //   changeFrequency: 'weekly',
  //   priority: 0.6,
  // }));

  return [...staticPages];
}
