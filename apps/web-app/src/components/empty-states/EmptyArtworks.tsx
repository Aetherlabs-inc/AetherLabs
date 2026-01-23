'use client'

import { Button } from '@aetherlabs/ui'
import { Plus, Image as ImageIcon } from 'lucide-react'

interface EmptyArtworksProps {
  onRegister: () => void
}

export function EmptyArtworks({ onRegister }: EmptyArtworksProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      {/* Geometric illustration inspired by gallery frames */}
      <div className="relative mb-8">
        {/* Outer frame */}
        <div className="w-48 h-48 border-2 border-dashed border-muted-foreground/30 rounded-lg flex items-center justify-center">
          {/* Inner frame with gold accent */}
          <div className="w-36 h-36 border border-[#BC8010]/40 rounded-md flex items-center justify-center bg-muted/30">
            {/* Icon */}
            <div className="w-20 h-20 rounded-lg bg-primary/5 flex items-center justify-center">
              <ImageIcon className="w-10 h-10 text-muted-foreground/50" strokeWidth={1.5} />
            </div>
          </div>
        </div>
        {/* Decorative corner accents */}
        <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-[#BC8010]/60 rounded-tl" />
        <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-[#BC8010]/60 rounded-tr" />
        <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-[#BC8010]/60 rounded-bl" />
        <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-[#BC8010]/60 rounded-br" />
      </div>

      {/* Text content */}
      <h3 className="text-xl font-semibold text-foreground mb-2">
        No artworks yet
      </h3>
      <p className="text-muted-foreground text-center max-w-sm mb-6">
        Register your first artwork to start building your authenticated collection.
        Each piece gets a unique certificate of authenticity.
      </p>

      {/* CTA Button */}
      <Button
        onClick={onRegister}
        className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-2 rounded-lg flex items-center gap-2"
      >
        <Plus className="w-5 h-5" />
        Register Your First Artwork
      </Button>

      {/* Supporting info */}
      <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#BC8010]" />
          <span>Digital certificates</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#BC8010]" />
          <span>NFC tag linking</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#BC8010]" />
          <span>Provenance tracking</span>
        </div>
      </div>
    </div>
  )
}
