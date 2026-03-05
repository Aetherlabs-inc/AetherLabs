# AetherLabs — Improvement TODO

> Generated from codebase audit (2026-03-04). Organized by priority.

---

## 🔴 Critical

- [ ] **[landing + web-app]** Migrate fonts to `next/font/google` — remove all `@import url()` Google Font calls from CSS and the Adobe Typekit `<link>` in `apps/landing/app/layout.tsx:90`
  - `apps/landing/styles/globals.css:1-2`
  - `apps/web-app/styles/globals.css:2`

- [ ] **[web-app]** Convert `/a/[username]` and `/v/[code]` from `"use client"` to server components with `generateMetadata()` — currently blocks all dynamic SEO metadata and fetches data in `useEffect`
  - `apps/web-app/app/a/[username]/page.tsx:1`
  - `apps/web-app/app/v/[code]/page.tsx:1`

- [ ] **[landing]** Compress all large images to WebP, target <500KB each
  - `_MG_8848.jpg` (13MB), `IMG_6262-2.jpg` (12MB), `IMG_8591-2.jpg` (9.4MB), `IMG_8518.jpg` (7.2MB), `IMG_8423-2.jpg` (6.1MB)

- [ ] **[landing]** Fix or add missing `dashboard.png` referenced in `FinalCTA/index.tsx:55` — causes 404 and CLS

---

## 🟠 SEO

- [ ] **[landing + web-app]** Add `app/sitemap.ts` to both Next.js apps (include dynamic routes for `/a/[username]`, `/v/[code]`)

- [ ] **[landing + web-app]** Add `app/robots.ts` to both Next.js apps

- [ ] **[landing + web-app]** Add `viewport` export to both root layouts
  ```ts
  export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 1,
    viewportFit: 'cover',
  }
  ```

- [ ] **[landing]** Add JSON-LD `Organization` + `WebSite` schema to `app/layout.tsx`

- [ ] **[web-app]** Add JSON-LD `CreativeWork` schema to artwork/verification pages (`/v/[code]`, `/artworks/[id]`)

- [ ] **[web-app]** Add JSON-LD `Person` schema to artist profile pages (`/a/[username]`)

- [ ] **[web-app]** Add `metadata` exports to all pages missing them:
  - `dashboard/page.tsx`, `transfers/page.tsx`, `import/page.tsx`
  - `artworks/[id]/page.tsx`, `clients/[id]/page.tsx`
  - `certificates/designer/page.tsx`, `billing/page.tsx`
  - `import/history/page.tsx`, `import/[sessionId]/review/page.tsx`

- [ ] **[landing + web-app]** Add OG images to pages missing them:
  - Landing: `app/about/page.tsx`, `app/waitlist/layout.tsx`
  - Web-app: `/v/[code]`, `/a/[username]` (use artwork image dynamically)

- [ ] **[landing]** Fix `app/coming-soon/page.tsx` — add canonical, keywords, Twitter card metadata

---

## 🟡 Performance

- [ ] **[web-app]** Replace all bare `<img>` tags with `next/image` across the features directory (13 instances):
  - `src/features/artworks/Artworks.tsx:330`
  - `src/features/dashboard/index.tsx:326`
  - `src/features/artworks/ArtworkDetails.tsx:199`
  - `src/features/collections/CollectionDetail.tsx:285,364`
  - `src/features/collections/Collections.tsx:295`
  - `src/features/transfers/TransferStatusCard.tsx:42`
  - `src/features/certificates/Certificates.tsx:317`
  - `src/features/artworks/documentation/ConservationList.tsx:94,103`
  - `src/features/artworks/registerArtwork/RegisterArtwork.tsx:915`
  - `src/features/artworks/registerArtwork/COACertificate.tsx:99`
  - `src/features/artworks/registerArtwork/COACertificateElegant.tsx:146`
  - `app/a/[username]/page.tsx:198`

- [ ] **[landing]** Remove unused Three.js dependencies from `package.json` — `three`, `@react-three/fiber`, `@react-three/drei`, `troika-three-text` (~500KB bundle reduction)

- [ ] **[web-app]** Lazy load heavy dependencies with `dynamic()`:
  - `@react-pdf/renderer` (certificate generation)
  - `xlsx` (import feature)

- [ ] **[landing]** Move inline `@keyframes float` out of component into `globals.css`
  - `apps/landing/src/LandingPage/Problem/index.tsx:130-135`

- [ ] **[landing + web-app]** Add security + cache-control headers to both `next.config.mjs` files:
  - `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`
  - Cache-Control for static assets

- [ ] **[landing]** Fix `Hero/index.tsx` — add cleanup for 5 `setTimeout` calls on unmount
  - `apps/landing/src/LandingPage/Hero/index.tsx:9-16`

- [ ] **[admin-app]** Add Vite chunk splitting strategy to `vite.config.ts` — lazy load recharts, dnd-kit, @tanstack/react-table

---

## 🟢 Code Quality

- [ ] **[admin-app]** Add `@tanstack/react-query` and replace all manual `useState` + `useEffect` fetch patterns:
  - `src/pages/Dashboard.tsx:49-97`
  - `src/pages/Waitlist.tsx:26-42`
  - `src/pages/Users.tsx:27-43`

- [ ] **[admin-app]** Add error handling to all data fetches — `Dashboard.tsx:62-95` `Promise.all` crashes silently on any failure

- [ ] **[admin-app]** Delete unused dead components:
  - `src/components/app-sidebar.tsx` (duplicate of `AppSidebar.tsx`)
  - `src/components/nav-documents.tsx`
  - `src/components/nav-main.tsx`
  - `src/components/nav-secondary.tsx`
  - `src/components/nav-user.tsx`
  - `src/components/section-cards.tsx`
  - `src/components/site-header.tsx`

- [ ] **[admin-app]** Replace `window.confirm()` with Radix Dialog in `Waitlist.tsx:76`

- [ ] **[admin-app]** Fix or remove the unprotected "Delete All Data" button in `Settings.tsx:50` — no handler, no confirmation guard

- [ ] **[admin-app]** Add global `ErrorBoundary` wrapper in `App.tsx`

- [ ] **[admin-app]** Memoize column definitions in `data-table.tsx` — currently recreated on every render (line ~137)

- [ ] **[landing]** Delete duplicate/unused image files from `public/`:
  - `IMG_6262.JPG`, `IMG_8423.JPG`, `IMG_8591.JPG` (old versions, unused)
  - `hero1.jpeg`, `hero2.jpeg`, `hero3.jpeg`, `aetherhero.jpg`, `aetherooo.webp`, `hero.png`, `aetherhero1.png` (unreferenced)
  - `Aether-logo.png` (duplicate of `AetherLabs-logo.png`)

- [ ] **[landing]** Remove console logs from production code:
  - `src/LandingPage/Hero/TaskBoard.tsx`
  - `src/LandingPage/WaitlistSection/index.tsx:73`
