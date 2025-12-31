'use client';

/**
 * Admin Header Component
 * Top navigation bar for admin dashboard
 */

import type { User } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui';
import { createClient } from '@/lib/supabase/client';
import type { AdminRole } from '@/types/database';

interface AdminHeaderProps {
  user: User;
  role: AdminRole;
}

export function AdminHeader({ user, role }: AdminHeaderProps) {
  const router = useRouter();

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/admin/login');
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-40 border-b border-neutral-200 bg-white">
      <div className="flex h-16 items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-950">
            <span className="text-white text-lg font-script">W</span>
          </div>
          <span className="font-semibold text-neutral-900">WebCraft Admin</span>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm font-medium text-neutral-900">{user.email}</p>
            <p className="text-xs text-neutral-500 capitalize">{role.replace('_', ' ')}</p>
          </div>
          <Button variant="ghost" size="sm" onClick={handleSignOut}>
            Sign Out
          </Button>
        </div>
      </div>
    </header>
  );
}
