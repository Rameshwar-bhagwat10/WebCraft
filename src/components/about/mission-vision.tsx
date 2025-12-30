/**
 * Mission & Vision Section
 * Shows long-term intent and seriousness
 *
 * Server Component - no client JS needed
 * Enhanced with animations and visual polish
 */

import { Container, Section } from '@/components/layout';
import { Heading, Text } from '@/components/ui';
import { cn } from '@/lib/utils';

interface MissionCardProps {
  type: 'mission' | 'vision';
  title: string;
  description: string;
  icon: React.ReactNode;
  index: number;
}

function MissionCard({
  type,
  title,
  description,
  icon,
  index,
}: MissionCardProps): React.ReactElement {
  return (
    <div
      className={cn(
        'motion-slide-up group relative rounded-2xl p-8',
        'bg-background border-border border',
        'transition-all duration-300',
        'hover:border-primary-200 hover:-translate-y-1 hover:shadow-xl'
      )}
      style={
        {
          '--motion-delay': `${0.2 + index * 0.15}s`,
          '--motion-duration': '0.5s',
        } as React.CSSProperties
      }
    >
      {/* Top accent gradient */}
      <div
        className={cn(
          'absolute inset-x-0 top-0 h-1 rounded-t-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100',
          type === 'mission'
            ? 'from-primary-400 via-primary-500 to-primary-400 bg-gradient-to-r'
            : 'from-primary-500 via-primary-600 to-primary-500 bg-gradient-to-r'
        )}
        aria-hidden="true"
      />

      {/* Icon */}
      <div
        className="bg-primary-50 text-primary-600 group-hover:bg-primary-100 mb-6 inline-flex h-14 w-14 items-center justify-center rounded-xl transition-all duration-300 group-hover:scale-110"
        aria-hidden="true"
      >
        {icon}
      </div>

      {/* Label */}
      <p className="text-primary-600 mb-2 text-sm font-semibold tracking-wider uppercase">
        {title}
      </p>

      {/* Description */}
      <Text variant="body" size="lg" className="leading-relaxed">
        {description}
      </Text>
    </div>
  );
}

export function MissionVision(): React.ReactElement {
  return (
    <Section
      size="lg"
      background="secondary"
      aria-labelledby="mission-vision-heading"
    >
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
            <Heading level={2} id="mission-vision-heading" className="mb-4">
              Mission & Vision
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
              The purpose that drives us and the future we&apos;re building
              toward.
            </Text>
          </div>
        </div>

        {/* Mission & Vision cards */}
        <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-2 md:gap-8">
          <MissionCard
            type="mission"
            title="Our Mission"
            description="To help businesses succeed online by building fast, reliable, and user-friendly digital products that solve real problems and drive measurable results."
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-7 w-7"
              >
                <circle cx="12" cy="12" r="10" />
                <circle cx="12" cy="12" r="6" />
                <circle cx="12" cy="12" r="2" />
              </svg>
            }
            index={0}
          />

          <MissionCard
            type="vision"
            title="Our Vision"
            description="To be the trusted partner for businesses that want quality over shortcuts, building long-term relationships through honest work and exceptional results."
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-7 w-7"
              >
                <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            }
            index={1}
          />
        </div>
      </Container>
    </Section>
  );
}
