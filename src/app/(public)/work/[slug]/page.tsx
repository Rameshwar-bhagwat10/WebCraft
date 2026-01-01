/**
 * Project Detail Page (Dynamic Route)
 * Server Component with ISR
 *
 * Strategy:
 * - Static params generated from static demo data
 * - Database projects rendered on-demand with caching
 * - Falls back to static data if slug matches demo project
 */

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { ProjectDetail } from '@/components/portfolio';
import { 
  getProjectBySlug as getStaticProject, 
  projectsData,
  type ProjectData 
} from '@/components/portfolio/projects-data';
import { JsonLd } from '@/components/shared';
import { siteConfig } from '@/config/site';
import { getProjectBySlug, getProjectImageUrl } from '@/lib/projects';
import type { ProjectWithImages } from '@/types/database';

// Revalidate every 60 seconds
export const revalidate = 60;

interface ProjectPageProps {
  params: Promise<{
    slug: string;
  }>;
}

/**
 * Generate static params for demo projects
 * Database projects are rendered on-demand with ISR
 */
export function generateStaticParams(): { slug: string }[] {
  return projectsData.map((project) => ({ slug: project.slug }));
}

/**
 * Generate metadata for each project
 */
export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  
  // Try database first
  const dbProject = await getProjectBySlug(slug);
  if (dbProject) {
    const coverImage = dbProject.images.find((img) => img.is_cover);
    const imageUrl = coverImage
      ? getProjectImageUrl(coverImage.storage_path, process.env.NEXT_PUBLIC_SUPABASE_URL!)
      : `${siteConfig.url}/og-image.jpg`;

    return {
      title: dbProject.meta_title ?? `${dbProject.title} - WebCraft Portfolio`,
      description: dbProject.meta_description ?? dbProject.short_description,
      openGraph: {
        title: dbProject.meta_title ?? `${dbProject.title} - WebCraft Portfolio`,
        description: dbProject.meta_description ?? dbProject.short_description,
        url: `${siteConfig.url}/work/${slug}`,
        type: 'article',
        images: [{ url: imageUrl, width: 1200, height: 675, alt: `${dbProject.title} project showcase` }],
      },
    };
  }
  
  // Fall back to static project
  const staticProject = getStaticProject(slug);
  if (staticProject) {
    return {
      title: `${staticProject.title} - WebCraft Portfolio`,
      description: staticProject.shortDescription,
      openGraph: {
        title: `${staticProject.title} - WebCraft Portfolio`,
        description: staticProject.shortDescription,
        url: `${siteConfig.url}/work/${slug}`,
        type: 'article',
        images: [{ url: staticProject.featuredImage, width: 1200, height: 675, alt: `${staticProject.title} project showcase` }],
      },
    };
  }

  return { title: 'Project Not Found - WebCraft' };
}

/**
 * Generate structured data
 */
function generateProjectSchema(project: ProjectWithImages | ProjectData, isDb: boolean) {
  if (isDb) {
    const p = project as ProjectWithImages;
    const coverImage = p.images.find((img) => img.is_cover);
    const imageUrl = coverImage
      ? getProjectImageUrl(coverImage.storage_path, process.env.NEXT_PUBLIC_SUPABASE_URL!)
      : `${siteConfig.url}/og-image.jpg`;

    return {
      '@context': 'https://schema.org',
      '@type': 'CreativeWork',
      name: p.title,
      description: p.short_description,
      author: { '@type': 'Organization', name: siteConfig.name, url: siteConfig.url },
      url: `${siteConfig.url}/work/${p.slug}`,
      image: imageUrl,
      datePublished: p.published_at ?? p.created_at,
      genre: p.category,
      keywords: (p.tech_stack as string[])?.join(', '),
    };
  }
  
  const p = project as ProjectData;
  return {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: p.title,
    description: p.shortDescription,
    author: { '@type': 'Organization', name: siteConfig.name, url: siteConfig.url },
    url: `${siteConfig.url}/work/${p.slug}`,
    image: `${siteConfig.url}${p.featuredImage}`,
    datePublished: new Date().toISOString(),
    genre: p.type,
    keywords: p.techStack?.join(', '),
  };
}

export default async function ProjectPage({
  params,
}: ProjectPageProps): Promise<React.ReactElement> {
  const { slug } = await params;
  
  // Try database first
  const dbProject = await getProjectBySlug(slug);
  if (dbProject) {
    return (
      <>
        <JsonLd data={generateProjectSchema(dbProject, true)} />
        <ProjectDetail project={dbProject} />
      </>
    );
  }
  
  // Fall back to static project
  const staticProject = getStaticProject(slug);
  if (staticProject) {
    return (
      <>
        <JsonLd data={generateProjectSchema(staticProject, false)} />
        <ProjectDetail project={staticProject} />
      </>
    );
  }

  notFound();
}
