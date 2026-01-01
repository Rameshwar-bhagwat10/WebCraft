-- ============================================
-- WEBCRAFT DATABASE SCHEMA
-- Phase 18: Projects / Work System
-- ============================================
-- Run this in Supabase SQL Editor AFTER 004_backend_hardening.sql
-- ============================================

-- ============================================
-- STEP 1: CREATE ENUMS
-- ============================================

-- Project status enum
CREATE TYPE project_status AS ENUM ('draft', 'published');

-- Project category enum
CREATE TYPE project_category AS ENUM (
  'website',
  'webapp', 
  'mobile',
  'ecommerce',
  'dashboard',
  'landing',
  'other'
);

-- ============================================
-- STEP 2: PROJECTS TABLE
-- ============================================

CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Core fields
  title TEXT NOT NULL CHECK (char_length(title) >= 1 AND char_length(title) <= 100),
  slug TEXT NOT NULL UNIQUE CHECK (char_length(slug) >= 1 AND char_length(slug) <= 100),
  short_description TEXT NOT NULL CHECK (char_length(short_description) >= 10 AND char_length(short_description) <= 200),
  full_description TEXT NOT NULL CHECK (char_length(full_description) >= 50 AND char_length(full_description) <= 5000),
  
  -- Categorization
  category project_category NOT NULL,
  tech_stack JSONB NOT NULL DEFAULT '[]',
  
  -- Status & visibility
  status project_status NOT NULL DEFAULT 'draft',
  is_featured BOOLEAN NOT NULL DEFAULT FALSE,
  
  -- Ordering & ranking
  priority INTEGER NOT NULL DEFAULT 0 CHECK (priority >= 0 AND priority <= 100),
  display_order INTEGER NOT NULL DEFAULT 0,
  
  -- External links
  live_url TEXT CHECK (live_url IS NULL OR char_length(live_url) <= 500),
  github_url TEXT CHECK (github_url IS NULL OR char_length(github_url) <= 500),
  
  -- SEO
  meta_title TEXT CHECK (meta_title IS NULL OR char_length(meta_title) <= 70),
  meta_description TEXT CHECK (meta_description IS NULL OR char_length(meta_description) <= 160),
  
  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  published_at TIMESTAMPTZ,
  deleted_at TIMESTAMPTZ
);

-- ============================================
-- STEP 3: PROJECT IMAGES TABLE
-- ============================================

CREATE TABLE project_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  
  -- Image data
  storage_path TEXT NOT NULL CHECK (char_length(storage_path) <= 500),
  alt_text TEXT NOT NULL CHECK (char_length(alt_text) >= 1 AND char_length(alt_text) <= 200),
  
  -- Metadata
  is_cover BOOLEAN NOT NULL DEFAULT FALSE,
  display_order INTEGER NOT NULL DEFAULT 0,
  width INTEGER CHECK (width IS NULL OR width > 0),
  height INTEGER CHECK (height IS NULL OR height > 0),
  file_size INTEGER CHECK (file_size IS NULL OR file_size > 0),
  
  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- STEP 4: INDEXES FOR PERFORMANCE
-- ============================================

-- Projects: Primary query indexes
CREATE INDEX idx_projects_slug ON projects(slug) WHERE deleted_at IS NULL;
CREATE INDEX idx_projects_status ON projects(status) WHERE deleted_at IS NULL;
CREATE INDEX idx_projects_category ON projects(category) WHERE deleted_at IS NULL;

-- Projects: Published projects (hot path)
CREATE INDEX idx_projects_published ON projects(display_order, created_at DESC) 
  WHERE status = 'published' AND deleted_at IS NULL;

-- Projects: Featured projects (hot path - Home page)
CREATE INDEX idx_projects_featured ON projects(priority DESC, created_at DESC) 
  WHERE status = 'published' AND is_featured = TRUE AND deleted_at IS NULL;

-- Project images: By project
CREATE INDEX idx_project_images_project ON project_images(project_id, display_order);

-- Project images: Cover images
CREATE INDEX idx_project_images_cover ON project_images(project_id) 
  WHERE is_cover = TRUE;

-- ============================================
-- STEP 5: TRIGGERS
-- ============================================

-- Auto-update updated_at
CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Prevent created_at modification
CREATE TRIGGER immutable_projects_created_at
  BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION prevent_created_at_update();

-- Auto-set published_at when status changes to published
CREATE OR REPLACE FUNCTION set_published_at()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'published' AND OLD.status != 'published' THEN
    NEW.published_at := NOW();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER set_projects_published_at
  BEFORE UPDATE OF status ON projects
  FOR EACH ROW EXECUTE FUNCTION set_published_at();

-- Ensure only one cover image per project
CREATE OR REPLACE FUNCTION ensure_single_cover_image()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_cover = TRUE THEN
    UPDATE project_images
    SET is_cover = FALSE
    WHERE project_id = NEW.project_id
      AND id != NEW.id
      AND is_cover = TRUE;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER ensure_single_cover
  AFTER INSERT OR UPDATE OF is_cover ON project_images
  FOR EACH ROW
  WHEN (NEW.is_cover = TRUE)
  EXECUTE FUNCTION ensure_single_cover_image();

-- ============================================
-- STEP 6: ROW LEVEL SECURITY
-- ============================================

-- Enable RLS
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_images ENABLE ROW LEVEL SECURITY;

-- Projects: Public can read published only
CREATE POLICY "Public can view published projects"
  ON projects
  FOR SELECT
  TO anon
  USING (status = 'published' AND deleted_at IS NULL);

-- Projects: Admins have full access
CREATE POLICY "Admins can view all projects"
  ON projects
  FOR SELECT
  TO authenticated
  USING (is_admin());

CREATE POLICY "Admins can insert projects"
  ON projects
  FOR INSERT
  TO authenticated
  WITH CHECK (is_admin());

CREATE POLICY "Admins can update projects"
  ON projects
  FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "Admins can delete projects"
  ON projects
  FOR DELETE
  TO authenticated
  USING (is_admin());

-- Project images: Public can read images of published projects
CREATE POLICY "Public can view images of published projects"
  ON project_images
  FOR SELECT
  TO anon
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = project_images.project_id
        AND projects.status = 'published'
        AND projects.deleted_at IS NULL
    )
  );

-- Project images: Admins have full access
CREATE POLICY "Admins can view all project images"
  ON project_images
  FOR SELECT
  TO authenticated
  USING (is_admin());

CREATE POLICY "Admins can insert project images"
  ON project_images
  FOR INSERT
  TO authenticated
  WITH CHECK (is_admin());

CREATE POLICY "Admins can update project images"
  ON project_images
  FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "Admins can delete project images"
  ON project_images
  FOR DELETE
  TO authenticated
  USING (is_admin());

-- ============================================
-- STEP 7: HELPER FUNCTIONS
-- ============================================

-- Get featured projects (optimized for Home page)
CREATE OR REPLACE FUNCTION get_featured_projects(p_limit INTEGER DEFAULT 3)
RETURNS TABLE (
  id UUID,
  title TEXT,
  slug TEXT,
  short_description TEXT,
  category project_category,
  tech_stack JSONB,
  cover_image_path TEXT,
  cover_image_alt TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.title,
    p.slug,
    p.short_description,
    p.category,
    p.tech_stack,
    pi.storage_path AS cover_image_path,
    pi.alt_text AS cover_image_alt
  FROM projects p
  LEFT JOIN project_images pi ON pi.project_id = p.id AND pi.is_cover = TRUE
  WHERE p.status = 'published'
    AND p.is_featured = TRUE
    AND p.deleted_at IS NULL
  ORDER BY p.priority DESC, p.created_at DESC
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Get project by slug with images
CREATE OR REPLACE FUNCTION get_project_by_slug(p_slug TEXT)
RETURNS TABLE (
  id UUID,
  title TEXT,
  slug TEXT,
  short_description TEXT,
  full_description TEXT,
  category project_category,
  tech_stack JSONB,
  live_url TEXT,
  github_url TEXT,
  meta_title TEXT,
  meta_description TEXT,
  published_at TIMESTAMPTZ,
  images JSONB
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.title,
    p.slug,
    p.short_description,
    p.full_description,
    p.category,
    p.tech_stack,
    p.live_url,
    p.github_url,
    p.meta_title,
    p.meta_description,
    p.published_at,
    COALESCE(
      (
        SELECT jsonb_agg(
          jsonb_build_object(
            'id', pi.id,
            'storage_path', pi.storage_path,
            'alt_text', pi.alt_text,
            'is_cover', pi.is_cover,
            'display_order', pi.display_order
          ) ORDER BY pi.display_order
        )
        FROM project_images pi
        WHERE pi.project_id = p.id
      ),
      '[]'::JSONB
    ) AS images
  FROM projects p
  WHERE p.slug = p_slug
    AND p.status = 'published'
    AND p.deleted_at IS NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- ============================================
-- DONE
-- ============================================
-- Phase 18 projects system migration complete
--
-- To verify:
-- SELECT * FROM projects LIMIT 1;
-- SELECT * FROM get_featured_projects(3);

