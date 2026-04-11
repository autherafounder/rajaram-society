-- ============================================================
-- Jai Jawan CHS Admin Panel — Database Schema Migration
-- Drop old unused documents table and create new admin schema
-- ============================================================

-- Drop old documents table (it was user-based, unused)
DROP TABLE IF EXISTS public.documents CASCADE;

-- 1. Admins table
CREATE TABLE IF NOT EXISTS public.admins (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  name TEXT NOT NULL DEFAULT 'Admin',
  role TEXT NOT NULL DEFAULT 'admin',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role only admins" ON public.admins
  FOR ALL USING (auth.role() = 'service_role');

-- 2. Documents table (admin-uploaded timeline docs)
CREATE TABLE public.documents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  timeline_id INTEGER NOT NULL,
  timeline_title TEXT NOT NULL,
  url TEXT NOT NULL,
  file_path TEXT,
  upload_date TIMESTAMPTZ DEFAULT NOW(),
  size BIGINT DEFAULT 0,
  uploaded_by TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read documents" ON public.documents
  FOR SELECT USING (true);

CREATE POLICY "Service role manage documents" ON public.documents
  FOR ALL USING (auth.role() = 'service_role');

-- 3. Audit logs table
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  document_id TEXT,
  document_name TEXT,
  timeline_id INTEGER,
  timeline_title TEXT,
  user_email TEXT,
  user_ip TEXT,
  blocked BOOLEAN DEFAULT false,
  action TEXT DEFAULT 'download',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role only audit" ON public.audit_logs
  FOR ALL USING (auth.role() = 'service_role');

-- 4. Blocked users table
CREATE TABLE IF NOT EXISTS public.blocked_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  identifier TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('email', 'ip')),
  reason TEXT NOT NULL,
  blocked_by TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.blocked_users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role only blocked" ON public.blocked_users
  FOR ALL USING (auth.role() = 'service_role');

-- 5. Contact submissions table
CREATE TABLE IF NOT EXISTS public.contact_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  flat_unit TEXT,
  subject TEXT,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role only contacts" ON public.contact_submissions
  FOR ALL USING (auth.role() = 'service_role');

-- 6. Document access requests table
CREATE TABLE IF NOT EXISTS public.document_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  flat_unit TEXT NOT NULL,
  email TEXT NOT NULL,
  documents TEXT[] NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'denied')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.document_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role only requests" ON public.document_requests
  FOR ALL USING (auth.role() = 'service_role');

-- 7. Admin activity log
CREATE TABLE IF NOT EXISTS public.admin_activity (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  admin_email TEXT NOT NULL,
  action TEXT NOT NULL,
  details JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.admin_activity ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role only activity" ON public.admin_activity
  FOR ALL USING (auth.role() = 'service_role');

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON public.audit_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_email ON public.audit_logs(user_email);
CREATE INDEX IF NOT EXISTS idx_audit_logs_document_id ON public.audit_logs(document_id);
CREATE INDEX IF NOT EXISTS idx_documents_timeline_id ON public.documents(timeline_id);
CREATE INDEX IF NOT EXISTS idx_blocked_users_identifier ON public.blocked_users(identifier, type);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_read ON public.contact_submissions(is_read);
CREATE INDEX IF NOT EXISTS idx_document_requests_status ON public.document_requests(status);
