'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
    ArrowLeft,
    Plus,
    MoreHorizontal,
    Pencil,
    Share2,
    Trash2,
    Globe,
    Lock,
    Link2,
    Image,
    GripVertical,
    X,
    ExternalLink,
    Copy,
    Check
} from 'lucide-react'
import {
    Button,
    Card,
    CardContent,
    Badge,
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle
} from '@aetherlabs/ui'
import { CollectionService } from '@/src/services/collection-service'
import { ArtworkService } from '@/src/services/artwork-service'
import { CollectionWithArtworks, ArtworkWithDetails } from '@/src/types/database'
import CollectionForm from './CollectionForm'

interface CollectionDetailProps {
    collectionId: string
    onBack: () => void
}

const CollectionDetail: React.FC<CollectionDetailProps> = ({ collectionId, onBack }) => {
    const [collection, setCollection] = useState<CollectionWithArtworks | null>(null)
    const [allArtworks, setAllArtworks] = useState<ArtworkWithDetails[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    // Modal states
    const [showEditForm, setShowEditForm] = useState(false)
    const [showAddArtworks, setShowAddArtworks] = useState(false)
    const [showShareDialog, setShowShareDialog] = useState(false)
    const [removingArtwork, setRemovingArtwork] = useState<ArtworkWithDetails | null>(null)
    const [copiedLink, setCopiedLink] = useState(false)

    const loadCollection = async () => {
        try {
            setLoading(true)
            setError(null)
            const data = await CollectionService.getCollection(collectionId)
            setCollection(data)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load collection')
        } finally {
            setLoading(false)
        }
    }

    const loadAllArtworks = async () => {
        try {
            const data = await ArtworkService.getArtworks()
            setAllArtworks(data)
        } catch (err) {
            console.error('Failed to load artworks:', err)
        }
    }

    useEffect(() => {
        loadCollection()
        loadAllArtworks()
    }, [collectionId])

    const handleUpdateCollection = async (data: { name: string; description?: string; visibility: 'public' | 'private' | 'unlisted' }) => {
        try {
            await CollectionService.updateCollection(collectionId, data)
            await loadCollection()
            setShowEditForm(false)
        } catch (err) {
            throw err
        }
    }

    const handleAddArtwork = async (artworkId: string) => {
        try {
            await CollectionService.addArtwork(collectionId, artworkId)
            await loadCollection()
        } catch (err) {
            console.error('Failed to add artwork:', err)
        }
    }

    const handleRemoveArtwork = async () => {
        if (!removingArtwork) return
        try {
            await CollectionService.removeArtwork(collectionId, removingArtwork.id)
            await loadCollection()
            setRemovingArtwork(null)
        } catch (err) {
            console.error('Failed to remove artwork:', err)
        }
    }

    const handleCopyLink = async () => {
        if (!collection?.slug) return
        const url = `${window.location.origin}/c/${collection.slug}`
        await navigator.clipboard.writeText(url)
        setCopiedLink(true)
        setTimeout(() => setCopiedLink(false), 2000)
    }

    // Get artworks not in collection
    const availableArtworks = allArtworks.filter(
        artwork => !collection?.artworks?.some(a => a.id === artwork.id)
    )

    const visibilityIcon = {
        public: Globe,
        unlisted: Link2,
        private: Lock
    }[collection?.visibility || 'private']

    const VisibilityIcon = visibilityIcon

    if (loading) {
        return (
            <div className="w-full min-h-screen bg-background">
                <div className="mx-auto w-full px-4 py-6 sm:px-6 lg:px-8">
                    <div className="animate-pulse">
                        <div className="h-8 w-48 bg-muted rounded mb-4" />
                        <div className="h-4 w-96 bg-muted rounded mb-8" />
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                            {Array.from({ length: 8 }).map((_, i) => (
                                <div key={i} className="aspect-square bg-muted rounded-lg" />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    if (error || !collection) {
        return (
            <div className="w-full min-h-screen bg-background">
                <div className="mx-auto w-full px-4 py-6 sm:px-6 lg:px-8">
                    <Button variant="ghost" onClick={onBack} className="mb-4">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Collections
                    </Button>
                    <Card className="border-destructive bg-destructive/10">
                        <CardContent className="p-6 text-center">
                            <p className="text-destructive">{error || 'Collection not found'}</p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        )
    }

    return (
        <div className="w-full min-h-screen bg-background">
            <div className="mx-auto w-full px-4 py-6 sm:px-6 lg:px-8">
                {/* Back Button */}
                <Button variant="ghost" onClick={onBack} className="mb-4 -ml-2">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Collections
                </Button>

                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
                                {collection.name}
                            </h1>
                            <Badge variant="outline" className="flex items-center gap-1">
                                <VisibilityIcon className="w-3 h-3" />
                                {collection.visibility}
                            </Badge>
                        </div>
                        {collection.description && (
                            <p className="text-muted-foreground max-w-2xl">
                                {collection.description}
                            </p>
                        )}
                        <p className="text-sm text-muted-foreground mt-2">
                            {collection.artworks?.length || 0} artwork{(collection.artworks?.length || 0) !== 1 ? 's' : ''}
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            onClick={() => setShowAddArtworks(true)}
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Add Artworks
                        </Button>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="icon">
                                    <MoreHorizontal className="w-4 h-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => setShowEditForm(true)}>
                                    <Pencil className="w-4 h-4 mr-2" />
                                    Edit Collection
                                </DropdownMenuItem>
                                {collection.visibility !== 'private' && (
                                    <DropdownMenuItem onClick={() => setShowShareDialog(true)}>
                                        <Share2 className="w-4 h-4 mr-2" />
                                        Share
                                    </DropdownMenuItem>
                                )}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>

                {/* Empty State */}
                {(!collection.artworks || collection.artworks.length === 0) && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <Card className="border-2 border-dashed border-muted">
                            <CardContent className="py-16">
                                <div className="text-center max-w-md mx-auto">
                                    <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                                        <Image className="w-8 h-8 text-muted-foreground" />
                                    </div>
                                    <h3 className="text-lg font-medium text-foreground mb-2">
                                        No Artworks Yet
                                    </h3>
                                    <p className="text-muted-foreground mb-6">
                                        Add artworks to this collection to get started.
                                    </p>
                                    <Button onClick={() => setShowAddArtworks(true)}>
                                        <Plus className="w-4 h-4 mr-2" />
                                        Add Artworks
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}

                {/* Artworks Grid */}
                {collection.artworks && collection.artworks.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                        {collection.artworks.map((artwork, index) => (
                            <motion.div
                                key={artwork.id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.03 }}
                            >
                                <Card className="group overflow-hidden border border-border hover:border-[#BC8010]/30 transition-colors">
                                    <div className="aspect-square relative bg-muted">
                                        {artwork.image_url ? (
                                            <img
                                                src={artwork.image_url}
                                                alt={artwork.title}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <Image className="w-8 h-8 text-muted-foreground/50" />
                                            </div>
                                        )}

                                        {/* Remove Button */}
                                        <button
                                            onClick={() => setRemovingArtwork(artwork)}
                                            className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 hover:bg-black/80 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>

                                        {/* Certificate Badge */}
                                        {artwork.certificates && artwork.certificates.length > 0 && (
                                            <div className="absolute bottom-2 left-2">
                                                <Badge className="bg-[#BC8010] text-white text-[10px]">
                                                    COA
                                                </Badge>
                                            </div>
                                        )}
                                    </div>

                                    <CardContent className="p-3">
                                        <h4 className="font-medium text-foreground text-sm truncate">
                                            {artwork.title}
                                        </h4>
                                        <p className="text-xs text-muted-foreground truncate">
                                            {artwork.year} • {artwork.medium}
                                        </p>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>

            {/* Edit Collection Modal */}
            {showEditForm && (
                <CollectionForm
                    collection={collection}
                    onClose={() => setShowEditForm(false)}
                    onSubmit={handleUpdateCollection}
                />
            )}

            {/* Add Artworks Modal */}
            <Dialog open={showAddArtworks} onOpenChange={setShowAddArtworks}>
                <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-hidden flex flex-col">
                    <DialogHeader>
                        <DialogTitle>Add Artworks to Collection</DialogTitle>
                    </DialogHeader>

                    <div className="flex-1 overflow-y-auto py-4">
                        {availableArtworks.length === 0 ? (
                            <div className="text-center py-12">
                                <Image className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                                <p className="text-muted-foreground">
                                    All your artworks are already in this collection.
                                </p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                {availableArtworks.map((artwork) => (
                                    <button
                                        key={artwork.id}
                                        onClick={() => handleAddArtwork(artwork.id)}
                                        className="text-left group"
                                    >
                                        <Card className="overflow-hidden border border-border hover:border-[#BC8010] transition-colors">
                                            <div className="aspect-square relative bg-muted">
                                                {artwork.image_url ? (
                                                    <img
                                                        src={artwork.image_url}
                                                        alt={artwork.title}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center">
                                                        <Image className="w-6 h-6 text-muted-foreground/50" />
                                                    </div>
                                                )}
                                                <div className="absolute inset-0 bg-[#BC8010]/0 group-hover:bg-[#BC8010]/20 transition-colors flex items-center justify-center">
                                                    <Plus className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                                                </div>
                                            </div>
                                            <CardContent className="p-2">
                                                <p className="font-medium text-foreground text-xs truncate">
                                                    {artwork.title}
                                                </p>
                                            </CardContent>
                                        </Card>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </DialogContent>
            </Dialog>

            {/* Share Dialog */}
            <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
                <DialogContent className="sm:max-w-[400px]">
                    <DialogHeader>
                        <DialogTitle>Share Collection</DialogTitle>
                    </DialogHeader>

                    <div className="py-4">
                        <p className="text-sm text-muted-foreground mb-4">
                            {collection.visibility === 'public'
                                ? 'This collection is public and visible on your profile.'
                                : 'Share this link with anyone you want to view your collection.'}
                        </p>

                        <div className="flex items-center gap-2">
                            <div className="flex-1 px-3 py-2 bg-muted rounded-lg text-sm text-muted-foreground truncate">
                                {`${typeof window !== 'undefined' ? window.location.origin : ''}/c/${collection.slug}`}
                            </div>
                            <Button onClick={handleCopyLink} variant="outline" size="icon">
                                {copiedLink ? (
                                    <Check className="w-4 h-4 text-emerald-500" />
                                ) : (
                                    <Copy className="w-4 h-4" />
                                )}
                            </Button>
                        </div>

                        {collection.visibility === 'public' && (
                            <Button
                                variant="outline"
                                className="w-full mt-4"
                                onClick={() => window.open(`/c/${collection.slug}`, '_blank')}
                            >
                                <ExternalLink className="w-4 h-4 mr-2" />
                                View Public Page
                            </Button>
                        )}
                    </div>
                </DialogContent>
            </Dialog>

            {/* Remove Artwork Confirmation */}
            <AlertDialog open={!!removingArtwork} onOpenChange={() => setRemovingArtwork(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Remove Artwork</AlertDialogTitle>
                        <AlertDialogDescription>
                            Remove &quot;{removingArtwork?.title}&quot; from this collection?
                            The artwork will not be deleted.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleRemoveArtwork}>
                            Remove
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}

export default CollectionDetail
