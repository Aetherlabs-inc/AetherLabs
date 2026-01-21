import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import {
    Upload,
    FileText,
    AlertCircle,
    CheckCircle,
    X,
    ArrowLeft,
    Plus,
    Save
} from 'lucide-react';
import COADecisionScreen from './COADecisionScreen';
import COAGenerationScreen from './COAGenerationScreen';
import NFCBindingScreen from './NFCBindingScreen';
import { ArtworkRegistrationService } from '@/src/services/artwork-registration-service';

interface ArtworkFormData {
    // Identity (Core MVP)
    title: string;
    year: string;
    medium: string;
    dimensions: {
        height: string;
        width: string;
        depth: string;
        unit: string;
    };
    primaryImage: File | null;

    // Details
    description: string;
    editionType: 'unique' | 'editioned';
    editionSize: string;
    editionNumber: string;
    signature: boolean;
    signatureLocation: string;
    creationLocation: string;

    // COA Linkage
    certificateId: string;
    generateCOA: boolean;

    // NFC
    nfcUid: string;
    bindNFC: boolean;

    // Cataloging
    tags: string[];
    category: string;
    collection: string;
    series: string;

    // Privacy & Status
    visibility: 'private' | 'shareable' | 'public';
    status: 'draft' | 'published';
}


interface RegisterArtworkProps {
    onBack?: () => void;
}

type Screen = 'form' | 'coa-decision' | 'coa-generation' | 'nfc-binding' | 'complete';

const RegisterArtwork: React.FC<RegisterArtworkProps> = ({ onBack }) => {
    const [currentScreen, setCurrentScreen] = useState<Screen>('form');
    const [coaData, setCoaData] = useState<{
        certificateId: string;
        qrCode: string;
        blockchainHash: string;
        generatedAt: string;
    } | null>(null);
    const [nfcData, setNfcData] = useState<{
        nfcUid: string;
        isBound: boolean;
        bindingStatus: 'pending' | 'success' | 'failed';
    } | null>(null);

    const [formData, setFormData] = useState<ArtworkFormData>({
        // Identity
        title: '',
        year: '',
        medium: '',
        dimensions: {
            height: '',
            width: '',
            depth: '',
            unit: 'in'
        },
        primaryImage: null,

        // Details
        description: '',
        editionType: 'unique',
        editionSize: '',
        editionNumber: '',
        signature: false,
        signatureLocation: '',
        creationLocation: '',

        // COA Linkage
        certificateId: '',
        generateCOA: true,

        // NFC
        nfcUid: '',
        bindNFC: false,

        // Cataloging
        tags: [],
        category: '',
        collection: '',
        series: '',

        // Privacy & Status
        visibility: 'private',
        status: 'draft'
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [isAutoSaving, setIsAutoSaving] = useState(false);
    const [lastSaved, setLastSaved] = useState<Date | null>(null);
    const [newTag, setNewTag] = useState('');

    // Categories and collections
    const categories = ['Painting', 'Sculpture', 'Photography', 'Digital Art', 'Mixed Media', 'Print', 'Drawing', 'Other'];
    const units = ['in', 'cm', 'mm', 'ft'];

    // Autosave functionality
    useEffect(() => {
        const autoSave = async () => {
            if (formData.title || formData.medium || formData.description) {
                setIsAutoSaving(true);
                try {
                    // Simulate autosave API call
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    setLastSaved(new Date());
                } catch (error) {
                    console.error('Autosave failed:', error);
                } finally {
                    setIsAutoSaving(false);
                }
            }
        };

        const timeoutId = setTimeout(autoSave, 5000); // Autosave every 5 seconds
        return () => clearTimeout(timeoutId);
    }, [formData]);

    const handleInputChange = (field: keyof ArtworkFormData, value: string | boolean) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const handleDimensionChange = (dimension: keyof ArtworkFormData['dimensions'], value: string) => {
        setFormData(prev => ({
            ...prev,
            dimensions: { ...prev.dimensions, [dimension]: value }
        }));
    };

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        console.log('Image upload triggered, file:', file);

        if (file) {
            console.log('File details:', {
                name: file.name,
                size: file.size,
                type: file.type,
                lastModified: file.lastModified
            });

            // Validate file
            if (file.size > 10 * 1024 * 1024) { // 10MB limit
                console.error('File too large:', file.size);
                setErrors(prev => ({ ...prev, primaryImage: 'Image must be less than 10MB' }));
                return;
            }

            const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
            if (!validTypes.includes(file.type)) {
                console.error('Invalid file type:', file.type);
                setErrors(prev => ({ ...prev, primaryImage: 'Only JPG, PNG, and WEBP files are allowed' }));
                return;
            }

            console.log('File validation passed, setting form data');
            setFormData(prev => ({ ...prev, primaryImage: file }));

            const reader = new FileReader();
            reader.onload = (e) => {
                console.log('FileReader loaded, setting preview image');
                setPreviewImage(e.target?.result as string);
            };
            reader.onerror = (e) => {
                console.error('FileReader error:', e);
            };
            reader.readAsDataURL(file);
        } else {
            console.log('No file selected');
        }
    };

    const addTag = () => {
        if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
            setFormData(prev => ({
                ...prev,
                tags: [...prev.tags, newTag.trim()]
            }));
            setNewTag('');
        }
    };

    const removeTag = (tagToRemove: string) => {
        setFormData(prev => ({
            ...prev,
            tags: prev.tags.filter(tag => tag !== tagToRemove)
        }));
    };


    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        // Title validation
        if (!formData.title.trim()) {
            newErrors.title = 'Title is required';
        } else if (formData.title.length < 2 || formData.title.length > 120) {
            newErrors.title = 'Title must be between 2 and 120 characters';
        }

        // Year validation
        if (!formData.year.trim()) {
            newErrors.year = 'Year is required';
        } else {
            const year = parseInt(formData.year);
            const currentYear = new Date().getFullYear();
            if (isNaN(year) || year < 1000 || year > currentYear) {
                newErrors.year = `Year must be a valid 4-digit year ≤ ${currentYear}`;
            }
        }

        // Medium validation
        if (!formData.medium.trim()) {
            newErrors.medium = 'Medium is required';
        } else if (formData.medium.length < 2 || formData.medium.length > 80) {
            newErrors.medium = 'Medium must be between 2 and 80 characters';
        }

        // Dimensions validation
        if (!formData.dimensions.height || !formData.dimensions.width) {
            newErrors.dimensions = 'Height and width are required';
        } else {
            const height = parseFloat(formData.dimensions.height);
            const width = parseFloat(formData.dimensions.width);
            if (isNaN(height) || height <= 0 || isNaN(width) || width <= 0) {
                newErrors.dimensions = 'Dimensions must be positive numbers';
            }
        }

        // Description validation
        if (formData.description && (formData.description.length < 280 || formData.description.length > 500)) {
            newErrors.description = 'Description must be between 280 and 500 characters';
        }

        // Edition validation
        if (formData.editionType === 'editioned') {
            if (!formData.editionSize || !formData.editionNumber) {
                newErrors.edition = 'Edition size and number are required for editioned works';
            } else {
                const size = parseInt(formData.editionSize);
                const number = parseInt(formData.editionNumber);
                if (isNaN(size) || isNaN(number) || number < 1 || number > size) {
                    newErrors.edition = 'Edition number must be between 1 and edition size';
                }
            }
        }

        // Image validation
        if (!formData.primaryImage) {
            newErrors.primaryImage = 'Primary image is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate form
        if (!validateForm()) {
            return;
        }

        console.log('Form data:', formData);
        console.log('Errors:', errors);

        setIsSubmitting(true);

        try {
            console.log('Starting artwork creation with form data:', {
                title: formData.title,
                hasImage: !!formData.primaryImage,
                imageName: formData.primaryImage?.name,
                imageSize: formData.primaryImage?.size
            });

            // Create artwork in database
            const artwork = await ArtworkRegistrationService.createArtwork(formData);
            console.log('Artwork created successfully:', artwork);

            // Navigate to COA decision screen
            setCurrentScreen('coa-decision');
        } catch (error) {
            console.error('Error registering artwork:', error);
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            console.error('Full error details:', error);
            alert(`Error registering artwork: ${errorMessage}`);
        } finally {
            setIsSubmitting(false);
        }
    };


    const removeImage = () => {
        setFormData(prev => ({ ...prev, primaryImage: null }));
        setPreviewImage(null);
    };

    // Navigation handlers
    const handleBackToForm = () => {
        setCurrentScreen('form');
    };

    const handleGenerateCOA = () => {
        setCurrentScreen('coa-generation');
    };

    const handleSkipCOA = () => {
        setCurrentScreen('nfc-binding');
    };

    const handleCOAComplete = (coa: {
        certificateId: string;
        qrCode: string;
        blockchainHash: string;
        generatedAt: string;
    }) => {
        setCoaData(coa);
        setCurrentScreen('nfc-binding');
    };

    const handleNFCComplete = (nfc: {
        nfcUid: string;
        isBound: boolean;
        bindingStatus: 'pending' | 'success' | 'failed';
    }) => {
        setNfcData(nfc);
        setCurrentScreen('complete');
    };

    const handleNFCBack = () => {
        if (coaData) {
            setCurrentScreen('coa-generation');
        } else {
            setCurrentScreen('coa-decision');
        }
    };

    const handleFinalComplete = () => {
        // Reset everything and go back to form
        setFormData({
            // Identity
            title: '',
            year: '',
            medium: '',
            dimensions: {
                height: '',
                width: '',
                depth: '',
                unit: 'in'
            },
            primaryImage: null,

            // Details
            description: '',
            editionType: 'unique',
            editionSize: '',
            editionNumber: '',
            signature: false,
            signatureLocation: '',
            creationLocation: '',

            // COA Linkage
            certificateId: '',
            generateCOA: true,

            // NFC
            nfcUid: '',
            bindNFC: false,

            // Cataloging
            tags: [],
            category: '',
            collection: '',
            series: '',

            // Privacy & Status
            visibility: 'private',
            status: 'draft'
        });
        setPreviewImage(null);
        setErrors({});
        setCoaData(null);
        setNfcData(null);
        setCurrentScreen('form');
        alert('Artwork registered successfully!');
    };



    // Render different screens based on current state
    if (currentScreen === 'coa-decision') {
        return (
            <COADecisionScreen
                artworkTitle={formData.title}
                onBack={handleBackToForm}
                onGenerateCOA={handleGenerateCOA}
                onSkipCOA={handleSkipCOA}
            />
        );
    }

    if (currentScreen === 'coa-generation') {
        return (
            <COAGenerationScreen
                artworkData={{
                    title: formData.title,
                    year: formData.year,
                    medium: formData.medium,
                    dimensions: `${formData.dimensions.height} × ${formData.dimensions.width} × ${formData.dimensions.depth} ${formData.dimensions.unit}`,
                    artistName: '' // This would come from user profile
                }}
                onBack={handleBackToForm}
                onComplete={handleCOAComplete}
                onSkip={handleSkipCOA}
            />
        );
    }

    if (currentScreen === 'nfc-binding') {
        return (
            <NFCBindingScreen
                artworkData={{
                    title: formData.title,
                    year: formData.year,
                    medium: formData.medium,
                    dimensions: `${formData.dimensions.height} × ${formData.dimensions.width} × ${formData.dimensions.depth} ${formData.dimensions.unit}`
                }}
                coaData={coaData || undefined}
                onBack={handleNFCBack}
                onComplete={handleNFCComplete}
                onSkip={handleNFCComplete}
            />
        );
    }

    if (currentScreen === 'complete') {
        return (
            <div className="min-h-screen bg-white dark:bg-black p-6">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center">
                        <div className="mb-8">
                            <div className="mx-auto w-20 h-20 bg-black dark:bg-white rounded-full flex items-center justify-center mb-6">
                                <CheckCircle className="h-10 w-10 text-white dark:text-black" />
                            </div>
                            <h1 className="text-4xl font-bold text-black dark:text-white mb-4">
                                Artwork Registration Complete!
                            </h1>
                            <p className="text-xl text-black dark:text-white mb-8">
                                &ldquo;{formData.title}&rdquo; has been successfully registered
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            {coaData && (
                                <Card className="border border-black dark:border-white bg-white dark:bg-black">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2 text-black dark:text-white">
                                            <CheckCircle className="h-5 w-5 text-black dark:text-white" />
                                            Certificate of Authenticity
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm text-black dark:text-white mb-2">
                                            Certificate ID: {coaData.certificateId}
                                        </p>
                                        <p className="text-xs text-black dark:text-white">
                                            Blockchain verified and registered
                                        </p>
                                    </CardContent>
                                </Card>
                            )}

                            {nfcData && nfcData.isBound && (
                                <Card className="border border-black dark:border-white bg-white dark:bg-black">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2 text-black dark:text-white">
                                            <CheckCircle className="h-5 w-5 text-black dark:text-white" />
                                            NFC Tag Bound
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm text-black dark:text-white mb-2">
                                            NFC UID: {nfcData.nfcUid}
                                        </p>
                                        <p className="text-xs text-black dark:text-white">
                                            Physical verification enabled
                                        </p>
                                    </CardContent>
                                </Card>
                            )}
                        </div>

                        <Button
                            onClick={handleFinalComplete}
                            className="px-8 py-3 text-lg font-semibold bg-black hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-200 text-white dark:text-black"
                        >
                            Register Another Artwork
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-black dark:to-gray-800 p-6">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="mb-8">
                    {onBack && (
                        <Button
                            onClick={onBack}
                            variant="ghost"
                            className="mb-4 flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Back to Artworks
                        </Button>
                    )}

                    <div className="text-center">
                        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                            Register New Artwork
                        </h1>
                        <p className="text-xl text-gray-600 dark:text-gray-300 mb-4">
                            Add a new artwork to your collection with detailed information
                        </p>

                        {/* Autosave Status */}
                        <div className="flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                            {isAutoSaving ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-500"></div>
                                    Auto-saving...
                                </>
                            ) : lastSaved ? (
                                <>
                                    <Save className="h-4 w-4" />
                                    Last saved: {lastSaved.toLocaleTimeString()}
                                </>
                            ) : null}
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Identity Section - Core MVP Fields */}
                    <Card className="border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                                <FileText className="h-5 w-5" />
                                Identity
                            </CardTitle>
                            <CardDescription>
                                Core information about the artwork
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* Left Column - Text Fields */}
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="title" className="text-gray-700 dark:text-gray-300">
                                            Title *
                                        </Label>
                                        <Input
                                            id="title"
                                            value={formData.title}
                                            onChange={(e) => handleInputChange('title', e.target.value)}
                                            placeholder="Enter artwork title"
                                            className={errors.title ? 'border-red-500' : ''}
                                        />
                                        {errors.title && (
                                            <p className="text-sm text-red-500 flex items-center gap-1">
                                                <AlertCircle className="h-4 w-4" />
                                                {errors.title}
                                            </p>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="year" className="text-gray-700 dark:text-gray-300">
                                                Year *
                                            </Label>
                                            <Input
                                                id="year"
                                                type="number"
                                                value={formData.year}
                                                onChange={(e) => handleInputChange('year', e.target.value)}
                                                placeholder="2024"
                                                className={errors.year ? 'border-red-500' : ''}
                                            />
                                            {errors.year && (
                                                <p className="text-sm text-red-500 flex items-center gap-1">
                                                    <AlertCircle className="h-4 w-4" />
                                                    {errors.year}
                                                </p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="medium" className="text-gray-700 dark:text-gray-300">
                                                Medium *
                                            </Label>
                                            <Input
                                                id="medium"
                                                value={formData.medium}
                                                onChange={(e) => handleInputChange('medium', e.target.value)}
                                                placeholder="Acrylic on canvas"
                                                className={errors.medium ? 'border-red-500' : ''}
                                            />
                                            {errors.medium && (
                                                <p className="text-sm text-red-500 flex items-center gap-1">
                                                    <AlertCircle className="h-4 w-4" />
                                                    {errors.medium}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Dimensions Helper */}
                                    <div className="space-y-2">
                                        <Label className="text-gray-700 dark:text-gray-300">
                                            Dimensions *
                                        </Label>
                                        <div className="grid grid-cols-3 gap-2">
                                            <div>
                                                <Input
                                                    placeholder="H"
                                                    value={formData.dimensions.height}
                                                    onChange={(e) => handleDimensionChange('height', e.target.value)}
                                                    className={errors.dimensions ? 'border-red-500' : ''}
                                                />
                                            </div>
                                            <div>
                                                <Input
                                                    placeholder="W"
                                                    value={formData.dimensions.width}
                                                    onChange={(e) => handleDimensionChange('width', e.target.value)}
                                                    className={errors.dimensions ? 'border-red-500' : ''}
                                                />
                                            </div>
                                            <div>
                                                <Input
                                                    placeholder="D"
                                                    value={formData.dimensions.depth}
                                                    onChange={(e) => handleDimensionChange('depth', e.target.value)}
                                                />
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            {units.map(unit => (
                                                <Button
                                                    key={unit}
                                                    type="button"
                                                    variant={formData.dimensions.unit === unit ? "default" : "outline"}
                                                    size="sm"
                                                    onClick={() => handleDimensionChange('unit', unit)}
                                                >
                                                    {unit}
                                                </Button>
                                            ))}
                                        </div>
                                        {errors.dimensions && (
                                            <p className="text-sm text-red-500 flex items-center gap-1">
                                                <AlertCircle className="h-4 w-4" />
                                                {errors.dimensions}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Right Column - Image Upload */}
                                <div className="space-y-4">
                                    <Label className="text-gray-700 dark:text-gray-300">
                                        Primary Image *
                                    </Label>
                                    {!previewImage ? (
                                        <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
                                            <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                            <div className="space-y-2">
                                                <p className="text-lg font-medium text-gray-900 dark:text-white">
                                                    Upload Artwork Image
                                                </p>
                                                <p className="text-gray-500 dark:text-gray-400 text-sm">
                                                    JPG, PNG, WEBP • Max 10MB
                                                </p>
                                            </div>
                                            <input
                                                type="file"
                                                accept="image/jpeg,image/png,image/webp"
                                                onChange={handleImageUpload}
                                                className="hidden"
                                                id="image-upload"
                                            />
                                            <Button
                                                type="button"
                                                onClick={() => document.getElementById('image-upload')?.click()}
                                                className="mt-4"
                                            >
                                                <Upload className="h-4 w-4 mr-2" />
                                                Choose File
                                            </Button>
                                        </div>
                                    ) : (
                                        <div className="relative">
                                            <img
                                                src={previewImage}
                                                alt="Artwork preview"
                                                className="w-full h-64 object-cover rounded-lg"
                                            />
                                            <Button
                                                type="button"
                                                onClick={removeImage}
                                                variant="destructive"
                                                size="sm"
                                                className="absolute top-2 right-2"
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    )}
                                    {errors.primaryImage && (
                                        <p className="text-sm text-red-500 flex items-center gap-1">
                                            <AlertCircle className="h-4 w-4" />
                                            {errors.primaryImage}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Details Section */}
                    <Card className="border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                                <FileText className="h-5 w-5" />
                                Details
                            </CardTitle>
                            <CardDescription>
                                Additional artwork information
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="description" className="text-gray-700 dark:text-gray-300">
                                    Description
                                    <span className="text-sm text-gray-500 ml-2">
                                        ({formData.description.length}/500 characters)
                                    </span>
                                </Label>
                                <textarea
                                    id="description"
                                    value={formData.description}
                                    onChange={(e) => handleInputChange('description', e.target.value)}
                                    placeholder="Describe the artwork, its style, and any notable features..."
                                    rows={4}
                                    maxLength={500}
                                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white ${errors.description ? 'border-red-500' : ''}`}
                                />
                                {errors.description && (
                                    <p className="text-sm text-red-500 flex items-center gap-1">
                                        <AlertCircle className="h-4 w-4" />
                                        {errors.description}
                                    </p>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-gray-700 dark:text-gray-300">Edition Type</Label>
                                    <div className="flex gap-2">
                                        <Button
                                            type="button"
                                            variant={formData.editionType === 'unique' ? "default" : "outline"}
                                            onClick={() => handleInputChange('editionType', 'unique')}
                                        >
                                            Unique
                                        </Button>
                                        <Button
                                            type="button"
                                            variant={formData.editionType === 'editioned' ? "default" : "outline"}
                                            onClick={() => handleInputChange('editionType', 'editioned')}
                                        >
                                            Editioned
                                        </Button>
                                    </div>
                                </div>

                                {formData.editionType === 'editioned' && (
                                    <div className="space-y-2">
                                        <Label className="text-gray-700 dark:text-gray-300">Edition Details</Label>
                                        <div className="grid grid-cols-2 gap-2">
                                            <Input
                                                placeholder="Size (e.g., 20)"
                                                value={formData.editionSize}
                                                onChange={(e) => handleInputChange('editionSize', e.target.value)}
                                                className={errors.edition ? 'border-red-500' : ''}
                                            />
                                            <Input
                                                placeholder="Number (e.g., 2)"
                                                value={formData.editionNumber}
                                                onChange={(e) => handleInputChange('editionNumber', e.target.value)}
                                                className={errors.edition ? 'border-red-500' : ''}
                                            />
                                        </div>
                                        {errors.edition && (
                                            <p className="text-sm text-red-500 flex items-center gap-1">
                                                <AlertCircle className="h-4 w-4" />
                                                {errors.edition}
                                            </p>
                                        )}
                                    </div>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <div className="flex items-center space-x-2">
                                        <Switch
                                            id="signature"
                                            checked={formData.signature}
                                            onCheckedChange={(checked) => handleInputChange('signature', checked)}
                                        />
                                        <Label htmlFor="signature" className="text-gray-700 dark:text-gray-300">
                                            Signed
                                        </Label>
                                    </div>
                                    {formData.signature && (
                                        <Input
                                            placeholder="Signature location (optional)"
                                            value={formData.signatureLocation}
                                            onChange={(e) => handleInputChange('signatureLocation', e.target.value)}
                                        />
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="creationLocation" className="text-gray-700 dark:text-gray-300">
                                        Creation Location
                                    </Label>
                                    <Input
                                        id="creationLocation"
                                        value={formData.creationLocation}
                                        onChange={(e) => handleInputChange('creationLocation', e.target.value)}
                                        placeholder="City, Country"
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>



                    {/* Cataloging Section */}
                    <Card className="border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                                <FileText className="h-5 w-5" />
                                Cataloging
                            </CardTitle>
                            <CardDescription>
                                Organize and categorize your artwork
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="category" className="text-gray-700 dark:text-gray-300">
                                        Category
                                    </Label>
                                    <select
                                        id="category"
                                        value={formData.category}
                                        onChange={(e) => handleInputChange('category', e.target.value)}
                                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                                    >
                                        <option value="">Select category</option>
                                        {categories.map(category => (
                                            <option key={category} value={category}>{category}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="collection" className="text-gray-700 dark:text-gray-300">
                                        Collection/Series
                                    </Label>
                                    <div className="flex gap-2">
                                        <Input
                                            id="collection"
                                            value={formData.collection}
                                            onChange={(e) => handleInputChange('collection', e.target.value)}
                                            placeholder="Enter collection name"
                                        />
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                        >
                                            <Plus className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-gray-700 dark:text-gray-300">Tags</Label>
                                <div className="flex gap-2">
                                    <Input
                                        value={newTag}
                                        onChange={(e) => setNewTag(e.target.value)}
                                        placeholder="Add a tag"
                                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                                    />
                                    <Button
                                        type="button"
                                        onClick={addTag}
                                        variant="outline"
                                    >
                                        <Plus className="h-4 w-4" />
                                    </Button>
                                </div>
                                {formData.tags.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {formData.tags.map((tag, index) => (
                                            <Badge key={index} variant="secondary" className="flex items-center gap-1">
                                                {tag}
                                                <button
                                                    type="button"
                                                    onClick={() => removeTag(tag)}
                                                    className="ml-1 hover:text-red-500"
                                                >
                                                    <X className="h-3 w-3" />
                                                </button>
                                            </Badge>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Submit Button */}
                    <div className="flex justify-center pt-6">
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-8 py-3 text-lg font-semibold bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-100 text-white dark:text-black"
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                    Registering Artwork...
                                </>
                            ) : (
                                <>
                                    <CheckCircle className="h-5 w-5 mr-2" />
                                    Register Artwork
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RegisterArtwork;
