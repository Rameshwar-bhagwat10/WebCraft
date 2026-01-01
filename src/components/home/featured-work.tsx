/**
 * Featured Work Section Component
 * Showcases featured projects for social proof
 *
 * Server Component - fetches from database
 * Falls back to static data if no database projects
 */

import Link from 'next/link';

import { Container, Section } from '@/components/layout';
import { ProjectImage } from '@/components/portfolio/project-image';
import { Button, Heading, Text } from '@/components/ui';
import { getFeaturedProjects } from '@/lib/projects';
import { cn } from '@/lib/utils';
import type { FeaturedProject } from '@/types/database';

/**
 * Static fallback projects data
 */
const staticFeaturedProjects = [
  {
    slug: 'freshbite-restaurant',
    title: 'FreshBite Restaurant',
    category: 'website',
    short_description: 'A modern restaurant website with online ordering and reservation system.',
    gradient: 'from-orange-500/20 to-red-500/20',
  },
  {
    slug: 'taskflow-app',
    title: 'TaskFlow App',
    category: 'webapp',
    short_description: 'A productivity app that helps teams manage projects and collaborate effectively.',
    gradient: 'from-blue-500/20 to-purple-500/20',
  },
  {
    slug: 'greenleaf-ecommerce',
    title: 'GreenLeaf E-commerce',
    category: 'ecommerce',
    short_description: 'A sustainable products marketplace with seamless checkout experience.',
    gradient: 'from-green-500/20 to-emerald-500/20',
  },
];

/**
 * Category display labels
 */
const categoryLabels: Record<string, string> = {
  website: 'Website',
  webapp: 'Web Application',
  mobile: 'Mobile App',
  ecommerce: 'E-commerce',
  dashboard: 'Dashboard',
  landing: 'Landing Page',
  other: 'Other',
};

/**
 * Gradient colors by slug or category
 */
const gradientColors: Record<string, string> = {
  'freshbite-restaurant': 'from-orange-500/20 to-red-500/20',
  'taskflow-app': 'from-blue-500/20 to-purple-500/20',
  'greenleaf-ecommerce': 'from-green-500/20 to-emerald-500/20',
  website: 'from-primary-500/20 to-primary-600/20',
  webapp: 'from-blue-500/20 to-purple-500/20',
  mobile: 'from-amber-500/20 to-orange-500/20',
  ecommerce: 'from-green-500/20 to-emerald-500/20',
  dashboard: 'from-cyan-500/20 to-blue-500/20',
  landing: 'from-pink-500/20 to-rose-500/20',
  other: 'from-neutral-400/20 to-neutral-500/20',
};

interface ProjectCardProps {
  slug: string;
  title: string;
  category: string;
  description: string;
  coverImagePath: string | null;
  coverImageAlt: string | null;
  gradient: string;
  index: number;
}

function ProjectCard({
  slug,
  title,
  category,
  description,
  coverImagePath,
  coverImageAlt,
  gradient,
  index,
}: ProjectCardProps): React.ReactElement {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
  const imageUrl = coverImagePath
    ? `${supabaseUrl}/storage/v1/object/public/project-images/${coverImagePath}`
    : null;

  return (
    <Link
      href={`/work/${slug}`}
      className={cn(
        'motion-slide-up group relative block overflow-hidden rounded-2xl',
        'bg-background border-border border',
        'transition-all duration-300',
        'hover:border-primary-200 hover:-translate-y-1 hover:shadow-xl'
      )}
      style={{
        '--motion-delay': `${0.1 + index * 0.1}s`,
        '--motion-duration': '0.5s',
      } as React.CSSProperties}
    >
      {/* Image area */}
      <div className={cn('relative aspect-16/10 overflow-hidden bg-linear-to-br', gradient)}>
        {imageUrl ? (
          <ProjectImage
            src={imageUrl}
            alt={coverImageAlt ?? `${title} project screenshot`}
            title={title}
            className="transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-foreground-muted/30 text-6xl font-bold">
              {title.charAt(0)}
            </div>
          </div>
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors duration-300 group-hover:bg-black/10">
          <span className="translate-y-4 rounded-full bg-white px-4 py-2 text-sm font-medium text-neutral-900 opacity-0 shadow-lg transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
            View Project →
          </span>
        </div>

        {/* Category badge */}
        <div className="absolute top-4 left-4">
          <span className="bg-background/90 text-foreground-secondary rounded-full px-3 py-1 text-xs font-medium backdrop-blur-sm">
            {categoryLabels[category] ?? category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-foreground group-hover:text-primary-700 mb-2 text-xl font-semibold transition-colors duration-200">
          {title}
        </h3>
        <p className="text-foreground-secondary text-sm leading-relaxed">
          {description}
        </p>
      </div>
    </Link>
  );
}


export async function FeaturedWork(): Promise<React.ReactElement> {
  // Fetch featured projects from database
  const dbProjects = await getFeaturedProjects(3);
  
  // Use database projects if available, otherwise use static fallback
  const useDbProjects = dbProjects.length > 0;
  
  const projects: Array<{
    slug: string;
    title: string;
    category: string;
    description: string;
    coverImagePath: string | null;
    coverImageAlt: string | null;
    gradient: string;
  }> = useDbProjects
    ? dbProjects.map((p: FeaturedProject) => ({
        slug: p.slug,
        title: p.title,
        category: p.category,
        description: p.short_description,
        coverImagePath: p.cover_image_path,
        coverImageAlt: p.cover_image_alt,
        gradient: gradientColors[p.slug] ?? gradientColors[p.category] ?? 'from-primary-500/20 to-primary-600/20',
      }))
    : staticFeaturedProjects.map((p) => ({
        slug: p.slug,
        title: p.title,
        category: p.category,
        description: p.short_description,
        coverImagePath: null,
        coverImageAlt: null,
        gradient: p.gradient,
      }));

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
              style={{ '--motion-delay': '0s', '--motion-duration': '0.5s' } as React.CSSProperties}
            >
              <Heading level={2} id="featured-work-heading" className="mb-4">
                Featured Work
              </Heading>
            </div>
            <div
              className="motion-slide-up"
              style={{ '--motion-delay': '0.1s', '--motion-duration': '0.5s' } as React.CSSProperties}
            >
              <Text variant="secondary" size="lg" className="max-w-md">
                A selection of projects we&apos;re proud of. Real results for
                real businesses.
              </Text>
            </div>
          </div>

          <div
            className="motion-slide-up"
            style={{ '--motion-delay': '0.2s', '--motion-duration': '0.5s' } as React.CSSProperties}
          >
            <Button asChild variant="outline">
              <Link href="/work">
                View All Projects
                <span aria-hidden="true" className="ml-2">→</span>
              </Link>
            </Button>
          </div>
        </div>

        {/* Projects grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, index) => (
            <ProjectCard
              key={project.slug}
              slug={project.slug}
              title={project.title}
              category={project.category}
              description={project.description}
              coverImagePath={project.coverImagePath}
              coverImageAlt={project.coverImageAlt}
              gradient={project.gradient}
              index={index}
            />
          ))}
        </div>
      </Container>
    </Section>
  );
}
