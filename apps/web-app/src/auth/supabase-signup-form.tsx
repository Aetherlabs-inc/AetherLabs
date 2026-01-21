'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { createClient } from '@/src/lib/supabase'
import { userProfileService } from '@/src/services/user-profile-service'
import { useToast } from '@/hooks/use-toast'
import { BsEyeSlashFill, BsFillEyeFill } from "react-icons/bs"
import Image from "next/image"

const supabase = createClient()

export function SupabaseSignupForm({
    className,
    ...props
}: React.ComponentPropsWithoutRef<"form">) {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [fullName, setFullName] = useState('')
    const [userType, setUserType] = useState<'artist' | 'gallery' | 'collector'>('artist')
    const [bio, setBio] = useState('')
    const [website, setWebsite] = useState('')
    const [location, setLocation] = useState('')
    const [phone, setPhone] = useState('')
    const [isVisible, setIsVisible] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [message, setMessage] = useState('')
    const { toast } = useToast()

    const toggleVisibility = () => setIsVisible(!isVisible)

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')
        setMessage('')

        if (password !== confirmPassword) {
            setError('Passwords do not match')
            setLoading(false)
            return
        }

        if (!fullName.trim()) {
            setError('Full name is required')
            setLoading(false)
            return
        }

        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: fullName,
                        user_type: userType,
                    }
                }
            })

            if (error) {
                setError(error.message)
            } else if (data.user) {
                // Create user profile immediately after signup
                try {
                    await userProfileService.createInitialProfile(
                        data.user.id,
                        email,
                        {
                            full_name: fullName,
                            user_type: userType,
                        }
                    )

                    // Update profile with additional fields if provided
                    if (bio || website || location || phone) {
                        await userProfileService.updateUserProfile(data.user.id, {
                            bio: bio || null,
                            website: website || null,
                            location: location || null,
                            phone: phone || null,
                        })
                    }

                    toast({
                        title: "Account Created!",
                        description: "Your profile has been set up successfully. Check your email for confirmation.",
                    })

                    setMessage('Account created successfully! Check your email for the confirmation link.')
                } catch (profileError) {
                    console.error('Error creating profile:', profileError)
                    // Still show success for auth, but mention profile creation issue
                    setMessage('Account created! Check your email for confirmation. You can complete your profile later.')
                }
            }
        } catch (err) {
            setError('An unexpected error occurred')
        } finally {
            setLoading(false)
        }
    }

    return (
        <form className={cn("flex flex-col gap-6", className)} {...props} onSubmit={handleSignUp}>
            <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">Everything Starts Here!</h1>
                <p className="text-balance text-sm text-muted-foreground">
                    Sign up to get started with AetherLabs
                </p>
            </div>
            <div className="grid gap-6">
                {/* Basic Information */}
                <div className="grid gap-2">
                    <Label htmlFor="fullName">Full Name *</Label>
                    <Input
                        id="fullName"
                        type="text"
                        placeholder="Enter your full name"
                        required
                        onChange={(e) => setFullName(e.target.value)}
                        value={fullName}
                    />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        type="email"
                        placeholder="m@example.com"
                        required
                        onChange={(e) => setEmail(e.target.value)}
                        value={email}
                    />
                </div>

                <div className="grid gap-2">
                    <Label>I am a *</Label>
                    <div className="flex space-x-2">
                        {(['artist', 'gallery', 'collector'] as const).map((type) => (
                            <Button
                                key={type}
                                type="button"
                                variant={userType === type ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setUserType(type)}
                                className="capitalize flex-1"
                            >
                                {type}
                            </Button>
                        ))}
                    </div>
                </div>

                <div className="grid gap-2">
                    <div className="flex items-center">
                        <Label htmlFor="password">Password</Label>
                        <a
                            href="#"
                            className="ml-auto text-sm underline-offset-4 hover:underline"
                        >
                            Forgot your password?
                        </a>
                    </div>
                    <div className="relative w-full flex items-center">
                        <Input
                            type={isVisible ? "text" : "password"}
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full h-12 rounded-xl pr-12" // Ensure there is padding to not overlap the icon
                        />
                        <Button
                            onClick={toggleVisibility}
                            className="absolute right-0 inset-y-0 h-12 w-12 flex items-center justify-center rounded-xl"
                            aria-label="Toggle password visibility"  // Accessibility improvement
                            variant="ghost"
                        >
                            {isVisible ? <BsFillEyeFill /> : <BsEyeSlashFill />}
                        </Button>
                    </div>
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="Confirm your password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                </div>

                {/* Optional Profile Information */}
                <div className="border-t pt-4">
                    <h3 className="text-sm font-medium mb-3">
                        Optional Profile Information
                    </h3>

                    <div className="space-y-2">
                        <Label htmlFor="bio">Bio</Label>
                        <textarea
                            id="bio"
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            className="w-full min-h-[80px] px-3 py-2 border border-input bg-background rounded-md text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                            placeholder="Tell us about yourself..."
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="website">Website</Label>
                            <Input
                                id="website"
                                type="url"
                                value={website}
                                onChange={(e) => setWebsite(e.target.value)}
                                placeholder="https://yourwebsite.com"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="phone">Phone</Label>
                            <Input
                                id="phone"
                                type="tel"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                placeholder="+1 (555) 123-4567"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="location">Location</Label>
                        <Input
                            id="location"
                            type="text"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            placeholder="City, Country"
                        />
                    </div>
                </div>

                {error && <p className="text-red-500 mb-4">{error}</p>}
                {message && <p className="text-green-500 mb-4">{message}</p>}

                <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? 'Creating account...' : 'Create Account'}
                </Button>
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

            </div>
            <div className="text-center text-sm">
                Don&apos;t have an account?{" "}
                <a href="/login" className="underline underline-offset-4">
                    Login
                </a>
            </div>
        </form>
    )
}
