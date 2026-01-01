/**
 * Project Detail Component
 * Enhanced full project case study layout
 *
 * Server Component - no client JS needed
 * Premium styling with animations
 * Supports both database and static data sources
 */

import Link from 'next/link';

import { Container, Section } from '@/components/layout';
import { Button, Heading, Text } from '@/components/ui';
import { cn } from '@/lib/utils';
import type { ClientReview, ProjectWithImages } from '@/types/database';

import { ProjectImage } from './project-image';
import type { ProjectData } from './projects-data';
import { projectsData } from './projects-data';

interface ProjectDetailProps {
  /** Project from database or static data */
  project: ProjectWithImages | ProjectData;
  /** Client review for this project (database projects only) */
  review?: ClientReview | null;
}

/**
 * Type guard to check if project is from database
 */
function checkIsDbProject(project: ProjectWithImages | ProjectData): project is ProjectWithImages {
  return 'full_description' in project;
}

/**
 * Type badge styles
 */
const typeBadgeStyles: Record<string, string> = {
  Website: 'bg-primary-50 text-primary-700 border-primary-200',
  website: 'bg-primary-50 text-primary-700 border-primary-200',
  'Web App': 'bg-success-50 text-success-700 border-success-200',
  webapp: 'bg-success-50 text-success-700 border-success-200',
  'Mobile App': 'bg-warning-50 text-warning-700 border-warning-200',
  mobile: 'bg-warning-50 text-warning-700 border-warning-200',
  Dashboard: 'bg-neutral-100 text-neutral-700 border-neutral-200',
  dashboard: 'bg-neutral-100 text-neutral-700 border-neutral-200',
  ecommerce: 'bg-success-50 text-success-700 border-success-200',
  landing: 'bg-primary-50 text-primary-700 border-primary-200',
  other: 'bg-neutral-100 text-neutral-700 border-neutral-200',
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
 * Extract key metric from outcome text
 */
function extractMetric(
  outcome: string
): { value: string; label: string } | null {
  const match = outcome.match(/(\d+%?|\d+\+?)/);
  if (match && match[1]) {
    const value = match[1];
    const parts = outcome.split(value);
    const label = parts[1]?.split('.')[0]?.trim() || 'improvement';
    return { value, label };
  }
  return null;
}

/**
 * Format category for display
 */
function formatCategory(category: string): string {
  const categoryMap: Record<string, string> = {
    website: 'Website',
    webapp: 'Web App',
    mobile: 'Mobile App',
    ecommerce: 'E-Commerce',
    dashboard: 'Dashboard',
    landing: 'Landing Page',
    other: 'Other',
  };
  return categoryMap[category] ?? category;
}

export function ProjectDetail({
  project,
  review,
}: ProjectDetailProps): React.ReactElement {
  const isDb = checkIsDbProject(project);
  
  // Normalize data for both sources
  const title = project.title;
  const slug = project.slug;
  const type = isDb ? formatCategory(project.category) : project.type;
  const description = isDb ? project.full_description : project.overview;
  const techStack = isDb ? (project.tech_stack as string[]) : project.techStack;
  
  // Get featured image URL
  const featuredImageUrl = isDb 
    ? project.images.find(img => img.is_cover)?.storage_path
      ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/project-images/${project.images.find(img => img.is_cover)?.storage_path}`
      : null
    : project.featuredImage;
  
  const featuredImageAlt = isDb
    ? project.images.find(img => img.is_cover)?.alt_text ?? `${title} project showcase`
    : `${title} project showcase`;

  const gradient = gradientColors[slug] || 'from-primary-500/20 to-primary-600/20';
  
  // Static project specific data
  const staticProject = !isDb ? project as ProjectData : null;
  const metric = staticProject ? extractMetric(staticProject.outcome) : null;
  
  // Related projects (static only)
  const relatedProjects = projectsData
    .filter((p) => p.slug !== slug)
    .slice(0, 2);

  return (
    <>
      {/* Hero section */}
      <Section
        size="lg"
        background="primary"
        aria-labelledby="project-heading"
        className="relative overflow-hidden"
      >
        <div className="absolute inset-0 -z-10" aria-hidden="true">
          <div className="motion-float motion-pulse-glow bg-primary-100 absolute -top-1/2 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full opacity-50 blur-3xl" />
        </div>

        <Container size="lg">
          <div className="mx-auto max-w-4xl">
            <div
              className="motion-slide-up"
              style={{ '--motion-delay': '0s', '--motion-duration': '0.5s' } as React.CSSProperties}
            >
              <Link
                href="/work"
                className="text-foreground-secondary hover:text-primary-600 group mb-8 inline-flex items-center text-sm transition-colors"
              >
                <svg className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to all projects
              </Link>
            </div>

            <div
              className="motion-slide-up"
              style={{ '--motion-delay': '0.1s', '--motion-duration': '0.5s' } as React.CSSProperties}
            >
              <span className={cn('mb-4 inline-block rounded-full border px-3 py-1 text-xs font-medium', typeBadgeStyles[type] || typeBadgeStyles.Website)}>
                {type}
              </span>
            </div>

            <div
              className="motion-slide-up"
              style={{ '--motion-delay': '0.2s', '--motion-duration': '0.5s' } as React.CSSProperties}
            >
              <h1 id="project-heading" className="text-foreground mb-6 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                {title}
              </h1>
            </div>

            <div
              className="motion-slide-up"
              style={{ '--motion-delay': '0.3s', '--motion-duration': '0.5s' } as React.CSSProperties}
            >
              <Text variant="secondary" size="lg" className="mb-10 max-w-3xl sm:text-xl">
                {isDb ? project.short_description : description}
              </Text>
            </div>

            <div
              className={cn('motion-scale-in relative aspect-video overflow-hidden rounded-2xl bg-linear-to-br', gradient)}
              style={{ '--motion-delay': '0.4s', '--motion-duration': '0.6s' } as React.CSSProperties}
            >
              {featuredImageUrl ? (
                <ProjectImage src={featuredImageUrl} alt={featuredImageAlt} title={title} />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <span className="text-foreground-muted text-2xl font-medium">{title}</span>
                </div>
              )}
            </div>
          </div>
        </Container>
      </Section>

      {/* Results Metrics Strip - Static projects only */}
      {metric && staticProject && (
        <Section size="sm" background="secondary" aria-label="Project results">
          <Container>
            <div className="motion-slide-up flex flex-wrap items-center justify-center gap-8 sm:gap-16" style={{ '--motion-delay': '0s', '--motion-duration': '0.5s' } as React.CSSProperties}>
              <div className="text-center">
                <div className="text-primary-600 text-4xl font-bold sm:text-5xl">{metric.value}</div>
                <div className="text-foreground-muted mt-1 text-sm capitalize">{metric.label}</div>
              </div>
              {staticProject.techStack && (
                <div className="text-center">
                  <div className="text-primary-600 text-4xl font-bold sm:text-5xl">{staticProject.techStack.length}</div>
                  <div className="text-foreground-muted mt-1 text-sm">Technologies Used</div>
                </div>
              )}
              <div className="text-center">
                <div className="text-primary-600 text-4xl font-bold sm:text-5xl">{staticProject.features.length}</div>
                <div className="text-foreground-muted mt-1 text-sm">Key Features</div>
              </div>
            </div>
          </Container>
        </Section>
      )}

      {/* Full Description - Database projects */}
      {isDb && (
        <Section size="lg" background="primary">
          <Container size="lg">
            <div className="mx-auto max-w-4xl">
              <div className="motion-slide-up" style={{ '--motion-delay': '0s', '--motion-duration': '0.5s' } as React.CSSProperties}>
                <Heading level={2} className="mb-6">About This Project</Heading>
              </div>
              <div className="motion-slide-up prose prose-lg max-w-none" style={{ '--motion-delay': '0.1s', '--motion-duration': '0.5s' } as React.CSSProperties}>
                <Text variant="secondary" className="whitespace-pre-wrap leading-relaxed">
                  {description}
                </Text>
              </div>
            </div>
          </Container>
        </Section>
      )}

      {/* Problem & Solution - Static projects only */}
      {staticProject && (
        <Section size="lg" background="primary">
          <Container size="lg">
            <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-2 md:gap-12">
              <div className="motion-slide-up border-border bg-background rounded-2xl border p-6 sm:p-8" style={{ '--motion-delay': '0s', '--motion-duration': '0.5s' } as React.CSSProperties}>
                <div className="bg-error-50 text-error-600 mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <Heading level={2} className="mb-4 text-2xl">The Challenge</Heading>
                <Text variant="secondary" className="leading-relaxed">{staticProject.problem}</Text>
              </div>

              <div className="motion-slide-up border-border bg-background rounded-2xl border p-6 sm:p-8" style={{ '--motion-delay': '0.1s', '--motion-duration': '0.5s' } as React.CSSProperties}>
                <div className="bg-success-50 text-success-600 mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <Heading level={2} className="mb-4 text-2xl">Our Approach</Heading>
                <Text variant="secondary" className="leading-relaxed">{staticProject.solution}</Text>
              </div>
            </div>
          </Container>
        </Section>
      )}

      {/* Features - Static projects only */}
      {staticProject && (
        <Section size="lg" background="secondary" aria-labelledby="features-heading">
          <Container size="lg">
            <div className="mx-auto max-w-4xl">
              <div className="motion-slide-up mb-8" style={{ '--motion-delay': '0s', '--motion-duration': '0.5s' } as React.CSSProperties}>
                <Heading level={2} id="features-heading">Key Features</Heading>
              </div>
              <ul className="grid gap-4 sm:grid-cols-2">
                {staticProject.features.map((feature: string, index: number) => (
                  <li
                    key={index}
                    className={cn('motion-slide-up group flex items-start gap-3 rounded-xl p-4', 'bg-background border-border border', 'hover:border-primary-200 transition-all duration-200 hover:shadow-md')}
                    style={{ '--motion-delay': `${0.1 + index * 0.05}s`, '--motion-duration': '0.4s' } as React.CSSProperties}
                  >
                    <span className="bg-primary-100 text-primary-600 group-hover:bg-primary-200 mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full transition-all duration-200 group-hover:scale-110">
                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                    <Text variant="body" className="text-sm leading-relaxed">{feature}</Text>
                  </li>
                ))}
              </ul>
            </div>
          </Container>
        </Section>
      )}

      {/* Outcome - Static projects only */}
      {staticProject && (
        <Section size="lg" background="primary" aria-labelledby="outcome-heading">
          <Container size="lg">
            <div className="mx-auto max-w-4xl">
              <div className="motion-slide-up mb-6" style={{ '--motion-delay': '0s', '--motion-duration': '0.5s' } as React.CSSProperties}>
                <Heading level={2} id="outcome-heading">The Result</Heading>
              </div>
              <div className={cn('motion-slide-up relative overflow-hidden rounded-2xl p-6 sm:p-8', 'from-primary-50 to-primary-100/50 bg-linear-to-br', 'border-primary-200/50 border')} style={{ '--motion-delay': '0.1s', '--motion-duration': '0.5s' } as React.CSSProperties}>
                <div className="bg-primary-500 absolute top-0 left-0 h-full w-1 rounded-l-2xl" aria-hidden="true" />
                <Text variant="body" size="lg" className="leading-relaxed">{staticProject.outcome}</Text>
              </div>
            </div>
          </Container>
        </Section>
      )}

      {/* Tech Stack */}
      {techStack && techStack.length > 0 && (
        <Section size="md" background={isDb ? 'secondary' : 'primary'}>
          <Container size="lg">
            <div className="mx-auto max-w-4xl">
              <div className="motion-slide-up" style={{ '--motion-delay': '0s', '--motion-duration': '0.5s' } as React.CSSProperties}>
                <Text variant="muted" size="sm" className="mb-3">Built with</Text>
                <div className="flex flex-wrap gap-2">
                  {techStack.map((tech: string) => (
                    <span key={tech} className="bg-background border-border hover:border-primary-200 hover:bg-primary-50 rounded-full border px-4 py-1.5 text-sm font-medium text-neutral-700 transition-colors">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Container>
        </Section>
      )}

      {/* External Links - Database projects */}
      {isDb && (project.live_url || project.github_url) && (
        <Section size="md" background="primary">
          <Container size="lg">
            <div className="mx-auto max-w-4xl">
              <div className="flex flex-wrap gap-4">
                {project.live_url && (
                  <Button asChild>
                    <a href={project.live_url} target="_blank" rel="noopener noreferrer">
                      View Live Site →
                    </a>
                  </Button>
                )}
                {project.github_url && (
                  <Button variant="outline" asChild>
                    <a href={project.github_url} target="_blank" rel="noopener noreferrer">
                      View on GitHub
                    </a>
                  </Button>
                )}
              </div>
            </div>
          </Container>
        </Section>
      )}

      {/* Client Review - Database projects only */}
      {review && (
        <Section size="lg" background="secondary" aria-labelledby="review-heading">
          <Container size="lg">
            <div className="mx-auto max-w-4xl">
              <div className="motion-slide-up mb-8" style={{ '--motion-delay': '0s', '--motion-duration': '0.5s' } as React.CSSProperties}>
                <Heading level={2} id="review-heading">Client Feedback</Heading>
              </div>
              <div
                className={cn(
                  'motion-slide-up relative overflow-hidden rounded-2xl',
                  'bg-white border border-neutral-100',
                  'p-6 sm:p-8',
                  'shadow-sm'
                )}
                style={{ '--motion-delay': '0.1s', '--motion-duration': '0.5s' } as React.CSSProperties}
              >
                {/* Quote icon */}
                <div className="mb-4">
                  <svg
                    className="text-primary-200 h-10 w-10 sm:h-12 sm:w-12"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                  </svg>
                </div>

                {/* Rating */}
                {review.rating && (
                  <div className="mb-4 flex gap-0.5" aria-label={`${review.rating} out of 5 stars`}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg
                        key={star}
                        className={cn('h-5 w-5', star <= review.rating! ? 'text-amber-400' : 'text-neutral-200')}
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                    ))}
                  </div>
                )}

                {/* Review text */}
                <blockquote className="mb-6">
                  <Text variant="secondary" size="lg" className="leading-relaxed text-pretty">
                    &ldquo;{review.review_text}&rdquo;
                  </Text>
                </blockquote>

                {/* Client info */}
                <footer className="border-border flex items-center gap-4 border-t pt-4">
                  {/* Avatar with initials */}
                  <div
                    className="bg-primary-100 text-primary-700 flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-sm font-semibold"
                    aria-hidden="true"
                  >
                    {review.client_name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .toUpperCase()
                      .slice(0, 2)}
                  </div>
                  <div>
                    <p className="text-foreground font-semibold">{review.client_name}</p>
                    <p className="text-foreground-muted text-sm">
                      {review.client_role}
                      {review.client_role && review.client_company ? ', ' : ''}
                      {review.client_company}
                    </p>
                  </div>
                </footer>
              </div>
            </div>
          </Container>
        </Section>
      )}

      {/* Related Projects */}
      {relatedProjects.length > 0 && (
        <Section size="lg" background="secondary" aria-labelledby="related-heading">
          <Container size="lg">
            <div className="mx-auto max-w-4xl">
              <div className="motion-slide-up mb-8 flex items-center justify-between" style={{ '--motion-delay': '0s', '--motion-duration': '0.5s' } as React.CSSProperties}>
                <Heading level={2} id="related-heading">More Projects</Heading>
                <Link href="/work" className="text-primary-600 hover:text-primary-700 text-sm font-medium transition-colors">
                  View all →
                </Link>
              </div>
              <div className="grid gap-6 sm:grid-cols-2">
                {relatedProjects.map((relatedProject, index) => (
                  <Link
                    key={relatedProject.slug}
                    href={`/work/${relatedProject.slug}`}
                    className={cn('motion-slide-up group block overflow-hidden rounded-xl', 'bg-background border-border border', 'hover:border-primary-200 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg')}
                    style={{ '--motion-delay': `${0.1 + index * 0.1}s`, '--motion-duration': '0.5s' } as React.CSSProperties}
                  >
                    <div className="p-5">
                      <span className={cn('mb-2 inline-block rounded-full border px-2.5 py-0.5 text-xs font-medium', typeBadgeStyles[relatedProject.type] || typeBadgeStyles.Website)}>
                        {relatedProject.type}
                      </span>
                      <h3 className="text-foreground group-hover:text-primary-700 mb-1 font-semibold transition-colors">
                        {relatedProject.title}
                      </h3>
                      <p className="text-foreground-secondary line-clamp-2 text-sm">
                        {relatedProject.shortDescription}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </Container>
        </Section>
      )}

      {/* CTA */}
      <Section size="lg" background="primary" aria-labelledby="project-cta-heading">
        <Container size="md">
          <div className={cn('motion-slide-up relative overflow-hidden rounded-3xl', 'from-primary-600 via-primary-700 to-primary-800 bg-linear-to-br', 'px-6 py-16 text-center sm:px-12 sm:py-20')} style={{ '--motion-delay': '0s', '--motion-duration': '0.6s' } as React.CSSProperties}>
            <div className="absolute inset-0 overflow-hidden opacity-10" aria-hidden="true">
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] bg-size-[3rem_3rem]" />
            </div>
            <div className="relative z-10">
              <h2 id="project-cta-heading" className="motion-slide-up mb-4 text-2xl font-bold text-white sm:text-3xl" style={{ '--motion-delay': '0.1s', '--motion-duration': '0.5s' } as React.CSSProperties}>
                Have a Similar Project?
              </h2>
              <p className="motion-slide-up mx-auto mb-8 max-w-md text-white/80" style={{ '--motion-delay': '0.2s', '--motion-duration': '0.5s' } as React.CSSProperties}>
                We&apos;d love to hear about your project and discuss how we can help bring it to life.
              </p>
              <div className="motion-slide-up flex flex-col items-center gap-4 sm:flex-row sm:justify-center" style={{ '--motion-delay': '0.3s', '--motion-duration': '0.5s' } as React.CSSProperties}>
                <Button asChild size="lg" className="text-primary-700 bg-white hover:bg-white/90">
                  <Link href="/contact">Start a Conversation</Link>
                </Button>
                <Button asChild variant="ghost" size="lg" className="text-white hover:bg-white/10">
                  <Link href="/work">View More Projects</Link>
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
