# AI Agent Resources

This directory contains all resources for AI agents working on AetherLabs.

## Quick Navigation

| Need | Go To |
|------|-------|
| Understand the codebase | [codebase/README.md](./codebase/README.md) |
| Build frontend UI | [skills/frontend-design/SKILL.md](./skills/frontend-design/SKILL.md) |

---

## Directory Structure

```
.agents/
├── codebase/              # Project-specific knowledge
│   ├── README.md          # Codebase overview & navigation
│   ├── rules.md           # Project rules & philosophy
│   ├── quick-reference.md # Scripts, env vars, file paths
│   ├── database.md        # Schema, types, queries
│   ├── patterns.md        # Auth, Supabase, component patterns
│   ├── apps/
│   │   ├── admin-app.md   # Internal admin panel
│   │   ├── landing.md     # Marketing site
│   │   ├── web-app.md     # Main web product
│   │   └── mobile-app.md  # React Native app
│   └── packages/
│       └── ui.md          # Shared UI library
│
└── skills/                # Reusable methodology guides
    ├── frontend-design/   # Frontend design skill
    │   └── SKILL.md
    └── skill-creator/     # Create new skills
        └── SKILL.md
```

---

## Codebase Documentation

**What:** Project-specific knowledge about AetherLabs structure, patterns, and conventions.

| File | When to Read |
|------|--------------|
| [codebase/README.md](./codebase/README.md) | Quick overview, tech stack, brand colors |
| [codebase/rules.md](./codebase/rules.md) | Project rules, philosophy, conventions |
| [codebase/quick-reference.md](./codebase/quick-reference.md) | Scripts, env vars, file paths |
| [codebase/database.md](./codebase/database.md) | Database schema, types, queries |
| [codebase/patterns.md](./codebase/patterns.md) | Auth, Supabase, component patterns |

### Apps
| File | When to Read |
|------|--------------|
| [codebase/apps/admin-app.md](./codebase/apps/admin-app.md) | Working on internal admin panel |
| [codebase/apps/landing.md](./codebase/apps/landing.md) | Working on marketing site |
| [codebase/apps/web-app.md](./codebase/apps/web-app.md) | Working on main web product |
| [codebase/apps/mobile-app.md](./codebase/apps/mobile-app.md) | Working on React Native app |

### Packages
| File | When to Read |
|------|--------------|
| [codebase/packages/ui.md](./codebase/packages/ui.md) | Shared UI components, tokens, Tailwind |

---

## Skills

**What:** Reusable methodology guides for how to approach specific types of tasks.

| Skill | Purpose |
|-------|---------|
| [frontend-design](./skills/frontend-design/SKILL.md) | Create distinctive, production-grade frontend interfaces |
| [skill-creator](./skills/skill-creator/SKILL.md) | Create new skills for AI agents |

---

## Quick Facts

- **Package Manager:** pnpm (never npm/yarn)
- **Monorepo:** pnpm workspace + Turborepo
- **Backend:** Supabase (auth + PostgreSQL + storage)
- **Styling:** Tailwind CSS + Radix UI

## Brand Colors

```css
--aether-white: #f9f8f6
--aether-dark: #2A2121
--aether-gold: #BC8010
--aether-terracotta: #CA5B2B
--aether-gray: #B0B0B0
```
