'use client'

import { useState, useEffect } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@aetherlabs/ui/primitives'
import { ArrowDownLeft, ArrowUpRight, Loader2, Inbox } from 'lucide-react'
import { TransferService } from '@/src/services/transfer-service'
import { OwnershipTransferWithDetails } from '@/src/types/database'
import { TransferStatusCard } from './TransferStatusCard'
import { createClient } from '@/src/lib/supabase'
import { motion, AnimatePresence } from 'framer-motion'
import type { User } from '@supabase/supabase-js'

const supabase = createClient()

export function PendingTransfers() {
    const [user, setUser] = useState<User | null>(null)
    const [activeTab, setActiveTab] = useState('incoming')
    const [incomingTransfers, setIncomingTransfers] = useState<OwnershipTransferWithDetails[]>([])
    const [outgoingTransfers, setOutgoingTransfers] = useState<OwnershipTransferWithDetails[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            setUser(user)
        }
        getUser()
    }, [])

    useEffect(() => {
        if (user) {
            loadTransfers()
        }
    }, [user])

    const loadTransfers = async () => {
        if (!user) return
        setIsLoading(true)
        try {
            const [incoming, outgoing] = await Promise.all([
                TransferService.getIncomingTransfers(),
                TransferService.getOutgoingTransfers(),
            ])
            setIncomingTransfers(incoming)
            setOutgoingTransfers(outgoing)
        } catch (error) {
            console.error('Failed to load transfers:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleConfirm = async (transferId: string, role: 'recipient' | 'witness') => {
        try {
            await TransferService.confirmTransfer(transferId, role)
            loadTransfers()
        } catch (error) {
            console.error('Failed to confirm transfer:', error)
        }
    }

    const handleReject = async (transferId: string) => {
        try {
            await TransferService.rejectTransfer(transferId)
            loadTransfers()
        } catch (error) {
            console.error('Failed to reject transfer:', error)
        }
    }

    const handleCancel = async (transferId: string) => {
        try {
            await TransferService.cancelTransfer(transferId)
            loadTransfers()
        } catch (error) {
            console.error('Failed to cancel transfer:', error)
        }
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        )
    }

    const pendingIncoming = incomingTransfers.filter(t => !['completed', 'cancelled', 'rejected'].includes(t.status))
    const pendingOutgoing = outgoingTransfers.filter(t => !['completed', 'cancelled', 'rejected'].includes(t.status))
    const completedTransfers = [...incomingTransfers, ...outgoingTransfers].filter(t =>
        ['completed', 'cancelled', 'rejected'].includes(t.status)
    )

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-semibold tracking-tight">Ownership Transfers</h1>
                <p className="text-muted-foreground">
                    Manage artwork ownership transfers and verify incoming requests.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-blue-700">
                        <ArrowDownLeft className="h-5 w-5" />
                        <span className="font-medium">Incoming</span>
                    </div>
                    <p className="text-2xl font-bold text-blue-900 mt-1">{pendingIncoming.length}</p>
                    <p className="text-sm text-blue-600">pending transfers</p>
                </div>
                <div className="bg-orange-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-orange-700">
                        <ArrowUpRight className="h-5 w-5" />
                        <span className="font-medium">Outgoing</span>
                    </div>
                    <p className="text-2xl font-bold text-orange-900 mt-1">{pendingOutgoing.length}</p>
                    <p className="text-sm text-orange-600">awaiting confirmation</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-gray-700">
                        <Inbox className="h-5 w-5" />
                        <span className="font-medium">History</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{completedTransfers.length}</p>
                    <p className="text-sm text-gray-600">completed transfers</p>
                </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList>
                    <TabsTrigger value="incoming" className="gap-2">
                        <ArrowDownLeft className="h-4 w-4" />
                        Incoming
                        {pendingIncoming.length > 0 && (
                            <span className="ml-1 bg-blue-600 text-white text-xs px-1.5 py-0.5 rounded-full">
                                {pendingIncoming.length}
                            </span>
                        )}
                    </TabsTrigger>
                    <TabsTrigger value="outgoing" className="gap-2">
                        <ArrowUpRight className="h-4 w-4" />
                        Outgoing
                        {pendingOutgoing.length > 0 && (
                            <span className="ml-1 bg-orange-600 text-white text-xs px-1.5 py-0.5 rounded-full">
                                {pendingOutgoing.length}
                            </span>
                        )}
                    </TabsTrigger>
                    <TabsTrigger value="history">History</TabsTrigger>
                </TabsList>

                <TabsContent value="incoming" className="mt-6">
                    <AnimatePresence mode="wait">
                        {pendingIncoming.length === 0 ? (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-center py-12 text-muted-foreground"
                            >
                                <ArrowDownLeft className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                <p>No incoming transfer requests</p>
                            </motion.div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="grid gap-4"
                            >
                                {pendingIncoming.map((transfer) => (
                                    <TransferStatusCard
                                        key={transfer.id}
                                        transfer={transfer}
                                        currentUserId={user?.id || ''}
                                        onConfirm={() => handleConfirm(transfer.id, 'recipient')}
                                        onReject={() => handleReject(transfer.id)}
                                    />
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </TabsContent>

                <TabsContent value="outgoing" className="mt-6">
                    <AnimatePresence mode="wait">
                        {pendingOutgoing.length === 0 ? (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-center py-12 text-muted-foreground"
                            >
                                <ArrowUpRight className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                <p>No outgoing transfers</p>
                                <p className="text-sm mt-1">
                                    Go to an artwork and click &ldquo;Transfer Ownership&rdquo; to start.
                                </p>
                            </motion.div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="grid gap-4"
                            >
                                {pendingOutgoing.map((transfer) => (
                                    <TransferStatusCard
                                        key={transfer.id}
                                        transfer={transfer}
                                        currentUserId={user?.id || ''}
                                        onCancel={() => handleCancel(transfer.id)}
                                    />
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </TabsContent>

                <TabsContent value="history" className="mt-6">
                    <AnimatePresence mode="wait">
                        {completedTransfers.length === 0 ? (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-center py-12 text-muted-foreground"
                            >
                                <Inbox className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                <p>No transfer history yet</p>
                            </motion.div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="grid gap-4"
                            >
                                {completedTransfers.map((transfer) => (
                                    <TransferStatusCard
                                        key={transfer.id}
                                        transfer={transfer}
                                        currentUserId={user?.id || ''}
                                    />
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </TabsContent>
            </Tabs>
        </div>
    )
}
