'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { createClient } from '@/src/lib/supabase'
import { BsEyeSlashFill, BsFillEyeFill } from "react-icons/bs"
import Image from "next/image"

const supabase = createClient()

export function SupabaseLoginForm({
    className,
    ...props
}: React.ComponentPropsWithoutRef<"form">) {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isVisible, setIsVisible] = useState(false)
    const [error, setError] = useState<string>("")
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const toggleVisibility = () => setIsVisible(!isVisible)

    const handleSignIn = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        setLoading(true)

        try {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            })

            if (error) {
                setError(error.message)
            } else {
                router.push('/dashboard')
            }
        } catch (err) {
            console.error('Unexpected error:', err)
            setError('An unexpected error occurred')
        } finally {
            setLoading(false)
        }
    }

    return (
        <form className={cn("flex flex-col gap-6", className)} {...props} onSubmit={handleSignIn}>
            <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">Login to your account</h1>
                <p className="text-balance text-sm text-muted-foreground">
                    Enter your email below to login to your account
                </p>
            </div>
            <div className="grid gap-6">
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
                {error && <p className="text-red-500 mb-4">{error}</p>}
                <Button type="submit" className="w-full" onClick={handleSignIn} disabled={loading}>
                    Login
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
                        Login with Apple
                    </Button>
                    <Button variant="outline" className="w-full">
                        <Image
                            src="/google.png"
                            alt="Apple logo"
                            width={20}
                            height={20}
                            className="mr-2"
                        />
                        Login with Google
                    </Button>
                </div>

            </div>
            <div className="text-center text-sm">
                Don&apos;t have an account?{" "}
                <a href="/signup" className="underline underline-offset-4">
                    Sign up
                </a>
            </div>
        </form>
    )
}
