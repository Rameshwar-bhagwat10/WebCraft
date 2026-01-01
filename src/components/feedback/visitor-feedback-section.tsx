/**
 * Visitor Feedback Section
 * Displays approved visitor feedback and form to submit new feedback
 */

import { Container, Section } from '@/components/layout';
import { Heading, Text } from '@/components/ui';
import { getApprovedFeedback } from '@/lib/feedback/queries';
import { cn } from '@/lib/utils';
import type { VisitorFeedback } from '@/types/database';

import { VisitorFeedbackForm } from './visitor-feedback-form';

/**
 * Star rating display
 */
function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={cn('h-4 w-4', star <= rating ? 'text-amber-400' : 'text-neutral-200')}
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  );
}

/**
 * Single feedback card
 */
function FeedbackCard({
  feedback,
  index,
}: {
  feedback: VisitorFeedback;
  index: number;
}) {
  const initials = feedback.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div
      className={cn(
        'motion-slide-up rounded-xl bg-white p-4 sm:p-5',
        'border border-neutral-100 shadow-sm',
        'transition-all duration-300 hover:-translate-y-1 hover:shadow-md'
      )}
      style={{
        '--motion-delay': `${0.1 + index * 0.1}s`,
        '--motion-duration': '0.5s',
      } as React.CSSProperties}
    >
      <div className="mb-3 flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-100 text-xs font-semibold text-primary-700"
            aria-hidden="true"
          >
            {initials}
          </div>
          <span className="font-medium text-neutral-900">{feedback.name}</span>
        </div>
        <StarRating rating={feedback.rating} />
      </div>
      <p className="text-sm leading-relaxed text-neutral-600">&ldquo;{feedback.message}&rdquo;</p>
    </div>
  );
}

export async function VisitorFeedbackSection() {
  const feedbackList = await getApprovedFeedback(6);

  return (
    <Section size="lg" background="primary" aria-labelledby="visitor-feedback-heading">
      <Container>
        {/* Section header */}
        <div className="mx-auto mb-8 max-w-2xl text-center sm:mb-12">
          <div
            className="motion-slide-up"
            style={{ '--motion-delay': '0s', '--motion-duration': '0.5s' } as React.CSSProperties}
          >
            <p className="text-primary-600 mb-2 text-xs font-semibold tracking-wider uppercase sm:mb-3 sm:text-sm">
              Community Feedback
            </p>
          </div>
          <div
            className="motion-slide-up"
            style={{ '--motion-delay': '0.1s', '--motion-duration': '0.5s' } as React.CSSProperties}
          >
            <Heading
              level={2}
              id="visitor-feedback-heading"
              className="mb-3 text-2xl sm:mb-4 sm:text-3xl lg:text-4xl"
            >
              What Visitors Say
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
              Share your experience and help others discover our work.
            </Text>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Feedback list */}
          <div>
            {feedbackList.length > 0 ? (
              <div className="space-y-4">
                {feedbackList.map((item, index) => (
                  <FeedbackCard
                    key={item.id}
                    feedback={item}
                    index={index}
                  />
                ))}
              </div>
            ) : (
              <div className="flex h-full items-center justify-center rounded-xl border border-dashed border-neutral-300 bg-neutral-50 p-8 text-center">
                <div>
                  <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-neutral-100">
                    <svg className="h-6 w-6 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <p className="text-sm text-neutral-500">No feedback yet. Be the first to share!</p>
                </div>
              </div>
            )}
          </div>

          {/* Feedback form */}
          <div
            className="motion-slide-up rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm sm:p-8"
            style={{ '--motion-delay': '0.3s', '--motion-duration': '0.5s' } as React.CSSProperties}
          >
            <h3 className="mb-4 text-lg font-semibold text-neutral-900">Leave Your Feedback</h3>
            <VisitorFeedbackForm />
          </div>
        </div>
      </Container>
    </Section>
  );
}
