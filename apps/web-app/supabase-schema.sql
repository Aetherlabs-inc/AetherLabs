-- Enable Row Level Security

-- Create user_profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL,
  full_name VARCHAR(255),
  avatar_url TEXT,
  user_type VARCHAR(20) DEFAULT 'artist' CHECK (user_type IN ('artist', 'gallery', 'collector')),
  bio TEXT,
  website TEXT,
  location VARCHAR(255),
  phone VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create artworks table
CREATE TABLE IF NOT EXISTS artworks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  artist VARCHAR(255) NOT NULL,
  year INTEGER NOT NULL,
  medium VARCHAR(255) NOT NULL,
  dimensions VARCHAR(255) NOT NULL,
  status VARCHAR(50) DEFAULT 'unverified' CHECK (status IN ('unverified', 'authenticated', 'pending_verification', 'needs_review')),
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Create certificates table
CREATE TABLE IF NOT EXISTS certificates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  artwork_id UUID REFERENCES artworks(id) ON DELETE CASCADE,
  certificate_id VARCHAR(255) UNIQUE NOT NULL,
  qr_code_url TEXT,
  blockchain_hash TEXT,
  generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create nfc_tags table
CREATE TABLE IF NOT EXISTS nfc_tags (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  artwork_id UUID REFERENCES artworks(id) ON DELETE CASCADE,
  nfc_uid VARCHAR(255) UNIQUE NOT NULL,
  is_bound BOOLEAN DEFAULT FALSE,
  binding_status VARCHAR(50) DEFAULT 'pending' CHECK (binding_status IN ('pending', 'success', 'failed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create verification_levels table
CREATE TABLE IF NOT EXISTS verification_levels (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  artwork_id UUID REFERENCES artworks(id) ON DELETE CASCADE,
  level VARCHAR(50) NOT NULL CHECK (level IN ('unverified', 'artist_verified', 'gallery_verified', 'third_party_verified')),
  verified_by VARCHAR(255),
  verified_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE artworks ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE nfc_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE verification_levels ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON user_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can delete their own profile" ON user_profiles
  FOR DELETE USING (auth.uid() = id);

CREATE POLICY "Users can view their own artworks" ON artworks
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own artworks" ON artworks
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own artworks" ON artworks
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own artworks" ON artworks
  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view certificates for their artworks" ON certificates
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM artworks 
      WHERE artworks.id = certificates.artwork_id 
      AND artworks.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert certificates for their artworks" ON certificates
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM artworks 
      WHERE artworks.id = certificates.artwork_id 
      AND artworks.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can view NFC tags for their artworks" ON nfc_tags
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM artworks 
      WHERE artworks.id = nfc_tags.artwork_id 
      AND artworks.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert NFC tags for their artworks" ON nfc_tags
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM artworks 
      WHERE artworks.id = nfc_tags.artwork_id 
      AND artworks.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can view verification levels for their artworks" ON verification_levels
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM artworks 
      WHERE artworks.id = verification_levels.artwork_id 
      AND artworks.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert verification levels for their artworks" ON verification_levels
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM artworks 
      WHERE artworks.id = verification_levels.artwork_id 
      AND artworks.user_id = auth.uid()
    )
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_type ON user_profiles(user_type);
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON user_profiles(email);
CREATE INDEX IF NOT EXISTS idx_artworks_user_id ON artworks(user_id);
CREATE INDEX IF NOT EXISTS idx_artworks_status ON artworks(status);
CREATE INDEX IF NOT EXISTS idx_certificates_artwork_id ON certificates(artwork_id);
CREATE INDEX IF NOT EXISTS idx_nfc_tags_artwork_id ON nfc_tags(artwork_id);
CREATE INDEX IF NOT EXISTS idx_verification_levels_artwork_id ON verification_levels(artwork_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_artworks_updated_at BEFORE UPDATE ON artworks
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_certificates_updated_at BEFORE UPDATE ON certificates
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_nfc_tags_updated_at BEFORE UPDATE ON nfc_tags
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create storage bucket for avatars
INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true);

-- Create storage policies for avatars
CREATE POLICY "Avatar images are publicly accessible" ON storage.objects
  FOR SELECT USING (bucket_id = 'avatars');

-- Drop existing avatar policies to recreate them
DROP POLICY IF EXISTS "Users can upload their own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own avatar" ON storage.objects;

-- Create updated avatar policies that match the path structure: {userId}/{filename}
CREATE POLICY "Users can upload their own avatar" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'avatars' 
    AND auth.uid() IS NOT NULL 
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can update their own avatar" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'avatars' 
    AND auth.uid() IS NOT NULL 
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can delete their own avatar" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'avatars' 
    AND auth.uid() IS NOT NULL 
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Create storage policies for artwork images
-- First, ensure the bucket exists
INSERT INTO storage.buckets (id, name, public) 
VALUES ('artwork-images', 'artwork-images', true)
ON CONFLICT (id) DO NOTHING;

-- Drop all existing policies for artwork-images to start fresh
DROP POLICY IF EXISTS "Artwork images are publicly accessible" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload their own artwork images" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own artwork images" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own artwork images" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to upload artwork images" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to update artwork images" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to delete artwork images" ON storage.objects;
DROP POLICY IF EXISTS "Allow public access to artwork images" ON storage.objects;

-- Create policies that match the path structure: {userId}/{filename}
CREATE POLICY "Users can upload to their own folder" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'artwork-images' 
    AND auth.uid() IS NOT NULL 
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can update their own files" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'artwork-images' 
    AND auth.uid() IS NOT NULL 
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can delete their own files" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'artwork-images' 
    AND auth.uid() IS NOT NULL 
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Public can view artwork images" ON storage.objects
  FOR SELECT USING (bucket_id = 'artwork-images');
