-- ============================================================
-- Feedback System & Document Updates Migration
-- Created: 2026-04-14
-- ============================================================

-- 1. Create feedbacks table
CREATE TABLE IF NOT EXISTS public.feedbacks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  phone TEXT,
  email TEXT NOT NULL,
  inquiry_type TEXT,
  message_type TEXT CHECK (message_type IN ('suggestion', 'inquiry')),
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'read', 'resolved'))
);

-- Enable RLS
ALTER TABLE public.feedbacks ENABLE ROW LEVEL SECURITY;

-- Allow anonymous/public inserts (for the contact form)
CREATE POLICY "Allow public insert on feedbacks"
  ON public.feedbacks
  FOR INSERT
  WITH CHECK (true);

-- Only service_role (admin server client) can read/update/delete
CREATE POLICY "Service role full access on feedbacks"
  ON public.feedbacks
  FOR ALL
  USING (auth.role() = 'service_role');

-- 2. Performance indexes
CREATE INDEX IF NOT EXISTS idx_feedbacks_status ON public.feedbacks(status);
CREATE INDEX IF NOT EXISTS idx_feedbacks_created_at ON public.feedbacks(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_feedbacks_email ON public.feedbacks(email);

-- 3. Add file_url column to documents if not exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'documents'
      AND column_name = 'file_url'
  ) THEN
    ALTER TABLE public.documents ADD COLUMN file_url TEXT;
  END IF;
END $$;
