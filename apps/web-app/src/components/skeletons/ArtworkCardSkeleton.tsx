'use client'

import { Card, CardContent, Skeleton } from '@aetherlabs/ui'

interface ArtworkCardSkeletonProps {
  className?: string
}

export function ArtworkCardSkeleton({ className }: ArtworkCardSkeletonProps) {
  return (
    <Card className={`border border-border bg-card overflow-hidden ${className}`}>
      {/* Image skeleton */}
      <Skeleton className="w-full h-48 rounded-none" />

      <CardContent className="p-4">
        {/* Title and artist */}
        <div className="mb-3">
          <Skeleton className="h-5 w-3/4 mb-2" />
          <Skeleton className="h-4 w-1/2 mb-1" />
          <Skeleton className="h-3 w-2/3" />
        </div>

        {/* Certificate and NFC status */}
        <div className="mb-3 space-y-2">
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-4 rounded-full" />
            <Skeleton className="h-4 w-24" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-4 rounded-full" />
            <Skeleton className="h-3 w-16" />
          </div>
        </div>

        {/* Status badge and date */}
        <div className="flex justify-between items-center mb-3">
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-3 w-20" />
        </div>

        {/* Action buttons */}
        <div className="flex gap-2">
          <Skeleton className="h-8 flex-1 rounded-md" />
          <Skeleton className="h-8 w-8 rounded-md" />
        </div>
      </CardContent>
    </Card>
  )
}

interface ArtworkGridSkeletonProps {
  count?: number
}

export function ArtworkGridSkeleton({ count = 6 }: ArtworkGridSkeletonProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <ArtworkCardSkeleton key={i} />
      ))}
    </div>
  )
}
