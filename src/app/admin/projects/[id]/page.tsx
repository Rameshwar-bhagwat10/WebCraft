/**
 * Edit Project Page
 * Form to edit an existing project
 */

import { notFound } from 'next/navigation';

import { getProjectByIdAdmin } from '@/lib/projects/admin';
import { getProjectReviewAdmin } from '@/lib/reviews/admin';
import { createAdminClient } from '@/lib/supabase/server';

import { ProjectForm } from '../components/project-form';
import { ReviewForm } from '../components/review-form';

interface EditProjectPageProps {
  params: Promise<{ id: string }>;
}

export const metadata = {
  title: 'Edit Project | Admin Dashboard',
};

export default async function EditProjectPage({ params }: EditProjectPageProps) {
  const { id } = await params;
  const [project, review] = await Promise.all([
    getProjectByIdAdmin(id),
    getProjectReviewAdmin(id),
  ]);

  if (!project) {
    notFound();
  }

  // Get project images
  const supabase = createAdminClient();
  const { data: images } = await supabase
    .from('project_images')
    .select('*')
    .eq('project_id', id)
    .order('display_order', { ascending: true });

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Edit Project</h1>
        <p className="mt-1 text-sm text-neutral-500">
          Update project details, images, and client review
        </p>
      </div>

      <ProjectForm 
        project={project} 
        images={(images ?? []) as Array<{
          id: string;
          project_id: string;
          storage_path: string;
          alt_text: string;
          is_cover: boolean;
          display_order: number;
          width: number | null;
          height: number | null;
          file_size: number | null;
          created_at: string;
        }>} 
      />

      {/* Client Review Section */}
      <div className="rounded-xl border border-neutral-200 bg-white p-6">
        <h2 className="mb-4 text-lg font-semibold text-neutral-900">Client Review</h2>
        <p className="mb-4 text-sm text-neutral-500">
          Add a testimonial from the client for this project. Featured reviews appear on the homepage.
        </p>
        <ReviewForm projectId={id} review={review} />
      </div>
    </div>
  );
}
