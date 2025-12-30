/**
 * Tech Stack Section Component
 * Showcases technologies and tools we use
 *
 * Server Component - no client JS needed
 * Demonstrates expertise and modern approach
 */

import { Container, Section } from '@/components/layout';
import { Heading, Text } from '@/components/ui';
import { cn } from '@/lib/utils';

/**
 * Technology categories and items
 */
const techCategories = [
  {
    name: 'Frontend',
    description: 'Modern, performant user interfaces',
    technologies: [
      { name: 'React', icon: '⚛️' },
      { name: 'Next.js', icon: '▲' },
      { name: 'TypeScript', icon: '📘' },
      { name: 'Tailwind CSS', icon: '🎨' },
    ],
  },
  {
    name: 'Backend',
    description: 'Scalable server-side solutions',
    technologies: [
      { name: 'Node.js', icon: '🟢' },
      { name: 'Python', icon: '🐍' },
      { name: 'PostgreSQL', icon: '🐘' },
      { name: 'Redis', icon: '🔴' },
    ],
  },
  {
    name: 'Cloud & DevOps',
    description: 'Reliable infrastructure',
    technologies: [
      { name: 'AWS', icon: '☁️' },
      { name: 'Vercel', icon: '▲' },
      { name: 'Docker', icon: '🐳' },
      { name: 'GitHub Actions', icon: '🔄' },
    ],
  },
  {
    name: 'Tools & Design',
    description: 'Efficient workflows',
    technologies: [
      { name: 'Figma', icon: '🎯' },
      { name: 'Git', icon: '📦' },
      { name: 'VS Code', icon: '💻' },
      { name: 'Notion', icon: '📝' },
    ],
  },
];

interface TechCategoryProps {
  name: string;
  description: string;
  technologies: Array<{ name: string; icon: string }>;
  index: number;
}

function TechCategory({
  name,
  description,
  technologies,
  index,
}: TechCategoryProps): React.ReactElement {
  return (
    <div
      className={cn(
        'motion-slide-up group rounded-2xl p-6',
        'bg-background border-border border',
        'transition-all duration-300',
        'hover:border-primary-200 hover:shadow-lg'
      )}
      style={
        {
          '--motion-delay': `${0.1 + index * 0.1}s`,
          '--motion-duration': '0.5s',
        } as React.CSSProperties
      }
    >
      {/* Category header */}
      <h3 className="text-foreground group-hover:text-primary-700 mb-1 text-lg font-semibold transition-colors duration-200">
        {name}
      </h3>
      <p className="text-foreground-muted mb-4 text-sm">{description}</p>

      {/* Technologies */}
      <div className="flex flex-wrap gap-2">
        {technologies.map((tech) => (
          <span
            key={tech.name}
            className="bg-background-secondary border-border hover:border-primary-200 hover:bg-primary-50 inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm transition-all duration-200"
          >
            <span aria-hidden="true">{tech.icon}</span>
            <span className="text-foreground-secondary">{tech.name}</span>
          </span>
        ))}
      </div>
    </div>
  );
}

export function TechStack(): React.ReactElement {
  return (
    <Section size="lg" background="primary" aria-labelledby="tech-heading">
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
            <Heading level={2} id="tech-heading" className="mb-4">
              Our Tech Stack
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
              We use modern, battle-tested technologies to build fast, reliable,
              and maintainable solutions.
            </Text>
          </div>
        </div>

        {/* Tech categories grid */}
        <div className="mx-auto grid max-w-4xl gap-6 sm:grid-cols-2">
          {techCategories.map((category, index) => (
            <TechCategory
              key={category.name}
              name={category.name}
              description={category.description}
              technologies={category.technologies}
              index={index}
            />
          ))}
        </div>
      </Container>
    </Section>
  );
}
