/**
 * Tech Stack Section
 * Animated showcase of technologies we work with
 * 
 * Server Component - no client JS needed
 * Uses CSS-only animation for infinite scroll
 * Respects reduced motion preferences
 */

import { Container, Section } from '@/components/layout';

/**
 * Tech stack data with brand colors
 * Using simpler SVG paths for better performance
 */
const techStacks = [
  { name: 'React', color: '#61DAFB' },
  { name: 'Next.js', color: '#000000' },
  { name: 'TypeScript', color: '#3178C6' },
  { name: 'Tailwind', color: '#06B6D4' },
  { name: 'Node.js', color: '#339933' },
  { name: 'PostgreSQL', color: '#4169E1' },
  { name: 'Supabase', color: '#3FCF8E' },
  { name: 'MongoDB', color: '#47A248' },
  { name: 'Vercel', color: '#000000' },
  { name: 'Figma', color: '#F24E1E' },
  { name: 'AWS', color: '#FF9900' },
];

/**
 * Single tech badge - lightweight text-based design
 */
function TechBadge({ name, color }: { name: string; color: string }): React.ReactElement {
  return (
    <div
      className="flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-4 py-2 shadow-sm"
      title={name}
    >
      <span
        className="h-3 w-3 rounded-full"
        style={{ backgroundColor: color }}
        aria-hidden="true"
      />
      <span className="text-sm font-medium text-neutral-700 whitespace-nowrap">
        {name}
      </span>
    </div>
  );
}

export function TechStack(): React.ReactElement {
  // Duplicate for seamless loop
  const allTechs = [...techStacks, ...techStacks];

  return (
    <Section size="sm" background="secondary" aria-label="Technologies we use">
      <Container>
        {/* Header */}
        <div className="mb-6 text-center">
          <h2 className="sr-only">Technologies We Work With</h2>
          <p className="text-sm font-medium uppercase tracking-wider text-neutral-500">
            Built with Modern Technologies
          </p>
        </div>

        {/* Infinite scroll container */}
        <div className="relative overflow-hidden">
          {/* Gradient masks */}
          <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-24 bg-linear-to-r from-neutral-50 to-transparent" />
          <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-24 bg-linear-to-l from-neutral-50 to-transparent" />

          {/* Scrolling track - CSS animation only */}
          <div
            className="flex gap-4 animate-scroll motion-reduce:animate-none motion-reduce:justify-center motion-reduce:flex-wrap"
            style={{ width: 'max-content' }}
          >
            {allTechs.map((tech, index) => (
              <TechBadge
                key={`${tech.name}-${index}`}
                name={tech.name}
                color={tech.color}
              />
            ))}
          </div>
        </div>
      </Container>
    </Section>
  );
}
