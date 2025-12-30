/**
 * NavLink Component
 * Navigation link with active state styling
 * Server Component
 */

import Link from 'next/link';

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
  const baseStyles = cn(
    'text-sm font-medium text-foreground-secondary',
    'transition-colors duration-200',
    'hover:text-foreground',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2',
    'rounded-md px-3 py-2',
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
    <Link href={href} className={baseStyles} {...(onClick ? { onClick } : {})}>
      {label}
    </Link>
  );
}
