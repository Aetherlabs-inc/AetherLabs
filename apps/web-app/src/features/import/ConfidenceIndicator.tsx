'use client'

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@aetherlabs/ui'

interface ConfidenceIndicatorProps {
    confidence: number
    showLabel?: boolean
    /** When true, use explicit dark colors for use on light card backgrounds */
    cardContext?: boolean
}

function getConfidenceColor(confidence: number) {
    if (confidence >= 0.8)
        return { dot: 'bg-success', text: 'text-success', label: 'High' }
    if (confidence >= 0.5)
        return { dot: 'bg-warning', text: 'text-warning', label: 'Medium' }
    return { dot: 'bg-destructive', text: 'text-destructive', label: 'Low' }
}

export function ConfidenceIndicator({ confidence, showLabel = true, cardContext }: ConfidenceIndicatorProps) {
    const { dot, text, label } = getConfidenceColor(confidence)
    const percentage = Math.round(confidence * 100)
    const filledDots = Math.round(confidence * 5)

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <div className="flex items-center gap-1.5 cursor-default">
                        <div className="flex gap-0.5">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <div
                                    key={i}
                                    className={`w-1.5 h-1.5 rounded-full ${i < filledDots ? dot : cardContext ? 'bg-border' : 'bg-muted-foreground/30'
                                        }`}
                                />
                            ))}
                        </div>
                        {showLabel && (
                            <span className={`text-xs font-inter tabular-nums ${text}`}>
                                {percentage}%
                            </span>
                        )}
                    </div>
                </TooltipTrigger>
                <TooltipContent>
                    <p className="text-xs">
                        {label} confidence ({percentage}%)
                    </p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}
