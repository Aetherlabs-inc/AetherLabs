'use client'

import { useState } from 'react'
import { Button, Input, Label, useToast } from '@aetherlabs/ui'
import { cn } from '@/lib/utils'
import { createClient } from '@/src/lib/supabase'
import { userProfileService } from '@/src/services/user-profile-service'
import { BsEyeSlashFill, BsFillEyeFill } from "react-icons/bs"

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
                try {
                    await userProfileService.createInitialProfile(
                        data.user.id,
                        email,
                        {
                            full_name: fullName,
                            user_type: userType,
                        }
                    )

                    toast({
                        title: "Account Created!",
                        description: "Check your email to confirm your account and enter the studio.",
                    })

                    setMessage('Account created successfully! Check your email for the confirmation link.')
                } catch (profileError) {
                    console.error('Error creating profile:', profileError)
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
            <div className="flex flex-col gap-3 text-center">
                <div className="mx-auto w-fit rounded-full border border-[#2A2121]/15 bg-[#CA5B2B]/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-[#2A2121]">
                    Artist Entry
                </div>
                <h1 className="text-2xl font-semibold text-[#2A2121]">Create your studio access</h1>
                <p className="text-sm text-[#2A2121]/60">
                    AetherLabs keeps your artwork verified and beautifully documented.
                </p>
            </div>
            <div className="grid gap-5">
                <div className="grid gap-2">
                    <Label htmlFor="fullName">Full Name *</Label>
                    <Input
                        id="fullName"
                        type="text"
                        placeholder="Your name"
                        required
                        onChange={(e) => setFullName(e.target.value)}
                        value={fullName}
                        className="h-12 rounded-2xl border-[#2A2121]/20"
                    />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        type="email"
                        placeholder="studio@email.com"
                        required
                        onChange={(e) => setEmail(e.target.value)}
                        value={email}
                        className="h-12 rounded-2xl border-[#2A2121]/20"
                    />
                </div>

                <div className="grid gap-2">
                    <Label>I am a *</Label>
                    <div className="grid grid-cols-3 gap-2">
                        {(['artist', 'gallery', 'collector'] as const).map((type) => (
                            <Button
                                key={type}
                                type="button"
                                variant={userType === type ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setUserType(type)}
                                className="capitalize rounded-2xl"
                            >
                                {type}
                            </Button>
                        ))}
                    </div>
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative w-full flex items-center">
                        <Input
                            id="password"
                            type={isVisible ? "text" : "password"}
                            placeholder="Create a password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full h-12 rounded-2xl pr-12 border-[#2A2121]/20"
                        />
                        <Button
                            onClick={toggleVisibility}
                            type="button"
                            className="absolute right-0 inset-y-0 h-12 w-12 flex items-center justify-center rounded-2xl"
                            aria-label="Toggle password visibility"
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
                        className="h-12 rounded-2xl border-[#2A2121]/20"
                    />
                </div>

                {error && <p className="text-destructive text-sm">{error}</p>}
                {message && <p className="text-green-600 text-sm">{message}</p>}

                <Button
                    type="submit"
                    className="w-full rounded-2xl bg-[#2A2121] text-white hover:bg-[#2A2121]/90"
                >
                    {loading ? 'Creating Account...' : 'Enter the Portal'}
                </Button>
            </div>
            <div className="text-center text-sm text-[#2A2121]/70">
                Already have access?{' '}
                <a href="/login" className="font-medium text-[#CA5B2B] underline underline-offset-4">
                    Sign in
                </a>
            </div>
        </form>
    )
}
