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
import { ExhibitionRecord, VenueType } from '@/src/types/database'

interface ExhibitionFormProps {
    record?: ExhibitionRecord
    onClose: () => void
    onSubmit: (data: any) => Promise<void>
}

const venueTypes: { value: VenueType; label: string }[] = [
    { value: 'museum', label: 'Museum' },
    { value: 'gallery', label: 'Gallery' },
    { value: 'fair', label: 'Art Fair' },
    { value: 'biennale', label: 'Biennale' },
    { value: 'private', label: 'Private' },
    { value: 'online', label: 'Online' }
]

const ExhibitionForm: React.FC<ExhibitionFormProps> = ({ record, onClose, onSubmit }) => {
    const [exhibitionName, setExhibitionName] = useState(record?.exhibition_name || '')
    const [venueName, setVenueName] = useState(record?.venue_name || '')
    const [venueType, setVenueType] = useState<VenueType | ''>(record?.venue_type || '')
    const [city, setCity] = useState(record?.city || '')
    const [country, setCountry] = useState(record?.country || '')
    const [startDate, setStartDate] = useState(record?.start_date?.split('T')[0] || '')
    const [endDate, setEndDate] = useState(record?.end_date?.split('T')[0] || '')
    const [catalogNumber, setCatalogNumber] = useState(record?.catalog_number || '')
    const [notes, setNotes] = useState(record?.notes || '')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const isEditing = !!record

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!exhibitionName.trim() || !venueName.trim()) {
            setError('Exhibition name and venue are required')
            return
        }

        try {
            setLoading(true)
            setError(null)
            await onSubmit({
                exhibition_name: exhibitionName.trim(),
                venue_name: venueName.trim(),
                venue_type: venueType || null,
                city: city.trim() || null,
                country: country.trim() || null,
                start_date: startDate || null,
                end_date: endDate || null,
                catalog_number: catalogNumber.trim() || null,
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
                        {isEditing ? 'Edit Exhibition Record' : 'Add Exhibition Record'}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                    <div className="space-y-2">
                        <Label htmlFor="exhibitionName">Exhibition Name *</Label>
                        <Input
                            id="exhibitionName"
                            placeholder="e.g., Contemporary Visions 2024"
                            value={exhibitionName}
                            onChange={(e) => setExhibitionName(e.target.value)}
                            autoFocus
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="venueName">Venue Name *</Label>
                            <Input
                                id="venueName"
                                placeholder="e.g., MoMA"
                                value={venueName}
                                onChange={(e) => setVenueName(e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Venue Type</Label>
                            <Select value={venueType} onValueChange={(v) => setVenueType(v as VenueType)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent>
                                    {venueTypes.map((type) => (
                                        <SelectItem key={type.value} value={type.value}>
                                            {type.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="city">City</Label>
                            <Input
                                id="city"
                                placeholder="e.g., New York"
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="country">Country</Label>
                            <Input
                                id="country"
                                placeholder="e.g., USA"
                                value={country}
                                onChange={(e) => setCountry(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="startDate">Start Date</Label>
                            <Input
                                id="startDate"
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="endDate">End Date</Label>
                            <Input
                                id="endDate"
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="catalogNumber">Catalog Number</Label>
                        <Input
                            id="catalogNumber"
                            placeholder="e.g., 42"
                            value={catalogNumber}
                            onChange={(e) => setCatalogNumber(e.target.value)}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="notes">Notes</Label>
                        <Textarea
                            id="notes"
                            placeholder="Additional details about this exhibition..."
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            rows={2}
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
                            disabled={loading || !exhibitionName.trim() || !venueName.trim()}
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

export default ExhibitionForm
