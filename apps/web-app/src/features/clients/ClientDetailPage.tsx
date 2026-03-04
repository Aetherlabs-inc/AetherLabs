'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import {
    ArrowLeft,
    User,
    Mail,
    Phone,
    Pencil,
    Trash2,
    Receipt,
    FileText,
    Plus,
} from 'lucide-react'
import {
    Button,
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    Badge,
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
    Skeleton,
} from '@aetherlabs/ui'
import { ClientService, type ClientWithCounts } from '@/src/services/client-service'
import { TransactionService, type TransactionWithDetails } from '@/src/services/transaction-service'
import { QuotationService, type QuotationWithDetails } from '@/src/services/quotation-service'
import { ClientForm, type ClientFormData } from './ClientForm'
import { TransactionForm } from './TransactionForm'
import { QuotationForm } from './QuotationForm'
import type { ClientType } from '@/src/types/database'

type Tab = 'overview' | 'transactions' | 'quotations'

interface ClientDetailPageProps {
    clientId: string
}

const typeLabel = (t: string) => t.charAt(0).toUpperCase() + t.slice(1)
const txTypeLabel = (t: string) => t.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())

function formatAmount(amount: number | null, currency: string) {
    if (amount == null) return '—'
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency || 'USD',
    }).format(amount)
}

function formatDate(date: string | null) {
    if (!date) return '—'
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    })
}

export default function ClientDetailPage({ clientId }: ClientDetailPageProps) {
    const router = useRouter()
    const [client, setClient] = useState<ClientWithCounts | null>(null)
    const [transactions, setTransactions] = useState<TransactionWithDetails[]>([])
    const [quotations, setQuotations] = useState<QuotationWithDetails[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [tab, setTab] = useState<Tab>('overview')
    const [editOpen, setEditOpen] = useState(false)
    const [addTxOpen, setAddTxOpen] = useState(false)
    const [addQuotOpen, setAddQuotOpen] = useState(false)

    const fetchClient = useCallback(async () => {
        try {
            const data = await ClientService.getClient(clientId)
            setClient(data)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load client')
        }
    }, [clientId])

    const fetchTransactions = useCallback(async () => {
        try {
            const data = await TransactionService.getTransactions({ client_id: clientId })
            setTransactions(data)
        } catch {
            setTransactions([])
        }
    }, [clientId])

    const fetchQuotations = useCallback(async () => {
        try {
            const data = await QuotationService.getQuotations({ client_id: clientId })
            setQuotations(data)
        } catch {
            setQuotations([])
        }
    }, [clientId])

    useEffect(() => {
        const load = async () => {
            setLoading(true)
            setError(null)
            await Promise.all([fetchClient(), fetchTransactions(), fetchQuotations()])
            setLoading(false)
        }
        load()
    }, [fetchClient, fetchTransactions, fetchQuotations])

    const handleEditClient = async (data: ClientFormData) => {
        if (!client) return
        await ClientService.updateClient(client.id, {
            name: data.name,
            email: data.email || null,
            phone: data.phone || null,
            company: data.company || null,
            type: (data.type as ClientType) || null,
            notes: data.notes || null,
        })
        await fetchClient()
        setEditOpen(false)
    }

    const handleDeleteClient = async () => {
        if (!client) return
        await ClientService.deleteClient(client.id)
        router.push('/clients')
    }

    const handleTransactionCreated = async () => {
        await Promise.all([fetchClient(), fetchTransactions()])
        setAddTxOpen(false)
    }

    const handleQuotationCreated = async () => {
        await Promise.all([fetchClient(), fetchQuotations()])
        setAddQuotOpen(false)
    }

    if (loading && !client) {
        return (
            <div className="min-h-screen bg-background p-6">
                <div className="max-w-4xl mx-auto space-y-6">
                    <Skeleton className="h-8 w-48" />
                    <Skeleton className="h-24 w-full" />
                    <Skeleton className="h-64 w-full" />
                </div>
            </div>
        )
    }

    if (error || !client) {
        return (
            <div className="min-h-screen bg-background p-6">
                <div className="max-w-4xl mx-auto text-center py-16">
                    <p className="text-muted-foreground mb-4">{error || 'Client not found'}</p>
                    <Button variant="outline" onClick={() => router.push('/clients')}>
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Clients
                    </Button>
                </div>
            </div>
        )
    }

    const totalTxValue = transactions
        .filter(t => t.type === 'sale' && t.amount != null)
        .reduce((sum, t) => sum + (t.amount ?? 0), 0)

    return (
        <div className="min-h-screen bg-background p-6">
            <div className="max-w-4xl mx-auto space-y-6">
                <Button
                    variant="ghost"
                    className="flex items-center gap-2 text-foreground hover:text-muted-foreground"
                    onClick={() => router.push('/clients')}
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Clients
                </Button>

                <div className="flex items-start justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">{client.name}</h1>
                        {client.company && (
                            <p className="text-muted-foreground mt-1">{client.company}</p>
                        )}
                        {client.type && (
                            <Badge variant="outline" className="mt-2 border-border">
                                {typeLabel(client.type)}
                            </Badge>
                        )}
                    </div>
                    <div className="flex gap-2 shrink-0">
                        <Button variant="outline" size="sm" onClick={() => setEditOpen(true)}>
                            <Pencil className="h-4 w-4 mr-1" />
                            Edit
                        </Button>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="outline" size="sm" className="border-destructive text-destructive hover:bg-destructive/10">
                                    <Trash2 className="h-4 w-4 mr-1" />
                                    Delete
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Delete Client</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Are you sure you want to delete &quot;{client.name}&quot;? Transactions and quotations will remain but will no longer be linked to this client.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                        onClick={handleDeleteClient}
                                        className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                                    >
                                        Delete
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                </div>

                <Card className="border border-border">
                    <CardHeader>
                        <CardTitle className="text-foreground">Contact Info</CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-4 sm:grid-cols-2">
                        {client.email && (
                            <div className="flex items-center gap-3">
                                <Mail className="h-4 w-4 text-muted-foreground" />
                                <a href={`mailto:${client.email}`} className="text-foreground hover:underline">
                                    {client.email}
                                </a>
                            </div>
                        )}
                        {client.phone && (
                            <div className="flex items-center gap-3">
                                <Phone className="h-4 w-4 text-muted-foreground" />
                                <a href={`tel:${client.phone}`} className="text-foreground hover:underline">
                                    {client.phone}
                                </a>
                            </div>
                        )}
                        {client.notes && (
                            <div className="sm:col-span-2 flex items-start gap-3">
                                <User className="h-4 w-4 text-muted-foreground mt-0.5" />
                                <p className="text-muted-foreground text-sm">{client.notes}</p>
                            </div>
                        )}
                        {!client.email && !client.phone && !client.notes && (
                            <p className="text-muted-foreground text-sm sm:col-span-2">No contact details</p>
                        )}
                    </CardContent>
                </Card>

                <div className="flex gap-2 border-b border-border">
                    {(['overview', 'transactions', 'quotations'] as Tab[]).map(t => (
                        <button
                            key={t}
                            onClick={() => setTab(t)}
                            className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
                                tab === t
                                    ? 'border-primary text-foreground'
                                    : 'border-transparent text-muted-foreground hover:text-foreground'
                            }`}
                        >
                            {t.charAt(0).toUpperCase() + t.slice(1)}
                        </button>
                    ))}
                </div>

                {tab === 'overview' && (
                    <div className="grid gap-4 sm:grid-cols-2">
                        <Card className="border border-border">
                            <CardContent className="pt-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-muted-foreground">Transactions</p>
                                        <p className="text-2xl font-bold text-foreground">
                                            {client.transaction_count ?? transactions.length}
                                        </p>
                                    </div>
                                    <Receipt className="h-8 w-8 text-muted-foreground" />
                                </div>
                                {totalTxValue > 0 && (
                                    <p className="text-sm text-muted-foreground mt-2">
                                        Total sales: {formatAmount(totalTxValue, 'USD')}
                                    </p>
                                )}
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="mt-4"
                                    onClick={() => setAddTxOpen(true)}
                                >
                                    <Plus className="h-4 w-4 mr-1" />
                                    Add Transaction
                                </Button>
                            </CardContent>
                        </Card>
                        <Card className="border border-border">
                            <CardContent className="pt-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-muted-foreground">Quotations</p>
                                        <p className="text-2xl font-bold text-foreground">
                                            {client.quotation_count ?? quotations.length}
                                        </p>
                                    </div>
                                    <FileText className="h-8 w-8 text-muted-foreground" />
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="mt-4"
                                    onClick={() => setAddQuotOpen(true)}
                                >
                                    <Plus className="h-4 w-4 mr-1" />
                                    Add Quotation
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {tab === 'transactions' && (
                    <Card className="border border-border">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="text-foreground">Transactions</CardTitle>
                            <Button size="sm" onClick={() => setAddTxOpen(true)}>
                                <Plus className="h-4 w-4 mr-1" />
                                Add
                            </Button>
                        </CardHeader>
                        <CardContent>
                            {transactions.length === 0 ? (
                                <p className="text-muted-foreground text-sm">No transactions yet.</p>
                            ) : (
                                <div className="space-y-4">
                                    {transactions.map(tx => (
                                        <div
                                            key={tx.id}
                                            className="flex items-center justify-between py-3 border-b border-border last:border-0"
                                        >
                                            <div>
                                                <p className="font-medium text-foreground">
                                                    {(tx as { artworks?: { title: string } | null }).artworks?.title ?? 'No artwork'}
                                                </p>
                                                <p className="text-sm text-muted-foreground">
                                                    {txTypeLabel(tx.type)} • {formatDate(tx.date)}
                                                    {tx.invoice_number && ` • ${tx.invoice_number}`}
                                                </p>
                                            </div>
                                            <span className="font-medium text-foreground">
                                                {formatAmount(tx.amount, tx.currency)}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                )}

                {tab === 'quotations' && (
                    <Card className="border border-border">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="text-foreground">Quotations</CardTitle>
                            <Button size="sm" onClick={() => setAddQuotOpen(true)}>
                                <Plus className="h-4 w-4 mr-1" />
                                Add
                            </Button>
                        </CardHeader>
                        <CardContent>
                            {quotations.length === 0 ? (
                                <p className="text-muted-foreground text-sm">No quotations yet.</p>
                            ) : (
                                <div className="space-y-4">
                                    {quotations.map(q => (
                                        <div
                                            key={q.id}
                                            className="flex items-center justify-between py-3 border-b border-border last:border-0"
                                        >
                                            <div>
                                                <p className="font-medium text-foreground">
                                                    {(q as { artworks?: { title: string } | null }).artworks?.title ?? 'No artwork'}
                                                </p>
                                                <p className="text-sm text-muted-foreground">
                                                    {formatDate(q.valid_until)} • {q.status}
                                                    {q.quotation_number && ` • ${q.quotation_number}`}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Badge variant="outline" className="border-border">
                                                    {q.status}
                                                </Badge>
                                                <span className="font-medium text-foreground">
                                                    {formatAmount(q.amount, q.currency)}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                )}
            </div>

            <ClientForm
                open={editOpen}
                onOpenChange={setEditOpen}
                client={client}
                onSubmit={handleEditClient}
            />

            <TransactionForm
                open={addTxOpen}
                onOpenChange={setAddTxOpen}
                clientId={client.id}
                clientName={client.name}
                onSuccess={handleTransactionCreated}
            />

            <QuotationForm
                open={addQuotOpen}
                onOpenChange={setAddQuotOpen}
                clientId={client.id}
                clientName={client.name}
                onSuccess={handleQuotationCreated}
            />
        </div>
    )
}
