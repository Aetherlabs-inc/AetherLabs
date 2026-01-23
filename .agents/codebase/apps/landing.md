# Landing App

**Purpose:** Public marketing site for product story, waitlist capture, conversion flows

**Tech Stack:**
- Next.js 14 (App Router)
- React 18.3
- TypeScript
- Tailwind CSS 3.4
- Three.js + @react-three/fiber (3D)
- Framer Motion (animations)
- Supabase

**Port:** 3001

## Directory Structure

```
apps/landing/
├── app/
│   ├── layout.tsx              # Root layout (navbar + footer)
│   ├── page.tsx                # Main landing page
│   ├── about/page.tsx
│   ├── waitlist/page.tsx
│   ├── privacy/page.tsx
│   ├── terms/page.tsx
│   ├── cookies/page.tsx
│   ├── coming-soon/page.tsx
│   └── api/
│       └── waitlist/submit/route.ts  # Waitlist API
├── src/
│   ├── LandingPage/
│   │   ├── index.tsx           # Orchestrates all sections
│   │   ├── Hero/               # Main hero with art images
│   │   ├── Problem/            # Problem statement
│   │   ├── Solution/           # NFC solution diagram
│   │   ├── Vision/             # Future vision
│   │   ├── FAQ/                # Accordion FAQs
│   │   ├── WaitlistSection/
│   │   ├── Features/
│   │   ├── HowItWorks/
│   │   └── Pricing/
│   ├── NavBar/index.tsx        # Fixed header
│   ├── Footer/index.tsx        # Site footer
│   └── lib/
│       └── supabase-server.ts  # Server-side client
├── components/
│   ├── theme-provider.tsx
│   └── LoadingScreen.tsx
├── styles/
│   └── globals.css             # Global styles
└── public/
    ├── AetherLabs-logo.png
    └── IMG_*.jpg               # Art images
```

## Routing

```
/                   → Landing page (all sections)
/about              → About page
/waitlist           → Dedicated waitlist page
/privacy            → Privacy policy
/terms              → Terms of service
/cookies            → Cookie policy
/coming-soon        → Coming soon page
```

## API Endpoint

### POST /api/waitlist/submit

**Request:**
```json
{ "email": "user@example.com", "name": "John", "role": "artist" }
```

**Response (success):**
```json
{ "success": true }
```

**Response (duplicate):**
```json
{ "exists": true }
```

## Landing Page Sections

Order in `src/LandingPage/index.tsx`:
1. **Hero** - Hook with art images, CTA buttons
2. **Problem** - 3 problem cards with floating images
3. **Solution** - NFC tap diagram, how-it-works steps
4. **Vision** - Future-focused messaging with SVG diagram
5. **FAQ** - Accordion with 7 FAQs
6. **WaitlistSection** - Email capture form

## Typography System

```css
font-playfair   → Playfair Display (headlines)
font-cormorant  → Cormorant Garamond (body copy)
font-libre      → Libre Baskerville (UI labels)
```

## Animation Patterns

### Scroll-triggered fade-ins
```typescript
// FadeInElement component using Intersection Observer
<FadeInElement delay={100}>
  <Card>...</Card>
</FadeInElement>
```

### Staggered animations
Each section/card animates with 100ms incremental delays.

## 3D & Animation Libraries

- **Three.js** - 3D graphics engine
- **@react-three/fiber** - React renderer for Three.js
- **@react-three/drei** - Three.js utilities
- **Framer Motion** - React animation library

## Key Components

### NavBar (`src/NavBar/index.tsx`)
- Fixed header with logo
- Scroll-aware transparency
- "Join waitlist" CTA button
- Mobile hamburger menu

### Footer (`src/Footer/index.tsx`)
- Social links (X, Instagram, LinkedIn)
- Legal links (Terms, Privacy)
- Copyright

## Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=<supabase-url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-key>
```

## Scripts

```bash
pnpm dev        # Start dev server (port 3001)
pnpm build      # Build for production
pnpm start      # Start production server
pnpm lint       # ESLint
```

## Styling Features

```css
.cosmic-gradient   /* Warm gradient background */
.cosmic-glow       /* Gold radial glow effect */
.cosmic-grid       /* Grid pattern background */
.cosmic-glass      /* Glassmorphism with backdrop blur */
.cosmic-card       /* Card styling */
.icon-glow         /* Gold drop shadow on icons */
```

## Image Configuration (next.config.mjs)

Remote image patterns configured for:
- AWS S3
- Supabase CDN
- picsum.photos
- Unsplash
- Pixabay
