'use client';

/**
 * MobileMenu Component
 * Premium icon-only floating navigation panel
 * Icons animate FROM the hamburger icon and FLOW DOWNWARD
 *
 * Animation: Icons emerge from hamburger position and slide down to their slots
 */

import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';

import { cn } from '@/lib/utils';

/**
 * Navigation items with icons
 */
const navItems = [
  {
    href: '/',
    label: 'Home',
    icon: (
      <svg
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
        />
      </svg>
    ),
  },
  {
    href: '/services',
    label: 'Services',
    icon: (
      <svg
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
        />
      </svg>
    ),
  },
  {
    href: '/work',
    label: 'Work',
    icon: (
      <svg
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z"
        />
      </svg>
    ),
  },
  {
    href: '/pricing',
    label: 'Pricing',
    icon: (
      <svg
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  },
  {
    href: '/about',
    label: 'About',
    icon: (
      <svg
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
        />
      </svg>
    ),
  },
  {
    href: '/contact',
    label: 'Contact',
    icon: (
      <svg
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
        />
      </svg>
    ),
  },
];

// Icon slot height (icon + label + padding)
const ICON_SLOT_HEIGHT = 56;

/**
 * Animated hamburger icon - morphs to X
 */
function HamburgerIcon({ open }: { open: boolean }): React.ReactElement {
  return (
    <div className="relative h-5 w-5" aria-hidden="true">
      <span
        className={cn(
          'absolute right-0 left-0 h-0.5 rounded-full bg-current',
          'transition-all duration-200 ease-out motion-reduce:transition-none',
          open ? 'top-[9px] rotate-45' : 'top-1 rotate-0'
        )}
      />
      <span
        className={cn(
          'absolute top-[9px] right-0 left-0 h-0.5 rounded-full bg-current',
          'transition-all duration-200 ease-out motion-reduce:transition-none',
          open ? 'scale-x-0 opacity-0' : 'scale-x-100 opacity-100'
        )}
      />
      <span
        className={cn(
          'absolute right-0 left-0 h-0.5 rounded-full bg-current',
          'transition-all duration-200 ease-out motion-reduce:transition-none',
          open ? 'top-[9px] -rotate-45' : 'top-[17px] rotate-0'
        )}
      />
    </div>
  );
}

/**
 * Icon nav item with label below
 * Starts at hamburger position (top of panel) and flows down to its slot
 */
function NavIcon({
  href,
  label,
  icon,
  onClick,
  index,
  isOpen,
}: {
  href: string;
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  index: number;
  isOpen: boolean;
}): React.ReactElement {
  // Calculate how far this icon needs to travel from origin (top) to its slot
  const travelDistance = index * ICON_SLOT_HEIGHT;

  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        'group flex flex-col items-center justify-center gap-1 rounded-xl px-5 py-2.5',
        'text-foreground-secondary',
        'hover:bg-primary-50 hover:text-primary-600',
        'focus-visible:ring-primary-500 focus-visible:ring-2 focus-visible:outline-none',
        // Animation styles
        'transition-all duration-300 motion-reduce:transform-none motion-reduce:transition-none'
      )}
      style={{
        opacity: isOpen ? 1 : 0,
        transform: isOpen
          ? 'translateY(0)'
          : `translateY(-${travelDistance}px)`,
        transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
        transitionDelay: isOpen ? `${100 + index * 70}ms` : '0ms',
      }}
    >
      {icon}
      <span className="text-[11px] font-medium whitespace-nowrap">{label}</span>
    </Link>
  );
}

export function MobileMenu(): React.ReactElement {
  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const toggleButtonRef = useRef<HTMLButtonElement>(null);

  const closeMenu = useCallback(() => {
    setIsOpen(false);
    toggleButtonRef.current?.focus();
  }, []);

  // Close on escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeMenu();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, closeMenu]);

  // Prevent body scroll when open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Focus first icon when menu opens
  useEffect(() => {
    if (isOpen && panelRef.current) {
      const firstLink = panelRef.current.querySelector('a');
      setTimeout(() => firstLink?.focus(), 200);
    }
  }, [isOpen]);

  return (
    <div className="lg:hidden">
      {/* Hamburger toggle button */}
      <button
        ref={toggleButtonRef}
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={cn(
          'flex h-11 w-11 items-center justify-center rounded-xl',
          'transition-colors duration-200 motion-reduce:transition-none',
          isOpen
            ? 'bg-primary-50 text-primary-600'
            : 'text-foreground-secondary hover:text-foreground hover:bg-neutral-100',
          'focus-visible:ring-primary-500 focus-visible:ring-2 focus-visible:outline-none'
        )}
        aria-expanded={isOpen}
        aria-controls="mobile-nav-panel"
        aria-label={isOpen ? 'Close menu' : 'Open menu'}
      >
        <HamburgerIcon open={isOpen} />
      </button>

      {/* Backdrop overlay */}
      <div
        className={cn(
          'fixed inset-0 z-40 bg-neutral-950/20',
          'transition-opacity duration-300 ease-out motion-reduce:transition-none',
          isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        )}
        onClick={closeMenu}
        aria-hidden="true"
      />

      {/* Floating nav panel - positioned at hamburger origin */}
      <div
        ref={panelRef}
        id="mobile-nav-panel"
        className={cn(
          'fixed z-50 p-3',
          'rounded-2xl bg-white shadow-2xl',
          'border border-neutral-100',
          'overflow-hidden',
          // Panel animation
          'transition-all duration-250 ease-out motion-reduce:transition-none',
          isOpen
            ? 'scale-100 opacity-100'
            : 'pointer-events-none scale-95 opacity-0'
        )}
        style={{
          top: '72px',
          right: '16px',
          transformOrigin: 'top right',
        }}
        aria-hidden={!isOpen}
        role="navigation"
        aria-label="Mobile navigation"
      >
        {/* Icons container - icons flow from top (hamburger origin) downward */}
        <div className="flex flex-col items-center gap-1">
          {navItems.map((item, index) => (
            <NavIcon
              key={item.href}
              href={item.href}
              label={item.label}
              icon={item.icon}
              onClick={closeMenu}
              index={index}
              isOpen={isOpen}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
