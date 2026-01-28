'use client'

import React, { useState } from 'react'
import { X, Globe, Lock, Link2 } from 'lucide-react'
import {
    Button,
    Input,
    Label,
    Textarea,
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@aetherlabs/ui'
import { Collection, CollectionVisibility } from '@/src/types/database'

interface CollectionFormProps {
    collection?: Collection
    onClose: () => void
    onSubmit: (data: { name: string; description?: string; visibility: CollectionVisibility }) => Promise<void>
}

const visibilityOptions: { value: CollectionVisibility; label: string; description: string; icon: React.ElementType }[] = [
    {
        value: 'private',
        label: 'Private',
        description: 'Only you can see this collection',
        icon: Lock
    },
    {
        value: 'unlisted',
        label: 'Unlisted',
        description: 'Anyone with the link can view',
        icon: Link2
    },
    {
        value: 'public',
        label: 'Public',
        description: 'Visible on your public profile',
        icon: Globe
    }
]

const CollectionForm: React.FC<CollectionFormProps> = ({ collection, onClose, onSubmit }) => {
    const [name, setName] = useState(collection?.name || '')
    const [description, setDescription] = useState(collection?.description || '')
    const [visibility, setVisibility] = useState<CollectionVisibility>(collection?.visibility || 'private')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const isEditing = !!collection

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!name.trim()) {
            setError('Collection name is required')
            return
        }

        try {
            setLoading(true)
            setError(null)
            await onSubmit({
                name: name.trim(),
                description: description.trim() || undefined,
                visibility
            })
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to save collection')
            setLoading(false)
        }
    }

    return (
        <Dialog open onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[480px]">
                <DialogHeader>
                    <DialogTitle>
                        {isEditing ? 'Edit Collection' : 'Create Collection'}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6 mt-4">
                    {/* Name */}
                    <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            placeholder="e.g., Abstract Series 2024"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            autoFocus
                        />
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <Label htmlFor="description">Description (optional)</Label>
                        <Textarea
                            id="description"
                            placeholder="Describe this collection..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={3}
                        />
                    </div>

                    {/* Visibility */}
                    <div className="space-y-3">
                        <Label>Visibility</Label>
                        <div className="space-y-2">
                            {visibilityOptions.map((option) => (
                                <label
                                    key={option.value}
                                    className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                                        visibility === option.value
                                            ? 'border-[#BC8010] bg-[#BC8010]/5'
                                            : 'border-border hover:border-[#BC8010]/30'
                                    }`}
                                >
                                    <input
                                        type="radio"
                                        name="visibility"
                                        value={option.value}
                                        checked={visibility === option.value}
                                        onChange={(e) => setVisibility(e.target.value as CollectionVisibility)}
                                        className="mt-1 accent-[#BC8010]"
                                    />
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <option.icon className="w-4 h-4 text-muted-foreground" />
                                            <span className="font-medium text-foreground">{option.label}</span>
                                        </div>
                                        <p className="text-sm text-muted-foreground mt-0.5">
                                            {option.description}
                                        </p>
                                    </div>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Error */}
                    {error && (
                        <p className="text-sm text-destructive">{error}</p>
                    )}

                    {/* Actions */}
                    <div className="flex justify-end gap-3 pt-2">
                        <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={loading || !name.trim()}
                            className="bg-[#2A2121] hover:bg-[#2A2121]/90 text-white"
                        >
                            {loading ? 'Saving...' : isEditing ? 'Save Changes' : 'Create Collection'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default CollectionForm
