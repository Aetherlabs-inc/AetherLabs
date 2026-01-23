# Database Schema

Backend: **Supabase (PostgreSQL)**

## Core Tables

### user_profiles
```sql
user_profiles (
  id UUID PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  username TEXT UNIQUE,
  slug TEXT UNIQUE,
  avatar_url TEXT,
  user_type TEXT,        -- 'artist' | 'gallery' | 'collector'
  bio TEXT,
  website TEXT,
  location TEXT,
  phone TEXT,
  instagram TEXT,
  profile_visibility TEXT,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
)
```

### artworks
```sql
artworks (
  id UUID PRIMARY KEY,
  title TEXT NOT NULL,
  artist TEXT,
  year INTEGER,
  medium TEXT,
  dimensions JSONB,      -- { width, height, depth, unit }
  image_url TEXT,
  description TEXT,
  status TEXT,           -- 'unverified' | 'authenticated' | 'pending_verification' | 'needs_review'
  user_id UUID REFERENCES user_profiles(id),
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
)
```

### certificates
```sql
certificates (
  id UUID PRIMARY KEY,
  artwork_id UUID REFERENCES artworks(id),
  certificate_id TEXT UNIQUE,  -- 'CERT-{timestamp}-{random}'
  qr_code_url TEXT,
  blockchain_hash TEXT,
  generated_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ
)
```

### nfc_tags
```sql
nfc_tags (
  id UUID PRIMARY KEY,
  artwork_id UUID REFERENCES artworks(id),
  nfc_uid TEXT UNIQUE,
  is_bound BOOLEAN DEFAULT false,
  binding_status TEXT,   -- 'pending' | 'success' | 'failed'
  created_at TIMESTAMPTZ
)
```

### waitlist
```sql
waitlist (
  id UUID PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  role TEXT,             -- 'artist' | 'gallery' | 'dealer' | 'collector' | 'other'
  created_at TIMESTAMPTZ
)
```

## TypeScript Types

Location: `apps/web-app/src/types/database.ts`

```typescript
type UserType = 'artist' | 'gallery' | 'collector';

type ArtworkStatus =
  | 'unverified'
  | 'authenticated'
  | 'pending_verification'
  | 'needs_review';

type BindingStatus = 'pending' | 'success' | 'failed';

interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  username: string | null;
  slug: string | null;
  avatar_url: string | null;
  user_type: UserType;
  bio: string | null;
  website: string | null;
  location: string | null;
  profile_visibility: string | null;
  created_at: string;
  updated_at: string;
}

interface Artwork {
  id: string;
  title: string;
  artist: string | null;
  year: number | null;
  medium: string | null;
  dimensions: { width: number; height: number; depth?: number; unit: string } | null;
  image_url: string | null;
  description: string | null;
  status: ArtworkStatus;
  user_id: string;
  created_at: string;
  updated_at: string;
}

interface Certificate {
  id: string;
  artwork_id: string;
  certificate_id: string;
  qr_code_url: string | null;
  blockchain_hash: string | null;
  generated_at: string;
  created_at: string;
}

interface NFCTag {
  id: string;
  artwork_id: string;
  nfc_uid: string;
  is_bound: boolean;
  binding_status: BindingStatus;
  created_at: string;
}

// Composite type for artwork with relations
interface ArtworkWithDetails extends Artwork {
  certificates?: Certificate[];
  nfc_tags?: NFCTag[];
  verification_levels?: VerificationLevel[];
}
```

## Common Queries

### Get user's artworks with relations
```typescript
const { data } = await supabase
  .from('artworks')
  .select(`
    *,
    certificates (*),
    nfc_tags (*)
  `)
  .eq('user_id', userId)
  .order('created_at', { ascending: false });
```

### Get artwork by ID
```typescript
const { data } = await supabase
  .from('artworks')
  .select(`*, certificates (*), nfc_tags (*)`)
  .eq('id', artworkId)
  .single();
```

### Check waitlist email exists
```typescript
const { data } = await supabase
  .from('waitlist')
  .select('id')
  .eq('email', email)
  .single();
```

### Count queries
```typescript
const { count } = await supabase
  .from('artworks')
  .select('*', { count: 'exact', head: true })
  .eq('user_id', userId);
```

## Storage Buckets

| Bucket | Purpose | Access |
|--------|---------|--------|
| `artwork-images` | Artwork images | Public |
| `avatars` | User avatars | Public |

### Upload pattern
```typescript
const { data, error } = await supabase.storage
  .from('artwork-images')
  .upload(`${userId}/${artworkId}-${Date.now()}.jpg`, file);

const publicUrl = supabase.storage
  .from('artwork-images')
  .getPublicUrl(data.path).data.publicUrl;
```
