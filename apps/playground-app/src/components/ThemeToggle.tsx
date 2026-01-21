import { cn } from '@aetherlabs/ui'
import { Sun, Moon } from 'lucide-react'

interface ThemeToggleProps {
  theme: 'light' | 'dark'
  onChange: (theme: 'light' | 'dark') => void
  className?: string
}

export function ThemeToggle({ theme, onChange, className }: ThemeToggleProps) {
  return (
    <button
      onClick={() => onChange(theme === 'dark' ? 'light' : 'dark')}
      className={cn(
        'flex items-center justify-center p-2 rounded-lg transition-colors',
        'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800',
        className
      )}
      title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      {theme === 'dark' ? (
        <Sun className="h-4 w-4" />
      ) : (
        <Moon className="h-4 w-4" />
      )}
    </button>
  )
}
