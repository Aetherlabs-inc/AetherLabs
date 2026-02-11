'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import { verificationService, VerificationResult } from '@/src/services/verification-service'

export default function VerificationPage() {
  const params = useParams()
  const code = params.code as string

  const [result, setResult] = useState<VerificationResult | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const verify = async () => {
      try {
        setLoading(true)

        // Verify the artwork by code
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

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-stone-50 to-stone-100 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-stone-300 border-t-amber-600 mb-4" />
          <p className="text-stone-600">Verifying artwork...</p>
        </div>
      </div>
    )
  }

  // Error states
  if (!result || !result.valid) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-stone-50 to-stone-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
            <svg className="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>

          <h1 className="text-xl font-semibold text-stone-900 mb-2">Verification Failed</h1>

          <p className="text-stone-600 mb-6">
            {result?.error === 'not_found' && 'This artwork could not be found in our registry.'}
            {result?.error === 'rate_limited' && 'Too many verification attempts. Please try again later.'}
            {!result?.error && 'Unable to verify this artwork.'}
          </p>

          <div className="pt-4 border-t border-stone-200">
            <p className="text-sm text-stone-500">
              If you believe this is an error, please contact the artwork owner.
            </p>
          </div>
        </div>
      </div>
    )
  }

  // Success state
  const { artwork, certificate } = result

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-50 to-stone-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* Header with checkmark */}
        <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <h1 className="text-white font-semibold">Authenticated Artwork</h1>
              <p className="text-emerald-100 text-sm">Verified by AetherLabs</p>
            </div>
          </div>
        </div>

        {/* Artwork image */}
        {artwork?.image_url && (
          <div className="relative aspect-square bg-stone-100">
            <Image
              src={artwork.image_url}
              alt={artwork.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 400px"
            />
          </div>
        )}

        {/* Artwork info */}
        <div className="p-6">
          <h2 className="text-xl font-semibold text-stone-900 mb-1">&ldquo;{artwork?.title}&rdquo;</h2>

          {artwork?.artist && <p className="text-stone-600 mb-1">by {artwork.artist}</p>}

          {artwork?.year && <p className="text-stone-500 text-sm">{artwork.year}</p>}

          {/* Certificate badge */}
          {certificate && (
            <div className="mt-4 pt-4 border-t border-stone-200">
              <div className="flex items-center gap-2 text-sm text-stone-600">
                <svg className="w-4 h-4 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Certificate of Authenticity on file</span>
              </div>
            </div>
          )}
        </div>

        {/* App download CTA */}
        <div className="px-6 pb-6">
          <div className="bg-stone-50 rounded-xl p-4 text-center">
            <p className="text-sm text-stone-600 mb-3">Get the full certificate and provenance history</p>
            <a
              href="https://aetherlabs.art"
              className="inline-flex items-center justify-center gap-2 bg-stone-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-stone-800 transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
              </svg>
              Download AetherLabs App
            </a>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 pb-6">
          <div className="flex items-center justify-center gap-2 text-xs text-stone-400">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="12" cy="12" r="10" strokeWidth="1.5" />
              <path strokeLinecap="round" strokeWidth="1.5" d="M12 6v6l4 2" />
            </svg>
            <span>Verified at {new Date().toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
