'use client'

import { useState, useEffect } from 'react'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    Button,
    Input,
    Label,
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@aetherlabs/ui'
import { QuotationService } from '@/src/services/quotation-service'
import { ArtworkService } from '@/src/services/artwork-service'
import type { QuotationStatus } from '@/src/types/database'

const QUOT_STATUSES: QuotationStatus[] = ['draft', 'sent', 'accepted', 'rejected', 'expired']

interface QuotationFormProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    clientId: string
    clientName: string
    onSuccess: () => void
}

export function QuotationForm({ open, onOpenChange, clientId, clientName, onSuccess }: QuotationFormProps) {
    const [artworks, setArtworks] = useState<{ id: string; title: string }[]>([])
    const [artworkId, setArtworkId] = useState<string>('')
    const [amount, setAmount] = useState('')
    const [currency, setCurrency] = useState('USD')
    const [validUntil, setValidUntil] = useState('')
    const [status, setStatus] = useState<QuotationStatus>('draft')
    const [quotationNumber, setQuotationNumber] = useState('')
    const [notes, setNotes] = useState('')
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (open) {
            ArtworkService.getArtworks().then(list => {
                setArtworks(list.map(a => ({ id: a.id, title: a.title })))
                if (list.length > 0 && (!artworkId || artworkId === '__none__')) setArtworkId(list[0].id)
            })
        }
    }, [open])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        setSaving(true)
        try {
            await QuotationService.createQuotation({
                client_id: clientId,
                artwork_id: artworkId && artworkId !== '__none__' ? artworkId : null,
                amount: amount ? parseFloat(amount) : null,
                currency,
                valid_until: validUntil || null,
                status,
                quotation_number: quotationNumber || null,
                notes: notes || null,
            })
            setArtworkId('')
            setAmount('')
            setValidUntil('')
            setStatus('draft')
            setQuotationNumber('')
            setNotes('')
            onSuccess()
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to create quotation')
        } finally {
            setSaving(false)
        }
    }

    const handleOpenChange = (next: boolean) => {
        if (!next) setError(null)
        onOpenChange(next)
    }

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent>
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Add Quotation</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label>Client</Label>
                            <Input value={clientName} disabled className="bg-muted" />
                        </div>
                        <div className="grid gap-2">
                            <Label>Artwork</Label>
                            <Select value={artworkId} onValueChange={setArtworkId}>
                                <SelectTrigger className="bg-background">
                                    <SelectValue placeholder="Select artwork" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="__none__">None</SelectItem>
                                    {artworks.map(a => (
                                        <SelectItem key={a.id} value={a.id}>
                                            {a.title}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label>Amount</Label>
                                <Input
                                    type="number"
                                    step="0.01"
                                    placeholder="0.00"
                                    value={amount}
                                    onChange={e => setAmount(e.target.value)}
                                    className="bg-background"
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label>Currency</Label>
                                <Input
                                    value={currency}
                                    onChange={e => setCurrency(e.target.value)}
                                    className="bg-background"
                                />
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label>Valid Until</Label>
                            <Input
                                type="date"
                                value={validUntil}
                                onChange={e => setValidUntil(e.target.value)}
                                className="bg-background"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label>Status</Label>
                            <Select value={status} onValueChange={v => setStatus(v as QuotationStatus)}>
                                <SelectTrigger className="bg-background">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {QUOT_STATUSES.map(s => (
                                        <SelectItem key={s} value={s}>
                                            {s.charAt(0).toUpperCase() + s.slice(1)}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2">
                            <Label>Quotation Number</Label>
                            <Input
                                value={quotationNumber}
                                onChange={e => setQuotationNumber(e.target.value)}
                                placeholder="QUOT-001"
                                className="bg-background"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label>Notes</Label>
                            <Input
                                value={notes}
                                onChange={e => setNotes(e.target.value)}
                                placeholder="Optional notes"
                                className="bg-background"
                            />
                        </div>
                        {error && <p className="text-sm text-destructive">{error}</p>}
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={saving}>
                            {saving ? 'Saving...' : 'Add Quotation'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
