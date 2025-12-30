/**
 * Footer Component
 * Responsive footer with navigation and legal links
 * Server Component
 */

import Link from 'next/link';

import { Container } from '@/components/layout';
import { footerNavGroups, legalLinks } from '@/config/navigation';
import { siteConfig } from '@/config/site';

/**
 * Footer brand section
 */
function FooterBrand(): React.ReactElement {
  return (
    <div className="lg:max-w-xs">
      <Link
        href="/"
        className="text-foreground focus-visible:ring-primary-500 rounded-md text-xl font-bold focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
        aria-label={`${siteConfig.name} - Home`}
      >
        {siteConfig.name}
      </Link>
      <p className="text-foreground-muted mt-4 text-sm leading-relaxed">
        {siteConfig.description}
      </p>
    </div>
  );
}

/**
 * Footer navigation groups
 */
function FooterNav(): React.ReactElement {
  return (
    <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:gap-12">
      {footerNavGroups.map((group) => (
        <div key={group.title}>
          <h3 className="text-foreground text-sm font-semibold">
            {group.title}
          </h3>
          <ul className="mt-4 space-y-3">
            {group.links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-foreground-muted hover:text-foreground focus-visible:ring-primary-500 rounded-sm text-sm transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

/**
 * Footer contact info placeholder
 */
function FooterContact(): React.ReactElement {
  return (
    <div>
      <h3 className="text-foreground text-sm font-semibold">Contact</h3>
      <address className="text-foreground-muted mt-4 space-y-2 text-sm not-italic">
        <p>hello@webcraft.com</p>
        <p>+1 (555) 123-4567</p>
      </address>
    </div>
  );
}

/**
 * Footer bottom bar with copyright and legal links
 */
function FooterBottom(): React.ReactElement {
  const currentYear = new Date().getFullYear();

  return (
    <div className="border-border mt-12 border-t pt-8">
      <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
        <p className="text-foreground-muted text-sm">
          © {currentYear} {siteConfig.name}. All rights reserved.
        </p>
        <nav aria-label="Legal">
          <ul className="flex flex-wrap items-center gap-4 sm:gap-6">
            {legalLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-foreground-muted hover:text-foreground focus-visible:ring-primary-500 rounded-sm text-sm transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
}

export function Footer(): React.ReactElement {
  return (
    <footer className="bg-background-secondary" role="contentinfo">
      <Container>
        <div className="py-12 lg:py-16">
          {/* Main footer content */}
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            {/* Brand and contact */}
            <div className="space-y-8">
              <FooterBrand />
              <FooterContact />
            </div>

            {/* Navigation */}
            <FooterNav />
          </div>

          {/* Bottom bar */}
          <FooterBottom />
        </div>
      </Container>
    </footer>
  );
}
