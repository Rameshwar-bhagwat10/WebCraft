'use client';

/**
 * NavLink Component
 * Navigation link with active state styling
 * Client Component - requires usePathname for active state
 */

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import type { NavItem } from '@/config/navigation';
import { cn } from '@/lib/utils';

interface NavLinkProps extends NavItem {
  className?: string;
  onClick?: () => void;
}

export function NavLink({
  label,
  href,
  external,
  className,
  onClick,
}: NavLinkProps): React.ReactElement {
  const pathname = usePathname();
  const isActive = pathname === href;

  const baseStyles = cn(
    'text-sm font-medium',
    'transition-all duration-200',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2',
    'rounded-full px-4 py-2',
    // Active state styling
    isActive
      ? 'text-primary-600 bg-primary-50/80'
      : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100/80',
    className
  );

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={baseStyles}
        onClick={onClick}
      >
        {label}
      </a>
    );
  }

  return (
    <Link
      href={href}
      className={baseStyles}
      aria-current={isActive ? 'page' : undefined}
      {...(onClick ? { onClick } : {})}
    >
      {label}
    </Link>
  );
}
