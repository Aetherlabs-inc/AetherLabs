'use client'

import { Button } from '@aetherlabs/ui'
import { AlertTriangle, RefreshCw } from 'lucide-react'

interface DataErrorProps {
  title?: string
  error: string
  onRetry?: () => void
}

export function DataError({
  title = 'Something went wrong',
  error,
  onRetry
}: DataErrorProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      {/* Error illustration */}
      <div className="relative mb-8">
        <div className="w-20 h-20 rounded-full bg-[#CA5B2B]/10 flex items-center justify-center">
          <AlertTriangle className="w-10 h-10 text-[#CA5B2B]" strokeWidth={1.5} />
        </div>
      </div>

      {/* Text content */}
      <h3 className="text-xl font-semibold text-foreground mb-2">
        {title}
      </h3>
      <p className="text-muted-foreground text-center max-w-sm mb-6">
        {error}
      </p>

      {/* Actions */}
      {onRetry && (
        <Button
          onClick={onRetry}
          className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-2 rounded-lg flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Try Again
        </Button>
      )}

      {/* Help text */}
      <p className="mt-6 text-xs text-muted-foreground">
        If this problem persists, please{' '}
        <a href="/help" className="text-[#BC8010] hover:underline">
          contact support
        </a>
      </p>
    </div>
  )
}
