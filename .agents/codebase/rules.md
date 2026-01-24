# Project Rules & Philosophy

## Non-Negotiables

1. **pnpm only** - Never use npm or yarn
2. **Turbo** - Orchestrator for all multi-app workflows
3. **Shared UI** - Default choice for common components
4. **Abstraction** - Only when it reduces total complexity

## Monorepo Rules

1. Always use `pnpm` for package management
2. Use Turbo for monorepo orchestration
3. Keep shared code in shared packages, avoid duplicating logic across apps
4. Prefer changes that improve reuse without making components harder to understand
5. Build app page components in `apps/*/src/**` and import them into `apps/*/app/**` route files
6. Keep feature UI under `src/features/*` and avoid spaces/caps in route group folder names

## Working Conventions

1. Make small, reviewable changes
2. Keep names consistent across apps and packages
3. Add minimal documentation near complex logic
4. Favor predictable folder structures for components, hooks, utils, and services
5. Keep NFC and security sensitive logic well isolated and well tested

## Starting a Task

1. Identify which app or package is the source of truth for the change
2. Check if shared UI primitives already exist that can be reused
3. Prefer implementing the smallest complete slice end to end
4. Validate the change in the target app first, then consider extraction into shared UI if it repeats

## Two-Layer Component Model

### Layer 1: Shared Primitives (packages/ui)

Location: `packages/ui/`

**Rules:**
1. No app-specific routes, copy, permissions, or business logic
2. Expose composition points via props and slots
3. Provide sane defaults so apps can adopt quickly
4. Keep API stable and documented

**Example:** `Sidebar` - includes layout, responsive behavior, collapse state, keyboard nav, slot-based sections. Does NOT include app-specific routes or labels.

### Layer 2: App Wrappers (apps/*/components)

Location: Inside each app

**Rules:**
1. Prefer composition over forking shared code
2. Only add app-specific concerns: routes, feature flags, access rules, copy
3. Keep wrappers thin, push generic behavior down to shared primitives

**Example:** `AppSidebar` - wraps `Sidebar`, supplies app nav items, badges, role-based visibility.

### Extraction Guidance

1. Start app-local when unsure
2. Extract into shared primitives once 2+ apps need the same behavior
3. Avoid moving app copy, routes, or permissions into shared UI

## Shared UI Philosophy

**Principles:**
1. Build primitives first, then app-specific components on top
2. Keep primitives abstract but not unusably generic
3. Avoid baking app-specific business logic into primitives
4. Prefer composition over inheritance
5. Keep styling tokens centralized so changes propagate cleanly

**Practical Guidance:**
1. If multiple apps need it → shared UI primitive
2. If only one app needs it → build inside that app using shared primitives
3. If unclear → start app-local, extract once you see repetition

## Agent Model Guidelines

| Model | Use For |
|-------|---------|
| Haiku | File discovery, locating modules, quick repo mapping |
| Sonnet | Planning, incremental tasks, small refactors, docs |
| Opus | Architecture changes, complex refactors, performance, cross-app redesigns |
