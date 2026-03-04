'use client'

import React from 'react'
import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
  Font,
  pdf,
} from '@react-pdf/renderer'
import { saveAs } from 'file-saver'

// Register fonts (using system fonts for simplicity, can be replaced with custom fonts)
Font.register({
  family: 'Inter',
  fonts: [
    { src: 'https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuLyfAZ9hjp-Ek-_0ew.woff2', fontWeight: 400 },
    { src: 'https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuI6fAZ9hjp-Ek-_0ew.woff2', fontWeight: 500 },
    { src: 'https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuGKYAZ9hjp-Ek-_0ew.woff2', fontWeight: 600 },
    { src: 'https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuFuYAZ9hjp-Ek-_0ew.woff2', fontWeight: 700 },
  ],
})

// Brand colors
const colors = {
  dark: '#2A2121',
  gold: '#BC8010',
  terracotta: '#CA5B2B',
  cream: '#FEFDFB',
  gray: '#B0B0B0',
}

// PDF Styles
const styles = StyleSheet.create({
  page: {
    backgroundColor: colors.cream,
    padding: 40,
    fontFamily: 'Inter',
  },
  // Outer border
  outerBorder: {
    border: `2pt solid ${colors.dark}`,
    padding: 30,
    height: '100%',
  },
  // Inner border
  innerBorder: {
    border: `0.5pt solid ${colors.gold}`,
    padding: 20,
    height: '100%',
  },
  // Header
  header: {
    alignItems: 'center',
    marginBottom: 25,
  },
  logoContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.dark,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  logoText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 700,
  },
  brandName: {
    fontSize: 10,
    letterSpacing: 4,
    color: colors.gold,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  title: {
    fontSize: 22,
    fontWeight: 600,
    letterSpacing: 2,
    color: colors.dark,
    textTransform: 'uppercase',
  },
  subtitle: {
    fontSize: 8,
    color: colors.gray,
    marginTop: 6,
    letterSpacing: 2,
  },
  // Divider
  divider: {
    height: 1,
    backgroundColor: colors.gold,
    opacity: 0.3,
    marginVertical: 20,
  },
  ornamentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 15,
  },
  ornamentLine: {
    height: 0.5,
    backgroundColor: colors.gold,
    opacity: 0.4,
    flex: 1,
  },
  ornamentDot: {
    width: 4,
    height: 4,
    backgroundColor: colors.gold,
    transform: 'rotate(45deg)',
    marginHorizontal: 8,
  },
  // Main content
  contentRow: {
    flexDirection: 'row',
    gap: 25,
    marginBottom: 20,
  },
  imageColumn: {
    width: '40%',
  },
  detailsColumn: {
    width: '60%',
    justifyContent: 'center',
  },
  artworkImage: {
    width: '100%',
    aspectRatio: 0.8,
    objectFit: 'cover',
    border: `0.5pt solid ${colors.dark}`,
  },
  imagePlaceholder: {
    width: '100%',
    aspectRatio: 0.8,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
    border: `0.5pt solid ${colors.dark}`,
  },
  placeholderText: {
    fontSize: 10,
    color: colors.gray,
  },
  // Detail labels
  detailSection: {
    marginBottom: 12,
  },
  detailLabel: {
    fontSize: 8,
    color: colors.gold,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: 3,
  },
  detailValue: {
    fontSize: 14,
    color: colors.dark,
    fontWeight: 500,
  },
  detailValueLarge: {
    fontSize: 18,
    color: colors.dark,
    fontWeight: 600,
  },
  detailGrid: {
    flexDirection: 'row',
    gap: 20,
  },
  detailGridItem: {
    flex: 1,
  },
  // Badges
  badgeContainer: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  badge: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 10,
    backgroundColor: colors.dark,
  },
  badgeText: {
    fontSize: 8,
    color: 'white',
    fontWeight: 500,
  },
  badgeOutline: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 10,
    border: `0.5pt solid ${colors.gold}`,
  },
  badgeOutlineText: {
    fontSize: 8,
    color: colors.gold,
    fontWeight: 500,
  },
  // Certificate details section
  certSection: {
    flexDirection: 'row',
    gap: 20,
    marginTop: 15,
  },
  qrContainer: {
    alignItems: 'center',
  },
  qrCode: {
    width: 80,
    height: 80,
    border: `0.5pt solid ${colors.dark}`,
    padding: 5,
    backgroundColor: 'white',
  },
  qrLabel: {
    fontSize: 7,
    color: colors.gray,
    marginTop: 4,
    textAlign: 'center',
  },
  certDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  certDetailRow: {
    marginBottom: 8,
  },
  certDetailLabel: {
    fontSize: 7,
    color: colors.gray,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 2,
  },
  certDetailValue: {
    fontSize: 10,
    color: colors.dark,
    fontWeight: 500,
  },
  hashValue: {
    fontSize: 7,
    color: colors.gray,
    fontFamily: 'Courier',
  },
  // Footer
  footer: {
    marginTop: 'auto',
    paddingTop: 15,
    borderTop: `0.5pt solid ${colors.gold}`,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 7,
    color: colors.gray,
    textAlign: 'center',
    maxWidth: 400,
    lineHeight: 1.5,
  },
  footerHighlight: {
    color: colors.gold,
  },
  nfcTag: {
    fontSize: 8,
    color: colors.gold,
    marginTop: 8,
    fontFamily: 'Courier',
  },
})

interface CertificateData {
  artworkData: {
    title: string
    year: string
    medium: string
    dimensions: string
    artistName: string
    imageUrl?: string
  }
  certificateData: {
    certificateId: string
    qrCodeUrl: string
    blockchainHash: string
    generatedAt: string
  }
  verificationLevel?: {
    hasNFC: boolean
    nfcUid?: string
  }
}

// Derive verify base from qrCodeUrl (e.g. https://app.aetherlabs.art/v)
function getVerifyBase(qrCodeUrl: string): string {
  try {
    return new URL(qrCodeUrl).origin + '/v'
  } catch {
    return 'https://app.aetherlabs.art/v'
  }
}

// The PDF Document component
const COACertificateDocument: React.FC<CertificateData> = ({
  artworkData,
  certificateData,
  verificationLevel,
}) => {
  const verifyBase = getVerifyBase(certificateData.qrCodeUrl)
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  // Generate QR code URL (using a QR code API for PDF)
  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(certificateData.qrCodeUrl)}&bgcolor=FFFFFF&color=2A2121`

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.outerBorder}>
          <View style={styles.innerBorder}>
            {/* Header */}
            <View style={styles.header}>
              <View style={styles.logoContainer}>
                <Text style={styles.logoText}>A</Text>
              </View>
              <Text style={styles.brandName}>AetherLabs</Text>
              <Text style={styles.title}>Certificate of Authenticity</Text>
              <Text style={styles.subtitle}>Digital Art Registry • Verified Record</Text>
            </View>

            {/* Ornamental Divider */}
            <View style={styles.ornamentContainer}>
              <View style={styles.ornamentLine} />
              <View style={styles.ornamentDot} />
              <View style={[styles.ornamentDot, { width: 5, height: 5, backgroundColor: 'transparent', border: `0.5pt solid ${colors.gold}` }]} />
              <View style={styles.ornamentDot} />
              <View style={styles.ornamentLine} />
            </View>

            {/* Main Content */}
            <View style={styles.contentRow}>
              {/* Artwork Image */}
              <View style={styles.imageColumn}>
                {artworkData.imageUrl ? (
                  <Image src={artworkData.imageUrl} style={styles.artworkImage} />
                ) : (
                  <View style={styles.imagePlaceholder}>
                    <Text style={styles.placeholderText}>Artwork Image</Text>
                  </View>
                )}
              </View>

              {/* Artwork Details */}
              <View style={styles.detailsColumn}>
                <View style={styles.detailSection}>
                  <Text style={styles.detailLabel}>Artwork Title</Text>
                  <Text style={styles.detailValueLarge}>{artworkData.title}</Text>
                </View>

                <View style={styles.detailSection}>
                  <Text style={styles.detailLabel}>Artist</Text>
                  <Text style={styles.detailValue}>{artworkData.artistName || 'Unknown Artist'}</Text>
                </View>

                <View style={styles.detailGrid}>
                  <View style={styles.detailGridItem}>
                    <Text style={styles.detailLabel}>Year</Text>
                    <Text style={styles.detailValue}>{artworkData.year || 'N/A'}</Text>
                  </View>
                  <View style={styles.detailGridItem}>
                    <Text style={styles.detailLabel}>Medium</Text>
                    <Text style={styles.detailValue}>{artworkData.medium || 'N/A'}</Text>
                  </View>
                </View>

                <View style={[styles.detailSection, { marginTop: 8 }]}>
                  <Text style={styles.detailLabel}>Dimensions</Text>
                  <Text style={styles.detailValue}>{artworkData.dimensions || 'N/A'}</Text>
                </View>

                {/* Badges */}
                <View style={styles.badgeContainer}>
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>✓ Authenticated</Text>
                  </View>
                  {verificationLevel?.hasNFC && (
                    <View style={styles.badgeOutline}>
                      <Text style={styles.badgeOutlineText}>NFC Linked</Text>
                    </View>
                  )}
                </View>
              </View>
            </View>

            {/* Ornamental Divider */}
            <View style={styles.ornamentContainer}>
              <View style={styles.ornamentLine} />
              <View style={styles.ornamentDot} />
              <View style={[styles.ornamentDot, { width: 5, height: 5, backgroundColor: 'transparent', border: `0.5pt solid ${colors.gold}` }]} />
              <View style={styles.ornamentDot} />
              <View style={styles.ornamentLine} />
            </View>

            {/* Certificate Details */}
            <View style={styles.certSection}>
              {/* QR Code */}
              <View style={styles.qrContainer}>
                <Image src={qrImageUrl} style={styles.qrCode} />
                <Text style={styles.qrLabel}>Scan to Verify</Text>
              </View>

              {/* Certificate Info */}
              <View style={styles.certDetails}>
                <View style={styles.certDetailRow}>
                  <Text style={styles.certDetailLabel}>Certificate ID</Text>
                  <Text style={styles.certDetailValue}>{certificateData.certificateId}</Text>
                </View>
                <View style={styles.certDetailRow}>
                  <Text style={styles.certDetailLabel}>Issue Date</Text>
                  <Text style={styles.certDetailValue}>{formatDate(certificateData.generatedAt)}</Text>
                </View>
                <View style={styles.certDetailRow}>
                  <Text style={styles.certDetailLabel}>Registry Signature</Text>
                  <Text style={styles.hashValue}>
                    {certificateData.blockchainHash.slice(0, 40)}...
                  </Text>
                </View>
              </View>
            </View>

            {/* Footer */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>
                This certificate is digitally signed and recorded in your registry.
                The authenticity of this artwork can be verified at any time by visiting{' '}
                <Text style={styles.footerHighlight}>{verifyBase.replace(/^https?:\/\//, '')}</Text>
              </Text>
              {verificationLevel?.hasNFC && verificationLevel?.nfcUid && (
                <Text style={styles.nfcTag}>NFC Tag: {verificationLevel.nfcUid}</Text>
              )}
            </View>
          </View>
        </View>
      </Page>
    </Document>
  )
}

// Function to generate and download PDF
export const downloadCertificatePDF = async (data: CertificateData) => {
  const blob = await pdf(<COACertificateDocument {...data} />).toBlob()
  const filename = `COA-${data.certificateData.certificateId}.pdf`
  saveAs(blob, filename)
}

// Export the document component for preview purposes
export default COACertificateDocument
