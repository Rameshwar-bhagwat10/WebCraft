'use client';

/**
 * Project Form Component
 * Create/Edit project with image uploads
 */

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { cn } from '@/lib/utils';
import type { Project, ProjectCategory, ProjectImage } from '@/types/database';

import { ImageUploader } from './image-uploader';

interface ProjectFormProps {
  project?: Project;
  images?: ProjectImage[];
}

const categories: { value: ProjectCategory; label: string }[] = [
  { value: 'website', label: 'Website' },
  { value: 'webapp', label: 'Web Application' },
  { value: 'mobile', label: 'Mobile App' },
  { value: 'ecommerce', label: 'E-Commerce' },
  { value: 'dashboard', label: 'Dashboard' },
  { value: 'landing', label: 'Landing Page' },
  { value: 'other', label: 'Other' },
];

export function ProjectForm({ project, images = [] }: ProjectFormProps) {
  const router = useRouter();
  const isEditing = !!project;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Form state
  const [title, setTitle] = useState(project?.title ?? '');
  const [slug, setSlug] = useState(project?.slug ?? '');
  const [shortDescription, setShortDescription] = useState(project?.short_description ?? '');
  const [fullDescription, setFullDescription] = useState(project?.full_description ?? '');
  const [category, setCategory] = useState<ProjectCategory>(project?.category ?? 'website');
  const [techStack, setTechStack] = useState<string>((project?.tech_stack as string[])?.join(', ') ?? '');
  const [liveUrl, setLiveUrl] = useState(project?.live_url ?? '');
  const [githubUrl, setGithubUrl] = useState(project?.github_url ?? '');
  const [priority, setPriority] = useState(project?.priority ?? 50);
  const [isFeatured, setIsFeatured] = useState(project?.is_featured ?? false);
  const [status, setStatus] = useState<'draft' | 'published'>(project?.status ?? 'draft');
  const [metaTitle, setMetaTitle] = useState(project?.meta_title ?? '');
  const [metaDescription, setMetaDescription] = useState(project?.meta_description ?? '');

  // Image state
  const [projectImages, setProjectImages] = useState<ProjectImage[]>(images);
  const [projectId, setProjectId] = useState<string | null>(project?.id ?? null);

  // Auto-generate slug from title
  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  };

  const handleTitleChange = (value: string) => {
    setTitle(value);
    if (!isEditing || !slug) {
      setSlug(generateSlug(value));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const techStackArray = techStack
        .split(',')
        .map(t => t.trim())
        .filter(t => t.length > 0);

      const payload = {
        title,
        slug,
        short_description: shortDescription,
        full_description: fullDescription,
        category,
        tech_stack: techStackArray,
        live_url: liveUrl || null,
        github_url: githubUrl || null,
        priority,
        is_featured: isFeatured,
        status,
        meta_title: metaTitle || null,
        meta_description: metaDescription || null,
      };

      const url = isEditing 
        ? `/api/admin/projects/${project.id}` 
        : '/api/admin/projects';
      
      const res = await fetch(url, {
        method: isEditing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to save project');
      }

      // Set project ID for image uploads (new projects)
      if (!isEditing && data.project?.id) {
        setProjectId(data.project.id);
      }

      router.push('/admin/projects');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleImagesChange = (newImages: ProjectImage[]) => {
    setProjectImages(newImages);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Basic Info */}
      <div className="rounded-xl border border-neutral-200 bg-white p-6">
        <h2 className="mb-4 text-lg font-semibold text-neutral-900">Basic Information</h2>
        
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-sm font-medium text-neutral-700">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              required
              maxLength={100}
              className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              placeholder="Project title"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-sm font-medium text-neutral-700">
              Slug <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center gap-2">
              <span className="text-sm text-neutral-500">/work/</span>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(generateSlug(e.target.value))}
                required
                maxLength={100}
                className="flex-1 rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                placeholder="project-slug"
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-neutral-700">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as ProjectCategory)}
              className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            >
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-neutral-700">
              Tech Stack
            </label>
            <input
              type="text"
              value={techStack}
              onChange={(e) => setTechStack(e.target.value)}
              className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              placeholder="React, Node.js, PostgreSQL"
            />
            <p className="mt-1 text-xs text-neutral-500">Comma-separated list</p>
          </div>

          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-sm font-medium text-neutral-700">
              Short Description <span className="text-red-500">*</span>
            </label>
            <textarea
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
              required
              maxLength={200}
              rows={2}
              className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              placeholder="Brief description for project cards (10-200 characters)"
            />
            <p className="mt-1 text-xs text-neutral-500">{shortDescription.length}/200 characters</p>
          </div>

          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-sm font-medium text-neutral-700">
              Full Description <span className="text-red-500">*</span>
            </label>
            <textarea
              value={fullDescription}
              onChange={(e) => setFullDescription(e.target.value)}
              required
              maxLength={5000}
              rows={8}
              className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              placeholder="Detailed project description. Use markdown for formatting."
            />
            <p className="mt-1 text-xs text-neutral-500">{fullDescription.length}/5000 characters</p>
          </div>
        </div>
      </div>

      {/* Links */}
      <div className="rounded-xl border border-neutral-200 bg-white p-6">
        <h2 className="mb-4 text-lg font-semibold text-neutral-900">Links</h2>
        
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-neutral-700">
              Live URL
            </label>
            <input
              type="url"
              value={liveUrl}
              onChange={(e) => setLiveUrl(e.target.value)}
              className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              placeholder="https://example.com"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-neutral-700">
              GitHub URL
            </label>
            <input
              type="url"
              value={githubUrl}
              onChange={(e) => setGithubUrl(e.target.value)}
              className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              placeholder="https://github.com/..."
            />
          </div>
        </div>
      </div>

      {/* Images */}
      {(isEditing || projectId) && (
        <div className="rounded-xl border border-neutral-200 bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold text-neutral-900">Images</h2>
          <ImageUploader
            projectId={projectId ?? project?.id ?? ''}
            images={projectImages}
            onImagesChange={handleImagesChange}
          />
        </div>
      )}

      {!isEditing && !projectId && (
        <div className="rounded-xl border border-neutral-200 bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold text-neutral-900">Images</h2>
          <p className="text-sm text-neutral-500">
            Save the project first to upload images.
          </p>
        </div>
      )}

      {/* Settings */}
      <div className="rounded-xl border border-neutral-200 bg-white p-6">
        <h2 className="mb-4 text-lg font-semibold text-neutral-900">Settings</h2>
        
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-neutral-700">
              Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as 'draft' | 'published')}
              className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-neutral-700">
              Priority (0-100)
            </label>
            <input
              type="number"
              value={priority}
              onChange={(e) => setPriority(Math.max(0, Math.min(100, parseInt(e.target.value) || 0)))}
              min={0}
              max={100}
              className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            />
            <p className="mt-1 text-xs text-neutral-500">Higher = shown first</p>
          </div>

          <div className="flex items-center gap-3 pt-6">
            <input
              type="checkbox"
              id="featured"
              checked={isFeatured}
              onChange={(e) => setIsFeatured(e.target.checked)}
              className="h-4 w-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
            />
            <label htmlFor="featured" className="text-sm font-medium text-neutral-700">
              Featured on homepage
            </label>
          </div>
        </div>
      </div>

      {/* SEO */}
      <div className="rounded-xl border border-neutral-200 bg-white p-6">
        <h2 className="mb-4 text-lg font-semibold text-neutral-900">SEO</h2>
        
        <div className="grid gap-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-neutral-700">
              Meta Title
            </label>
            <input
              type="text"
              value={metaTitle}
              onChange={(e) => setMetaTitle(e.target.value)}
              maxLength={70}
              className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              placeholder="Custom page title (optional)"
            />
            <p className="mt-1 text-xs text-neutral-500">{metaTitle.length}/70 characters</p>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-neutral-700">
              Meta Description
            </label>
            <textarea
              value={metaDescription}
              onChange={(e) => setMetaDescription(e.target.value)}
              maxLength={160}
              rows={2}
              className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              placeholder="Custom meta description (optional)"
            />
            <p className="mt-1 text-xs text-neutral-500">{metaDescription.length}/160 characters</p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-lg border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className={cn(
            'rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700',
            loading && 'cursor-not-allowed opacity-50'
          )}
        >
          {loading ? 'Saving...' : isEditing ? 'Update Project' : 'Create Project'}
        </button>
      </div>
    </form>
  );
}
