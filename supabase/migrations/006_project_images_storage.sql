-- ============================================
-- WEBCRAFT DATABASE SCHEMA
-- Phase 18b: Project Images Storage Bucket
-- ============================================
-- Run this in Supabase SQL Editor AFTER 005_projects_system.sql
-- ============================================

-- ============================================
-- STEP 1: CREATE STORAGE BUCKET
-- ============================================

-- Create the project-images bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'project-images',
  'project-images',
  true,  -- Public bucket for CDN delivery
  5242880,  -- 5MB max file size
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/avif']
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- ============================================
-- STEP 2: STORAGE POLICIES
-- ============================================

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Public can view project images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can upload project images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update project images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete project images" ON storage.objects;

-- Public: Read-only access to all images in the bucket
CREATE POLICY "Public can view project images"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'project-images');

-- Admins: Upload images
CREATE POLICY "Admins can upload project images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'project-images'
  AND EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE id = auth.uid()
  )
);

-- Admins: Update images
CREATE POLICY "Admins can update project images"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'project-images'
  AND EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE id = auth.uid()
  )
)
WITH CHECK (
  bucket_id = 'project-images'
  AND EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE id = auth.uid()
  )
);

-- Admins: Delete images
CREATE POLICY "Admins can delete project images"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'project-images'
  AND EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE id = auth.uid()
  )
);

-- ============================================
-- DONE
-- ============================================
-- Phase 18b storage bucket setup complete
--
-- To verify:
-- SELECT * FROM storage.buckets WHERE id = 'project-images';
-- SELECT * FROM storage.policies WHERE bucket_id = 'project-images';

