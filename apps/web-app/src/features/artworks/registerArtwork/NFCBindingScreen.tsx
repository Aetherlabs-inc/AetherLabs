'use client'

import React, { useState } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Button,
  Label,
  Switch,
  Input,
} from '@aetherlabs/ui'
import { Wifi, ArrowLeft, ArrowRight, CheckCircle, Smartphone, Shield, Info } from 'lucide-react'
import { generateVerificationCode } from '@/src/lib/crypto'

interface NFCBindingScreenProps {
  artworkData: {
    title: string
    year: string
    medium: string
    dimensions: string
  }
  coaData?: {
    certificateId: string
    qrCode: string
    blockchainHash: string
    generatedAt: string
  }
  onBack: () => void
  onComplete: (nfcData: NFCData) => void
  onSkip: (nfcData: NFCData) => void
}

export interface NFCData {
  nfcUid: string
  isBound: boolean
  bindingStatus: 'pending' | 'success' | 'failed'
  verificationCode?: string
  tagType?: 'standard' | 'ntag424'
}

const NFCBindingScreen: React.FC<NFCBindingScreenProps> = ({ artworkData, coaData, onBack, onComplete, onSkip }) => {
  const [bindNFC, setBindNFC] = useState(false)
  const [nfcUid, setNfcUid] = useState('')
  const [verificationCode] = useState(() => generateVerificationCode())

  const handleComplete = () => {
    onComplete({
      nfcUid: nfcUid || '',
      isBound: bindNFC && !!nfcUid,
      bindingStatus: bindNFC && nfcUid ? 'success' : 'pending',
      verificationCode: bindNFC ? verificationCode : undefined,
      tagType: 'standard',
    })
  }

  const handleSkip = () => {
    onSkip({
      nfcUid: '',
      isBound: false,
      bindingStatus: 'pending',
    })
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
            Back
          </Button>

          <div className="text-center">
            <h1 className="text-4xl font-bold text-foreground mb-4">NFC Tag Binding</h1>
            <p className="text-xl text-foreground">
              Bind an NFC tag to &quot;{artworkData.title}&quot; for physical verification
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* NFC Binding Options */}
          <Card className="border border-border bg-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <Wifi className="h-5 w-5" />
                NFC Tag Binding
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Link a physical NFC tag to this artwork for instant verification
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                {/* Enable NFC Binding Toggle */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Wifi className="h-5 w-5 text-foreground" />
                    <div>
                      <h4 className="font-semibold text-foreground">Bind NFC Tag</h4>
                      <p className="text-sm text-muted-foreground">Enable to link an NFC tag</p>
                    </div>
                  </div>
                  <Switch checked={bindNFC} onCheckedChange={setBindNFC} />
                </div>

                {bindNFC && (
                  <div className="space-y-4 pt-4 border-t border-border">
                    {/* NFC UID Input */}
                    <div className="space-y-2">
                      <Label htmlFor="nfcUid" className="text-foreground">
                        NFC Tag UID
                      </Label>
                      <Input
                        id="nfcUid"
                        value={nfcUid}
                        onChange={(e) => setNfcUid(e.target.value.toUpperCase().replace(/[^0-9A-F]/g, ''))}
                        placeholder="e.g., 04A8B1C2D3E4F5"
                        className="font-mono"
                        maxLength={14}
                      />
                      <p className="text-xs text-muted-foreground">
                        Enter the 7-byte UID from your NFC tag (14 hex characters). You can find this using a free NFC
                        reader app on your phone.
                      </p>
                    </div>

                    {/* How to find UID */}
                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <Info className="h-5 w-5 text-blue-600 mt-0.5" />
                        <div>
                          <h4 className="font-semibold text-foreground mb-1">How to find your tag&apos;s UID</h4>
                          <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                            <li>Download &quot;NFC Tools&quot; app (free on iOS/Android)</li>
                            <li>Open the app and tap &quot;Read&quot;</li>
                            <li>Hold your NFC tag to the back of your phone</li>
                            <li>Copy the &quot;Serial Number&quot; or &quot;UID&quot; value</li>
                          </ol>
                        </div>
                      </div>
                    </div>

                    {/* Verification Code Preview */}
                    {nfcUid && (
                      <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Shield className="h-5 w-5 text-emerald-600" />
                          <span className="font-semibold text-foreground">Verification Ready</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Once registered, anyone can verify this artwork by scanning the NFC tag or visiting:
                        </p>
                        <p className="text-sm font-mono mt-2 text-foreground bg-muted px-2 py-1 rounded">
                          aetherlabs.art/v/{verificationCode}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {!bindNFC && (
                  <div className="bg-muted border border-border rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Smartphone className="h-5 w-5 text-foreground" />
                      <span className="font-semibold text-foreground">NFC Binding Optional</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      You can skip this step and bind an NFC tag later from your artwork&apos;s detail page.
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Artwork & COA Summary */}
          <Card className="border border-border bg-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <Shield className="h-5 w-5" />
                Registration Summary
              </CardTitle>
              <CardDescription className="text-muted-foreground">Review your artwork details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div>
                  <Label className="text-muted-foreground">Artwork Title</Label>
                  <p className="font-semibold text-foreground">{artworkData.title}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground">Year</Label>
                    <p className="font-semibold text-foreground">{artworkData.year}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Medium</Label>
                    <p className="font-semibold text-foreground">{artworkData.medium}</p>
                  </div>
                </div>
                <div>
                  <Label className="text-muted-foreground">Dimensions</Label>
                  <p className="font-semibold text-foreground">{artworkData.dimensions}</p>
                </div>
              </div>

              {coaData && (
                <div className="border-t border-border pt-4">
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle className="h-5 w-5 text-emerald-600" />
                    <span className="font-semibold text-foreground">Certificate of Authenticity</span>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <Label className="text-muted-foreground">Certificate ID</Label>
                      <p className="font-mono text-sm text-foreground">{coaData.certificateId}</p>
                    </div>
                  </div>
                </div>
              )}

              {!coaData && (
                <div className="border-t border-border pt-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Info className="h-5 w-5 text-muted-foreground" />
                    <span className="font-semibold text-foreground">No Certificate</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    You can generate a Certificate of Authenticity later from your artwork&apos;s detail page.
                  </p>
                </div>
              )}

              <div className="border-t border-border pt-4">
                <div className="flex items-center gap-2 mb-3">
                  <Wifi className="h-5 w-5 text-foreground" />
                  <span className="font-semibold text-foreground">NFC Status</span>
                </div>
                {bindNFC && nfcUid ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-emerald-600" />
                      <span className="text-sm text-foreground">Tag ready to bind</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">UID:</span>
                      <span className="text-sm font-mono text-foreground">{nfcUid}</span>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="h-4 w-4 rounded-full border-2 border-muted-foreground" />
                    <span className="text-sm text-muted-foreground">No NFC tag configured</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex gap-4 justify-center">
          <Button
            onClick={handleSkip}
            variant="outline"
            className="px-8 py-3 text-lg font-semibold border-border text-foreground hover:bg-muted"
          >
            Skip NFC Binding
          </Button>
          <Button
            onClick={handleComplete}
            className="px-8 py-3 text-lg font-semibold bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            {bindNFC && nfcUid ? 'Complete with NFC' : 'Complete Registration'}
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>

        {/* Additional Info */}
        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            You can always add or update NFC binding later from your artwork&apos;s detail page
          </p>
        </div>
      </div>
    </div>
  )
}

export default NFCBindingScreen
