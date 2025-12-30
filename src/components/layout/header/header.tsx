/**
 * Header Component
 * Responsive header with sticky behavior
 * Server Component with client sub-components
 */

import Link from 'next/link';

import { Container } from '@/components/layout';
import { Button } from '@/components/ui';
import { ctaConfig, mainNavItems } from '@/config/navigation';
import { siteConfig } from '@/config/site';

import { MobileMenu } from './mobile-menu';
import { NavLink } from './nav-link';
import { StickyHeader } from './sticky-header';

/**
 * Brand logo/name component
 */
function Brand(): React.ReactElement {
  return (
    <Link
      href="/"
      className="text-foreground focus-visible:ring-primary-500 flex items-center gap-2 rounded-md text-xl font-bold focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
      aria-label={`${siteConfig.name} - Home`}
    >
      {siteConfig.name}
    </Link>
  );
}

/**
 * Desktop navigation
 */
function DesktopNav(): React.ReactElement {
  return (
    <nav
      className="hidden lg:flex lg:items-center lg:gap-1"
      aria-label="Main navigation"
    >
      {mainNavItems.map((item) => (
        <NavLink key={item.href} {...item} />
      ))}
    </nav>
  );
}

/**
 * Header actions (CTA button)
 */
function HeaderActions(): React.ReactElement {
  return (
    <div className="hidden lg:flex lg:items-center lg:gap-4">
      <Button asChild size="sm">
        <Link href={ctaConfig.href}>{ctaConfig.label}</Link>
      </Button>
    </div>
  );
}

export function Header(): React.ReactElement {
  return (
    <StickyHeader>
      <Container>
        <div className="flex h-16 items-center justify-between">
          {/* Brand */}
          <Brand />

          {/* Desktop navigation */}
          <DesktopNav />

          {/* Actions & Mobile menu */}
          <div className="flex items-center gap-4">
            <HeaderActions />
            <MobileMenu />
          </div>
        </div>
      </Container>
    </StickyHeader>
  );
}
