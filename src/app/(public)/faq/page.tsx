/**
 * FAQ Page
 * Frequently asked questions
 *
 * Client Component - handles accordion state
 */

'use client';

import Link from 'next/link';
import { useState } from 'react';

import { Container, Section } from '@/components/layout';
import { Button, Heading, Text } from '@/components/ui';
import { cn } from '@/lib/utils';

/**
 * FAQ categories with questions
 */
const faqCategories = [
  {
    title: 'General',
    questions: [
      {
        q: 'What services does WebCraft offer?',
        a: 'We offer a comprehensive range of web development services including custom website development, web applications, e-commerce solutions, UI/UX design, and ongoing maintenance and support.',
      },
      {
        q: 'How long does a typical project take?',
        a: "Project timelines vary based on complexity. A simple website typically takes 2-4 weeks, while complex web applications can take 2-4 months. We'll provide a detailed timeline during our initial consultation.",
      },
      {
        q: 'Do you work with clients internationally?',
        a: 'Yes! We work with clients worldwide. Our remote-first approach and flexible communication tools allow us to collaborate effectively across time zones.',
      },
    ],
  },
  {
    title: 'Pricing & Payment',
    questions: [
      {
        q: 'How much does a website cost?',
        a: 'Our projects start at ₹1,000 for basic websites. The final cost depends on your specific requirements, features, and complexity. We provide detailed quotes after understanding your needs.',
      },
      {
        q: 'What payment methods do you accept?',
        a: 'We accept bank transfers, credit cards, and PayPal. For larger projects, we typically work with a 50% deposit upfront and the remaining 50% upon completion.',
      },
      {
        q: 'Do you offer payment plans?',
        a: 'Yes, we offer flexible payment plans for larger projects. We can discuss options that work for your budget during our consultation.',
      },
    ],
  },
  {
    title: 'Process & Support',
    questions: [
      {
        q: 'What is your development process?',
        a: 'Our process includes: Discovery & Planning, Design & Prototyping, Development, Testing & QA, Launch, and Ongoing Support. We keep you involved at every stage with regular updates and feedback sessions.',
      },
      {
        q: 'Will I be able to update the website myself?',
        a: 'Absolutely! We build websites with user-friendly content management systems (CMS) and provide training so you can easily update content, images, and basic elements yourself.',
      },
      {
        q: 'Do you provide ongoing maintenance?',
        a: 'Yes, we offer maintenance packages that include security updates, backups, performance monitoring, and content updates. Plans start at ₹200/month.',
      },
      {
        q: 'What happens after the website launches?',
        a: 'We provide 30 days of complimentary support after launch to address any issues. After that, you can choose one of our maintenance plans or contact us for ad-hoc support.',
      },
    ],
  },
  {
    title: 'Technical',
    questions: [
      {
        q: 'What technologies do you use?',
        a: 'We specialize in modern web technologies including React, Next.js, TypeScript, and Tailwind CSS. For backends, we work with Node.js, Python, and various databases. We choose the best stack for each project.',
      },
      {
        q: 'Will my website be mobile-friendly?',
        a: 'Yes, all our websites are fully responsive and optimized for all devices - desktops, tablets, and smartphones. Mobile-first design is a core part of our development process.',
      },
      {
        q: 'Do you optimize for search engines (SEO)?',
        a: 'Yes, we implement SEO best practices including proper HTML structure, meta tags, fast loading speeds, and mobile optimization. We can also provide ongoing SEO services.',
      },
    ],
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
}: {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}): React.ReactElement {
  return (
    <div
      className={cn(
        'border-border overflow-hidden rounded-xl border transition-all duration-200',
        isOpen
          ? 'bg-primary-50/50 border-primary-200'
          : 'bg-background hover:border-primary-200'
      )}
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

export default function FAQPage(): React.ReactElement {
  const [openItems, setOpenItems] = useState<Record<string, number | null>>({});

  const handleToggle = (category: string, index: number) => {
    setOpenItems((prev) => ({
      ...prev,
      [category]: prev[category] === index ? null : index,
    }));
  };

  return (
    <>
      {/* Hero */}
      <Section
        size="lg"
        background="primary"
        aria-labelledby="faq-heading"
        className="relative overflow-hidden"
      >
        <div className="absolute inset-0 -z-10" aria-hidden="true">
          <div className="motion-float motion-pulse-glow bg-primary-100 absolute -top-1/2 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full opacity-50 blur-3xl" />
        </div>
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
                FAQ
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
                id="faq-heading"
                className="text-foreground mb-6 text-4xl font-bold tracking-tight text-balance sm:text-5xl"
              >
                Frequently Asked{' '}
                <span className="text-primary-600">Questions</span>
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
              <Text
                variant="secondary"
                size="lg"
                className="mx-auto max-w-xl text-pretty sm:text-xl"
              >
                Find answers to common questions about our services, process,
                and pricing.
              </Text>
            </div>
          </div>
        </Container>
      </Section>

      {/* FAQ Categories */}
      {faqCategories.map((category, catIndex) => (
        <Section
          key={category.title}
          size="lg"
          background={catIndex % 2 === 0 ? 'secondary' : 'primary'}
          aria-labelledby={`faq-${category.title.toLowerCase()}-heading`}
        >
          <Container size="md">
            <div
              className="motion-slide-up mb-8"
              style={
                {
                  '--motion-delay': '0s',
                  '--motion-duration': '0.5s',
                } as React.CSSProperties
              }
            >
              <Heading
                level={2}
                id={`faq-${category.title.toLowerCase()}-heading`}
                className="text-xl"
              >
                {category.title}
              </Heading>
            </div>
            <div className="space-y-3">
              {category.questions.map((item, index) => (
                <div
                  key={item.q}
                  className="motion-slide-up"
                  style={
                    {
                      '--motion-delay': `${0.1 + index * 0.05}s`,
                      '--motion-duration': '0.4s',
                    } as React.CSSProperties
                  }
                >
                  <FAQItem
                    question={item.q}
                    answer={item.a}
                    isOpen={openItems[category.title] === index}
                    onToggle={() => handleToggle(category.title, index)}
                  />
                </div>
              ))}
            </div>
          </Container>
        </Section>
      ))}

      {/* CTA */}
      <Section size="lg" background="primary" aria-labelledby="faq-cta-heading">
        <Container size="sm">
          <div
            className="motion-slide-up text-center"
            style={
              {
                '--motion-delay': '0s',
                '--motion-duration': '0.5s',
              } as React.CSSProperties
            }
          >
            <Heading level={2} id="faq-cta-heading" className="mb-4">
              Still Have Questions?
            </Heading>
            <Text variant="secondary" className="mx-auto mb-8 max-w-md">
              Can&apos;t find what you&apos;re looking for? We&apos;re here to
              help.
            </Text>
            <Button asChild size="lg">
              <Link href="/contact">Contact Us</Link>
            </Button>
          </div>
        </Container>
      </Section>
    </>
  );
}
