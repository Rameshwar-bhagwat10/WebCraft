/**
 * Contact Form Section
 * Wraps the form with layout and alternatives
 *
 * Server Component wrapper for Client Component form
 */

import { Container, Section } from '@/components/layout';

import { ContactAlternatives } from './contact-alternatives';
import { ContactForm } from './contact-form';

export function ContactFormSection(): React.ReactElement {
  return (
    <Section size="lg" background="secondary" aria-label="Contact form">
      <Container size="sm">
        <div className="mx-auto max-w-xl">
          {/* Form card */}
          <div className="border-border bg-background rounded-2xl border p-6 shadow-sm sm:p-8">
            <ContactForm />
          </div>

          {/* Alternative contact methods */}
          <ContactAlternatives />
        </div>
      </Container>
    </Section>
  );
}
