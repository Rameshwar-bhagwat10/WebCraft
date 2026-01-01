/**
 * TestimonialsSection Component
 * Client testimonials grid for social proof
 *
 * Server Component - fetches from database
 * Falls back to static data if no database reviews
 */

import { Container, Section } from '@/components/layout';
import { Heading, Text } from '@/components/ui';
import { getFeaturedReviews } from '@/lib/reviews/queries';
import type { ClientReviewWithProject } from '@/types/database';

import { TestimonialCard } from './testimonial-card';
import { getFeaturedTestimonials, type Testimonial } from './testimonials-data';

export async function TestimonialsSection(): Promise<React.ReactElement> {
  // Fetch from database
  const dbReviews = await getFeaturedReviews(6);
  
  // Convert database reviews to testimonial format or use static fallback
  const testimonials: Testimonial[] = dbReviews.length > 0
    ? dbReviews.map((review: ClientReviewWithProject) => ({
        id: review.id,
        name: review.client_name,
        role: review.client_role ?? '',
        company: review.client_company ?? '',
        quote: review.review_text,
        initials: review.client_name
          .split(' ')
          .map((n: string) => n[0])
          .join('')
          .toUpperCase()
          .slice(0, 2),
        ...(review.rating !== null && review.rating !== undefined && { rating: review.rating }),
        ...(review.project_slug !== null && review.project_slug !== undefined && { projectSlug: review.project_slug }),
      }))
    : getFeaturedTestimonials(6);

  return (
    <Section
      size="lg"
      background="secondary"
      aria-labelledby="testimonials-heading"
    >
      <Container>
        {/* Section header */}
        <div className="mx-auto mb-8 max-w-2xl text-center sm:mb-12">
          <div
            className="motion-slide-up"
            style={{ '--motion-delay': '0s', '--motion-duration': '0.5s' } as React.CSSProperties}
          >
            <p className="text-primary-600 mb-2 text-xs font-semibold tracking-wider uppercase sm:mb-3 sm:text-sm">
              Client Feedback
            </p>
          </div>
          <div
            className="motion-slide-up"
            style={{ '--motion-delay': '0.1s', '--motion-duration': '0.5s' } as React.CSSProperties}
          >
            <Heading
              level={2}
              id="testimonials-heading"
              className="mb-3 text-2xl sm:mb-4 sm:text-3xl lg:text-4xl"
            >
              Trusted by Growing Businesses
            </Heading>
          </div>
          <div
            className="motion-slide-up"
            style={{ '--motion-delay': '0.2s', '--motion-duration': '0.5s' } as React.CSSProperties}
          >
            <Text
              variant="secondary"
              size="lg"
              className="text-sm text-pretty sm:text-base lg:text-lg"
            >
              Real feedback from clients who partnered with us to build their
              digital presence.
            </Text>
          </div>
        </div>

        {/* Testimonials grid */}
        <div className="grid gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard
              key={testimonial.id}
              testimonial={testimonial}
              index={index}
            />
          ))}
        </div>

        {/* Trust note */}
        <div
          className="motion-slide-up mt-8 text-center sm:mt-10"
          style={{ '--motion-delay': '0.5s', '--motion-duration': '0.4s' } as React.CSSProperties}
        >
          <p className="text-foreground-muted text-xs sm:text-sm">
            These testimonials reflect genuine client experiences.
          </p>
        </div>
      </Container>
    </Section>
  );
}
