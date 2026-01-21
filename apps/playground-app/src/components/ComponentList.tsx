import { cn } from '@aetherlabs/ui'
import { ComponentExample, categories } from '@/data/component-examples'
import { Box, Layers, MousePointer, Layout, Navigation, Palette, Zap } from 'lucide-react'

interface ComponentListProps {
  examples: ComponentExample[]
  selectedExample: ComponentExample | null
  onSelect: (example: ComponentExample) => void
  selectedCategory: string
  onCategoryChange: (category: string) => void
}

const categoryIcons: Record<string, React.ReactNode> = {
  all: <Layers className="h-4 w-4" />,
  inputs: <MousePointer className="h-4 w-4" />,
  display: <Box className="h-4 w-4" />,
  feedback: <Box className="h-4 w-4" />,
  layout: <Layout className="h-4 w-4" />,
  navigation: <Navigation className="h-4 w-4" />,
  tokens: <Palette className="h-4 w-4" />,
}

export function ComponentList({
  examples,
  selectedExample,
  onSelect,
  selectedCategory,
  onCategoryChange,
}: ComponentListProps) {
  const filteredExamples =
    selectedCategory === 'all'
      ? examples
      : examples.filter((e) => e.category === selectedCategory)

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="border-b border-neutral-800 p-4">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
            <Zap className="h-4 w-4 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-neutral-100">
              Design System
            </h1>
            <p className="text-xs text-neutral-500">Component Playground</p>
          </div>
        </div>
      </div>

      {/* Category Filters */}
      <div className="border-b border-neutral-800 p-2">
        <div className="flex flex-wrap gap-1">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onCategoryChange(cat.id)}
              className={cn(
                'flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors',
                selectedCategory === cat.id
                  ? 'bg-primary-600 text-white'
                  : 'text-neutral-400 hover:bg-neutral-800 hover:text-neutral-200'
              )}
            >
              {categoryIcons[cat.id]}
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Component List */}
      <div className="flex-1 overflow-y-auto p-2">
        <div className="space-y-1">
          {filteredExamples.map((example) => (
            <button
              key={example.name}
              onClick={() => onSelect(example)}
              className={cn(
                'w-full rounded-lg p-3 text-left transition-all',
                selectedExample?.name === example.name
                  ? 'bg-primary-600/20 border border-primary-500/50 glow-primary'
                  : 'hover:bg-neutral-800 border border-transparent'
              )}
            >
              <div className={cn(
                'font-medium text-sm',
                selectedExample?.name === example.name
                  ? 'text-primary-300'
                  : 'text-neutral-200'
              )}>
                {example.name}
              </div>
              <div className="text-xs text-neutral-500 mt-0.5 line-clamp-2">
                {example.description}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-neutral-800 p-4">
        <div className="text-xs text-neutral-500">
          <span className="font-medium text-neutral-400">{filteredExamples.length}</span> components
        </div>
      </div>
    </div>
  )
}
