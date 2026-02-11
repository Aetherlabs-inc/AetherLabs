'use client'

import React from 'react'
import { Button } from '@aetherlabs/ui'
import { FileText, Shield, ArrowLeft, ArrowRight } from 'lucide-react'
import COACertificateElegant from './COACertificateElegant'

interface COADecisionScreenProps {
  artworkTitle: string
  artworkData?: {
    year?: string
    medium?: string
    dimensions?: string
    artistName?: string
    imageUrl?: string
  }
  onBack: () => void
  onGenerateCOA: () => void
  onSkipCOA: () => void
}

const COADecisionScreen: React.FC<COADecisionScreenProps> = ({
  artworkTitle,
  artworkData,
  onBack,
  onGenerateCOA,
  onSkipCOA,
}) => {
  // Create preview data for the certificate
  const previewArtworkData = {
    title: artworkTitle || 'Your Artwork',
    year: artworkData?.year || new Date().getFullYear().toString(),
    medium: artworkData?.medium || 'Mixed Media',
    dimensions: artworkData?.dimensions || '24 × 18 in',
    artistName: artworkData?.artistName || 'Artist Name',
    imageUrl: artworkData?.imageUrl,
  }

  const previewCertificateData = {
    certificateId: 'COA-PREVIEW',
    qrCodeUrl: 'https://aetherlabs.art/verify/preview',
    blockchainHash: '0x' + 'a'.repeat(32) + '...',
    generatedAt: new Date().toISOString(),
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button
            onClick={onBack}
            variant="ghost"
            className="mb-4 flex items-center gap-2 text-foreground hover:text-muted-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Artwork Registration
          </Button>

          <div className="text-center">
            <h1 className="text-4xl font-bold text-foreground mb-4">Certificate of Authenticity</h1>
            <p className="text-xl text-muted-foreground mb-2">
              Would you like to create a COA for &quot;{artworkTitle}&quot;?
            </p>
            <p className="text-sm text-muted-foreground">
              A beautiful, verifiable certificate that proves authenticity
            </p>
          </div>
        </div>

        {/* Certificate Preview */}
        <div className="mb-8">
          <div className="relative">
            {/* Preview label */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-30">
              <span className="bg-[#BC8010] text-white text-xs font-semibold px-3 py-1 rounded-full">
                PREVIEW
              </span>
            </div>

            {/* Certificate preview with slight opacity to indicate it's a preview */}
            <div className="opacity-90 pointer-events-none">
              <COACertificateElegant
                artworkData={previewArtworkData}
                certificateData={previewCertificateData}
                verificationLevel={{
                  level: 'artist_verified',
                  hasNFC: false,
                }}
                showActions={false}
              />
            </div>
          </div>
        </div>

        {/* Features List */}
        <div className="max-w-md mx-auto mb-8">
          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <Shield className="h-5 w-5 text-[#BC8010]" />
              What&apos;s Included
            </h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-[#BC8010] rounded-full" />
                Unique certificate ID for verification
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-[#BC8010] rounded-full" />
                QR code for instant authenticity check
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-[#BC8010] rounded-full" />
                Registry signature on record
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-[#BC8010] rounded-full" />
                Downloadable PDF certificate
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-[#BC8010] rounded-full" />
                NFC tag binding capability
              </li>
            </ul>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center">
          <Button
            onClick={onSkipCOA}
            variant="outline"
            className="px-8 py-3 text-lg font-semibold border-border text-foreground hover:bg-muted"
          >
            <FileText className="h-5 w-5 mr-2" />
            Continue Without COA
          </Button>
          <Button
            onClick={onGenerateCOA}
            className="px-8 py-3 text-lg font-semibold bg-[#2A2121] hover:bg-[#2A2121]/90 text-white"
          >
            <Shield className="h-5 w-5 mr-2" />
            Generate COA
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>

        {/* Additional Info */}
        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            You can always generate a COA later from your artwork&apos;s detail page
          </p>
        </div>
      </div>
    </div>
  )
}

export default COADecisionScreen
