'use client'

import { Tabs, TabsList, TabsTrigger, TabsContent, Badge } from '@aetherlabs/ui'
import type { ExtractedRecord, ExtractedRecordType } from '@/src/types/database'

interface DocumentTypeTabsProps {
    records: ExtractedRecord[]
    children: (filteredRecords: ExtractedRecord[]) => React.ReactNode
}

const TAB_CONFIG: { value: string; label: string; type?: ExtractedRecordType }[] = [
    { value: 'all', label: 'All' },
    { value: 'artwork', label: 'Artworks', type: 'artwork' },
    { value: 'transaction', label: 'Transactions', type: 'transaction' },
    { value: 'quotation', label: 'Quotations', type: 'quotation' },
    { value: 'client', label: 'Clients', type: 'client' },
]

export function DocumentTypeTabs({ records, children }: DocumentTypeTabsProps) {
    const counts = {
        all: records.length,
        artwork: records.filter((r) => r.record_type === 'artwork').length,
        transaction: records.filter((r) => r.record_type === 'transaction').length,
        quotation: records.filter((r) => r.record_type === 'quotation').length,
        client: records.filter((r) => r.record_type === 'client').length,
    }

    // Only show tabs that have records (plus "All")
    const visibleTabs = TAB_CONFIG.filter(
        (tab) => tab.value === 'all' || counts[tab.value as keyof typeof counts] > 0
    )

    return (
        <Tabs defaultValue="all" className="w-full">
            <TabsList className="mb-4 bg-muted/60 border border-border p-1">
                {visibleTabs.map((tab) => (
                    <TabsTrigger
                        key={tab.value}
                        value={tab.value}
                        className="gap-1.5 text-muted-foreground hover:text-foreground data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                    >
                        {tab.label}
                        <Badge variant="secondary" className="text-xs px-1.5 py-0 min-w-[1.25rem] h-5">
                            {counts[tab.value as keyof typeof counts]}
                        </Badge>
                    </TabsTrigger>
                ))}
            </TabsList>

            {visibleTabs.map((tab) => {
                const filtered = tab.type
                    ? records.filter((r) => r.record_type === tab.type)
                    : records

                return (
                    <TabsContent key={tab.value} value={tab.value}>
                        {children(filtered)}
                    </TabsContent>
                )
            })}
        </Tabs>
    )
}
