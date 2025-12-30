/**
 * Portfolio Grid Component
 * Displays project cards in a responsive grid
 *
 * Server Component - no client JS needed
 */

import { Container, Section } from '@/components/layout';
import { Text } from '@/components/ui';

import { ProjectCard } from './project-card';
import { projectsData } from './projects-data';

export function PortfolioGrid(): React.ReactElement {
  return (
    <Section size="lg" background="primary" aria-labelledby="work-heading">
      <Container>
        {/* Page header */}
        <div className="mx-auto mb-12 max-w-3xl text-center sm:mb-16">
          <h1
            id="work-heading"
            className="text-foreground mb-6 text-4xl font-bold tracking-tight sm:text-5xl"
          >
            Our Work
          </h1>
          <Text variant="secondary" size="lg" className="text-pretty">
            A selection of projects that demonstrate our approach to solving
            real business problems. Each project represents a partnership built
            on clear communication and quality delivery.
          </Text>
        </div>

        {/* Projects grid */}
        <ul className="grid list-none gap-8 sm:grid-cols-2 lg:grid-cols-2">
          {projectsData.map((project) => (
            <li key={project.slug}>
              <ProjectCard
                slug={project.slug}
                title={project.title}
                shortDescription={project.shortDescription}
                type={project.type}
                thumbnail={project.thumbnail}
              />
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
