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
import { ConservationRecord, ConservationRecordType } from '@/src/types/database'

interface ConservationFormProps {
    record?: ConservationRecord
    onClose: () => void
    onSubmit: (data: any) => Promise<void>
}

const recordTypes: { value: ConservationRecordType; label: string }[] = [
    { value: 'condition_report', label: 'Condition Report' },
    { value: 'restoration', label: 'Restoration' },
    { value: 'cleaning', label: 'Cleaning' },
    { value: 'reframing', label: 'Reframing' },
    { value: 'material_note', label: 'Material Note' }
]

const ConservationForm: React.FC<ConservationFormProps> = ({ record, onClose, onSubmit }) => {
    const [recordType, setRecordType] = useState<ConservationRecordType>(record?.record_type || 'condition_report')
    const [title, setTitle] = useState(record?.title || '')
    const [description, setDescription] = useState(record?.description || '')
    const [performedBy, setPerformedBy] = useState(record?.performed_by || '')
    const [performedAt, setPerformedAt] = useState(record?.performed_at?.split('T')[0] || '')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const isEditing = !!record

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!title.trim()) {
            setError('Title is required')
            return
        }

        try {
            setLoading(true)
            setError(null)
            await onSubmit({
                record_type: recordType,
                title: title.trim(),
                description: description.trim() || null,
                performed_by: performedBy.trim() || null,
                performed_at: performedAt || null
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
                        {isEditing ? 'Edit Conservation Record' : 'Add Conservation Record'}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Record Type *</Label>
                            <Select value={recordType} onValueChange={(v) => setRecordType(v as ConservationRecordType)}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {recordTypes.map((type) => (
                                        <SelectItem key={type.value} value={type.value}>
                                            {type.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="performedAt">Date</Label>
                            <Input
                                id="performedAt"
                                type="date"
                                value={performedAt}
                                onChange={(e) => setPerformedAt(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="title">Title *</Label>
                        <Input
                            id="title"
                            placeholder="e.g., Annual Condition Assessment"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            autoFocus
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="performedBy">Performed By</Label>
                        <Input
                            id="performedBy"
                            placeholder="e.g., Jane Smith, Conservator"
                            value={performedBy}
                            onChange={(e) => setPerformedBy(e.target.value)}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            placeholder="Detailed notes about the conservation work..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={4}
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
                            disabled={loading || !title.trim()}
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

export default ConservationForm
