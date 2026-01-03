/**
 * Terms of Service Page
 * Legal terms and conditions
 *
 * Server Component - renders statically (SSG)
 */

import type { Metadata } from 'next';

import { Container, Section } from '@/components/layout';
import { JsonLd } from '@/components/shared';
import { Text } from '@/components/ui';
import { siteConfig } from '@/config/site';
import { generatePageMetadata, generateWebPageSchema } from '@/lib/seo';

export const metadata: Metadata = generatePageMetadata({
  title: `Terms of Service - ${siteConfig.name}`,
  description: `Read the terms and conditions for using ${siteConfig.name} services.`,
  pathname: '/terms',
});

export default function TermsPage(): React.ReactElement {
  const pageSchema = generateWebPageSchema({
    title: `Terms of Service - ${siteConfig.name}`,
    description: 'Terms and conditions for using our services.',
    pathname: '/terms',
  });

  return (
    <>
      <JsonLd data={pageSchema} />

      {/* Hero */}
      <Section size="lg" background="primary" aria-labelledby="terms-heading">
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
                id="terms-heading"
                className="text-foreground mb-6 text-4xl font-bold tracking-tight sm:text-5xl"
              >
                Terms of Service
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
                  1. Agreement to Terms
                </h2>
                <p className="text-foreground-secondary leading-relaxed">
                  By accessing or using {siteConfig.name}&apos;s services, you agree to
                  be bound by these Terms of Service. If you do not agree to
                  these terms, please do not use our services.
                </p>
              </section>

              <section>
                <h2 className="text-foreground mb-4 text-xl font-semibold">
                  2. Services
                </h2>
                <p className="text-foreground-secondary leading-relaxed">
                  {siteConfig.name} provides web development, design, and related digital
                  services. The specific scope of work, deliverables, and
                  timelines will be outlined in individual project agreements or
                  proposals shared via email or document.
                </p>
              </section>

              <section>
                <h2 className="text-foreground mb-4 text-xl font-semibold">
                  3. Client Responsibilities
                </h2>
                <p className="text-foreground-secondary mb-4 leading-relaxed">
                  As a client, you agree to:
                </p>
                <ul className="text-foreground-secondary list-disc space-y-2 pl-6">
                  <li>
                    Provide accurate and complete information necessary for the
                    project
                  </li>
                  <li>
                    Respond to requests for feedback and approvals in a timely
                    manner
                  </li>
                  <li>Ensure you have the rights to any content you provide</li>
                  <li>Make payments according to the agreed schedule</li>
                </ul>
              </section>

              <section>
                <h2 className="text-foreground mb-4 text-xl font-semibold">
                  4. Payment Terms
                </h2>
                <p className="text-foreground-secondary mb-4 leading-relaxed">
                  Payment terms will be specified in individual project
                  proposals. Generally:
                </p>
                <ul className="text-foreground-secondary list-disc space-y-2 pl-6">
                  <li>A deposit of 50% is required before work begins</li>
                  <li>The remaining balance is due upon project completion</li>
                  <li>Payments can be made via UPI, bank transfer, or other agreed methods</li>
                  <li>All fees are in Indian Rupees (₹) unless otherwise specified</li>
                  <li>Late payments may delay project delivery</li>
                </ul>
              </section>

              <section>
                <h2 className="text-foreground mb-4 text-xl font-semibold">
                  5. Intellectual Property
                </h2>
                <p className="text-foreground-secondary leading-relaxed">
                  Upon full payment, you will own the final deliverables created
                  specifically for your project. {siteConfig.name} retains the right to
                  use general techniques, skills, and knowledge gained during
                  the project. We may also showcase the work in our portfolio
                  unless otherwise agreed in writing.
                </p>
              </section>

              <section>
                <h2 className="text-foreground mb-4 text-xl font-semibold">
                  6. Revisions and Changes
                </h2>
                <p className="text-foreground-secondary leading-relaxed">
                  The number of revision rounds will be specified in your
                  project proposal (typically 2-3 rounds). Additional revisions or changes to the
                  project scope may incur additional fees. Major changes to
                  project requirements after work has begun may require a revised
                  proposal and timeline.
                </p>
              </section>

              <section>
                <h2 className="text-foreground mb-4 text-xl font-semibold">
                  7. Project Timeline
                </h2>
                <p className="text-foreground-secondary leading-relaxed">
                  Project timelines are estimates based on the agreed scope. Delays
                  caused by late feedback, content delivery, or scope changes from
                  the client side may extend the timeline. We will communicate any
                  delays promptly.
                </p>
              </section>

              <section>
                <h2 className="text-foreground mb-4 text-xl font-semibold">
                  8. Limitation of Liability
                </h2>
                <p className="text-foreground-secondary leading-relaxed">
                  {siteConfig.name} shall not be liable for any indirect, incidental,
                  special, consequential, or punitive damages resulting from
                  your use of our services. Our total liability shall not exceed
                  the amount paid for the specific service giving rise to the
                  claim.
                </p>
              </section>

              <section>
                <h2 className="text-foreground mb-4 text-xl font-semibold">
                  9. Termination
                </h2>
                <p className="text-foreground-secondary leading-relaxed">
                  Either party may terminate a project with written notice. In
                  case of termination, you will be responsible for payment for
                  all work completed up to the termination date. Any deposits
                  paid are non-refundable as they cover initial planning and setup work.
                </p>
              </section>

              <section>
                <h2 className="text-foreground mb-4 text-xl font-semibold">
                  10. Governing Law
                </h2>
                <p className="text-foreground-secondary leading-relaxed">
                  These Terms shall be governed by and construed in accordance
                  with the laws of India. Any disputes shall be subject to the
                  jurisdiction of courts in {siteConfig.location?.state}, India.
                </p>
              </section>

              <section>
                <h2 className="text-foreground mb-4 text-xl font-semibold">
                  11. Contact
                </h2>
                <p className="text-foreground-secondary leading-relaxed">
                  For questions about these Terms of Service, please contact us
                  at:
                </p>
                <p className="text-foreground-secondary mt-4 leading-relaxed">
                  <strong>Name:</strong> {siteConfig.founder}
                  <br />
                  <strong>Email:</strong> {siteConfig.email}
                  <br />
                  <strong>Phone:</strong> {siteConfig.phone}
                  <br />
                  <strong>Location:</strong> {siteConfig.location?.city}, {siteConfig.location?.state}, {siteConfig.location?.country}
                </p>
              </section>
            </div>
          </article>
        </Container>
      </Section>
    </>
  );
}
