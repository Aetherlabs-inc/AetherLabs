'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { History, MapPin, Wrench, Plus, ChevronRight } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, Button, Tabs, TabsContent, TabsList, TabsTrigger } from '@aetherlabs/ui'
import { DocumentationService } from '@/src/services/documentation-service'
import { ProvenanceRecord, ExhibitionRecord, ConservationRecord } from '@/src/types/database'
import ProvenanceTimeline from './ProvenanceTimeline'
import ProvenanceForm from './ProvenanceForm'
import ExhibitionList from './ExhibitionList'
import ExhibitionForm from './ExhibitionForm'
import ConservationList from './ConservationList'
import ConservationForm from './ConservationForm'

interface DocumentationTabsProps {
    artworkId: string
}

const DocumentationTabs: React.FC<DocumentationTabsProps> = ({ artworkId }) => {
    const [activeTab, setActiveTab] = useState('provenance')
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    // Data states
    const [provenance, setProvenance] = useState<ProvenanceRecord[]>([])
    const [exhibitions, setExhibitions] = useState<ExhibitionRecord[]>([])
    const [conservation, setConservation] = useState<ConservationRecord[]>([])

    // Form states
    const [showProvenanceForm, setShowProvenanceForm] = useState(false)
    const [editingProvenance, setEditingProvenance] = useState<ProvenanceRecord | null>(null)
    const [showExhibitionForm, setShowExhibitionForm] = useState(false)
    const [editingExhibition, setEditingExhibition] = useState<ExhibitionRecord | null>(null)
    const [showConservationForm, setShowConservationForm] = useState(false)
    const [editingConservation, setEditingConservation] = useState<ConservationRecord | null>(null)

    const loadData = async () => {
        try {
            setLoading(true)
            setError(null)
            const data = await DocumentationService.getArtworkDocumentation(artworkId)
            setProvenance(data.provenance)
            setExhibitions(data.exhibitions)
            setConservation(data.conservation)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load documentation')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadData()
    }, [artworkId])

    // Provenance handlers
    const handleAddProvenance = async (data: Omit<ProvenanceRecord, 'id' | 'artwork_id' | 'created_at'>) => {
        await DocumentationService.addProvenanceRecord({ ...data, artwork_id: artworkId })
        await loadData()
        setShowProvenanceForm(false)
    }

    const handleUpdateProvenance = async (data: Partial<ProvenanceRecord>) => {
        if (!editingProvenance) return
        await DocumentationService.updateProvenanceRecord(editingProvenance.id, data)
        await loadData()
        setEditingProvenance(null)
    }

    const handleDeleteProvenance = async (id: string) => {
        await DocumentationService.deleteProvenanceRecord(id)
        await loadData()
    }

    // Exhibition handlers
    const handleAddExhibition = async (data: Omit<ExhibitionRecord, 'id' | 'artwork_id' | 'created_at'>) => {
        await DocumentationService.addExhibitionRecord({ ...data, artwork_id: artworkId })
        await loadData()
        setShowExhibitionForm(false)
    }

    const handleUpdateExhibition = async (data: Partial<ExhibitionRecord>) => {
        if (!editingExhibition) return
        await DocumentationService.updateExhibitionRecord(editingExhibition.id, data)
        await loadData()
        setEditingExhibition(null)
    }

    const handleDeleteExhibition = async (id: string) => {
        await DocumentationService.deleteExhibitionRecord(id)
        await loadData()
    }

    // Conservation handlers
    const handleAddConservation = async (data: Omit<ConservationRecord, 'id' | 'artwork_id' | 'created_at'>) => {
        await DocumentationService.addConservationRecord({ ...data, artwork_id: artworkId })
        await loadData()
        setShowConservationForm(false)
    }

    const handleUpdateConservation = async (data: Partial<ConservationRecord>) => {
        if (!editingConservation) return
        await DocumentationService.updateConservationRecord(editingConservation.id, data)
        await loadData()
        setEditingConservation(null)
    }

    const handleDeleteConservation = async (id: string) => {
        await DocumentationService.deleteConservationRecord(id)
        await loadData()
    }

    const tabCounts = {
        provenance: provenance.length,
        exhibitions: exhibitions.length,
        conservation: conservation.length
    }

    if (loading) {
        return (
            <Card className="border border-border">
                <CardHeader>
                    <CardTitle className="text-lg">Documentation</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="animate-pulse space-y-4">
                        <div className="h-10 bg-muted rounded" />
                        <div className="h-32 bg-muted rounded" />
                    </div>
                </CardContent>
            </Card>
        )
    }

    if (error) {
        return (
            <Card className="border border-destructive/50 bg-destructive/5">
                <CardContent className="p-6 text-center">
                    <p className="text-destructive">{error}</p>
                    <Button variant="outline" onClick={loadData} className="mt-4">
                        Try Again
                    </Button>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="border border-border">
            <CardHeader className="pb-0">
                <CardTitle className="text-lg flex items-center gap-2">
                    <History className="w-5 h-5 text-[#BC8010]" />
                    Documentation
                </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="grid w-full grid-cols-3 mb-4">
                        <TabsTrigger value="provenance" className="text-xs sm:text-sm">
                            Provenance
                            {tabCounts.provenance > 0 && (
                                <span className="ml-1.5 px-1.5 py-0.5 rounded-full bg-muted text-[10px]">
                                    {tabCounts.provenance}
                                </span>
                            )}
                        </TabsTrigger>
                        <TabsTrigger value="exhibitions" className="text-xs sm:text-sm">
                            Exhibitions
                            {tabCounts.exhibitions > 0 && (
                                <span className="ml-1.5 px-1.5 py-0.5 rounded-full bg-muted text-[10px]">
                                    {tabCounts.exhibitions}
                                </span>
                            )}
                        </TabsTrigger>
                        <TabsTrigger value="conservation" className="text-xs sm:text-sm">
                            Conservation
                            {tabCounts.conservation > 0 && (
                                <span className="ml-1.5 px-1.5 py-0.5 rounded-full bg-muted text-[10px]">
                                    {tabCounts.conservation}
                                </span>
                            )}
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="provenance" className="mt-0">
                        <div className="flex justify-between items-center mb-4">
                            <p className="text-sm text-muted-foreground">
                                Track ownership history and chain of custody
                            </p>
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setShowProvenanceForm(true)}
                            >
                                <Plus className="w-4 h-4 mr-1" />
                                Add
                            </Button>
                        </div>
                        <ProvenanceTimeline
                            records={provenance}
                            onEdit={setEditingProvenance}
                            onDelete={handleDeleteProvenance}
                        />
                    </TabsContent>

                    <TabsContent value="exhibitions" className="mt-0">
                        <div className="flex justify-between items-center mb-4">
                            <p className="text-sm text-muted-foreground">
                                Record exhibition history and public displays
                            </p>
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setShowExhibitionForm(true)}
                            >
                                <Plus className="w-4 h-4 mr-1" />
                                Add
                            </Button>
                        </div>
                        <ExhibitionList
                            records={exhibitions}
                            onEdit={setEditingExhibition}
                            onDelete={handleDeleteExhibition}
                        />
                    </TabsContent>

                    <TabsContent value="conservation" className="mt-0">
                        <div className="flex justify-between items-center mb-4">
                            <p className="text-sm text-muted-foreground">
                                Document condition reports and restoration work
                            </p>
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setShowConservationForm(true)}
                            >
                                <Plus className="w-4 h-4 mr-1" />
                                Add
                            </Button>
                        </div>
                        <ConservationList
                            records={conservation}
                            onEdit={setEditingConservation}
                            onDelete={handleDeleteConservation}
                        />
                    </TabsContent>
                </Tabs>
            </CardContent>

            {/* Provenance Form Modal */}
            {(showProvenanceForm || editingProvenance) && (
                <ProvenanceForm
                    record={editingProvenance || undefined}
                    onClose={() => {
                        setShowProvenanceForm(false)
                        setEditingProvenance(null)
                    }}
                    onSubmit={editingProvenance ? handleUpdateProvenance : handleAddProvenance}
                />
            )}

            {/* Exhibition Form Modal */}
            {(showExhibitionForm || editingExhibition) && (
                <ExhibitionForm
                    record={editingExhibition || undefined}
                    onClose={() => {
                        setShowExhibitionForm(false)
                        setEditingExhibition(null)
                    }}
                    onSubmit={editingExhibition ? handleUpdateExhibition : handleAddExhibition}
                />
            )}

            {/* Conservation Form Modal */}
            {(showConservationForm || editingConservation) && (
                <ConservationForm
                    record={editingConservation || undefined}
                    onClose={() => {
                        setShowConservationForm(false)
                        setEditingConservation(null)
                    }}
                    onSubmit={editingConservation ? handleUpdateConservation : handleAddConservation}
                />
            )}
        </Card>
    )
}

export default DocumentationTabs
