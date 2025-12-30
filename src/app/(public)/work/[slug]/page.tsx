/**
 * Project Detail Page (Dynamic Route)
 * Server Component - renders statically (SSG)
 *
 * Purpose: Individual project case study
 * - Full project details
 * - Problem/solution narrative
 * - Structured data for SEO
 *
 * Performance:
 * - Static generation at build time
 * - Optimized images with next/image
 * - Priority loading for featured image
 */

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import {
  getAllProjectSlugs,
  getProjectBySlug,
  ProjectDetail,
} from '@/components/portfolio';
import { JsonLd } from '@/components/shared';
import { siteConfig } from '@/config/site';

interface ProjectPageProps {
  params: Promise<{
    slug: string;
  }>;
}

/**
 * Generate static params for all projects
 * This enables static generation at build time
 */
export async function generateStaticParams(): Promise<{ slug: string }[]> {
  return getAllProjectSlugs().map((slug) => ({ slug }));
}

/**
 * Generate metadata for each project
 */
export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    return {
      title: 'Project Not Found - WebCraft',
    };
  }

  return {
    title: `${project.title} - WebCraft Portfolio`,
    description: project.shortDescription,
    openGraph: {
      title: `${project.title} - WebCraft Portfolio`,
      description: project.shortDescription,
      url: `${siteConfig.url}/work/${slug}`,
      type: 'article',
      images: [
        {
          url: project.featuredImage,
          width: 1200,
          height: 675,
          alt: `${project.title} project showcase`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${project.title} - WebCraft Portfolio`,
      description: project.shortDescription,
      images: [project.featuredImage],
    },
  };
}

/**
 * Generate structured data for the project
 */
function generateProjectSchema(
  project: NonNullable<ReturnType<typeof getProjectBySlug>>
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: project.title,
    description: project.shortDescription,
    author: {
      '@type': 'Organization',
      name: siteConfig.name,
      url: siteConfig.url,
    },
    url: `${siteConfig.url}/work/${project.slug}`,
    image: `${siteConfig.url}${project.featuredImage}`,
    datePublished: new Date().toISOString(),
    genre: project.type,
    keywords: project.techStack?.join(', '),
  };
}

export default async function ProjectPage({
  params,
}: ProjectPageProps): Promise<React.ReactElement> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const projectSchema = generateProjectSchema(project);

  return (
    <>
      {/* Project-specific JSON-LD */}
      <JsonLd data={projectSchema} />

      {/* Project Detail */}
      <ProjectDetail project={project} />
    </>
  );
}
