'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, Badge, Skeleton } from '@aetherlabs/ui'
import { FileText, Receipt } from 'lucide-react'
import { createClient } from '@/src/lib/supabase'
import type { Quotation, Transaction } from '@/src/types/database'

interface ArtworkLinkedDocumentsProps {
    artworkId: string
}

const supabase = createClient()

function formatAmount(amount: number | null, currency: string) {
    if (amount === null) return '—'
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency || 'USD',
    }).format(amount)
}

function formatDate(dateStr: string | null) {
    if (!dateStr) return null
    try {
        return new Date(dateStr).toLocaleDateString('en-US', {
            year: 'numeric', month: 'short', day: 'numeric',
        })
    } catch { return dateStr }
}

export function ArtworkLinkedDocuments({ artworkId }: ArtworkLinkedDocumentsProps) {
    const [quotations, setQuotations] = useState<Quotation[]>([])
    const [transactions, setTransactions] = useState<Transaction[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchLinkedDocuments() {
            try {
                // Fetch quotations linked via junction table
                const { data: quotationLinks } = await supabase
                    .from('quotation_artworks')
                    .select('quotation_id')
                    .eq('artwork_id', artworkId)

                if (quotationLinks && quotationLinks.length > 0) {
                    const quotationIds = quotationLinks.map((l) => l.quotation_id)
                    const { data: quotationData } = await supabase
                        .from('quotations')
                        .select('*')
                        .in('id', quotationIds)
                        .order('created_at', { ascending: false })

                    setQuotations(quotationData || [])
                }

                // Also check legacy single-link quotations
                const { data: legacyQuotations } = await supabase
                    .from('quotations')
                    .select('*')
                    .eq('artwork_id', artworkId)
                    .order('created_at', { ascending: false })

                if (legacyQuotations && legacyQuotations.length > 0) {
                    setQuotations((prev) => {
                        const existingIds = new Set(prev.map((q) => q.id))
                        const newOnes = legacyQuotations.filter((q) => !existingIds.has(q.id))
                        return [...prev, ...newOnes]
                    })
                }

                // Fetch transactions linked via junction table
                const { data: transactionLinks } = await supabase
                    .from('transaction_artworks')
                    .select('transaction_id')
                    .eq('artwork_id', artworkId)

                if (transactionLinks && transactionLinks.length > 0) {
                    const transactionIds = transactionLinks.map((l) => l.transaction_id)
                    const { data: transactionData } = await supabase
                        .from('transactions')
                        .select('*')
                        .in('id', transactionIds)
                        .order('created_at', { ascending: false })

                    setTransactions(transactionData || [])
                }

                // Also check legacy single-link transactions
                const { data: legacyTransactions } = await supabase
                    .from('transactions')
                    .select('*')
                    .eq('artwork_id', artworkId)
                    .order('created_at', { ascending: false })

                if (legacyTransactions && legacyTransactions.length > 0) {
                    setTransactions((prev) => {
                        const existingIds = new Set(prev.map((t) => t.id))
                        const newOnes = legacyTransactions.filter((t) => !existingIds.has(t.id))
                        return [...prev, ...newOnes]
                    })
                }
            } catch (err) {
                console.error('Failed to fetch linked documents:', err)
            } finally {
                setLoading(false)
            }
        }

        fetchLinkedDocuments()
    }, [artworkId])

    if (loading) {
        return (
            <Card className="border border-border bg-background">
                <CardHeader>
                    <CardTitle className="text-foreground">Linked Documents</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    <Skeleton className="h-16" />
                    <Skeleton className="h-16" />
                </CardContent>
            </Card>
        )
    }

    if (quotations.length === 0 && transactions.length === 0) {
        return null
    }

    return (
        <Card className="border border-border bg-background">
            <CardHeader>
                <CardTitle className="text-foreground">Linked Documents</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Quotations */}
                {quotations.length > 0 && (
                    <div>
                        <p className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-1.5">
                            <FileText className="w-3.5 h-3.5" />
                            Quotations ({quotations.length})
                        </p>
                        <div className="space-y-2">
                            {quotations.map((q) => (
                                <div
                                    key={q.id}
                                    className="flex items-center justify-between p-3 rounded-lg border border-border bg-muted/30"
                                >
                                    <div className="min-w-0">
                                        <p className="text-sm font-medium text-foreground truncate">
                                            {q.quotation_number ? `#${q.quotation_number}` : 'Quotation'}
                                        </p>
                                        <div className="flex items-center gap-2 mt-0.5">
                                            {q.valid_until && (
                                                <span className="text-xs text-muted-foreground">
                                                    Valid until {formatDate(q.valid_until)}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 shrink-0">
                                        <span className="text-sm font-medium text-foreground tabular-nums">
                                            {formatAmount(q.amount, q.currency)}
                                        </span>
                                        <Badge variant="outline" className="text-xs capitalize">
                                            {q.status}
                                        </Badge>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Transactions */}
                {transactions.length > 0 && (
                    <div>
                        <p className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-1.5">
                            <Receipt className="w-3.5 h-3.5" />
                            Transactions ({transactions.length})
                        </p>
                        <div className="space-y-2">
                            {transactions.map((t) => (
                                <div
                                    key={t.id}
                                    className="flex items-center justify-between p-3 rounded-lg border border-border bg-muted/30"
                                >
                                    <div className="min-w-0">
                                        <p className="text-sm font-medium text-foreground truncate">
                                            {t.invoice_number ? `#${t.invoice_number}` : 'Transaction'}
                                        </p>
                                        <div className="flex items-center gap-2 mt-0.5">
                                            <span className="text-xs text-muted-foreground capitalize">
                                                {t.type}
                                            </span>
                                            {t.date && (
                                                <span className="text-xs text-muted-foreground">
                                                    {formatDate(t.date)}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <span className="text-sm font-medium text-foreground tabular-nums shrink-0">
                                        {formatAmount(t.amount, t.currency)}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
