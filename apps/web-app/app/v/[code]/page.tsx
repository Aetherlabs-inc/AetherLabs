'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import { verificationService, type VerificationResult } from '@/src/services/verification-service'

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
    </svg>
  )
}

function ShieldIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
    </svg>
  )
}

function NfcIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.288 15.038a5.25 5.25 0 017.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0M12.53 18.22l-.53.53-.53-.53a.75.75 0 011.06 0z" />
    </svg>
  )
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export default function VerificationPage() {
  const params = useParams()
  const code = params.code as string

  const [result, setResult] = useState<VerificationResult | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const verify = async () => {
      try {
        setLoading(true)
        const verificationResult = await verificationService.verifyByCode(code, undefined, undefined, {
          scanType: 'web',
          userAgent: typeof window !== 'undefined' ? navigator.userAgent : undefined,
        })
        setResult(verificationResult)
      } catch (error) {
        console.error('Verification error:', error)
        setResult({ valid: false, error: 'not_found' })
      } finally {
        setLoading(false)
      }
    }

    if (code) {
      verify()
    }
  }, [code])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-stone-50 to-stone-100 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-stone-300 border-t-amber-600 mb-4" />
          <p className="text-stone-600 text-sm">Verifying certificate&hellip;</p>
        </div>
      </div>
    )
  }

  if (!result || !result.valid) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-stone-50 to-stone-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-50 flex items-center justify-center">
            <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="text-xl font-semibold text-stone-900 mb-2">Certificate Not Found</h1>
          <p className="text-stone-500 mb-6">
            {result?.error === 'not_found' && 'This certificate could not be found in the AetherLabs registry.'}
            {result?.error === 'rate_limited' && 'Too many verification attempts. Please try again later.'}
            {!result?.error && 'Unable to verify this certificate.'}
          </p>
          <div className="pt-4 border-t border-stone-100">
            <p className="text-xs text-stone-400">
              If you believe this is an error, please contact the artwork owner or visit{' '}
              <a href="https://aetherlabs.art" className="text-amber-600 hover:underline">aetherlabs.art</a>
            </p>
          </div>
        </div>
      </div>
    )
  }

  const { artwork, certificate, nfcLinked, verificationMethod } = result
  const isPhysicallyVerified = verificationMethod === 'nfc_scan'

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-50 to-stone-100">
      {/* Top bar */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-stone-200/60 sticky top-0 z-50">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Image
              src="/aetherlabs-logo.png"
              alt="AetherLabs"
              width={28}
              height={28}
              className="rounded"
            />
            <span className="text-sm font-semibold text-stone-800 tracking-tight">AetherLabs</span>
          </div>
          {isPhysicallyVerified ? (
            <div className="flex items-center gap-1.5 text-emerald-600 text-xs font-medium bg-emerald-50 px-2.5 py-1 rounded-full">
              <CheckIcon className="w-3.5 h-3.5" />
              Physically verified
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-amber-600 text-xs font-medium bg-amber-50 px-2.5 py-1 rounded-full">
              Shared link
            </div>
          )}
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        {/* Verification banner */}
        {isPhysicallyVerified ? (
          <div className="bg-emerald-600 rounded-2xl p-5 text-white shadow-lg shadow-emerald-600/20">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                <ShieldIcon className="w-5 h-5" />
              </div>
              <div>
                <h1 className="font-semibold text-lg leading-tight">Authenticated Artwork</h1>
                <p className="text-emerald-100 text-sm">Verified by scanning the NFC tag on the physical artwork</p>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-white/20 text-emerald-100 text-xs">
              <NfcIcon className="w-4 h-4" />
              <span>This page opened via NFC scan — physical artwork present</span>
            </div>
          </div>
        ) : (
          <div className="bg-amber-50 border border-amber-200/80 rounded-2xl p-5 text-amber-900">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                <ShieldIcon className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <h1 className="font-semibold text-lg leading-tight">Certificate View</h1>
                <p className="text-amber-800 text-sm">This link was shared — not physically verified</p>
              </div>
            </div>
            {nfcLinked ? (
              <div className="mt-3 pt-3 border-t border-amber-200/60 text-amber-800 text-sm">
                <p className="font-medium">To verify physical authenticity:</p>
                <p className="mt-1 text-amber-700">Scan the NFC tag on the artwork with your phone. Opening via NFC scan confirms you are viewing the genuine physical object.</p>
              </div>
            ) : (
              <div className="mt-3 pt-3 border-t border-amber-200/60 text-amber-800 text-sm">
                <p>This certificate is on file. Scan the artwork&apos;s NFC tag (when linked) to verify physical authenticity.</p>
              </div>
            )}
          </div>
        )}

        {/* Artwork card */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-stone-200/60">
          {artwork?.image_url && (
            <div className="relative aspect-[4/3] bg-stone-100">
              <Image
                src={artwork.image_url}
                alt={artwork.title}
                fill
                className="object-cover"
                sizes="(max-width: 672px) 100vw, 672px"
              />
            </div>
          )}

          <div className="p-6">
            <h2 className="text-2xl font-bold text-stone-900 leading-tight">
              &ldquo;{artwork?.title}&rdquo;
            </h2>
            {artwork?.artist && (
              <p className="text-stone-600 mt-1 text-lg">by {artwork.artist}</p>
            )}

            <div className="mt-5 grid grid-cols-2 gap-4">
              {artwork?.year && (
                <div>
                  <p className="text-[11px] uppercase tracking-wider text-stone-400 font-medium">Year</p>
                  <p className="text-stone-800 text-sm font-medium mt-0.5">{artwork.year}</p>
                </div>
              )}
              {artwork?.medium && (
                <div>
                  <p className="text-[11px] uppercase tracking-wider text-stone-400 font-medium">Medium</p>
                  <p className="text-stone-800 text-sm font-medium mt-0.5">{artwork.medium}</p>
                </div>
              )}
              {artwork?.dimensions && (
                <div>
                  <p className="text-[11px] uppercase tracking-wider text-stone-400 font-medium">Dimensions</p>
                  <p className="text-stone-800 text-sm font-medium mt-0.5">{artwork.dimensions}</p>
                </div>
              )}
              {artwork?.status && (
                <div>
                  <p className="text-[11px] uppercase tracking-wider text-stone-400 font-medium">Status</p>
                  <p className="text-stone-800 text-sm font-medium mt-0.5 capitalize">
                    {artwork.status.replace(/_/g, ' ')}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Certificate details */}
        {certificate && (
          <div className="bg-white rounded-2xl shadow-sm border border-stone-200/60 p-6">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center">
                <svg className="w-4 h-4 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <h3 className="font-semibold text-stone-900">Certificate of Authenticity</h3>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <span className="text-xs uppercase tracking-wider text-stone-400 font-medium">Certificate ID</span>
                <span className="font-mono text-xs text-stone-700 text-right max-w-[60%] break-all">
                  {certificate.certificate_id}
                </span>
              </div>

              <div className="border-t border-stone-100" />

              <div className="flex justify-between items-start">
                <span className="text-xs uppercase tracking-wider text-stone-400 font-medium">Issued</span>
                <span className="text-sm text-stone-700">{formatDate(certificate.generated_at)}</span>
              </div>

              {certificate.blockchain_hash && (
                <>
                  <div className="border-t border-stone-100" />
                  <div>
                    <span className="text-xs uppercase tracking-wider text-stone-400 font-medium block mb-1">
                      Registry Hash
                    </span>
                    <p className="font-mono text-[10px] text-stone-500 break-all leading-relaxed">
                      {certificate.blockchain_hash}
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="bg-white rounded-2xl shadow-sm border border-stone-200/60 p-6 text-center">
          <p className="text-sm text-stone-500 mb-4">
            Register and authenticate your artworks with AetherLabs
          </p>
          <a
            href="https://aetherlabs.art"
            className="inline-flex items-center justify-center gap-2 bg-stone-900 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-stone-800 transition-colors"
          >
            Visit AetherLabs
          </a>
        </div>

        {/* Footer */}
        <div className="text-center pb-4">
          <p className="text-[11px] text-stone-400">
            Verified on {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            {' '}&middot;{' '}
            <a href="https://aetherlabs.art" className="hover:text-stone-600 transition-colors">aetherlabs.art</a>
          </p>
        </div>
      </main>
    </div>
  )
}
