# AetherLabs

Art authentication platform connecting physical artworks to digital records via NFC.

## Documentation

All documentation is in `.agents/`. Read the relevant file for your task:

```
.agents/
├── README.md              # Start here - index & overview
├── codebase/
│   ├── README.md          # Codebase overview, tech stack
│   ├── rules.md           # Project rules & philosophy
│   ├── quick-reference.md # Scripts, env vars, file paths
│   ├── database.md        # Schema, types, queries
│   ├── patterns.md        # Auth, Supabase, component patterns
│   ├── apps/              # Per-app documentation
│   └── packages/          # Shared packages documentation
└── skills/                # Task methodology guides
```

## Quick Rules

- **Package manager:** pnpm (never npm/yarn)
- **Monorepo:** Turbo orchestrates all builds
- **Shared UI:** Check `packages/ui` before creating components
- **Two-layer model:** Shared primitives → App wrappers

## Brand Colors

```
aether-dark: #2A2121
aether-gold: #BC8010
aether-terracotta: #CA5B2B
aether-gray: #B0B0B0
```
