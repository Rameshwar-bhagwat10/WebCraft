/**
 * Blog Post Detail Page
 * Dynamic route for individual blog posts
 *
 * Server Component - renders statically (SSG)
 */

import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import {
  categoryColors,
  getAllPostSlugs,
  getPostBySlug,
  getRelatedPosts,
} from '@/components/blog';
import { Container, Section } from '@/components/layout';
import { JsonLd } from '@/components/shared';
import { Heading, Text } from '@/components/ui';
import { generatePageMetadata, generateWebPageSchema } from '@/lib/seo';
import { cn } from '@/lib/utils';

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

/**
 * Generate static params for all blog posts
 */
export async function generateStaticParams(): Promise<{ slug: string }[]> {
  return getAllPostSlugs().map((slug) => ({ slug }));
}

/**
 * Generate metadata for the blog post
 */
export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return generatePageMetadata({
      title: 'Post Not Found - WebCraft',
      description: 'The requested blog post could not be found.',
      pathname: `/blog/${slug}`,
    });
  }

  return generatePageMetadata({
    title: `${post.title} - WebCraft Blog`,
    description: post.excerpt,
    pathname: `/blog/${slug}`,
  });
}

/**
 * Arrow left icon
 */
function ArrowLeftIcon(): React.ReactElement {
  return (
    <svg
      className="h-4 w-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
      />
    </svg>
  );
}

/**
 * Clock icon for read time
 */
function ClockIcon(): React.ReactElement {
  return (
    <svg
      className="h-4 w-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.5}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );
}

/**
 * Calendar icon for date
 */
function CalendarIcon(): React.ReactElement {
  return (
    <svg
      className="h-4 w-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.5}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
      />
    </svg>
  );
}

/**
 * User icon for author
 */
function UserIcon(): React.ReactElement {
  return (
    <svg
      className="h-4 w-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.5}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
      />
    </svg>
  );
}

export default async function BlogPostPage({
  params,
}: BlogPostPageProps): Promise<React.ReactElement> {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = getRelatedPosts(slug, 3);

  const pageSchema = generateWebPageSchema({
    title: `${post.title} - WebCraft Blog`,
    description: post.excerpt,
    pathname: `/blog/${slug}`,
  });

  return (
    <>
      <JsonLd data={pageSchema} />

      {/* Hero */}
      <Section
        size="lg"
        background="primary"
        aria-labelledby="post-heading"
        className="relative overflow-hidden"
      >
        <div className="absolute inset-0 -z-10" aria-hidden="true">
          <div className="motion-float motion-pulse-glow bg-primary-100 absolute -top-1/2 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full opacity-50 blur-3xl" />
        </div>
        <Container size="md">
          <div className="mx-auto max-w-3xl pt-8 sm:pt-12">
            {/* Back link */}
            <div
              className="motion-slide-up mb-8"
              style={
                {
                  '--motion-delay': '0s',
                  '--motion-duration': '0.5s',
                } as React.CSSProperties
              }
            >
              <Link
                href="/blog"
                className="text-foreground-secondary hover:text-primary-600 inline-flex items-center gap-2 text-sm font-medium transition-colors"
              >
                <ArrowLeftIcon />
                Back to Blog
              </Link>
            </div>

            {/* Category & Meta */}
            <div
              className="motion-slide-up mb-4 flex flex-wrap items-center gap-3"
              style={
                {
                  '--motion-delay': '0.1s',
                  '--motion-duration': '0.5s',
                } as React.CSSProperties
              }
            >
              <span
                className={cn(
                  'rounded-full border px-3 py-1 text-sm font-medium',
                  categoryColors[post.category]
                )}
              >
                {post.category}
              </span>
              <div className="text-foreground-muted flex items-center gap-4 text-sm">
                <span className="flex items-center gap-1.5">
                  <ClockIcon />
                  {post.readTime}
                </span>
                <span className="flex items-center gap-1.5">
                  <CalendarIcon />
                  {post.date}
                </span>
              </div>
            </div>

            {/* Title */}
            <div
              className="motion-slide-up"
              style={
                {
                  '--motion-delay': '0.2s',
                  '--motion-duration': '0.6s',
                } as React.CSSProperties
              }
            >
              <h1
                id="post-heading"
                className="text-foreground mb-6 text-3xl font-bold tracking-tight text-balance sm:text-4xl lg:text-5xl"
              >
                {post.title}
              </h1>
            </div>

            {/* Excerpt */}
            <div
              className="motion-slide-up"
              style={
                {
                  '--motion-delay': '0.3s',
                  '--motion-duration': '0.6s',
                } as React.CSSProperties
              }
            >
              <Text
                variant="secondary"
                size="lg"
                className="mb-8 text-pretty sm:text-xl"
              >
                {post.excerpt}
              </Text>
            </div>

            {/* Author */}
            <div
              className="motion-slide-up border-border flex items-center gap-4 border-t pt-6"
              style={
                {
                  '--motion-delay': '0.4s',
                  '--motion-duration': '0.5s',
                } as React.CSSProperties
              }
            >
              <div className="bg-primary-100 text-primary-600 flex h-12 w-12 items-center justify-center rounded-full">
                <UserIcon />
              </div>
              <div>
                <p className="text-foreground font-semibold">
                  {post.author.name}
                </p>
                <p className="text-foreground-secondary text-sm">
                  {post.author.role}
                </p>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Content */}
      <Section size="lg" background="secondary" aria-label="Article content">
        <Container size="md">
          <article className="mx-auto max-w-3xl">
            <div
              className="motion-slide-up prose prose-lg prose-neutral max-w-none"
              style={
                {
                  '--motion-delay': '0s',
                  '--motion-duration': '0.6s',
                } as React.CSSProperties
              }
            >
              {/* Render content as formatted text */}
              {post.content.split('\n').map((line, index) => {
                const trimmedLine = line.trim();

                // Headings
                if (trimmedLine.startsWith('## ')) {
                  return (
                    <h2
                      key={index}
                      className="text-foreground mt-10 mb-4 text-2xl font-bold"
                    >
                      {trimmedLine.replace('## ', '')}
                    </h2>
                  );
                }
                if (trimmedLine.startsWith('### ')) {
                  return (
                    <h3
                      key={index}
                      className="text-foreground mt-8 mb-3 text-xl font-semibold"
                    >
                      {trimmedLine.replace('### ', '')}
                    </h3>
                  );
                }
                if (trimmedLine.startsWith('#### ')) {
                  return (
                    <h4
                      key={index}
                      className="text-foreground mt-6 mb-2 text-lg font-semibold"
                    >
                      {trimmedLine.replace('#### ', '')}
                    </h4>
                  );
                }

                // Code blocks
                if (trimmedLine.startsWith('```')) {
                  return null; // Skip code fence markers
                }

                // List items
                if (trimmedLine.startsWith('- ')) {
                  return (
                    <li
                      key={index}
                      className="text-foreground-secondary ml-4 list-disc"
                    >
                      {trimmedLine.replace('- ', '')}
                    </li>
                  );
                }
                if (trimmedLine.startsWith('- [ ]')) {
                  return (
                    <li
                      key={index}
                      className="text-foreground-secondary ml-4 list-none"
                    >
                      <span className="mr-2">☐</span>
                      {trimmedLine.replace('- [ ] ', '')}
                    </li>
                  );
                }

                // Regular paragraphs
                if (trimmedLine && !trimmedLine.startsWith('```')) {
                  return (
                    <p
                      key={index}
                      className="text-foreground-secondary mb-4 leading-relaxed"
                    >
                      {trimmedLine}
                    </p>
                  );
                }

                return null;
              })}
            </div>

            {/* Tags */}
            <div
              className="motion-slide-up border-border mt-12 border-t pt-8"
              style={
                {
                  '--motion-delay': '0.1s',
                  '--motion-duration': '0.5s',
                } as React.CSSProperties
              }
            >
              <p className="text-foreground mb-3 text-sm font-semibold">Tags</p>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="border-border bg-background text-foreground-secondary rounded-full border px-3 py-1 text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </article>
        </Container>
      </Section>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <Section
          size="lg"
          background="primary"
          aria-labelledby="related-heading"
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
              <Heading level={2} id="related-heading" className="text-xl">
                Related Articles
              </Heading>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {relatedPosts.map((relatedPost, index) => (
                <Link
                  key={relatedPost.slug}
                  href={`/blog/${relatedPost.slug}`}
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
                          categoryColors[relatedPost.category]
                        )}
                      >
                        {relatedPost.category}
                      </span>
                      <span className="text-foreground-muted text-xs">
                        {relatedPost.readTime}
                      </span>
                    </div>
                    <h3 className="text-foreground group-hover:text-primary-600 mb-2 line-clamp-2 font-semibold transition-colors">
                      {relatedPost.title}
                    </h3>
                    <p className="text-foreground-secondary mb-3 line-clamp-2 text-sm">
                      {relatedPost.excerpt}
                    </p>
                    <span className="text-foreground-muted text-xs">
                      {relatedPost.date}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </Container>
        </Section>
      )}

      {/* CTA */}
      <Section size="lg" background="secondary" aria-labelledby="cta-heading">
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
            <h2 id="cta-heading" className="mb-3 text-2xl font-bold text-white">
              Ready to Start Your Project?
            </h2>
            <p className="mx-auto mb-6 max-w-md text-white/80">
              Let&apos;s discuss how we can help bring your vision to life.
            </p>
            <Link
              href="/contact"
              className="text-primary-700 inline-flex items-center justify-center rounded-lg bg-white px-6 py-3 font-medium transition-colors hover:bg-white/90"
            >
              Get in Touch
            </Link>
          </div>
        </Container>
      </Section>
    </>
  );
}
