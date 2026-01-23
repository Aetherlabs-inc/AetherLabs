# Admin App

**Purpose:** Internal admin panel for waitlist management, user management, marketing operations

**Tech Stack:**
- Vite 7.2 + React 19.2
- React Router 7
- TypeScript (strict)
- Tailwind CSS 4.1
- Supabase (auth + DB)

**Port:** 3000

## Directory Structure

```
apps/admin-app/
├── src/
│   ├── main.tsx              # Entry point
│   ├── App.tsx               # Router setup
│   ├── index.css             # Tailwind + brand colors
│   ├── pages/
│   │   ├── Dashboard.tsx     # Stats cards
│   │   ├── Login.tsx         # Auth form
│   │   ├── Waitlist.tsx      # Waitlist table
│   │   ├── Users.tsx         # User profiles
│   │   ├── Content.tsx       # Placeholder
│   │   └── Settings.tsx      # Placeholder
│   ├── components/
│   │   ├── AppSidebar.tsx    # Main navigation
│   │   ├── Layout.tsx        # Page wrapper
│   │   ├── ProtectedRoute.tsx # Auth guard
│   │   ├── nav-main.tsx      # Sidebar nav items
│   │   └── nav-user.tsx      # User dropdown
│   ├── lib/
│   │   ├── auth.tsx          # Auth context
│   │   ├── supabase.ts       # Supabase client
│   │   └── utils.ts          # cn() utility
│   └── hooks/
│       └── use-mobile.ts     # Mobile detection
├── vite.config.ts
├── tsconfig.json
└── package.json
```

## Routing

```
/login              → Login (public)
/                   → Dashboard (protected)
├── /waitlist       → Waitlist management
├── /users          → User management
├── /content        → Content (placeholder)
└── /settings       → Settings (placeholder)
```

All routes except `/login` require authentication via `ProtectedRoute`.

## Key Components

### AppSidebar (`src/components/AppSidebar.tsx`)
- Main navigation sidebar
- Collapsible icon mode
- Quick Create action button
- User profile dropdown in footer

### Layout (`src/components/Layout.tsx`)
- Wraps all authenticated pages
- Contains SidebarProvider + AppSidebar
- Renders child routes via `<Outlet />`

### Dashboard (`src/pages/Dashboard.tsx`)
- 4 stat cards: Waitlist Signups, Today's Signups, Registered Users, Active Today
- Queries `user_profiles` and `waitlist` tables

### Waitlist (`src/pages/Waitlist.tsx`)
- Full waitlist table with search
- Multi-select + delete functionality
- CSV export
- Role badges (Artist, Gallery, Collector)

## Auth Flow

1. `AuthProvider` wraps entire app in `App.tsx`
2. On mount, checks existing session via `getSession()`
3. Listens for auth state changes
4. `ProtectedRoute` redirects to `/login` if not authenticated
5. Login form uses `signInWithPassword()`
6. Successful login redirects to `/`

## Auth Context API

```typescript
// src/lib/auth.tsx
interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}
```

## Supabase Tables Used

- `waitlist` - Email, name, role, created_at
- `user_profiles` - User data
- `profiles` - Legacy user table

## Environment Variables

```env
VITE_SUPABASE_URL=<supabase-url>
VITE_SUPABASE_ANON_KEY=<anon-key>
```

## Scripts

```bash
pnpm dev        # Start dev server (port 3000)
pnpm build      # Build for production
pnpm lint       # ESLint
pnpm preview    # Preview production build
```

## Styling

Uses Tailwind CSS 4.1 with brand colors defined in `src/index.css`:
```css
--aether-dark: #2A2121
--aether-gold: #BC8010
--aether-terracotta: #CA5B2B
--aether-gray: #B0B0B0
```

Light/dark mode via CSS variables for sidebar theming.
