/**
 * Admin Projects List Page
 * Displays all projects with management options
 */

import Link from 'next/link';

import { getAllProjectsAdmin } from '@/lib/projects/admin';

import { ProjectsTable } from './components/projects-table';

export const metadata = {
  title: 'Projects | Admin Dashboard',
};

export default async function AdminProjectsPage() {
  const projects = await getAllProjectsAdmin();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Projects</h1>
          <p className="mt-1 text-sm text-neutral-500">
            Manage your portfolio projects
          </p>
        </div>
        <Link
          href="/admin/projects/new"
          className="inline-flex items-center gap-2 rounded-xl bg-primary-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-primary-700"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Add Project
        </Link>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        <div className="rounded-xl border border-neutral-200 bg-white p-4">
          <p className="text-sm text-neutral-500">Total Projects</p>
          <p className="mt-1 text-2xl font-bold text-neutral-900">{projects.length}</p>
        </div>
        <div className="rounded-xl border border-neutral-200 bg-white p-4">
          <p className="text-sm text-neutral-500">Published</p>
          <p className="mt-1 text-2xl font-bold text-green-600">
            {projects.filter(p => p.status === 'published').length}
          </p>
        </div>
        <div className="rounded-xl border border-neutral-200 bg-white p-4">
          <p className="text-sm text-neutral-500">Drafts</p>
          <p className="mt-1 text-2xl font-bold text-amber-600">
            {projects.filter(p => p.status === 'draft').length}
          </p>
        </div>
        <div className="rounded-xl border border-neutral-200 bg-white p-4">
          <p className="text-sm text-neutral-500">Featured</p>
          <p className="mt-1 text-2xl font-bold text-primary-600">
            {projects.filter(p => p.is_featured).length}
          </p>
        </div>
      </div>

      {/* Projects Table */}
      <ProjectsTable projects={projects} />
    </div>
  );
}
