'use client'

import { useState } from 'react'
import {
    Card, Button, Dialog, DialogContent, DialogHeader,
    DialogTitle, DialogFooter, Input, Label,
    Select, SelectTrigger, SelectContent, SelectItem, SelectValue,
} from '@aetherlabs/ui'
import { Pencil, Check, X, FileText } from 'lucide-react'
import { ConfidenceIndicator } from '../ConfidenceIndicator'
import { InvoiceDocument } from './InvoiceDocument'
import type { ExtractedRecord } from '@/src/types/database'

interface InvoiceCardProps {
    record: ExtractedRecord
    onApprove: (id: string) => void
    onReject: (id: string) => void
    onEdit: (id: string, edits: Record<string, unknown>) => void
}

interface LineItem {
    description?: string
    name?: string
    details?: string
    amount?: string | number
    unit_price?: string | number
    price?: string | number
    quantity?: number
}

const TRANSACTION_TYPES = ['sale', 'purchase', 'commission', 'rental', 'consignment', 'other']

export function InvoiceCard({ record, onApprove, onReject, onEdit }: InvoiceCardProps) {
    const [editOpen, setEditOpen] = useState(false)
    const [viewOpen, setViewOpen] = useState(false)
    const data = { ...record.extracted_data, ...record.user_edits }
    const [editData, setEditData] = useState(data)

    const isActioned = record.status === 'approved' || record.status === 'rejected' || record.status === 'saved'

    const handleSaveEdit = () => {
        onEdit(record.id, editData)
        setEditOpen(false)
    }

    const formatAmount = (amount: string | number | null | undefined, currency?: string) => {
        if (!amount && amount !== 0) return '—'
        const num = typeof amount === 'string' ? parseFloat(amount.replace(/[^0-9.]/g, '')) : amount
        if (isNaN(num)) return String(amount)
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency || data.currency || 'USD',
        }).format(num)
    }

    const formatDate = (dateStr: string | null) => {
        if (!dateStr) return null
        try {
            return new Date(dateStr).toLocaleDateString('en-US', {
                year: 'numeric', month: 'short', day: 'numeric',
            })
        } catch { return dateStr }
    }

    return (
        <>
            <Card className={`overflow-hidden transition-opacity bg-card border-border ${isActioned ? 'opacity-60' : ''}`}>
                <div className="p-5">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-1">
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

                    {/* Invoice Header */}
                    <div className="flex items-start justify-between mt-3 mb-1">
                        <div>
                            <p className="font-playfair text-base font-medium text-neutral-900">
                                {data.client_name || 'Unknown Client'}
                            </p>
                            {data.client_email && (
                                <p className="text-xs text-muted-foreground">{data.client_email}</p>
                            )}
                        </div>
                        <div className="text-right">
                            <p className="font-playfair text-sm tracking-widest text-neutral-500 uppercase">
                                Invoice
                            </p>
                            {data.invoice_number && (
                                <p className="text-xs font-inter text-muted-foreground tabular-nums">
                                    #{data.invoice_number}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="border-t border-neutral-200 my-3" />

                    {/* Line Items */}
                    {Array.isArray(data.line_items) && data.line_items.length > 0 ? (
                        <div className="mb-3">
                            <p className="text-xs text-muted-foreground mb-2">Description</p>
                            <div className="space-y-1.5">
                                {data.line_items.map((item: LineItem, i: number) => (
                                    <div key={i} className="flex justify-between items-baseline text-sm">
                                        <span className="text-card-foreground mr-4 flex-1">
                                            {item.description}
                                            {item.quantity && item.quantity > 1 && (
                                                <span className="text-neutral-500 ml-1">×{item.quantity}</span>
                                            )}
                                        </span>
                                        <span className="font-inter text-card-foreground tabular-nums shrink-0">
                                            {formatAmount(item.amount)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                            <div className="border-t border-neutral-200 my-2" />
                        </div>
                    ) : data.artwork_title ? (
                        <div className="mb-3">
                            <p className="text-xs text-muted-foreground mb-1">Description</p>
                            <div className="flex justify-between items-baseline">
                                <span className="text-sm text-card-foreground">{data.artwork_title}</span>
                                <span className="text-sm font-inter text-card-foreground tabular-nums">
                                    {formatAmount(data.amount)}
                                </span>
                            </div>
                            <div className="border-t border-neutral-200 my-2" />
                        </div>
                    ) : null}

                    {/* Summary */}
                    <div className="space-y-1.5 text-sm">
                        <div className="flex justify-between items-baseline">
                            <span className="text-muted-foreground">Total</span>
                            <span className="font-inter font-medium text-card-foreground tabular-nums">
                                {formatAmount(data.amount)}
                            </span>
                        </div>
                        {data.type && (
                            <div className="flex justify-between items-baseline">
                                <span className="text-neutral-600">Type</span>
                                <span className="font-inter text-neutral-900 capitalize">{data.type}</span>
                            </div>
                        )}
                        {data.date && (
                            <div className="flex justify-between items-baseline">
                                <span className="text-muted-foreground">Date</span>
                                <span className="font-inter text-card-foreground tabular-nums">
                                    {formatDate(data.date)}
                                </span>
                            </div>
                        )}
                    </div>

                    {data.notes && (
                        <>
                            <div className="border-t border-neutral-200 my-3" />
                            <p className="text-xs text-muted-foreground italic">{data.notes}</p>
                        </>
                    )}

                    {/* Actions */}
                    <div className="border-t border-neutral-200 mt-4 pt-4 flex items-center justify-between">
                        <div className="flex gap-2">
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
                            {isActioned && record.status !== 'rejected' && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setViewOpen(true)}
                                    className="text-foreground hover:bg-muted"
                                >
                                    <FileText className="w-3.5 h-3.5 mr-1.5" />
                                    View
                                </Button>
                            )}
                        </div>
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

            {/* View Document Dialog */}
            <Dialog open={viewOpen} onOpenChange={setViewOpen}>
                <DialogContent className="max-w-3xl p-0 overflow-y-auto max-h-[90vh]">
                    <InvoiceDocument data={data} />
                </DialogContent>
            </Dialog>

            {/* Edit Dialog */}
            <Dialog open={editOpen} onOpenChange={setEditOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Transaction</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div>
                            <Label>Client Name</Label>
                            <Input
                                value={editData.client_name || ''}
                                onChange={(e) => setEditData({ ...editData, client_name: e.target.value })}
                            />
                        </div>
                        <div>
                            <Label>Client Email</Label>
                            <Input
                                value={editData.client_email || ''}
                                onChange={(e) => setEditData({ ...editData, client_email: e.target.value })}
                            />
                        </div>
                        <div>
                            <Label>Artwork Title</Label>
                            <Input
                                value={editData.artwork_title || ''}
                                onChange={(e) => setEditData({ ...editData, artwork_title: e.target.value })}
                            />
                        </div>
                        <div>
                            <Label>Type</Label>
                            <Select
                                value={editData.type || 'sale'}
                                onValueChange={(v) => setEditData({ ...editData, type: v })}
                            >
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    {TRANSACTION_TYPES.map((t) => (
                                        <SelectItem key={t} value={t} className="capitalize">{t}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <Label>Amount</Label>
                                <Input
                                    value={editData.amount || ''}
                                    onChange={(e) => setEditData({ ...editData, amount: e.target.value })}
                                />
                            </div>
                            <div>
                                <Label>Currency</Label>
                                <Input
                                    value={editData.currency || 'USD'}
                                    onChange={(e) => setEditData({ ...editData, currency: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <Label>Invoice #</Label>
                                <Input
                                    value={editData.invoice_number || ''}
                                    onChange={(e) => setEditData({ ...editData, invoice_number: e.target.value })}
                                />
                            </div>
                            <div>
                                <Label>Date</Label>
                                <Input
                                    type="date"
                                    value={editData.date || ''}
                                    onChange={(e) => setEditData({ ...editData, date: e.target.value })}
                                />
                            </div>
                        </div>
                        <div>
                            <Label>Notes</Label>
                            <Input
                                value={editData.notes || ''}
                                onChange={(e) => setEditData({ ...editData, notes: e.target.value })}
                            />
                        </div>
                        {Array.isArray(editData.line_items) && editData.line_items.length > 0 && (
                            <div>
                                <Label className="mb-2 block">Line Items (read-only)</Label>
                                <div className="rounded-md border border-neutral-200 bg-neutral-50 p-3 space-y-1.5 text-sm">
                                    {editData.line_items.map((item: LineItem, i: number) => (
                                        <div key={i} className="flex justify-between items-baseline">
                                            <span className="text-muted-foreground">{item.description}</span>
                                            <span className="font-inter text-foreground tabular-nums">
                                                {formatAmount(item.amount)}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
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
