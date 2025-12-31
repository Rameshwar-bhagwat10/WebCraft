/**
 * Unified Leads Admin Page
 * View and manage all leads with filtering, search, and pagination
 * Server Component - handles data fetching
 */

import { getAdminSession } from '@/lib/auth/session';
import { getContactLeads } from '@/services/leads';
import type { LeadSource } from '@/types/database';

import { LeadsFilters } from './leads-filters';
import { LeadsTable } from './leads-table';

export const metadata = {
  title: 'All Leads | Admin',
};

interface PageProps {
  searchParams: Promise<{
    status?: string;
    source?: string;
    search?: string;
    startDate?: string;
    endDate?: string;
    page?: string;
  }>;
}

export default async function LeadsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const session = await getAdminSession();
  
  // Parse filters from URL
  const filters = {
    status: params.status ?? 'all',
    source: (params.source as LeadSource) ?? undefined,
    search: params.search ?? undefined,
    startDate: params.startDate ?? undefined,
    endDate: params.endDate ?? undefined,
  };
  
  const page = parseInt(params.page ?? '1', 10);
  const perPage = 20;

  // Fetch leads with filters
  const { data: leads, total } = await getContactLeads(
    {
      status: filters.status !== 'all' ? filters.status : undefined,
      source: filters.source,
      search: filters.search,
      startDate: filters.startDate,
      endDate: filters.endDate,
    },
    { page, perPage }
  );

  const totalPages = Math.ceil(total / perPage);
  const canEdit = session?.role !== 'viewer';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">All Leads</h1>
          <p className="text-neutral-600">
            {total} lead{total !== 1 ? 's' : ''} found
          </p>
        </div>
      </div>

      {/* Filters */}
      <LeadsFilters
        currentStatus={filters.status}
        currentSource={filters.source}
        currentSearch={filters.search}
        currentStartDate={filters.startDate}
        currentEndDate={filters.endDate}
      />

      {/* Table */}
      <LeadsTable
        leads={leads}
        currentPage={page}
        totalPages={totalPages}
        total={total}
        canEdit={canEdit}
        filters={filters}
      />
    </div>
  );
}
