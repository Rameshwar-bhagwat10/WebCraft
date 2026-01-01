'use client';

/**
 * Projects Overview Component
 * Visual stats and charts for projects on dashboard
 */

import Link from 'next/link';

import { cn } from '@/lib/utils';

interface ProjectsOverviewProps {
  projects: {
    total: number;
    published: number;
    featured: number;
    drafts: number;
  };
  projectsByCategory: { category: string; count: number }[];
}

const categoryLabels: Record<string, string> = {
  website: 'Website',
  webapp: 'Web App',
  mobile: 'Mobile',
  ecommerce: 'E-Commerce',
  dashboard: 'Dashboard',
  landing: 'Landing',
  other: 'Other',
};

const categoryColors: Record<string, string> = {
  website: 'bg-blue-500',
  webapp: 'bg-purple-500',
  mobile: 'bg-amber-500',
  ecommerce: 'bg-green-500',
  dashboard: 'bg-cyan-500',
  landing: 'bg-pink-500',
  other: 'bg-neutral-400',
};

export function ProjectsOverview({ projects, projectsByCategory }: ProjectsOverviewProps) {
  const maxCount = Math.max(...projectsByCategory.map((c) => c.count), 1);

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Project Status Card */}
      <div className="rounded-2xl border border-neutral-200 bg-white p-6">
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-neutral-900">Project Status</h3>
          <Link
            href="/admin/projects"
            className="text-sm font-medium text-primary-600 hover:text-primary-700"
          >
            View all →
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <StatusCard
            label="Published"
            value={projects.published}
            total={projects.total}
            color="bg-green-500"
            icon={<CheckIcon />}
          />
          <StatusCard
            label="Drafts"
            value={projects.drafts}
            total={projects.total}
            color="bg-amber-500"
            icon={<PencilIcon />}
          />
          <StatusCard
            label="Featured"
            value={projects.featured}
            total={projects.total}
            color="bg-purple-500"
            icon={<StarIcon />}
          />
          <StatusCard
            label="Total"
            value={projects.total}
            total={projects.total}
            color="bg-blue-500"
            icon={<FolderIcon />}
          />
        </div>
      </div>

      {/* Projects by Category */}
      <div className="rounded-2xl border border-neutral-200 bg-white p-6">
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-neutral-900">By Category</h3>
          <Link
            href="/admin/projects/new"
            className="inline-flex items-center gap-1 rounded-lg bg-primary-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-primary-700"
          >
            <PlusIcon />
            Add Project
          </Link>
        </div>

        {projectsByCategory.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-neutral-100">
              <FolderIcon />
            </div>
            <p className="text-sm text-neutral-500">No projects yet</p>
            <Link
              href="/admin/projects/new"
              className="mt-2 text-sm font-medium text-primary-600 hover:text-primary-700"
            >
              Create your first project
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {projectsByCategory.map((item) => (
              <div key={item.category} className="group">
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="font-medium text-neutral-700">
                    {categoryLabels[item.category] ?? item.category}
                  </span>
                  <span className="text-neutral-500">{item.count}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-neutral-100">
                  <div
                    className={cn(
                      'h-full rounded-full transition-all duration-500',
                      categoryColors[item.category] ?? 'bg-neutral-400'
                    )}
                    style={{ width: `${(item.count / maxCount) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

interface StatusCardProps {
  label: string;
  value: number;
  total: number;
  color: string;
  icon: React.ReactNode;
}

function StatusCard({ label, value, total, color, icon }: StatusCardProps) {
  const percentage = total > 0 ? Math.round((value / total) * 100) : 0;

  return (
    <div className="rounded-xl border border-neutral-100 bg-neutral-50 p-4">
      <div className="mb-2 flex items-center justify-between">
        <span className={cn('flex h-8 w-8 items-center justify-center rounded-lg text-white', color)}>
          {icon}
        </span>
        <span className="text-2xl font-bold text-neutral-900">{value}</span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-sm text-neutral-500">{label}</span>
        <span className="text-xs text-neutral-400">{percentage}%</span>
      </div>
    </div>
  );
}

function CheckIcon() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}

function PencilIcon() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" />
    </svg>
  );
}

function StarIcon() {
  return (
    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}

function FolderIcon() {
  return (
    <svg className="h-4 w-4 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
  );
}
