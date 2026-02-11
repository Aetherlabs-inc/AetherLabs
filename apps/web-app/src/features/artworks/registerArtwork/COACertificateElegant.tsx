'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Copy, Download } from 'lucide-react'
import { Button } from '@aetherlabs/ui'
import { QRCodeSVG } from 'qrcode.react'
import Image from 'next/image'
import { CertificateTemplateConfig } from '@/src/types/database'

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
  templateConfig?: CertificateTemplateConfig
  showActions?: boolean
  onDownload?: () => void
  onCopy?: () => void
  className?: string
}

const defaultConfig: CertificateTemplateConfig = {
  colors: {
    background: '#e8e4dc',
    text: '#3d3a35',
    accent: '#6b665c',
    border: '#c4bfb5',
  },
  font: 'playfair',
  show_qr: true,
  show_seal: true,
  background_blur: 4,
  invert_background: true,
  background_opacity: 90,
}

const fontClasses: Record<string, string> = {
  'playfair': 'font-playfair',
  'cormorant': 'font-serif',
  'libre-baskerville': 'font-serif',
  'inter': 'font-sans',
  'dm-sans': 'font-sans',
}

const getVerificationLabel = (level: string) => {
  switch (level) {
    case 'third_party_verified':
      return 'EXPERT VERIFIED'
    case 'gallery_verified':
      return 'GALLERY VERIFIED'
    case 'artist_verified':
      return 'ARTIST VERIFIED'
    default:
      return 'REGISTERED'
  }
}

const COACertificateElegant: React.FC<COACertificateElegantProps> = ({
  artworkData,
  certificateData,
  verificationLevel = { level: 'artist_verified', hasNFC: false },
  templateConfig,
  showActions = true,
  onDownload,
  onCopy,
  className = ''
}) => {
  const config = { ...defaultConfig, ...templateConfig }
  const { colors, font, show_qr, show_seal, background_blur, invert_background, background_opacity } = config
  const fontClass = fontClasses[font] || 'font-playfair'

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    }) + "'" + date.getFullYear().toString().slice(-2)
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    })
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(certificateData.certificateId)
    onCopy?.()
  }

  const verificationLabel = getVerificationLabel(verificationLevel.level)

  // Subtle noise texture
  const noiseSvg = `<svg xmlns='http://www.w3.org/2000/svg' width='300' height='300' viewBox='0 0 300 300'><filter id='noise'><feTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='300' height='300' filter='url(%23noise)' opacity='0.035'/></svg>`
  const noiseUrl = `url("data:image/svg+xml;utf8,${encodeURIComponent(noiseSvg)}")`

  // Dynamic styles based on config
  const bgImageFilter = [
    invert_background ? 'invert' : '',
    `blur(${background_blur}px)`,
    'brightness-90',
    'contrast-125',
    'saturate-150',
  ].filter(Boolean).join(' ')

  return (
    <div className={`relative ${className} w-full`}>
      {/* Main Certificate Card */}
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="relative max-w-[480px] sm:max-w-[420px] mx-auto"
      >
        {/* Card */}
        <div
          className="relative overflow-hidden rounded-[20px] shadow-[0_20px_60px_rgba(0,0,0,0.12),0_8px_24px_rgba(0,0,0,0.08)] w-full"
          style={{ backgroundColor: colors.background }}
        >
          {/* Artwork background */}
          {artworkData.imageUrl && (
            <div className="absolute inset-0 overflow-hidden">
              {/* Use img tag for data URLs, Next Image for regular URLs */}
              {artworkData.imageUrl.startsWith('data:') ? (
                <img
                  src={artworkData.imageUrl}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover"
                  style={{
                    filter: `${invert_background ? 'invert(1)' : ''} blur(${background_blur}px) brightness(0.9) contrast(1.25) saturate(1.5)`,
                    opacity: background_opacity / 100,
                  }}
                />
              ) : (
                <Image
                  src={artworkData.imageUrl}
                  alt=""
                  fill
                  className="object-cover"
                  style={{
                    filter: `${invert_background ? 'invert(1)' : ''} blur(${background_blur}px) brightness(0.9) contrast(1.25) saturate(1.5)`,
                    opacity: background_opacity / 100,
                  }}
                />
              )}
            </div>
          )}

          {/* Noise texture overlay */}
          <div
            className="absolute inset-0 pointer-events-none z-10"
            style={{ backgroundImage: noiseUrl }}
          />

          {/* Content */}
          <div className="relative z-20 px-7 py-8 sm:px-8 sm:py-9">
            {/* Header - Logo and Seal */}
            <div className="flex items-start justify-between">
              {/* Logo mark */}
              <Image
                src="/aetherlabs-logo.png"
                alt="AetherLabs Logo"
                width={40}
                height={40}
                className="object-cover"
              />

              {/* Embossed circular seal */}
              {show_seal && (
                <div className="relative h-[72px] w-[72px]">
                  {/* Outer ring with text */}
                  <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full">
                    <defs>
                      <path
                        id="circlePath"
                        d="M 50,50 m -37,0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0"
                      />
                    </defs>
                    {/* Outer circle */}
                    <circle
                      cx="50"
                      cy="50"
                      r="46"
                      fill="none"
                      stroke={colors.border}
                      strokeWidth="1"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="42"
                      fill="none"
                      stroke={colors.border}
                      strokeWidth="0.5"
                    />
                    {/* Curved text */}
                    <text
                      className="text-[9px] uppercase tracking-[0.15em]"
                      style={{ fill: colors.accent }}
                    >
                      <textPath href="#circlePath" startOffset="0%">
                        Certificate of Authenticity
                      </textPath>
                    </text>
                  </svg>
                  {/* Inner content */}
                  <div
                    className="absolute inset-[14px] rounded-full flex flex-col items-center justify-center"
                    style={{
                      borderColor: colors.border,
                      borderWidth: 1,
                      backgroundColor: `${colors.background}80`,
                    }}
                  >
                    <span
                      className={`text-[18px] ${fontClass} font-semibold`}
                      style={{ color: colors.accent }}
                    >
                      Æ
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Artist Name - Large bold text */}
            <h2
              className={`mt-7 text-[32px] sm:text-[36px] ${fontClass} font-bold tracking-tight leading-[1.1]`}
              style={{ color: colors.text }}
            >
              {artworkData.artistName || 'Unknown Artist'}
            </h2>

            {/* Title */}
            <p
              className="mt-1 text-[15px] italic"
              style={{ color: colors.accent }}
            >
              {artworkData.title || 'Untitled Artwork'}
              {artworkData.year && <span className="not-italic">, {artworkData.year}</span>}
            </p>

            {/* Status pills */}
            <div className="mt-5 flex flex-wrap gap-2">
              <span
                className="inline-flex items-center px-4 py-1.5 rounded-full text-[11px] font-semibold uppercase tracking-[0.1em]"
                style={{
                  borderColor: colors.border,
                  borderWidth: 1,
                  backgroundColor: `${colors.background}80`,
                  color: colors.text,
                }}
              >
                {verificationLabel}
              </span>
              <span
                className="inline-flex items-center px-4 py-1.5 rounded-full font-mono text-[11px] uppercase tracking-wide"
                style={{
                  borderColor: colors.border,
                  borderWidth: 1,
                  backgroundColor: `${colors.background}80`,
                  color: colors.text,
                }}
              >
                #{certificateData.certificateId.slice(0, 8).toUpperCase()}
              </span>
            </div>

            {/* Details grid */}
            <div className="mt-7 flex justify-between items-end">
              <div className="space-y-1.5">
                <p
                  className="text-[11px] uppercase tracking-[0.12em]"
                  style={{ color: colors.accent }}
                >
                  {artworkData.medium || 'Mixed Media'}
                </p>
                <p
                  className="text-[11px] uppercase tracking-[0.12em]"
                  style={{ color: colors.accent }}
                >
                  {artworkData.dimensions || 'Dimensions vary'}
                </p>
                <p
                  className="text-[11px] uppercase tracking-[0.12em]"
                  style={{ color: colors.accent }}
                >
                  ISSUED {formatDate(certificateData.generatedAt)}
                </p>
                <p
                  className="text-[11px] uppercase tracking-[0.12em]"
                  style={{ color: colors.accent }}
                >
                  {formatTime(certificateData.generatedAt)}
                </p>
              </div>

              <div className="text-right">
                <p
                  className="text-[11px] uppercase tracking-[0.12em] font-medium"
                  style={{ color: colors.accent }}
                >
                  {verificationLevel.hasNFC ? 'NFC LINKED' : 'RECORD ACTIVE'}
                </p>
              </div>
            </div>

            {/* QR Code section */}
            <div
              className="mt-6 pt-5"
              style={{ borderTopColor: `${colors.border}99`, borderTopWidth: 1 }}
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <p
                    className="text-[10px] uppercase tracking-[0.15em] font-medium"
                    style={{ color: colors.accent }}
                  >
                    Registry Hash
                  </p>
                  <p
                    className="mt-1 font-mono text-[9px] break-all leading-relaxed"
                    style={{ color: colors.accent }}
                  >
                    {certificateData.blockchainHash.slice(0, 32)}...
                  </p>
                  {verificationLevel.hasNFC && verificationLevel.nfcUid && (
                    <>
                      <p
                        className="mt-2 text-[10px] uppercase tracking-[0.15em] font-medium"
                        style={{ color: colors.accent }}
                      >
                        NFC UID
                      </p>
                      <p
                        className="mt-0.5 font-mono text-[9px]"
                        style={{ color: colors.accent }}
                      >
                        {verificationLevel.nfcUid}
                      </p>
                    </>
                  )}
                </div>

                {/* QR Code */}
                {show_qr && (
                  <div className="shrink-0 p-2 rounded-xl bg-white/80 shadow-sm">
                    <QRCodeSVG
                      value={certificateData.qrCodeUrl}
                      size={64}
                      level="M"
                      fgColor={colors.text}
                      bgColor="transparent"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Verify button */}
            <button
              className="mt-5 w-full py-3 rounded-full bg-transparent text-[11px] font-semibold uppercase tracking-[0.15em] transition-colors hover:opacity-80"
              style={{
                borderColor: colors.border,
                borderWidth: 1,
                color: colors.text,
              }}
            >
              Verify Authenticity
            </button>
          </div>
        </div>
      </motion.div>

      {/* Action Buttons */}
      {showActions && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="flex justify-center gap-3 mt-8"
        >
          <Button
            onClick={onDownload}
            className="shadow-lg shadow-black/10 transition-all"
            style={{ backgroundColor: colors.text, color: colors.background }}
          >
            <Download className="w-4 h-4 mr-2" />
            Download PDF
          </Button>
          <Button
            variant="outline"
            onClick={handleCopy}
            className="transition-all"
            style={{ borderColor: colors.border, color: colors.text }}
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

// Export the default config for the designer
export { defaultConfig as defaultCertificateConfig }
