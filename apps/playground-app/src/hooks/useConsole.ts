import { useState, useCallback, useRef, useEffect } from 'react'
import type { ConsoleMessage } from '@/types/playground'

function generateId(): string {
  return Math.random().toString(36).substring(2, 9)
}

function stringify(value: unknown): string {
  if (value === undefined) return 'undefined'
  if (value === null) return 'null'
  if (typeof value === 'function') return value.toString()
  if (typeof value === 'object') {
    try {
      return JSON.stringify(value, null, 2)
    } catch {
      return String(value)
    }
  }
  return String(value)
}

export function useConsole() {
  const [messages, setMessages] = useState<ConsoleMessage[]>([])
  const originalConsole = useRef<{
    log: typeof console.log
    warn: typeof console.warn
    error: typeof console.error
    info: typeof console.info
  } | null>(null)

  const addMessage = useCallback((type: ConsoleMessage['type'], ...args: unknown[]) => {
    const content = args.map(stringify).join(' ')
    setMessages(prev => [...prev, {
      id: generateId(),
      type,
      content,
      timestamp: Date.now(),
    }])
  }, [])

  const clear = useCallback(() => {
    setMessages([])
  }, [])

  // Create console proxy for use in preview
  const createConsoleProxy = useCallback(() => {
    return {
      log: (...args: unknown[]) => {
        addMessage('log', ...args)
        originalConsole.current?.log(...args)
      },
      warn: (...args: unknown[]) => {
        addMessage('warn', ...args)
        originalConsole.current?.warn(...args)
      },
      error: (...args: unknown[]) => {
        addMessage('error', ...args)
        originalConsole.current?.error(...args)
      },
      info: (...args: unknown[]) => {
        addMessage('info', ...args)
        originalConsole.current?.info(...args)
      },
    }
  }, [addMessage])

  useEffect(() => {
    // Store original console methods
    originalConsole.current = {
      log: console.log.bind(console),
      warn: console.warn.bind(console),
      error: console.error.bind(console),
      info: console.info.bind(console),
    }
  }, [])

  return {
    messages,
    addMessage,
    clear,
    createConsoleProxy,
  }
}
