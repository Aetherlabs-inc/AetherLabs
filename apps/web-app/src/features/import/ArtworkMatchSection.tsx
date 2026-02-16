'use client'

import { Button, Badge } from '@aetherlabs/ui'
import { Check, Link2, Plus, HelpCircle, Image } from 'lucide-react'
import type { ArtworkMatch, ArtworkMatchStatus } from '@/src/types/database'

interface ArtworkMatchSectionProps {
    matches: ArtworkMatch[]
    onConfirmMatch?: (matchIndex: number) => void
    onCreateNew?: (matchIndex: number) => void
    onRejectMatch?: (matchIndex: number) => void
    disabled?: boolean
}

function getStatusConfig(status: ArtworkMatchStatus) {
    switch (status) {
        case 'matched':
            return {
                label: 'Matched',
                variant: 'default' as const,
                className: 'bg-emerald-500/15 text-emerald-600 border-emerald-500/20',
                icon: Link2,
            }
        case 'confirmed':
            return {
                label: 'Confirmed',
                variant: 'default' as const,
                className: 'bg-emerald-500/15 text-emerald-600 border-emerald-500/20',
                icon: Check,
            }
        case 'fuzzy_match':
            return {
                label: 'Possible Match',
                variant: 'secondary' as const,
                className: 'bg-amber-500/15 text-amber-600 border-amber-500/20',
                icon: HelpCircle,
            }
        case 'create_new':
            return {
                label: 'Will Create',
                variant: 'secondary' as const,
                className: 'bg-blue-500/15 text-blue-600 border-blue-500/20',
                icon: Plus,
            }
        case 'no_match':
            return {
                label: 'No Match',
                variant: 'outline' as const,
                className: 'bg-muted/50 text-muted-foreground border-border',
                icon: Image,
            }
    }
}

export function ArtworkMatchSection({
    matches,
    onConfirmMatch,
    onCreateNew,
    onRejectMatch,
    disabled = false,
}: ArtworkMatchSectionProps) {
    if (!matches || matches.length === 0) return null

    return (
        <div className="mt-3">
            <p className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1.5">
                <Image className="w-3 h-3" />
                Referenced Artworks ({matches.length})
            </p>
            <div className="space-y-2">
                {matches.map((match, index) => {
                    const config = getStatusConfig(match.status)
                    const StatusIcon = config.icon

                    return (
                        <div
                            key={index}
                            className={`rounded-md border p-2.5 text-sm ${config.className}`}
                        >
                            <div className="flex items-start justify-between gap-2">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-1.5">
                                        <StatusIcon className="w-3.5 h-3.5 shrink-0" />
                                        <span className="font-medium truncate">
                                            {match.reference.title}
                                        </span>
                                    </div>
                                    {match.reference.artist && (
                                        <p className="text-xs opacity-75 mt-0.5 ml-5">
                                            by {match.reference.artist}
                                        </p>
                                    )}

                                    {/* Show matched artwork info */}
                                    {match.matched_artwork && (match.status === 'matched' || match.status === 'confirmed') && (
                                        <p className="text-xs opacity-75 mt-1 ml-5">
                                            Linked to: &ldquo;{match.matched_artwork.title}&rdquo; by {match.matched_artwork.artist}
                                        </p>
                                    )}

                                    {/* Show fuzzy match candidate */}
                                    {match.status === 'fuzzy_match' && match.fuzzy_candidates && match.fuzzy_candidates.length > 0 && (
                                        <div className="mt-1 ml-5">
                                            <p className="text-xs opacity-75">
                                                Possible: &ldquo;{match.fuzzy_candidates[0].title}&rdquo; by {match.fuzzy_candidates[0].artist}
                                            </p>
                                            {match.fuzzy_candidates[0].reason && (
                                                <p className="text-xs opacity-60 italic">
                                                    {match.fuzzy_candidates[0].reason}
                                                </p>
                                            )}
                                        </div>
                                    )}
                                </div>

                                <Badge variant={config.variant} className={`text-xs shrink-0 ${config.className}`}>
                                    {config.label}
                                </Badge>
                            </div>

                            {/* Action buttons for fuzzy matches and no matches */}
                            {!disabled && (match.status === 'fuzzy_match' || match.status === 'no_match') && (
                                <div className="flex gap-1.5 mt-2 ml-5">
                                    {match.status === 'fuzzy_match' && onConfirmMatch && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => onConfirmMatch(index)}
                                            className="h-6 text-xs px-2 border-emerald-500/30 text-emerald-600 hover:bg-emerald-500/10"
                                        >
                                            <Check className="w-3 h-3 mr-1" />
                                            Confirm
                                        </Button>
                                    )}
                                    {onCreateNew && match.status === 'no_match' && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => onCreateNew(index)}
                                            className="h-6 text-xs px-2 border-blue-500/30 text-blue-600 hover:bg-blue-500/10"
                                        >
                                            <Plus className="w-3 h-3 mr-1" />
                                            Create Artwork
                                        </Button>
                                    )}
                                    {match.status === 'fuzzy_match' && onCreateNew && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => onCreateNew(index)}
                                            className="h-6 text-xs px-2 border-blue-500/30 text-blue-600 hover:bg-blue-500/10"
                                        >
                                            <Plus className="w-3 h-3 mr-1" />
                                            Create New Instead
                                        </Button>
                                    )}
                                </div>
                            )}
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
