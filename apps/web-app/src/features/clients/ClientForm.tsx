'use client'

import { useState } from 'react'
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
import type { Client, ClientType } from '@/src/types/database'

const CLIENT_TYPES: ClientType[] = ['collector', 'buyer', 'gallery', 'dealer', 'institution', 'other']

export interface ClientFormData {
    name: string
    email: string
    phone: string
    company: string
    address: string
    type: ClientType | ''
    notes: string
}

const emptyForm: ClientFormData = {
    name: '',
    email: '',
    phone: '',
    company: '',
    address: '',
    type: '',
    notes: '',
}

interface ClientFormProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    client?: Client | null
    onSubmit: (data: ClientFormData) => Promise<void>
}

export function ClientForm({ open, onOpenChange, client, onSubmit }: ClientFormProps) {
    const [form, setForm] = useState<ClientFormData>(
        client
            ? {
                  name: client.name,
                  email: client.email ?? '',
                  phone: client.phone ?? '',
                  company: client.company ?? '',
                  address: client.address ?? '',
                  type: client.type ?? '',
                  notes: client.notes ?? '',
              }
            : emptyForm
    )
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!form.name.trim()) {
            setError('Name is required')
            return
        }
        setError(null)
        setSaving(true)
        try {
            await onSubmit({
                ...form,
                type: form.type || undefined,
            } as ClientFormData)
            setForm(emptyForm)
            onOpenChange(false)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to save client')
        } finally {
            setSaving(false)
        }
    }

    const handleOpenChange = (next: boolean) => {
        if (!next) {
            setForm(client ? { name: client.name, email: client.email ?? '', phone: client.phone ?? '', company: client.company ?? '', address: client.address ?? '', type: client.type ?? '', notes: client.notes ?? '' } : emptyForm)
            setError(null)
        }
        onOpenChange(next)
    }

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent>
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>{client ? 'Edit Client' : 'Add Client'}</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Name *</Label>
                            <Input
                                id="name"
                                value={form.name}
                                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                                placeholder="Client name"
                                className="bg-background"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                value={form.email}
                                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                                placeholder="email@example.com"
                                className="bg-background"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="phone">Phone</Label>
                            <Input
                                id="phone"
                                value={form.phone}
                                onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                                placeholder="+1 234 567 8900"
                                className="bg-background"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="company">Company</Label>
                            <Input
                                id="company"
                                value={form.company}
                                onChange={e => setForm(f => ({ ...f, company: e.target.value }))}
                                placeholder="Gallery or institution"
                                className="bg-background"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="address">Address</Label>
                            <Input
                                id="address"
                                value={form.address}
                                onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
                                placeholder="Street, city, postal code"
                                className="bg-background"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="type">Type</Label>
                            <Select
                                value={form.type}
                                onValueChange={v => setForm(f => ({ ...f, type: v as ClientType }))}
                            >
                                <SelectTrigger className="bg-background">
                                    <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent>
                                    {CLIENT_TYPES.map(t => (
                                        <SelectItem key={t} value={t}>
                                            {t.charAt(0).toUpperCase() + t.slice(1)}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="notes">Notes</Label>
                            <Input
                                id="notes"
                                value={form.notes}
                                onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                                placeholder="Internal notes"
                                className="bg-background"
                            />
                        </div>
                        {error && (
                            <p className="text-sm text-destructive">{error}</p>
                        )}
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={saving}>
                            {saving ? 'Saving...' : client ? 'Save Changes' : 'Add Client'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
