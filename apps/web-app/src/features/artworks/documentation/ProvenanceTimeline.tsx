'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { User, Building2, Briefcase, Landmark, MoreHorizontal, Pencil, Trash2, CheckCircle, MapPin, Calendar } from 'lucide-react'
import { Button, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@aetherlabs/ui'
import { ProvenanceRecord, OwnerType } from '@/src/types/database'

interface ProvenanceTimelineProps {
    records: ProvenanceRecord[]
    onEdit: (record: ProvenanceRecord) => void
    onDelete: (id: string) => void
}

const ownerTypeIcons: Record<OwnerType, React.ElementType> = {
    artist: User,
    gallery: Building2,
    collector: User,
    dealer: Briefcase,
    institution: Landmark
}

const ownerTypeLabels: Record<OwnerType, string> = {
    artist: 'Artist',
    gallery: 'Gallery',
    collector: 'Collector',
    dealer: 'Dealer',
    institution: 'Institution'
}

const acquisitionMethodLabels: Record<string, string> = {
    purchase: 'Purchased',
    commission: 'Commissioned',
    gift: 'Gift',
    inheritance: 'Inherited',
    auction: 'Auction',
    transfer: 'Transferred'
}

const ProvenanceTimeline: React.FC<ProvenanceTimelineProps> = ({ records, onEdit, onDelete }) => {
    if (records.length === 0) {
        return (
            <div className="text-center py-8 px-4 border border-dashed border-border rounded-lg">
                <User className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">
                    No provenance records yet
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                    Add the first owner to start tracking provenance
                </p>
            </div>
        )
    }

    return (
        <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-4 top-0 bottom-0 w-px bg-border" />

            <div className="space-y-4">
                {records.map((record, index) => {
                    const Icon = record.owner_type ? ownerTypeIcons[record.owner_type] : User
                    const isFirst = index === 0
                    const isLast = index === records.length - 1

                    return (
                        <motion.div
                            key={record.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="relative pl-10 group"
                        >
                            {/* Timeline dot */}
                            <div className={`absolute left-2 top-2 w-4 h-4 rounded-full border-2 ${
                                isFirst
                                    ? 'bg-[#BC8010] border-[#BC8010]'
                                    : 'bg-background border-border group-hover:border-[#BC8010]'
                            } transition-colors`}>
                                {record.verified && (
                                    <CheckCircle className="absolute -top-1 -right-1 w-3 h-3 text-emerald-500 bg-background rounded-full" />
                                )}
                            </div>

                            {/* Content */}
                            <div className="p-4 rounded-lg border border-border bg-card hover:border-[#BC8010]/30 transition-colors">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <span className="font-medium text-foreground">
                                                {record.owner_name}
                                            </span>
                                            {record.owner_type && (
                                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-muted text-xs text-muted-foreground">
                                                    <Icon className="w-3 h-3" />
                                                    {ownerTypeLabels[record.owner_type]}
                                                </span>
                                            )}
                                            {record.verified && (
                                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-xs text-emerald-600">
                                                    <CheckCircle className="w-3 h-3" />
                                                    Verified
                                                </span>
                                            )}
                                        </div>

                                        <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground flex-wrap">
                                            {record.acquisition_date && (
                                                <span className="flex items-center gap-1">
                                                    <Calendar className="w-3 h-3" />
                                                    {new Date(record.acquisition_date).toLocaleDateString('en-US', {
                                                        year: 'numeric',
                                                        month: 'short'
                                                    })}
                                                </span>
                                            )}
                                            {record.acquisition_method && (
                                                <span>
                                                    {acquisitionMethodLabels[record.acquisition_method] || record.acquisition_method}
                                                </span>
                                            )}
                                            {record.location && (
                                                <span className="flex items-center gap-1">
                                                    <MapPin className="w-3 h-3" />
                                                    {record.location}
                                                </span>
                                            )}
                                        </div>

                                        {record.notes && (
                                            <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                                                {record.notes}
                                            </p>
                                        )}
                                    </div>

                                    {/* Actions */}
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
                            </div>
                        </motion.div>
                    )
                })}
            </div>
        </div>
    )
}

export default ProvenanceTimeline
