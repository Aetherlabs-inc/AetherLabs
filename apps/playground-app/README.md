# AetherLabs Component Playground

A full-featured, interactive component playground for the AetherLabs Design System. Build, test, and explore components with live preview, TypeScript support, and powerful developer tools.

## Features

- **Live Preview** - See changes instantly as you type
- **Split View** - Resizable code editor and preview panels
- **Viewport Switching** - Test components at mobile, tablet, and desktop sizes
- **Console Output** - Capture and display console logs from your components
- **Theme Switching** - Toggle between light and dark modes
- **Multi-file Editing** - Work with multiple component files
- **Session Management** - Save and load your work
- **Export Options** - Copy code, download files, or share via URL
- **TypeScript IntelliSense** - Full autocomplete for React and design system components

---

## Getting Started

### Installation

```bash
cd playground-app
pnpm install
```

### Development

```bash
pnpm dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build

```bash
pnpm build
```

---

## Architecture Overview

```
playground-app/
├── src/
│   ├── components/        # UI components
│   ├── hooks/             # Custom React hooks
│   ├── types/             # TypeScript definitions
│   ├── data/              # Component examples
│   ├── App.tsx            # Main application
│   └── index.css          # Global styles
├── index.html
├── vite.config.ts
└── package.json
```

---

## Core Components

### App.tsx

The main application component that orchestrates all features:

```tsx
function App() {
  // Session management (files, viewport, theme)
  const { session, activeFile, updateFile, ... } = usePlaygroundSession()

  // Console message capture
  const { messages, createConsoleProxy } = useConsole()

  return (
    <div>
      <ComponentList />      {/* Sidebar with examples */}
      <FileTabs />           {/* Multi-file tabs */}
      <ResizablePanel>       {/* Split view */}
        <CodeEditor />       {/* Monaco editor */}
        <Preview />          {/* Live preview */}
      </ResizablePanel>
      <ConsolePanel />       {/* Console output */}
    </div>
  )
}
```

---

### CodeEditor

Enhanced Monaco editor with TypeScript support.

**File:** `components/CodeEditor.tsx`

**Props:**
| Prop | Type | Description |
|------|------|-------------|
| `code` | `string` | The source code to edit |
| `onChange` | `(code: string) => void` | Called when code changes |
| `language` | `'tsx' \| 'css' \| 'json'` | Editor language mode |
| `theme` | `'light' \| 'dark'` | Color theme |
| `onFormat` | `() => void` | Called after formatting |

**Features:**
- Custom TypeScript definitions for React hooks and design system components
- Bracket pair colorization
- JetBrains Mono font with ligatures
- Keyboard shortcuts:
  - `Cmd/Ctrl + S` - Format document
  - `Shift + Alt + F` - Format document

**Customizing Type Definitions:**

Add new component types in the `EXTRA_LIBS` constant:

```tsx
const EXTRA_LIBS = `
  // Add your component types here
  declare function MyComponent(props: {
    title: string;
    variant?: 'primary' | 'secondary';
  }): JSX.Element;
`
```

---

### Preview

Live component preview with viewport simulation and console capture.

**File:** `components/Preview.tsx`

**Props:**
| Prop | Type | Description |
|------|------|-------------|
| `code` | `string` | Component code to render |
| `viewport` | `ViewportSize` | Viewport dimensions |
| `theme` | `'light' \| 'dark'` | Preview background theme |
| `consoleProxy` | `object` | Console methods to capture logs |

**How it works:**

1. Code is transformed using [Sucrase](https://github.com/alangpierce/sucrase) (JSX → JavaScript)
2. A function is created with React and design system components in scope
3. The `Demo` function from your code is extracted and rendered
4. Errors are caught by an ErrorBoundary and displayed

**Available in Preview Scope:**
- All React hooks (`useState`, `useEffect`, etc.)
- All design system components (`Button`, `Card`, `Badge`, etc.)
- All Lucide icons (`Plus`, `Minus`, `Check`, etc.)
- `cn()` utility for className merging
- `console` (proxied to capture output)

---

### ResizablePanel

Draggable split view component.

**File:** `components/ResizablePanel.tsx`

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `left` | `ReactNode` | - | Left panel content |
| `right` | `ReactNode` | - | Right panel content |
| `defaultLeftWidth` | `number` | `50` | Initial left panel width (%) |
| `minLeftWidth` | `number` | `20` | Minimum left panel width (%) |
| `maxLeftWidth` | `number` | `80` | Maximum left panel width (%) |

---

### ViewportToggle

Viewport size selector for responsive testing.

**File:** `components/ViewportToggle.tsx`

**Available Viewports:**
| Name | Width | Height | Icon |
|------|-------|--------|------|
| Mobile | 375px | 667px | Smartphone |
| Tablet | 768px | 1024px | Tablet |
| Desktop | 1280px | auto | Monitor |
| Full | 100% | 100% | Maximize |

---

### ConsolePanel

Displays captured console output from the preview.

**File:** `components/ConsolePanel.tsx`

**Message Types:**
- `log` - Standard console.log (gray)
- `info` - console.info (blue)
- `warn` - console.warn (yellow)
- `error` - console.error (red)

---

### FileTabs

Multi-file tab interface.

**File:** `components/FileTabs.tsx`

**Supported File Types:**
| Extension | Language | Icon Color |
|-----------|----------|------------|
| `.tsx` | TypeScript JSX | Blue |
| `.css` | CSS | Cyan |
| `.json` | JSON | Yellow |

---

### ExportMenu

Export and session management dropdown.

**File:** `components/ExportMenu.tsx`

**Actions:**
- **Copy code** - Copy current file to clipboard
- **Download file** - Download current file
- **Export all files** - Download all files as single file
- **Copy share URL** - Generate shareable URL with code embedded
- **Save session** - Save to localStorage
- **Load session** - Load from saved sessions
- **New session** - Start fresh

---

## Hooks

### usePlaygroundSession

Manages playground state with localStorage persistence.

**File:** `hooks/usePlaygroundSession.ts`

```tsx
const {
  session,           // Current session state
  sessions,          // All saved sessions
  activeFile,        // Currently active file
  updateFile,        // Update file content
  addFile,           // Add new file
  removeFile,        // Remove file
  setActiveFile,     // Switch active file
  setViewport,       // Change viewport size
  setTheme,          // Toggle theme
  saveSession,       // Save to localStorage
  loadSession,       // Load saved session
  deleteSession,     // Delete saved session
  newSession,        // Create new session
} = usePlaygroundSession()
```

**Session Structure:**
```tsx
interface PlaygroundSession {
  id: string
  name: string
  files: PlaygroundFile[]
  activeFileId: string
  viewport: ViewportSize
  theme: 'light' | 'dark'
  propsState: Record<string, unknown>
  createdAt: number
  updatedAt: number
}
```

---

### useConsole

Captures console output from preview components.

**File:** `hooks/useConsole.ts`

```tsx
const {
  messages,           // Array of ConsoleMessage
  addMessage,         // Manually add message
  clear,              // Clear all messages
  createConsoleProxy, // Get console proxy for preview
} = useConsole()
```

**Usage in Preview:**
```tsx
const consoleProxy = createConsoleProxy()

// Pass to Preview component
<Preview consoleProxy={consoleProxy} />

// In preview code, console.log() will be captured
console.log('Hello') // Appears in ConsolePanel
```

---

## Types

**File:** `types/playground.ts`

### PlaygroundFile
```tsx
interface PlaygroundFile {
  id: string
  name: string
  content: string
  language: 'tsx' | 'css' | 'json'
}
```

### ViewportSize
```tsx
interface ViewportSize {
  name: string
  width: number        // -1 for full width
  height: number | 'auto'
  icon: string
}
```

### ConsoleMessage
```tsx
interface ConsoleMessage {
  id: string
  type: 'log' | 'warn' | 'error' | 'info'
  content: string
  timestamp: number
}
```

### PropDefinition
```tsx
interface PropDefinition {
  name: string
  type: 'string' | 'number' | 'boolean' | 'select' | 'color' | 'size'
  defaultValue: unknown
  options?: string[]
  description?: string
}
```

---

## Adding New Component Examples

Edit `data/component-examples.ts`:

```tsx
export const componentExamples: ComponentExample[] = [
  {
    name: 'My Component',
    description: 'Description of what it does',
    category: 'inputs', // inputs | display | feedback | layout | navigation | tokens
    code: `function Demo() {
  return (
    <Button variant="primary">
      Click me
    </Button>
  )
}`,
  },
  // ... more examples
]
```

**Categories:**
| Category | Description |
|----------|-------------|
| `inputs` | Form controls (Button, Input, etc.) |
| `display` | Data display (Badge, Table, etc.) |
| `feedback` | User feedback (Skeleton, Tooltip, etc.) |
| `layout` | Layout components (Card, Separator, etc.) |
| `navigation` | Navigation (Sheet, Sidebar, etc.) |
| `tokens` | Design tokens (Colors, Typography, etc.) |

---

## Theming

### Theme Toggle

The playground supports light and dark themes. Toggle with the sun/moon button in the toolbar.

### CSS Variables

Theme colors are defined in `index.css` using the design system tokens:

```css
/* Dark theme (default) */
body {
  background-color: var(--color-neutral-950);
  color: var(--color-neutral-100);
}

/* Light theme applied via .light class or system preference */
```

### Monaco Editor Themes

Custom themes are defined in `CodeEditor.tsx`:

- `playground-dark` - Dark theme with purple keywords, green strings
- `playground-light` - Light theme with matching colors

---

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Cmd/Ctrl + S` | Format code |
| `Shift + Alt + F` | Format code |
| `Cmd/Ctrl + C` | Copy selection |
| `Cmd/Ctrl + V` | Paste |
| `Cmd/Ctrl + Z` | Undo |
| `Cmd/Ctrl + Shift + Z` | Redo |

---

## URL Sharing

Share playground state via URL:

```
https://playground.aetherlabs.com?state=eyJjb2RlIjoi...
```

The state parameter contains base64-encoded JSON with:
- `code` - The component code
- `name` - File name

**Generate Share URL:**
1. Click "Export" button
2. Select "Copy share URL"
3. Share the copied URL

---

## Local Storage

Sessions are persisted to localStorage:

| Key | Content |
|-----|---------|
| `playground_current_session` | Active session state |
| `playground_sessions` | Array of saved sessions |

**Clear Storage:**
```js
localStorage.removeItem('playground_current_session')
localStorage.removeItem('playground_sessions')
```

---

## Extending the Playground

### Adding New Components to Scope

Edit `Preview.tsx` to add components to the preview scope:

```tsx
import * as MyLibrary from 'my-library'

const scope = {
  React,
  console: consoleProxy || console,
  ...DesignSystem,
  ...LucideIcons,
  ...MyLibrary,  // Add your library
}
```

### Adding New Type Definitions

Edit `CodeEditor.tsx` to add TypeScript definitions:

```tsx
const EXTRA_LIBS = `
  // Existing definitions...

  // Add new definitions
  declare function MyComponent(props: MyComponentProps): JSX.Element;

  interface MyComponentProps {
    title: string;
    onClick?: () => void;
  }
`
```

### Adding New Viewport Sizes

Edit `types/playground.ts`:

```tsx
export const VIEWPORT_SIZES: ViewportSize[] = [
  { name: 'Mobile', width: 375, height: 667, icon: 'smartphone' },
  { name: 'Tablet', width: 768, height: 1024, icon: 'tablet' },
  { name: 'Laptop', width: 1024, height: 768, icon: 'laptop' },  // New
  { name: 'Desktop', width: 1280, height: 'auto', icon: 'monitor' },
  { name: 'Full', width: -1, height: 'auto', icon: 'maximize' },
]
```

---

## Troubleshooting

### "Cannot find name 'React'" in editor

This is a known limitation. The code will still work in preview. To suppress the warning, the diagnostic code is ignored in `CodeEditor.tsx`.

### Component not rendering

1. Ensure your code exports a `Demo` function
2. Check the console panel for errors
3. Verify all imports are available in the preview scope

### Preview not updating

1. Check for syntax errors in your code
2. Look for errors in the console panel
3. Try resetting with the reset button

### Session not saving

1. Check if localStorage is enabled
2. Ensure you're not in private/incognito mode
3. Check browser storage quota

---

## Tech Stack

| Technology | Purpose |
|------------|---------|
| [Vite](https://vitejs.dev/) | Build tooling |
| [React 19](https://react.dev/) | UI framework |
| [TypeScript](https://www.typescriptlang.org/) | Type safety |
| [Tailwind CSS](https://tailwindcss.com/) | Styling |
| [Monaco Editor](https://microsoft.github.io/monaco-editor/) | Code editor |
| [Sucrase](https://github.com/alangpierce/sucrase) | JSX transformation |
| [Lucide React](https://lucide.dev/) | Icons |

---

## License

MIT License - AetherLabs
