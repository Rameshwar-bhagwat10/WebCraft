/**
 * Contact Submissions Admin Page
 * View and manage contact form submissions
 */

import { createServerSupabaseClient } from '@/lib/supabase/server';
import type { ContactSubmission } from '@/types/database';

import { ContactsTable } from './contacts-table';

export const metadata = {
  title: 'Contact Leads | Admin',
};

interface PageProps {
  searchParams: Promise<{
    status?: string;
    page?: string;
  }>;
}

export default async function ContactsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const status = params.status ?? 'all';
  const page = parseInt(params.page ?? '1', 10);
  const perPage = 20;

  const supabase = await createServerSupabaseClient();

  let query = supabase
    .from('contact_submissions')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range((page - 1) * perPage, page * perPage - 1);

  if (status !== 'all') {
    query = query.eq('status', status as ContactSubmission['status']);
  }

  const { data, count } = await query;
  const contacts = (data as ContactSubmission[] | null) ?? [];

  const totalPages = Math.ceil((count ?? 0) / perPage);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Contact Leads</h1>
        <p className="text-neutral-600">Manage contact form submissions</p>
      </div>

      <ContactsTable
        contacts={contacts}
        currentPage={page}
        totalPages={totalPages}
        currentStatus={status}
      />
    </div>
  );
}
