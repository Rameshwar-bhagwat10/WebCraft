'use client';

/**
 * MobileMenu Component
 * Accessible mobile navigation menu with toggle
 * Client Component - requires interactivity
 */

import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';

import { Button } from '@/components/ui';
import { ctaConfig, mainNavItems } from '@/config/navigation';
import { cn } from '@/lib/utils';

import { NavLink } from './nav-link';

/**
 * Hamburger icon for menu toggle
 */
function MenuIcon({ open }: { open: boolean }): React.ReactElement {
  return (
    <svg
      className="h-6 w-6"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      aria-hidden="true"
    >
      {open ? (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M6 18L18 6M6 6l12 12"
        />
      ) : (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
        />
      )}
    </svg>
  );
}

export function MobileMenu(): React.ReactElement {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const closeMenu = useCallback(() => {
    setIsOpen(false);
  }, []);

  // Close menu on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <div className="lg:hidden">
      {/* Menu toggle button */}
      <button
        type="button"
        onClick={toggleMenu}
        className={cn(
          'inline-flex items-center justify-center rounded-lg p-2',
          'text-foreground-secondary hover:text-foreground hover:bg-neutral-100',
          'focus-visible:ring-primary-500 focus-visible:ring-2 focus-visible:outline-none'
        )}
        aria-expanded={isOpen}
        aria-controls="mobile-menu"
        aria-label={isOpen ? 'Close menu' : 'Open menu'}
      >
        <MenuIcon open={isOpen} />
      </button>

      {/* Mobile menu panel */}
      <div
        id="mobile-menu"
        className={cn(
          'fixed inset-x-0 top-16 bottom-0 z-40',
          'bg-background',
          'transform transition-transform duration-300 ease-in-out',
          isOpen ? 'translate-x-0' : 'translate-x-full'
        )}
        aria-hidden={!isOpen}
      >
        <nav
          className="flex h-full flex-col px-6 py-6"
          aria-label="Mobile navigation"
        >
          {/* Navigation links */}
          <ul className="flex flex-col gap-1">
            {mainNavItems.map((item) => (
              <li key={item.href}>
                <NavLink
                  {...item}
                  onClick={closeMenu}
                  className="block w-full py-3 text-base"
                />
              </li>
            ))}
          </ul>

          {/* CTA button */}
          <div className="border-border mt-6 border-t pt-6">
            <Button asChild fullWidth>
              <Link href={ctaConfig.href} onClick={closeMenu}>
                {ctaConfig.label}
              </Link>
            </Button>
          </div>
        </nav>
      </div>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-neutral-950/20 lg:hidden"
          onClick={closeMenu}
          aria-hidden="true"
        />
      )}
    </div>
  );
}
