/**
 * Featured Work Section Component
 * Showcases 3 best projects for social proof
 *
 * Server Component - no client JS needed
 * Links to full portfolio for more details
 */

import Link from 'next/link';

import { Container, Section } from '@/components/layout';
import { Button, Heading, Text } from '@/components/ui';
import { cn } from '@/lib/utils';

/**
 * Featured projects data
 * Curated selection of best work with results
 */
const featuredProjects = [
  {
    slug: 'freshbite-restaurant',
    title: 'FreshBite Restaurant',
    category: 'Business Website',
    result: '150% increase in online orders',
    description:
      'A modern restaurant website with online ordering and reservation system.',
    gradient: 'from-orange-500/20 to-red-500/20',
    accentColor: 'bg-orange-500',
  },
  {
    slug: 'taskflow-app',
    title: 'TaskFlow App',
    category: 'Web Application',
    result: '10,000+ active users',
    description:
      'A productivity app that helps teams manage projects and collaborate effectively.',
    gradient: 'from-blue-500/20 to-purple-500/20',
    accentColor: 'bg-blue-500',
  },
  {
    slug: 'greenleaf-ecommerce',
    title: 'GreenLeaf E-commerce',
    category: 'E-commerce Platform',
    result: '40% conversion rate boost',
    description:
      'A sustainable products marketplace with seamless checkout experience.',
    gradient: 'from-green-500/20 to-emerald-500/20',
    accentColor: 'bg-green-500',
  },
];

interface ProjectCardProps {
  slug: string;
  title: string;
  category: string;
  result: string;
  description: string;
  gradient: string;
  accentColor: string;
  index: number;
}

function ProjectCard({
  slug,
  title,
  category,
  result,
  description,
  gradient,
  accentColor,
  index,
}: ProjectCardProps): React.ReactElement {
  return (
    <Link
      href={`/work/${slug}`}
      className={cn(
        'motion-slide-up group relative block overflow-hidden rounded-2xl',
        'bg-background border-border border',
        'transition-all duration-300',
        'hover:border-primary-200 hover:-translate-y-1 hover:shadow-xl'
      )}
      style={
        {
          '--motion-delay': `${0.1 + index * 0.1}s`,
          '--motion-duration': '0.5s',
        } as React.CSSProperties
      }
    >
      {/* Image placeholder with gradient */}
      <div
        className={cn(
          'relative aspect-[16/10] overflow-hidden bg-gradient-to-br',
          gradient
        )}
      >
        {/* Decorative elements */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-foreground-muted/30 text-6xl font-bold">
            {title.charAt(0)}
          </div>
        </div>

        {/* Hover overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors duration-300 group-hover:bg-black/10">
          <span className="translate-y-4 rounded-full bg-white px-4 py-2 text-sm font-medium text-neutral-900 opacity-0 shadow-lg transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
            View Project →
          </span>
        </div>

        {/* Category badge */}
        <div className="absolute top-4 left-4">
          <span className="bg-background/90 text-foreground-secondary rounded-full px-3 py-1 text-xs font-medium backdrop-blur-sm">
            {category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Accent bar */}
        <div
          className={cn('mb-4 h-1 w-12 rounded-full', accentColor)}
          aria-hidden="true"
        />

        {/* Title */}
        <h3 className="text-foreground group-hover:text-primary-700 mb-2 text-xl font-semibold transition-colors duration-200">
          {title}
        </h3>

        {/* Description */}
        <p className="text-foreground-secondary mb-4 text-sm leading-relaxed">
          {description}
        </p>

        {/* Result highlight */}
        <div className="border-border flex items-center gap-2 border-t pt-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-success-600 h-4 w-4"
          >
            <path d="m5 12 5 5L20 7" />
          </svg>
          <span className="text-foreground text-sm font-medium">{result}</span>
        </div>
      </div>
    </Link>
  );
}

export function FeaturedWork(): React.ReactElement {
  return (
    <Section
      size="lg"
      background="secondary"
      aria-labelledby="featured-work-heading"
    >
      <Container>
        {/* Section header */}
        <div className="mb-12 flex flex-col items-start justify-between gap-6 sm:mb-16 sm:flex-row sm:items-end">
          <div>
            <div
              className="motion-slide-up"
              style={
                {
                  '--motion-delay': '0s',
                  '--motion-duration': '0.5s',
                } as React.CSSProperties
              }
            >
              <Heading level={2} id="featured-work-heading" className="mb-4">
                Featured Work
              </Heading>
            </div>
            <div
              className="motion-slide-up"
              style={
                {
                  '--motion-delay': '0.1s',
                  '--motion-duration': '0.5s',
                } as React.CSSProperties
              }
            >
              <Text variant="secondary" size="lg" className="max-w-md">
                A selection of projects we&apos;re proud of. Real results for
                real businesses.
              </Text>
            </div>
          </div>

          <div
            className="motion-slide-up"
            style={
              {
                '--motion-delay': '0.2s',
                '--motion-duration': '0.5s',
              } as React.CSSProperties
            }
          >
            <Button asChild variant="outline">
              <Link href="/work">
                View All Projects
                <span aria-hidden="true" className="ml-2">
                  →
                </span>
              </Link>
            </Button>
          </div>
        </div>

        {/* Projects grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featuredProjects.map((project, index) => (
            <ProjectCard
              key={project.slug}
              slug={project.slug}
              title={project.title}
              category={project.category}
              result={project.result}
              description={project.description}
              gradient={project.gradient}
              accentColor={project.accentColor}
              index={index}
            />
          ))}
        </div>
      </Container>
    </Section>
  );
}
