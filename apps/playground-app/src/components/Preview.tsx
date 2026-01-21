import React, { useMemo, useEffect, useRef } from 'react'
import { transform } from 'sucrase'
import * as DesignSystem from '@aetherlabs/ui'
import * as LucideIcons from 'lucide-react'
import { cn } from '@aetherlabs/ui'
import type { ViewportSize } from '@/types/playground'

interface PreviewProps {
  code: string
  viewport?: ViewportSize
  theme?: 'light' | 'dark'
  consoleProxy?: {
    log: (...args: unknown[]) => void
    warn: (...args: unknown[]) => void
    error: (...args: unknown[]) => void
    info: (...args: unknown[]) => void
  }
}

export function Preview({ code, viewport, theme = 'dark', consoleProxy }: PreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  const { Component, error } = useMemo(() => {
    try {
      const fullCode = `
        ${code}
        return Demo;
      `

      const transformed = transform(fullCode, {
        transforms: ['jsx', 'typescript'],
        jsxRuntime: 'classic',
        jsxPragma: 'React.createElement',
        jsxFragmentPragma: 'React.Fragment',
      }).code

      // Create scope with console proxy if provided
      const scope = {
        React,
        console: consoleProxy || console,
        ...DesignSystem,
        ...LucideIcons,
      }

      const scopeKeys = Object.keys(scope)
      const scopeValues = Object.values(scope)

      const fn = new Function(...scopeKeys, transformed)
      const Component = fn(...scopeValues)

      return { Component, error: null }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      consoleProxy?.error(errorMessage)
      return {
        Component: null,
        error: errorMessage,
      }
    }
  }, [code, consoleProxy])

  // Calculate viewport styles
  const viewportStyles = useMemo(() => {
    if (!viewport || viewport.width === -1) {
      return { width: '100%', height: '100%' }
    }
    return {
      width: viewport.width,
      height: viewport.height === 'auto' ? '100%' : viewport.height,
      maxWidth: '100%',
      maxHeight: '100%',
    }
  }, [viewport])

  if (error) {
    return (
      <div className="flex h-full items-center justify-center p-6">
        <div className="max-w-md rounded-lg border border-danger-500/30 bg-danger-950/50 p-4">
          <h3 className="mb-2 font-semibold text-danger-400">Compilation Error</h3>
          <pre className="whitespace-pre-wrap text-sm text-danger-300">{error}</pre>
        </div>
      </div>
    )
  }

  if (!Component) {
    return (
      <div className="flex h-full items-center justify-center text-neutral-500">
        No component to render
      </div>
    )
  }

  const isConstrained = viewport && viewport.width !== -1

  return (
    <div
      ref={containerRef}
      className={cn(
        'flex h-full items-center justify-center overflow-auto',
        theme === 'dark' ? 'bg-neutral-950' : 'bg-neutral-100'
      )}
    >
      <div
        className={cn(
          'flex items-center justify-center transition-all duration-200',
          isConstrained && 'border border-neutral-700 rounded-lg shadow-2xl overflow-hidden',
          theme === 'dark' ? 'bg-neutral-900' : 'bg-white'
        )}
        style={viewportStyles}
      >
        <div className="w-full h-full overflow-auto p-6">
          <ErrorBoundary consoleProxy={consoleProxy}>
            <Component />
          </ErrorBoundary>
        </div>
      </div>
    </div>
  )
}

interface ErrorBoundaryProps {
  children: React.ReactNode
  consoleProxy?: {
    log: (...args: unknown[]) => void
    warn: (...args: unknown[]) => void
    error: (...args: unknown[]) => void
    info: (...args: unknown[]) => void
  }
}

class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  { hasError: boolean; error: string }
> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: '' }
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error: error.message }
  }

  componentDidCatch(error: Error) {
    this.props.consoleProxy?.error(`Runtime Error: ${error.message}`)
    console.error('Preview error:', error)
  }

  componentDidUpdate(prevProps: ErrorBoundaryProps) {
    // Reset error state when children change
    if (prevProps.children !== this.props.children && this.state.hasError) {
      this.setState({ hasError: false, error: '' })
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="max-w-md rounded-lg border border-danger-500/30 bg-danger-950/50 p-4">
          <h3 className="mb-2 font-semibold text-danger-400">Runtime Error</h3>
          <pre className="whitespace-pre-wrap text-sm text-danger-300">
            {this.state.error}
          </pre>
        </div>
      )
    }

    return this.props.children
  }
}
