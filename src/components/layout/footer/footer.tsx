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
 * Logo icon - elegant calligraphic "W" in a circle
 */
function LogoIcon(): React.ReactElement {
  return (
    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-neutral-950">
      <span className="text-white text-2xl font-script leading-none">
        W
      </span>
    </div>
  );
}

/**
 * Footer brand section
 */
function FooterBrand(): React.ReactElement {
  return (
    <div className="text-center sm:text-left">
      <Link
        href="/"
        className="focus-visible:ring-primary-500 inline-flex items-center gap-2.5 rounded-md focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
        aria-label={`${siteConfig.name} - Home`}
      >
        <LogoIcon />
        <span className="text-neutral-950 font-display text-xl tracking-tight">
          {siteConfig.name}
        </span>
      </Link>
      <p className="text-foreground-muted mx-auto mt-4 max-w-xs text-sm leading-relaxed sm:mx-0">
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
    <div className="grid grid-cols-2 gap-8 text-center sm:grid-cols-3 sm:text-left">
      {footerNavGroups.map((group) => (
        <div key={group.title}>
          <h3 className="text-foreground text-sm font-semibold">
            {group.title}
          </h3>
          <ul className="mt-3 space-y-2 sm:mt-4 sm:space-y-3">
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
 * Footer contact info
 */
function FooterContact(): React.ReactElement {
  return (
    <div className="text-center sm:text-left">
      <h3 className="text-foreground text-sm font-semibold">Contact</h3>
      <address className="text-foreground-muted mt-3 space-y-2 text-sm not-italic sm:mt-4">
        <p>
          <a
            href={`mailto:${siteConfig.email}`}
            className="hover:text-foreground transition-colors"
          >
            {siteConfig.email}
          </a>
        </p>
        <p>
          <a
            href={`tel:+91${siteConfig.phone?.replace(/\D/g, '').slice(-10)}`}
            className="hover:text-foreground transition-colors"
          >
            {siteConfig.phone}
          </a>
        </p>
        <p className="text-foreground-muted">
          {siteConfig.location?.city}, {siteConfig.location?.state}, {siteConfig.location?.country}
        </p>
      </address>
      {/* Social links */}
      <div className="mt-4 flex justify-center gap-4 sm:justify-start">
        <a
          href={siteConfig.links.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="text-foreground-muted hover:text-foreground transition-colors"
          aria-label="LinkedIn"
        >
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
          </svg>
        </a>
        <a
          href={siteConfig.links.github}
          target="_blank"
          rel="noopener noreferrer"
          className="text-foreground-muted hover:text-foreground transition-colors"
          aria-label="GitHub"
        >
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
            />
          </svg>
        </a>
        {/* WhatsApp */}
        <a
          href={`https://wa.me/${siteConfig.whatsapp}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-foreground-muted hover:text-foreground transition-colors"
          aria-label="WhatsApp"
        >
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
        </a>
      </div>
    </div>
  );
}

/**
 * Footer bottom bar with copyright and legal links
 */
function FooterBottom(): React.ReactElement {
  const currentYear = new Date().getFullYear();

  return (
    <div className="border-border mt-10 border-t pt-6 sm:mt-12 sm:pt-8">
      <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:justify-between sm:text-left">
        <p className="text-foreground-muted text-xs sm:text-sm">
          © {currentYear} {siteConfig.name}. All rights reserved.
        </p>
        <nav aria-label="Legal">
          <ul className="flex flex-wrap items-center justify-center gap-3 sm:gap-6">
            {legalLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-foreground-muted hover:text-foreground focus-visible:ring-primary-500 rounded-sm text-xs transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none sm:text-sm"
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
        <div className="py-10 sm:py-12 lg:py-16">
          {/* Main footer content */}
          <div className="space-y-10 sm:grid sm:grid-cols-2 sm:gap-8 sm:space-y-0 lg:grid-cols-4 lg:gap-12">
            {/* Brand */}
            <div className="sm:col-span-2 lg:col-span-1">
              <FooterBrand />
            </div>

            {/* Navigation - spans 2 columns on lg */}
            <div className="sm:col-span-2 lg:col-span-2">
              <FooterNav />
            </div>

            {/* Contact */}
            <div className="sm:col-span-2 lg:col-span-1">
              <FooterContact />
            </div>
          </div>

          {/* Bottom bar */}
          <FooterBottom />
        </div>
      </Container>
    </footer>
  );
}
