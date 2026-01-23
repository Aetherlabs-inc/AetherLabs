'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { ChevronRight, Home } from 'lucide-react'

interface BreadcrumbItem {
  label: string
  href: string
  current?: boolean
}

const routeLabels: Record<string, string> = {
  dashboard: 'Dashboard',
  artworks: 'Artworks',
  certificates: 'Certificates',
  collections: 'Collections',
  settings: 'Settings',
  profile: 'Profile',
  help: 'Support',
}

export function Breadcrumbs() {
  const pathname = usePathname()

  // Build breadcrumb items from pathname
  const segments = pathname.split('/').filter(Boolean)

  const breadcrumbs: BreadcrumbItem[] = segments.map((segment, index) => {
    const href = '/' + segments.slice(0, index + 1).join('/')
    const isLast = index === segments.length - 1

    // Check if this is a dynamic segment (like an ID)
    const isDynamic = segment.match(/^[a-f0-9-]{36}$/i) || segment.match(/^\d+$/)

    let label = routeLabels[segment] || segment
    if (isDynamic) {
      label = 'Details'
    }

    return {
      label: label.charAt(0).toUpperCase() + label.slice(1),
      href,
      current: isLast,
    }
  })

  if (breadcrumbs.length === 0) {
    return null
  }

  return (
    <nav className="flex items-center space-x-1 text-sm">
      <Link
        href="/dashboard"
        className="flex items-center text-muted-foreground hover:text-foreground transition-colors"
      >
        <Home className="w-4 h-4" />
      </Link>

      {breadcrumbs.map((item, index) => (
        <div key={item.href} className="flex items-center">
          <ChevronRight className="w-4 h-4 text-muted-foreground/50 mx-1" />
          {item.current ? (
            <span className="font-medium text-foreground">
              {item.label}
            </span>
          ) : (
            <Link
              href={item.href}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              {item.label}
            </Link>
          )}
        </div>
      ))}
    </nav>
  )
}
