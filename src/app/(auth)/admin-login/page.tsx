/**
 * Admin Login Page
 * Secure login for admin users
 * Located outside /admin to avoid auth redirect loop
 */

import { redirect } from 'next/navigation';

import { createServerSupabaseClient } from '@/lib/supabase/server';

import { LoginForm } from './login-form';

export const metadata = {
  title: 'Admin Login | WebCraft',
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  // Check if already logged in
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    // Check if admin
    const { data } = await supabase
      .from('admin_users')
      .select('id')
      .eq('id', user.id)
      .single();

    if (data) {
      redirect('/admin');
    }
  }

  const params = await searchParams;
  const error = params.error;

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-50 px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-neutral-950">
            <span className="text-white text-3xl font-script">W</span>
          </div>
          <h1 className="text-2xl font-bold text-neutral-900">Admin Login</h1>
          <p className="mt-2 text-neutral-600">Sign in to access the dashboard</p>
        </div>

        {error === 'unauthorized' && (
          <div className="mb-4 rounded-lg bg-red-50 p-4 text-sm text-red-700">
            You do not have admin access. Please contact support.
          </div>
        )}

        <div className="rounded-xl bg-white p-8 shadow-sm border border-neutral-200">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
