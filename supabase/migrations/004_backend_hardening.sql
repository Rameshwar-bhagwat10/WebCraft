-- ============================================
-- WEBCRAFT DATABASE SCHEMA
-- Phase 17: Backend Hardening
-- ============================================
-- Run this in Supabase SQL Editor AFTER 003_auth_enhancements.sql
-- ============================================

-- ============================================
-- STEP 1: OPTIMIZED RATE LIMIT FUNCTION
-- ============================================
-- Removes per-request DELETE, uses batch cleanup instead

CREATE OR REPLACE FUNCTION check_rate_limit(
  p_identifier TEXT,
  p_endpoint TEXT,
  p_max_requests INTEGER,
  p_window_minutes INTEGER
)
RETURNS BOOLEAN AS $$
DECLARE
  v_count INTEGER;
  v_window_start TIMESTAMPTZ;
BEGIN
  v_window_start := NOW() - (p_window_minutes || ' minutes')::INTERVAL;
  
  -- Get current count (no DELETE on every request)
  SELECT COALESCE(SUM(count), 0) INTO v_count
  FROM rate_limits
  WHERE identifier = p_identifier
    AND endpoint = p_endpoint
    AND window_start > v_window_start;
  
  IF v_count < p_max_requests THEN
    -- Under limit, upsert count
    INSERT INTO rate_limits (identifier, endpoint, count, window_start)
    VALUES (p_identifier, p_endpoint, 1, NOW())
    ON CONFLICT (identifier, endpoint) 
    WHERE window_start > v_window_start
    DO UPDATE SET count = rate_limits.count + 1;
    
    RETURN TRUE;
  ELSE
    -- Rate limited
    RETURN FALSE;
  END IF;
EXCEPTION
  WHEN OTHERS THEN
    -- Log error but don't fail silently - let caller handle
    RAISE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- ============================================
-- STEP 2: RATE LIMIT CLEANUP FUNCTION
-- ============================================
-- Call this periodically (e.g., every hour via cron)

CREATE OR REPLACE FUNCTION cleanup_rate_limits()
RETURNS INTEGER AS $$
DECLARE
  v_deleted INTEGER;
BEGIN
  DELETE FROM rate_limits
  WHERE window_start < NOW() - INTERVAL '2 hours';
  
  GET DIAGNOSTICS v_deleted = ROW_COUNT;
  RETURN v_deleted;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- ============================================
-- STEP 3: ADD UNIQUE CONSTRAINT FOR UPSERT
-- ============================================

-- Drop existing index if it exists
DROP INDEX IF EXISTS idx_rate_limits_lookup;

-- Create unique constraint for upsert
ALTER TABLE rate_limits 
ADD CONSTRAINT rate_limits_identifier_endpoint_key 
UNIQUE (identifier, endpoint);

-- Recreate lookup index
CREATE INDEX idx_rate_limits_window 
ON rate_limits(identifier, endpoint, window_start);

-- ============================================
-- STEP 4: PARTIAL INDEXES FOR COMMON QUERIES
-- ============================================

-- Index for new leads (most common admin query)
CREATE INDEX IF NOT EXISTS idx_contact_new_leads 
ON contact_submissions(created_at DESC) 
WHERE status = 'new';

CREATE INDEX IF NOT EXISTS idx_calculator_new_leads 
ON calculator_submissions(created_at DESC) 
WHERE status = 'new';

-- Index for unread chat messages
CREATE INDEX IF NOT EXISTS idx_chat_unread_messages 
ON chat_messages(session_id, created_at DESC) 
WHERE is_read = FALSE;

-- Index for active chat sessions
CREATE INDEX IF NOT EXISTS idx_chat_active_sessions 
ON chat_sessions(last_message_at DESC) 
WHERE status = 'active';

-- ============================================
-- STEP 5: UPDATE SECURITY DEFINER FUNCTIONS
-- ============================================
-- Add SET search_path to prevent search path injection

CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM admin_users
    WHERE id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE OR REPLACE FUNCTION prevent_created_at_update()
RETURNS TRIGGER AS $$
BEGIN
  NEW.created_at := OLD.created_at;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE OR REPLACE FUNCTION update_chat_session_last_message()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE chat_sessions
  SET last_message_at = NOW()
  WHERE id = NEW.session_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- ============================================
-- STEP 6: DATA RETENTION PREPARATION
-- ============================================
-- Add soft delete columns for future GDPR compliance

ALTER TABLE contact_submissions 
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;

ALTER TABLE calculator_submissions 
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;

ALTER TABLE newsletter_subscriptions 
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;

-- Index for excluding soft-deleted records
CREATE INDEX IF NOT EXISTS idx_contact_not_deleted 
ON contact_submissions(created_at DESC) 
WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_calculator_not_deleted 
ON calculator_submissions(created_at DESC) 
WHERE deleted_at IS NULL;

-- ============================================
-- STEP 7: CLEANUP OLD AUTH RECORDS ENHANCEMENT
-- ============================================

-- Drop existing function to change return type
DROP FUNCTION IF EXISTS cleanup_old_auth_records();

CREATE OR REPLACE FUNCTION cleanup_old_auth_records()
RETURNS JSONB AS $$
DECLARE
  v_rate_limits_deleted INTEGER;
  v_auth_limits_deleted INTEGER;
  v_sessions_deleted INTEGER;
BEGIN
  -- Delete rate limit records older than 2 hours
  DELETE FROM rate_limits
  WHERE window_start < NOW() - INTERVAL '2 hours';
  GET DIAGNOSTICS v_rate_limits_deleted = ROW_COUNT;
  
  -- Delete auth rate limit records older than 24 hours
  DELETE FROM auth_rate_limits
  WHERE first_attempt_at < NOW() - INTERVAL '24 hours';
  GET DIAGNOSTICS v_auth_limits_deleted = ROW_COUNT;
  
  -- Delete expired sessions
  DELETE FROM admin_sessions
  WHERE expires_at < NOW();
  GET DIAGNOSTICS v_sessions_deleted = ROW_COUNT;
  
  RETURN jsonb_build_object(
    'rate_limits_deleted', v_rate_limits_deleted,
    'auth_limits_deleted', v_auth_limits_deleted,
    'sessions_deleted', v_sessions_deleted,
    'cleaned_at', NOW()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- ============================================
-- DONE
-- ============================================
-- Phase 17 backend hardening migration complete
-- 
-- To verify:
-- SELECT * FROM pg_indexes WHERE tablename IN ('contact_submissions', 'chat_messages', 'rate_limits');
