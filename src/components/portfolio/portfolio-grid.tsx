/**
 * Portfolio Grid Component
 * Enhanced hero with project cards in a responsive grid
 *
 * Server Component for header, Client Component for filters
 * Supports both database and static data
 */

import { Container, Section } from '@/components/layout';
import { Text } from '@/components/ui';
import type { ProjectListItem } from '@/types/database';

import { PortfolioFilters } from './portfolio-filters';
import { projectsData } from './projects-data';

interface PortfolioGridProps {
  /** Projects from database (optional, falls back to static data) */
  projects?: ProjectListItem[] | undefined;
}

export function PortfolioGrid({ projects }: PortfolioGridProps): React.ReactElement {
  // Use database projects if provided, otherwise use static data
  const useDbProjects = projects && projects.length > 0;
  
  // Calculate stats
  const projectCount = useDbProjects ? projects.length : projectsData.length;
  const industries = useDbProjects 
    ? new Set(projects.map((p) => p.category)).size
    : new Set(projectsData.map((p) => p.type)).size;

  return (
    <Section
      size="lg"
      background="primary"
      aria-labelledby="work-heading"
      className="relative overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10" aria-hidden="true">
        <div className="motion-float motion-pulse-glow bg-primary-100 absolute -top-1/2 left-1/2 h-[800px] w-[800px] -translate-x-1/2 rounded-full opacity-60 blur-3xl" />
        <div
          className="motion-float bg-primary-50 absolute -right-1/4 -bottom-1/4 h-[500px] w-[500px] rounded-full opacity-50 blur-3xl"
          style={{ animationDelay: '-10s' }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8882_1px,transparent_1px),linear-gradient(to_bottom,#8882_1px,transparent_1px)] mask-[radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)] bg-size-[4rem_4rem]" />
      </div>

      <Container>
        {/* Page header */}
        <div className="mx-auto mb-12 max-w-3xl pt-8 text-center sm:mb-16 sm:pt-12">
          {/* Eyebrow */}
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
              Our Portfolio
            </p>
          </div>

          {/* H1 */}
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
              id="work-heading"
              className="text-foreground mb-6 text-4xl font-bold tracking-tight text-balance sm:text-5xl lg:text-6xl"
            >
              Projects That{' '}
              <span className="text-primary-600 relative">
                Deliver Results
                <span
                  className="bg-primary-200 absolute -bottom-1 left-0 h-1 w-full rounded-full opacity-60"
                  aria-hidden="true"
                />
              </span>
            </h1>
          </div>

          {/* Description */}
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
              className="mx-auto max-w-2xl text-pretty sm:text-xl"
            >
              A selection of projects that demonstrate our approach to solving
              real business problems. Each project represents a partnership
              built on clear communication and quality delivery.
            </Text>
          </div>

          {/* Quick stats */}
          <div
            className="motion-slide-up mt-10 flex flex-wrap items-center justify-center gap-8"
            style={
              {
                '--motion-delay': '0.3s',
                '--motion-duration': '0.5s',
              } as React.CSSProperties
            }
          >
            {[
              { value: `${projectCount}`, label: 'Case Studies' },
              { value: `${industries}`, label: 'Project Types' },
              { value: '100%', label: 'Client Satisfaction' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-primary-600 text-2xl font-bold sm:text-3xl">
                  {stat.value}
                </div>
                <div className="text-foreground-muted text-sm">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Projects grid with filters */}
        <PortfolioFilters
          dbProjects={useDbProjects ? projects : undefined}
          staticProjects={useDbProjects ? undefined : projectsData}
        />
      </Container>
    </Section>
  );
}
