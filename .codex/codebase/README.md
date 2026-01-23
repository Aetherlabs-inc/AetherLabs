# AetherLabs AI Agent Documentation

> Navigate to the relevant file for your task. Don't read everything - just what you need.

## What is AetherLabs?

Art authentication platform connecting physical artworks to digital records via NFC tags.
**Users:** Artists, Galleries, Collectors, Dealers

## Quick Facts

- **Package Manager:** pnpm 9.15.0 (REQUIRED - never use npm/yarn)
- **Monorepo:** pnpm workspace + Turborepo
- **Backend:** Supabase (auth + PostgreSQL + storage)
- **Styling:** Tailwind CSS + Radix UI

## Documentation Index

| File | When to Read |
|------|--------------|
| [quick-reference.md](./quick-reference.md) | Scripts, env vars, file paths |
| [database.md](./database.md) | Database schema, types, queries |
| [patterns.md](./patterns.md) | Auth, Supabase, component patterns |

### Apps

| File | When to Read |
|------|--------------|
| [apps/admin-app.md](./apps/admin-app.md) | Working on internal admin panel |
| [apps/landing.md](./apps/landing.md) | Working on marketing site |
| [apps/web-app.md](./apps/web-app.md) | Working on main web product |
| [apps/mobile-app.md](./apps/mobile-app.md) | Working on React Native app |

### Packages

| File | When to Read |
|------|--------------|
| [packages/ui.md](./packages/ui.md) | Shared components, tokens, Tailwind |

## Tech Stack Overview

| App | Framework | React | Port | Build |
|-----|-----------|-------|------|-------|
| admin-app | Vite 7.2 | 19.2 | 3000 | Vite |
| landing | Next.js 14 | 18.3 | 3001 | Next.js |
| web-app | Next.js 15 | 19.0 | 3003 | Next.js |
| mobile-app | Expo 54 | Native 0.81 | N/A | EAS |

## Repository Structure

```
/
├── apps/
│   ├── admin-app/     # Vite + React 19
│   ├── landing/       # Next.js 14
│   ├── web-app/       # Next.js 15
│   └── mobile-app/    # Expo + React Native
├── packages/
│   ├── ui/            # @aetherlabs/ui
│   ├── eslint-config/
│   └── typescript-config/
├── .ai/               # This documentation
├── turbo.json
└── CLAUDE.md          # Project instructions
```

## Brand Colors

```css
--aether-white: #f9f8f6
--aether-dark: #2A2121      /* Charcoal */
--aether-gold: #BC8010      /* Warm gold */
--aether-terracotta: #CA5B2B /* Primary action */
--aether-gray: #B0B0B0
```

## Key Rules

1. **Always use pnpm** - Never npm or yarn
2. **Check existing UI primitives** - Before creating components
3. **Two-layer pattern** - Shared primitives → App wrappers
4. **No business logic in shared UI** - Keep it generic
5. **TypeScript strict mode** - All apps enforce it
