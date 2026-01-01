'use client';

/**
 * Image Uploader Component
 * Drag & drop image upload with preview and management
 */

import Image from 'next/image';
import { useCallback, useState } from 'react';

import { cn } from '@/lib/utils';
import type { ProjectImage } from '@/types/database';

interface ImageUploaderProps {
  projectId: string;
  images: ProjectImage[];
  onImagesChange: (images: ProjectImage[]) => void;
}

export function ImageUploader({ projectId, images, onImagesChange }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadFiles = useCallback(async (files: File[]) => {
    setUploading(true);
    setError(null);

    try {
      const newImages: ProjectImage[] = [];
      for (const file of files) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('alt_text', file.name.replace(/\.[^/.]+$/, ''));

        const res = await fetch(`/api/admin/projects/${projectId}/images`, {
          method: 'POST',
          body: formData,
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || 'Upload failed');
        }

        if (data.image) {
          newImages.push(data.image);
        }
      }
      onImagesChange([...images, ...newImages]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  }, [projectId, images, onImagesChange]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = Array.from(e.dataTransfer.files).filter(f => 
      f.type.startsWith('image/')
    );
    if (files.length > 0) {
      await uploadFiles(files);
    }
  }, [uploadFiles]);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length > 0) {
      await uploadFiles(files);
    }
    e.target.value = '';
  };

  const handleDelete = async (imageId: string) => {
    if (!confirm('Delete this image?')) return;

    try {
      const res = await fetch(`/api/admin/projects/${projectId}/images?imageId=${imageId}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Delete failed');
      }

      onImagesChange(images.filter(img => img.id !== imageId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Delete failed');
    }
  };

  const handleSetCover = async (imageId: string) => {
    try {
      const res = await fetch(`/api/admin/projects/${projectId}/images`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageId, is_cover: true }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Update failed');
      }

      // Update local state - set this as cover, unset others
      onImagesChange(images.map(img => ({
        ...img,
        is_cover: img.id === imageId,
      })));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Update failed');
    }
  };

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';

  return (
    <div className="space-y-4">
      {error && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Drop zone */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={cn(
          'relative rounded-xl border-2 border-dashed p-8 text-center transition-colors',
          dragActive
            ? 'border-primary-500 bg-primary-50'
            : 'border-neutral-300 hover:border-neutral-400',
          uploading && 'pointer-events-none opacity-50'
        )}
      >
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          onChange={handleFileSelect}
          className="absolute inset-0 cursor-pointer opacity-0"
          disabled={uploading}
        />
        <div className="flex flex-col items-center gap-2">
          <svg className="h-10 w-10 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
          </svg>
          <p className="text-sm text-neutral-600">
            {uploading ? 'Uploading...' : 'Drag & drop images or click to browse'}
          </p>
          <p className="text-xs text-neutral-400">
            JPG, PNG, WebP up to 5MB
          </p>
        </div>
      </div>

      {/* Image grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {images.map((image) => (
            <div
              key={image.id}
              className={cn(
                'group relative aspect-video overflow-hidden rounded-lg border-2',
                image.is_cover ? 'border-primary-500' : 'border-transparent'
              )}
            >
              <Image
                src={`${supabaseUrl}/storage/v1/object/public/project-images/${image.storage_path}`}
                alt={image.alt_text}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
              />
              
              {/* Cover badge */}
              {image.is_cover && (
                <div className="absolute left-2 top-2 rounded bg-primary-600 px-2 py-0.5 text-xs font-medium text-white">
                  Cover
                </div>
              )}

              {/* Actions overlay */}
              <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                {!image.is_cover && (
                  <button
                    type="button"
                    onClick={() => handleSetCover(image.id)}
                    className="rounded-lg bg-white px-2 py-1 text-xs font-medium text-neutral-700 hover:bg-neutral-100"
                  >
                    Set Cover
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => handleDelete(image.id)}
                  className="rounded-lg bg-red-600 px-2 py-1 text-xs font-medium text-white hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
