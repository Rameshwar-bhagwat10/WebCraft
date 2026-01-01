/**
 * New Project Page
 * Form to create a new project
 */

import { ProjectForm } from '../components/project-form';

export const metadata = {
  title: 'New Project | Admin Dashboard',
};

export default function NewProjectPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Create New Project</h1>
        <p className="mt-1 text-sm text-neutral-500">
          Add a new project to your portfolio
        </p>
      </div>

      <ProjectForm />
    </div>
  );
}
