'use client'

import { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    Button,
    Input,
    Label,
    Checkbox,
    Textarea,
} from '@aetherlabs/ui/primitives'
import { Loader2, Send, UserPlus } from 'lucide-react'
import { TransferService } from '@/src/services/transfer-service'

interface TransferInitiateModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    artworkId: string
    artworkTitle: string
    onSuccess?: () => void
}

export function TransferInitiateModal({
    open,
    onOpenChange,
    artworkId,
    artworkTitle,
    onSuccess,
}: TransferInitiateModalProps) {
    const [recipientEmail, setRecipientEmail] = useState('')
    const [transferNotes, setTransferNotes] = useState('')
    const [requiresWitness, setRequiresWitness] = useState(false)
    const [witnessEmail, setWitnessEmail] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        setIsSubmitting(true)

        try {
            await TransferService.initiateTransfer({
                artwork_id: artworkId,
                to_email: recipientEmail,
                transfer_notes: transferNotes || undefined,
                requires_witness: requiresWitness,
                witness_email: requiresWitness ? witnessEmail : undefined,
            })

            onOpenChange(false)
            onSuccess?.()

            // Reset form
            setRecipientEmail('')
            setTransferNotes('')
            setRequiresWitness(false)
            setWitnessEmail('')
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to initiate transfer')
        } finally {
            setIsSubmitting(false)
        }
    }

    const isValid = recipientEmail.includes('@') &&
                   (!requiresWitness || witnessEmail.includes('@'))

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Transfer Ownership</DialogTitle>
                    <DialogDescription>
                        Transfer &ldquo;{artworkTitle}&rdquo; to another person. They will need to confirm the transfer.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="recipientEmail">Recipient Email</Label>
                        <Input
                            id="recipientEmail"
                            type="email"
                            placeholder="recipient@example.com"
                            value={recipientEmail}
                            onChange={(e) => setRecipientEmail(e.target.value)}
                            required
                        />
                        <p className="text-xs text-muted-foreground">
                            The new owner will receive an email to confirm the transfer.
                        </p>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="transferNotes">Notes (Optional)</Label>
                        <Textarea
                            id="transferNotes"
                            placeholder="Add any notes about this transfer..."
                            value={transferNotes}
                            onChange={(e) => setTransferNotes(e.target.value)}
                            rows={3}
                        />
                    </div>

                    <div className="space-y-3 border-t pt-4">
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="requiresWitness"
                                checked={requiresWitness}
                                onCheckedChange={(checked) => setRequiresWitness(checked === true)}
                            />
                            <Label htmlFor="requiresWitness" className="text-sm font-normal cursor-pointer">
                                <span className="flex items-center gap-2">
                                    <UserPlus className="h-4 w-4" />
                                    Require a third-party witness
                                </span>
                            </Label>
                        </div>

                        {requiresWitness && (
                            <div className="space-y-2 pl-6">
                                <Label htmlFor="witnessEmail">Witness Email</Label>
                                <Input
                                    id="witnessEmail"
                                    type="email"
                                    placeholder="witness@example.com"
                                    value={witnessEmail}
                                    onChange={(e) => setWitnessEmail(e.target.value)}
                                    required={requiresWitness}
                                />
                                <p className="text-xs text-muted-foreground">
                                    The witness must also confirm the transfer before it completes.
                                </p>
                            </div>
                        )}
                    </div>

                    {error && (
                        <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
                            {error}
                        </div>
                    )}

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={!isValid || isSubmitting}>
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Sending...
                                </>
                            ) : (
                                <>
                                    <Send className="mr-2 h-4 w-4" />
                                    Initiate Transfer
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
