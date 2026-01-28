'use client'

import React, { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    Button,
    Input,
    Label,
    Textarea,
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@aetherlabs/ui'
import { ProvenanceRecord, OwnerType, AcquisitionMethod } from '@/src/types/database'

interface ProvenanceFormProps {
    record?: ProvenanceRecord
    onClose: () => void
    onSubmit: (data: any) => Promise<void>
}

const ownerTypes: { value: OwnerType; label: string }[] = [
    { value: 'artist', label: 'Artist' },
    { value: 'gallery', label: 'Gallery' },
    { value: 'collector', label: 'Collector' },
    { value: 'dealer', label: 'Dealer' },
    { value: 'institution', label: 'Institution' }
]

const acquisitionMethods: { value: AcquisitionMethod; label: string }[] = [
    { value: 'purchase', label: 'Purchase' },
    { value: 'commission', label: 'Commission' },
    { value: 'gift', label: 'Gift' },
    { value: 'inheritance', label: 'Inheritance' },
    { value: 'auction', label: 'Auction' },
    { value: 'transfer', label: 'Transfer' }
]

const ProvenanceForm: React.FC<ProvenanceFormProps> = ({ record, onClose, onSubmit }) => {
    const [ownerName, setOwnerName] = useState(record?.owner_name || '')
    const [ownerType, setOwnerType] = useState<OwnerType | ''>(record?.owner_type || '')
    const [acquisitionDate, setAcquisitionDate] = useState(record?.acquisition_date?.split('T')[0] || '')
    const [acquisitionMethod, setAcquisitionMethod] = useState<AcquisitionMethod | ''>(record?.acquisition_method || '')
    const [location, setLocation] = useState(record?.location || '')
    const [notes, setNotes] = useState(record?.notes || '')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const isEditing = !!record

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!ownerName.trim()) {
            setError('Owner name is required')
            return
        }

        try {
            setLoading(true)
            setError(null)
            await onSubmit({
                owner_name: ownerName.trim(),
                owner_type: ownerType || null,
                acquisition_date: acquisitionDate || null,
                acquisition_method: acquisitionMethod || null,
                location: location.trim() || null,
                notes: notes.trim() || null
            })
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to save')
            setLoading(false)
        }
    }

    return (
        <Dialog open onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>
                        {isEditing ? 'Edit Provenance Record' : 'Add Provenance Record'}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                    <div className="space-y-2">
                        <Label htmlFor="ownerName">Owner Name *</Label>
                        <Input
                            id="ownerName"
                            placeholder="e.g., John Smith Collection"
                            value={ownerName}
                            onChange={(e) => setOwnerName(e.target.value)}
                            autoFocus
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Owner Type</Label>
                            <Select value={ownerType} onValueChange={(v) => setOwnerType(v as OwnerType)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent>
                                    {ownerTypes.map((type) => (
                                        <SelectItem key={type.value} value={type.value}>
                                            {type.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>Acquisition Method</Label>
                            <Select value={acquisitionMethod} onValueChange={(v) => setAcquisitionMethod(v as AcquisitionMethod)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select method" />
                                </SelectTrigger>
                                <SelectContent>
                                    {acquisitionMethods.map((method) => (
                                        <SelectItem key={method.value} value={method.value}>
                                            {method.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="acquisitionDate">Acquisition Date</Label>
                            <Input
                                id="acquisitionDate"
                                type="date"
                                value={acquisitionDate}
                                onChange={(e) => setAcquisitionDate(e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="location">Location</Label>
                            <Input
                                id="location"
                                placeholder="e.g., New York, USA"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="notes">Notes</Label>
                        <Textarea
                            id="notes"
                            placeholder="Additional details about this ownership period..."
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            rows={3}
                        />
                    </div>

                    {error && (
                        <p className="text-sm text-destructive">{error}</p>
                    )}

                    <div className="flex justify-end gap-3 pt-2">
                        <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={loading || !ownerName.trim()}
                            className="bg-[#2A2121] hover:bg-[#2A2121]/90 text-white"
                        >
                            {loading ? 'Saving...' : isEditing ? 'Save Changes' : 'Add Record'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default ProvenanceForm
