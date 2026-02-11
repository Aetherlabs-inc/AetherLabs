-- ============================================
-- AetherLabs Verification System Migration
-- Adds NTAG 424 DNA support with CMAC validation
-- ============================================

-- ============================================
-- 1. ADD COLUMNS TO NFC_TAGS TABLE
-- ============================================

-- Verification code for public URL (8 alphanumeric chars)
ALTER TABLE nfc_tags
ADD COLUMN IF NOT EXISTS verification_code VARCHAR(8) UNIQUE;

-- AES-128 key for NTAG 424 DNA CMAC validation (stored as hex string)
ALTER TABLE nfc_tags
ADD COLUMN IF NOT EXISTS aes_key VARCHAR(32);

-- Last seen counter value (for replay attack prevention)
ALTER TABLE nfc_tags
ADD COLUMN IF NOT EXISTS last_counter INTEGER DEFAULT 0;

-- Tag type to distinguish standard vs secure tags
ALTER TABLE nfc_tags
ADD COLUMN IF NOT EXISTS tag_type VARCHAR(20) DEFAULT 'standard'
CHECK (tag_type IN ('standard', 'ntag424'));

-- Index for fast verification code lookups
CREATE INDEX IF NOT EXISTS idx_nfc_tags_verification_code
ON nfc_tags(verification_code);

-- ============================================
-- 2. CREATE VERIFICATION_SCANS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS verification_scans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nfc_tag_id UUID REFERENCES nfc_tags(id) ON DELETE CASCADE,
  artwork_id UUID REFERENCES artworks(id) ON DELETE CASCADE,

  -- Scan context
  scan_type VARCHAR(20) NOT NULL CHECK (scan_type IN ('web', 'app', 'app_authenticated')),

  -- Device/request info for rate limiting and analytics
  device_fingerprint TEXT,
  ip_address VARCHAR(45),
  user_agent TEXT,

  -- NTAG 424 DNA specific
  counter_value INTEGER,

  -- Result tracking
  verification_result VARCHAR(20) NOT NULL CHECK (
    verification_result IN ('valid', 'invalid_cmac', 'replay_attack', 'not_found', 'rate_limited')
  ),

  -- Timestamps
  scanned_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 3. INDEXES FOR PERFORMANCE
-- ============================================

CREATE INDEX IF NOT EXISTS idx_verification_scans_nfc_tag
ON verification_scans(nfc_tag_id);

CREATE INDEX IF NOT EXISTS idx_verification_scans_artwork
ON verification_scans(artwork_id);

CREATE INDEX IF NOT EXISTS idx_verification_scans_result
ON verification_scans(verification_result);

CREATE INDEX IF NOT EXISTS idx_verification_scans_scanned_at
ON verification_scans(scanned_at);

-- Composite index for rate limiting queries
CREATE INDEX IF NOT EXISTS idx_verification_scans_rate_limit
ON verification_scans(nfc_tag_id, ip_address, scanned_at);

-- ============================================
-- 4. ROW LEVEL SECURITY
-- ============================================

ALTER TABLE verification_scans ENABLE ROW LEVEL SECURITY;

-- Anyone can insert verification scans (public verification)
CREATE POLICY "Public can insert verification scans"
ON verification_scans
FOR INSERT
WITH CHECK (true);

-- Anyone can read verification scans (for rate limiting)
CREATE POLICY "Public can read verification scans"
ON verification_scans
FOR SELECT
USING (true);

-- Users can view detailed scans for their own artworks
CREATE POLICY "Users can view scans for their artworks"
ON verification_scans
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM artworks
    WHERE artworks.id = verification_scans.artwork_id
    AND artworks.user_id = auth.uid()
  )
);

-- ============================================
-- 5. COMMENTS FOR DOCUMENTATION
-- ============================================

COMMENT ON COLUMN nfc_tags.verification_code IS 'Unique 8-char code used in public verification URLs';
COMMENT ON COLUMN nfc_tags.aes_key IS 'AES-128 key (hex) for NTAG 424 DNA CMAC validation';
COMMENT ON COLUMN nfc_tags.last_counter IS 'Last seen counter value to prevent replay attacks';
COMMENT ON COLUMN nfc_tags.tag_type IS 'Type of NFC tag: standard (UID only) or ntag424 (cryptographic)';

COMMENT ON TABLE verification_scans IS 'Logs all verification attempts for analytics and rate limiting';
COMMENT ON COLUMN verification_scans.scan_type IS 'Context of scan: web (browser), app (mobile), app_authenticated (logged in)';
COMMENT ON COLUMN verification_scans.counter_value IS 'Counter from NTAG 424 DNA tag for this scan';
COMMENT ON COLUMN verification_scans.verification_result IS 'Outcome: valid, invalid_cmac, replay_attack, not_found, rate_limited';
