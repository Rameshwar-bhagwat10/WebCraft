/**
 * Contact FAQ Section
 * Common questions about contacting and working with us
 *
 * Client Component - handles accordion state
 */

'use client';

import { useState } from 'react';

import { Container, Section } from '@/components/layout';
import { Heading, Text } from '@/components/ui';
import { cn } from '@/lib/utils';

/**
 * FAQ items
 */
const faqItems = [
  {
    question: 'How quickly will you respond to my inquiry?',
    answer:
      'I typically respond to all inquiries within 24 hours during business days. For urgent matters, reach out via WhatsApp for faster communication.',
  },
  {
    question: 'What information should I include in my message?',
    answer:
      'The more details you provide, the better I can help. Include your project goals, timeline, budget range (if known), and any specific requirements or preferences you have.',
  },
  {
    question: 'Do you offer free consultations?',
    answer:
      "Yes! I offer a free initial consultation to discuss your project, understand your needs, and provide recommendations. There's no obligation to proceed after the consultation.",
  },
  {
    question: 'What happens after I submit the form?',
    answer:
      "After you submit the form, you'll receive a confirmation email. Within 24 hours, I will reach out to schedule a discovery call to discuss your project in detail.",
  },
  {
    question: 'What is your typical project timeline?',
    answer:
      'Timeline depends on project complexity. A simple landing page takes 1-2 weeks, a business website 3-4 weeks, and complex web applications 6-8 weeks or more. I\'ll provide a detailed timeline after understanding your requirements.',
  },
];

/**
 * Single FAQ item component
 */
function FAQItem({
  question,
  answer,
  isOpen,
  onToggle,
  index,
}: {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
  index: number;
}): React.ReactElement {
  return (
    <div
      className={cn(
        'motion-slide-up border-border overflow-hidden rounded-xl border transition-all duration-200',
        isOpen
          ? 'bg-primary-50/50 border-primary-200'
          : 'bg-background hover:border-primary-200'
      )}
      style={
        {
          '--motion-delay': `${0.1 + index * 0.05}s`,
          '--motion-duration': '0.4s',
        } as React.CSSProperties
      }
    >
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between p-5 text-left"
        aria-expanded={isOpen}
      >
        <span className="text-foreground pr-4 font-medium">{question}</span>
        <span
          className={cn(
            'bg-primary-100 text-primary-600 flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-transform duration-200',
            isOpen && 'rotate-180'
          )}
        >
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </span>
      </button>
      <div
        className={cn(
          'grid transition-all duration-200',
          isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
        )}
      >
        <div className="overflow-hidden">
          <div className="text-foreground-secondary px-5 pb-5 text-sm leading-relaxed">
            {answer}
          </div>
        </div>
      </div>
    </div>
  );
}

export function ContactFAQ(): React.ReactElement {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <Section
      size="lg"
      background="primary"
      aria-labelledby="contact-faq-heading"
    >
      <Container size="md">
        <div className="mx-auto max-w-2xl">
          {/* Header */}
          <div
            className="motion-slide-up mb-10 text-center"
            style={
              {
                '--motion-delay': '0s',
                '--motion-duration': '0.5s',
              } as React.CSSProperties
            }
          >
            <Heading level={2} id="contact-faq-heading" className="mb-4">
              Common Questions
            </Heading>
            <Text variant="secondary">
              Quick answers to help you get started
            </Text>
          </div>

          {/* FAQ items */}
          <div className="space-y-3">
            {faqItems.map((item, index) => (
              <FAQItem
                key={item.question}
                question={item.question}
                answer={item.answer}
                isOpen={openIndex === index}
                onToggle={() => handleToggle(index)}
                index={index}
              />
            ))}
          </div>
        </div>
      </Container>
    </Section>
  );
}
