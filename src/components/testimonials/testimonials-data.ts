/**
 * Testimonials Data
 * Client testimonials for social proof
 *
 * Guidelines:
 * - Keep testimonials honest and realistic
 * - Focus on outcomes, not marketing speak
 * - 2-3 lines maximum per testimonial
 * - Quality over quantity
 */

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  quote: string;
  /** Optional: initials for avatar fallback */
  initials?: string;
  /** Optional: rating (1-5) */
  rating?: number;
  /** Optional: link to project */
  projectSlug?: string;
}

/**
 * Client testimonials
 * Authentic, outcome-focused feedback
 */
export const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Sarah Mitchell',
    role: 'Founder',
    company: 'GreenLeaf Co.',
    quote:
      'Clear communication throughout the project. Our new site loads fast and conversions are up 40% since launch.',
    initials: 'SM',
  },
  {
    id: '2',
    name: 'James Chen',
    role: 'Marketing Director',
    company: 'TechStart Inc.',
    quote:
      'They delivered on time and the quality exceeded expectations. The team was responsive and easy to work with.',
    initials: 'JC',
  },
  {
    id: '3',
    name: 'Emily Rodriguez',
    role: 'CEO',
    company: 'Bloom Studio',
    quote:
      'Professional, reliable, and genuinely cared about our success. The website perfectly represents our brand.',
    initials: 'ER',
  },
  {
    id: '4',
    name: 'Michael Torres',
    role: 'Operations Manager',
    company: 'Swift Logistics',
    quote:
      'Our customers love the new booking system. Support has been excellent even after the project wrapped up.',
    initials: 'MT',
  },
  {
    id: '5',
    name: 'Lisa Park',
    role: 'Creative Director',
    company: 'Artisan Collective',
    quote:
      'They understood our vision from day one. The design is clean, modern, and exactly what we needed.',
    initials: 'LP',
  },
  {
    id: '6',
    name: 'David Kim',
    role: 'Founder',
    company: 'FreshBite',
    quote:
      'Fast turnaround without cutting corners. Our restaurant site now ranks on the first page of Google.',
    initials: 'DK',
  },
];

/**
 * Get all testimonials
 */
export function getAllTestimonials(): Testimonial[] {
  return testimonials;
}

/**
 * Get featured testimonials (first N)
 */
export function getFeaturedTestimonials(count = 6): Testimonial[] {
  return testimonials.slice(0, count);
}
