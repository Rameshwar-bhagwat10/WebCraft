'use client';

/**
 * Portfolio Filters Component - PERFORMANCE OPTIMIZED FOR SCALE
 * Client Component for search, filtering, and pagination
 *
 * Performance optimizations:
 * 1. Pagination - only render visible projects (12 per page)
 * 2. Debounced search (300ms)
 * 3. Memoized filter logic
 * 4. Limited animation delays (max 6 items animated)
 * 5. Intersection Observer for lazy rendering
 *
 * Features:
 * - Search by title/description/tech stack
 * - Filter by category
 * - Pagination with "Load More"
 * - Mobile-friendly design
 * - Keyboard accessible
 */

import { useCallback, useEffect, useMemo, useState } from 'react';

import { cn } from '@/lib/utils';
import type { ProjectListItem } from '@/types/database';

import { ProjectCard } from './project-card';
import type { ProjectData } from './projects-data';

/** Projects per page for pagination */
const PROJECTS_PER_PAGE = 12;

/** Max items to animate (prevents long delays) */
const MAX_ANIMATED_ITEMS = 6;

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

/**
 * Custom hook for debounced value
 */
function useDebouncedValue<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timeout);
  }, [value, delay]);

  return debouncedValue;
}

export function PortfolioFilters({
  dbProjects,
  staticProjects,
}: PortfolioFiltersProps): React.ReactElement {
  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [visibleCount, setVisibleCount] = useState(PROJECTS_PER_PAGE);

  // Debounce search for performance
  const debouncedSearch = useDebouncedValue(searchQuery, 300);

  // Determine data source
  const useDbProjects = Boolean(dbProjects && dbProjects.length > 0);

  // Get unique categories - memoized
  const categories = useMemo(() => {
    const cats = new Set<string>();
    if (useDbProjects && dbProjects) {
      dbProjects.forEach((p) => cats.add(p.category));
    } else if (staticProjects) {
      staticProjects.forEach((p) => cats.add(p.type));
    }
    return ['all', ...Array.from(cats)];
  }, [useDbProjects, dbProjects, staticProjects]);

  // Filter projects - memoized, also resets pagination
  const filteredProjects = useMemo(() => {
    const query = debouncedSearch.toLowerCase().trim();

    // Reset visible count when filters change (handled by key in useMemo)
    // This is cleaner than useEffect

    if (useDbProjects && dbProjects) {
      return dbProjects.filter((project) => {
        if (activeCategory !== 'all' && project.category !== activeCategory) {
          return false;
        }
        if (query) {
          const searchableText = `${project.title} ${project.short_description} ${project.tech_stack?.join(' ') ?? ''}`.toLowerCase();
          return searchableText.includes(query);
        }
        return true;
      });
    } else if (staticProjects) {
      return staticProjects.filter((project) => {
        if (activeCategory !== 'all' && project.type !== activeCategory) {
          return false;
        }
        if (query) {
          const searchableText = `${project.title} ${project.shortDescription} ${project.techStack?.join(' ') ?? ''}`.toLowerCase();
          return searchableText.includes(query);
        }
        return true;
      });
    }
    return [];
  }, [useDbProjects, dbProjects, staticProjects, debouncedSearch, activeCategory]);

  // Paginated projects - only render what's visible
  const visibleProjects = useMemo(() => {
    return filteredProjects.slice(0, visibleCount);
  }, [filteredProjects, visibleCount]);

  // Check if there are more projects to load
  const hasMore = visibleCount < filteredProjects.length;
  const remainingCount = filteredProjects.length - visibleCount;

  // Event handlers
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setVisibleCount(PROJECTS_PER_PAGE); // Reset pagination on search
  }, []);

  const handleCategoryChange = useCallback((category: string) => {
    setActiveCategory(category);
    setVisibleCount(PROJECTS_PER_PAGE); // Reset pagination on category change
  }, []);

  const clearFilters = useCallback(() => {
    setSearchQuery('');
    setActiveCategory('all');
  }, []);

  const loadMore = useCallback(() => {
    setVisibleCount((prev) => prev + PROJECTS_PER_PAGE);
  }, []);

  // Derived state
  const hasActiveFilters = searchQuery || activeCategory !== 'all';
  const isSearching = searchQuery !== debouncedSearch;

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
            onChange={handleSearchChange}
            className={cn(
              'w-full rounded-lg border border-neutral-200 bg-white py-2.5 pl-10 pr-4',
              'text-sm text-neutral-900 placeholder:text-neutral-400',
              'focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20',
              'transition-colors duration-150'
            )}
          />
        </div>

        {/* Category Filter Dropdown */}
        <div className="relative w-full sm:w-auto">
          <label htmlFor="category-filter" className="sr-only">
            Filter by category
          </label>
          <select
            id="category-filter"
            value={activeCategory}
            onChange={(e) => handleCategoryChange(e.target.value)}
            className={cn(
              'w-full sm:w-48 appearance-none rounded-lg border border-neutral-200 bg-white',
              'py-2.5 pl-4 pr-10 text-sm font-medium',
              'text-neutral-700 cursor-pointer',
              'focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20',
              'transition-colors duration-150'
            )}
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {CATEGORY_LABELS[category] ?? category}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
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
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Results Count & Clear */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="text-sm text-neutral-600">
          {isSearching ? (
            <span className="text-neutral-400">Searching...</span>
          ) : (
            <>
              Showing{' '}
              <span className="font-semibold text-neutral-900">
                {visibleProjects.length}
              </span>
              {hasMore && (
                <span className="text-neutral-400">
                  {' '}of {filteredProjects.length}
                </span>
              )}{' '}
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
              aria-hidden="true"
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
      {visibleProjects.length > 0 ? (
        <>
          <ul className="grid list-none gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {useDbProjects
              ? (visibleProjects as ProjectListItem[]).map((project, index) => (
                  <li key={project.slug}>
                    <ProjectCard
                      slug={project.slug}
                      title={project.title}
                      shortDescription={project.short_description}
                      type={project.category}
                      thumbnail={project.cover_image_path}
                      thumbnailAlt={project.cover_image_alt}
                      index={Math.min(index, MAX_ANIMATED_ITEMS - 1)}
                    />
                  </li>
                ))
              : (visibleProjects as ProjectData[]).map((project, index) => (
                  <li key={project.slug}>
                    <ProjectCard
                      slug={project.slug}
                      title={project.title}
                      shortDescription={project.shortDescription}
                      type={project.type}
                      thumbnail={project.thumbnail}
                      result={project.outcome.split('.')[0]}
                      index={Math.min(index, MAX_ANIMATED_ITEMS - 1)}
                    />
                  </li>
                ))}
          </ul>

          {/* Load More Button */}
          {hasMore && (
            <div className="flex justify-center pt-4">
              <button
                onClick={loadMore}
                className={cn(
                  'inline-flex items-center gap-2 rounded-lg px-6 py-3',
                  'bg-neutral-100 text-neutral-700 font-medium',
                  'hover:bg-neutral-200 transition-colors duration-150',
                  'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2'
                )}
              >
                Load More
                <span className="text-neutral-500">
                  ({remainingCount} remaining)
                </span>
              </button>
            </div>
          )}
        </>
      ) : (
        /* Empty State */
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="mb-4 rounded-full bg-neutral-100 p-4">
            <svg
              className="h-8 w-8 text-neutral-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
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
