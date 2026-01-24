'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { CheckCircle, Copy, Download } from 'lucide-react'
import { Button } from '@aetherlabs/ui'
import { QRCodeSVG } from 'qrcode.react'
import Image from 'next/image'

interface COACertificateElegantProps {
  artworkData: {
    title: string
    year: string
    medium: string
    dimensions: string
    artistName: string
    imageUrl?: string
    description?: string
  }
  certificateData: {
    certificateId: string
    qrCodeUrl: string
    blockchainHash: string
    generatedAt: string
  }
  verificationLevel?: {
    level: 'unverified' | 'artist_verified' | 'gallery_verified' | 'third_party_verified'
    hasNFC: boolean
    nfcUid?: string
  }
  showActions?: boolean
  onDownload?: () => void
  onCopy?: () => void
  className?: string
}

const COACertificateElegant: React.FC<COACertificateElegantProps> = ({
  artworkData,
  certificateData,
  verificationLevel = { level: 'artist_verified', hasNFC: false },
  showActions = true,
  onDownload,
  onCopy,
  className = ''
}) => {
  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })

  const handleCopy = () => {
    navigator.clipboard.writeText(certificateData.certificateId)
    onCopy?.()
  }

  const noiseSvg =
    "<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160' viewBox='0 0 160 160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='2' stitchTiles='stitch'/></filter><rect width='160' height='160' filter='url(%23n)' opacity='0.45'/></svg>"
  const noiseUrl = `url("data:image/svg+xml;utf8,${encodeURIComponent(noiseSvg)}")`
  const backgroundImageUrl = artworkData.imageUrl || '/IMG_6262-2.jpg'

  return (
    <div className={`relative ${className}`}>
      {/* Main Certificate */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative max-w-[460px] sm:max-w-[520px] mx-auto overflow-hidden rounded-[28px] border border-[#2A2121]/10 bg-[#f7f4ef] shadow-[0_22px_60px_rgba(42,33,33,0.18)]"
      >
        <div className="absolute inset-0 overflow-hidden rounded-[28px] border border-[#2A2121]/10 shadow-[0_22px_60px_rgba(42,33,33,0.18)] w-full h-full">
          <Image
            src={backgroundImageUrl}
            alt={artworkData.title}
            fill
            className="object-cover invert saturate-150"
          />
          <div
            className="absolute inset-0 bg-black/10 bg-blend-multiply"
            style={{ backgroundImage: noiseUrl }}
          />
        </div>

        <div className="relative px-6 py-7 sm:px-8 sm:py-8">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-2">
              <p className="flex h-7 w-7 items-center font-playfair justify-center rounded-md bg-[#2A2121] text-[#f9f8f6] text-sm font-medium text-center">
                Æ
              </p>
              <p className="text-sm font-playfair text-[#2A2121]/80">AetherLabs</p>
            </div>
            <div className="h-10 w-10 rounded-full border border-[#2A2121]/20 bg-[#f7f4ef]/60 p-1">
              <div className="flex h-full w-full items-center justify-center rounded-full border border-[#2A2121]/20 text-[8px] uppercase tracking-[0.2em] text-[#2A2121]/70">
                Verified
              </div>
            </div>
          </div>

          <div className="mt-6">
            <h2 className="text-[28px] font-semibold tracking-tight text-[#2A2121] sm:text-[32px]">
              {artworkData.title || 'Untitled Artwork'}
            </h2>
            <p className="mt-1 text-sm text-[#2A2121]/70">
              {artworkData.artistName || 'Unknown Artist'}
            </p>
          </div>

          <div className="mt-5 flex flex-wrap gap-2 text-[11px] uppercase tracking-[0.22em] text-[#2A2121]/55">
            <span className="rounded-full border border-[#2A2121]/20 bg-white/50 px-3 py-1">Certificate</span>
            <span className="rounded-full border border-[#2A2121]/20 bg-white/50 px-3 py-1">Studio Access</span>
            <span className="rounded-full border border-[#2A2121]/20 bg-white/50 px-3 py-1">Registry</span>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 text-sm text-[#2A2121]/70 sm:grid-cols-2">
            <div className="rounded-2xl border border-[#2A2121]/10 bg-white/50 px-4 py-3">
              <p className="text-[11px] uppercase tracking-[0.22em] text-[#2A2121]/45">Certificate ID</p>
              <p className="mt-1 font-mono text-[13px] text-[#2A2121]">{certificateData.certificateId}</p>
            </div>
            <div className="rounded-2xl border border-[#2A2121]/10 bg-white/50 px-4 py-3">
              <p className="text-[11px] uppercase tracking-[0.22em] text-[#2A2121]/45">Issued</p>
              <p className="mt-1 text-[13px] text-[#2A2121]">{formatDate(certificateData.generatedAt)}</p>
            </div>
            <div className="rounded-2xl border border-[#2A2121]/10 bg-white/50 px-4 py-3">
              <p className="text-[11px] uppercase tracking-[0.22em] text-[#2A2121]/45">Medium</p>
              <p className="mt-1 text-[13px] text-[#2A2121]">{artworkData.medium || 'N/A'}</p>
            </div>
            <div className="rounded-2xl border border-[#2A2121]/10 bg-white/50 px-4 py-3">
              <p className="text-[11px] uppercase tracking-[0.22em] text-[#2A2121]/45">Dimensions</p>
              <p className="mt-1 text-[13px] text-[#2A2121]">{artworkData.dimensions || 'N/A'}</p>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-[#2A2121]/70">
              <CheckCircle className="h-4 w-4 text-[#BC8010]" />
              Authenticated record
            </div>
            <div className="rounded-2xl border border-[#2A2121]/10 bg-white/60 p-2">
              <QRCodeSVG
                value={certificateData.qrCodeUrl}
                size={64}
                level="M"
                fgColor="#2A2121"
                bgColor="transparent"
              />
            </div>
          </div>

          {verificationLevel.hasNFC && verificationLevel.nfcUid && (
            <div className="mt-4 text-xs text-[#2A2121]/60">
              NFC Tag: <span className="font-mono text-[#2A2121]">{verificationLevel.nfcUid}</span>
            </div>
          )}
        </div>
      </motion.div>

      {/* Action Buttons */}
      {showActions && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="flex justify-center gap-4 mt-6"
        >
          <Button
            onClick={onDownload}
            className="bg-[#2A2121] hover:bg-[#2A2121]/90 text-white"
          >
            <Download className="w-4 h-4 mr-2" />
            Download PDF
          </Button>
          <Button
            variant="outline"
            onClick={handleCopy}
            className="border-[#2A2121] dark:border-[#BC8010] hover:bg-[#BC8010]/10"
          >
            <Copy className="w-4 h-4 mr-2" />
            Copy ID
          </Button>
        </motion.div>
      )}
    </div>
  )
}

export default COACertificateElegant
