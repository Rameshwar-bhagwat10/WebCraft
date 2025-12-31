/**
 * Admin Audit Logs Page
 * View all admin actions - Super Admin only
 */

import { redirect } from 'next/navigation';

import { getAdminSession } from '@/lib/auth/session';
import { getAuditLogs } from '@/services/audit';

import { AuditFilters } from './audit-filters';
import { AuditTable } from './audit-table';

export const metadata = {
  title: 'Audit Logs | Admin',
};

interface PageProps {
  searchParams: Promise<{
    action?: string;
    resourceType?: string;
    startDate?: string;
    endDate?: string;
    page?: string;
  }>;
}

export default async function AuditLogsPage({ searchParams }: PageProps) {
  // Check if user is super_admin
  const session = await getAdminSession();
  
  if (!session) {
    redirect('/admin-login');
  }

  if (session.role !== 'super_admin') {
    redirect('/admin/forbidden');
  }

  const params = await searchParams;
  
  // Parse filters
  const filters = {
    action: params.action ?? undefined,
    resourceType: params.resourceType ?? undefined,
    startDate: params.startDate ?? undefined,
    endDate: params.endDate ?? undefined,
  };

  const page = parseInt(params.page ?? '1', 10);
  const perPage = 50;

  // Fetch audit logs
  const { data: logs, total } = await getAuditLogs(filters, { page, perPage });
  const totalPages = Math.ceil(total / perPage);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Audit Logs</h1>
        <p className="text-neutral-600">
          Track all admin actions and system events ({total} entries)
        </p>
      </div>

      {/* Filters */}
      <AuditFilters
        currentAction={filters.action}
        currentResourceType={filters.resourceType}
        currentStartDate={filters.startDate}
        currentEndDate={filters.endDate}
      />

      {/* Table */}
      <AuditTable
        logs={logs}
        currentPage={page}
        totalPages={totalPages}
        total={total}
        filters={filters}
      />
    </div>
  );
}
