'use client'

import { useState } from 'react'
import { CertificateTemplateConfig, FontFamily } from '@/src/types/database'
import COACertificateElegant, { defaultCertificateConfig } from '@/src/features/artworks/registerArtwork/COACertificateElegant'
import {
    Button,
    Input,
    Label,
    Switch,
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
    Separator,
} from '@aetherlabs/ui/primitives'
import { Save, RotateCcw, Palette, Type, Settings2, Image as ImageIcon } from 'lucide-react'
import { motion } from 'framer-motion'
import { verificationUrl } from '@/src/lib/app-config'

// Sample data for preview
const sampleArtworkData = {
    title: 'Sunset over Mountains',
    year: '2024',
    medium: 'Oil on Canvas',
    dimensions: '24 × 36 inches',
    artistName: 'Jane Smith',
    imageUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800',
}

const sampleCertificateData = {
    certificateId: 'COA-2024-ABC12345',
    qrCodeUrl: verificationUrl('COA-2024-ABC12345'),
    blockchainHash: '0x7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7890',
    generatedAt: new Date().toISOString(),
}

const presetColors = [
    '#e8e4dc', '#f5f5f5', '#ffffff', '#1a1a1a', '#2a2121',
    '#3d3a35', '#6b665c', '#8a857a', '#c4bfb5', '#bc8010',
]

const fontOptions: { value: FontFamily; label: string }[] = [
    { value: 'playfair', label: 'Playfair Display' },
    { value: 'cormorant', label: 'Cormorant Garamond' },
    { value: 'libre-baskerville', label: 'Libre Baskerville' },
    { value: 'inter', label: 'Inter' },
    { value: 'dm-sans', label: 'DM Sans' },
]

export function CertificateDesigner() {
    const [config, setConfig] = useState<CertificateTemplateConfig>(defaultCertificateConfig)

    const updateColor = (key: keyof CertificateTemplateConfig['colors'], value: string) => {
        setConfig(prev => ({
            ...prev,
            colors: { ...prev.colors, [key]: value }
        }))
    }

    const handleReset = () => {
        setConfig(defaultCertificateConfig)
    }

    return (
        <div className="h-[calc(100vh-2rem)] flex">
            {/* Left Sidebar - Controls */}
            <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="w-96 border-r flex flex-col bg-background overflow-y-auto"
            >
                <div className="p-4 border-b">
                    <h2 className="font-semibold text-lg">Certificate Designer</h2>
                    <p className="text-sm text-muted-foreground">Customize your certificate appearance</p>
                </div>

                <div className="p-4 space-y-6">
                    {/* Colors Section */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-sm font-semibold">
                            <Palette className="h-4 w-4" />
                            Colors
                        </div>

                        <div className="space-y-3 pl-6 ">
                            <div className="space-y-2">
                                <Label className="text-xs">Background</Label>
                                <div className="flex flex-wrap gap-1.5 rounded-lg">
                                    {presetColors.map(color => (
                                        <button
                                            key={`bg-${color}`}
                                            onClick={() => updateColor('background', color)}
                                            className={`w-6 h-6 rounded border-2 transition-all ${
                                                config.colors.background === color ? 'border-foreground scale-110' : 'border-transparent'
                                            }`}
                                            style={{ backgroundColor: color }}
                                        />
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-xs">Text</Label>
                                <div className="flex flex-wrap gap-1.5">
                                    {presetColors.map(color => (
                                        <button
                                            key={`text-${color}`}
                                            onClick={() => updateColor('text', color)}
                                            className={`w-6 h-6 rounded border-2 transition-all ${
                                                config.colors.text === color ? 'border-foreground scale-110' : 'border-transparent'
                                            }`}
                                            style={{ backgroundColor: color }}
                                        />
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-xs">Accent</Label>
                                <div className="flex flex-wrap gap-1.5">
                                    {presetColors.map(color => (
                                        <button
                                            key={`accent-${color}`}
                                            onClick={() => updateColor('accent', color)}
                                            className={`w-6 h-6 rounded border-2 transition-all ${
                                                config.colors.accent === color ? 'border-foreground scale-110' : 'border-transparent'
                                            }`}
                                            style={{ backgroundColor: color }}
                                        />
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-xs">Border</Label>
                                <div className="flex flex-wrap gap-1.5">
                                    {presetColors.map(color => (
                                        <button
                                            key={`border-${color}`}
                                            onClick={() => updateColor('border', color)}
                                            className={`w-6 h-6 rounded border-2 transition-all ${
                                                config.colors.border === color ? 'border-foreground scale-110' : 'border-transparent'
                                            }`}
                                            style={{ backgroundColor: color }}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <Separator />

                    {/* Typography Section */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-sm font-semibold">
                            <Type className="h-4 w-4" />
                            Typography
                        </div>

                        <div className="pl-6">
                            <Label className="text-xs">Font Family</Label>
                            <Select
                                value={config.font}
                                onValueChange={(value) => setConfig(prev => ({ ...prev, font: value as FontFamily }))}
                            >
                                <SelectTrigger className="mt-1">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {fontOptions.map(font => (
                                        <SelectItem key={font.value} value={font.value}>
                                            {font.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <Separator />

                    {/* Background Section */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-sm font-semibold">
                            <ImageIcon className="h-4 w-4" />
                            Background Image
                        </div>

                        <div className="space-y-4 pl-6">
                            <div className="flex items-center justify-between">
                                <Label className="text-sm">Invert Image</Label>
                                <Switch
                                    checked={config.invert_background}
                                    onCheckedChange={(checked) => setConfig(prev => ({ ...prev, invert_background: checked }))}
                                />
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label className="text-xs">Blur Amount</Label>
                                    <span className="text-xs text-muted-foreground">{config.background_blur}px</span>
                                </div>
                                <input
                                    type="range"
                                    min="0"
                                    max="20"
                                    value={config.background_blur}
                                    onChange={(e) => setConfig(prev => ({ ...prev, background_blur: parseInt(e.target.value) }))}
                                    className="w-full"
                                />
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label className="text-xs">Opacity</Label>
                                    <span className="text-xs text-muted-foreground">{config.background_opacity}%</span>
                                </div>
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={config.background_opacity}
                                    onChange={(e) => setConfig(prev => ({ ...prev, background_opacity: parseInt(e.target.value) }))}
                                    className="w-full"
                                />
                            </div>
                        </div>
                    </div>

                    <Separator />

                    {/* Elements Section */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-sm font-semibold">
                            <Settings2 className="h-4 w-4" />
                            Elements
                        </div>

                        <div className="space-y-3 pl-6">
                            <div className="flex items-center justify-between">
                                <Label className="text-sm">Show QR Code</Label>
                                <Switch
                                    checked={config.show_qr}
                                    onCheckedChange={(checked) => setConfig(prev => ({ ...prev, show_qr: checked }))}
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                <Label className="text-sm">Show Seal</Label>
                                <Switch
                                    checked={config.show_seal}
                                    onCheckedChange={(checked) => setConfig(prev => ({ ...prev, show_seal: checked }))}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="mt-auto p-4 border-t space-y-2">
                    <Button onClick={handleReset} variant="outline" className="w-full">
                        <RotateCcw className="h-4 w-4 mr-2" />
                        Reset to Default
                    </Button>
                    <Button className="w-full">
                        <Save className="h-4 w-4 mr-2" />
                        Save Template
                    </Button>
                </div>
            </motion.div>

            {/* Right - Live Preview */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="flex-1 bg-muted/30 overflow-y-auto"
            >
                <div className="min-h-full flex items-center justify-center">
                    <COACertificateElegant
                        artworkData={sampleArtworkData}
                        certificateData={sampleCertificateData}
                        templateConfig={config}
                        showActions={false}
                    />
                </div>
            </motion.div>
        </div>
    )
}
