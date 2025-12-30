/**
 * Contact Alternatives Section
 * WhatsApp and Email CTAs as secondary contact options
 *
 * Server Component - no client JS needed
 */

import { Text } from '@/components/ui';
import { cn } from '@/lib/utils';

/**
 * Alternative contact methods
 */
const alternatives = [
  {
    name: 'WhatsApp',
    description: 'Chat with us directly',
    href: 'https://wa.me/15551234567?text=Hi%20WebCraft%2C%20I%27d%20like%20to%20discuss%20a%20project.',
    external: true,
    icon: (
      <svg
        className="h-5 w-5"
        fill="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
      </svg>
    ),
    iconColor: 'text-[#25D366]',
    bgColor: 'hover:bg-[#25D366]/5',
  },
  {
    name: 'Schedule a Call',
    description: 'Book a free consultation',
    href: '#',
    external: false,
    icon: (
      <svg
        className="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      </svg>
    ),
    iconColor: 'text-primary-600',
    bgColor: 'hover:bg-primary-50',
  },
];

export function ContactAlternatives(): React.ReactElement {
  return (
    <div
      className="motion-slide-up mt-8"
      style={
        {
          '--motion-delay': '0.2s',
          '--motion-duration': '0.5s',
        } as React.CSSProperties
      }
    >
      <Text variant="muted" size="sm" className="mb-4 text-center">
        Or reach us through
      </Text>

      <div className="grid gap-3 sm:grid-cols-2">
        {alternatives.map((item) => (
          <a
            key={item.name}
            href={item.href}
            target={item.external ? '_blank' : undefined}
            rel={item.external ? 'noopener noreferrer' : undefined}
            className={cn(
              'border-border bg-background group flex items-center gap-4 rounded-xl border p-4 transition-all duration-200',
              'hover:border-primary-200 hover:shadow-sm',
              item.bgColor
            )}
          >
            <div
              className={cn(
                'flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-neutral-100 transition-colors group-hover:bg-white',
                item.iconColor
              )}
            >
              {item.icon}
            </div>
            <div>
              <p className="text-foreground font-medium">{item.name}</p>
              <p className="text-foreground-muted text-sm">
                {item.description}
              </p>
            </div>
            <svg
              className="text-foreground-muted ml-auto h-5 w-5 transition-transform group-hover:translate-x-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </a>
        ))}
      </div>
    </div>
  );
}
