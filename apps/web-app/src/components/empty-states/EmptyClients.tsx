'use client'

import { Button } from '@aetherlabs/ui'
import { Plus, Users } from 'lucide-react'
import Link from 'next/link'

interface EmptyClientsProps {
  onAddClient: () => void
}

export function EmptyClients({ onAddClient }: EmptyClientsProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="relative mb-8">
        <div className="w-48 h-48 border-2 border-dashed border-muted-foreground/30 rounded-lg flex items-center justify-center">
          <div className="w-36 h-36 border border-accent/40 rounded-md flex items-center justify-center bg-muted/30">
            <Users className="w-20 h-20 text-muted-foreground/50" strokeWidth={1.5} />
          </div>
        </div>
      </div>

      <h3 className="text-xl font-semibold text-foreground mb-2">
        No clients yet
      </h3>
      <p className="text-muted-foreground text-center max-w-sm mb-6">
        Add your first client or import from documents to build your client list.
      </p>

      <div className="flex gap-3">
        <Button
          onClick={onAddClient}
          className="bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Client
        </Button>
        <Button variant="outline" asChild>
          <Link href="/import">Import from Documents</Link>
        </Button>
      </div>
    </div>
  )
}
