import { useState, useRef, useEffect } from 'react'
import { cn, Button } from '@aetherlabs/ui'
import { Download, Copy, Check, Share2, Save, FolderOpen } from 'lucide-react'
import type { PlaygroundFile, PlaygroundSession } from '@/types/playground'

interface ExportMenuProps {
  activeFile: PlaygroundFile
  session: PlaygroundSession
  sessions: PlaygroundSession[]
  onSave: (name?: string) => void
  onLoad: (sessionId: string) => void
  onNew: () => void
  className?: string
}

export function ExportMenu({
  activeFile,
  session,
  sessions,
  onSave,
  onLoad,
  onNew,
  className,
}: ExportMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const [showSessions, setShowSessions] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        setShowSessions(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleCopyCode = async () => {
    await navigator.clipboard.writeText(activeFile.content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownload = () => {
    const blob = new Blob([activeFile.content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = activeFile.name
    a.click()
    URL.revokeObjectURL(url)
    setIsOpen(false)
  }

  const handleExportAll = () => {
    const allCode = session.files
      .map(f => `// ${f.name}\n${f.content}`)
      .join('\n\n')

    const blob = new Blob([allCode], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${session.name || 'playground'}.tsx`
    a.click()
    URL.revokeObjectURL(url)
    setIsOpen(false)
  }

  const handleShareUrl = async () => {
    const state = encodeURIComponent(JSON.stringify({
      code: activeFile.content,
      name: activeFile.name,
    }))
    const url = `${window.location.origin}?state=${state}`

    await navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    setIsOpen(false)
  }

  return (
    <div ref={menuRef} className={cn('relative', className)}>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800"
      >
        <Download className="h-4 w-4 mr-2" />
        Export
      </Button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-1 w-56 bg-neutral-900 border border-neutral-800 rounded-lg shadow-xl z-50 overflow-hidden">
          {/* Copy/Download */}
          <div className="p-1 border-b border-neutral-800">
            <button
              onClick={handleCopyCode}
              className="flex items-center gap-2 w-full px-3 py-2 text-sm text-neutral-300 hover:bg-neutral-800 rounded-md transition-colors"
            >
              {copied ? <Check className="h-4 w-4 text-success-400" /> : <Copy className="h-4 w-4" />}
              {copied ? 'Copied!' : 'Copy code'}
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 w-full px-3 py-2 text-sm text-neutral-300 hover:bg-neutral-800 rounded-md transition-colors"
            >
              <Download className="h-4 w-4" />
              Download file
            </button>
            <button
              onClick={handleExportAll}
              className="flex items-center gap-2 w-full px-3 py-2 text-sm text-neutral-300 hover:bg-neutral-800 rounded-md transition-colors"
            >
              <Download className="h-4 w-4" />
              Export all files
            </button>
          </div>

          {/* Share */}
          <div className="p-1 border-b border-neutral-800">
            <button
              onClick={handleShareUrl}
              className="flex items-center gap-2 w-full px-3 py-2 text-sm text-neutral-300 hover:bg-neutral-800 rounded-md transition-colors"
            >
              <Share2 className="h-4 w-4" />
              Copy share URL
            </button>
          </div>

          {/* Sessions */}
          <div className="p-1">
            <button
              onClick={() => {
                onSave()
                setIsOpen(false)
              }}
              className="flex items-center gap-2 w-full px-3 py-2 text-sm text-neutral-300 hover:bg-neutral-800 rounded-md transition-colors"
            >
              <Save className="h-4 w-4" />
              Save session
            </button>
            <button
              onClick={() => setShowSessions(!showSessions)}
              className="flex items-center gap-2 w-full px-3 py-2 text-sm text-neutral-300 hover:bg-neutral-800 rounded-md transition-colors"
            >
              <FolderOpen className="h-4 w-4" />
              Load session
            </button>

            {showSessions && sessions.length > 0 && (
              <div className="mt-1 ml-4 border-l border-neutral-800 pl-2 space-y-1">
                {sessions.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => {
                      onLoad(s.id)
                      setIsOpen(false)
                      setShowSessions(false)
                    }}
                    className="block w-full text-left px-2 py-1 text-xs text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800 rounded transition-colors truncate"
                  >
                    {s.name || 'Untitled'} - {new Date(s.updatedAt).toLocaleDateString()}
                  </button>
                ))}
              </div>
            )}

            <button
              onClick={() => {
                onNew()
                setIsOpen(false)
              }}
              className="flex items-center gap-2 w-full px-3 py-2 text-sm text-neutral-300 hover:bg-neutral-800 rounded-md transition-colors"
            >
              <span className="h-4 w-4 flex items-center justify-center">+</span>
              New session
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
