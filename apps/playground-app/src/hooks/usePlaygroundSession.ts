import { useState, useCallback, useEffect } from 'react'
import type { PlaygroundSession, PlaygroundFile, ViewportSize } from '@/types/playground'
import { VIEWPORT_SIZES } from '@/types/playground'

const STORAGE_KEY = 'playground_sessions'
const CURRENT_SESSION_KEY = 'playground_current_session'

function generateId(): string {
  return Math.random().toString(36).substring(2, 9)
}

function createDefaultSession(): PlaygroundSession {
  const defaultFile: PlaygroundFile = {
    id: generateId(),
    name: 'Demo.tsx',
    language: 'tsx',
    content: `function Demo() {
  const [count, setCount] = React.useState(0)

  return (
    <div className="flex flex-col items-center gap-4 p-6">
      <h1 className="text-2xl font-bold text-neutral-100">
        Counter: {count}
      </h1>
      <div className="flex gap-2">
        <Button onClick={() => setCount(c => c - 1)} variant="outline">
          <Minus className="h-4 w-4" />
        </Button>
        <Button onClick={() => setCount(c => c + 1)}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      <Badge variant="success">Interactive Demo</Badge>
    </div>
  )
}`,
  }

  return {
    id: generateId(),
    name: 'Untitled',
    files: [defaultFile],
    activeFileId: defaultFile.id,
    viewport: VIEWPORT_SIZES[3], // Full
    theme: 'dark',
    propsState: {},
    createdAt: Date.now(),
    updatedAt: Date.now(),
  }
}

export function usePlaygroundSession() {
  const [session, setSession] = useState<PlaygroundSession>(() => {
    if (typeof window === 'undefined') return createDefaultSession()

    const saved = localStorage.getItem(CURRENT_SESSION_KEY)
    if (saved) {
      try {
        return JSON.parse(saved)
      } catch {
        return createDefaultSession()
      }
    }
    return createDefaultSession()
  })

  const [sessions, setSessions] = useState<PlaygroundSession[]>(() => {
    if (typeof window === 'undefined') return []

    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      try {
        return JSON.parse(saved)
      } catch {
        return []
      }
    }
    return []
  })

  // Persist current session
  useEffect(() => {
    localStorage.setItem(CURRENT_SESSION_KEY, JSON.stringify(session))
  }, [session])

  // Persist all sessions
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions))
  }, [sessions])

  const updateSession = useCallback((updates: Partial<PlaygroundSession>) => {
    setSession(prev => ({
      ...prev,
      ...updates,
      updatedAt: Date.now(),
    }))
  }, [])

  const updateFile = useCallback((fileId: string, content: string) => {
    setSession(prev => ({
      ...prev,
      files: prev.files.map(f =>
        f.id === fileId ? { ...f, content } : f
      ),
      updatedAt: Date.now(),
    }))
  }, [])

  const addFile = useCallback((name: string, language: PlaygroundFile['language'] = 'tsx') => {
    const newFile: PlaygroundFile = {
      id: generateId(),
      name,
      language,
      content: language === 'tsx'
        ? `function ${name.replace('.tsx', '')}() {\n  return <div>New Component</div>\n}`
        : '',
    }
    setSession(prev => ({
      ...prev,
      files: [...prev.files, newFile],
      activeFileId: newFile.id,
      updatedAt: Date.now(),
    }))
  }, [])

  const removeFile = useCallback((fileId: string) => {
    setSession(prev => {
      const newFiles = prev.files.filter(f => f.id !== fileId)
      if (newFiles.length === 0) return prev

      return {
        ...prev,
        files: newFiles,
        activeFileId: prev.activeFileId === fileId
          ? newFiles[0].id
          : prev.activeFileId,
        updatedAt: Date.now(),
      }
    })
  }, [])

  const setActiveFile = useCallback((fileId: string) => {
    setSession(prev => ({ ...prev, activeFileId: fileId }))
  }, [])

  const setViewport = useCallback((viewport: ViewportSize) => {
    updateSession({ viewport })
  }, [updateSession])

  const setTheme = useCallback((theme: 'light' | 'dark') => {
    updateSession({ theme })
  }, [updateSession])

  const saveSession = useCallback((name?: string) => {
    const sessionToSave = {
      ...session,
      name: name || session.name,
      updatedAt: Date.now(),
    }

    setSessions(prev => {
      const existing = prev.findIndex(s => s.id === session.id)
      if (existing >= 0) {
        const updated = [...prev]
        updated[existing] = sessionToSave
        return updated
      }
      return [...prev, sessionToSave]
    })

    setSession(sessionToSave)
  }, [session])

  const loadSession = useCallback((sessionId: string) => {
    const found = sessions.find(s => s.id === sessionId)
    if (found) {
      setSession(found)
    }
  }, [sessions])

  const deleteSession = useCallback((sessionId: string) => {
    setSessions(prev => prev.filter(s => s.id !== sessionId))
  }, [])

  const newSession = useCallback(() => {
    setSession(createDefaultSession())
  }, [])

  const activeFile = session.files.find(f => f.id === session.activeFileId) || session.files[0]

  return {
    session,
    sessions,
    activeFile,
    updateSession,
    updateFile,
    addFile,
    removeFile,
    setActiveFile,
    setViewport,
    setTheme,
    saveSession,
    loadSession,
    deleteSession,
    newSession,
  }
}
