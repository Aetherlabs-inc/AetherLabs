'use client'

import { Button } from '@aetherlabs/ui'
import { Search, X } from 'lucide-react'

interface EmptySearchResultsProps {
  searchQuery: string
  onClearSearch: () => void
}

export function EmptySearchResults({ searchQuery, onClearSearch }: EmptySearchResultsProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      {/* Search illustration */}
      <div className="relative mb-8">
        <div className="w-24 h-24 rounded-full bg-muted/50 flex items-center justify-center">
          <Search className="w-10 h-10 text-muted-foreground/40" strokeWidth={1.5} />
        </div>
        {/* X indicator */}
        <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-[#CA5B2B]/10 border border-[#CA5B2B]/30 flex items-center justify-center">
          <X className="w-4 h-4 text-[#CA5B2B]" />
        </div>
      </div>

      {/* Text content */}
      <h3 className="text-xl font-semibold text-foreground mb-2">
        No results found
      </h3>
      <p className="text-muted-foreground text-center max-w-sm mb-2">
        No artworks match <span className="font-medium text-foreground">"{searchQuery}"</span>
      </p>
      <p className="text-sm text-muted-foreground text-center max-w-sm mb-6">
        Try adjusting your search terms or clearing the filters.
      </p>

      {/* Action */}
      <Button
        onClick={onClearSearch}
        variant="outline"
        className="px-6 py-2 rounded-lg flex items-center gap-2"
      >
        <X className="w-4 h-4" />
        Clear Search
      </Button>
    </div>
  )
}
