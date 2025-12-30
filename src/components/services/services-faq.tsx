/**
 * Services FAQ Section
 * Common questions about services
 *
 * Server Component - no client JS needed
 * Accordion-style FAQ for SEO and UX
 */

import { Container, Section } from '@/components/layout';
import { Heading, Text } from '@/components/ui';
import { cn } from '@/lib/utils';

/**
 * FAQ data - common questions about services
 */
const faqs = [
  {
    question: 'How long does a typical project take?',
    answer:
      'Project timelines vary based on scope and complexity. A simple business website typically takes 4-6 weeks, while a custom web application can take 8-16 weeks. We provide detailed timelines during our initial consultation and keep you updated throughout the process.',
  },
  {
    question: 'What is your pricing structure?',
    answer:
      'We offer project-based pricing tailored to your specific needs. After understanding your requirements, we provide a detailed proposal with transparent pricing. No hidden fees or surprises. Visit our pricing page for general ranges, or contact us for a custom quote.',
  },
  {
    question: 'Do you offer ongoing support after launch?',
    answer:
      'Yes! We offer maintenance and support packages to keep your website or application running smoothly. This includes security updates, performance monitoring, content updates, and technical support. We believe in building long-term relationships with our clients.',
  },
  {
    question: 'What technologies do you use?',
    answer:
      'We use modern, battle-tested technologies including React, Next.js, TypeScript, and Tailwind CSS for frontend development. For backend, we work with Node.js, Python, PostgreSQL, and cloud platforms like AWS and Vercel. We choose the best tools for each project.',
  },
  {
    question: 'How do you handle communication during projects?',
    answer:
      'Clear communication is one of our core values. We provide regular updates, typically weekly, and are available for questions throughout the project. We use collaborative tools to keep everything organized and ensure you always know where your project stands.',
  },
  {
    question: 'Can you work with our existing systems?',
    answer:
      'Absolutely. We have experience integrating with various third-party services, APIs, and existing systems. During our discovery phase, we assess your current setup and plan the best approach for integration while minimizing disruption to your operations.',
  },
];

interface FAQItemProps {
  question: string;
  answer: string;
  index: number;
}

function FAQItem({
  question,
  answer,
  index,
}: FAQItemProps): React.ReactElement {
  return (
    <details
      className={cn(
        'motion-slide-up group rounded-xl',
        'bg-background border-border border',
        'transition-all duration-300',
        'hover:border-primary-200 hover:shadow-md',
        'open:border-primary-200 open:shadow-lg'
      )}
      style={
        {
          '--motion-delay': `${0.1 + index * 0.08}s`,
          '--motion-duration': '0.5s',
        } as React.CSSProperties
      }
    >
      <summary className="flex cursor-pointer items-center justify-between gap-4 p-6 text-left">
        <h3 className="text-foreground group-hover:text-primary-700 group-open:text-primary-700 pr-4 font-semibold transition-colors duration-200">
          {question}
        </h3>
        <span
          className="bg-primary-50 text-primary-600 group-hover:bg-primary-100 group-open:bg-primary-100 flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-all duration-300 group-open:rotate-180"
          aria-hidden="true"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </span>
      </summary>
      <div className="border-border border-t px-6 pt-4 pb-6">
        <Text variant="secondary" className="leading-relaxed">
          {answer}
        </Text>
      </div>
    </details>
  );
}

export function ServicesFAQ(): React.ReactElement {
  return (
    <Section size="lg" background="secondary" aria-labelledby="faq-heading">
      <Container size="md">
        {/* Section header */}
        <div className="mx-auto mb-12 max-w-2xl text-center sm:mb-16">
          <div
            className="motion-slide-up"
            style={
              {
                '--motion-delay': '0s',
                '--motion-duration': '0.5s',
              } as React.CSSProperties
            }
          >
            <Heading level={2} id="faq-heading" className="mb-4">
              Frequently Asked Questions
            </Heading>
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
            <Text variant="secondary" size="lg">
              Common questions about our services. Can&apos;t find what
              you&apos;re looking for? Feel free to reach out.
            </Text>
          </div>
        </div>

        {/* FAQ list */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <FAQItem
              key={index}
              question={faq.question}
              answer={faq.answer}
              index={index}
            />
          ))}
        </div>
      </Container>
    </Section>
  );
}
