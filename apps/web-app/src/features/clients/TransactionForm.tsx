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
import { TransactionService } from '@/src/services/transaction-service'
import { ArtworkService } from '@/src/services/artwork-service'
import type { TransactionType } from '@/src/types/database'

const TX_TYPES: TransactionType[] = ['sale', 'purchase', 'commission', 'rental', 'consignment', 'other']

interface TransactionFormProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    clientId: string
    clientName: string
    onSuccess: () => void
}

export function TransactionForm({ open, onOpenChange, clientId, clientName, onSuccess }: TransactionFormProps) {
    const [artworks, setArtworks] = useState<{ id: string; title: string }[]>([])
    const [type, setType] = useState<TransactionType>('sale')
    const [artworkId, setArtworkId] = useState<string>('')
    const [amount, setAmount] = useState('')
    const [currency, setCurrency] = useState('USD')
    const [date, setDate] = useState('')
    const [invoiceNumber, setInvoiceNumber] = useState('')
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
            await TransactionService.createTransaction({
                client_id: clientId,
                artwork_id: artworkId && artworkId !== '__none__' ? artworkId : null,
                type,
                amount: amount ? parseFloat(amount) : null,
                currency,
                date: date || null,
                invoice_number: invoiceNumber || null,
                notes: notes || null,
            })
            setType('sale')
            setArtworkId('')
            setAmount('')
            setDate('')
            setInvoiceNumber('')
            setNotes('')
            onSuccess()
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to create transaction')
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
                        <DialogTitle>Add Transaction</DialogTitle>
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
                        <div className="grid gap-2">
                            <Label>Type</Label>
                            <Select value={type} onValueChange={v => setType(v as TransactionType)}>
                                <SelectTrigger className="bg-background">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {TX_TYPES.map(t => (
                                        <SelectItem key={t} value={t}>
                                            {t.charAt(0).toUpperCase() + t.slice(1)}
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
                            <Label>Date</Label>
                            <Input
                                type="date"
                                value={date}
                                onChange={e => setDate(e.target.value)}
                                className="bg-background"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label>Invoice Number</Label>
                            <Input
                                value={invoiceNumber}
                                onChange={e => setInvoiceNumber(e.target.value)}
                                placeholder="INV-001"
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
                            {saving ? 'Saving...' : 'Add Transaction'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
