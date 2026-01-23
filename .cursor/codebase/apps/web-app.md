# Web App

**Purpose:** Main web product for artwork registration, COA generation, NFC binding, user profiles

**Tech Stack:**
- Next.js 15.1 (App Router)
- React 19.0
- TypeScript (strict)
- Tailwind CSS
- Supabase (auth + DB + storage)
- Chart.js (dashboard)

**Port:** 3003

## Directory Structure

```
apps/web-app/
├── app/
│   ├── layout.tsx              # Root layout
│   ├── loading.tsx
│   ├── (Auth)/                 # Auth group
│   │   ├── layout.tsx          # Two-column auth layout
│   │   ├── login/page.tsx
│   │   └── signup/page.tsx
│   ├── (Main)/                 # Authenticated group
│   │   ├── layout.tsx          # Sidebar layout
│   │   ├── dashboard/page.tsx
│   │   ├── artworks/page.tsx
│   │   ├── certificates/page.tsx
│   │   ├── collections/page.tsx
│   │   ├── exhibitions/page.tsx
│   │   └── profile/page.tsx
│   └── a/[username]/page.tsx   # Public artist profiles
├── middleware.ts               # Route protection
├── components/
│   ├── app-sidebar.tsx         # Main navigation
│   ├── provider.tsx
│   └── theme-provider.tsx
├── src/
│   ├── Artworks/
│   │   ├── Artworks.tsx        # Grid view
│   │   ├── ArtworkDetails.tsx  # Detail view
│   │   └── registerArtwork/    # Multi-step registration
│   │       ├── RegisterArtwork.tsx
│   │       ├── COADecisionScreen.tsx
│   │       ├── COAGenerationScreen.tsx
│   │       ├── COACertificate.tsx
│   │       └── NFCBindingScreen.tsx
│   ├── auth/
│   │   ├── login/
│   │   ├── supabase-login-form.tsx
│   │   ├── supabase-signup-form.tsx
│   │   └── supabase-multi-step-signup.tsx
│   ├── dashboard/index.tsx     # Dashboard with charts
│   ├── services/
│   │   ├── artwork-service.ts
│   │   ├── artwork-registration-service.ts
│   │   └── user-profile-service.ts
│   ├── lib/
│   │   ├── supabase.ts         # Client-side client
│   │   ├── supabase-server.ts  # Server-side client
│   │   └── supabase-middleware.ts
│   └── types/database.ts       # TypeScript types
└── styles/globals.css
```

## Routing

### Protected Routes (via middleware.ts)
```
/dashboard
/artworks
/certificates
/collections
/exhibitions
/profile
/settings
/help
```

### Public Routes
```
/login
/signup
/a/[username]   # Public artist profile
```

### Route Groups
- `(Auth)` - Shared auth layout (two-column with hero image)
- `(Main)` - Shared main layout (sidebar navigation)

## Artwork Registration Flow

### Screen 1: Form (`RegisterArtwork.tsx`)
- Image upload (JPG/PNG/WEBP, max 10MB)
- Title, year, medium, dimensions
- Description (optional, 280-500 chars)
- Edition type (unique or editioned)
- Category, collection, tags
- Autosave every 5 seconds

### Screen 2: COA Decision (`COADecisionScreen.tsx`)
- Choose to generate certificate or skip

### Screen 3: COA Generation (`COAGenerationScreen.tsx`)
- Collect artist name
- Generate:
  - Unique certificate ID (`CERT-{timestamp}-{random}`)
  - QR code URL
  - Blockchain hash (simulated)

### Screen 4: NFC Binding (`NFCBindingScreen.tsx`)
- Optional NFC tag linking
- Web NFC API (simulated)
- Track binding status

### Screen 5: Success
- Completion confirmation

## Services API

### ArtworkService (`src/services/artwork-service.ts`)
```typescript
getArtworks(userId)           // User's artworks with relations
getPublicArtworks(userId)     // Public artworks by user
getArtwork(id)                // Single artwork
createArtwork(data)           // Insert artwork
updateArtwork(id, updates)    // Update artwork
deleteArtwork(id)             // Delete (cascades)
createCertificate(data)       // Add COA
createNFCTag(data)            // Bind NFC
updateVerificationLevel(...)  // Set status
```

### UserProfileService (`src/services/user-profile-service.ts`)
```typescript
getUserProfile(userId)
updateUserProfile(userId, updates)
upsertUserProfile(userId, data)
createInitialProfile(userId, metadata)
getPublicProfile(username)
uploadAvatar(userId, file)
getUserStats(userId)
searchUsers(query)
getUsersByType(type)
checkUsernameAvailability(username)
```

## Middleware Logic

```typescript
// middleware.ts
1. Check if route is protected
2. Get current user from Supabase
3. If no user + protected route → redirect to /login
4. If user + /login or /signup → redirect to /dashboard
5. Root path "/" redirects based on auth status
```

## Form Validation Rules

```typescript
title: 2-120 characters
year: 4-digit, ≤ current year
medium: 2-80 characters
dimensions: positive numbers required
description: 280-500 characters (if provided)
edition number: must be ≤ edition size
```

## Dashboard (`src/dashboard/index.tsx`)
- Stats: Total artworks, issued certificates, pending, users
- Chart.js trends and category breakdown
- Recent activity feed

## Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=<supabase-url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-key>
```

## Scripts

```bash
pnpm dev        # Start dev server (port 3003)
pnpm build      # Build for production
pnpm start      # Start production server
pnpm lint       # ESLint
```

## Status Types

```typescript
type ArtworkStatus =
  | 'unverified'           // Just created
  | 'authenticated'        // Verified with COA
  | 'pending_verification' // In review
  | 'needs_review';        // Flagged
```

## Storage

- **Bucket:** `artwork-images`
- **Path:** `{userId}/{artworkId}-{timestamp}.{ext}`
- **Max size:** 10MB
- **Formats:** JPG, PNG, WEBP
