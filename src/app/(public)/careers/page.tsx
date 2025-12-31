/**
 * Careers Page
 * Job listings and company culture
 *
 * Server Component - renders statically (SSG)
 */

import type { Metadata } from 'next';
import Link from 'next/link';

import { Container, Section } from '@/components/layout';
import { JsonLd } from '@/components/shared';
import { Button, Heading, Text } from '@/components/ui';
import { generatePageMetadata, generateWebPageSchema } from '@/lib/seo';
import { cn } from '@/lib/utils';

export const metadata: Metadata = generatePageMetadata({
  title: 'Careers - WebCraft',
  description:
    "Join our team at WebCraft. Explore open positions and discover what it's like to work with us.",
  pathname: '/careers',
});

/**
 * Company values
 */
const values = [
  {
    icon: (
      <svg
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M13 10V3L4 14h7v7l9-11h-7z"
        />
      </svg>
    ),
    title: 'Innovation First',
    description: 'We embrace new technologies and creative solutions.',
  },
  {
    icon: (
      <svg
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
        />
      </svg>
    ),
    title: 'Team Collaboration',
    description: 'We work together to achieve exceptional results.',
  },
  {
    icon: (
      <svg
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
        />
      </svg>
    ),
    title: 'Continuous Learning',
    description: 'We invest in growth and professional development.',
  },
  {
    icon: (
      <svg
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
    title: 'Work-Life Balance',
    description: 'Flexible schedules and remote-friendly culture.',
  },
];

/**
 * Benefits
 */
const benefits = [
  'Competitive salary & equity',
  'Health, dental & vision insurance',
  'Unlimited PTO policy',
  'Remote-first workplace',
  'Learning & development budget',
  'Latest equipment provided',
  'Team retreats & events',
  'Parental leave',
];

/**
 * Open positions
 */
const positions = [
  {
    title: 'Senior Frontend Developer',
    department: 'Engineering',
    location: 'Remote',
    type: 'Full-time',
  },
  {
    title: 'UI/UX Designer',
    department: 'Design',
    location: 'Remote',
    type: 'Full-time',
  },
  {
    title: 'Project Manager',
    department: 'Operations',
    location: 'San Francisco, CA',
    type: 'Full-time',
  },
];

export default function CareersPage(): React.ReactElement {
  const pageSchema = generateWebPageSchema({
    title: 'Careers - WebCraft',
    description: 'Join our team at WebCraft.',
    pathname: '/careers',
  });

  return (
    <>
      <JsonLd data={pageSchema} />

      {/* Hero */}
      <Section
        size="lg"
        background="primary"
        aria-labelledby="careers-heading"
        className="relative overflow-hidden"
      >
        <div className="absolute inset-0 -z-10" aria-hidden="true">
          <div className="motion-float motion-pulse-glow bg-primary-100 absolute -top-1/2 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full opacity-50 blur-3xl" />
        </div>
        <Container size="md">
          <div className="mx-auto max-w-2xl pt-8 text-center sm:pt-12">
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
                Careers
              </p>
            </div>
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
                id="careers-heading"
                className="text-foreground mb-6 text-4xl font-bold tracking-tight text-balance sm:text-5xl"
              >
                Join Our <span className="text-primary-600">Growing Team</span>
              </h1>
            </div>
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
                className="mx-auto max-w-xl text-pretty sm:text-xl"
              >
                We&apos;re looking for talented individuals who are passionate
                about creating exceptional digital experiences.
              </Text>
            </div>
          </div>
        </Container>
      </Section>

      {/* Values */}
      <Section
        size="lg"
        background="secondary"
        aria-labelledby="values-heading"
      >
        <Container>
          <div
            className="motion-slide-up mb-12 text-center"
            style={
              {
                '--motion-delay': '0s',
                '--motion-duration': '0.5s',
              } as React.CSSProperties
            }
          >
            <Heading level={2} id="values-heading" className="mb-4">
              Why Work With Us
            </Heading>
            <Text variant="secondary" className="mx-auto max-w-2xl">
              Our culture is built on these core principles
            </Text>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value, index) => (
              <div
                key={value.title}
                className={cn(
                  'motion-slide-up border-border bg-background hover:border-primary-200 rounded-xl border p-6 transition-all duration-200 hover:shadow-md'
                )}
                style={
                  {
                    '--motion-delay': `${0.1 + index * 0.05}s`,
                    '--motion-duration': '0.4s',
                  } as React.CSSProperties
                }
              >
                <div className="bg-primary-100 text-primary-600 mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg">
                  {value.icon}
                </div>
                <h3 className="text-foreground mb-2 font-semibold">
                  {value.title}
                </h3>
                <p className="text-foreground-secondary text-sm">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* Benefits */}
      <Section
        size="lg"
        background="primary"
        aria-labelledby="benefits-heading"
      >
        <Container size="md">
          <div
            className="motion-slide-up mb-10 text-center"
            style={
              {
                '--motion-delay': '0s',
                '--motion-duration': '0.5s',
              } as React.CSSProperties
            }
          >
            <Heading level={2} id="benefits-heading" className="mb-4">
              Benefits & Perks
            </Heading>
            <Text variant="secondary">We take care of our team</Text>
          </div>
          <div
            className="motion-slide-up grid gap-3 sm:grid-cols-2"
            style={
              {
                '--motion-delay': '0.1s',
                '--motion-duration': '0.5s',
              } as React.CSSProperties
            }
          >
            {benefits.map((benefit) => (
              <div
                key={benefit}
                className="bg-primary-50 flex items-center gap-3 rounded-lg p-4"
              >
                <span className="bg-primary-100 text-primary-600 flex h-8 w-8 shrink-0 items-center justify-center rounded-full">
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={3}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </span>
                <span className="text-foreground font-medium">{benefit}</span>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* Open Positions */}
      <Section
        size="lg"
        background="secondary"
        aria-labelledby="positions-heading"
      >
        <Container size="md">
          <div
            className="motion-slide-up mb-10 text-center"
            style={
              {
                '--motion-delay': '0s',
                '--motion-duration': '0.5s',
              } as React.CSSProperties
            }
          >
            <Heading level={2} id="positions-heading" className="mb-4">
              Open Positions
            </Heading>
            <Text variant="secondary">Find your next opportunity</Text>
          </div>
          <div className="space-y-4">
            {positions.map((position, index) => (
              <div
                key={position.title}
                className={cn(
                  'motion-slide-up border-border bg-background group hover:border-primary-200 flex flex-col gap-4 rounded-xl border p-6 transition-all duration-200 hover:shadow-md sm:flex-row sm:items-center sm:justify-between'
                )}
                style={
                  {
                    '--motion-delay': `${0.1 + index * 0.05}s`,
                    '--motion-duration': '0.4s',
                  } as React.CSSProperties
                }
              >
                <div>
                  <h3 className="text-foreground group-hover:text-primary-600 font-semibold transition-colors">
                    {position.title}
                  </h3>
                  <div className="text-foreground-secondary mt-1 flex flex-wrap gap-3 text-sm">
                    <span>{position.department}</span>
                    <span>•</span>
                    <span>{position.location}</span>
                    <span>•</span>
                    <span>{position.type}</span>
                  </div>
                </div>
                <Button asChild variant="outline" size="sm">
                  <Link href="/contact">Apply Now</Link>
                </Button>
              </div>
            ))}
          </div>
          <div
            className="motion-slide-up mt-8 text-center"
            style={
              {
                '--motion-delay': '0.3s',
                '--motion-duration': '0.5s',
              } as React.CSSProperties
            }
          >
            <Text variant="muted" size="sm">
              Don&apos;t see a role that fits?{' '}
              <Link
                href="/contact"
                className="text-primary-600 hover:underline"
              >
                Send us your resume
              </Link>
            </Text>
          </div>
        </Container>
      </Section>
    </>
  );
}
