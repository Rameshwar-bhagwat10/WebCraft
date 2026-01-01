-- ============================================
-- WEBCRAFT DATABASE SCHEMA
-- Phase 20: Visitor Feedback System
-- ============================================
-- Run this in Supabase SQL Editor AFTER 008_client_reviews.sql
-- ============================================

-- ============================================
-- STEP 1: CREATE VISITOR FEEDBACK TABLE
-- ============================================

CREATE TABLE visitor_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Visitor info
  name TEXT NOT NULL CHECK (char_length(name) >= 2 AND char_length(name) <= 100),
  email TEXT CHECK (email IS NULL OR (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')),
  
  -- Feedback content
  message TEXT NOT NULL CHECK (char_length(message) >= 10 AND char_length(message) <= 500),
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  
  -- Status
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  is_featured BOOLEAN NOT NULL DEFAULT FALSE,
  
  -- Metadata
  ip_address TEXT,
  user_agent TEXT,
  
  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  reviewed_at TIMESTAMPTZ
);

-- ============================================
-- STEP 2: INDEXES
-- ============================================

-- Approved feedback (public display)
CREATE INDEX idx_feedback_approved ON visitor_feedback(created_at DESC) 
  WHERE status = 'approved';

-- Featured feedback
CREATE INDEX idx_feedback_featured ON visitor_feedback(created_at DESC) 
  WHERE status = 'approved' AND is_featured = TRUE;

-- Pending feedback (admin review queue)
CREATE INDEX idx_feedback_pending ON visitor_feedback(created_at DESC) 
  WHERE status = 'pending';

-- ============================================
-- STEP 3: TRIGGERS
-- ============================================

-- Auto-update updated_at
CREATE TRIGGER update_feedback_updated_at
  BEFORE UPDATE ON visitor_feedback
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Auto-set reviewed_at when status changes from pending
CREATE OR REPLACE FUNCTION set_feedback_reviewed_at()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.status = 'pending' AND NEW.status != 'pending' THEN
    NEW.reviewed_at := NOW();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER set_feedback_reviewed_at
  BEFORE UPDATE OF status ON visitor_feedback
  FOR EACH ROW EXECUTE FUNCTION set_feedback_reviewed_at();

-- ============================================
-- STEP 4: ROW LEVEL SECURITY
-- ============================================

ALTER TABLE visitor_feedback ENABLE ROW LEVEL SECURITY;

-- Public can submit feedback (insert only)
CREATE POLICY "Public can submit feedback"
  ON visitor_feedback
  FOR INSERT
  TO anon
  WITH CHECK (TRUE);

-- Public can view approved feedback only
CREATE POLICY "Public can view approved feedback"
  ON visitor_feedback
  FOR SELECT
  TO anon
  USING (status = 'approved');

-- Admins have full access
CREATE POLICY "Admins can view all feedback"
  ON visitor_feedback
  FOR SELECT
  TO authenticated
  USING (is_admin());

CREATE POLICY "Admins can update feedback"
  ON visitor_feedback
  FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "Admins can delete feedback"
  ON visitor_feedback
  FOR DELETE
  TO authenticated
  USING (is_admin());

-- ============================================
-- DONE
-- ============================================
-- Phase 20 visitor feedback migration complete
--
-- To verify:
-- SELECT * FROM visitor_feedback LIMIT 1;
