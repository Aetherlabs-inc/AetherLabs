'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Search, Plus, FolderOpen, Image, Lock, Globe, Link2, MoreHorizontal, Pencil, Trash2, Eye } from 'lucide-react'
import {
    Button,
    Card,
    CardContent,
    Input,
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator
} from '@aetherlabs/ui'
import { useAuth } from '@/src/components/auth-provider'
import { CollectionService } from '@/src/services/collection-service'
import { CollectionWithArtworks } from '@/src/types/database'
import CollectionForm from './CollectionForm'
import CollectionDetail from './CollectionDetail'

const Collections: React.FC = () => {
    const { user } = useAuth()
    const [collections, setCollections] = useState<CollectionWithArtworks[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [searchQuery, setSearchQuery] = useState('')

    // Modal states
    const [showCreateForm, setShowCreateForm] = useState(false)
    const [editingCollection, setEditingCollection] = useState<CollectionWithArtworks | null>(null)
    const [selectedCollection, setSelectedCollection] = useState<CollectionWithArtworks | null>(null)
    const [deletingCollection, setDeletingCollection] = useState<CollectionWithArtworks | null>(null)

    const loadCollections = async () => {
        if (!user) return

        try {
            setLoading(true)
            setError(null)
            const data = await CollectionService.getCollections()
            setCollections(data)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load collections')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadCollections()
    }, [user])

    const filteredCollections = useMemo(() => {
        if (!searchQuery) return collections
        const query = searchQuery.toLowerCase()
        return collections.filter(c =>
            c.name.toLowerCase().includes(query) ||
            c.description?.toLowerCase().includes(query)
        )
    }, [collections, searchQuery])

    const handleCreateCollection = async (data: { name: string; description?: string; visibility: 'public' | 'private' | 'unlisted' }) => {
        try {
            await CollectionService.createCollection(data)
            await loadCollections()
            setShowCreateForm(false)
        } catch (err) {
            throw err
        }
    }

    const handleUpdateCollection = async (data: { name: string; description?: string; visibility: 'public' | 'private' | 'unlisted' }) => {
        if (!editingCollection) return
        try {
            await CollectionService.updateCollection(editingCollection.id, data)
            await loadCollections()
            setEditingCollection(null)
        } catch (err) {
            throw err
        }
    }

    const handleDeleteCollection = async () => {
        if (!deletingCollection) return
        try {
            await CollectionService.deleteCollection(deletingCollection.id)
            await loadCollections()
            setDeletingCollection(null)
        } catch (err) {
            console.error('Failed to delete collection:', err)
        }
    }

    const stats = [
        {
            label: 'Total Collections',
            value: collections.length.toString(),
            icon: FolderOpen
        },
        {
            label: 'Total Artworks',
            value: collections.reduce((sum, c) => sum + (c.artworks_count || 0), 0).toString(),
            icon: Image
        },
        {
            label: 'Public',
            value: collections.filter(c => c.visibility === 'public').length.toString(),
            icon: Globe
        },
        {
            label: 'Private',
            value: collections.filter(c => c.visibility === 'private').length.toString(),
            icon: Lock
        }
    ]

    // Show collection detail view
    if (selectedCollection) {
        return (
            <CollectionDetail
                collectionId={selectedCollection.id}
                onBack={() => {
                    setSelectedCollection(null)
                    loadCollections()
                }}
            />
        )
    }

    return (
        <div className="w-full min-h-screen bg-background">
            <div className="mx-auto w-full px-4 py-6 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-foreground sm:text-3xl">Collections</h1>
                        <p className="text-muted-foreground mt-1">
                            Organize your artworks into curated collections
                        </p>
                    </div>
                    <Button
                        onClick={() => setShowCreateForm(true)}
                        className="bg-[#2A2121] hover:bg-[#2A2121]/90 text-white"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        New Collection
                    </Button>
                </div>

                {/* Stats */}
                {!loading && collections.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                        {stats.map((stat, index) => (
                            <motion.div
                                key={stat.label}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <Card className="border border-border">
                                    <CardContent className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                                                <stat.icon className="w-5 h-5 text-muted-foreground" />
                                            </div>
                                            <div>
                                                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                                                <p className="text-xs text-muted-foreground">{stat.label}</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                )}

                {/* Search */}
                {collections.length > 0 && (
                    <div className="mb-6">
                        <div className="relative max-w-md">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                                placeholder="Search collections..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                    </div>
                )}

                {/* Loading State */}
                {loading && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <Card key={i} className="border border-border animate-pulse">
                                <div className="aspect-[4/3] bg-muted" />
                                <CardContent className="p-4">
                                    <div className="h-5 w-32 bg-muted rounded mb-2" />
                                    <div className="h-4 w-48 bg-muted rounded" />
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}

                {/* Error State */}
                {error && (
                    <Card className="border-destructive bg-destructive/10">
                        <CardContent className="p-6 text-center">
                            <p className="text-destructive">{error}</p>
                            <Button variant="outline" onClick={loadCollections} className="mt-4">
                                Try Again
                            </Button>
                        </CardContent>
                    </Card>
                )}

                {/* Empty State */}
                {!loading && !error && collections.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <Card className="border-2 border-dashed border-[#BC8010]/30 bg-[#BC8010]/5">
                            <CardContent className="py-16">
                                <div className="text-center max-w-md mx-auto">
                                    <div className="w-20 h-20 rounded-full bg-[#BC8010]/10 flex items-center justify-center mx-auto mb-6">
                                        <FolderOpen className="w-10 h-10 text-[#BC8010]" strokeWidth={1.5} />
                                    </div>
                                    <h2 className="text-xl font-semibold text-foreground mb-2">
                                        No Collections Yet
                                    </h2>
                                    <p className="text-muted-foreground mb-6">
                                        Create your first collection to start organizing your artworks.
                                        Group related pieces, create series, or curate themed collections.
                                    </p>
                                    <Button
                                        onClick={() => setShowCreateForm(true)}
                                        className="bg-[#2A2121] hover:bg-[#2A2121]/90 text-white"
                                    >
                                        <Plus className="w-4 h-4 mr-2" />
                                        Create Your First Collection
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}

                {/* No Search Results */}
                {!loading && !error && collections.length > 0 && filteredCollections.length === 0 && (
                    <Card className="border border-border">
                        <CardContent className="py-12 text-center">
                            <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-foreground mb-2">No Results Found</h3>
                            <p className="text-muted-foreground mb-4">
                                No collections match &quot;{searchQuery}&quot;
                            </p>
                            <Button variant="outline" onClick={() => setSearchQuery('')}>
                                Clear Search
                            </Button>
                        </CardContent>
                    </Card>
                )}

                {/* Collections Grid */}
                {!loading && !error && filteredCollections.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredCollections.map((collection, index) => (
                            <motion.div
                                key={collection.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <Card
                                    className="border border-border hover:border-[#BC8010]/30 transition-colors cursor-pointer group overflow-hidden"
                                    onClick={() => setSelectedCollection(collection)}
                                >
                                    {/* Cover Image */}
                                    <div className="aspect-[4/3] bg-muted relative overflow-hidden">
                                        {collection.cover_image_url ? (
                                            <img
                                                src={collection.cover_image_url}
                                                alt={collection.name}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-muted to-muted/50">
                                                <FolderOpen className="w-12 h-12 text-muted-foreground/50" />
                                            </div>
                                        )}

                                        {/* Visibility Badge */}
                                        <div className="absolute top-3 left-3">
                                            {collection.visibility === 'public' ? (
                                                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-emerald-500/90 text-white">
                                                    <Globe className="w-3 h-3" />
                                                    Public
                                                </span>
                                            ) : collection.visibility === 'unlisted' ? (
                                                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-amber-500/90 text-white">
                                                    <Link2 className="w-3 h-3" />
                                                    Unlisted
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-gray-500/90 text-white">
                                                    <Lock className="w-3 h-3" />
                                                    Private
                                                </span>
                                            )}
                                        </div>

                                        {/* Actions Menu */}
                                        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                                                    <Button variant="secondary" size="icon" className="h-8 w-8 bg-white/90 hover:bg-white">
                                                        <MoreHorizontal className="w-4 h-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
                                                    <DropdownMenuItem onClick={() => setSelectedCollection(collection)}>
                                                        <Eye className="w-4 h-4 mr-2" />
                                                        View
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => setEditingCollection(collection)}>
                                                        <Pencil className="w-4 h-4 mr-2" />
                                                        Edit
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem
                                                        className="text-destructive"
                                                        onClick={() => setDeletingCollection(collection)}
                                                    >
                                                        <Trash2 className="w-4 h-4 mr-2" />
                                                        Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <CardContent className="p-4">
                                        <h3 className="font-semibold text-foreground truncate">
                                            {collection.name}
                                        </h3>
                                        {collection.description && (
                                            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                                                {collection.description}
                                            </p>
                                        )}
                                        <p className="text-xs text-muted-foreground mt-2">
                                            {collection.artworks_count || 0} artwork{(collection.artworks_count || 0) !== 1 ? 's' : ''}
                                        </p>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>

            {/* Create Collection Modal */}
            {showCreateForm && (
                <CollectionForm
                    onClose={() => setShowCreateForm(false)}
                    onSubmit={handleCreateCollection}
                />
            )}

            {/* Edit Collection Modal */}
            {editingCollection && (
                <CollectionForm
                    collection={editingCollection}
                    onClose={() => setEditingCollection(null)}
                    onSubmit={handleUpdateCollection}
                />
            )}

            {/* Delete Confirmation */}
            <AlertDialog open={!!deletingCollection} onOpenChange={() => setDeletingCollection(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Collection</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete &quot;{deletingCollection?.name}&quot;?
                            This will not delete the artworks in the collection.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDeleteCollection}
                            className="bg-destructive hover:bg-destructive/90"
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}

export default Collections
