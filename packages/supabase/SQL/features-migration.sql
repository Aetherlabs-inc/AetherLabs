-- ============================================
-- AetherLabs Features Migration
-- Collections, Documentation, Transfers, Certificate Templates
-- ============================================

-- ============================================
-- 1. COLLECTIONS
-- ============================================

-- Add columns to existing collections table (if it exists)
-- If collections table doesn't exist, create it
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'collections') THEN
        CREATE TABLE collections (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
            name TEXT NOT NULL,
            created_at TIMESTAMPTZ DEFAULT NOW(),
            updated_at TIMESTAMPTZ DEFAULT NOW()
        );
    END IF;
END $$;

-- Add new columns to collections
ALTER TABLE collections ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE collections ADD COLUMN IF NOT EXISTS cover_image_url TEXT;
ALTER TABLE collections ADD COLUMN IF NOT EXISTS visibility TEXT DEFAULT 'private';
ALTER TABLE collections ADD COLUMN IF NOT EXISTS slug TEXT;

-- Add unique constraint on slug if not exists
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conname = 'collections_slug_key'
    ) THEN
        ALTER TABLE collections ADD CONSTRAINT collections_slug_key UNIQUE (slug);
    END IF;
END $$;

-- Collection artworks junction table
CREATE TABLE IF NOT EXISTS collection_artworks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    collection_id UUID REFERENCES collections(id) ON DELETE CASCADE,
    artwork_id UUID REFERENCES artworks(id) ON DELETE CASCADE,
    order_index INTEGER DEFAULT 0,
    added_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(collection_id, artwork_id)
);

-- ============================================
-- 2. PROVENANCE RECORDS
-- ============================================

CREATE TABLE IF NOT EXISTS provenance_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    artwork_id UUID REFERENCES artworks(id) ON DELETE CASCADE,
    owner_name TEXT NOT NULL,
    owner_type TEXT, -- 'artist' | 'gallery' | 'collector' | 'dealer' | 'institution'
    acquisition_date DATE,
    acquisition_method TEXT, -- 'purchase' | 'commission' | 'gift' | 'inheritance' | 'auction' | 'transfer'
    location TEXT,
    notes TEXT,
    documentation_url TEXT,
    verified BOOLEAN DEFAULT FALSE,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 3. EXHIBITION RECORDS
-- ============================================

CREATE TABLE IF NOT EXISTS exhibition_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    artwork_id UUID REFERENCES artworks(id) ON DELETE CASCADE,
    exhibition_name TEXT NOT NULL,
    venue_name TEXT NOT NULL,
    venue_type TEXT, -- 'museum' | 'gallery' | 'fair' | 'biennale' | 'private' | 'online'
    city TEXT,
    country TEXT,
    start_date DATE,
    end_date DATE,
    catalog_number TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 4. CONSERVATION RECORDS
-- ============================================

CREATE TABLE IF NOT EXISTS conservation_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    artwork_id UUID REFERENCES artworks(id) ON DELETE CASCADE,
    record_type TEXT NOT NULL, -- 'condition_report' | 'restoration' | 'cleaning' | 'reframing' | 'material_note'
    title TEXT NOT NULL,
    description TEXT,
    performed_by TEXT,
    performed_at DATE,
    before_image_url TEXT,
    after_image_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 5. OWNERSHIP TRANSFERS
-- ============================================

CREATE TABLE IF NOT EXISTS ownership_transfers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    artwork_id UUID REFERENCES artworks(id) ON DELETE CASCADE,
    from_user_id UUID REFERENCES user_profiles(id) NOT NULL,
    to_user_id UUID REFERENCES user_profiles(id),
    to_email TEXT NOT NULL,
    status TEXT DEFAULT 'pending', -- 'pending' | 'awaiting_recipient' | 'recipient_confirmed' | 'witness_required' | 'completed' | 'cancelled' | 'rejected'
    requires_witness BOOLEAN DEFAULT FALSE,
    witness_email TEXT,
    witness_confirmed_at TIMESTAMPTZ,
    from_confirmed_at TIMESTAMPTZ,
    to_confirmed_at TIMESTAMPTZ,
    transfer_notes TEXT,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 6. CERTIFICATE TEMPLATES
-- ============================================

CREATE TABLE IF NOT EXISTS certificate_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    is_default BOOLEAN DEFAULT FALSE,
    config JSONB NOT NULL,
    -- Config structure:
    -- {
    --   "colors": { "primary": "#...", "secondary": "#...", "background": "#...", "text": "#...", "accent": "#..." },
    --   "fonts": { "heading": "...", "body": "..." },
    --   "logo_url": "...",
    --   "background_image_url": "...",
    --   "layout": "elegant" | "minimal" | "classic" | "modern",
    --   "show_qr": true,
    --   "show_seal": true,
    --   "seal_style": "embossed" | "flat" | "gold" | "none"
    -- }
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add template_id to certificates table
ALTER TABLE certificates ADD COLUMN IF NOT EXISTS template_id UUID REFERENCES certificate_templates(id);

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================

CREATE INDEX IF NOT EXISTS idx_collection_artworks_collection ON collection_artworks(collection_id);
CREATE INDEX IF NOT EXISTS idx_collection_artworks_artwork ON collection_artworks(artwork_id);
CREATE INDEX IF NOT EXISTS idx_collections_user ON collections(user_id);
CREATE INDEX IF NOT EXISTS idx_collections_slug ON collections(slug);
CREATE INDEX IF NOT EXISTS idx_collections_visibility ON collections(visibility);

CREATE INDEX IF NOT EXISTS idx_provenance_artwork ON provenance_records(artwork_id);
CREATE INDEX IF NOT EXISTS idx_provenance_order ON provenance_records(artwork_id, order_index);

CREATE INDEX IF NOT EXISTS idx_exhibition_artwork ON exhibition_records(artwork_id);
CREATE INDEX IF NOT EXISTS idx_exhibition_dates ON exhibition_records(start_date, end_date);

CREATE INDEX IF NOT EXISTS idx_conservation_artwork ON conservation_records(artwork_id);
CREATE INDEX IF NOT EXISTS idx_conservation_type ON conservation_records(record_type);

CREATE INDEX IF NOT EXISTS idx_transfers_artwork ON ownership_transfers(artwork_id);
CREATE INDEX IF NOT EXISTS idx_transfers_from_user ON ownership_transfers(from_user_id);
CREATE INDEX IF NOT EXISTS idx_transfers_to_user ON ownership_transfers(to_user_id);
CREATE INDEX IF NOT EXISTS idx_transfers_to_email ON ownership_transfers(to_email);
CREATE INDEX IF NOT EXISTS idx_transfers_status ON ownership_transfers(status);

CREATE INDEX IF NOT EXISTS idx_templates_user ON certificate_templates(user_id);
CREATE INDEX IF NOT EXISTS idx_templates_default ON certificate_templates(user_id, is_default);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on all new tables
ALTER TABLE collection_artworks ENABLE ROW LEVEL SECURITY;
ALTER TABLE provenance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE exhibition_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE conservation_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE ownership_transfers ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificate_templates ENABLE ROW LEVEL SECURITY;

-- Collections: User can manage their own collections
CREATE POLICY "Users can view own collections" ON collections
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own collections" ON collections
    FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own collections" ON collections
    FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own collections" ON collections
    FOR DELETE USING (auth.uid() = user_id);

-- Public collections viewable by anyone
CREATE POLICY "Public collections are viewable" ON collections
    FOR SELECT USING (visibility = 'public');

-- Collection artworks: Users can manage artworks in their collections
CREATE POLICY "Users can view collection artworks" ON collection_artworks
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM collections c
            WHERE c.id = collection_id AND c.user_id = auth.uid()
        )
    );
CREATE POLICY "Users can add to own collections" ON collection_artworks
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM collections c
            WHERE c.id = collection_id AND c.user_id = auth.uid()
        )
    );
CREATE POLICY "Users can remove from own collections" ON collection_artworks
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM collections c
            WHERE c.id = collection_id AND c.user_id = auth.uid()
        )
    );
CREATE POLICY "Users can reorder own collections" ON collection_artworks
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM collections c
            WHERE c.id = collection_id AND c.user_id = auth.uid()
        )
    );

-- Provenance: Users can manage provenance for their artworks
CREATE POLICY "Users can view own provenance" ON provenance_records
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM artworks a
            WHERE a.id = artwork_id AND a.user_id = auth.uid()
        )
    );
CREATE POLICY "Users can insert provenance" ON provenance_records
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM artworks a
            WHERE a.id = artwork_id AND a.user_id = auth.uid()
        )
    );
CREATE POLICY "Users can update own provenance" ON provenance_records
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM artworks a
            WHERE a.id = artwork_id AND a.user_id = auth.uid()
        )
    );
CREATE POLICY "Users can delete own provenance" ON provenance_records
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM artworks a
            WHERE a.id = artwork_id AND a.user_id = auth.uid()
        )
    );

-- Exhibition: Same pattern as provenance
CREATE POLICY "Users can view own exhibitions" ON exhibition_records
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM artworks a
            WHERE a.id = artwork_id AND a.user_id = auth.uid()
        )
    );
CREATE POLICY "Users can insert exhibitions" ON exhibition_records
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM artworks a
            WHERE a.id = artwork_id AND a.user_id = auth.uid()
        )
    );
CREATE POLICY "Users can update own exhibitions" ON exhibition_records
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM artworks a
            WHERE a.id = artwork_id AND a.user_id = auth.uid()
        )
    );
CREATE POLICY "Users can delete own exhibitions" ON exhibition_records
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM artworks a
            WHERE a.id = artwork_id AND a.user_id = auth.uid()
        )
    );

-- Conservation: Same pattern
CREATE POLICY "Users can view own conservation" ON conservation_records
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM artworks a
            WHERE a.id = artwork_id AND a.user_id = auth.uid()
        )
    );
CREATE POLICY "Users can insert conservation" ON conservation_records
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM artworks a
            WHERE a.id = artwork_id AND a.user_id = auth.uid()
        )
    );
CREATE POLICY "Users can update own conservation" ON conservation_records
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM artworks a
            WHERE a.id = artwork_id AND a.user_id = auth.uid()
        )
    );
CREATE POLICY "Users can delete own conservation" ON conservation_records
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM artworks a
            WHERE a.id = artwork_id AND a.user_id = auth.uid()
        )
    );

-- Transfers: Complex rules - sender, recipient, and witness need access
CREATE POLICY "Senders can view own transfers" ON ownership_transfers
    FOR SELECT USING (from_user_id = auth.uid());
CREATE POLICY "Recipients can view incoming transfers" ON ownership_transfers
    FOR SELECT USING (
        to_user_id = auth.uid() OR
        to_email = (SELECT email FROM user_profiles WHERE id = auth.uid())
    );
CREATE POLICY "Witnesses can view transfers" ON ownership_transfers
    FOR SELECT USING (
        witness_email = (SELECT email FROM user_profiles WHERE id = auth.uid())
    );
CREATE POLICY "Users can create transfers for own artworks" ON ownership_transfers
    FOR INSERT WITH CHECK (
        from_user_id = auth.uid() AND
        EXISTS (
            SELECT 1 FROM artworks a
            WHERE a.id = artwork_id AND a.user_id = auth.uid()
        )
    );
CREATE POLICY "Involved parties can update transfers" ON ownership_transfers
    FOR UPDATE USING (
        from_user_id = auth.uid() OR
        to_user_id = auth.uid() OR
        to_email = (SELECT email FROM user_profiles WHERE id = auth.uid()) OR
        witness_email = (SELECT email FROM user_profiles WHERE id = auth.uid())
    );

-- Certificate Templates: Users manage their own
CREATE POLICY "Users can view own templates" ON certificate_templates
    FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can insert own templates" ON certificate_templates
    FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update own templates" ON certificate_templates
    FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "Users can delete own templates" ON certificate_templates
    FOR DELETE USING (user_id = auth.uid());

-- ============================================
-- SUCCESS MESSAGE
-- ============================================
-- Migration complete! Tables created:
-- - collection_artworks (junction table)
-- - provenance_records
-- - exhibition_records
-- - conservation_records
-- - ownership_transfers
-- - certificate_templates
--
-- Plus updates to existing tables:
-- - collections (added description, cover_image_url, visibility, slug)
-- - certificates (added template_id)
