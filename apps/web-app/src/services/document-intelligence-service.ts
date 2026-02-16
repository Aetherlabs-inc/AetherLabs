export interface MatchSummary {
    total: number
    matched: number
    fuzzy: number
    unmatched: number
}

export interface MatchResponse {
    matches: Array<{
        reference: { title: string; artist?: string }
        status: 'matched' | 'fuzzy_match' | 'no_match'
        matched_artwork_id?: string
        matched_artwork?: { id: string; title: string; artist: string }
        fuzzy_candidates?: { id: string; title: string; artist: string; reason: string }[]
    }>
    summary: MatchSummary
    message?: string
}

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

    static async triggerArtworkMatching(sessionId: string): Promise<MatchResponse> {
        const response = await fetch(`/api/import/${sessionId}/match`, {
            method: 'POST',
        })

        if (!response.ok) {
            const error = await response.json().catch(() => ({ error: 'Matching failed' }))
            throw new Error(error.error || 'Matching failed')
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
