-- ============================================
-- WEBCRAFT DATABASE SCHEMA
-- Phase 19: Client Reviews System
-- ============================================
-- Run this in Supabase SQL Editor AFTER 007_demo_projects.sql
-- ============================================

-- ============================================
-- STEP 1: CREATE CLIENT REVIEWS TABLE
-- ============================================

CREATE TABLE client_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Link to project (optional - can be standalone testimonial)
  project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
  
  -- Client info
  client_name TEXT NOT NULL CHECK (char_length(client_name) >= 2 AND char_length(client_name) <= 100),
  client_role TEXT CHECK (client_role IS NULL OR char_length(client_role) <= 100),
  client_company TEXT CHECK (client_company IS NULL OR char_length(client_company) <= 100),
  client_avatar_url TEXT CHECK (client_avatar_url IS NULL OR char_length(client_avatar_url) <= 500),
  
  -- Review content
  review_text TEXT NOT NULL CHECK (char_length(review_text) >= 10 AND char_length(review_text) <= 1000),
  rating INTEGER CHECK (rating IS NULL OR (rating >= 1 AND rating <= 5)),
  
  -- Display settings
  is_featured BOOLEAN NOT NULL DEFAULT FALSE,
  is_published BOOLEAN NOT NULL DEFAULT FALSE,
  display_order INTEGER NOT NULL DEFAULT 0,
  
  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  published_at TIMESTAMPTZ
);

-- ============================================
-- STEP 2: INDEXES
-- ============================================

-- Published reviews (hot path - public pages)
CREATE INDEX idx_reviews_published ON client_reviews(display_order, created_at DESC) 
  WHERE is_published = TRUE;

-- Featured reviews (hot path - home page)
CREATE INDEX idx_reviews_featured ON client_reviews(display_order, created_at DESC) 
  WHERE is_published = TRUE AND is_featured = TRUE;

-- Reviews by project
CREATE INDEX idx_reviews_project ON client_reviews(project_id, display_order) 
  WHERE is_published = TRUE;

-- ============================================
-- STEP 3: TRIGGERS
-- ============================================

-- Auto-update updated_at
CREATE TRIGGER update_reviews_updated_at
  BEFORE UPDATE ON client_reviews
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Auto-set published_at when is_published changes to true
CREATE OR REPLACE FUNCTION set_review_published_at()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_published = TRUE AND (OLD.is_published = FALSE OR OLD.is_published IS NULL) THEN
    NEW.published_at := NOW();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER set_reviews_published_at
  BEFORE UPDATE OF is_published ON client_reviews
  FOR EACH ROW EXECUTE FUNCTION set_review_published_at();

-- ============================================
-- STEP 4: ROW LEVEL SECURITY
-- ============================================

ALTER TABLE client_reviews ENABLE ROW LEVEL SECURITY;

-- Public can read published reviews only
CREATE POLICY "Public can view published reviews"
  ON client_reviews
  FOR SELECT
  TO anon
  USING (is_published = TRUE);

-- Admins have full access
CREATE POLICY "Admins can view all reviews"
  ON client_reviews
  FOR SELECT
  TO authenticated
  USING (is_admin());

CREATE POLICY "Admins can insert reviews"
  ON client_reviews
  FOR INSERT
  TO authenticated
  WITH CHECK (is_admin());

CREATE POLICY "Admins can update reviews"
  ON client_reviews
  FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "Admins can delete reviews"
  ON client_reviews
  FOR DELETE
  TO authenticated
  USING (is_admin());

-- ============================================
-- DONE
-- ============================================
-- Phase 19 client reviews migration complete
--
-- To verify:
-- SELECT * FROM client_reviews LIMIT 1;
