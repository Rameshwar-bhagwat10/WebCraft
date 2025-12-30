/**
 * Trust Indicators Section
 * Subtle, honest indicators of quality and process
 *
 * Server Component - no client JS needed
 * No fake testimonials, logos, or inflated numbers
 */

import { Container, Section } from '@/components/layout';

/**
 * Trust indicator data - process and quality focused
 */
const indicators = [
  {
    label: 'Mobile-First',
    description: 'Responsive on every device',
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-5 w-5"
      >
        <rect x="5" y="2" width="14" height="20" rx="2" />
        <path d="M12 18h.01" />
      </svg>
    ),
  },
  {
    label: 'SEO-Ready',
    description: 'Built to rank',
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-5 w-5"
      >
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.3-4.3" />
      </svg>
    ),
  },
  {
    label: 'Performance Optimized',
    description: 'Fast load times',
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-5 w-5"
      >
        <path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z" />
      </svg>
    ),
  },
  {
    label: 'Modern Tech Stack',
    description: 'Future-proof solutions',
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-5 w-5"
      >
        <path d="m18 16 4-4-4-4" />
        <path d="m6 8-4 4 4 4" />
        <path d="m14.5 4-5 16" />
      </svg>
    ),
  },
  {
    label: 'Accessible',
    description: 'WCAG compliant',
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-5 w-5"
      >
        <circle cx="12" cy="12" r="10" />
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v4" />
        <path d="M12 18v4" />
        <path d="m4.93 4.93 2.83 2.83" />
        <path d="m16.24 16.24 2.83 2.83" />
        <path d="M2 12h4" />
        <path d="M18 12h4" />
        <path d="m4.93 19.07 2.83-2.83" />
        <path d="m16.24 7.76 2.83-2.83" />
      </svg>
    ),
  },
  {
    label: 'Secure',
    description: 'Best practices built-in',
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-5 w-5"
      >
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
      </svg>
    ),
  },
];

function TrustIndicator({
  label,
  description,
  icon,
}: {
  label: string;
  description: string;
  icon: React.ReactNode;
}): React.ReactElement {
  return (
    <div className="flex items-center gap-3">
      <div
        className="text-primary-600 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-50"
        aria-hidden="true"
      >
        {icon}
      </div>
      <div>
        <p className="text-foreground text-sm font-medium">{label}</p>
        <p className="text-foreground-muted text-xs">{description}</p>
      </div>
    </div>
  );
}

export function TrustIndicators(): React.ReactElement {
  return (
    <Section size="md" background="secondary">
      <Container>
        {/* Grid of indicators */}
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-6">
          {indicators.map((indicator) => (
            <TrustIndicator
              key={indicator.label}
              label={indicator.label}
              description={indicator.description}
              icon={indicator.icon}
            />
          ))}
        </div>
      </Container>
    </Section>
  );
}
