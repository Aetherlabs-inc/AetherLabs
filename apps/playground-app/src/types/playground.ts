// Playground types

export interface PlaygroundFile {
  id: string
  name: string
  content: string
  language: 'tsx' | 'css' | 'json'
}

export interface PlaygroundSession {
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

export interface ViewportSize {
  name: string
  width: number
  height: number | 'auto'
  icon: string
}

export const VIEWPORT_SIZES: ViewportSize[] = [
  { name: 'Mobile', width: 375, height: 667, icon: 'smartphone' },
  { name: 'Tablet', width: 768, height: 1024, icon: 'tablet' },
  { name: 'Desktop', width: 1280, height: 'auto', icon: 'monitor' },
  { name: 'Full', width: -1, height: 'auto', icon: 'maximize' },
]

export interface PropDefinition {
  name: string
  type: 'string' | 'number' | 'boolean' | 'select' | 'color' | 'size'
  defaultValue: unknown
  options?: string[]
  description?: string
}

export interface ComponentDefinition {
  name: string
  description: string
  category: string
  props: PropDefinition[]
  defaultCode: string
  dependencies?: string[]
}

export interface ConsoleMessage {
  id: string
  type: 'log' | 'warn' | 'error' | 'info'
  content: string
  timestamp: number
}

export interface ExportOptions {
  format: 'tsx' | 'jsx'
  includeImports: boolean
  includeStyles: boolean
  prettify: boolean
}
