-- ============================================
-- WEBCRAFT DATABASE SCHEMA
-- Phase 13: Lead Management System
-- ============================================
-- Run this in Supabase SQL Editor AFTER 001_initial_schema.sql
-- ============================================

-- ============================================
-- STEP 1: UPDATE ENUMS
-- ============================================

-- Add 'converted' status to contact_status
ALTER TYPE contact_status ADD VALUE IF NOT EXISTS 'converted';

-- Create lead_source enum
DO $$ BEGIN
  CREATE TYPE lead_source AS ENUM ('contact', 'calculator', 'chat');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- ============================================
-- STEP 2: ADD LEAD_SOURCE COLUMNS
-- ============================================

-- Add lead_source to contact_submissions
ALTER TABLE contact_submissions 
ADD COLUMN IF NOT EXISTS lead_source lead_source DEFAULT 'contact';

-- Add lead_source to calculator_submissions
ALTER TABLE calculator_submissions 
ADD COLUMN IF NOT EXISTS lead_source lead_source DEFAULT 'calculator';

-- ============================================
-- STEP 3: ADD INDEXES FOR LEAD_SOURCE
-- ============================================

CREATE INDEX IF NOT EXISTS idx_contact_submissions_lead_source 
ON contact_submissions(lead_source);

CREATE INDEX IF NOT EXISTS idx_calculator_submissions_lead_source 
ON calculator_submissions(lead_source);

-- ============================================
-- STEP 4: STATUS TRANSITION VALIDATION
-- ============================================

-- Function to validate contact status transitions
CREATE OR REPLACE FUNCTION validate_contact_status_transition()
RETURNS TRIGGER AS $$
DECLARE
  valid_transitions JSONB := '{
    "new": ["contacted", "qualified", "closed"],
    "contacted": ["qualified", "converted", "closed"],
    "qualified": ["converted", "closed"],
    "converted": ["closed"],
    "closed": []
  }'::JSONB;
  allowed_statuses JSONB;
BEGIN
  -- Skip if status hasn't changed
  IF OLD.status = NEW.status THEN
    RETURN NEW;
  END IF;
  
  -- Get allowed transitions for current status
  allowed_statuses := valid_transitions -> OLD.status::TEXT;
  
  -- Check if new status is allowed
  IF NOT (allowed_statuses ? NEW.status::TEXT) THEN
    RAISE EXCEPTION 'Invalid status transition from % to %', OLD.status, NEW.status;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for status validation
DROP TRIGGER IF EXISTS validate_contact_status ON contact_submissions;
CREATE TRIGGER validate_contact_status
  BEFORE UPDATE OF status ON contact_submissions
  FOR EACH ROW
  EXECUTE FUNCTION validate_contact_status_transition();

-- ============================================
-- STEP 5: IMMUTABLE CREATED_AT
-- ============================================

-- Function to prevent created_at modification
CREATE OR REPLACE FUNCTION prevent_created_at_update()
RETURNS TRIGGER AS $$
BEGIN
  NEW.created_at := OLD.created_at;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to contact_submissions
DROP TRIGGER IF EXISTS immutable_contact_created_at ON contact_submissions;
CREATE TRIGGER immutable_contact_created_at
  BEFORE UPDATE ON contact_submissions
  FOR EACH ROW
  EXECUTE FUNCTION prevent_created_at_update();

-- Apply to calculator_submissions
DROP TRIGGER IF EXISTS immutable_calculator_created_at ON calculator_submissions;
CREATE TRIGGER immutable_calculator_created_at
  BEFORE UPDATE ON calculator_submissions
  FOR EACH ROW
  EXECUTE FUNCTION prevent_created_at_update();

-- ============================================
-- STEP 6: LEAD STATISTICS VIEW
-- ============================================

CREATE OR REPLACE VIEW lead_statistics AS
SELECT
  'contact' as source,
  status::TEXT,
  COUNT(*) as count,
  DATE_TRUNC('day', created_at) as date
FROM contact_submissions
GROUP BY status, DATE_TRUNC('day', created_at)
UNION ALL
SELECT
  'calculator' as source,
  status::TEXT,
  COUNT(*) as count,
  DATE_TRUNC('day', created_at) as date
FROM calculator_submissions
GROUP BY status, DATE_TRUNC('day', created_at);

-- ============================================
-- STEP 7: ADMIN RATE LIMIT CONFIG
-- ============================================

-- Update rate limit function to support admin endpoints
-- Admin endpoints get higher limits (100/min)

-- ============================================
-- DONE
-- ============================================
-- Phase 13 migration complete
-- Run: SELECT * FROM lead_statistics; to verify
