# Mobile App

**Purpose:** Primary product experience with NFC capabilities for artwork authentication

**Tech Stack:**
- Expo 54.0 (SDK 54)
- React Native 0.81.5
- Expo Router 6.0 (file-based routing)
- TypeScript
- Zustand (state management)
- Supabase
- react-native-nfc-manager

**Build:** EAS Build (requires development build for NFC)

## Directory Structure

```
apps/mobile-app/
├── app/                          # Expo Router
│   ├── _layout.tsx               # Root layout with providers
│   ├── index.tsx                 # Entry redirect
│   ├── setup.tsx                 # Onboarding
│   ├── (auth)/
│   │   ├── _layout.tsx           # Auth stack
│   │   ├── signin.tsx
│   │   └── signup.tsx
│   ├── (tabs)/
│   │   ├── _layout.tsx           # Tab bar with FAB
│   │   ├── home.tsx              # Dashboard
│   │   ├── artworks.tsx          # Artwork list
│   │   ├── scan.tsx              # NFC scanning
│   │   └── profile.tsx           # User profile
│   ├── (artworks)/new/
│   │   ├── index.tsx             # Redirect to step 1
│   │   ├── step1-basic.tsx       # Basic info
│   │   ├── step2-nfc.tsx         # Certificate + NFC
│   │   ├── step3-context.tsx     # Additional context
│   │   └── success.tsx           # Completion
│   ├── artworks/
│   │   ├── [id].tsx              # Artwork detail
│   │   ├── [id]/certificate.tsx  # Certificate view
│   │   ├── [id]/authenticity.tsx # Verification result
│   │   └── [id]/edit.tsx         # Edit artwork
│   └── profile/
│       ├── settings.tsx
│       ├── account-security.tsx
│       ├── app-settings.tsx
│       └── edit.tsx
├── lib/
│   ├── supabase.ts               # Supabase client
│   ├── nfc.ts                    # NFC operations
│   ├── artworks.ts               # Artwork CRUD
│   ├── certificates.ts           # Certificate generation
│   ├── profile.ts                # Profile operations
│   ├── storage.ts                # File uploads
│   └── theme.ts                  # Design tokens
├── contexts/
│   ├── AuthContext.tsx           # Auth state
│   └── ThemeContext.tsx          # Theme state
├── store/
│   └── useNewArtworkStore.ts     # Zustand form store
├── components/
│   ├── ui/                       # Primitives
│   └── profile/                  # Profile modals
├── types/index.ts
└── ios/                          # iOS native code
```

## Navigation

### Tab Bar (Custom with FAB)
- **Home** - Dashboard/overview
- **Artworks** - Browse artworks
- **FAB** (center) - Quick create artwork
- **Scan** - NFC scanning (hidden from bar)
- **Profile** - User profile (hidden from bar)

### Artwork Registration Flow
1. `step1-basic.tsx` - Title, artist, year, medium, dimensions, image
2. `step2-nfc.tsx` - Certificate toggle + NFC linking
3. `step3-context.tsx` - Location, for sale, price
4. `success.tsx` - Completion

## NFC Implementation

### Functions (`lib/nfc.ts`)

```typescript
isNfcModuleAvailable()    // Check if NFC manager loaded
isNfcSupported()          // Check device hardware
isNfcEnabled()            // Check device toggle
startNfc()                // Initialize NFC manager
stopNfc()                 // Cleanup resources
readNfcTag()              // Read tag UID (NDEF)
requestNfcPermission()    // Request permissions
```

### Platform-Specific UID Reading
```typescript
if (Platform.OS === 'ios') {
  uid = tag.id;  // Direct string
} else {
  uid = tag.id.map(byte =>
    byte.toString(16).padStart(2, '0')
  ).join('');
}
```

### iOS Requirements
- iPhone 7+ (no simulator support)
- Development build (not Expo Go)
- Entitlements: `com.apple.developer.nfc.readersession.formats = [NDEF, TAG]`
- Info.plist: `NFCReaderUsageDescription`

### Android Requirements
- Manifest: `android.permission.NFC`
- Automatic permission handling

## Scan Screen (`app/(tabs)/scan.tsx`)

Features:
- Real-time NFC tag detection
- Scan history with timestamps
- Quick actions (View Artworks, Manage Tags, Scan Tips)
- Stats (Total Scans, Unique Artworks, Last Scan)
- Haptic feedback for scan events
- States: Found (verified), Not Found (unlinked), Error

## State Management

### Zustand Store (`store/useNewArtworkStore.ts`)
```typescript
interface NewArtworkState {
  title, year, medium, dimensions, artist, imageUri
  location, forSale, price
  generateCertificate, certificateId
  artworkId
  // Actions
  setTitle(), setYear(), ..., reset()
}
```

### Auth Context (`contexts/AuthContext.tsx`)
```typescript
interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signIn(email, password): Promise<void>;
  signUp(email, password, name): Promise<void>;
  signOut(): Promise<void>;
  reloadUser(): Promise<void>;
}
```

### Theme Context (`contexts/ThemeContext.tsx`)
```typescript
interface ThemeContextType {
  theme: Theme;
  mode: 'light' | 'dark';
  setMode(mode): void;
}
```

## Library Functions

### Artworks (`lib/artworks.ts`)
```typescript
getArtworks(userId)
getArtworkById(id)
getPublicArtworkById(id)
createArtwork(data)
updateArtwork(id, updates)
deleteArtwork(id)
linkNfcTag(artworkId, nfcUID)
getNFCTagByUID(nfcUID)
getNFCTagByArtworkId(artworkId)
```

### Certificates (`lib/certificates.ts`)
```typescript
createCertificate(artworkId, options)
// Generates: certificate_id, qr_code_url, blockchain_hash
getCertificateByArtworkId(artworkId)
getCertificateById(certificateId)
getUserCertificates(userId)
deleteCertificate(id)
```

### Profile (`lib/profile.ts`)
```typescript
validateUsername(username)
checkUsernameAvailability(username)
updateProfile(userId, updates)
```

### Storage (`lib/storage.ts`)
```typescript
uploadImage(fileUri, bucketName, folder)
// Returns public URL
```

## Theme Tokens (`lib/theme.ts`)

```typescript
Colors: 60+ semantic properties
Typography: Font sizes (xs-4xl), weights, line heights
Spacing: xs(4px) to 4xl(48px)
BorderRadius: sm(6px) to full(9999px)
Shadows: sm, base, md with elevation levels

// Brand colors
terracotta: '#CA5B2B'
burningFlame: '#FFB162'
```

## Environment Variables

```env
EXPO_PUBLIC_SUPABASE_URL=<supabase-url>
EXPO_PUBLIC_SUPABASE_ANON_KEY=<anon-key>
```

## Scripts

```bash
pnpm start        # Expo dev server
pnpm ios          # iOS simulator
pnpm android      # Android emulator
pnpm build:dev    # EAS development build
```

## Build Configuration

### app.json
```json
{
  "expo": {
    "name": "AetheraApp",
    "slug": "AetheraApp",
    "newArchEnabled": true,
    "ios": {
      "bundleIdentifier": "com.rashodkorala.AetheraApp",
      "supportsTablet": true,
      "infoPlist": {
        "NFCReaderUsageDescription": "..."
      }
    }
  }
}
```

### eas.json
- `development` - Dev client with simulator
- `preview` - Internal distribution
- `production` - App Store submission

## Important Notes

1. **NFC requires development build** - Expo Go doesn't support NFC
2. **iOS simulator doesn't support NFC** - Test on physical device
3. **AsyncStorage for session** - Supabase persists to AsyncStorage
4. **Zustand for form state** - Persists across navigation
