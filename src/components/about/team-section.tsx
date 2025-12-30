/**
 * Team Section Component
 * Showcases team members to humanize the brand
 *
 * Server Component - no client JS needed
 * Builds trust through transparency
 */

import { Container, Section } from '@/components/layout';
import { Heading, Text } from '@/components/ui';
import { cn } from '@/lib/utils';

/**
 * Team member data
 */
const teamMembers = [
  {
    name: 'Alex Chen',
    role: 'Founder & Lead Developer',
    bio: 'Full-stack developer with 8+ years of experience building scalable web applications.',
    initials: 'AC',
    gradient: 'from-blue-500 to-purple-500',
    social: {
      linkedin: '#',
      github: '#',
    },
  },
  {
    name: 'Sarah Miller',
    role: 'UI/UX Designer',
    bio: 'Creating intuitive interfaces that users love. Passionate about accessibility and clean design.',
    initials: 'SM',
    gradient: 'from-pink-500 to-rose-500',
    social: {
      linkedin: '#',
      dribbble: '#',
    },
  },
  {
    name: 'James Wilson',
    role: 'Frontend Developer',
    bio: 'React specialist focused on performance optimization and modern web technologies.',
    initials: 'JW',
    gradient: 'from-green-500 to-emerald-500',
    social: {
      linkedin: '#',
      github: '#',
    },
  },
  {
    name: 'Emily Davis',
    role: 'Project Manager',
    bio: 'Keeping projects on track and clients happy. Expert in agile methodologies.',
    initials: 'ED',
    gradient: 'from-orange-500 to-amber-500',
    social: {
      linkedin: '#',
    },
  },
];

interface TeamMemberCardProps {
  name: string;
  role: string;
  bio: string;
  initials: string;
  gradient: string;
  index: number;
}

function TeamMemberCard({
  name,
  role,
  bio,
  initials,
  gradient,
  index,
}: TeamMemberCardProps): React.ReactElement {
  return (
    <div
      className={cn(
        'motion-slide-up group relative overflow-hidden rounded-2xl',
        'bg-background border-border border',
        'transition-all duration-300',
        'hover:border-primary-200 hover:-translate-y-1 hover:shadow-xl'
      )}
      style={
        {
          '--motion-delay': `${0.1 + index * 0.1}s`,
          '--motion-duration': '0.5s',
        } as React.CSSProperties
      }
    >
      {/* Avatar placeholder with gradient */}
      <div
        className={cn(
          'relative flex aspect-square items-center justify-center bg-gradient-to-br',
          gradient
        )}
      >
        {/* Initials */}
        <span className="text-4xl font-bold text-white/90">{initials}</span>

        {/* Hover overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors duration-300 group-hover:bg-black/20" />
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-foreground group-hover:text-primary-700 mb-1 text-lg font-semibold transition-colors duration-200">
          {name}
        </h3>

        <p className="text-primary-600 mb-3 text-sm font-medium">{role}</p>

        <Text variant="secondary" className="text-sm leading-relaxed">
          {bio}
        </Text>
      </div>
    </div>
  );
}

export function TeamSection(): React.ReactElement {
  return (
    <Section size="lg" background="secondary" aria-labelledby="team-heading">
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
            <Heading level={2} id="team-heading" className="mb-4">
              Meet the Team
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
              The people behind WebCraft. We&apos;re a small team that cares
              deeply about the work we do.
            </Text>
          </div>
        </div>

        {/* Team grid */}
        <div className="mx-auto grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {teamMembers.map((member, index) => (
            <TeamMemberCard
              key={member.name}
              name={member.name}
              role={member.role}
              bio={member.bio}
              initials={member.initials}
              gradient={member.gradient}
              index={index}
            />
          ))}
        </div>
      </Container>
    </Section>
  );
}
