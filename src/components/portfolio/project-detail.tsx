/**
 * Project Detail Component
 * Full project case study layout
 *
 * Server Component - no client JS needed
 */

import Link from 'next/link';

import { Container, Section } from '@/components/layout';
import { Button, Heading, Text } from '@/components/ui';

import { ProjectImage } from './project-image';
import type { ProjectData } from './projects-data';

interface ProjectDetailProps {
  project: ProjectData;
}

/**
 * Type badge colors
 */
const typeBadgeStyles: Record<string, string> = {
  Website: 'bg-primary-50 text-primary-700',
  'Web App': 'bg-success-50 text-success-700',
  'Mobile App': 'bg-warning-50 text-warning-700',
  Dashboard: 'bg-neutral-100 text-neutral-700',
};

export function ProjectDetail({
  project,
}: ProjectDetailProps): React.ReactElement {
  return (
    <>
      {/* Hero section with featured image */}
      <Section size="lg" background="primary" aria-labelledby="project-heading">
        <Container size="lg">
          <div className="mx-auto max-w-4xl">
            {/* Back link */}
            <Link
              href="/work"
              className="text-foreground-secondary hover:text-foreground mb-8 inline-flex items-center text-sm transition-colors"
            >
              <svg
                className="mr-2 h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Back to all projects
            </Link>

            {/* Type badge */}
            <span
              className={`mb-4 inline-block rounded-full px-3 py-1 text-xs font-medium ${typeBadgeStyles[project.type] || typeBadgeStyles.Website}`}
            >
              {project.type}
            </span>

            {/* Project title (H1) */}
            <h1
              id="project-heading"
              className="text-foreground mb-6 text-4xl font-bold tracking-tight sm:text-5xl"
            >
              {project.title}
            </h1>

            {/* Overview */}
            <Text variant="secondary" size="lg" className="mb-10 max-w-3xl">
              {project.overview}
            </Text>

            {/* Featured image */}
            <div className="relative aspect-[16/9] overflow-hidden rounded-xl bg-neutral-100">
              <ProjectImage
                src={project.featuredImage}
                alt={`${project.title} project showcase`}
              />
            </div>
          </div>
        </Container>
      </Section>

      {/* Problem & Solution */}
      <Section size="lg" background="secondary">
        <Container size="lg">
          <div className="mx-auto grid max-w-4xl gap-12 md:grid-cols-2 md:gap-16">
            {/* Problem */}
            <div>
              <Heading level={2} className="mb-4">
                The Challenge
              </Heading>
              <Text variant="secondary" className="leading-relaxed">
                {project.problem}
              </Text>
            </div>

            {/* Solution */}
            <div>
              <Heading level={2} className="mb-4">
                Our Approach
              </Heading>
              <Text variant="secondary" className="leading-relaxed">
                {project.solution}
              </Text>
            </div>
          </div>
        </Container>
      </Section>

      {/* Features */}
      <Section size="lg" background="primary" aria-labelledby="features-heading">
        <Container size="lg">
          <div className="mx-auto max-w-4xl">
            <Heading level={2} id="features-heading" className="mb-8">
              Key Features
            </Heading>

            <ul className="grid gap-4 sm:grid-cols-2">
              {project.features.map((feature, index) => (
                <li
                  key={index}
                  className="flex items-start gap-3 rounded-lg border border-border bg-background p-4"
                >
                  <svg
                    className="text-primary-500 mt-0.5 h-5 w-5 shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <Text variant="body" className="text-sm">
                    {feature}
                  </Text>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </Section>

      {/* Outcome */}
      <Section
        size="lg"
        background="secondary"
        aria-labelledby="outcome-heading"
      >
        <Container size="lg">
          <div className="mx-auto max-w-4xl">
            <Heading level={2} id="outcome-heading" className="mb-4">
              The Result
            </Heading>
            <div className="rounded-xl border border-primary-200 bg-primary-50 p-6 sm:p-8">
              <Text variant="body" size="lg" className="leading-relaxed">
                {project.outcome}
              </Text>
            </div>

            {/* Tech stack (if available) */}
            {project.techStack && project.techStack.length > 0 && (
              <div className="mt-8">
                <Text variant="muted" size="sm" className="mb-3">
                  Built with
                </Text>
                <div className="flex flex-wrap gap-2">
                  {project.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-700"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Container>
      </Section>

      {/* CTA */}
      <Section size="lg" background="primary" aria-label="Contact us">
        <Container size="md">
          <div className="mx-auto max-w-2xl text-center">
            <Heading level={2} className="mb-4">
              Have a Similar Project?
            </Heading>
            <Text variant="secondary" size="lg" className="mb-8">
              We&apos;d love to hear about your project and discuss how we can
              help bring it to life.
            </Text>

            <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Button asChild size="lg">
                <Link href="/contact">Start a Conversation</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/work">View More Projects</Link>
              </Button>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
