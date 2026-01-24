'use client'

import { useEffect, useMemo, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Input, Label, Button, Switch } from '@aetherlabs/ui'
import COACertificateElegant from '@/src/features/artworks/registerArtwork/COACertificateElegant'

interface PreviewCertificate {
  artwork: {
    title: string
    artist?: string | null
    year?: number | null
    medium?: string | null
    dimensions?: string | null
    image_url?: string | null
  }
  certificate_id: string
  generated_at: string
}

interface CertificatePreviewProps {
  certificate?: PreviewCertificate | null
}

const DEFAULT_CERT: PreviewCertificate = {
  artwork: {
    title: 'Untitled Study',
    artist: 'Studio Artist',
    year: new Date().getFullYear(),
    medium: 'Oil on linen',
    dimensions: '24 × 18 in',
    image_url: "/IMG_6262.JPG",
  },
  certificate_id: 'COA-PREVIEW-0001',
  generated_at: new Date().toISOString(),
}

export default function CertificatePreview({ certificate }: CertificatePreviewProps) {
  const seed = certificate ?? DEFAULT_CERT
  const [title, setTitle] = useState(seed.artwork.title)
  const [artist, setArtist] = useState(seed.artwork.artist ?? '')
  const [year, setYear] = useState(seed.artwork.year ? String(seed.artwork.year) : '')
  const [medium, setMedium] = useState(seed.artwork.medium ?? '')
  const [dimensions, setDimensions] = useState(seed.artwork.dimensions ?? '')
  const [imageUrl, setImageUrl] = useState(seed.artwork.image_url ?? '')
  const [showNfc, setShowNfc] = useState(false)

  useEffect(() => {
    setTitle(seed.artwork.title)
    setArtist(seed.artwork.artist ?? '')
    setYear(seed.artwork.year ? String(seed.artwork.year) : '')
    setMedium(seed.artwork.medium ?? '')
    setDimensions(seed.artwork.dimensions ?? '')
    setImageUrl(seed.artwork.image_url ?? '')
  }, [seed])

  const certificateData = useMemo(() => {
    return {
      certificateId: seed.certificate_id,
      qrCodeUrl: `https://aetherlabs.art/verify/${seed.certificate_id}`,
      blockchainHash: `SIG-${seed.certificate_id.slice(-4)}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
      generatedAt: seed.generated_at,
    }
  }, [seed])

  return (
    <Card className="border border-border bg-card">
      <CardHeader className="space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <CardTitle>Certificate Studio</CardTitle>
            <CardDescription>Design and preview your certificate layout in real time.</CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setTitle(seed.artwork.title)
              setArtist(seed.artwork.artist ?? '')
              setYear(seed.artwork.year ? String(seed.artwork.year) : '')
              setMedium(seed.artwork.medium ?? '')
              setDimensions(seed.artwork.dimensions ?? '')
              setImageUrl(seed.artwork.image_url ?? '')
            }}
          >
            Reset
          </Button>
        </div>
      </CardHeader>
      <CardContent className="grid grid-cols-1 lg:grid-cols-[320px_minmax(0,1fr)] gap-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="preview-title">Artwork title</Label>
            <Input id="preview-title" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="preview-artist">Artist</Label>
            <Input id="preview-artist" value={artist} onChange={(e) => setArtist(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="preview-year">Year</Label>
            <Input id="preview-year" value={year} onChange={(e) => setYear(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="preview-medium">Medium</Label>
            <Input id="preview-medium" value={medium} onChange={(e) => setMedium(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="preview-dimensions">Dimensions</Label>
            <Input id="preview-dimensions" value={dimensions} onChange={(e) => setDimensions(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="preview-image">Image URL (optional)</Label>
            <Input id="preview-image" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
          </div>
          <div className="flex items-center justify-between rounded-lg border border-border px-3 py-2">
            <div>
              <p className="text-sm font-medium text-foreground">Show NFC badge</p>
              <p className="text-xs text-muted-foreground">Preview the NFC linked state.</p>
            </div>
            <Switch checked={showNfc} onCheckedChange={setShowNfc} />
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-[#f9f8f6] p-4">
          <COACertificateElegant
            artworkData={{
              title: title || 'Untitled Study',
              year: year || 'N/A',
              medium: medium || 'N/A',
              dimensions: dimensions || 'N/A',
              artistName: artist || 'Unknown Artist',
              imageUrl: imageUrl || undefined,
            }}
            certificateData={certificateData}
            verificationLevel={{
              level: 'artist_verified',
              hasNFC: showNfc,
              nfcUid: showNfc ? 'NFC-PREVIEW-010' : undefined,
            }}
            showActions={false}
          />
        </div>
      </CardContent>
    </Card>
  )
}
