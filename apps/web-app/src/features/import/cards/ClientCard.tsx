'use client'

import { useState } from 'react'
import {
    Card, Button, Dialog, DialogContent, DialogHeader,
    DialogTitle, DialogFooter, Input, Label,
    Select, SelectTrigger, SelectContent, SelectItem, SelectValue,
} from '@aetherlabs/ui'
import { Pencil, Check, X, User } from 'lucide-react'
import { ConfidenceIndicator } from '../ConfidenceIndicator'
import type { ExtractedRecord } from '@/src/types/database'

interface ClientCardProps {
    record: ExtractedRecord
    onApprove: (id: string) => void
    onReject: (id: string) => void
    onEdit: (id: string, edits: Record<string, unknown>) => void
}

const CLIENT_TYPES = ['collector', 'buyer', 'gallery', 'dealer', 'institution', 'other']

const FIELDS = [
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone' },
    { key: 'company', label: 'Company' },
    { key: 'type', label: 'Type' },
    { key: 'address', label: 'Address' },
]

export function ClientCard({ record, onApprove, onReject, onEdit }: ClientCardProps) {
    const [editOpen, setEditOpen] = useState(false)
    const data = { ...record.extracted_data, ...record.user_edits }
    const [editData, setEditData] = useState(data)

    const isActioned = record.status === 'approved' || record.status === 'rejected' || record.status === 'saved'

    const handleSaveEdit = () => {
        onEdit(record.id, editData)
        setEditOpen(false)
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

                    {/* Client info */}
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center shrink-0">
                            <User className="w-5 h-5 text-muted-foreground" />
                        </div>
                        <p className="font-playfair text-lg font-medium text-card-foreground">
                            {data.name || 'Unknown'}
                        </p>
                    </div>

                    <div className="border-t border-neutral-200 mb-4" />

                    {/* Details */}
                    <div className="space-y-2.5">
                        {FIELDS.map(({ key, label }) => {
                            if (!data[key]) return null
                            return (
                                <div key={key} className="flex justify-between items-baseline gap-4">
                                    <span className="text-sm text-muted-foreground shrink-0">{label}</span>
                                    <span className="text-sm text-card-foreground font-inter text-right">
                                        {String(data[key])}
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
                        <DialogTitle>Edit Client</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div>
                            <Label>Name</Label>
                            <Input
                                value={editData.name || ''}
                                onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                            />
                        </div>
                        <div>
                            <Label>Email</Label>
                            <Input
                                value={editData.email || ''}
                                onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                            />
                        </div>
                        <div>
                            <Label>Phone</Label>
                            <Input
                                value={editData.phone || ''}
                                onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                            />
                        </div>
                        <div>
                            <Label>Company</Label>
                            <Input
                                value={editData.company || ''}
                                onChange={(e) => setEditData({ ...editData, company: e.target.value })}
                            />
                        </div>
                        <div>
                            <Label>Address</Label>
                            <Input
                                value={editData.address || ''}
                                onChange={(e) => setEditData({ ...editData, address: e.target.value })}
                            />
                        </div>
                        <div>
                            <Label>Type</Label>
                            <Select
                                value={editData.type || 'other'}
                                onValueChange={(v) => setEditData({ ...editData, type: v })}
                            >
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    {CLIENT_TYPES.map((t) => (
                                        <SelectItem key={t} value={t} className="capitalize">{t}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
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
