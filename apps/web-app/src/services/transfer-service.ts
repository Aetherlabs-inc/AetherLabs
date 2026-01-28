import { createClient } from '@/src/lib/supabase'
import {
    OwnershipTransfer,
    OwnershipTransferInsert,
    OwnershipTransferWithDetails,
    TransferStatus
} from '@/src/types/database'

const supabase = createClient()

export class TransferService {
    // Initiate a new ownership transfer
    static async initiateTransfer(data: OwnershipTransferInsert): Promise<OwnershipTransfer> {
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            throw new Error('User not authenticated')
        }

        // Verify artwork belongs to user
        const { data: artwork } = await supabase
            .from('artworks')
            .select('id, title')
            .eq('id', data.artwork_id)
            .eq('user_id', user.id)
            .single()

        if (!artwork) {
            throw new Error('Artwork not found or you do not own this artwork')
        }

        // Check if there's already a pending transfer for this artwork
        const { data: existingTransfer } = await supabase
            .from('ownership_transfers')
            .select('id')
            .eq('artwork_id', data.artwork_id)
            .in('status', ['pending', 'awaiting_recipient', 'recipient_confirmed', 'witness_required'])
            .single()

        if (existingTransfer) {
            throw new Error('There is already a pending transfer for this artwork')
        }

        // Check if recipient exists
        const { data: recipient } = await supabase
            .from('user_profiles')
            .select('id')
            .eq('email', data.to_email)
            .single()

        const { data: transfer, error } = await supabase
            .from('ownership_transfers')
            .insert({
                artwork_id: data.artwork_id,
                from_user_id: user.id,
                to_user_id: recipient?.id || null,
                to_email: data.to_email,
                requires_witness: data.requires_witness || false,
                witness_email: data.witness_email || null,
                transfer_notes: data.transfer_notes || null,
                status: 'pending',
                from_confirmed_at: new Date().toISOString()
            })
            .select()
            .single()

        if (error) {
            throw new Error(`Failed to initiate transfer: ${error.message}`)
        }

        return transfer
    }

    // Get transfers for current user (both incoming and outgoing)
    static async getMyTransfers(): Promise<{
        outgoing: OwnershipTransferWithDetails[]
        incoming: OwnershipTransferWithDetails[]
    }> {
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            throw new Error('User not authenticated')
        }

        // Get user's email for incoming transfers
        const { data: profile } = await supabase
            .from('user_profiles')
            .select('email')
            .eq('id', user.id)
            .single()

        // Outgoing transfers
        const { data: outgoing, error: outError } = await supabase
            .from('ownership_transfers')
            .select(`
                *,
                artworks (*),
                from_user:user_profiles!ownership_transfers_from_user_id_fkey (*),
                to_user:user_profiles!ownership_transfers_to_user_id_fkey (*)
            `)
            .eq('from_user_id', user.id)
            .order('created_at', { ascending: false })

        if (outError) {
            throw new Error(`Failed to fetch outgoing transfers: ${outError.message}`)
        }

        // Incoming transfers (by email or user_id)
        let incomingQuery = supabase
            .from('ownership_transfers')
            .select(`
                *,
                artworks (*),
                from_user:user_profiles!ownership_transfers_from_user_id_fkey (*),
                to_user:user_profiles!ownership_transfers_to_user_id_fkey (*)
            `)
            .order('created_at', { ascending: false })

        if (profile?.email) {
            incomingQuery = incomingQuery.or(`to_user_id.eq.${user.id},to_email.eq.${profile.email}`)
        } else {
            incomingQuery = incomingQuery.eq('to_user_id', user.id)
        }

        const { data: incoming, error: inError } = await incomingQuery

        if (inError) {
            throw new Error(`Failed to fetch incoming transfers: ${inError.message}`)
        }

        return {
            outgoing: (outgoing || []) as OwnershipTransferWithDetails[],
            incoming: (incoming || []).filter(t => t.from_user_id !== user.id) as OwnershipTransferWithDetails[]
        }
    }

    // Get pending transfers that need user's action
    static async getPendingTransfers(): Promise<OwnershipTransferWithDetails[]> {
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            throw new Error('User not authenticated')
        }

        const { data: profile } = await supabase
            .from('user_profiles')
            .select('email')
            .eq('id', user.id)
            .single()

        const { data, error } = await supabase
            .from('ownership_transfers')
            .select(`
                *,
                artworks (*),
                from_user:user_profiles!ownership_transfers_from_user_id_fkey (*),
                to_user:user_profiles!ownership_transfers_to_user_id_fkey (*)
            `)
            .or(`to_user_id.eq.${user.id},to_email.eq.${profile?.email || ''},witness_email.eq.${profile?.email || ''}`)
            .in('status', ['pending', 'awaiting_recipient', 'recipient_confirmed', 'witness_required'])
            .order('created_at', { ascending: false })

        if (error) {
            throw new Error(`Failed to fetch pending transfers: ${error.message}`)
        }

        return (data || []) as OwnershipTransferWithDetails[]
    }

    // Confirm transfer (as sender, recipient, or witness)
    static async confirmTransfer(transferId: string, role: 'sender' | 'recipient' | 'witness'): Promise<OwnershipTransfer> {
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            throw new Error('User not authenticated')
        }

        // Get current transfer state
        const { data: transfer, error: fetchError } = await supabase
            .from('ownership_transfers')
            .select('*')
            .eq('id', transferId)
            .single()

        if (fetchError || !transfer) {
            throw new Error('Transfer not found')
        }

        const { data: profile } = await supabase
            .from('user_profiles')
            .select('email')
            .eq('id', user.id)
            .single()

        // Validate user can perform this action
        if (role === 'sender' && transfer.from_user_id !== user.id) {
            throw new Error('You are not the sender of this transfer')
        }

        if (role === 'recipient') {
            const isRecipient = transfer.to_user_id === user.id ||
                transfer.to_email === profile?.email
            if (!isRecipient) {
                throw new Error('You are not the recipient of this transfer')
            }
        }

        if (role === 'witness' && transfer.witness_email !== profile?.email) {
            throw new Error('You are not the witness of this transfer')
        }

        // Update based on role
        const updates: Partial<OwnershipTransfer> = {}

        if (role === 'sender') {
            updates.from_confirmed_at = new Date().toISOString()
        } else if (role === 'recipient') {
            updates.to_confirmed_at = new Date().toISOString()
            updates.to_user_id = user.id
        } else if (role === 'witness') {
            updates.witness_confirmed_at = new Date().toISOString()
        }

        // Determine new status
        const newFromConfirmed = role === 'sender' ? true : !!transfer.from_confirmed_at
        const newToConfirmed = role === 'recipient' ? true : !!transfer.to_confirmed_at
        const newWitnessConfirmed = role === 'witness' ? true : !!transfer.witness_confirmed_at

        if (newFromConfirmed && newToConfirmed) {
            if (transfer.requires_witness && !newWitnessConfirmed) {
                updates.status = 'witness_required'
            } else {
                updates.status = 'completed'
                updates.completed_at = new Date().toISOString()
            }
        } else if (newToConfirmed) {
            updates.status = 'recipient_confirmed'
        } else {
            updates.status = 'awaiting_recipient'
        }

        const { data: updatedTransfer, error: updateError } = await supabase
            .from('ownership_transfers')
            .update(updates)
            .eq('id', transferId)
            .select()
            .single()

        if (updateError) {
            throw new Error(`Failed to confirm transfer: ${updateError.message}`)
        }

        // If completed, transfer the artwork ownership
        if (updates.status === 'completed') {
            await this.executeTransfer(updatedTransfer)
        }

        return updatedTransfer
    }

    // Cancel a transfer (sender only)
    static async cancelTransfer(transferId: string): Promise<void> {
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            throw new Error('User not authenticated')
        }

        const { data: transfer } = await supabase
            .from('ownership_transfers')
            .select('from_user_id, status')
            .eq('id', transferId)
            .single()

        if (!transfer || transfer.from_user_id !== user.id) {
            throw new Error('Transfer not found or you cannot cancel this transfer')
        }

        if (transfer.status === 'completed') {
            throw new Error('Cannot cancel a completed transfer')
        }

        const { error } = await supabase
            .from('ownership_transfers')
            .update({ status: 'cancelled' })
            .eq('id', transferId)

        if (error) {
            throw new Error(`Failed to cancel transfer: ${error.message}`)
        }
    }

    // Reject a transfer (recipient only)
    static async rejectTransfer(transferId: string): Promise<void> {
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            throw new Error('User not authenticated')
        }

        const { data: profile } = await supabase
            .from('user_profiles')
            .select('email')
            .eq('id', user.id)
            .single()

        const { data: transfer } = await supabase
            .from('ownership_transfers')
            .select('to_user_id, to_email, status')
            .eq('id', transferId)
            .single()

        if (!transfer) {
            throw new Error('Transfer not found')
        }

        const isRecipient = transfer.to_user_id === user.id ||
            transfer.to_email === profile?.email

        if (!isRecipient) {
            throw new Error('You are not the recipient of this transfer')
        }

        if (transfer.status === 'completed') {
            throw new Error('Cannot reject a completed transfer')
        }

        const { error } = await supabase
            .from('ownership_transfers')
            .update({ status: 'rejected' })
            .eq('id', transferId)

        if (error) {
            throw new Error(`Failed to reject transfer: ${error.message}`)
        }
    }

    // Get incoming transfers for current user
    static async getIncomingTransfers(): Promise<OwnershipTransferWithDetails[]> {
        const { outgoing, incoming } = await this.getMyTransfers()
        return incoming
    }

    // Get outgoing transfers for current user
    static async getOutgoingTransfers(): Promise<OwnershipTransferWithDetails[]> {
        const { outgoing, incoming } = await this.getMyTransfers()
        return outgoing
    }

    // Get transfer history for an artwork
    static async getArtworkTransfers(artworkId: string): Promise<OwnershipTransfer[]> {
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            throw new Error('User not authenticated')
        }

        const { data, error } = await supabase
            .from('ownership_transfers')
            .select('*')
            .eq('artwork_id', artworkId)
            .order('created_at', { ascending: false })

        if (error) {
            throw new Error(`Failed to fetch transfer history: ${error.message}`)
        }

        return data || []
    }

    // Execute the actual ownership transfer
    private static async executeTransfer(transfer: OwnershipTransfer): Promise<void> {
        if (!transfer.to_user_id) {
            throw new Error('Recipient user ID is required to complete transfer')
        }

        // Update artwork ownership
        const { error: artworkError } = await supabase
            .from('artworks')
            .update({ user_id: transfer.to_user_id })
            .eq('id', transfer.artwork_id)

        if (artworkError) {
            throw new Error(`Failed to transfer artwork ownership: ${artworkError.message}`)
        }

        // Create provenance record
        const { data: fromUser } = await supabase
            .from('user_profiles')
            .select('full_name, email')
            .eq('id', transfer.from_user_id)
            .single()

        const { data: toUser } = await supabase
            .from('user_profiles')
            .select('full_name, email')
            .eq('id', transfer.to_user_id)
            .single()

        // Add provenance record for the transfer
        await supabase
            .from('provenance_records')
            .insert({
                artwork_id: transfer.artwork_id,
                owner_name: toUser?.full_name || toUser?.email || 'New Owner',
                owner_type: 'collector',
                acquisition_method: 'transfer',
                acquisition_date: new Date().toISOString().split('T')[0],
                notes: `Transferred from ${fromUser?.full_name || fromUser?.email || 'Previous Owner'}${transfer.transfer_notes ? `. Notes: ${transfer.transfer_notes}` : ''}`,
                verified: true
            })
    }
}
