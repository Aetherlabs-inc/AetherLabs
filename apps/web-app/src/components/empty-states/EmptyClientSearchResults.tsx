'use client'

import { Button } from '@aetherlabs/ui'
import { Search, X } from 'lucide-react'

interface EmptyClientSearchResultsProps {
  searchQuery: string
  onClearSearch: () => void
}

export function EmptyClientSearchResults({ searchQuery, onClearSearch }: EmptyClientSearchResultsProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="relative mb-8">
        <div className="w-24 h-24 rounded-full bg-muted/50 flex items-center justify-center">
          <Search className="w-10 h-10 text-muted-foreground/40" strokeWidth={1.5} />
        </div>
      </div>

      <h3 className="text-xl font-semibold text-foreground mb-2">No results found</h3>
      <p className="text-muted-foreground text-center max-w-sm mb-6">
        No clients match &quot;{searchQuery}&quot;. Try adjusting your search or filters.
      </p>

      <Button onClick={onClearSearch} variant="outline">
        <X className="w-4 h-4 mr-2" />
        Clear Search
      </Button>
    </div>
  )
}
