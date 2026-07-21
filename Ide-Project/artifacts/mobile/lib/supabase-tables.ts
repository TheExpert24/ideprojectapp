// Run this SQL exactly in your Supabase Dashboard > SQL Editor > New Query, then click Run.
// This creates the tables and policies the app needs.
//
// NOTE: The profiles table uses `id text PRIMARY KEY` (NOT uuid REFERENCES auth.users)
// because the app uses Clerk for auth. Clerk user IDs are strings like "user_2abc..."

export const SUPABASE_SETUP_SQL = `
CREATE TABLE IF NOT EXISTS news_items (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  summary text NOT NULL,
  content text NOT NULL,
  category text NOT NULL,
  source text NOT NULL,
  date text NOT NULL,
  read_time text NOT NULL,
  is_event boolean DEFAULT false,
  event_date text,
  event_location text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS resources (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  description text NOT NULL,
  category text NOT NULL,
  type text NOT NULL,
  read_time text NOT NULL,
  tags text[] DEFAULT '{}',
  content text NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- profiles uses text PK because Clerk user IDs are strings, not Supabase auth UUIDs
CREATE TABLE IF NOT EXISTS profiles (
  id text PRIMARY KEY,
  name text DEFAULT '',
  bio text DEFAULT '',
  location text DEFAULT '',
  role text,
  onboarding_complete boolean DEFAULT false,
  saved_resources text[] DEFAULT '{}',
  saved_news text[] DEFAULT '{}',
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE news_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Read/write/delete for all (prototype only — tighten per-user in production)
CREATE POLICY "Allow all" ON news_items FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON resources FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON profiles FOR ALL USING (true) WITH CHECK (true);
`;
