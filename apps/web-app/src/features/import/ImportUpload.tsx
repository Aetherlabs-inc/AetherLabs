'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useDropzone, type FileRejection } from 'react-dropzone'
import { Card, CardContent, Button, Badge } from '@aetherlabs/ui'
import { Upload, FileSpreadsheet, FileText, Loader2, X, AlertCircle, History } from 'lucide-react'
import { ImportService } from '@/src/services/import-service'

const ACCEPTED_TYPES: Record<string, string[]> = {
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
    'application/vnd.ms-excel': ['.xls'],
    'text/csv': ['.csv'],
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
}

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

function formatFileSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function getFileIcon(fileName: string) {
    const ext = fileName.split('.').pop()?.toLowerCase()
    if (ext === 'docx') return FileText
    return FileSpreadsheet
}

export function ImportUpload() {
    const router = useRouter()
    const [uploading, setUploading] = useState(false)
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [error, setError] = useState<string | null>(null)

    const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
        setError(null)

        if (rejectedFiles.length > 0) {
            const rejection = rejectedFiles[0]
            if (rejection.errors[0]?.code === 'file-too-large') {
                setError(`File is too large. Maximum size is ${formatFileSize(MAX_FILE_SIZE)}.`)
            } else {
                setError('Unsupported file type. Please upload an Excel (.xlsx), CSV (.csv), or Word (.docx) file.')
            }
            return
        }

        if (acceptedFiles.length > 0) {
            setSelectedFile(acceptedFiles[0])
        }
    }, [])

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: ACCEPTED_TYPES,
        maxSize: MAX_FILE_SIZE,
        multiple: false,
    })

    const handleUpload = async () => {
        if (!selectedFile) return

        setUploading(true)
        setError(null)

        try {
            const session = await ImportService.uploadFile(selectedFile)
            router.push(`/import/${session.id}/review`)
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Upload failed. Please try again.'
            setError(message)
            setUploading(false)
        }
    }

    const handleRemoveFile = () => {
        setSelectedFile(null)
        setError(null)
    }

    const FileIcon = selectedFile ? getFileIcon(selectedFile.name) : Upload

    return (
        <div className="max-w-2xl mx-auto">
            <div className="mb-8">
                <div className="flex items-start justify-between">
                    <div>
                        <p className="text-2xl font-playfair font-semibold text-foreground mb-2">
                            Import Documents
                        </p>
                        <p className="text-muted-foreground">
                            Upload your Excel files, CSVs, or Word documents. AI will extract artwork inventory,
                            invoices, and quotations automatically.
                        </p>
                    </div>
                    <Link href="/import/history">
                        <Button variant="outline" size="sm">
                            <History className="w-4 h-4 mr-1.5" />
                            History
                        </Button>
                    </Link>
                </div>
            </div>

            {!selectedFile ? (
                <div className="relative">
                    <div
                        {...getRootProps()}
                        className={`
                            border-2 border-dashed rounded-lg p-12 text-center cursor-pointer
                            transition-all duration-200
                            ${isDragActive
                                ? 'border-accent bg-accent/10'
                                : 'border-border hover:border-accent/70 hover:bg-accent/5'
                            }
                        `}
                    >
                        <input {...getInputProps()} />

                        <div className="flex flex-col items-center gap-4">
                            <div className="w-16 h-16 rounded-lg bg-accent/10 flex items-center justify-center">
                                <Upload className="w-8 h-8 text-muted-foreground" strokeWidth={1.5} />
                            </div>

                            <div>
                                <p className="text-foreground font-medium mb-1">
                                    {isDragActive ? 'Drop your file here' : 'Drag & drop your file here'}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    or click to browse
                                </p>
                            </div>

                            <div className="flex gap-2">
                                <Badge variant="outline" className="text-xs">.xlsx</Badge>
                                <Badge variant="outline" className="text-xs">.csv</Badge>
                                <Badge variant="outline" className="text-xs">.docx</Badge>
                            </div>

                            <p className="text-xs text-muted-foreground">
                                Max file size: {formatFileSize(MAX_FILE_SIZE)}
                            </p>
                        </div>
                    </div>

                    {/* Accent corner accents */}
                    <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-accent/70 rounded-tl pointer-events-none" />
                    <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-accent/70 rounded-tr pointer-events-none" />
                    <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-accent/70 rounded-bl pointer-events-none" />
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-accent/70 rounded-br pointer-events-none" />
                </div>
            ) : (
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                                <FileIcon className="w-6 h-6 text-muted-foreground" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-medium text-foreground truncate">
                                    {selectedFile.name}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    {formatFileSize(selectedFile.size)}
                                </p>
                            </div>
                            {!uploading && (
                                <button
                                    onClick={handleRemoveFile}
                                    className="p-1.5 rounded-md hover:bg-muted transition-colors"
                                >
                                    <X className="w-4 h-4 text-muted-foreground" />
                                </button>
                            )}
                        </div>

                        <div className="mt-6 flex gap-3">
                            <Button
                                onClick={handleUpload}
                                disabled={uploading}
                                className="flex-1 w-full h-12 rounded-full text-lg font-bold bg-primary text-primary-foreground hover:bg-primary/90"
                            >
                                {uploading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Uploading...
                                    </>
                                ) : (
                                    <>
                                        <Upload className="w-4 h-4 mr-2" />
                                        Upload & Continue
                                    </>
                                )}
                            </Button>
                            {!uploading && (
                                <Button variant="outline" onClick={handleRemoveFile}>
                                    Cancel
                                </Button>
                            )}
                        </div>
                    </CardContent>
                </Card>
            )}

            {error && (
                <div className="mt-4 flex items-start gap-2 p-3 rounded-lg bg-destructive/15 text-destructive text-sm border border-destructive/20">
                    <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                    <p>{error}</p>
                </div>
            )}

            {/* Supported formats info */}
            <div className="mt-8">
                <p className="text-sm font-medium text-foreground mb-3">Supported Formats</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                        <FileSpreadsheet className="w-5 h-5 text-muted-foreground" />
                        <div>
                            <p className="text-sm font-medium text-foreground">Excel</p>
                            <p className="text-xs text-muted-foreground">Inventory, invoices</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 border border-border">
                        <FileSpreadsheet className="w-5 h-5 text-accent" />
                        <div>
                            <p className="text-sm font-medium text-foreground">CSV</p>
                            <p className="text-xs text-muted-foreground">Tabular data</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 border border-border">
                        <FileText className="w-5 h-5 text-accent" />
                        <div>
                            <p className="text-sm font-medium text-foreground">Word</p>
                            <p className="text-xs text-muted-foreground">Documents, quotes</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}