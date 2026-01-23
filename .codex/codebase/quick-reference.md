# Quick Reference

## Scripts

```bash
# Root commands
pnpm dev              # Start all apps
pnpm build            # Build all apps
pnpm lint             # Lint all packages
pnpm type-check       # TypeScript validation
pnpm clean            # Clean artifacts

# App-specific
pnpm dev:web          # web-app (port 3003)
pnpm dev:landing      # landing (port 3001)
pnpm dev:admin        # admin-app (port 3000)
pnpm build:ui         # Build UI package

# Mobile (from apps/mobile-app)
pnpm start            # Expo dev server
pnpm ios              # iOS simulator
pnpm android          # Android emulator
```

## Environment Variables

```env
# Next.js apps
NEXT_PUBLIC_SUPABASE_URL=<url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<key>

# Vite apps (admin-app)
VITE_SUPABASE_URL=<url>
VITE_SUPABASE_ANON_KEY=<key>

# Expo (mobile-app)
EXPO_PUBLIC_SUPABASE_URL=<url>
EXPO_PUBLIC_SUPABASE_ANON_KEY=<key>
```

## File Paths

### Admin App (`apps/admin-app/`)
| Purpose | Path |
|---------|------|
| Entry | `src/main.tsx` |
| Router | `src/App.tsx` |
| Auth Context | `src/lib/auth.tsx` |
| Pages | `src/pages/*.tsx` |
| Sidebar | `src/components/AppSidebar.tsx` |
| Styles | `src/index.css` |

### Landing (`apps/landing/`)
| Purpose | Path |
|---------|------|
| Root Layout | `app/layout.tsx` |
| Landing Sections | `src/LandingPage/*.tsx` |
| Waitlist API | `app/api/waitlist/submit/route.ts` |
| Navbar | `src/NavBar/index.tsx` |
| Styles | `styles/globals.css` |

### Web App (`apps/web-app/`)
| Purpose | Path |
|---------|------|
| Root Layout | `app/layout.tsx` |
| Middleware | `middleware.ts` |
| Artwork Registration | `src/Artworks/registerArtwork/RegisterArtwork.tsx` |
| Services | `src/services/*.ts` |
| Database Types | `src/types/database.ts` |
| Supabase Client | `src/lib/supabase.ts` |
| Dashboard | `src/dashboard/index.tsx` |

### Mobile App (`apps/mobile-app/`)
| Purpose | Path |
|---------|------|
| Root Layout | `app/_layout.tsx` |
| Tab Navigator | `app/(tabs)/_layout.tsx` |
| NFC Functions | `lib/nfc.ts` |
| Artwork CRUD | `lib/artworks.ts` |
| Auth Context | `contexts/AuthContext.tsx` |
| Theme Tokens | `lib/theme.ts` |
| Form Store | `store/useNewArtworkStore.ts` |

### Shared UI (`packages/ui/`)
| Purpose | Path |
|---------|------|
| Main Export | `src/index.ts` |
| Primitives | `src/primitives/*.tsx` |
| Hooks | `src/hooks/*.ts` |
| Theme CSS | `src/theme.css` |
| Tailwind Preset | `src/tailwind-preset.ts` |
| Color Tokens | `src/tokens/colors.ts` |

## Common Tasks

### Add a new UI component
1. Create `packages/ui/src/primitives/component-name.tsx`
2. Export from `packages/ui/src/primitives/index.ts`
3. Re-export from `packages/ui/src/index.ts`
4. Run `pnpm build:ui`

### Add a new page (web-app)
1. Create `apps/web-app/app/(Main)/page-name/page.tsx`
2. Add nav link in `apps/web-app/components/app-sidebar.tsx`
3. Add to middleware if protected

### Add a new screen (mobile-app)
1. Create file in `apps/mobile-app/app/` (Expo Router)
2. Add tab in `apps/mobile-app/app/(tabs)/_layout.tsx` if needed

### Modify Tailwind theme
1. Edit `packages/ui/src/theme.css` for CSS variables
2. Or `packages/ui/src/tailwind-preset.ts` for config
3. Run `pnpm build:ui`
