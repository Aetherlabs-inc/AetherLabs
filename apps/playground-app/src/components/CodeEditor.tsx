import { useRef, useCallback } from 'react'
import Editor, { Monaco, OnMount } from '@monaco-editor/react'
import type { editor } from 'monaco-editor'

interface CodeEditorProps {
  code: string
  onChange: (value: string) => void
  language?: 'tsx' | 'css' | 'json'
  theme?: 'light' | 'dark'
  onFormat?: () => void
}

// Type definitions for React and design system
const EXTRA_LIBS = `
declare module 'react' {
  export function useState<T>(initial: T | (() => T)): [T, (value: T | ((prev: T) => T)) => void];
  export function useEffect(effect: () => void | (() => void), deps?: unknown[]): void;
  export function useCallback<T extends (...args: unknown[]) => unknown>(callback: T, deps: unknown[]): T;
  export function useMemo<T>(factory: () => T, deps: unknown[]): T;
  export function useRef<T>(initial: T): { current: T };
  export const Fragment: unique symbol;
  export function createElement(type: any, props?: any, ...children: any[]): any;
}

declare const React: typeof import('react');

// Design System Components
declare function Button(props: {
  children?: React.ReactNode;
  variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'ghost' | 'link' | 'success' | 'warning';
  size?: 'default' | 'sm' | 'lg' | 'xl' | 'icon' | 'icon-sm';
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}): JSX.Element;

declare function Card(props: { children?: React.ReactNode; className?: string }): JSX.Element;
declare function CardHeader(props: { children?: React.ReactNode; className?: string }): JSX.Element;
declare function CardTitle(props: { children?: React.ReactNode; className?: string }): JSX.Element;
declare function CardDescription(props: { children?: React.ReactNode; className?: string }): JSX.Element;
declare function CardContent(props: { children?: React.ReactNode; className?: string }): JSX.Element;
declare function CardFooter(props: { children?: React.ReactNode; className?: string }): JSX.Element;

declare function Badge(props: {
  children?: React.ReactNode;
  variant?: 'default' | 'secondary' | 'success' | 'warning' | 'destructive' | 'outline';
  className?: string;
}): JSX.Element;

declare function Input(props: {
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: { target: { value: string } }) => void;
  disabled?: boolean;
  className?: string;
}): JSX.Element;

declare function Label(props: { children?: React.ReactNode; htmlFor?: string; className?: string }): JSX.Element;
declare function Textarea(props: { placeholder?: string; rows?: number; className?: string }): JSX.Element;
declare function Separator(props: { orientation?: 'horizontal' | 'vertical'; className?: string }): JSX.Element;
declare function Skeleton(props: { className?: string }): JSX.Element;

// Icons (Lucide)
declare function Plus(props: { className?: string }): JSX.Element;
declare function Minus(props: { className?: string }): JSX.Element;
declare function Check(props: { className?: string }): JSX.Element;
declare function X(props: { className?: string }): JSX.Element;
declare function Info(props: { className?: string }): JSX.Element;
declare function AlertTriangle(props: { className?: string }): JSX.Element;
declare function Home(props: { className?: string }): JSX.Element;
declare function Settings(props: { className?: string }): JSX.Element;
declare function Users(props: { className?: string }): JSX.Element;
declare function Mail(props: { className?: string }): JSX.Element;
declare function Star(props: { className?: string }): JSX.Element;
declare function Heart(props: { className?: string }): JSX.Element;
declare function Search(props: { className?: string }): JSX.Element;
declare function Menu(props: { className?: string }): JSX.Element;
declare function ArrowRight(props: { className?: string }): JSX.Element;
declare function ArrowLeft(props: { className?: string }): JSX.Element;
declare function ChevronDown(props: { className?: string }): JSX.Element;
declare function ChevronUp(props: { className?: string }): JSX.Element;
declare function Loader2(props: { className?: string }): JSX.Element;
declare function Moon(props: { className?: string }): JSX.Element;
declare function Sun(props: { className?: string }): JSX.Element;
declare function Zap(props: { className?: string }): JSX.Element;
declare function FolderOpen(props: { className?: string }): JSX.Element;

// Utility
declare function cn(...classes: (string | undefined | null | false)[]): string;
`

export function CodeEditor({
  code,
  onChange,
  language = 'tsx',
  theme = 'dark',
  onFormat,
}: CodeEditorProps) {
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null)
  const monacoRef = useRef<Monaco | null>(null)

  const handleEditorMount: OnMount = useCallback((editor, monaco) => {
    editorRef.current = editor
    monacoRef.current = monaco

    // Add keyboard shortcut for formatting (Shift+Alt+F)
    editor.addCommand(monaco.KeyMod.Shift | monaco.KeyMod.Alt | monaco.KeyCode.KeyF, () => {
      editor.getAction('editor.action.formatDocument')?.run()
      onFormat?.()
    })

    // Add keyboard shortcut for save (Cmd/Ctrl+S)
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      editor.getAction('editor.action.formatDocument')?.run()
      onFormat?.()
    })
  }, [onFormat])

  const handleBeforeMount = useCallback((monaco: Monaco) => {
    // Configure TypeScript
    monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
      jsx: monaco.languages.typescript.JsxEmit.React,
      jsxFactory: 'React.createElement',
      jsxFragmentFactory: 'React.Fragment',
      reactNamespace: 'React',
      allowNonTsExtensions: true,
      allowJs: true,
      target: monaco.languages.typescript.ScriptTarget.Latest,
      moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
      module: monaco.languages.typescript.ModuleKind.ESNext,
      noEmit: true,
      esModuleInterop: true,
      strict: false,
      skipLibCheck: true,
    })

    // Add extra type definitions
    monaco.languages.typescript.typescriptDefaults.addExtraLib(
      EXTRA_LIBS,
      'file:///globals.d.ts'
    )

    // Disable some diagnostics for better UX
    monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
      noSemanticValidation: false,
      noSyntaxValidation: false,
      diagnosticCodesToIgnore: [
        1375, // 'await' expression is only allowed in an async function
        1378, // Top-level 'await' expressions are only allowed
        2304, // Cannot find name
        2307, // Cannot find module
        2339, // Property does not exist
        2345, // Argument of type is not assignable
        7006, // Parameter implicitly has an 'any' type
        7016, // Could not find a declaration file
        7031, // Binding element implicitly has 'any' type
      ],
    })

    // Define custom dark theme
    monaco.editor.defineTheme('playground-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '6b7280' },
        { token: 'keyword', foreground: 'c084fc' },
        { token: 'string', foreground: '86efac' },
        { token: 'number', foreground: 'fbbf24' },
        { token: 'type', foreground: '67e8f9' },
      ],
      colors: {
        'editor.background': '#0a0a0a',
        'editor.foreground': '#e5e5e5',
        'editorLineNumber.foreground': '#525252',
        'editorLineNumber.activeForeground': '#a3a3a3',
        'editor.selectionBackground': '#3b82f640',
        'editor.lineHighlightBackground': '#17171700',
        'editorCursor.foreground': '#3b82f6',
        'editorIndentGuide.background': '#262626',
        'editorIndentGuide.activeBackground': '#404040',
      },
    })

    // Define custom light theme
    monaco.editor.defineTheme('playground-light', {
      base: 'vs',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '9ca3af' },
        { token: 'keyword', foreground: '7c3aed' },
        { token: 'string', foreground: '16a34a' },
        { token: 'number', foreground: 'd97706' },
        { token: 'type', foreground: '0891b2' },
      ],
      colors: {
        'editor.background': '#ffffff',
        'editor.foreground': '#171717',
        'editorLineNumber.foreground': '#d4d4d4',
        'editorLineNumber.activeForeground': '#737373',
        'editor.selectionBackground': '#3b82f630',
        'editor.lineHighlightBackground': '#f5f5f5',
        'editorCursor.foreground': '#3b82f6',
      },
    })
  }, [])

  const monacoLanguage = language === 'tsx' ? 'typescript' : language

  return (
    <div className="h-full w-full overflow-hidden bg-neutral-950">
      <Editor
        height="100%"
        language={monacoLanguage}
        value={code}
        onChange={(value) => onChange(value || '')}
        theme={theme === 'dark' ? 'playground-dark' : 'playground-light'}
        onMount={handleEditorMount}
        beforeMount={handleBeforeMount}
        options={{
          minimap: { enabled: false },
          fontSize: 13,
          fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
          fontLigatures: true,
          lineNumbers: 'on',
          scrollBeyondLastLine: false,
          automaticLayout: true,
          tabSize: 2,
          wordWrap: 'on',
          padding: { top: 12, bottom: 12 },
          renderLineHighlight: 'none',
          overviewRulerLanes: 0,
          hideCursorInOverviewRuler: true,
          overviewRulerBorder: false,
          folding: true,
          foldingHighlight: false,
          bracketPairColorization: { enabled: true },
          guides: {
            indentation: true,
            bracketPairs: true,
          },
          suggest: {
            showKeywords: true,
            showSnippets: true,
            showClasses: true,
            showFunctions: true,
            showVariables: true,
          },
          quickSuggestions: {
            other: true,
            comments: false,
            strings: true,
          },
          scrollbar: {
            vertical: 'auto',
            horizontal: 'auto',
            verticalScrollbarSize: 8,
            horizontalScrollbarSize: 8,
            useShadows: false,
          },
          cursorBlinking: 'smooth',
          cursorSmoothCaretAnimation: 'on',
          smoothScrolling: true,
        }}
      />
    </div>
  )
}
