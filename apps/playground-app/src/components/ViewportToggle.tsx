import { cn } from '@aetherlabs/ui'
import { Smartphone, Tablet, Monitor, Maximize } from 'lucide-react'
import type { ViewportSize } from '@/types/playground'
import { VIEWPORT_SIZES } from '@/types/playground'

interface ViewportToggleProps {
  value: ViewportSize
  onChange: (viewport: ViewportSize) => void
  className?: string
}

const ICONS: Record<string, React.ReactNode> = {
  smartphone: <Smartphone className="h-4 w-4" />,
  tablet: <Tablet className="h-4 w-4" />,
  monitor: <Monitor className="h-4 w-4" />,
  maximize: <Maximize className="h-4 w-4" />,
}

export function ViewportToggle({ value, onChange, className }: ViewportToggleProps) {
  return (
    <div className={cn('flex rounded-lg border border-neutral-700 bg-neutral-800 p-0.5', className)}>
      {VIEWPORT_SIZES.map((viewport) => (
        <button
          key={viewport.name}
          onClick={() => onChange(viewport)}
          title={`${viewport.name}${viewport.width > 0 ? ` (${viewport.width}px)` : ''}`}
          className={cn(
            'flex items-center justify-center rounded-md px-2.5 py-1.5 transition-colors',
            value.name === viewport.name
              ? 'bg-primary-600 text-white'
              : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-700'
          )}
        >
          {ICONS[viewport.icon]}
        </button>
      ))}
    </div>
  )
}
