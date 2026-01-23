# @aetherlabs/ui Package

**Purpose:** Shared UI component library providing design tokens, primitives, and Tailwind configuration across all apps

**Location:** `packages/ui/`

## Installation

All apps already have this as a workspace dependency:
```json
"@aetherlabs/ui": "workspace:*"
```

## Imports

```typescript
// All exports
import { Button, Card, Input, Badge, Sidebar } from "@aetherlabs/ui";
import { SidebarProvider, useIsMobile, cn } from "@aetherlabs/ui";

// Individual primitives
import { Avatar } from "@aetherlabs/ui/primitives/avatar";
import { Tooltip } from "@aetherlabs/ui/primitives/tooltip";

// Tokens
import { colors, spacing } from "@aetherlabs/ui/tokens";

// CSS (in app's global CSS)
@import "@aetherlabs/ui/theme.css";

// Tailwind preset (in tailwind.config.ts)
import { aetherPreset } from "@aetherlabs/ui/tailwind-preset";
```

## Directory Structure

```
packages/ui/
├── src/
│   ├── index.ts              # Main exports
│   ├── primitives/           # UI components
│   │   ├── index.ts
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── sidebar.tsx
│   │   └── ... (30+ components)
│   ├── hooks/
│   │   ├── index.ts
│   │   ├── use-mobile.tsx
│   │   └── use-toast.ts
│   ├── utils/
│   │   └── cn.ts             # clsx + tailwind-merge
│   ├── tokens/
│   │   ├── index.ts
│   │   ├── colors.ts
│   │   └── spacing.ts
│   ├── theme.css             # CSS variables + utilities
│   └── tailwind-preset.ts    # Tailwind configuration
└── package.json
```

## Primitives (30+ components)

### Layout & Structure
- `sidebar` - Complex sidebar with collapse, keyboard nav, cookie persistence
- `card` - Card with header, footer, title, description, content
- `accordion` - Expandable sections
- `sheet` - Off-canvas drawer/modal
- `separator` - Visual divider
- `collapsible` - Expandable content

### Forms & Inputs
- `input` - Text input
- `textarea` - Multi-line input
- `label` - Form label
- `checkbox` - Checkbox control
- `radio-group` - Radio buttons
- `switch` - Toggle switch
- `select` - Dropdown select
- `input-otp` - OTP input

### Buttons & Navigation
- `button` - Primary button (7 variants)
- `dropdown-menu` - Context menu
- `breadcrumb` - Navigation breadcrumbs
- `toggle` / `toggle-group` - Toggle buttons

### Feedback & Display
- `badge` - Status badge
- `avatar` - User avatar with fallback
- `tooltip` - Hover tooltips
- `skeleton` - Loading placeholder
- `alert-dialog` - Confirmation dialog

### Notifications
- `toast` / `toaster` - Notification system

## Button Variants

```typescript
import { Button } from "@aetherlabs/ui";

<Button variant="default">Default</Button>
<Button variant="destructive">Delete</Button>
<Button variant="outline">Outline</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link</Button>
<Button variant="success">Success</Button>
<Button variant="warning">Warning</Button>

<Button size="default">Default</Button>
<Button size="sm">Small</Button>
<Button size="lg">Large</Button>
<Button size="icon"><Icon /></Button>
```

## Hooks

### useIsMobile
```typescript
import { useIsMobile } from "@aetherlabs/ui";

function Component() {
  const isMobile = useIsMobile(); // true if viewport < 768px
  return isMobile ? <MobileView /> : <DesktopView />;
}
```

### useToast
```typescript
import { useToast, toast } from "@aetherlabs/ui";

function Component() {
  const { toast } = useToast();

  toast({
    title: "Success",
    description: "Your changes have been saved.",
  });
}

// Or use directly
toast({ title: "Saved!" });
```

## Utilities

### cn (className merge)
```typescript
import { cn } from "@aetherlabs/ui";

<div className={cn(
  "base-class",
  isActive && "active-class",
  variant === "large" && "text-lg"
)} />
```

## Design Tokens

### Colors (`tokens/colors.ts`)
OKLCH-based color scales with 11 shades each (50-950):
- `primary` (hue 250)
- `secondary` (hue 290)
- `accent` (hue 195)
- `neutral` (grayscale)
- `success` (green)
- `warning` (yellow)
- `danger` (red)
- `info` (blue)

### Spacing (`tokens/spacing.ts`)
```typescript
spacing: { xs: 4, sm: 8, md: 16, lg: 24, xl: 32, '2xl': 48, '3xl': 64 }
radius: { sm: '0.375rem', md: '0.5rem', lg: '0.75rem', xl: '1rem', full: '9999px' }
shadow: { xs, sm, md, lg, xl }
```

## Theme CSS (`theme.css`)

### Brand Colors
```css
--aether-dark: #2A2121
--aether-gold: #BC8010
--aether-terracotta: #CA5B2B
--aether-gray: #B0B0B0
```

### Light Theme (default)
```css
--background: 35 20% 97%        /* Warm cream */
--foreground: 0 12% 15%         /* Aether dark */
--primary: 0 12% 15%            /* Black */
--primary-foreground: 18 65% 48% /* Terracotta */
--accent: 36 84% 40%            /* Gold */
```

### Dark Theme (`.dark` class)
```css
--background: 20 15% 9%         /* Deep warm black */
--foreground: 36 10% 92%        /* Warm off-white */
--primary: 36 84% 50%           /* Gold (prominent) */
--accent: 18 65% 55%            /* Terracotta */
```

### Utility Classes
```css
.cosmic-gradient   /* Warm gradient background */
.cosmic-glow       /* Gold radial glow */
.cosmic-grid       /* Grid pattern background */
.cosmic-glass      /* Glassmorphism */
.cosmic-card       /* Card styling */
.icon-glow         /* Gold drop shadow */
```

## Tailwind Preset

### Usage in apps
```typescript
// tailwind.config.ts
import { aetherPreset } from "@aetherlabs/ui/tailwind-preset";

const config = {
  presets: [aetherPreset],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "../../packages/ui/src/**/*.{ts,tsx}", // Include UI source
  ],
  plugins: [require("tailwindcss-animate")],
};
```

### Preset includes
- Dark mode (class-based)
- Container settings (centered, max 1400px)
- Font families (Inter, Playfair, Cormorant, Libre)
- All semantic colors
- Border radius configuration
- Accordion animations

## Adding a New Component

1. Create file: `packages/ui/src/primitives/component-name.tsx`
2. Export from: `packages/ui/src/primitives/index.ts`
3. Re-export from: `packages/ui/src/index.ts`
4. Run: `pnpm build:ui`

## Build

```bash
# From root
pnpm build:ui

# From packages/ui
pnpm build
```

Build tool: `tsup` (esbuild-based, outputs ESM with TypeScript definitions)
