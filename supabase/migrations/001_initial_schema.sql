-- ============================================
-- WEBCRAFT DATABASE SCHEMA
-- Phase 12: Initial Setup
-- ============================================
-- Run this in Supabase SQL Editor
-- ============================================

-- ============================================
-- ENUMS
-- ============================================

CREATE TYPE contact_status AS ENUM ('new', 'contacted', 'qualified', 'closed');
CREATE TYPE calculator_status AS ENUM ('new', 'reviewed', 'converted');
CREATE TYPE chat_session_status AS ENUM ('active', 'closed', 'converted');
CREATE TYPE newsletter_status AS ENUM ('active', 'unsubscribed');
CREATE TYPE admin_role AS ENUM ('super_admin', 'admin', 'viewer');
CREATE TYPE project_type AS ENUM ('website', 'webapp', 'mobile', 'dashboard', 'maintenance', 'other');

-- ============================================
-- HELPER FUNCTIONS
-- ============================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Check if current user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM admin_users
    WHERE id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Rate limiting function (sliding window)
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
  
  -- Clean old entries
  DELETE FROM rate_limits
  WHERE window_start < v_window_start;
  
  -- Get current count
  SELECT count INTO v_count
  FROM rate_limits
  WHERE identifier = p_identifier
    AND endpoint = p_endpoint
    AND window_start > v_window_start;
  
  IF v_count IS NULL THEN
    -- First request in window
    INSERT INTO rate_limits (identifier, endpoint, count, window_start)
    VALUES (p_identifier, p_endpoint, 1, NOW());
    RETURN TRUE;
  ELSIF v_count < p_max_requests THEN
    -- Under limit, increment
    UPDATE rate_limits
    SET count = count + 1
    WHERE identifier = p_identifier
      AND endpoint = p_endpoint
      AND window_start > v_window_start;
    RETURN TRUE;
  ELSE
    -- Rate limited
    RETURN FALSE;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- TABLES
-- ============================================

-- Contact Form Submissions
CREATE TABLE contact_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL CHECK (char_length(name) >= 1 AND char_length(name) <= 100),
  email TEXT NOT NULL CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
  phone TEXT CHECK (phone IS NULL OR char_length(phone) <= 20),
  project_type project_type NOT NULL,
  message TEXT NOT NULL CHECK (char_length(message) >= 20 AND char_length(message) <= 5000),
  status contact_status NOT NULL DEFAULT 'new',
  admin_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Calculator Submissions
CREATE TABLE calculator_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_type project_type NOT NULL,
  features JSONB NOT NULL DEFAULT '[]',
  timeline TEXT NOT NULL CHECK (char_length(timeline) <= 50),
  estimated_min INTEGER NOT NULL CHECK (estimated_min >= 0),
  estimated_max INTEGER NOT NULL CHECK (estimated_max >= estimated_min),
  contact_email TEXT CHECK (contact_email IS NULL OR contact_email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
  contact_name TEXT CHECK (contact_name IS NULL OR char_length(contact_name) <= 100),
  status calculator_status NOT NULL DEFAULT 'new',
  admin_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Chat Sessions
CREATE TABLE chat_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visitor_id TEXT NOT NULL CHECK (char_length(visitor_id) <= 100),
  status chat_session_status NOT NULL DEFAULT 'active',
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_message_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Chat Messages
CREATE TABLE chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES chat_sessions(id) ON DELETE CASCADE,
  sender TEXT NOT NULL CHECK (sender IN ('visitor', 'admin')),
  message TEXT NOT NULL CHECK (char_length(message) >= 1 AND char_length(message) <= 2000),
  visitor_email TEXT CHECK (visitor_email IS NULL OR visitor_email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
  visitor_name TEXT CHECK (visitor_name IS NULL OR char_length(visitor_name) <= 100),
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Newsletter Subscriptions
CREATE TABLE newsletter_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
  source TEXT NOT NULL CHECK (char_length(source) <= 50),
  status newsletter_status NOT NULL DEFAULT 'active',
  subscribed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  unsubscribed_at TIMESTAMPTZ
);

-- Admin Users (linked to auth.users)
CREATE TABLE admin_users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  role admin_role NOT NULL DEFAULT 'admin',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Rate Limiting Table
CREATE TABLE rate_limits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  identifier TEXT NOT NULL,
  endpoint TEXT NOT NULL,
  count INTEGER NOT NULL DEFAULT 1,
  window_start TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- INDEXES (Performance Critical)
-- ============================================

-- Contact submissions
CREATE INDEX idx_contact_submissions_email ON contact_submissions(email);
CREATE INDEX idx_contact_submissions_status ON contact_submissions(status);
CREATE INDEX idx_contact_submissions_created_at ON contact_submissions(created_at DESC);

-- Calculator submissions
CREATE INDEX idx_calculator_submissions_status ON calculator_submissions(status);
CREATE INDEX idx_calculator_submissions_created_at ON calculator_submissions(created_at DESC);
CREATE INDEX idx_calculator_submissions_email ON calculator_submissions(contact_email) WHERE contact_email IS NOT NULL;

-- Chat sessions
CREATE INDEX idx_chat_sessions_visitor_id ON chat_sessions(visitor_id);
CREATE INDEX idx_chat_sessions_status ON chat_sessions(status);
CREATE INDEX idx_chat_sessions_last_message ON chat_sessions(last_message_at DESC);

-- Chat messages
CREATE INDEX idx_chat_messages_session_id ON chat_messages(session_id);
CREATE INDEX idx_chat_messages_created_at ON chat_messages(created_at DESC);
CREATE INDEX idx_chat_messages_unread ON chat_messages(is_read) WHERE is_read = FALSE;

-- Newsletter
CREATE INDEX idx_newsletter_email ON newsletter_subscriptions(email);
CREATE INDEX idx_newsletter_status ON newsletter_subscriptions(status);

-- Rate limits
CREATE INDEX idx_rate_limits_lookup ON rate_limits(identifier, endpoint, window_start);

-- ============================================
-- TRIGGERS
-- ============================================

-- Auto-update updated_at
CREATE TRIGGER update_contact_submissions_updated_at
  BEFORE UPDATE ON contact_submissions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_calculator_submissions_updated_at
  BEFORE UPDATE ON calculator_submissions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Update chat session last_message_at on new message
CREATE OR REPLACE FUNCTION update_chat_session_last_message()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE chat_sessions
  SET last_message_at = NOW()
  WHERE id = NEW.session_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_chat_session_on_message
  AFTER INSERT ON chat_messages
  FOR EACH ROW EXECUTE FUNCTION update_chat_session_last_message();

-- ============================================
-- ROW LEVEL SECURITY (CRITICAL)
-- ============================================

-- Enable RLS on all tables
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE calculator_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE rate_limits ENABLE ROW LEVEL SECURITY;

-- ============================================
-- RLS POLICIES: contact_submissions
-- ============================================

-- Public: INSERT only
CREATE POLICY "Public can insert contact submissions"
  ON contact_submissions
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Admin: Full read access
CREATE POLICY "Admins can view contact submissions"
  ON contact_submissions
  FOR SELECT
  TO authenticated
  USING (is_admin());

-- Admin: Update access
CREATE POLICY "Admins can update contact submissions"
  ON contact_submissions
  FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- ============================================
-- RLS POLICIES: calculator_submissions
-- ============================================

CREATE POLICY "Public can insert calculator submissions"
  ON calculator_submissions
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Admins can view calculator submissions"
  ON calculator_submissions
  FOR SELECT
  TO authenticated
  USING (is_admin());

CREATE POLICY "Admins can update calculator submissions"
  ON calculator_submissions
  FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- ============================================
-- RLS POLICIES: chat_sessions
-- ============================================

CREATE POLICY "Public can insert chat sessions"
  ON chat_sessions
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Admins can view chat sessions"
  ON chat_sessions
  FOR SELECT
  TO authenticated
  USING (is_admin());

CREATE POLICY "Admins can update chat sessions"
  ON chat_sessions
  FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- ============================================
-- RLS POLICIES: chat_messages
-- ============================================

CREATE POLICY "Public can insert chat messages"
  ON chat_messages
  FOR INSERT
  TO anon
  WITH CHECK (sender = 'visitor');

CREATE POLICY "Admins can view chat messages"
  ON chat_messages
  FOR SELECT
  TO authenticated
  USING (is_admin());

CREATE POLICY "Admins can insert chat messages"
  ON chat_messages
  FOR INSERT
  TO authenticated
  WITH CHECK (is_admin() AND sender = 'admin');

CREATE POLICY "Admins can update chat messages"
  ON chat_messages
  FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- ============================================
-- RLS POLICIES: newsletter_subscriptions
-- ============================================

CREATE POLICY "Public can insert newsletter subscriptions"
  ON newsletter_subscriptions
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Admins can view newsletter subscriptions"
  ON newsletter_subscriptions
  FOR SELECT
  TO authenticated
  USING (is_admin());

CREATE POLICY "Admins can update newsletter subscriptions"
  ON newsletter_subscriptions
  FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- ============================================
-- RLS POLICIES: admin_users
-- ============================================

CREATE POLICY "Admins can view admin users"
  ON admin_users
  FOR SELECT
  TO authenticated
  USING (is_admin());

-- ============================================
-- RLS POLICIES: rate_limits
-- ============================================

-- Rate limits managed by functions only
CREATE POLICY "Service role manages rate limits"
  ON rate_limits
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- ============================================
-- INITIAL DATA (Optional)
-- ============================================

-- Note: Create admin user manually after setting up auth:
-- 1. Create user in Supabase Auth dashboard
-- 2. Run: INSERT INTO admin_users (id, email, role) VALUES ('<auth-user-id>', 'admin@webcraft.com', 'super_admin');
