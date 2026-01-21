import { useState } from 'react'
import { cn } from '@aetherlabs/ui'
import { X, Plus, FileCode, FileText, FileJson } from 'lucide-react'
import type { PlaygroundFile } from '@/types/playground'

interface FileTabsProps {
  files: PlaygroundFile[]
  activeFileId: string
  onSelect: (fileId: string) => void
  onClose: (fileId: string) => void
  onAdd: () => void
  className?: string
}

const FILE_ICONS = {
  tsx: <FileCode className="h-3.5 w-3.5 text-primary-400" />,
  css: <FileText className="h-3.5 w-3.5 text-accent-400" />,
  json: <FileJson className="h-3.5 w-3.5 text-warning-400" />,
}

export function FileTabs({
  files,
  activeFileId,
  onSelect,
  onClose,
  onAdd,
  className,
}: FileTabsProps) {
  const [hoveredTab, setHoveredTab] = useState<string | null>(null)

  return (
    <div className={cn('flex items-center bg-neutral-900 border-b border-neutral-800', className)}>
      <div className="flex-1 flex items-center overflow-x-auto">
        {files.map((file) => (
          <div
            key={file.id}
            onClick={() => onSelect(file.id)}
            onMouseEnter={() => setHoveredTab(file.id)}
            onMouseLeave={() => setHoveredTab(null)}
            className={cn(
              'group flex items-center gap-2 px-3 py-2 border-r border-neutral-800 cursor-pointer transition-colors min-w-[100px]',
              activeFileId === file.id
                ? 'bg-neutral-950 text-neutral-100'
                : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800'
            )}
          >
            {FILE_ICONS[file.language]}
            <span className="text-xs font-medium truncate">{file.name}</span>
            {files.length > 1 && (hoveredTab === file.id || activeFileId === file.id) && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onClose(file.id)
                }}
                className="ml-auto p-0.5 rounded hover:bg-neutral-700 text-neutral-500 hover:text-neutral-300 transition-colors"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Add File Button */}
      <button
        onClick={onAdd}
        className="flex items-center justify-center px-3 py-2 text-neutral-500 hover:text-neutral-300 hover:bg-neutral-800 transition-colors"
        title="Add file"
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
  )
}
