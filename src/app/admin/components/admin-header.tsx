'use client';

/**
 * Admin Header Component
 * Top navigation bar for admin dashboard
 */

import type { User } from '@supabase/supabase-js';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { createClient } from '@/lib/supabase/client';
import { cn } from '@/lib/utils';
import type { AdminRole } from '@/types/database';

interface AdminHeaderProps {
  user: User;
  role: AdminRole;
}

export function AdminHeader({ user, role }: AdminHeaderProps) {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/admin-login');
    router.refresh();
  };

  const initials = user.email?.slice(0, 2).toUpperCase() ?? 'AD';

  return (
    <header className="sticky top-0 z-40 border-b border-neutral-200 bg-white/80 backdrop-blur-xl">
      <div className="flex h-16 items-center justify-between px-4 lg:px-6">
        {/* Logo */}
        <Link href="/admin" className="flex items-center gap-3 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-linear-to-br from-neutral-900 to-neutral-700 shadow-lg transition-transform group-hover:scale-105">
            <span className="text-white text-lg font-script">W</span>
          </div>
          <div className="hidden sm:block">
            <span className="font-semibold text-neutral-900">WebCraft</span>
            <span className="ml-1.5 rounded-md bg-neutral-100 px-1.5 py-0.5 text-xs font-medium text-neutral-600">
              Admin
            </span>
          </div>
        </Link>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* View Site Link */}
          <Link
            href="/"
            target="_blank"
            className={cn(
              'hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg',
              'text-sm text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100',
              'transition-colors'
            )}
          >
            <ExternalLinkIcon />
            View Site
          </Link>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={cn(
                'flex items-center gap-2 rounded-xl p-1.5 pr-3',
                'hover:bg-neutral-100 transition-colors',
                isMenuOpen && 'bg-neutral-100'
              )}
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-linear-to-br from-primary-500 to-primary-600 text-white text-sm font-medium">
                {initials}
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-sm font-medium text-neutral-900 truncate max-w-[120px]">
                  {user.email?.split('@')[0]}
                </p>
                <p className="text-xs text-neutral-500 capitalize">{role.replace('_', ' ')}</p>
              </div>
              <ChevronDownIcon className={cn('transition-transform', isMenuOpen && 'rotate-180')} />
            </button>

            {/* Dropdown */}
            {isMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsMenuOpen(false)}
                />
                <div className="absolute right-0 top-full mt-2 z-50 w-56 rounded-xl border border-neutral-200 bg-white p-1.5 shadow-xl">
                  <div className="px-3 py-2 border-b border-neutral-100 mb-1">
                    <p className="text-sm font-medium text-neutral-900 truncate">{user.email}</p>
                    <p className="text-xs text-neutral-500 capitalize">{role.replace('_', ' ')}</p>
                  </div>
                  <Link
                    href="/"
                    target="_blank"
                    className="flex items-center gap-2 px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-100 rounded-lg sm:hidden"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <ExternalLinkIcon />
                    View Site
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <LogoutIcon />
                    Sign Out
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

function ExternalLinkIcon() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
    </svg>
  );
}

function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <svg className={cn('h-4 w-4 text-neutral-400', className)} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  );
}

function LogoutIcon() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
    </svg>
  );
}
