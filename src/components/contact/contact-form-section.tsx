/**
 * Contact Form Section
 * Two-column layout with form and contact info
 *
 * Server Component wrapper for Client Component form
 */

import { Container, Section } from '@/components/layout';
import { Text } from '@/components/ui';
import { siteConfig } from '@/config/site';

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
    value: siteConfig.email,
    href: `mailto:${siteConfig.email}`,
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
    value: siteConfig.phone,
    href: `tel:+91${siteConfig.phone?.replace(/\D/g, '').slice(-10)}`,
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
    value: `${siteConfig.location?.city}, ${siteConfig.location?.state}`,
  },
  {
    icon: (
      <svg
        className="h-5 w-5"
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
      </svg>
    ),
    label: 'WhatsApp',
    value: 'Chat with us',
    href: `https://wa.me/${siteConfig.whatsapp}`,
  },
];

/**
 * Business hours (IST)
 */
const businessHours = [
  { day: 'Monday - Friday', hours: '10:00 AM - 7:00 PM IST' },
  { day: 'Saturday', hours: '10:00 AM - 4:00 PM IST' },
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
