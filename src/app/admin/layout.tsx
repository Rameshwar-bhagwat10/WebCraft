/**
 * Admin Layout
 * Protected layout for admin dashboard
 * Server Component - handles auth check
 */

import { redirect } from 'next/navigation';

import { createServerSupabaseClient } from '@/lib/supabase/server';
import type { AdminRole } from '@/types/database';

import { AdminHeader } from './components/admin-header';
import { AdminSidebar } from './components/admin-sidebar';

export const metadata = {
  title: 'Admin Dashboard | WebCraft',
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Check authentication
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/admin-login');
  }

  // Check if user is admin
  const { data } = await supabase
    .from('admin_users')
    .select('role')
    .eq('id', user.id)
    .single();

  const adminUser = data as { role: AdminRole } | null;

  if (!adminUser) {
    // User exists but not an admin
    await supabase.auth.signOut();
    redirect('/admin-login?error=unauthorized');
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <AdminHeader user={user} role={adminUser.role} />
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
