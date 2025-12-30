/**
 * Contact Form Section
 * Two-column layout with form and contact info
 *
 * Server Component wrapper for Client Component form
 */

import { Container, Section } from '@/components/layout';
import { Text } from '@/components/ui';

import { ContactAlternatives } from './contact-alternatives';
import { ContactForm } from './contact-form';

/**
 * Contact info items
 */
const contactInfo = [
  {
    icon: (
      <svg
        className="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
        />
      </svg>
    ),
    label: 'Email',
    value: 'hello@webcraft.com',
    href: 'mailto:hello@webcraft.com',
  },
  {
    icon: (
      <svg
        className="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
        />
      </svg>
    ),
    label: 'Phone',
    value: '+1 (555) 123-4567',
    href: 'tel:+15551234567',
  },
  {
    icon: (
      <svg
        className="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
        />
      </svg>
    ),
    label: 'Location',
    value: 'San Francisco, CA',
  },
];

/**
 * Business hours
 */
const businessHours = [
  { day: 'Monday - Friday', hours: '9:00 AM - 6:00 PM' },
  { day: 'Saturday', hours: '10:00 AM - 2:00 PM' },
  { day: 'Sunday', hours: 'Closed' },
];

export function ContactFormSection(): React.ReactElement {
  return (
    <Section size="lg" background="secondary" aria-label="Contact form">
      <Container>
        <div className="mx-auto max-w-5xl">
          <div className="grid gap-8 lg:grid-cols-5 lg:gap-12">
            {/* Contact Info Sidebar */}
            <div className="lg:col-span-2">
              <div
                className="motion-slide-up"
                style={
                  {
                    '--motion-delay': '0s',
                    '--motion-duration': '0.5s',
                  } as React.CSSProperties
                }
              >
                <h2 className="text-foreground mb-6 text-2xl font-bold">
                  Contact Information
                </h2>

                {/* Contact details */}
                <div className="space-y-4">
                  {contactInfo.map((item) => (
                    <div key={item.label} className="flex items-start gap-4">
                      <div className="bg-primary-100 text-primary-600 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg">
                        {item.icon}
                      </div>
                      <div>
                        <p className="text-foreground-muted text-sm">
                          {item.label}
                        </p>
                        {item.href ? (
                          <a
                            href={item.href}
                            className="text-foreground hover:text-primary-600 font-medium transition-colors"
                          >
                            {item.value}
                          </a>
                        ) : (
                          <p className="text-foreground font-medium">
                            {item.value}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Business hours */}
                <div className="mt-8">
                  <h3 className="text-foreground mb-4 font-semibold">
                    Business Hours
                  </h3>
                  <div className="space-y-2">
                    {businessHours.map((item) => (
                      <div
                        key={item.day}
                        className="flex justify-between text-sm"
                      >
                        <span className="text-foreground-secondary">
                          {item.day}
                        </span>
                        <span className="text-foreground font-medium">
                          {item.hours}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Response time badge */}
                <div className="border-primary-200 bg-primary-50 mt-8 rounded-xl border p-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-primary-100 flex h-10 w-10 items-center justify-center rounded-full">
                      <svg
                        className="text-primary-600 h-5 w-5"
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
                    </div>
                    <div>
                      <p className="text-foreground font-semibold">
                        Quick Response
                      </p>
                      <p className="text-foreground-secondary text-sm">
                        We typically respond within 24 hours
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Form Column */}
            <div className="lg:col-span-3">
              <div
                className="motion-slide-up border-border bg-background rounded-2xl border p-6 shadow-sm sm:p-8"
                style={
                  {
                    '--motion-delay': '0.1s',
                    '--motion-duration': '0.5s',
                  } as React.CSSProperties
                }
              >
                <h2 className="text-foreground mb-2 text-xl font-bold">
                  Send Us a Message
                </h2>
                <Text variant="secondary" size="sm" className="mb-6">
                  Fill out the form below and we&apos;ll get back to you as soon
                  as possible.
                </Text>
                <ContactForm />
              </div>

              {/* Alternative contact methods */}
              <ContactAlternatives />
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
