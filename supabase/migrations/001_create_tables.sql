-- Profiles table (extends Supabase auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL DEFAULT '',
  role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'practitioner')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Users can read and update their own profile
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', ''));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Cases table
CREATE TABLE cases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  modality TEXT NOT NULL DEFAULT '',
  body_region TEXT NOT NULL DEFAULT '',
  dicom_metadata JSONB,
  analysis JSONB,
  mode TEXT NOT NULL DEFAULT 'quick_read' CHECK (mode IN ('quick_read', 'learning')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE cases ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own cases"
  ON cases FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own cases"
  ON cases FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own cases"
  ON cases FOR DELETE
  USING (auth.uid() = user_id);

-- Learning sessions table
CREATE TABLE learning_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id UUID NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  messages JSONB NOT NULL DEFAULT '[]'::jsonb,
  score JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE learning_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own learning sessions"
  ON learning_sessions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own learning sessions"
  ON learning_sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own learning sessions"
  ON learning_sessions FOR UPDATE
  USING (auth.uid() = user_id);

-- User progress table
CREATE TABLE user_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  total_cases INT NOT NULL DEFAULT 0,
  modality_stats JSONB NOT NULL DEFAULT '{}'::jsonb,
  accuracy_trend JSONB NOT NULL DEFAULT '[]'::jsonb,
  weak_areas JSONB NOT NULL DEFAULT '[]'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own progress"
  ON user_progress FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can upsert own progress"
  ON user_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress"
  ON user_progress FOR UPDATE
  USING (auth.uid() = user_id);

-- Create storage bucket for case images
INSERT INTO storage.buckets (id, name, public)
VALUES ('case-images', 'case-images', false);

-- Storage policy: users can upload to their own folder
CREATE POLICY "Users can upload own images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'case-images'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can view own images"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'case-images'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );
