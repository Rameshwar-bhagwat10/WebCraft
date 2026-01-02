-- ============================================
-- WEBCRAFT DATABASE SCHEMA
-- Phase 21: Idempotency & Automated Cleanup
-- ============================================
-- Run this in Supabase SQL Editor AFTER 009_visitor_feedback.sql
-- ============================================

-- ============================================
-- STEP 1: IDEMPOTENCY KEYS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS idempotency_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT NOT NULL,
  endpoint TEXT NOT NULL,
  response JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  -- Unique constraint for upsert
  CONSTRAINT idempotency_keys_unique UNIQUE (key, endpoint)
);

-- Index for lookups
CREATE INDEX IF NOT EXISTS idx_idempotency_lookup 
ON idempotency_keys(key, endpoint);

-- Index for cleanup
CREATE INDEX IF NOT EXISTS idx_idempotency_created 
ON idempotency_keys(created_at);

-- Enable RLS
ALTER TABLE idempotency_keys ENABLE ROW LEVEL SECURITY;

-- Service role only
CREATE POLICY "Service role manages idempotency keys"
  ON idempotency_keys
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- ============================================
-- STEP 2: CLEANUP FUNCTION FOR IDEMPOTENCY
-- ============================================

CREATE OR REPLACE FUNCTION cleanup_idempotency_keys()
RETURNS INTEGER AS $$
DECLARE
  v_deleted INTEGER;
BEGIN
  -- Delete keys older than 24 hours
  DELETE FROM idempotency_keys
  WHERE created_at < NOW() - INTERVAL '24 hours';
  
  GET DIAGNOSTICS v_deleted = ROW_COUNT;
  RETURN v_deleted;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- ============================================
-- STEP 3: MASTER CLEANUP FUNCTION
-- ============================================

CREATE OR REPLACE FUNCTION run_all_cleanups()
RETURNS JSONB AS $$
DECLARE
  v_rate_limits INTEGER;
  v_auth_records JSONB;
  v_idempotency INTEGER;
BEGIN
  -- Cleanup rate limits
  SELECT cleanup_rate_limits() INTO v_rate_limits;
  
  -- Cleanup auth records
  SELECT cleanup_old_auth_records() INTO v_auth_records;
  
  -- Cleanup idempotency keys
  SELECT cleanup_idempotency_keys() INTO v_idempotency;
  
  RETURN jsonb_build_object(
    'rate_limits_deleted', v_rate_limits,
    'auth_cleanup', v_auth_records,
    'idempotency_deleted', v_idempotency,
    'executed_at', NOW()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- ============================================
-- STEP 4: SCHEDULED CLEANUP (pg_cron)
-- ============================================
-- Uncomment if pg_cron extension is available:
-- 
-- SELECT cron.schedule(
--   'hourly-cleanup',
--   '0 * * * *',
--   'SELECT run_all_cleanups()'
-- );

-- ============================================
-- DONE
-- ============================================
-- Phase 21 idempotency migration complete
--
-- To verify:
-- SELECT * FROM idempotency_keys LIMIT 1;
-- SELECT run_all_cleanups();
