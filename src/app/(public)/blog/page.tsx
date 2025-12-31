/**
 * Blog Page
 * Blog listing with featured posts
 *
 * Server Component - renders statically (SSG)
 */

import type { Metadata } from 'next';
import Link from 'next/link';

import {
  categories,
  categoryColors,
  getFeaturedPosts,
  getRegularPosts,
} from '@/components/blog';
import { Container, Section } from '@/components/layout';
import { JsonLd, NewsletterForm } from '@/components/shared';
import { Heading, Text } from '@/components/ui';
import { generatePageMetadata, generateWebPageSchema } from '@/lib/seo';
import { cn } from '@/lib/utils';

export const metadata: Metadata = generatePageMetadata({
  title: 'Blog - WebCraft',
  description:
    'Insights, tutorials, and updates from the WebCraft team. Learn about web development, design, and digital strategy.',
  pathname: '/blog',
});

export default function BlogPage(): React.ReactElement {
  const pageSchema = generateWebPageSchema({
    title: 'Blog - WebCraft',
    description: 'Insights and tutorials from the WebCraft team.',
    pathname: '/blog',
  });

  const featuredPosts = getFeaturedPosts();
  const regularPosts = getRegularPosts();

  return (
    <>
      <JsonLd data={pageSchema} />

      {/* Hero */}
      <Section
        size="lg"
        background="primary"
        aria-labelledby="blog-heading"
        className="relative overflow-hidden"
      >
        <div className="absolute inset-0 -z-10" aria-hidden="true">
          <div className="motion-float motion-pulse-glow bg-primary-100 absolute -top-1/2 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full opacity-50 blur-3xl" />
        </div>
        <Container size="md">
          <div className="mx-auto max-w-2xl pt-8 text-center sm:pt-12">
            <div
              className="motion-slide-up"
              style={
                {
                  '--motion-delay': '0s',
                  '--motion-duration': '0.6s',
                } as React.CSSProperties
              }
            >
              <p className="text-primary-600 mb-4 text-sm font-semibold tracking-wider uppercase">
                Blog
              </p>
            </div>
            <div
              className="motion-slide-up"
              style={
                {
                  '--motion-delay': '0.1s',
                  '--motion-duration': '0.6s',
                } as React.CSSProperties
              }
            >
              <h1
                id="blog-heading"
                className="text-foreground mb-6 text-4xl font-bold tracking-tight text-balance sm:text-5xl"
              >
                Insights & <span className="text-primary-600">Resources</span>
              </h1>
            </div>
            <div
              className="motion-slide-up"
              style={
                {
                  '--motion-delay': '0.2s',
                  '--motion-duration': '0.6s',
                } as React.CSSProperties
              }
            >
              <Text
                variant="secondary"
                size="lg"
                className="mx-auto max-w-xl text-pretty sm:text-xl"
              >
                Thoughts on web development, design, and building better digital
                products.
              </Text>
            </div>
          </div>
        </Container>
      </Section>

      {/* Categories */}
      <Section size="sm" background="secondary">
        <Container>
          <div
            className="motion-slide-up flex flex-wrap justify-center gap-2"
            style={
              {
                '--motion-delay': '0s',
                '--motion-duration': '0.5s',
              } as React.CSSProperties
            }
          >
            {categories.map((category, index) => (
              <button
                key={category}
                className={cn(
                  'rounded-full border px-4 py-2 text-sm font-medium transition-all duration-200',
                  index === 0
                    ? 'border-primary-600 bg-primary-600 text-white'
                    : 'border-border bg-background text-foreground-secondary hover:border-primary-200 hover:bg-primary-50'
                )}
              >
                {category}
              </button>
            ))}
          </div>
        </Container>
      </Section>

      {/* Featured Posts */}
      <Section
        size="lg"
        background="secondary"
        aria-labelledby="featured-heading"
      >
        <Container>
          <div
            className="motion-slide-up mb-8"
            style={
              {
                '--motion-delay': '0s',
                '--motion-duration': '0.5s',
              } as React.CSSProperties
            }
          >
            <Heading level={2} id="featured-heading" className="text-xl">
              Featured Articles
            </Heading>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {featuredPosts.map((post, index) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className={cn(
                  'motion-slide-up group block overflow-hidden rounded-2xl',
                  'border-border bg-background border',
                  'hover:border-primary-200 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg'
                )}
                style={
                  {
                    '--motion-delay': `${0.1 + index * 0.1}s`,
                    '--motion-duration': '0.5s',
                  } as React.CSSProperties
                }
              >
                {/* Placeholder image */}
                <div className="from-primary-100 to-primary-200 aspect-video bg-linear-to-br" />
                <div className="p-6">
                  <div className="mb-3 flex items-center gap-3">
                    <span
                      className={cn(
                        'rounded-full border px-2.5 py-0.5 text-xs font-medium',
                        categoryColors[post.category]
                      )}
                    >
                      {post.category}
                    </span>
                    <span className="text-foreground-muted text-xs">
                      {post.readTime}
                    </span>
                  </div>
                  <h3 className="text-foreground group-hover:text-primary-600 mb-2 text-xl font-semibold transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-foreground-secondary mb-4 line-clamp-2 text-sm">
                    {post.excerpt}
                  </p>
                  <span className="text-foreground-muted text-xs">
                    {post.date}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </Section>

      {/* All Posts */}
      <Section
        size="lg"
        background="primary"
        aria-labelledby="all-posts-heading"
      >
        <Container>
          <div
            className="motion-slide-up mb-8"
            style={
              {
                '--motion-delay': '0s',
                '--motion-duration': '0.5s',
              } as React.CSSProperties
            }
          >
            <Heading level={2} id="all-posts-heading" className="text-xl">
              All Articles
            </Heading>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {regularPosts.map((post, index) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className={cn(
                  'motion-slide-up group block overflow-hidden rounded-xl',
                  'border-border bg-background border',
                  'hover:border-primary-200 transition-all duration-300 hover:-translate-y-1 hover:shadow-md'
                )}
                style={
                  {
                    '--motion-delay': `${0.1 + index * 0.05}s`,
                    '--motion-duration': '0.4s',
                  } as React.CSSProperties
                }
              >
                <div className="p-5">
                  <div className="mb-3 flex items-center gap-3">
                    <span
                      className={cn(
                        'rounded-full border px-2.5 py-0.5 text-xs font-medium',
                        categoryColors[post.category]
                      )}
                    >
                      {post.category}
                    </span>
                    <span className="text-foreground-muted text-xs">
                      {post.readTime}
                    </span>
                  </div>
                  <h3 className="text-foreground group-hover:text-primary-600 mb-2 line-clamp-2 font-semibold transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-foreground-secondary mb-3 line-clamp-2 text-sm">
                    {post.excerpt}
                  </p>
                  <span className="text-foreground-muted text-xs">
                    {post.date}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </Section>

      {/* Newsletter CTA */}
      <Section
        size="lg"
        background="secondary"
        aria-labelledby="newsletter-heading"
      >
        <Container size="sm">
          <div
            className={cn(
              'motion-slide-up relative overflow-hidden rounded-2xl',
              'from-primary-600 via-primary-700 to-primary-800 bg-linear-to-br',
              'px-6 py-12 text-center sm:px-12'
            )}
            style={
              {
                '--motion-delay': '0s',
                '--motion-duration': '0.6s',
              } as React.CSSProperties
            }
          >
            <h2
              id="newsletter-heading"
              className="mb-3 text-2xl font-bold text-white"
            >
              Stay Updated
            </h2>
            <p className="mx-auto mb-6 max-w-md text-white/80">
              Get the latest articles and resources delivered to your inbox.
            </p>
            <NewsletterForm source="blog" variant="dark" className="mx-auto max-w-md" />
          </div>
        </Container>
      </Section>
    </>
  );
}
