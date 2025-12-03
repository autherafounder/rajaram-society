# Supabase Setup Guide for Jai Jawan CHS

## Step 1: Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Click "Start your project" or "Sign in"
3. Create a new project:
   - **Name**: `jai-jawan-chs`
   - **Database Password**: Choose a strong password (save this!)
   - **Region**: Choose closest to Mumbai (ap-south-1 recommended)
   - Click "Create new project"
4. Wait 2-3 minutes for project to initialize

## Step 2: Get API Credentials

1. In your project dashboard, go to **Settings** (gear icon) → **API**
2. Copy these values:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon/public key** (under "Project API keys")
   - **service_role key** (under "Project API keys" - click "Reveal" button)

## Step 3: Configure Environment Variables

1. In your project folder, create a file named `.env.local`
2. Copy contents from `.env.local.example`
3. Replace the placeholders with your actual Supabase values:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
   ```

## Step 4: Create Database Tables

1. In Supabase dashboard, go to **SQL Editor**
2. Click "New query"
3. Paste and run this SQL:

```sql
-- Create profiles table
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Policies for profiles
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles  
  FOR UPDATE USING (auth.uid() = id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'full_name');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create documents table
CREATE TABLE public.documents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  is_public BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;

-- Policies for documents
CREATE POLICY "Users can view own documents" ON public.documents
  FOR SELECT USING (auth.uid() = user_id OR is_public = TRUE);

CREATE POLICY "Users can insert own documents" ON public.documents
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own documents" ON public.documents
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own documents" ON public.documents
  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all documents" ON public.documents
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
```

4. Click "Run" button (or press Ctrl/Cmd + Enter)
5. Verify tables were created in **Table Editor**

## Step 5: Set up Storage Bucket

1. Go to **Storage** in Supabase dashboard
2. Click "Create a new bucket"
3. Name it: `documents`
4. Set to **Private** (not public)
5. Click "Create bucket"
6. Click on the `documents` bucket
7. Go to **Policies** tab
8. Add these policies:

**Policy 1: Allow authenticated users to upload**
- Policy name: `Users can upload own documents`
- Target roles: `authenticated`
- Policy definition: `(bucket_id = 'documents' AND auth.uid() = owner)`
- Allowed operations: `INSERT`

**Policy 2: Allow users to read own files**
- Policy name: `Users can read own documents`
- Target roles: `authenticated`
- Policy definition: `(bucket_id = 'documents' AND auth.uid() = owner)`
- Allowed operations: `SELECT`

## Step 6: Restart Development Server

After adding credentials to `.env.local`:
```bash
# Stop current server (Ctrl+C)
npm run dev
```

## Step 7: Create First Admin User

After the app is running:
1. Register a new account at `/signup`
2. Confirm your email (check spam folder)
3. In Supabase dashboard, go to **Table Editor** → **profiles**
4. Find your user and click edit
5. Change `role` from `user` to `admin`
6. Save changes

## Troubleshooting

### Can't connect to Supabase
- Verify `.env.local` file exists in project root
- Check that environment variables don't have quotes around values
- Restart dev server after adding `.env.local`

### Email confirmation not working
- Check Supabase **Authentication** → **Email Templates**
- For development, you can disable email confirmation:
  - Go to **Authentication** → **Providers** → **Email**
  - Uncheck "Confirm email"

### Tables not created
- Make sure you ran ALL the SQL code in Step 4
- Check **SQL Editor** → **History** for errors
- Verify tables exist in **Table Editor**

## Need Help?

Contact support or check:
- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Discord](https://discord.supabase.com)
