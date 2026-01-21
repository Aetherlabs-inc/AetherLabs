# AetherLabs Dashboard

Authenticated application for managing artworks, certificates, collections, and user profiles.

## Overview

This repository contains the authenticated dashboard application where users (artists, galleries, collectors) can manage their artworks, view certificates, and manage their profiles.

## Features

- **Authentication**: Login and signup pages
- **Dashboard**: Overview and analytics
- **Artwork Management**: Register, view, and manage artworks
- **Certificates**: View and manage authentication certificates
- **Collections**: Organize artworks into collections
- **Profile Management**: Edit user profile, set username, manage visibility
- **Exhibitions**: Manage gallery exhibitions
- **User Management**: Admin features for managing users

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- React 18
- Tailwind CSS
- shadcn/ui components
- Supabase (authentication & database)
- AWS Amplify (some backend features)
- Chart.js (for analytics)

## Getting Started

1. Install dependencies:
```bash
pnpm install
```

2. Set up environment variables:
```bash
cp .env.example .env.local
```

Required environment variables:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- AWS Amplify configuration (if using)

3. Run database migrations:
```bash
# Apply Supabase migrations from supabase-*.sql files
```

4. Run the development server:
```bash
pnpm dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
app/
  (Auth)/            # Authentication routes (login/signup)
  (Main)/            # Authenticated routes
    dashboard/       # Dashboard page
    artworks/        # Artwork management
    certificates/    # Certificate management
    collections/     # Collections
    profile/         # User profile settings
    exhibitions/     # Exhibitions
    (Management)/    # Admin routes
  api/               # API routes

src/
  dashboard/         # Dashboard components
  Artworks/          # Artwork components
  services/          # Backend services
  types/             # TypeScript types
  lib/               # Supabase & utilities
  components/        # Auth provider

middleware.ts        # Auth middleware
supabase-*.sql       # Database migrations
```

## Authentication

This app requires authentication. Users must:
1. Sign up or log in through the landing page
2. Be redirected to the dashboard after authentication
3. Have valid session tokens for all routes

## Database Migrations

Apply migrations in order:
1. `supabase-username-migration.sql`
2. `supabase-public-profile-policy.sql`
3. Other migrations as needed

## Deployment

This is a protected application and should be deployed with:
- Environment variables properly configured
- Database migrations applied
- RLS policies enabled in Supabase

## Related Repositories

- [Landing Page](../landing-page) - Public-facing marketing site

