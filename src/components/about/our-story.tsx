/**
 * Our Story / Timeline Section
 * Company journey and milestones
 *
 * Server Component - no client JS needed
 * Shows experience and growth
 */

import { Container, Section } from '@/components/layout';
import { Heading, Text } from '@/components/ui';
import { cn } from '@/lib/utils';

/**
 * Timeline milestones - Journey from learning to founding WebCraft
 */
const milestones = [
  {
    year: '2021',
    title: 'Started Learning',
    description:
      'Began the journey into web development, learning HTML, CSS, JavaScript and modern frameworks.',
  },
  {
    year: '2022',
    title: 'First Projects',
    description:
      'Built first personal projects and started exploring React, Next.js, and backend technologies.',
  },
  {
    year: '2023',
    title: 'Skill Development',
    description:
      'Expanded expertise to include full-stack development, databases, and cloud deployment.',
  },
  {
    year: '2024',
    title: 'Freelance Work',
    description:
      'Started taking freelance projects, helping small businesses establish their online presence.',
  },
  {
    year: '2025',
    title: 'WebCraft Founded',
    description:
      'Officially launched WebCraft to provide professional web development services and help businesses grow online.',
  },
];

interface TimelineItemProps {
  year: string;
  title: string;
  description: string;
  index: number;
  isLast: boolean;
}

function TimelineItem({
  year,
  title,
  description,
  index,
  isLast,
}: TimelineItemProps): React.ReactElement {
  const isEven = index % 2 === 0;

  return (
    <div
      className={cn(
        'motion-slide-up relative',
        'md:flex md:items-center',
        isEven ? 'md:flex-row' : 'md:flex-row-reverse'
      )}
      style={
        {
          '--motion-delay': `${0.1 + index * 0.1}s`,
          '--motion-duration': '0.5s',
        } as React.CSSProperties
      }
    >
      {/* Content card */}
      <div
        className={cn(
          'group relative ml-8 rounded-xl p-6 md:ml-0 md:w-[calc(50%-2rem)]',
          'bg-background border-border border',
          'transition-all duration-300',
          'hover:border-primary-200 hover:shadow-lg'
        )}
      >
        {/* Year badge */}
        <span className="bg-primary-100 text-primary-700 mb-3 inline-block rounded-full px-3 py-1 text-sm font-semibold">
          {year}
        </span>

        <h3 className="text-foreground group-hover:text-primary-700 mb-2 text-lg font-semibold transition-colors duration-200">
          {title}
        </h3>

        <Text variant="secondary" className="text-sm leading-relaxed">
          {description}
        </Text>
      </div>

      {/* Center line and dot - visible on md+ */}
      <div
        className="absolute top-0 left-0 flex h-full flex-col items-center md:static md:w-16"
        aria-hidden="true"
      >
        {/* Dot */}
        <div className="bg-primary-500 shadow-primary-200 relative z-10 h-4 w-4 rounded-full shadow-lg">
          <div className="bg-primary-300 absolute inset-0 animate-ping rounded-full opacity-75" />
        </div>

        {/* Line */}
        {!isLast && (
          <div className="bg-border h-full w-0.5 md:h-24" aria-hidden="true" />
        )}
      </div>

      {/* Spacer for alternating layout */}
      <div className="hidden md:block md:w-[calc(50%-2rem)]" />
    </div>
  );
}

export function OurStory(): React.ReactElement {
  return (
    <Section size="lg" background="primary" aria-labelledby="story-heading">
      <Container>
        {/* Section header */}
        <div className="mx-auto mb-12 max-w-2xl text-center sm:mb-16">
          <div
            className="motion-slide-up"
            style={
              {
                '--motion-delay': '0s',
                '--motion-duration': '0.5s',
              } as React.CSSProperties
            }
          >
            <Heading level={2} id="story-heading" className="mb-4">
              Our Journey
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
            <Text variant="secondary" size="lg">
              From personal projects to building platforms — here&apos;s our
              story so far.
            </Text>
          </div>
        </div>

        {/* Timeline */}
        <div className="mx-auto max-w-4xl space-y-6 md:space-y-0">
          {milestones.map((milestone, index) => (
            <TimelineItem
              key={milestone.year}
              year={milestone.year}
              title={milestone.title}
              description={milestone.description}
              index={index}
              isLast={index === milestones.length - 1}
            />
          ))}
        </div>
      </Container>
    </Section>
  );
}
