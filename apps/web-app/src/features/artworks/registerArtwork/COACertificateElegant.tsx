'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Shield, CheckCircle, Wifi, Copy, Download } from 'lucide-react'
import { Button } from '@aetherlabs/ui'
import { QRCodeSVG } from 'qrcode.react'

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

// Decorative corner component
const CornerDecoration = ({ position }: { position: 'tl' | 'tr' | 'bl' | 'br' }) => {
  const rotations = {
    tl: 'rotate-0',
    tr: 'rotate-90',
    bl: '-rotate-90',
    br: 'rotate-180'
  }
  const positions = {
    tl: 'top-0 left-0',
    tr: 'top-0 right-0',
    bl: 'bottom-0 left-0',
    br: 'bottom-0 right-0'
  }

  return (
    <div className={`absolute ${positions[position]} w-16 h-16 ${rotations[position]}`}>
      <svg viewBox="0 0 64 64" className="w-full h-full text-[#BC8010]">
        <path
          d="M0 0 L24 0 L24 2 L2 2 L2 24 L0 24 Z"
          fill="currentColor"
        />
        <path
          d="M8 0 L8 2 L2 2 L2 8 L0 8 L0 0 Z"
          fill="currentColor"
          opacity="0.3"
          transform="translate(4, 4)"
        />
      </svg>
    </div>
  )
}

// Ornamental divider
const OrnamentalDivider = () => (
  <div className="flex items-center justify-center gap-4 my-6">
    <div className="h-px bg-gradient-to-r from-transparent via-[#BC8010]/40 to-transparent flex-1" />
    <div className="flex items-center gap-2">
      <div className="w-1.5 h-1.5 bg-[#BC8010] rotate-45" />
      <div className="w-2 h-2 border border-[#BC8010] rotate-45" />
      <div className="w-1.5 h-1.5 bg-[#BC8010] rotate-45" />
    </div>
    <div className="h-px bg-gradient-to-r from-transparent via-[#BC8010]/40 to-transparent flex-1" />
  </div>
)

const COACertificateElegant: React.FC<COACertificateElegantProps> = ({
  artworkData,
  certificateData,
  verificationLevel = { level: 'artist_verified', hasNFC: false },
  showActions = true,
  onDownload,
  onCopy,
  className = ''
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(certificateData.certificateId)
    onCopy?.()
  }

  return (
    <div className={`relative ${className}`}>
      {/* Main Certificate */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative bg-[#FEFDFB] dark:bg-[#1a1817] border-2 border-[#2A2121] dark:border-[#BC8010]/30 p-8 md:p-12 max-w-3xl mx-auto shadow-2xl"
      >
        {/* Corner Decorations */}
        <CornerDecoration position="tl" />
        <CornerDecoration position="tr" />
        <CornerDecoration position="bl" />
        <CornerDecoration position="br" />

        {/* Inner Border */}
        <div className="absolute inset-4 border border-[#2A2121]/10 dark:border-[#BC8010]/10 pointer-events-none" />

        {/* Certificate Header */}
        <div className="text-center mb-8 pt-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#2A2121] dark:bg-[#BC8010] mb-4">
              <Shield className="w-7 h-7 text-white dark:text-[#2A2121]" />
            </div>
          </motion.div>

          <h1 className="text-xs tracking-[0.4em] text-[#BC8010] uppercase mb-2 font-medium">
            AetherLabs
          </h1>
          <h2 className="text-2xl md:text-3xl font-light tracking-wide text-[#2A2121] dark:text-white uppercase">
            Certificate of Authenticity
          </h2>
          <p className="text-xs text-[#2A2121]/60 dark:text-white/50 mt-2 tracking-wider">
            Digital Art Registry • Blockchain Verified
          </p>
        </div>

        <OrnamentalDivider />

        {/* Certificate Body */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Left: Artwork Image */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col"
          >
            <div className="relative aspect-[4/5] bg-[#f5f3f0] dark:bg-[#2A2121] border border-[#2A2121]/10 dark:border-[#BC8010]/20 overflow-hidden">
              {artworkData.imageUrl ? (
                <img
                  src={artworkData.imageUrl}
                  alt={artworkData.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center text-[#2A2121]/30 dark:text-white/30">
                    <Shield className="w-12 h-12 mx-auto mb-2" />
                    <p className="text-sm">Artwork Image</p>
                  </div>
                </div>
              )}
              {/* Image overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent pointer-events-none" />
            </div>
          </motion.div>

          {/* Right: Artwork Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-col justify-center"
          >
            {/* Title */}
            <div className="mb-6">
              <p className="text-xs text-[#BC8010] uppercase tracking-wider mb-1">Artwork Title</p>
              <h3 className="text-xl md:text-2xl font-semibold text-[#2A2121] dark:text-white leading-tight">
                {artworkData.title}
              </h3>
            </div>

            {/* Artist */}
            <div className="mb-6">
              <p className="text-xs text-[#BC8010] uppercase tracking-wider mb-1">Artist</p>
              <p className="text-lg text-[#2A2121] dark:text-white">
                {artworkData.artistName || 'Unknown Artist'}
              </p>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-xs text-[#2A2121]/50 dark:text-white/50 uppercase tracking-wider mb-1">Year</p>
                <p className="text-sm text-[#2A2121] dark:text-white font-medium">
                  {artworkData.year || 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-xs text-[#2A2121]/50 dark:text-white/50 uppercase tracking-wider mb-1">Medium</p>
                <p className="text-sm text-[#2A2121] dark:text-white font-medium">
                  {artworkData.medium || 'N/A'}
                </p>
              </div>
              <div className="col-span-2">
                <p className="text-xs text-[#2A2121]/50 dark:text-white/50 uppercase tracking-wider mb-1">Dimensions</p>
                <p className="text-sm text-[#2A2121] dark:text-white font-medium">
                  {artworkData.dimensions || 'N/A'}
                </p>
              </div>
            </div>

            {/* Verification Badges */}
            <div className="flex flex-wrap gap-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#2A2121] dark:bg-[#BC8010] text-white dark:text-[#2A2121] text-xs rounded-full">
                <CheckCircle className="w-3 h-3" />
                <span className="font-medium">Authenticated</span>
              </div>
              {verificationLevel.hasNFC && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#BC8010]/10 text-[#BC8010] text-xs rounded-full border border-[#BC8010]/30">
                  <Wifi className="w-3 h-3" />
                  <span className="font-medium">NFC Linked</span>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        <OrnamentalDivider />

        {/* Certificate Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          {/* QR Code */}
          <div className="flex flex-col items-center text-center">
            <div className="bg-white p-3 rounded-lg shadow-sm border border-[#2A2121]/10 mb-3">
              <QRCodeSVG
                value={certificateData.qrCodeUrl}
                size={100}
                level="M"
                fgColor="#2A2121"
                bgColor="#FFFFFF"
              />
            </div>
            <p className="text-xs text-[#2A2121]/60 dark:text-white/50">
              Scan to Verify
            </p>
          </div>

          {/* Certificate Info */}
          <div className="flex flex-col justify-center md:col-span-2">
            <div className="space-y-3">
              <div>
                <p className="text-xs text-[#2A2121]/50 dark:text-white/50 uppercase tracking-wider mb-0.5">
                  Certificate ID
                </p>
                <p className="text-sm font-mono text-[#2A2121] dark:text-white font-medium">
                  {certificateData.certificateId}
                </p>
              </div>
              <div>
                <p className="text-xs text-[#2A2121]/50 dark:text-white/50 uppercase tracking-wider mb-0.5">
                  Issue Date
                </p>
                <p className="text-sm text-[#2A2121] dark:text-white">
                  {formatDate(certificateData.generatedAt)}
                </p>
              </div>
              <div>
                <p className="text-xs text-[#2A2121]/50 dark:text-white/50 uppercase tracking-wider mb-0.5">
                  Blockchain Signature
                </p>
                <p className="text-xs font-mono text-[#2A2121]/70 dark:text-white/70 break-all">
                  {certificateData.blockchainHash.slice(0, 32)}...
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Footer */}
        <div className="text-center pt-4 border-t border-[#2A2121]/10 dark:border-[#BC8010]/20">
          <p className="text-xs text-[#2A2121]/50 dark:text-white/40 max-w-md mx-auto leading-relaxed">
            This certificate is digitally signed and recorded on the blockchain.
            The authenticity of this artwork can be verified at any time using the QR code above
            or by visiting <span className="text-[#BC8010]">aetherlabs.art/verify</span>
          </p>

          {/* NFC UID if available */}
          {verificationLevel.hasNFC && verificationLevel.nfcUid && (
            <p className="text-xs text-[#BC8010] mt-2 font-mono">
              NFC Tag: {verificationLevel.nfcUid}
            </p>
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
