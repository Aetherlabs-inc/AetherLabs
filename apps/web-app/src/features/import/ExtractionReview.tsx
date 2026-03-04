'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Button, Badge, Skeleton, Card, CardContent } from '@aetherlabs/ui'
import {
    ArrowLeft, Sparkles, Loader2, CheckCircle2, Save,
    FileSpreadsheet, FileText, AlertCircle,
} from 'lucide-react'
import { ImportService } from '@/src/services/import-service'
import { DocumentIntelligenceService } from '@/src/services/document-intelligence-service'
import { DocumentTypeTabs } from './DocumentTypeTabs'
import { ArtworkCard } from './cards/ArtworkCard'
import { InvoiceCard } from './cards/InvoiceCard'
import { QuotationCard } from './cards/QuotationCard'
import { ClientCard } from './cards/ClientCard'
import type { ImportSessionWithRecords, ExtractedRecord } from '@/src/types/database'

interface ExtractionReviewProps {
    sessionId: string
}

function getFileIcon(fileType: string) {
    return fileType === 'docx' ? FileText : FileSpreadsheet
}

export function ExtractionReview({ sessionId }: ExtractionReviewProps) {
    const router = useRouter()
    const [session, setSession] = useState<ImportSessionWithRecords | null>(null)
    const [records, setRecords] = useState<ExtractedRecord[]>([])
    const [loading, setLoading] = useState(true)
    const [extracting, setExtracting] = useState(false)
    const [saving, setSaving] = useState(false)
    const [saveResult, setSaveResult] = useState<{ saved: number; errors: string[]; clientsSaved?: number } | null>(null)
    const [error, setError] = useState<string | null>(null)

    const fetchSession = useCallback(async () => {
        try {
            const data = await ImportService.getSession(sessionId)
            setSession(data)
            setRecords(data.extracted_records || [])
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Failed to load session')
        } finally {
            setLoading(false)
        }
    }, [sessionId])

    useEffect(() => {
        fetchSession()
    }, [fetchSession])

    const handleExtract = async () => {
        setExtracting(true)
        setError(null)
        try {
            await DocumentIntelligenceService.triggerExtraction(sessionId)
            await fetchSession()
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Extraction failed')
        } finally {
            setExtracting(false)
        }
    }

    const handleApprove = async (recordId: string) => {
        try {
            await ImportService.updateExtractedRecord(recordId, { status: 'approved' })
            setRecords((prev) =>
                prev.map((r) => (r.id === recordId ? { ...r, status: 'approved' } : r))
            )
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Failed to approve record')
        }
    }

    const handleReject = async (recordId: string) => {
        try {
            await ImportService.updateExtractedRecord(recordId, { status: 'rejected' })
            setRecords((prev) =>
                prev.map((r) => (r.id === recordId ? { ...r, status: 'rejected' } : r))
            )
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Failed to reject record')
        }
    }

    const handleEdit = async (recordId: string, edits: Record<string, unknown>) => {
        try {
            await ImportService.updateExtractedRecord(recordId, {
                status: 'edited',
                user_edits: edits,
            })
            setRecords((prev) =>
                prev.map((r) =>
                    r.id === recordId ? { ...r, status: 'edited', user_edits: edits } : r
                )
            )
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Failed to edit record')
        }
    }

    const handleApproveHighConfidence = async () => {
        const highConfRecords = records.filter(
            (r) => r.confidence >= 0.8 && r.status === 'pending'
        )
        if (highConfRecords.length === 0) return

        try {
            await ImportService.batchUpdateRecordStatus(
                highConfRecords.map((r) => r.id),
                'approved'
            )
            setRecords((prev) =>
                prev.map((r) =>
                    r.confidence >= 0.8 && r.status === 'pending' ? { ...r, status: 'approved' } : r
                )
            )
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Failed to approve records')
        }
    }

    const handleSaveApproved = async () => {
        setSaving(true)
        setError(null)
        const clientsSaved = records.filter(
            (r) => r.record_type === 'client' && (r.status === 'approved' || r.status === 'edited')
        ).length
        try {
            const result = await DocumentIntelligenceService.saveApprovedRecords(sessionId)
            setSaveResult({ ...result, clientsSaved: clientsSaved > 0 ? clientsSaved : undefined })
            // Refresh records to get updated statuses
            await fetchSession()
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Failed to save records')
        } finally {
            setSaving(false)
        }
    }

    // Counts
    const pendingCount = records.filter((r) => r.status === 'pending').length
    const approvedCount = records.filter((r) => r.status === 'approved' || r.status === 'edited').length
    const rejectedCount = records.filter((r) => r.status === 'rejected').length
    const savedCount = records.filter((r) => r.status === 'saved').length
    const highConfPendingCount = records.filter(
        (r) => r.confidence >= 0.8 && r.status === 'pending'
    ).length

    if (loading) {
        return (
            <div className="space-y-6">
                <Skeleton className="h-8 w-64" />
                <Skeleton className="h-4 w-96" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <Skeleton key={i} className="h-48" />
                    ))}
                </div>
            </div>
        )
    }

    if (!session) {
        return (
            <div className="text-center py-16">
                <p className="text-muted-foreground">Import session not found.</p>
                <Button variant="outline" onClick={() => router.push('/import')} className="mt-4">
                    Back to Import
                </Button>
            </div>
        )
    }

    const FileIcon = getFileIcon(session.file_type)
    const isExtracted = session.status === 'extracted' || session.status === 'completed'
    const isCompleted = session.status === 'completed'
    const needsExtraction = session.status === 'uploaded' || session.status === 'failed'

    const renderRecord = (record: ExtractedRecord) => {
        const props = {
            record,
            onApprove: handleApprove,
            onReject: handleReject,
            onEdit: handleEdit,
        }
        switch (record.record_type) {
            case 'artwork': return <ArtworkCard key={record.id} {...props} />
            case 'transaction': return <InvoiceCard key={record.id} {...props} />
            case 'quotation': return <QuotationCard key={record.id} {...props} />
            case 'client': return <ClientCard key={record.id} {...props} />
            default: return null
        }
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <button
                    onClick={() => router.push('/import')}
                    className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Import
                </button>

                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/5 flex items-center justify-center">
                            <FileIcon className="w-5 h-5 text-muted-foreground" />
                        </div>
                        <div>
                            <p className="text-xl font-playfair font-semibold text-foreground">
                                {session.file_name}
                            </p>
                            <div className="flex items-center gap-2 mt-0.5">
                                {session.document_type && (
                                    <Badge variant="outline" className="text-xs capitalize">
                                        {session.document_type}
                                    </Badge>
                                )}
                                <Badge
                                    variant={isCompleted ? 'default' : 'secondary'}
                                    className="text-xs capitalize"
                                >
                                    {session.status}
                                </Badge>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Error */}
            {error && (
                <div className="flex items-start gap-2 p-3 rounded-lg bg-destructive/15 text-destructive text-sm border border-destructive/20">
                    <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                    <p>{error}</p>
                </div>
            )}

            {/* Extraction trigger */}
            {needsExtraction && (
                <Card>
                    <CardContent className="p-6 text-center">
                        <Sparkles className="w-8 h-8 text-accent mx-auto mb-3" />
                        <p className="text-lg font-semibold text-foreground mb-1">
                            Ready for AI Extraction
                        </p>
                        <p className="text-sm text-muted-foreground mb-4">
                            Claude AI will analyze your document and extract structured data automatically.
                        </p>
                        {session.error_message && (
                            <p className="text-xs text-destructive mb-4">
                                Previous error: {session.error_message}
                            </p>
                        )}
                        <Button onClick={handleExtract} disabled={extracting} className="bg-primary text-primary-foreground hover:bg-primary/90">
                            {extracting ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Extracting... This may take a moment
                                </>
                            ) : (
                                <>
                                    <Sparkles className="w-4 h-4 mr-2" />
                                    {session.status === 'failed' ? 'Retry Extraction' : 'Start Extraction'}
                                </>
                            )}
                        </Button>
                    </CardContent>
                </Card>
            )}

            {/* Processing state */}
            {session.status === 'processing' && (
                <Card>
                    <CardContent className="p-6 text-center">
                        <Loader2 className="w-8 h-8 text-[#BC8010] mx-auto mb-3 animate-spin" />
                        <p className="text-lg font-semibold text-foreground mb-1">
                            Processing...
                        </p>
                        <p className="text-sm text-muted-foreground">
                            AI is analyzing your document. This usually takes 10-30 seconds.
                        </p>
                    </CardContent>
                </Card>
            )}

            {/* Save result */}
            {saveResult && (
                <div className="flex flex-col gap-3 p-4 rounded-lg bg-success/15 text-success text-sm border border-success/20">
                    <div className="flex items-start gap-2">
                        <CheckCircle2 className="w-5 h-5 mt-0.5 shrink-0" />
                        <div>
                            <p className="font-medium">
                                Successfully saved {saveResult.saved} record{saveResult.saved !== 1 ? 's' : ''}
                            </p>
                            {saveResult.errors.length > 0 && (
                                <ul className="mt-1 text-xs text-destructive">
                                    {saveResult.errors.map((e, i) => <li key={i}>{e}</li>)}
                                </ul>
                            )}
                        </div>
                    </div>
                    {saveResult.clientsSaved != null && saveResult.clientsSaved > 0 && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => router.push('/clients')}
                            className="self-start border-success/50 text-success hover:bg-success/10"
                        >
                            {saveResult.clientsSaved} new client{saveResult.clientsSaved !== 1 ? 's' : ''} added — View Clients
                        </Button>
                    )}
                </div>
            )}

            {/* Records review */}
            {isExtracted && records.length > 0 && (
                <>
                    {/* Stats + bulk actions bar */}
                    <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-lg bg-white/5 border border-white/10">
                        <div className="flex items-center gap-4 text-sm text-neutral-300">
                            <span>{records.length} records</span>
                            {approvedCount > 0 && (
                                <span className="text-emerald-400">{approvedCount} approved</span>
                            )}
                            {rejectedCount > 0 && (
                                <span className="text-red-400">{rejectedCount} rejected</span>
                            )}
                            {savedCount > 0 && (
                                <span className="text-neutral-400">{savedCount} saved</span>
                            )}
                        </div>
                        <div className="flex gap-2">
                            {highConfPendingCount > 0 && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleApproveHighConfidence}
                                    className="border-accent text-accent hover:bg-accent/10 hover:text-accent"
                                >
                                    <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />
                                    Approve High Confidence ({highConfPendingCount})
                                </Button>
                            )}
                            {approvedCount > 0 && !isCompleted && (
                                <Button
                                    size="sm"
                                    onClick={handleSaveApproved}
                                    disabled={saving}
                                    className="bg-primary text-primary-foreground hover:bg-primary/90"
                                >
                                    {saving ? (
                                        <>
                                            <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="w-3.5 h-3.5 mr-1.5" />
                                            Save Approved ({approvedCount})
                                        </>
                                    )}
                                </Button>
                            )}
                        </div>
                    </div>

                    {/* Tabbed card grid */}
                    <DocumentTypeTabs records={records}>
                        {(filteredRecords) => (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {filteredRecords.map(renderRecord)}
                            </div>
                        )}
                    </DocumentTypeTabs>
                </>
            )}

            {/* Empty extracted state */}
            {isExtracted && records.length === 0 && (
                <Card>
                    <CardContent className="p-6 text-center">
                        <p className="text-muted-foreground">
                            No records were extracted from this file. The document may not contain
                            recognizable artwork, invoice, or quotation data.
                        </p>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}
