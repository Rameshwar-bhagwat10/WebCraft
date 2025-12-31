-- ============================================
-- WEBCRAFT DATABASE SCHEMA
-- Phase 14: Admin Authentication Enhancements
-- ============================================
-- Run this in Supabase SQL Editor AFTER 002_lead_management.sql
-- ============================================

-- ============================================
-- STEP 1: AUTH RATE LIMITING TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS auth_rate_limits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  identifier TEXT NOT NULL, -- email or IP
  attempt_type TEXT NOT NULL CHECK (attempt_type IN ('login', 'password_reset')),
  attempts INTEGER NOT NULL DEFAULT 1,
  first_attempt_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  locked_until TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for fast lookups
CREATE INDEX IF NOT EXISTS idx_auth_rate_limits_lookup 
ON auth_rate_limits(identifier, attempt_type, first_attempt_at);

-- Enable RLS
ALTER TABLE auth_rate_limits ENABLE ROW LEVEL SECURITY;

-- Only service role can manage
CREATE POLICY "Service role manages auth rate limits"
  ON auth_rate_limits
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- ============================================
-- STEP 2: ADMIN AUDIT LOG TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS admin_audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID NOT NULL REFERENCES admin_users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id TEXT,
  details JSONB,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_audit_logs_admin ON admin_audit_logs(admin_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON admin_audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created ON admin_audit_logs(created_at DESC);

-- Enable RLS
ALTER TABLE admin_audit_logs ENABLE ROW LEVEL SECURITY;

-- Only super_admin can view audit logs
CREATE POLICY "Super admins can view audit logs"
  ON admin_audit_logs
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE id = auth.uid()
      AND role = 'super_admin'
    )
  );

-- Service role can insert
CREATE POLICY "Service role inserts audit logs"
  ON admin_audit_logs
  FOR INSERT
  TO service_role
  WITH CHECK (true);

-- ============================================
-- STEP 3: ADMIN SESSIONS TABLE (for tracking)
-- ============================================

CREATE TABLE IF NOT EXISTS admin_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID NOT NULL REFERENCES admin_users(id) ON DELETE CASCADE,
  session_token TEXT NOT NULL UNIQUE,
  ip_address TEXT,
  user_agent TEXT,
  last_active_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for session lookups
CREATE INDEX IF NOT EXISTS idx_admin_sessions_token ON admin_sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_admin_sessions_admin ON admin_sessions(admin_id);
CREATE INDEX IF NOT EXISTS idx_admin_sessions_expires ON admin_sessions(expires_at);

-- Enable RLS
ALTER TABLE admin_sessions ENABLE ROW LEVEL SECURITY;

-- Admins can only see their own sessions
CREATE POLICY "Admins can view own sessions"
  ON admin_sessions
  FOR SELECT
  TO authenticated
  USING (admin_id = auth.uid());

-- Service role manages sessions
CREATE POLICY "Service role manages sessions"
  ON admin_sessions
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- ============================================
-- STEP 4: FUNCTION TO CHECK AUTH RATE LIMIT
-- ============================================

CREATE OR REPLACE FUNCTION check_auth_rate_limit(
  p_identifier TEXT,
  p_attempt_type TEXT,
  p_max_attempts INTEGER DEFAULT 5,
  p_window_minutes INTEGER DEFAULT 15,
  p_lockout_minutes INTEGER DEFAULT 30
)
RETURNS JSONB AS $$
DECLARE
  v_record RECORD;
  v_window_start TIMESTAMPTZ;
  v_now TIMESTAMPTZ := NOW();
BEGIN
  v_window_start := v_now - (p_window_minutes || ' minutes')::INTERVAL;
  
  -- Check for existing record
  SELECT * INTO v_record
  FROM auth_rate_limits
  WHERE identifier = p_identifier
    AND attempt_type = p_attempt_type
    AND first_attempt_at > v_window_start
  ORDER BY first_attempt_at DESC
  LIMIT 1;
  
  -- Check if locked
  IF v_record IS NOT NULL AND v_record.locked_until IS NOT NULL AND v_record.locked_until > v_now THEN
    RETURN jsonb_build_object(
      'allowed', false,
      'locked', true,
      'locked_until', v_record.locked_until,
      'attempts', v_record.attempts
    );
  END IF;
  
  -- Check attempts
  IF v_record IS NOT NULL AND v_record.attempts >= p_max_attempts THEN
    -- Lock the account
    UPDATE auth_rate_limits
    SET locked_until = v_now + (p_lockout_minutes || ' minutes')::INTERVAL
    WHERE id = v_record.id;
    
    RETURN jsonb_build_object(
      'allowed', false,
      'locked', true,
      'locked_until', v_now + (p_lockout_minutes || ' minutes')::INTERVAL,
      'attempts', v_record.attempts
    );
  END IF;
  
  -- Record attempt
  IF v_record IS NULL THEN
    INSERT INTO auth_rate_limits (identifier, attempt_type, attempts, first_attempt_at)
    VALUES (p_identifier, p_attempt_type, 1, v_now);
  ELSE
    UPDATE auth_rate_limits
    SET attempts = attempts + 1
    WHERE id = v_record.id;
  END IF;
  
  RETURN jsonb_build_object(
    'allowed', true,
    'locked', false,
    'attempts', COALESCE(v_record.attempts, 0) + 1,
    'remaining', p_max_attempts - COALESCE(v_record.attempts, 0) - 1
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- STEP 5: FUNCTION TO RESET AUTH RATE LIMIT
-- ============================================

CREATE OR REPLACE FUNCTION reset_auth_rate_limit(
  p_identifier TEXT,
  p_attempt_type TEXT
)
RETURNS VOID AS $$
BEGIN
  DELETE FROM auth_rate_limits
  WHERE identifier = p_identifier
    AND attempt_type = p_attempt_type;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- STEP 6: FUNCTION TO LOG ADMIN ACTION
-- ============================================

CREATE OR REPLACE FUNCTION log_admin_action(
  p_admin_id UUID,
  p_action TEXT,
  p_resource_type TEXT,
  p_resource_id TEXT DEFAULT NULL,
  p_details JSONB DEFAULT NULL,
  p_ip_address TEXT DEFAULT NULL,
  p_user_agent TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  v_log_id UUID;
BEGIN
  INSERT INTO admin_audit_logs (
    admin_id, action, resource_type, resource_id, details, ip_address, user_agent
  )
  VALUES (
    p_admin_id, p_action, p_resource_type, p_resource_id, p_details, p_ip_address, p_user_agent
  )
  RETURNING id INTO v_log_id;
  
  RETURN v_log_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- STEP 7: CLEANUP OLD RATE LIMIT RECORDS
-- ============================================

CREATE OR REPLACE FUNCTION cleanup_old_auth_records()
RETURNS VOID AS $$
BEGIN
  -- Delete rate limit records older than 24 hours
  DELETE FROM auth_rate_limits
  WHERE first_attempt_at < NOW() - INTERVAL '24 hours';
  
  -- Delete expired sessions
  DELETE FROM admin_sessions
  WHERE expires_at < NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- DONE
-- ============================================
-- Phase 14 auth migration complete
