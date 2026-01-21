import { cn } from '@aetherlabs/ui'
import { Trash2, AlertCircle, AlertTriangle, Info, Terminal } from 'lucide-react'
import type { ConsoleMessage } from '@/types/playground'

interface ConsolePanelProps {
  messages: ConsoleMessage[]
  onClear: () => void
  className?: string
}

const ICONS = {
  log: <Terminal className="h-3.5 w-3.5" />,
  info: <Info className="h-3.5 w-3.5" />,
  warn: <AlertTriangle className="h-3.5 w-3.5" />,
  error: <AlertCircle className="h-3.5 w-3.5" />,
}

const COLORS = {
  log: 'text-neutral-300',
  info: 'text-info-400',
  warn: 'text-warning-400',
  error: 'text-danger-400',
}

const BG_COLORS = {
  log: '',
  info: 'bg-info-950/30',
  warn: 'bg-warning-950/30',
  error: 'bg-danger-950/30',
}

export function ConsolePanel({ messages, onClear, className }: ConsolePanelProps) {
  return (
    <div className={cn('flex flex-col h-full bg-neutral-950', className)}>
      {/* Header */}
      <div className="flex items-center justify-between border-b border-neutral-800 px-3 py-1.5">
        <div className="flex items-center gap-2">
          <Terminal className="h-4 w-4 text-neutral-500" />
          <span className="text-xs font-medium text-neutral-400">Console</span>
          {messages.length > 0 && (
            <span className="text-xs text-neutral-600">({messages.length})</span>
          )}
        </div>
        <button
          onClick={onClear}
          className="p-1 rounded hover:bg-neutral-800 text-neutral-500 hover:text-neutral-300 transition-colors"
          title="Clear console"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto font-mono text-xs">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-neutral-600">
            No console output
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                'flex items-start gap-2 px-3 py-1.5 border-b border-neutral-900',
                BG_COLORS[message.type]
              )}
            >
              <span className={cn('mt-0.5', COLORS[message.type])}>
                {ICONS[message.type]}
              </span>
              <pre className={cn('flex-1 whitespace-pre-wrap break-all', COLORS[message.type])}>
                {message.content}
              </pre>
              <span className="text-neutral-600 text-[10px] mt-0.5">
                {new Date(message.timestamp).toLocaleTimeString()}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
