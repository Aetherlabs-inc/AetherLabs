'use client'

import { usePathname, useRouter } from 'next/navigation'
import { Button } from '@aetherlabs/ui'
import { Plus, Download, Filter, Search } from 'lucide-react'

export function HeaderActions() {
  const pathname = usePathname()
  const router = useRouter()

  // Contextual actions based on current page
  const getActions = () => {
    if (pathname === '/dashboard') {
      return (
        <Button
          onClick={() => router.push('/artworks?action=register')}
          className="bg-[#2A2121] hover:bg-[#2A2121]/90 text-white"
          size="sm"
        >
          <Plus className="w-4 h-4 mr-2" />
          Register Artwork
        </Button>
      )
    }

    if (pathname === '/artworks') {
      return (
        <Button
          onClick={() => router.push('/artworks?action=register')}
          className="bg-[#2A2121] hover:bg-[#2A2121]/90 text-white"
          size="sm"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Artwork
        </Button>
      )
    }

    if (pathname === '/certificates') {
      return (
        <Button
          variant="outline"
          size="sm"
          className="hover:border-[#BC8010]/50"
        >
          <Download className="w-4 h-4 mr-2" />
          Export All
        </Button>
      )
    }

    if (pathname === '/collections') {
      return (
        <Button
          className="bg-[#2A2121] hover:bg-[#2A2121]/90 text-white"
          size="sm"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Collection
        </Button>
      )
    }

    // Artwork details page
    if (pathname.startsWith('/artworks/')) {
      return (
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push('/artworks')}
        >
          Back to Artworks
        </Button>
      )
    }

    return null
  }

  return (
    <div className="flex items-center gap-2">
      {getActions()}
    </div>
  )
}
