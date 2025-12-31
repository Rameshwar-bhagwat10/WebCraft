/**
 * Admin Layout
 * Protected layout for admin dashboard
 * Server Component - handles auth check
 * 
 * Set ENABLE_ADMIN=true in .env.local to enable admin panel
 * In production (Vercel), don't set this variable to disable admin
 */

import { notFound, redirect } from 'next/navigation';

import { getAdminSession } from '@/lib/auth';
import { createServerSupabaseClient } from '@/lib/supabase/server';

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
  // Check if admin panel is enabled (only works locally)
  const isAdminEnabled = process.env.ENABLE_ADMIN === 'true';
  
  if (!isAdminEnabled) {
    // Return 404 in production
    notFound();
  }

  // Get admin session using centralized auth
  const session = await getAdminSession();

  if (!session) {
    redirect('/admin-login');
  }

  // Get full user object for header
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/admin-login');
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <AdminHeader user={user} role={session.role} />
      <div className="flex">
        <AdminSidebar role={session.role} />
        <main className="flex-1 p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
