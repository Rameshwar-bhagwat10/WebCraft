/**
 * Cookie Policy Page
 * Information about cookie usage
 *
 * Server Component - renders statically (SSG)
 */

import type { Metadata } from 'next';

import { Container, Section } from '@/components/layout';
import { JsonLd } from '@/components/shared';
import { Text } from '@/components/ui';
import { siteConfig } from '@/config/site';
import { generatePageMetadata, generateWebPageSchema } from '@/lib/seo';
import { cn } from '@/lib/utils';

export const metadata: Metadata = generatePageMetadata({
  title: `Cookie Policy - ${siteConfig.name}`,
  description:
    `Learn about how ${siteConfig.name} uses cookies and similar technologies.`,
  pathname: '/cookies',
});

/**
 * Cookie types
 */
const cookieTypes = [
  {
    name: 'Essential Cookies',
    description:
      'Required for the website to function properly. Cannot be disabled.',
    examples: ['Session management', 'Security tokens', 'Form submissions'],
  },
  {
    name: 'Analytics Cookies',
    description: 'Help us understand how visitors interact with our website.',
    examples: ['Page views', 'Traffic sources', 'User behavior'],
  },
  {
    name: 'Functional Cookies',
    description: 'Enable enhanced functionality and personalization.',
    examples: ['Chat preferences', 'Calculator settings', 'User preferences'],
  },
  {
    name: 'Security Cookies',
    description: 'Used to protect against spam and abuse.',
    examples: ['reCAPTCHA tokens', 'Bot detection', 'Form protection'],
  },
];

export default function CookiesPage(): React.ReactElement {
  const pageSchema = generateWebPageSchema({
    title: `Cookie Policy - ${siteConfig.name}`,
    description: 'Information about our cookie usage.',
    pathname: '/cookies',
  });

  return (
    <>
      <JsonLd data={pageSchema} />

      {/* Hero */}
      <Section size="lg" background="primary" aria-labelledby="cookies-heading">
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
                Legal
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
                id="cookies-heading"
                className="text-foreground mb-6 text-4xl font-bold tracking-tight sm:text-5xl"
              >
                Cookie Policy
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
              <Text variant="muted">Last updated: January 1, 2025</Text>
            </div>
          </div>
        </Container>
      </Section>

      {/* Introduction */}
      <Section size="lg" background="secondary">
        <Container size="sm">
          <div
            className="motion-slide-up space-y-6"
            style={
              {
                '--motion-delay': '0s',
                '--motion-duration': '0.5s',
              } as React.CSSProperties
            }
          >
            <section>
              <h2 className="text-foreground mb-4 text-xl font-semibold">
                What Are Cookies?
              </h2>
              <p className="text-foreground-secondary leading-relaxed">
                Cookies are small text files that are stored on your device when
                you visit a website. They are widely used to make websites work
                more efficiently and provide information to website owners.
              </p>
            </section>

            <section>
              <h2 className="text-foreground mb-4 text-xl font-semibold">
                How We Use Cookies
              </h2>
              <p className="text-foreground-secondary leading-relaxed">
                {siteConfig.name} uses cookies to improve your experience on our website,
                protect our forms from spam using Google reCAPTCHA, and understand
                how visitors interact with our site. We do not use cookies for
                advertising or tracking across other websites.
              </p>
            </section>
          </div>
        </Container>
      </Section>

      {/* Cookie Types */}
      <Section
        size="lg"
        background="primary"
        aria-labelledby="cookie-types-heading"
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
            <h2
              id="cookie-types-heading"
              className="text-foreground mb-4 text-2xl font-bold"
            >
              Types of Cookies We Use
            </h2>
            <Text variant="secondary">
              Understanding the different categories of cookies on our site
            </Text>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            {cookieTypes.map((type, index) => (
              <div
                key={type.name}
                className={cn(
                  'motion-slide-up border-border bg-background rounded-xl border p-6',
                  'hover:border-primary-200 transition-all duration-200 hover:shadow-md'
                )}
                style={
                  {
                    '--motion-delay': `${0.1 + index * 0.05}s`,
                    '--motion-duration': '0.4s',
                  } as React.CSSProperties
                }
              >
                <h3 className="text-foreground mb-2 font-semibold">
                  {type.name}
                </h3>
                <p className="text-foreground-secondary mb-4 text-sm">
                  {type.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {type.examples.map((example) => (
                    <span
                      key={example}
                      className="bg-primary-50 text-primary-700 rounded-full px-3 py-1 text-xs font-medium"
                    >
                      {example}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* Managing Cookies */}
      <Section size="lg" background="secondary">
        <Container size="sm">
          <div
            className="motion-slide-up space-y-8"
            style={
              {
                '--motion-delay': '0s',
                '--motion-duration': '0.5s',
              } as React.CSSProperties
            }
          >
            <section>
              <h2 className="text-foreground mb-4 text-xl font-semibold">
                Third-Party Services
              </h2>
              <p className="text-foreground-secondary mb-4 leading-relaxed">
                We use the following third-party services that may set cookies:
              </p>
              <ul className="text-foreground-secondary list-disc space-y-2 pl-6">
                <li>
                  <strong>Google reCAPTCHA:</strong> Protects our forms from spam and abuse
                </li>
                <li>
                  <strong>Supabase:</strong> Provides our database and authentication services
                </li>
                <li>
                  <strong>Vercel:</strong> Hosts our website and may collect analytics
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-foreground mb-4 text-xl font-semibold">
                Managing Your Cookie Preferences
              </h2>
              <p className="text-foreground-secondary mb-4 leading-relaxed">
                You can control and manage cookies in various ways. Most
                browsers allow you to:
              </p>
              <ul className="text-foreground-secondary list-disc space-y-2 pl-6">
                <li>
                  View what cookies are stored and delete them individually
                </li>
                <li>Block third-party cookies</li>
                <li>Block cookies from specific sites</li>
                <li>Block all cookies</li>
                <li>Delete all cookies when you close your browser</li>
              </ul>
            </section>

            <section>
              <h2 className="text-foreground mb-4 text-xl font-semibold">
                Browser Settings
              </h2>
              <p className="text-foreground-secondary mb-4 leading-relaxed">
                Here&apos;s how to manage cookies in popular browsers:
              </p>
              <ul className="text-foreground-secondary list-disc space-y-2 pl-6">
                <li>
                  <strong>Chrome:</strong> Settings → Privacy and security →
                  Cookies
                </li>
                <li>
                  <strong>Firefox:</strong> Settings → Privacy & Security →
                  Cookies
                </li>
                <li>
                  <strong>Safari:</strong> Preferences → Privacy → Cookies
                </li>
                <li>
                  <strong>Edge:</strong> Settings → Cookies and site permissions
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-foreground mb-4 text-xl font-semibold">
                Impact of Disabling Cookies
              </h2>
              <p className="text-foreground-secondary leading-relaxed">
                Please note that disabling cookies may affect the functionality
                of our website. Some features like form submissions may not work
                properly if essential cookies are blocked.
              </p>
            </section>

            <section>
              <h2 className="text-foreground mb-4 text-xl font-semibold">
                Contact Us
              </h2>
              <p className="text-foreground-secondary leading-relaxed">
                If you have questions about our use of cookies, please contact
                us at:
              </p>
              <p className="text-foreground-secondary mt-4 leading-relaxed">
                <strong>Email:</strong> {siteConfig.email}
                <br />
                <strong>Phone:</strong> {siteConfig.phone}
              </p>
            </section>
          </div>
        </Container>
      </Section>
    </>
  );
}
