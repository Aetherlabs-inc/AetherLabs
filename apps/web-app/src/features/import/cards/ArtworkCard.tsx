'use client'

import { useState } from 'react'
import {
    Card, Button, Dialog, DialogContent, DialogHeader,
    DialogTitle, DialogFooter, Input, Label,
} from '@aetherlabs/ui'
import { Pencil, Check, X } from 'lucide-react'
import { ConfidenceIndicator } from '../ConfidenceIndicator'
import type { ExtractedRecord } from '@/src/types/database'

interface ArtworkCardProps {
    record: ExtractedRecord
    onApprove: (id: string) => void
    onReject: (id: string) => void
    onEdit: (id: string, edits: Record<string, unknown>) => void
}

const FIELDS = [
    { key: 'artist', label: 'Artist' },
    { key: 'medium', label: 'Medium' },
    { key: 'dimensions', label: 'Dimensions' },
    { key: 'year', label: 'Year' },
    { key: 'location', label: 'Location' },
    { key: 'price', label: 'Price' },
]

export function ArtworkCard({ record, onApprove, onReject, onEdit }: ArtworkCardProps) {
    const [editOpen, setEditOpen] = useState(false)
    const data = { ...record.extracted_data, ...record.user_edits }
    const [editData, setEditData] = useState(data)

    const isActioned = record.status === 'approved' || record.status === 'rejected' || record.status === 'saved'

    const handleSaveEdit = () => {
        onEdit(record.id, editData)
        setEditOpen(false)
    }

    const formatPrice = (price: string | number | null | undefined) => {
        if (!price) return null
        const num = typeof price === 'string' ? parseFloat(price.replace(/[^0-9.]/g, '')) : price
        if (isNaN(num)) return price
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: data.currency || 'USD' }).format(num)
    }

    return (
        <>
            <Card className={`overflow-hidden transition-opacity bg-card border-border ${isActioned ? 'opacity-60' : ''}`}>
                <div className="p-5">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                        <ConfidenceIndicator confidence={record.confidence} cardContext />
                        {record.status !== 'pending' && (
                            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${record.status === 'approved' || record.status === 'saved'
                                ? 'bg-success/15 text-success border border-success/20'
                                : record.status === 'rejected'
                                    ? 'bg-destructive/15 text-destructive border border-destructive/20'
                                    : 'bg-warning/15 text-warning border border-warning/20'
                                }`}>
                                {record.status}
                            </span>
                        )}
                    </div>

                    {/* Title */}
                    <p className="font-playfair text-lg italic text-card-foreground mb-4">
                        &ldquo;{data.title || 'Untitled'}&rdquo;
                    </p>

                    <div className="border-t border-border mb-4" />

                    {/* Key-value pairs */}
                    <div className="space-y-2.5">
                        {FIELDS.map(({ key, label }) => {
                            const value = key === 'price' ? formatPrice(data[key]) : data[key]
                            if (!value) return null
                            return (
                                <div key={key} className="flex justify-between items-baseline gap-4">
                                    <span className="text-sm text-muted-foreground shrink-0">{label}</span>
                                    <span className="text-sm text-card-foreground font-inter text-right tabular-nums">
                                        {String(value)}
                                    </span>
                                </div>
                            )
                        })}
                    </div>

                    {data.notes && (
                        <>
                            <div className="border-t border-border my-4" />
                            <p className="text-xs text-muted-foreground italic">{data.notes}</p>
                        </>
                    )}

                    {/* Actions */}
                    <div className="border-t border-border mt-4 pt-4 flex items-center justify-between">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                                setEditData({ ...record.extracted_data, ...record.user_edits })
                                setEditOpen(true)
                            }}
                            disabled={isActioned}
                            className="text-foreground hover:bg-muted"
                        >
                            <Pencil className="w-3.5 h-3.5 mr-1.5" />
                            Edit
                        </Button>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => onReject(record.id)}
                                disabled={isActioned}
                                className="text-destructive border-destructive/50 hover:bg-destructive/10 hover:text-destructive"
                            >
                                <X className="w-3.5 h-3.5 mr-1" />
                                Reject
                            </Button>
                            <Button
                                size="sm"
                                onClick={() => onApprove(record.id)}
                                disabled={isActioned}
                                className="bg-primary text-primary-foreground hover:bg-primary/90"
                            >
                                <Check className="w-3.5 h-3.5 mr-1" />
                                Approve
                            </Button>
                        </div>
                    </div>
                </div>
            </Card>

            {/* Edit Dialog */}
            <Dialog open={editOpen} onOpenChange={setEditOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Artwork</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div>
                            <Label>Title</Label>
                            <Input
                                value={editData.title || ''}
                                onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                            />
                        </div>
                        {FIELDS.map(({ key, label }) => (
                            <div key={key}>
                                <Label>{label}</Label>
                                <Input
                                    value={editData[key] || ''}
                                    onChange={(e) => setEditData({ ...editData, [key]: e.target.value })}
                                />
                            </div>
                        ))}
                        <div>
                            <Label>Notes</Label>
                            <Input
                                value={editData.notes || ''}
                                onChange={(e) => setEditData({ ...editData, notes: e.target.value })}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setEditOpen(false)}>Cancel</Button>
                        <Button onClick={handleSaveEdit} className="bg-primary text-primary-foreground hover:bg-primary/90">Save Changes</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}
