'use client'

import { OwnershipTransferWithDetails } from '@/src/types/database'
import { Card, CardContent, CardHeader, CardTitle, Badge, Button } from '@aetherlabs/ui/primitives'
import { Clock, CheckCircle2, XCircle, AlertCircle, Eye, ArrowRight } from 'lucide-react'
import { format } from 'date-fns'

interface TransferStatusCardProps {
    transfer: OwnershipTransferWithDetails
    currentUserId: string
    onConfirm?: () => void
    onReject?: () => void
    onCancel?: () => void
}

const statusConfig: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
    pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-800', icon: <Clock className="h-4 w-4" /> },
    awaiting_recipient: { label: 'Awaiting Recipient', color: 'bg-blue-100 text-blue-800', icon: <Clock className="h-4 w-4" /> },
    recipient_confirmed: { label: 'Recipient Confirmed', color: 'bg-green-100 text-green-800', icon: <CheckCircle2 className="h-4 w-4" /> },
    witness_required: { label: 'Awaiting Witness', color: 'bg-purple-100 text-purple-800', icon: <Eye className="h-4 w-4" /> },
    completed: { label: 'Completed', color: 'bg-green-100 text-green-800', icon: <CheckCircle2 className="h-4 w-4" /> },
    cancelled: { label: 'Cancelled', color: 'bg-gray-100 text-gray-800', icon: <XCircle className="h-4 w-4" /> },
    rejected: { label: 'Rejected', color: 'bg-red-100 text-red-800', icon: <AlertCircle className="h-4 w-4" /> },
}

export function TransferStatusCard({ transfer, currentUserId, onConfirm, onReject, onCancel }: TransferStatusCardProps) {
    const status = statusConfig[transfer.status] || statusConfig.pending
    const isFromUser = transfer.from_user_id === currentUserId
    const isToUser = transfer.to_user_id === currentUserId
    const canConfirm = (isToUser && transfer.status === 'awaiting_recipient') ||
                       (transfer.status === 'witness_required' && transfer.witness_email)
    const canCancel = isFromUser && ['pending', 'awaiting_recipient'].includes(transfer.status)
    const canReject = isToUser && transfer.status === 'awaiting_recipient'

    return (
        <Card className="overflow-hidden">
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                        {transfer.artwork?.image_url && (
                            <div className="h-12 w-12 rounded-md overflow-hidden bg-muted flex-shrink-0">
                                <img
                                    src={transfer.artwork.image_url}
                                    alt={transfer.artwork.title}
                                    className="h-full w-full object-cover"
                                />
                            </div>
                        )}
                        <div>
                            <CardTitle className="text-base">
                                {transfer.artwork?.title || 'Unknown Artwork'}
                            </CardTitle>
                            <p className="text-sm text-muted-foreground">
                                {format(new Date(transfer.created_at), 'MMM d, yyyy')}
                            </p>
                        </div>
                    </div>
                    <Badge className={status.color}>
                        <span className="flex items-center gap-1">
                            {status.icon}
                            {status.label}
                        </span>
                    </Badge>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center gap-2 text-sm">
                    <div className="flex-1">
                        <p className="text-muted-foreground">From</p>
                        <p className="font-medium">{transfer.from_user?.full_name || transfer.from_user?.email || 'Unknown'}</p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    <div className="flex-1 text-right">
                        <p className="text-muted-foreground">To</p>
                        <p className="font-medium">{transfer.to_user?.full_name || transfer.to_user?.email || transfer.to_email}</p>
                    </div>
                </div>

                {transfer.requires_witness && (
                    <div className="text-sm border-t pt-3">
                        <p className="text-muted-foreground">Witness</p>
                        <div className="flex items-center gap-2">
                            <p className="font-medium">{transfer.witness_email}</p>
                            {transfer.witness_confirmed_at && (
                                <Badge variant="outline" className="text-green-600">
                                    <CheckCircle2 className="h-3 w-3 mr-1" />
                                    Confirmed
                                </Badge>
                            )}
                        </div>
                    </div>
                )}

                {transfer.transfer_notes && (
                    <div className="text-sm border-t pt-3">
                        <p className="text-muted-foreground">Notes</p>
                        <p>{transfer.transfer_notes}</p>
                    </div>
                )}

                <div className="flex items-center gap-2 pt-2 border-t">
                    <div className="flex-1 text-xs text-muted-foreground">
                        {transfer.from_confirmed_at && (
                            <span className="flex items-center gap-1">
                                <CheckCircle2 className="h-3 w-3 text-green-600" />
                                Sender confirmed
                            </span>
                        )}
                    </div>
                    <div className="flex-1 text-xs text-muted-foreground text-right">
                        {transfer.to_confirmed_at && (
                            <span className="flex items-center gap-1 justify-end">
                                <CheckCircle2 className="h-3 w-3 text-green-600" />
                                Recipient confirmed
                            </span>
                        )}
                    </div>
                </div>

                {(canConfirm || canCancel || canReject) && (
                    <div className="flex items-center gap-2 pt-2">
                        {canConfirm && onConfirm && (
                            <Button onClick={onConfirm} className="flex-1">
                                Confirm Transfer
                            </Button>
                        )}
                        {canReject && onReject && (
                            <Button variant="outline" onClick={onReject} className="flex-1">
                                Reject
                            </Button>
                        )}
                        {canCancel && onCancel && (
                            <Button variant="outline" onClick={onCancel} className="flex-1">
                                Cancel Transfer
                            </Button>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
