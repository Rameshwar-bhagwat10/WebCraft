/**
 * Services Overview Section
 * Enhanced hero with H1 and service cards grid
 *
 * Server Component - no client JS needed
 * Premium styling with animations
 */

import Link from 'next/link';

import { Container, Section } from '@/components/layout';
import { Text } from '@/components/ui';
import { cn } from '@/lib/utils';

import { servicesData } from './services-data';

/**
 * SVG Icons for services
 */
const icons: Record<string, React.ReactNode> = {
  'business-websites': (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-6 w-6"
    >
      <rect x="2" y="3" width="20" height="14" rx="2" />
      <path d="M8 21h8" />
      <path d="M12 17v4" />
    </svg>
  ),
  'web-applications': (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-6 w-6"
    >
      <path d="M18 3a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3H6a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3V6a3 3 0 0 0-3-3 3 3 0 0 0-3 3 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 3 3 0 0 0-3-3z" />
    </svg>
  ),
  'mobile-apps': (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-6 w-6"
    >
      <rect x="5" y="2" width="14" height="20" rx="2" />
      <path d="M12 18h.01" />
    </svg>
  ),
  'ui-dashboards': (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-6 w-6"
    >
      <rect x="3" y="3" width="7" height="9" rx="1" />
      <rect x="14" y="3" width="7" height="5" rx="1" />
      <rect x="14" y="12" width="7" height="9" rx="1" />
      <rect x="3" y="16" width="7" height="5" rx="1" />
    </svg>
  ),
  'maintenance-support': (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-6 w-6"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  ),
};

interface ServiceOverviewCardProps {
  id: string;
  title: string;
  shortDescription: string;
  index: number;
}

function ServiceOverviewCard({
  id,
  title,
  shortDescription,
  index,
}: ServiceOverviewCardProps): React.ReactElement {
  return (
    <Link
      href={`#${id}`}
      className={cn(
        'motion-slide-up group relative block overflow-hidden rounded-xl',
        'bg-background border-border border',
        'transition-all duration-300',
        'hover:border-primary-200 hover:-translate-y-1 hover:shadow-xl'
      )}
      style={
        {
          '--motion-delay': `${0.2 + index * 0.08}s`,
          '--motion-duration': '0.5s',
        } as React.CSSProperties
      }
    >
      {/* Top accent gradient - visible on hover */}
      <div
        className="from-primary-400 via-primary-500 to-primary-400 absolute inset-x-0 top-0 h-1 bg-gradient-to-r opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        aria-hidden="true"
      />

      <div className="p-6">
        {/* Icon */}
        <div
          className="relative mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl transition-all duration-300 group-hover:scale-110"
          aria-hidden="true"
        >
          <div className="bg-primary-50 group-hover:bg-primary-100 absolute inset-0 rounded-xl transition-colors duration-300" />
          <div className="from-primary-100/50 absolute inset-0 rounded-xl bg-gradient-to-br to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          <span className="text-primary-600 relative">{icons[id]}</span>
        </div>

        {/* Title */}
        <h3 className="text-foreground group-hover:text-primary-700 mb-2 text-lg font-semibold transition-colors duration-200">
          {title}
        </h3>

        {/* Description */}
        <p className="text-foreground-secondary mb-4 text-sm leading-relaxed">
          {shortDescription}
        </p>

        {/* Learn more indicator */}
        <span className="text-primary-600 inline-flex items-center text-sm font-medium">
          Learn more
          <svg
            className="ml-1 h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </span>
      </div>
    </Link>
  );
}

export function ServicesOverview(): React.ReactElement {
  return (
    <Section
      size="lg"
      background="primary"
      aria-labelledby="services-heading"
      className="relative overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10" aria-hidden="true">
        <div className="motion-float motion-pulse-glow bg-primary-100 absolute -top-1/2 left-1/2 h-[800px] w-[800px] -translate-x-1/2 rounded-full opacity-60 blur-3xl" />
        <div
          className="motion-float bg-primary-50 absolute -right-1/4 -bottom-1/4 h-[500px] w-[500px] rounded-full opacity-50 blur-3xl"
          style={{ animationDelay: '-10s' }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8882_1px,transparent_1px),linear-gradient(to_bottom,#8882_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)] [background-size:4rem_4rem]" />
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
              What We Offer
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
              id="services-heading"
              className="text-foreground mb-6 text-4xl font-bold tracking-tight text-balance sm:text-5xl lg:text-6xl"
            >
              Services Built for{' '}
              <span className="text-primary-600 relative">
                Results
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
              We offer a focused set of services designed to help your business
              succeed online. Each service is delivered with the same commitment
              to quality, performance, and clear communication.
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
              { value: '5', label: 'Core Services' },
              { value: '50+', label: 'Projects Delivered' },
              { value: '98%', label: 'Client Satisfaction' },
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

        {/* Services grid */}
        <ul className="grid list-none gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {servicesData.map((service, index) => (
            <li key={service.id}>
              <ServiceOverviewCard
                id={service.id}
                title={service.title}
                shortDescription={service.shortDescription}
                index={index}
              />
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
