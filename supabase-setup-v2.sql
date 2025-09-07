-- ============================================================================
-- AI Voice to Post - Supabase Database Setup (Updated)
-- ============================================================================
-- Version: 2.0
-- Compatible with: Supabase Latest (2024+)
-- ============================================================================

BEGIN;

-- ============================================================================
-- 1. CREATE TABLES
-- ============================================================================

-- Profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  plan TEXT DEFAULT 'free' CHECK (plan IN ('free', 'plus')),
  usage_count INTEGER DEFAULT 0,
  usage_reset_date DATE DEFAULT CURRENT_DATE,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Records table
CREATE TABLE IF NOT EXISTS public.records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  audio_url TEXT,
  file_name TEXT,
  file_size BIGINT,
  transcript TEXT,
  summary TEXT,
  generated_post TEXT,
  style TEXT CHECK (style IN ('Facebook', 'IG', 'Twitter')),
  processing_time INTERVAL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Usage tracking table
CREATE TABLE IF NOT EXISTS public.usage_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  action TEXT NOT NULL CHECK (action IN ('transcribe', 'generate_post')),
  file_size BIGINT,
  processing_time INTERVAL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- 2. ENABLE ROW LEVEL SECURITY
-- ============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usage_logs ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- 3. CREATE FUNCTIONS
-- ============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to reset daily usage count
CREATE OR REPLACE FUNCTION public.reset_daily_usage()
RETURNS VOID AS $$
BEGIN
  UPDATE public.profiles 
  SET usage_count = 0, usage_reset_date = CURRENT_DATE
  WHERE usage_reset_date < CURRENT_DATE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check usage limit
CREATE OR REPLACE FUNCTION public.check_usage_limit(user_uuid UUID)
RETURNS BOOLEAN AS $$
DECLARE
  user_plan TEXT;
  user_usage INTEGER;
  user_reset_date DATE;
BEGIN
  SELECT plan, usage_count, usage_reset_date
  INTO user_plan, user_usage, user_reset_date
  FROM public.profiles
  WHERE id = user_uuid;
  
  -- Reset usage if date has passed
  IF user_reset_date < CURRENT_DATE THEN
    UPDATE public.profiles 
    SET usage_count = 0, usage_reset_date = CURRENT_DATE
    WHERE id = user_uuid;
    user_usage := 0;
  END IF;
  
  -- Plus users have unlimited usage
  IF user_plan = 'plus' THEN
    RETURN TRUE;
  END IF;
  
  -- Free users limited to 3 per day
  RETURN user_usage < 3;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to increment usage count
CREATE OR REPLACE FUNCTION public.increment_usage(user_uuid UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE public.profiles 
  SET usage_count = usage_count + 1
  WHERE id = user_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- 4. CREATE TRIGGERS
-- ============================================================================

-- Triggers for updated_at
DROP TRIGGER IF EXISTS set_timestamp_profiles ON public.profiles;
CREATE TRIGGER set_timestamp_profiles
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.trigger_set_timestamp();

DROP TRIGGER IF EXISTS set_timestamp_records ON public.records;
CREATE TRIGGER set_timestamp_records
  BEFORE UPDATE ON public.records
  FOR EACH ROW
  EXECUTE FUNCTION public.trigger_set_timestamp();

-- Trigger for new user
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================================
-- 5. ROW LEVEL SECURITY POLICIES
-- ============================================================================

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view own records" ON public.records;
DROP POLICY IF EXISTS "Users can insert own records" ON public.records;
DROP POLICY IF EXISTS "Users can update own records" ON public.records;
DROP POLICY IF EXISTS "Users can delete own records" ON public.records;
DROP POLICY IF EXISTS "Users can view own usage logs" ON public.usage_logs;
DROP POLICY IF EXISTS "Users can insert own usage logs" ON public.usage_logs;

-- Profiles policies
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Records policies
CREATE POLICY "Users can view own records" ON public.records
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own records" ON public.records
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own records" ON public.records
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own records" ON public.records
  FOR DELETE USING (auth.uid() = user_id);

-- Usage logs policies
CREATE POLICY "Users can view own usage logs" ON public.usage_logs
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own usage logs" ON public.usage_logs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ============================================================================
-- 6. STORAGE SETUP
-- ============================================================================

-- Create storage bucket for audio files
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'audio-files') THEN
    INSERT INTO storage.buckets (id, name) VALUES ('audio-files', 'audio-files');
  END IF;
END $$;

-- ============================================================================
-- 7. STORAGE POLICIES
-- ============================================================================

-- Drop existing storage policies
DROP POLICY IF EXISTS "Users can upload audio files" ON storage.objects;
DROP POLICY IF EXISTS "Users can view own audio files" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own audio files" ON storage.objects;

-- Storage policies for audio files
CREATE POLICY "Users can upload audio files" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'audio-files' 
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can view own audio files" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'audio-files' 
    AND (
      (storage.foldername(name))[1] = auth.uid()::text
      OR auth.role() = 'service_role'
    )
  );

CREATE POLICY "Users can delete own audio files" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'audio-files' 
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- ============================================================================
-- 8. INDEXES FOR PERFORMANCE
-- ============================================================================

-- Indexes for profiles
CREATE INDEX IF NOT EXISTS idx_profiles_plan ON public.profiles(plan);
CREATE INDEX IF NOT EXISTS idx_profiles_usage_reset_date ON public.profiles(usage_reset_date);

-- Indexes for records
CREATE INDEX IF NOT EXISTS idx_records_user_id ON public.records(user_id);
CREATE INDEX IF NOT EXISTS idx_records_created_at ON public.records(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_records_style ON public.records(style);

-- Indexes for usage_logs
CREATE INDEX IF NOT EXISTS idx_usage_logs_user_id ON public.usage_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_usage_logs_created_at ON public.usage_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_usage_logs_action ON public.usage_logs(action);

-- ============================================================================
-- 9. PERMISSIONS
-- ============================================================================

-- Grant permissions to authenticated users
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT USAGE ON SCHEMA public TO anon;

-- Table permissions
GRANT ALL ON public.profiles TO authenticated;
GRANT ALL ON public.records TO authenticated;
GRANT ALL ON public.usage_logs TO authenticated;

-- Function permissions
GRANT EXECUTE ON FUNCTION public.check_usage_limit(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.increment_usage(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.reset_daily_usage() TO authenticated;

-- Sequence permissions
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- ============================================================================
-- 10. CRON JOB (Optional - for automatic daily reset)
-- ============================================================================

-- Uncomment below if you want to enable pg_cron for automatic daily usage reset
-- Note: pg_cron extension must be enabled in your Supabase project

/*
-- Enable pg_cron extension
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Schedule daily usage reset at midnight UTC
SELECT cron.schedule('reset-daily-usage', '0 0 * * *', 'SELECT public.reset_daily_usage();');
*/

COMMIT;

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================

-- Run these queries to verify the setup:

-- Check if tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('profiles', 'records', 'usage_logs');

-- Check if storage bucket exists
SELECT * FROM storage.buckets WHERE id = 'audio-files';

-- Check if functions exist
SELECT routine_name 
FROM information_schema.routines 
WHERE routine_schema = 'public' 
AND routine_name IN ('handle_new_user', 'check_usage_limit', 'increment_usage', 'reset_daily_usage');

-- ============================================================================
-- SAMPLE DATA FOR TESTING (Optional)
-- ============================================================================

-- Uncomment below to insert sample data for testing
-- Replace the UUID with an actual user ID from auth.users

/*
-- Insert test profile
INSERT INTO public.profiles (id, full_name, plan) 
VALUES (
  '00000000-0000-0000-0000-000000000000', 
  'Test User', 
  'free'
) ON CONFLICT (id) DO NOTHING;

-- Insert test record
INSERT INTO public.records (user_id, transcript, summary, generated_post, style) 
VALUES (
  '00000000-0000-0000-0000-000000000000',
  'นี่คือข้อความทดสอบสำหรับระบบ Voice to Post ที่จะช่วยให้การสร้างโพสต์ง่ายขึ้น',
  'ข้อความทดสอบเกี่ยวกับระบบ Voice to Post',
  'ทดสอบระบบ Voice to Post ที่ช่วยแปลงเสียงเป็นโพสต์ได้อย่างรวดเร็ว 🎉\n\n#VoiceToPost #AI #Technology #Innovation',
  'Facebook'
);

-- Insert test usage log
INSERT INTO public.usage_logs (user_id, action, file_size, processing_time) 
VALUES (
  '00000000-0000-0000-0000-000000000000',
  'transcribe',
  1024000,
  INTERVAL '5 seconds'
);
*/
