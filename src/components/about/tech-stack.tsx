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
 * SVG Icons for technologies
 */
const icons = {
  // Frontend
  react: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="h-4 w-4"
    >
      <circle cx="12" cy="12" r="2" />
      <ellipse cx="12" cy="12" rx="10" ry="4" />
      <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(60 12 12)" />
      <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(120 12 12)" />
    </svg>
  ),
  nextjs: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
      <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm-1.5 14.5v-9l7 9h-2.5l-4.5-5.77V16.5h-2v-9h2v9h0z" />
    </svg>
  ),
  typescript: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="h-4 w-4"
    >
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M12 8v8" />
      <path d="M9 8h6" />
      <path d="M15 12h2a2 2 0 1 1 0 4h-2v-4z" />
    </svg>
  ),
  tailwind: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
      <path d="M12 6c-2.67 0-4.33 1.33-5 4 1-1.33 2.17-1.83 3.5-1.5.76.19 1.31.74 1.91 1.35.98 1 2.09 2.15 4.59 2.15 2.67 0 4.33-1.33 5-4-1 1.33-2.17 1.83-3.5 1.5-.76-.19-1.3-.74-1.91-1.35C15.61 7.15 14.5 6 12 6zm-5 6c-2.67 0-4.33 1.33-5 4 1-1.33 2.17-1.83 3.5-1.5.76.19 1.3.74 1.91 1.35.98 1 2.09 2.15 4.59 2.15 2.67 0 4.33-1.33 5-4-1 1.33-2.17 1.83-3.5 1.5-.76-.19-1.3-.74-1.91-1.35C11.61 13.15 10.5 12 7 12z" />
    </svg>
  ),
  // Backend
  nodejs: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="h-4 w-4"
    >
      <path d="M12 2L2 7l10 5 10-5-10-5z" />
      <path d="M2 17l10 5 10-5" />
      <path d="M2 12l10 5 10-5" />
    </svg>
  ),
  python: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="h-4 w-4"
    >
      <path d="M12 2c-1.7 0-3 .8-3 2v3c0 1.1.9 2 2 2h2c1.1 0 2 .9 2 2v3c0 1.2-1.3 2-3 2" />
      <path d="M12 22c1.7 0 3-.8 3-2v-3c0-1.1-.9-2-2-2h-2c-1.1 0-2-.9-2-2v-3c0-1.2 1.3-2 3-2" />
      <circle cx="9" cy="5" r="1" />
      <circle cx="15" cy="19" r="1" />
    </svg>
  ),
  database: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="h-4 w-4"
    >
      <ellipse cx="12" cy="5" rx="9" ry="3" />
      <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
      <path d="M3 12c0 1.66 4 3 9 3s9-1.34 9-3" />
    </svg>
  ),
  server: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="h-4 w-4"
    >
      <rect x="2" y="2" width="20" height="8" rx="2" />
      <rect x="2" y="14" width="20" height="8" rx="2" />
      <circle cx="6" cy="6" r="1" />
      <circle cx="6" cy="18" r="1" />
    </svg>
  ),
  // Cloud & DevOps
  cloud: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="h-4 w-4"
    >
      <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" />
    </svg>
  ),
  triangle: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
      <path d="M12 2L2 19h20L12 2z" />
    </svg>
  ),
  container: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="h-4 w-4"
    >
      <path d="M22 12.5V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v12c0 1.1.9 2 2 2h7.5" />
      <path d="M18 14v8" />
      <path d="M22 18h-8" />
      <path d="M6 8h.01" />
      <path d="M10 8h.01" />
    </svg>
  ),
  gitBranch: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="h-4 w-4"
    >
      <circle cx="18" cy="18" r="3" />
      <circle cx="6" cy="6" r="3" />
      <path d="M6 9v12" />
      <path d="M18 9a9 9 0 0 0-9 9" />
    </svg>
  ),
  // Tools & Design
  figma: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="h-4 w-4"
    >
      <path d="M5 5.5A3.5 3.5 0 0 1 8.5 2H12v7H8.5A3.5 3.5 0 0 1 5 5.5z" />
      <path d="M12 2h3.5a3.5 3.5 0 1 1 0 7H12V2z" />
      <path d="M12 12.5a3.5 3.5 0 1 1 7 0 3.5 3.5 0 1 1-7 0z" />
      <path d="M5 19.5A3.5 3.5 0 0 1 8.5 16H12v3.5a3.5 3.5 0 1 1-7 0z" />
      <path d="M5 12.5A3.5 3.5 0 0 1 8.5 9H12v7H8.5A3.5 3.5 0 0 1 5 12.5z" />
    </svg>
  ),
  git: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="h-4 w-4"
    >
      <circle cx="12" cy="12" r="3" />
      <path d="M12 3v6" />
      <path d="M12 15v6" />
    </svg>
  ),
  code: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="h-4 w-4"
    >
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  ),
  fileText: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="h-4 w-4"
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  ),
};

/**
 * Technology categories and items
 */
const techCategories = [
  {
    name: 'Frontend',
    description: 'Modern, performant user interfaces',
    technologies: [
      { name: 'React', icon: icons.react },
      { name: 'Next.js', icon: icons.nextjs },
      { name: 'TypeScript', icon: icons.typescript },
      { name: 'Tailwind CSS', icon: icons.tailwind },
    ],
  },
  {
    name: 'Backend',
    description: 'Scalable server-side solutions',
    technologies: [
      { name: 'Node.js', icon: icons.nodejs },
      { name: 'Python', icon: icons.python },
      { name: 'PostgreSQL', icon: icons.database },
      { name: 'Redis', icon: icons.server },
    ],
  },
  {
    name: 'Cloud & DevOps',
    description: 'Reliable infrastructure',
    technologies: [
      { name: 'AWS', icon: icons.cloud },
      { name: 'Vercel', icon: icons.triangle },
      { name: 'Docker', icon: icons.container },
      { name: 'GitHub Actions', icon: icons.gitBranch },
    ],
  },
  {
    name: 'Tools & Design',
    description: 'Efficient workflows',
    technologies: [
      { name: 'Figma', icon: icons.figma },
      { name: 'Git', icon: icons.git },
      { name: 'VS Code', icon: icons.code },
      { name: 'Notion', icon: icons.fileText },
    ],
  },
];

interface TechCategoryProps {
  name: string;
  description: string;
  technologies: Array<{ name: string; icon: React.ReactNode }>;
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
            className="bg-background-secondary border-border hover:border-primary-200 hover:bg-primary-50 inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm transition-all duration-200"
          >
            <span className="text-primary-600" aria-hidden="true">
              {tech.icon}
            </span>
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
