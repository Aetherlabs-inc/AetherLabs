-- Add username column to user_profiles table (no unique constraint - handled in application)
ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS username VARCHAR(50);

-- Create index for username lookups (for performance, not uniqueness)
CREATE INDEX IF NOT EXISTS idx_user_profiles_username ON user_profiles(username);

-- Note: Username validation and uniqueness checks are handled in the application layer
-- The application will:
-- 1. Validate username format (3-30 chars, alphanumeric + underscore + hyphen)
-- 2. Check username availability before insert/update
-- 3. Prevent reserved usernames

-- Update RLS policy to allow public read access to profiles by username
DROP POLICY IF EXISTS "Public can view profiles by username" ON user_profiles;
CREATE POLICY "Public can view profiles by username" ON user_profiles
    FOR SELECT USING (true);

-- Update existing policy to allow users to view their own profile
DROP POLICY IF EXISTS "Users can view their own profile" ON user_profiles;
CREATE POLICY "Users can view their own profile" ON user_profiles
    FOR SELECT USING (auth.uid() = id OR true);

