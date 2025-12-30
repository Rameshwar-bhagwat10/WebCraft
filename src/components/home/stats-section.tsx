/**
 * Stats Section Component
 * Displays key metrics for quick credibility boost
 *
 * Server Component - no client JS needed
 * Honest, verifiable numbers only
 */

import { Container, Section } from '@/components/layout';
import { cn } from '@/lib/utils';

/**
 * Stats data - keep numbers honest and verifiable
 */
const stats = [
  {
    value: '50+',
    label: 'Projects Delivered',
    description: 'Successful launches',
  },
  {
    value: '98%',
    label: 'Client Satisfaction',
    description: 'Happy customers',
  },
  {
    value: '5+',
    label: 'Years Experience',
    description: 'In the industry',
  },
  {
    value: '24h',
    label: 'Response Time',
    description: 'Average reply',
  },
];

interface StatItemProps {
  value: string;
  label: string;
  description: string;
  index: number;
}

function StatItem({
  value,
  label,
  description,
  index,
}: StatItemProps): React.ReactElement {
  return (
    <div
      className="motion-slide-up group relative text-center"
      style={
        {
          '--motion-delay': `${index * 0.1}s`,
          '--motion-duration': '0.5s',
        } as React.CSSProperties
      }
    >
      {/* Value */}
      <div
        className={cn(
          'text-primary-600 mb-2 text-4xl font-bold tracking-tight sm:text-5xl',
          'transition-transform duration-300 group-hover:scale-105'
        )}
      >
        {value}
      </div>

      {/* Label */}
      <div className="text-foreground mb-1 font-semibold">{label}</div>

      {/* Description */}
      <div className="text-foreground-muted text-sm">{description}</div>
    </div>
  );
}

export function StatsSection(): React.ReactElement {
  return (
    <Section size="md" background="secondary" aria-label="Company statistics">
      <Container>
        {/* Visually hidden heading for accessibility */}
        <h2 className="sr-only">Our Track Record</h2>

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-8 sm:gap-12 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <StatItem
              key={stat.label}
              value={stat.value}
              label={stat.label}
              description={stat.description}
              index={index}
            />
          ))}
        </div>
      </Container>
    </Section>
  );
}
