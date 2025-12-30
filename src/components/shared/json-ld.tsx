/**
 * JsonLd Component
 * Renders JSON-LD structured data with XSS sanitization
 *
 * @see https://nextjs.org/docs/app/guides/json-ld
 */

import { sanitizeJsonLd } from '@/lib/seo';

interface JsonLdProps<T> {
  data: T;
}

/**
 * Component to render JSON-LD script tag
 * Sanitizes data to prevent XSS attacks by escaping < characters
 */
export function JsonLd<T>({ data }: JsonLdProps<T>): React.ReactElement {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: sanitizeJsonLd(data),
      }}
    />
  );
}
