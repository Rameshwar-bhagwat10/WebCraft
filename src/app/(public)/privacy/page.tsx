/**
 * Privacy Policy Page
 * Legal privacy policy document
 *
 * Server Component - renders statically (SSG)
 */

import type { Metadata } from 'next';

import { Container, Section } from '@/components/layout';
import { JsonLd } from '@/components/shared';
import { Text } from '@/components/ui';
import { generatePageMetadata, generateWebPageSchema } from '@/lib/seo';

export const metadata: Metadata = generatePageMetadata({
  title: 'Privacy Policy - WebCraft',
  description:
    'Learn how WebCraft collects, uses, and protects your personal information.',
  pathname: '/privacy',
});

export default function PrivacyPage(): React.ReactElement {
  const pageSchema = generateWebPageSchema({
    title: 'Privacy Policy - WebCraft',
    description: 'Our privacy policy and data protection practices.',
    pathname: '/privacy',
  });

  return (
    <>
      <JsonLd data={pageSchema} />

      {/* Hero */}
      <Section size="lg" background="primary" aria-labelledby="privacy-heading">
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
                id="privacy-heading"
                className="text-foreground mb-6 text-4xl font-bold tracking-tight sm:text-5xl"
              >
                Privacy Policy
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
              <Text variant="muted">Last updated: December 30, 2024</Text>
            </div>
          </div>
        </Container>
      </Section>

      {/* Content */}
      <Section size="lg" background="secondary">
        <Container size="sm">
          <article className="prose prose-neutral max-w-none">
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
                  1. Introduction
                </h2>
                <p className="text-foreground-secondary leading-relaxed">
                  WebCraft (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;)
                  is committed to protecting your privacy. This Privacy Policy
                  explains how we collect, use, disclose, and safeguard your
                  information when you visit our website or use our services.
                </p>
              </section>

              <section>
                <h2 className="text-foreground mb-4 text-xl font-semibold">
                  2. Information We Collect
                </h2>
                <p className="text-foreground-secondary mb-4 leading-relaxed">
                  We may collect information about you in various ways:
                </p>
                <ul className="text-foreground-secondary list-disc space-y-2 pl-6">
                  <li>
                    <strong>Personal Data:</strong> Name, email address, phone
                    number, and other contact information you provide.
                  </li>
                  <li>
                    <strong>Usage Data:</strong> Information about how you use
                    our website, including pages visited and time spent.
                  </li>
                  <li>
                    <strong>Device Data:</strong> Information about your device,
                    browser type, and IP address.
                  </li>
                  <li>
                    <strong>Cookies:</strong> Small data files stored on your
                    device to enhance your experience.
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="text-foreground mb-4 text-xl font-semibold">
                  3. How We Use Your Information
                </h2>
                <p className="text-foreground-secondary mb-4 leading-relaxed">
                  We use the information we collect to:
                </p>
                <ul className="text-foreground-secondary list-disc space-y-2 pl-6">
                  <li>Provide, operate, and maintain our services</li>
                  <li>
                    Respond to your inquiries and provide customer support
                  </li>
                  <li>
                    Send you updates, marketing communications, and promotional
                    materials
                  </li>
                  <li>Improve our website and services</li>
                  <li>Comply with legal obligations</li>
                </ul>
              </section>

              <section>
                <h2 className="text-foreground mb-4 text-xl font-semibold">
                  4. Information Sharing
                </h2>
                <p className="text-foreground-secondary leading-relaxed">
                  We do not sell your personal information. We may share your
                  information with third-party service providers who assist us
                  in operating our website and conducting our business, provided
                  they agree to keep your information confidential.
                </p>
              </section>

              <section>
                <h2 className="text-foreground mb-4 text-xl font-semibold">
                  5. Data Security
                </h2>
                <p className="text-foreground-secondary leading-relaxed">
                  We implement appropriate technical and organizational security
                  measures to protect your personal information. However, no
                  method of transmission over the Internet is 100% secure, and
                  we cannot guarantee absolute security.
                </p>
              </section>

              <section>
                <h2 className="text-foreground mb-4 text-xl font-semibold">
                  6. Your Rights
                </h2>
                <p className="text-foreground-secondary mb-4 leading-relaxed">
                  Depending on your location, you may have the right to:
                </p>
                <ul className="text-foreground-secondary list-disc space-y-2 pl-6">
                  <li>Access the personal information we hold about you</li>
                  <li>Request correction of inaccurate information</li>
                  <li>Request deletion of your personal information</li>
                  <li>Opt-out of marketing communications</li>
                  <li>Data portability</li>
                </ul>
              </section>

              <section>
                <h2 className="text-foreground mb-4 text-xl font-semibold">
                  7. Contact Us
                </h2>
                <p className="text-foreground-secondary leading-relaxed">
                  If you have questions about this Privacy Policy or our data
                  practices, please contact us at:
                </p>
                <p className="text-foreground-secondary mt-4 leading-relaxed">
                  <strong>Email:</strong> privacy@webcraft.com
                  <br />
                  <strong>Address:</strong> 123 Web Street, San Francisco, CA
                  94102
                </p>
              </section>
            </div>
          </article>
        </Container>
      </Section>
    </>
  );
}
