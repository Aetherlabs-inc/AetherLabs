'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Building2, MapPin, Calendar, MoreHorizontal, Pencil, Trash2, ExternalLink } from 'lucide-react'
import { Button, Badge, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@aetherlabs/ui'
import { ExhibitionRecord, VenueType } from '@/src/types/database'

interface ExhibitionListProps {
    records: ExhibitionRecord[]
    onEdit: (record: ExhibitionRecord) => void
    onDelete: (id: string) => void
}

const venueTypeLabels: Record<VenueType, string> = {
    museum: 'Museum',
    gallery: 'Gallery',
    fair: 'Art Fair',
    biennale: 'Biennale',
    private: 'Private',
    online: 'Online'
}

const ExhibitionList: React.FC<ExhibitionListProps> = ({ records, onEdit, onDelete }) => {
    if (records.length === 0) {
        return (
            <div className="text-center py-8 px-4 border border-dashed border-border rounded-lg">
                <Building2 className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">
                    No exhibition records yet
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                    Document where this artwork has been shown
                </p>
            </div>
        )
    }

    const formatDateRange = (start?: string | null, end?: string | null) => {
        if (!start && !end) return null
        const startDate = start ? new Date(start).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : '?'
        const endDate = end ? new Date(end).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Present'
        return `${startDate} - ${endDate}`
    }

    return (
        <div className="space-y-3">
            {records.map((record, index) => (
                <motion.div
                    key={record.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="p-4 rounded-lg border border-border bg-card hover:border-[#BC8010]/30 transition-colors group"
                >
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-medium text-foreground">
                                    {record.exhibition_name}
                                </span>
                                {record.venue_type && (
                                    <Badge variant="outline" className="text-xs">
                                        {venueTypeLabels[record.venue_type]}
                                    </Badge>
                                )}
                            </div>

                            <p className="text-sm text-muted-foreground mt-1">
                                {record.venue_name}
                            </p>

                            <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground flex-wrap">
                                {(record.city || record.country) && (
                                    <span className="flex items-center gap-1">
                                        <MapPin className="w-3 h-3" />
                                        {[record.city, record.country].filter(Boolean).join(', ')}
                                    </span>
                                )}
                                {formatDateRange(record.start_date, record.end_date) && (
                                    <span className="flex items-center gap-1">
                                        <Calendar className="w-3 h-3" />
                                        {formatDateRange(record.start_date, record.end_date)}
                                    </span>
                                )}
                                {record.catalog_number && (
                                    <span>
                                        Cat. #{record.catalog_number}
                                    </span>
                                )}
                            </div>

                            {record.notes && (
                                <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                                    {record.notes}
                                </p>
                            )}
                        </div>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <MoreHorizontal className="w-4 h-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => onEdit(record)}>
                                    <Pencil className="w-4 h-4 mr-2" />
                                    Edit
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    className="text-destructive"
                                    onClick={() => onDelete(record.id)}
                                >
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Delete
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </motion.div>
            ))}
        </div>
    )
}

export default ExhibitionList
