/**
 * Services Page
 * Server Component - renders statically (SSG)
 *
 * Purpose: Help visitors understand services and self-qualify
 * - Overview of all services
 * - Detailed information for each service
 * - Clear outcomes and CTAs
 *
 * Performance:
 * - Static generation for fastest load
 * - No client JS
 * - CLS = 0
 */

import type { Metadata } from 'next';

import {
  ServiceDetail,
  ServicesCTA,
  servicesData,
  ServicesOverview,
} from '@/components/services';
import { JsonLd } from '@/components/shared';
import { generatePageMetadata, generateWebPageSchema } from '@/lib/seo';

/**
 * Page-specific metadata
 */
export const metadata: Metadata = generatePageMetadata({
  title: 'Services - WebCraft',
  description:
    'Explore our web development services: business websites, web applications, mobile apps, UI dashboards, and ongoing maintenance. Quality solutions for businesses that value results.',
  pathname: '/services',
});

export default function ServicesPage(): React.ReactElement {
  // Generate page-specific schema
  const pageSchema = generateWebPageSchema({
    title: 'Services - WebCraft',
    description:
      'Explore our web development services: business websites, web applications, mobile apps, UI dashboards, and ongoing maintenance.',
    pathname: '/services',
  });

  return (
    <>
      {/* Page-specific JSON-LD */}
      <JsonLd data={pageSchema} />

      {/* Services Overview - H1 and service cards */}
      <ServicesOverview />

      {/* Individual Service Details */}
      {servicesData.map((service, index) => (
        <ServiceDetail
          key={service.id}
          service={service}
          alternate={index % 2 === 1}
        />
      ))}

      {/* Final CTA */}
      <ServicesCTA />
    </>
  );
}
