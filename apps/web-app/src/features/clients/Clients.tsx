'use client'

import React, { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { Search, Filter, Plus, User, ChevronDown, X } from 'lucide-react'
import {
    Button,
    Card,
    CardContent,
    Badge,
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@aetherlabs/ui'
import { useAuth } from '@/src/components/auth-provider'
import { ClientService } from '@/src/services/client-service'
import { Client } from '@/src/types/database'
import type { ClientType } from '@/src/types/database'
import { ClientForm, type ClientFormData } from './ClientForm'
import { ClientGridSkeleton, StatsGridSkeleton } from '@/src/components/skeletons'
import { EmptyClients, EmptyClientSearchResults } from '@/src/components/empty-states'
import { DataError } from '@/src/components/error-states'
import { Users, Receipt, FileText } from 'lucide-react'

type FilterType = ClientType | 'all'

const CLIENT_TYPES: FilterType[] = ['all', 'collector', 'buyer', 'gallery', 'dealer', 'institution', 'other']

const typeLabel = (t: string) => (t === 'all' ? 'All Types' : t.charAt(0).toUpperCase() + t.slice(1))

export default function Clients() {
    const { user } = useAuth()
    const [clients, setClients] = useState<Client[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [searchQuery, setSearchQuery] = useState('')
    const [filterType, setFilterType] = useState<FilterType>('all')
    const [addDialogOpen, setAddDialogOpen] = useState(false)

    const loadClients = async () => {
        if (!user) return
        try {
            setLoading(true)
            setError(null)
            const filters = {
                search: searchQuery || undefined,
                type: filterType === 'all' ? undefined : filterType,
            }
            const data = await ClientService.getClients(filters)
            setClients(data)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load clients')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadClients()
    }, [user, searchQuery, filterType])

    const hasActiveFilters = filterType !== 'all' || !!searchQuery

    const clearFilters = () => {
        setFilterType('all')
        setSearchQuery('')
    }

    const handleAddClient = async (data: ClientFormData) => {
        await ClientService.createClient({
            name: data.name,
            email: data.email || null,
            phone: data.phone || null,
            company: data.company || null,
            type: (data.type as ClientType) || null,
            notes: data.notes || null,
        })
        await loadClients()
    }

    const stats = [
        { label: 'Total Clients', value: clients.length, icon: Users },
        { label: 'Collectors', value: clients.filter(c => c.type === 'collector').length, icon: User },
        { label: 'Galleries', value: clients.filter(c => c.type === 'gallery').length, icon: Receipt },
        { label: 'Buyers', value: clients.filter(c => c.type === 'buyer').length, icon: FileText },
    ]

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Clients</h1>
                    <p className="text-muted-foreground mt-1">Manage your client list and relationships</p>
                </div>
                <Button
                    onClick={() => setAddDialogOpen(true)}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Client
                </Button>
            </div>

            {loading ? (
                <StatsGridSkeleton />
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map(stat => (
                        <div
                            key={stat.label}
                            className="rounded-lg border border-border p-6 hover:border-accent/30 transition-colors"
                        >
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-primary/10 rounded-lg">
                                    <stat.icon className="w-6 h-6 text-primary" />
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <div className="flex gap-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search by name, email, or company..."
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
                    />
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery('')}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    )}
                </div>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="outline"
                            className={`flex items-center gap-2 ${hasActiveFilters ? 'border-accent text-accent' : ''}`}
                        >
                            <Filter className="w-5 h-5" />
                            {typeLabel(filterType)}
                            {hasActiveFilters && (
                                <Badge className="ml-1 bg-accent text-accent-foreground text-xs">
                                    {[filterType !== 'all', !!searchQuery].filter(Boolean).length}
                                </Badge>
                            )}
                            <ChevronDown className="w-4 h-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuLabel>Client Type</DropdownMenuLabel>
                        {CLIENT_TYPES.map(t => (
                            <DropdownMenuItem
                                key={t}
                                onClick={() => setFilterType(t)}
                                className={filterType === t ? 'bg-primary/10' : ''}
                            >
                                {typeLabel(t)}
                            </DropdownMenuItem>
                        ))}
                        {hasActiveFilters && (
                            <>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={clearFilters} className="text-destructive">
                                    Clear Filters
                                </DropdownMenuItem>
                            </>
                        )}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {error && !loading && (
                <DataError title="Failed to load clients" error={error} onRetry={loadClients} />
            )}

            {!loading && !error && clients.length === 0 && !hasActiveFilters && (
                <EmptyClients onAddClient={() => setAddDialogOpen(true)} />
            )}

            {!loading && !error && clients.length === 0 && hasActiveFilters && (
                <EmptyClientSearchResults searchQuery={searchQuery || 'your filters'} onClearSearch={clearFilters} />
            )}

            {loading && <ClientGridSkeleton count={6} />}

            {!loading && !error && clients.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {clients.map(client => (
                        <Link key={client.id} href={`/clients/${client.id}`}>
                            <Card className="border border-border bg-card overflow-hidden hover:shadow-lg hover:border-accent/20 transition-all h-full">
                                <CardContent className="p-5">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center shrink-0">
                                            <User className="w-5 h-5 text-muted-foreground" />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <h3 className="font-semibold text-lg text-foreground truncate">
                                                {client.name}
                                            </h3>
                                            {client.email && (
                                                <p className="text-sm text-muted-foreground truncate">
                                                    {client.email}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    {client.company && (
                                        <p className="text-sm text-muted-foreground mb-2 truncate">
                                            {client.company}
                                        </p>
                                    )}
                                    <div className="flex justify-between items-center">
                                        {client.type && (
                                            <Badge variant="outline" className="text-xs border-border">
                                                {client.type}
                                            </Badge>
                                        )}
                                        <span className="text-xs text-muted-foreground">
                                            Added {new Date(client.created_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
            )}

            <ClientForm
                open={addDialogOpen}
                onOpenChange={setAddDialogOpen}
                onSubmit={handleAddClient}
            />
        </div>
    )
}
