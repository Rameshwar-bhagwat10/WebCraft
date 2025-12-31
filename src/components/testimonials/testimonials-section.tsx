/**
 * TestimonialsSection Component
 * Client testimonials grid for social proof
 *
 * Server Component - renders statically
 * Placement: Home page (after WhyWebCraft, before FinalCTA)
 */

import { Container, Section } from '@/components/layout';
import { Heading, Text } from '@/components/ui';

import { TestimonialCard } from './testimonial-card';
import { getFeaturedTestimonials } from './testimonials-data';

export function TestimonialsSection(): React.ReactElement {
  const testimonials = getFeaturedTestimonials(6);

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
            style={
              {
                '--motion-delay': '0s',
                '--motion-duration': '0.5s',
              } as React.CSSProperties
            }
          >
            <p className="text-primary-600 mb-2 text-xs font-semibold tracking-wider uppercase sm:mb-3 sm:text-sm">
              Client Feedback
            </p>
          </div>
          <div
            className="motion-slide-up"
            style={
              {
                '--motion-delay': '0.1s',
                '--motion-duration': '0.5s',
              } as React.CSSProperties
            }
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
            style={
              {
                '--motion-delay': '0.2s',
                '--motion-duration': '0.5s',
              } as React.CSSProperties
            }
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
          style={
            {
              '--motion-delay': '0.5s',
              '--motion-duration': '0.4s',
            } as React.CSSProperties
          }
        >
          <p className="text-foreground-muted text-xs sm:text-sm">
            These testimonials reflect genuine client experiences.
          </p>
        </div>
      </Container>
    </Section>
  );
}
