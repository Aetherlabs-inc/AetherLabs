import { cn, Input, Label } from '@aetherlabs/ui'
import { Settings, ChevronDown, ChevronRight } from 'lucide-react'
import { useState } from 'react'

interface PropControl {
  name: string
  type: 'string' | 'number' | 'boolean' | 'select' | 'color' | 'size'
  value: unknown
  options?: string[]
  description?: string
}

interface PropsPanelProps {
  props: PropControl[]
  onChange: (name: string, value: unknown) => void
  className?: string
}

const SIZE_OPTIONS = ['xs', 'sm', 'default', 'lg', 'xl']

function ColorPicker({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const colors = [
    'primary', 'secondary', 'accent', 'neutral',
    'success', 'warning', 'danger', 'info'
  ]

  return (
    <div className="flex flex-wrap gap-1">
      {colors.map(color => (
        <button
          key={color}
          onClick={() => onChange(color)}
          className={cn(
            `w-6 h-6 rounded-md bg-${color}-500 border-2 transition-all`,
            value === color ? 'border-white scale-110' : 'border-transparent hover:scale-105'
          )}
          title={color}
        />
      ))}
    </div>
  )
}

function PropControlInput({ prop, onChange }: { prop: PropControl; onChange: (value: unknown) => void }) {
  switch (prop.type) {
    case 'boolean':
      return (
        <button
          onClick={() => onChange(!prop.value)}
          className={cn(
            'relative w-10 h-5 rounded-full transition-colors',
            prop.value ? 'bg-primary-600' : 'bg-neutral-700'
          )}
        >
          <span
            className={cn(
              'absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform',
              prop.value ? 'left-5' : 'left-0.5'
            )}
          />
        </button>
      )

    case 'select':
      return (
        <select
          value={String(prop.value)}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-neutral-800 border border-neutral-700 rounded-md px-2 py-1 text-sm text-neutral-200 focus:outline-none focus:border-primary-500"
        >
          {prop.options?.map(opt => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      )

    case 'color':
      return <ColorPicker value={String(prop.value)} onChange={onChange} />

    case 'size':
      return (
        <div className="flex gap-1">
          {SIZE_OPTIONS.map(size => (
            <button
              key={size}
              onClick={() => onChange(size)}
              className={cn(
                'px-2 py-0.5 rounded text-xs font-medium transition-colors',
                prop.value === size
                  ? 'bg-primary-600 text-white'
                  : 'bg-neutral-800 text-neutral-400 hover:text-neutral-200'
              )}
            >
              {size}
            </button>
          ))}
        </div>
      )

    case 'number':
      return (
        <Input
          type="number"
          value={String(prop.value)}
          onChange={(e) => onChange(Number(e.target.value))}
          className="h-8 bg-neutral-800 border-neutral-700 text-neutral-200"
        />
      )

    default:
      return (
        <Input
          type="text"
          value={String(prop.value)}
          onChange={(e) => onChange(e.target.value)}
          className="h-8 bg-neutral-800 border-neutral-700 text-neutral-200"
        />
      )
  }
}

export function PropsPanel({ props, onChange, className }: PropsPanelProps) {
  const [isExpanded, setIsExpanded] = useState(true)

  return (
    <div className={cn('bg-neutral-900 border-l border-neutral-800', className)}>
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between w-full px-3 py-2 border-b border-neutral-800 text-neutral-300 hover:text-neutral-100 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Settings className="h-4 w-4" />
          <span className="text-xs font-medium">Props</span>
        </div>
        {isExpanded ? (
          <ChevronDown className="h-4 w-4" />
        ) : (
          <ChevronRight className="h-4 w-4" />
        )}
      </button>

      {/* Props List */}
      {isExpanded && (
        <div className="p-3 space-y-4 max-h-[400px] overflow-y-auto">
          {props.length === 0 ? (
            <p className="text-xs text-neutral-500 text-center py-4">
              No configurable props
            </p>
          ) : (
            props.map((prop) => (
              <div key={prop.name} className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label className="text-xs text-neutral-400">{prop.name}</Label>
                  <span className="text-[10px] text-neutral-600 bg-neutral-800 px-1.5 py-0.5 rounded">
                    {prop.type}
                  </span>
                </div>
                <PropControlInput
                  prop={prop}
                  onChange={(value) => onChange(prop.name, value)}
                />
                {prop.description && (
                  <p className="text-[10px] text-neutral-600">{prop.description}</p>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}
