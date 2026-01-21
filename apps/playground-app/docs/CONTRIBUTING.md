# Contributing to the Component Playground

## Quick Start

```bash
# Clone and install
cd playground-app
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build
```

---

## Common Tasks

### Adding a New Component Example

**File:** `src/data/component-examples.ts`

```tsx
export const componentExamples: ComponentExample[] = [
  // Add your example
  {
    name: 'Alert Dialog',
    description: 'Modal dialog for important messages',
    category: 'feedback',  // inputs | display | feedback | layout | navigation | tokens
    code: `function Demo() {
  const [open, setOpen] = React.useState(false)

  return (
    <div>
      <Button onClick={() => setOpen(true)}>
        Open Alert
      </Button>
      {open && (
        <Card className="fixed inset-0 m-auto w-80 h-fit">
          <CardHeader>
            <CardTitle>Are you sure?</CardTitle>
          </CardHeader>
          <CardFooter className="gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={() => setOpen(false)}>
              Delete
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  )
}`,
  },
]
```

---

### Adding a New Component to Preview Scope

**File:** `src/components/Preview.tsx`

```tsx
// Import your component
import { AlertDialog } from '@aetherlabs/design-system'

// Add to scope
const scope = {
  React,
  console: consoleProxy || console,
  ...DesignSystem,
  ...LucideIcons,
  AlertDialog,  // Add here
}
```

---

### Adding TypeScript Definitions for IntelliSense

**File:** `src/components/CodeEditor.tsx`

```tsx
const EXTRA_LIBS = `
  // Add your type definitions
  declare function AlertDialog(props: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    description?: string;
    children?: React.ReactNode;
  }): JSX.Element;
`
```

---

### Adding a New Category

**File:** `src/data/component-examples.ts`

```tsx
// 1. Update the type
export interface ComponentExample {
  category: 'inputs' | 'display' | 'feedback' | 'layout' | 'navigation' | 'tokens' | 'charts'  // Add new
}

// 2. Add to categories list
export const categories = [
  { id: 'all', label: 'All Components' },
  { id: 'inputs', label: 'Inputs' },
  { id: 'display', label: 'Display' },
  { id: 'feedback', label: 'Feedback' },
  { id: 'layout', label: 'Layout' },
  { id: 'navigation', label: 'Navigation' },
  { id: 'tokens', label: 'Tokens' },
  { id: 'charts', label: 'Charts' },  // Add new
] as const
```

**File:** `src/components/ComponentList.tsx`

```tsx
import { BarChart3 } from 'lucide-react'

const categoryIcons: Record<string, React.ReactNode> = {
  // ...existing
  charts: <BarChart3 className="h-4 w-4" />,  // Add icon
}
```

---

### Adding a New Viewport Size

**File:** `src/types/playground.ts`

```tsx
export const VIEWPORT_SIZES: ViewportSize[] = [
  { name: 'Mobile', width: 375, height: 667, icon: 'smartphone' },
  { name: 'Tablet', width: 768, height: 1024, icon: 'tablet' },
  { name: 'Laptop', width: 1366, height: 768, icon: 'laptop' },  // Add new
  { name: 'Desktop', width: 1920, height: 1080, icon: 'monitor' },
  { name: 'Full', width: -1, height: 'auto', icon: 'maximize' },
]
```

**File:** `src/components/ViewportToggle.tsx`

```tsx
import { Laptop } from 'lucide-react'

const ICONS: Record<string, React.ReactNode> = {
  smartphone: <Smartphone className="h-4 w-4" />,
  tablet: <Tablet className="h-4 w-4" />,
  laptop: <Laptop className="h-4 w-4" />,  // Add icon
  monitor: <Monitor className="h-4 w-4" />,
  maximize: <Maximize className="h-4 w-4" />,
}
```

---

### Adding a New Export Format

**File:** `src/components/ExportMenu.tsx`

```tsx
const handleExportAsReactNative = () => {
  // Transform code for React Native
  const rnCode = activeFile.content
    .replace(/className=/g, 'style=')
    .replace(/<div/g, '<View')
    .replace(/<\/div>/g, '</View>')

  // Download
  const blob = new Blob([rnCode], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = activeFile.name.replace('.tsx', '.native.tsx')
  a.click()
  URL.revokeObjectURL(url)
}

// Add to menu
<button onClick={handleExportAsReactNative}>
  Export as React Native
</button>
```

---

### Adding a Custom Monaco Theme

**File:** `src/components/CodeEditor.tsx`

```tsx
// In handleBeforeMount callback
monaco.editor.defineTheme('my-custom-theme', {
  base: 'vs-dark',
  inherit: true,
  rules: [
    { token: 'comment', foreground: '6A9955', fontStyle: 'italic' },
    { token: 'keyword', foreground: 'C586C0' },
    { token: 'string', foreground: 'CE9178' },
    { token: 'number', foreground: 'B5CEA8' },
    { token: 'type', foreground: '4EC9B0' },
    { token: 'function', foreground: 'DCDCAA' },
    { token: 'variable', foreground: '9CDCFE' },
  ],
  colors: {
    'editor.background': '#1E1E1E',
    'editor.foreground': '#D4D4D4',
    'editorCursor.foreground': '#AEAFAD',
    'editor.lineHighlightBackground': '#2D2D2D',
    'editor.selectionBackground': '#264F78',
  },
})
```

---

### Creating a Custom Hook

**File:** `src/hooks/useComponentHistory.ts`

```tsx
import { useState, useCallback } from 'react'

interface HistoryState {
  past: string[]
  present: string
  future: string[]
}

export function useComponentHistory(initialCode: string) {
  const [history, setHistory] = useState<HistoryState>({
    past: [],
    present: initialCode,
    future: [],
  })

  const update = useCallback((newCode: string) => {
    setHistory(prev => ({
      past: [...prev.past, prev.present],
      present: newCode,
      future: [],
    }))
  }, [])

  const undo = useCallback(() => {
    setHistory(prev => {
      if (prev.past.length === 0) return prev
      const newPast = [...prev.past]
      const newPresent = newPast.pop()!
      return {
        past: newPast,
        present: newPresent,
        future: [prev.present, ...prev.future],
      }
    })
  }, [])

  const redo = useCallback(() => {
    setHistory(prev => {
      if (prev.future.length === 0) return prev
      const newFuture = [...prev.future]
      const newPresent = newFuture.shift()!
      return {
        past: [...prev.past, prev.present],
        present: newPresent,
        future: newFuture,
      }
    })
  }, [])

  return {
    code: history.present,
    update,
    undo,
    redo,
    canUndo: history.past.length > 0,
    canRedo: history.future.length > 0,
  }
}
```

---

## Code Style Guidelines

### Component Structure

```tsx
// 1. Imports (grouped)
import { useState, useCallback } from 'react'           // React
import { cn, Button } from '@aetherlabs/design-system'  // Design system
import { Plus, Minus } from 'lucide-react'              // Icons
import type { MyType } from '@/types/playground'        // Types

// 2. Interface
interface MyComponentProps {
  value: string
  onChange: (value: string) => void
  className?: string
}

// 3. Component
export function MyComponent({ value, onChange, className }: MyComponentProps) {
  // Hooks first
  const [state, setState] = useState(false)

  // Callbacks
  const handleClick = useCallback(() => {
    // ...
  }, [])

  // Render
  return (
    <div className={cn('base-classes', className)}>
      {/* content */}
    </div>
  )
}
```

### Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Component | PascalCase | `ViewportToggle` |
| Hook | camelCase with `use` prefix | `usePlaygroundSession` |
| Type/Interface | PascalCase | `PlaygroundSession` |
| Constant | SCREAMING_SNAKE_CASE | `VIEWPORT_SIZES` |
| File (component) | PascalCase | `ViewportToggle.tsx` |
| File (hook) | camelCase | `useConsole.ts` |
| File (types) | lowercase | `playground.ts` |

### CSS/Tailwind Guidelines

```tsx
// Use cn() for conditional classes
className={cn(
  'base-classes',
  condition && 'conditional-classes',
  className  // Allow override
)}

// Group related classes
className="flex items-center gap-2"  // Layout
className="px-4 py-2"                // Spacing
className="bg-neutral-900 border border-neutral-800"  // Colors
className="text-sm font-medium"      // Typography
className="transition-colors"        // Animation
```

---

## Testing

### Manual Testing Checklist

- [ ] Code editor loads and accepts input
- [ ] Preview updates on code change
- [ ] Syntax errors show in console panel
- [ ] Runtime errors show error boundary
- [ ] Viewport toggle changes preview size
- [ ] Theme toggle switches light/dark
- [ ] File tabs add/remove/switch
- [ ] Copy/Reset buttons work
- [ ] Export menu options function
- [ ] Session save/load persists
- [ ] Resizable panel drags correctly

### Browser Testing

- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

---

## Performance Tips

### Memoization

```tsx
// Memoize expensive computations
const transformedCode = useMemo(() => {
  return transform(code, options)
}, [code])

// Memoize callbacks passed to children
const handleChange = useCallback((value: string) => {
  onChange(value)
}, [onChange])
```

### Lazy Loading

```tsx
// Lazy load heavy components
const MonacoEditor = lazy(() => import('@monaco-editor/react'))

// Use Suspense
<Suspense fallback={<Skeleton className="h-full" />}>
  <MonacoEditor />
</Suspense>
```

### Debouncing

```tsx
// Debounce frequent updates
const debouncedUpdate = useMemo(
  () => debounce((code: string) => {
    updateFile(activeFile.id, code)
  }, 300),
  [activeFile.id, updateFile]
)
```

---

## Troubleshooting Development

### Monaco Editor Not Loading

```bash
# Clear Vite cache
rm -rf node_modules/.vite
pnpm dev
```

### Type Errors in Preview

Check that the component is exported from the design system and added to the scope in `Preview.tsx`.

### Hot Reload Not Working

```bash
# Restart dev server
pnpm dev
```

### Build Errors

```bash
# Check TypeScript
pnpm typecheck

# Check for lint errors
pnpm lint
```
