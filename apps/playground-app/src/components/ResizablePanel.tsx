import { useState, useCallback, useRef, useEffect } from 'react'
import { cn } from '@aetherlabs/ui'
import { GripVertical } from 'lucide-react'

interface ResizablePanelProps {
  left: React.ReactNode
  right: React.ReactNode
  defaultLeftWidth?: number
  minLeftWidth?: number
  maxLeftWidth?: number
  className?: string
}

export function ResizablePanel({
  left,
  right,
  defaultLeftWidth = 50,
  minLeftWidth = 20,
  maxLeftWidth = 80,
  className,
}: ResizablePanelProps) {
  const [leftWidth, setLeftWidth] = useState(defaultLeftWidth)
  const [isDragging, setIsDragging] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging || !containerRef.current) return

      const rect = containerRef.current.getBoundingClientRect()
      const newWidth = ((e.clientX - rect.left) / rect.width) * 100

      setLeftWidth(Math.min(Math.max(newWidth, minLeftWidth), maxLeftWidth))
    },
    [isDragging, minLeftWidth, maxLeftWidth]
  )

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      document.body.style.cursor = 'col-resize'
      document.body.style.userSelect = 'none'
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }
  }, [isDragging, handleMouseMove, handleMouseUp])

  return (
    <div ref={containerRef} className={cn('flex h-full', className)}>
      {/* Left Panel */}
      <div
        className="flex-shrink-0 overflow-hidden"
        style={{ width: `${leftWidth}%` }}
      >
        {left}
      </div>

      {/* Resizer */}
      <div
        onMouseDown={handleMouseDown}
        className={cn(
          'flex-shrink-0 w-1 bg-neutral-800 hover:bg-primary-600 transition-colors cursor-col-resize flex items-center justify-center group',
          isDragging && 'bg-primary-600'
        )}
      >
        <div className="absolute p-1 rounded bg-neutral-800 group-hover:bg-primary-600 transition-colors">
          <GripVertical className="h-4 w-4 text-neutral-500 group-hover:text-white" />
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 overflow-hidden">
        {right}
      </div>
    </div>
  )
}
