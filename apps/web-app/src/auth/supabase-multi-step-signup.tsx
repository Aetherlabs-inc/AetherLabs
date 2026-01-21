'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
// import { createClient } from '@/src/lib/supabase'
// import { userProfileService } from '@/src/services/user-profile-service'
// import { useToast } from '@/hooks/use-toast'
import { BsEyeSlashFill, BsFillEyeFill } from "react-icons/bs"
import Image from "next/image"
import { ChevronLeft, ChevronRight, Check } from "lucide-react"

// const supabase = createClient()

interface SignupData {
    fullName: string
    email: string
    password: string
    confirmPassword: string
    userType: 'artist' | 'gallery' | 'collector'
    bio: string
    website: string
    location: string
    phone: string
}

export function SupabaseMultiStepSignup({
    className,
    ...props
}: React.ComponentPropsWithoutRef<"div">) {
    const router = useRouter()
    const [currentStep, setCurrentStep] = useState(1)
    const [isVisible, setIsVisible] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [message, setMessage] = useState('')
    // const { toast } = useToast()

    const [formData, setFormData] = useState<SignupData>({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
        userType: 'artist',
        bio: '',
        website: '',
        location: '',
        phone: ''
    })

    const toggleVisibility = () => setIsVisible(!isVisible)

    const updateFormData = (field: keyof SignupData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }))
        setError('')
    }

    const nextStep = () => {
        if (validateCurrentStep()) {
            setCurrentStep(prev => Math.min(prev + 1, 4))
        }
    }

    const prevStep = () => {
        setCurrentStep(prev => Math.max(prev - 1, 1))
    }

    const validateCurrentStep = (): boolean => {
        setError('')

        switch (currentStep) {
            case 1:
                if (!formData.fullName.trim()) {
                    setError('Full name is required')
                    return false
                }
                if (!formData.email.trim()) {
                    setError('Email is required')
                    return false
                }
                if (!formData.password) {
                    setError('Password is required')
                    return false
                }
                if (formData.password !== formData.confirmPassword) {
                    setError('Passwords do not match')
                    return false
                }
                if (formData.password.length < 6) {
                    setError('Password must be at least 6 characters')
                    return false
                }
                return true
            case 2:
                return true // User type is always selected (defaults to artist)
            case 3:
                return true // Optional fields, no validation needed
            case 4:
                return true // Review step, no validation needed
            default:
                return false
        }
    }

    const handleSubmit = async () => {
        if (!validateCurrentStep()) return

        setLoading(true)
        setError('')
        setMessage('')

        try {
            // Redirect to waitlist instead of creating account
            // Since signup is disabled during testing, redirect users to waitlist
            router.push('/waitlist')
        } catch (err) {
            setError('An unexpected error occurred')
        } finally {
            setLoading(false)
        }
    }

    const renderStep = () => {
        switch (currentStep) {
            case 1:
                return (
                    <div className="space-y-6">
                        <div className="text-center">
                            <h2 className="text-2xl font-bold">Basic Information</h2>
                            <p className="text-muted-foreground">Let&apos;s start with your basic details</p>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="fullName">Full Name *</Label>
                                <Input
                                    id="fullName"
                                    type="text"
                                    placeholder="Enter your full name"
                                    value={formData.fullName}
                                    onChange={(e) => updateFormData('fullName', e.target.value)}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">Email *</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="m@example.com"
                                    value={formData.email}
                                    onChange={(e) => updateFormData('email', e.target.value)}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password">Password *</Label>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        type={isVisible ? "text" : "password"}
                                        placeholder="Enter your password"
                                        value={formData.password}
                                        onChange={(e) => updateFormData('password', e.target.value)}
                                        className="pr-12"
                                    />
                                    <Button
                                        type="button"
                                        onClick={toggleVisibility}
                                        className="absolute right-0 top-0 h-full w-12 p-0"
                                        variant="ghost"
                                    >
                                        {isVisible ? <BsFillEyeFill /> : <BsEyeSlashFill />}
                                    </Button>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword">Confirm Password *</Label>
                                <Input
                                    id="confirmPassword"
                                    type="password"
                                    placeholder="Confirm your password"
                                    value={formData.confirmPassword}
                                    onChange={(e) => updateFormData('confirmPassword', e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                    </div>
                )

            case 2:
                return (
                    <div className="space-y-6">
                        <div className="text-center">
                            <h2 className="text-2xl font-bold">What describes you best?</h2>
                            <p className="text-muted-foreground">Choose your role in the art world</p>
                        </div>

                        <div className="space-y-4">
                            <div className="grid gap-3">
                                {[
                                    {
                                        type: 'artist' as const,
                                        title: 'Artist',
                                        description: 'I create and sell my own artwork',
                                        icon: '🎨'
                                    },
                                    {
                                        type: 'gallery' as const,
                                        title: 'Gallery',
                                        description: 'I represent and sell artwork for artists',
                                        icon: '🏛️'
                                    },
                                    {
                                        type: 'collector' as const,
                                        title: 'Collector',
                                        description: 'I buy and collect artwork',
                                        icon: '🖼️'
                                    }
                                ].map((option) => (
                                    <button
                                        key={option.type}
                                        type="button"
                                        onClick={() => updateFormData('userType', option.type)}
                                        className={cn(
                                            "p-4 border-2 rounded-lg text-left transition-all",
                                            formData.userType === option.type
                                                ? "border-primary bg-primary/5"
                                                : "border-border hover:border-primary/50"
                                        )}
                                    >
                                        <div className="flex items-center space-x-3">
                                            <span className="text-2xl">{option.icon}</span>
                                            <div>
                                                <div className="font-medium">{option.title}</div>
                                                <div className="text-sm text-muted-foreground">{option.description}</div>
                                            </div>
                                            {formData.userType === option.type && (
                                                <Check className="ml-auto h-5 w-5 text-primary" />
                                            )}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )

            case 3:
                return (
                    <div className="space-y-6">
                        <div className="text-center">
                            <h2 className="text-2xl font-bold">Tell us more about yourself</h2>
                            <p className="text-muted-foreground">This information will help others connect with you</p>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="bio">Bio</Label>
                                <textarea
                                    id="bio"
                                    value={formData.bio}
                                    onChange={(e) => updateFormData('bio', e.target.value)}
                                    className="w-full min-h-[100px] px-3 py-2 border border-input bg-background rounded-md text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                    placeholder="Tell us about yourself, your art style, or your gallery..."
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="website">Website</Label>
                                    <Input
                                        id="website"
                                        type="url"
                                        value={formData.website}
                                        onChange={(e) => updateFormData('website', e.target.value)}
                                        placeholder="https://yourwebsite.com"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="phone">Phone</Label>
                                    <Input
                                        id="phone"
                                        type="tel"
                                        value={formData.phone}
                                        onChange={(e) => updateFormData('phone', e.target.value)}
                                        placeholder="+1 (555) 123-4567"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="location">Location</Label>
                                <Input
                                    id="location"
                                    type="text"
                                    value={formData.location}
                                    onChange={(e) => updateFormData('location', e.target.value)}
                                    placeholder="City, Country"
                                />
                            </div>
                        </div>
                    </div>
                )

            case 4:
                return (
                    <div className="space-y-6">
                        <div className="text-center">
                            <h2 className="text-2xl font-bold">Review your information</h2>
                            <p className="text-muted-foreground">Please review and confirm your details</p>
                        </div>

                        <div className="space-y-4">
                            <div className="bg-muted/50 p-4 rounded-lg space-y-3">
                                <div>
                                    <Label className="text-sm font-medium text-muted-foreground">Name</Label>
                                    <p className="text-sm">{formData.fullName}</p>
                                </div>
                                <div>
                                    <Label className="text-sm font-medium text-muted-foreground">Email</Label>
                                    <p className="text-sm">{formData.email}</p>
                                </div>
                                <div>
                                    <Label className="text-sm font-medium text-muted-foreground">Role</Label>
                                    <p className="text-sm capitalize">{formData.userType}</p>
                                </div>
                                {formData.bio && (
                                    <div>
                                        <Label className="text-sm font-medium text-muted-foreground">Bio</Label>
                                        <p className="text-sm">{formData.bio}</p>
                                    </div>
                                )}
                                {formData.website && (
                                    <div>
                                        <Label className="text-sm font-medium text-muted-foreground">Website</Label>
                                        <p className="text-sm">{formData.website}</p>
                                    </div>
                                )}
                                {formData.location && (
                                    <div>
                                        <Label className="text-sm font-medium text-muted-foreground">Location</Label>
                                        <p className="text-sm">{formData.location}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )

            default:
                return null
        }
    }

    const steps = [
        { number: 1, title: "Basic Info", description: "Name, email, password" },
        { number: 2, title: "Role", description: "Choose your role" },
        { number: 3, title: "Profile", description: "Additional information" },
        { number: 4, title: "Review", description: "Confirm details" }
    ]

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            {/* Progress Indicator */}
            <div className="flex items-center justify-center space-x-4 mb-8">
                {steps.map((step, index) => (
                    <div key={step.number} className="flex items-center">
                        <div className={cn(
                            "flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium",
                            currentStep >= step.number
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted text-muted-foreground"
                        )}>
                            {currentStep > step.number ? <Check className="h-4 w-4" /> : step.number}
                        </div>
                        {index < steps.length - 1 && (
                            <div className={cn(
                                "w-16 h-0.5 mx-2",
                                currentStep > step.number ? "bg-primary" : "bg-muted"
                            )} />
                        )}
                    </div>
                ))}
            </div>

            {/* Step Content */}
            {renderStep()}

            {/* Error and Success Messages */}
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            {message && <p className="text-green-500 text-sm text-center">{message}</p>}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-6">
                <Button
                    type="button"
                    variant="outline"
                    onClick={prevStep}
                    disabled={currentStep === 1}
                    className="flex items-center"
                >
                    <ChevronLeft className="h-4 w-4 mr-2" />
                    Previous
                </Button>

                {currentStep < 4 ? (
                    <Button
                        type="button"
                        onClick={nextStep}
                        className="flex items-center"
                    >
                        Next
                        <ChevronRight className="h-4 w-4 ml-2" />
                    </Button>
                ) : (
                    <Button
                        type="button"
                        onClick={handleSubmit}
                        disabled={loading}
                        className="flex items-center"
                    >
                        {loading ? 'Creating account...' : 'Create Account'}
                    </Button>
                )}
            </div>

            {/* Social Login Options */}
            {currentStep === 1 && (
                <>
                    <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                        <span className="relative z-10 bg-background px-2 text-muted-foreground">
                            Or continue with
                        </span>
                    </div>
                    <div className="grid gap-2">
                        <Button variant="outline" className="w-full">
                            <Image
                                src="/apple-logo.png"
                                alt="Apple logo"
                                width={20}
                                height={20}
                                className="mr-2"
                            />
                            Signup with Apple
                        </Button>
                        <Button variant="outline" className="w-full">
                            <Image
                                src="/google.png"
                                alt="Google logo"
                                width={20}
                                height={20}
                                className="mr-2"
                            />
                            Signup with Google
                        </Button>
                    </div>
                </>
            )}

            {/* Login Link */}
            <div className="text-center text-sm">
                Already have an account?{" "}
                <a href="/login" className="underline underline-offset-4">
                    Login
                </a>
            </div>
        </div>
    )
}
