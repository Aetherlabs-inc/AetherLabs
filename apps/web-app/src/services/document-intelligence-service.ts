export class DocumentIntelligenceService {
    static async triggerExtraction(sessionId: string): Promise<{ success: boolean; recordCount: number }> {
        const response = await fetch(`/api/import/${sessionId}/extract`, {
            method: 'POST',
        })

        if (!response.ok) {
            const error = await response.json().catch(() => ({ error: 'Extraction failed' }))
            throw new Error(error.error || 'Extraction failed')
        }

        return response.json()
    }

    static async saveApprovedRecords(sessionId: string): Promise<{ saved: number; errors: string[] }> {
        const response = await fetch(`/api/import/${sessionId}/save`, {
            method: 'POST',
        })

        if (!response.ok) {
            const error = await response.json().catch(() => ({ error: 'Save failed' }))
            throw new Error(error.error || 'Save failed')
        }

        return response.json()
    }
}
