'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Wrench, FileText, Sparkles, Frame, Beaker, Calendar, User, MoreHorizontal, Pencil, Trash2 } from 'lucide-react'
import { Button, Badge, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@aetherlabs/ui'
import { ConservationRecord, ConservationRecordType } from '@/src/types/database'

interface ConservationListProps {
    records: ConservationRecord[]
    onEdit: (record: ConservationRecord) => void
    onDelete: (id: string) => void
}

const recordTypeConfig: Record<ConservationRecordType, { icon: React.ElementType; label: string; color: string }> = {
    condition_report: { icon: FileText, label: 'Condition Report', color: 'bg-blue-500/10 text-blue-600' },
    restoration: { icon: Wrench, label: 'Restoration', color: 'bg-amber-500/10 text-amber-600' },
    cleaning: { icon: Sparkles, label: 'Cleaning', color: 'bg-emerald-500/10 text-emerald-600' },
    reframing: { icon: Frame, label: 'Reframing', color: 'bg-purple-500/10 text-purple-600' },
    material_note: { icon: Beaker, label: 'Material Note', color: 'bg-gray-500/10 text-gray-600' }
}

const ConservationList: React.FC<ConservationListProps> = ({ records, onEdit, onDelete }) => {
    if (records.length === 0) {
        return (
            <div className="text-center py-8 px-4 border border-dashed border-border rounded-lg">
                <Wrench className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">
                    No conservation records yet
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                    Document condition reports and restoration work
                </p>
            </div>
        )
    }

    return (
        <div className="space-y-3">
            {records.map((record, index) => {
                const config = recordTypeConfig[record.record_type]
                const Icon = config.icon

                return (
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
                                        {record.title}
                                    </span>
                                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs ${config.color}`}>
                                        <Icon className="w-3 h-3" />
                                        {config.label}
                                    </span>
                                </div>

                                <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground flex-wrap">
                                    {record.performed_by && (
                                        <span className="flex items-center gap-1">
                                            <User className="w-3 h-3" />
                                            {record.performed_by}
                                        </span>
                                    )}
                                    {record.performed_at && (
                                        <span className="flex items-center gap-1">
                                            <Calendar className="w-3 h-3" />
                                            {new Date(record.performed_at).toLocaleDateString('en-US', {
                                                month: 'short',
                                                day: 'numeric',
                                                year: 'numeric'
                                            })}
                                        </span>
                                    )}
                                </div>

                                {record.description && (
                                    <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                                        {record.description}
                                    </p>
                                )}

                                {/* Before/After Images */}
                                {(record.before_image_url || record.after_image_url) && (
                                    <div className="flex gap-2 mt-3">
                                        {record.before_image_url && (
                                            <div className="w-16 h-16 rounded bg-muted overflow-hidden">
                                                <img
                                                    src={record.before_image_url}
                                                    alt="Before"
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                        )}
                                        {record.after_image_url && (
                                            <div className="w-16 h-16 rounded bg-muted overflow-hidden">
                                                <img
                                                    src={record.after_image_url}
                                                    alt="After"
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                        )}
                                    </div>
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
                )
            })}
        </div>
    )
}

export default ConservationList
