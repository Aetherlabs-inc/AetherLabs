'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
    Button, Badge,
    AlertDialog, AlertDialogAction, AlertDialogCancel,
    AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
    AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
    Skeleton,
} from '@aetherlabs/ui'
import {
    FileSpreadsheet, FileText, Trash2, ExternalLink, Upload,
    ArrowLeft, Users,
} from 'lucide-react'
import { ImportService } from '@/src/services/import-service'
import type { ImportSession } from '@/src/types/database'
import { formatDistanceToNow } from 'date-fns'

function getFileIcon(fileType: string) {
    return fileType === 'docx' ? FileText : FileSpreadsheet
}

function getStatusVariant(status: string): 'default' | 'secondary' | 'destructive' | 'outline' {
    switch (status) {
        case 'completed': return 'default'
        case 'extracted': return 'secondary'
        case 'failed': return 'destructive'
        default: return 'outline'
    }
}

export function ImportHistory() {
    const router = useRouter()
    const [sessions, setSessions] = useState<ImportSession[]>([])
    const [loading, setLoading] = useState(true)
    const [deletingId, setDeletingId] = useState<string | null>(null)

    useEffect(() => {
        fetchSessions()
    }, [])

    const fetchSessions = async () => {
        try {
            const data = await ImportService.getSessions()
            setSessions(data)
        } catch (err) {
            console.error('Failed to fetch sessions:', err)
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (sessionId: string) => {
        setDeletingId(sessionId)
        try {
            await ImportService.deleteSession(sessionId)
            setSessions((prev) => prev.filter((s) => s.id !== sessionId))
        } catch (err) {
            console.error('Failed to delete session:', err)
        } finally {
            setDeletingId(null)
        }
    }

    if (loading) {
        return (
            <div className="space-y-4">
                <Skeleton className="h-8 w-48" />
                {Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-20" />
                ))}
            </div>
        )
    }

    return (
        <div className="max-w-3xl mx-auto">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <button
                        onClick={() => router.push('/import')}
                        className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-2"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Import
                    </button>
                    <p className="text-2xl font-playfair font-semibold text-foreground">Import History</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={() => router.push('/clients')}>
                        <Users className="w-4 h-4 mr-2" />
                        View Clients
                    </Button>
                    <Button onClick={() => router.push('/import')} className="bg-primary text-primary-foreground hover:bg-primary/90">
                        <Upload className="w-4 h-4 mr-2" />
                        New Import
                    </Button>
                </div>
            </div>

            {sessions.length === 0 ? (
                <div className="text-center py-16">
                    <div className="relative inline-block mb-6">
                        <div className="w-32 h-32 border-2 border-dashed border-border rounded-lg flex items-center justify-center">
                            <div className="w-20 h-20 border-2 border-accent rounded-md flex items-center justify-center bg-accent/15">
                                <FileSpreadsheet className="w-8 h-8 text-accent" strokeWidth={1.5} />
                            </div>
                        </div>
                        <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-accent/70 rounded-tl" />
                        <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-accent/70 rounded-tr" />
                        <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-accent/70 rounded-bl" />
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-accent/70 rounded-br" />
                    </div>
                    <p className="text-xl font-playfair font-semibold text-foreground mb-2">No imports yet</p>
                    <p className="text-muted-foreground text-center max-w-sm mx-auto mb-6">
                        Upload your first document to start extracting artwork data, invoices, and quotations.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <Button onClick={() => router.push('/import')} className="bg-primary text-primary-foreground hover:bg-primary/90">
                            <Upload className="w-4 h-4 mr-2" />
                            Upload Your First Document
                        </Button>
                        <Button variant="outline" onClick={() => router.push('/clients')}>
                            <Users className="w-4 h-4 mr-2" />
                            View Clients
                        </Button>
                    </div>
                </div>
            ) : (
                <div className="space-y-3">
                    {sessions.map((session) => {
                        const FileIcon = getFileIcon(session.file_type)
                        return (
                            <div
                                key={session.id}
                                className="flex items-center gap-4 p-4 rounded-lg border border-border bg-card hover:bg-muted/30 transition-colors"
                            >
                                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                                    <FileIcon className="w-5 h-5 text-muted-foreground" />
                                </div>

                                <div className="flex-1 min-w-0">
                                    <p className="font-medium text-foreground truncate">
                                        {session.file_name}
                                    </p>
                                    <div className="flex items-center gap-2 mt-0.5">
                                        {session.document_type && (
                                            <span className="text-xs text-muted-foreground capitalize">
                                                {session.document_type}
                                            </span>
                                        )}
                                        <span className="text-xs text-muted-foreground">
                                            {formatDistanceToNow(new Date(session.created_at), { addSuffix: true })}
                                        </span>
                                        {session.total_records > 0 && (
                                            <span className="text-xs text-muted-foreground">
                                                {session.approved_records}/{session.total_records} records
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <Badge variant={getStatusVariant(session.status)} className="capitalize shrink-0 bg-accent text-accent-foreground hover:bg-accent/90 ">
                                    {session.status}
                                </Badge>

                                <div className="flex gap-1 shrink-0">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => router.push(`/import/${session.id}/review`)}
                                    >
                                        <ExternalLink className="w-4 h-4" />
                                    </Button>
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="text-destructive hover:text-destructive"
                                                disabled={deletingId === session.id}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Delete Import</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    This will permanently delete this import session and all its
                                                    extracted records. Previously saved data (artworks, transactions)
                                                    will not be affected.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                <AlertDialogAction
                                                    onClick={() => handleDelete(session.id)}
                                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                                >
                                                    Delete
                                                </AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}
