import { ExtractionReview } from '@/src/features/import/ExtractionReview'

export default async function ReviewPage({
    params,
}: {
    params: Promise<{ sessionId: string }>
}) {
    const { sessionId } = await params
    return <ExtractionReview sessionId={sessionId} />
}
