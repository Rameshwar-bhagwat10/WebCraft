/**
 * Pricing Data
 * Centralized pricing information for consistency
 *
 * Note: Prices are realistic starting points.
 * Final pricing depends on project scope.
 */

export interface PricingFeature {
  name: string;
  included: boolean;
  note?: string;
}

export interface PricingPlan {
  id: string;
  name: string;
  description: string;
  /** Who this plan is best for */
  bestFor: string;
  /** Starting price (displayed as "From ₹X") */
  startingPrice: number;
  /** Price suffix (e.g., "one-time" or "/month") */
  priceSuffix: string;
  features: PricingFeature[];
  /** Highlight as recommended */
  recommended?: boolean;
  /** CTA button text */
  ctaText: string;
}

export const pricingPlans: PricingPlan[] = [
  {
    id: 'basic',
    name: 'Basic',
    description:
      'A solid foundation for small businesses getting started online.',
    bestFor: 'Small businesses, personal brands, simple online presence',
    startingPrice: 1000,
    priceSuffix: 'one-time',
    ctaText: 'Get Started',
    features: [
      { name: 'Up to 5 pages', included: true },
      { name: 'Mobile-responsive design', included: true },
      { name: 'Basic SEO setup', included: true },
      { name: 'Contact form', included: true },
      { name: 'Performance optimization', included: true },
      { name: 'Custom design', included: false, note: 'Template-based' },
      { name: 'Content management system', included: false },
      { name: 'E-commerce functionality', included: false },
      { name: 'Ongoing maintenance', included: false },
    ],
  },
  {
    id: 'standard',
    name: 'Standard',
    description:
      'Everything you need for a professional, conversion-focused website.',
    bestFor: 'Growing businesses, service providers, lead generation',
    startingPrice: 3000,
    priceSuffix: 'one-time',
    ctaText: 'Get Started',
    recommended: true,
    features: [
      { name: 'Up to 10 pages', included: true },
      { name: 'Mobile-responsive design', included: true },
      { name: 'Advanced SEO setup', included: true },
      { name: 'Contact form', included: true },
      { name: 'Performance optimization', included: true },
      { name: 'Custom design', included: true },
      { name: 'Content management system', included: true },
      { name: 'E-commerce functionality', included: false },
      { name: '30 days post-launch support', included: true },
    ],
  },
  {
    id: 'premium',
    name: 'Premium',
    description:
      'Full-featured solution for businesses with complex requirements.',
    bestFor: 'Established businesses, e-commerce, custom functionality',
    startingPrice: 6000,
    priceSuffix: 'one-time',
    ctaText: 'Contact Us',
    features: [
      { name: 'Unlimited pages', included: true },
      { name: 'Mobile-responsive design', included: true },
      { name: 'Advanced SEO setup', included: true },
      { name: 'Contact form', included: true },
      { name: 'Performance optimization', included: true },
      { name: 'Custom design', included: true },
      { name: 'Content management system', included: true },
      { name: 'E-commerce functionality', included: true },
      { name: '90 days post-launch support', included: true },
    ],
  },
];

/**
 * Pricing notes/disclaimers
 */
export const pricingNotes = [
  'All prices are starting points. Final pricing depends on project scope and requirements.',
  'Payment is typically split: 50% upfront, 50% on completion.',
  'Hosting and domain: +₹1,000/year if required (optional - you can use your own hosting).',
  'Ongoing maintenance plans are available for all tiers.',
];
