'use client';

/**
 * Portfolio Filters Component
 * Client Component for search and filtering projects
 *
 * Features:
 * - Search by title/description
 * - Filter by category
 * - Mobile-friendly design
 * - URL state sync (optional)
 * - Keyboard accessible
 *
 * Performance:
 * - Debounced search
 * - Client-side filtering (no server round-trips)
 * - Minimal re-renders
 */

import { useCallback, useMemo, useState, useTransition } from 'react';

import { cn } from '@/lib/utils';
import type { ProjectListItem } from '@/types/database';

import { ProjectCard } from './project-card';
import type { ProjectData } from './projects-data';

/**
 * Category labels for display
 */
const CATEGORY_LABELS: Record<string, string> = {
  all: 'All Projects',
  website: 'Websites',
  webapp: 'Web Apps',
  mobile: 'Mobile Apps',
  ecommerce: 'E-Commerce',
  dashboard: 'Dashboards',
  landing: 'Landing Pages',
  other: 'Other',
  // Static data types
  'Web App': 'Web Apps',
  'Mobile App': 'Mobile Apps',
  Website: 'Websites',
  Dashboard: 'Dashboards',
};

interface PortfolioFiltersProps {
  /** Projects from database */
  dbProjects?: ProjectListItem[] | undefined;
  /** Static fallback projects */
  staticProjects?: ProjectData[] | undefined;
}

export function PortfolioFilters({
  dbProjects,
  staticProjects,
}: PortfolioFiltersProps): React.ReactElement {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [isPending, startTransition] = useTransition();

  // Determine data source
  const useDbProjects = dbProjects && dbProjects.length > 0;

  // Get unique categories from projects
  const categories = useMemo(() => {
    const cats = new Set<string>();
    if (useDbProjects && dbProjects) {
      dbProjects.forEach((p) => cats.add(p.category));
    } else if (staticProjects) {
      staticProjects.forEach((p) => cats.add(p.type));
    }
    return ['all', ...Array.from(cats)];
  }, [useDbProjects, dbProjects, staticProjects]);

  // Filter projects based on search and category
  const filteredProjects = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();

    if (useDbProjects && dbProjects) {
      return dbProjects.filter((project) => {
        // Category filter
        if (activeCategory !== 'all' && project.category !== activeCategory) {
          return false;
        }
        // Search filter
        if (query) {
          const searchableText = `${project.title} ${project.short_description} ${project.tech_stack?.join(' ') ?? ''}`.toLowerCase();
          return searchableText.includes(query);
        }
        return true;
      });
    } else if (staticProjects) {
      return staticProjects.filter((project) => {
        // Category filter
        if (activeCategory !== 'all' && project.type !== activeCategory) {
          return false;
        }
        // Search filter
        if (query) {
          const searchableText = `${project.title} ${project.shortDescription} ${project.techStack?.join(' ') ?? ''}`.toLowerCase();
          return searchableText.includes(query);
        }
        return true;
      });
    }
    return [];
  }, [useDbProjects, dbProjects, staticProjects, searchQuery, activeCategory]);

  // Handle search with transition for smooth UI
  const handleSearch = useCallback((value: string) => {
    startTransition(() => {
      setSearchQuery(value);
    });
  }, []);

  // Handle category change
  const handleCategoryChange = useCallback((category: string) => {
    startTransition(() => {
      setActiveCategory(category);
    });
  }, []);

  // Clear all filters
  const clearFilters = useCallback(() => {
    startTransition(() => {
      setSearchQuery('');
      setActiveCategory('all');
    });
  }, []);

  const hasActiveFilters = searchQuery || activeCategory !== 'all';

  return (
    <div className="space-y-8">
      {/* Search and Filter Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Search Input */}
        <div className="relative w-full sm:max-w-xs">
          <label htmlFor="project-search" className="sr-only">
            Search projects
          </label>
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <svg
              className="h-5 w-5 text-neutral-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <input
            id="project-search"
            type="search"
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className={cn(
              'w-full rounded-lg border border-neutral-200 bg-white py-2.5 pl-10 pr-4',
              'text-sm text-neutral-900 placeholder:text-neutral-400',
              'focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20',
              'transition-colors duration-200'
            )}
          />
        </div>

        {/* Category Filter Pills - Scrollable on mobile */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 -mx-4 px-4 sm:mx-0 sm:px-0">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryChange(category)}
              className={cn(
                'whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-all duration-200',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2',
                activeCategory === category
                  ? 'bg-primary-600 text-white shadow-sm'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
              )}
              aria-pressed={activeCategory === category}
            >
              {CATEGORY_LABELS[category] ?? category}
            </button>
          ))}
        </div>
      </div>

      {/* Active Filters & Results Count */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="text-sm text-neutral-600">
          {isPending ? (
            <span className="inline-flex items-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-600 border-t-transparent" />
              Filtering...
            </span>
          ) : (
            <>
              Showing{' '}
              <span className="font-semibold text-neutral-900">
                {filteredProjects.length}
              </span>{' '}
              {filteredProjects.length === 1 ? 'project' : 'projects'}
              {hasActiveFilters && (
                <span className="text-neutral-400"> (filtered)</span>
              )}
            </>
          )}
        </p>

        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="inline-flex items-center gap-1.5 text-sm text-primary-600 hover:text-primary-700 transition-colors"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
            Clear filters
          </button>
        )}
      </div>

      {/* Projects Grid */}
      {filteredProjects.length > 0 ? (
        <ul className="grid list-none gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {useDbProjects
            ? (filteredProjects as ProjectListItem[]).map((project, index) => (
                <li key={project.slug}>
                  <ProjectCard
                    slug={project.slug}
                    title={project.title}
                    shortDescription={project.short_description}
                    type={project.category}
                    thumbnail={project.cover_image_path}
                    thumbnailAlt={project.cover_image_alt}
                    index={index}
                  />
                </li>
              ))
            : (filteredProjects as ProjectData[]).map((project, index) => (
                <li key={project.slug}>
                  <ProjectCard
                    slug={project.slug}
                    title={project.title}
                    shortDescription={project.shortDescription}
                    type={project.type}
                    thumbnail={project.thumbnail}
                    result={project.outcome.split('.')[0]}
                    index={index}
                  />
                </li>
              ))}
        </ul>
      ) : (
        /* Empty State */
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="mb-4 rounded-full bg-neutral-100 p-4">
            <svg
              className="h-8 w-8 text-neutral-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 className="mb-2 text-lg font-semibold text-neutral-900">
            No projects found
          </h3>
          <p className="mb-4 max-w-sm text-sm text-neutral-600">
            We couldn&apos;t find any projects matching your criteria. Try
            adjusting your search or filters.
          </p>
          <button
            onClick={clearFilters}
            className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 transition-colors"
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
}
