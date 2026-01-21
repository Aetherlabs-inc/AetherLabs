-- Add public access policy for user_profiles
-- This allows anyone to view profiles that are public (profile_visibility = 'public' or NULL)

-- Drop existing restrictive policy if it exists
DROP POLICY IF EXISTS "Users can view their own profile" ON user_profiles;

-- Create new policy that allows:
-- 1. Users to view their own profile (always)
-- 2. Anyone to view public profiles (profile_visibility = 'public' or NULL)
CREATE POLICY "Public can view profiles" ON user_profiles
    FOR SELECT USING (
        auth.uid() = id OR 
        profile_visibility = 'public' OR 
        profile_visibility IS NULL
    );

-- Keep other policies as they were
-- (Insert, Update, Delete policies remain user-specific)

-- Also add public access for artworks that are verified
-- This allows public viewing of verified artworks
DROP POLICY IF EXISTS "Users can view their own artworks" ON artworks;

CREATE POLICY "Users can view their own artworks" ON artworks
    FOR SELECT USING (
        auth.uid() = user_id OR 
        (status = 'verified' AND EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE user_profiles.id = artworks.user_id 
            AND (user_profiles.profile_visibility = 'public' OR user_profiles.profile_visibility IS NULL)
        ))
    );

-- Add public access for certificates of verified artworks
DROP POLICY IF EXISTS "Users can view certificates for their artworks" ON certificates;

CREATE POLICY "Users can view certificates for their artworks" ON certificates
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM artworks 
            WHERE artworks.id = certificates.artwork_id 
            AND (
                artworks.user_id = auth.uid() OR
                (artworks.status = 'verified' AND EXISTS (
                    SELECT 1 FROM user_profiles 
                    WHERE user_profiles.id = artworks.user_id 
                    AND (user_profiles.profile_visibility = 'public' OR user_profiles.profile_visibility IS NULL)
                ))
            )
        )
    );

