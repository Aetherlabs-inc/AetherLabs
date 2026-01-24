'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button, Input, Label } from '@aetherlabs/ui'
import { cn } from '@/lib/utils'
import { createClient } from '@/src/lib/supabase'
import { BsEyeSlashFill, BsFillEyeFill } from "react-icons/bs"

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
            <div className="relative overflow-hidden rounded-[28px] border border-[#2A2121]/18 bg-[#f2f2f2]/70 px-6 py-7 shadow-[0_24px_70px_-50px_rgba(42,33,33,0.7)] backdrop-blur-xl">
                <div className="pointer-events-none absolute inset-0">
                    <div className="absolute inset-0 opacity-35 [background:radial-gradient(140%_120%_at_10%_0%,rgba(202,91,43,0.22),transparent_55%),radial-gradient(120%_120%_at_90%_100%,rgba(188,128,16,0.2),transparent_60%)]" />
                    <div className="absolute inset-0 opacity-45 [background:linear-gradient(120deg,rgba(42,33,33,0.1),transparent_35%,rgba(42,33,33,0.06))]" />
                    <div
                        className="absolute inset-0 opacity-[0.28] mix-blend-multiply"
                        style={{
                            backgroundImage:
                                'url("data:image/svg+xml;utf8,<svg xmlns=\\"http://www.w3.org/2000/svg\\" width=\\"160\\" height=\\"160\\" viewBox=\\"0 0 160 160\\"><filter id=\\"n\\"><feTurbulence type=\\"fractalNoise\\" baseFrequency=\\"0.9\\" numOctaves=\\"2\\" stitchTiles=\\"stitch\\"/></filter><rect width=\\"160\\" height=\\"160\\" filter=\\"url(%23n)\\" opacity=\\"0.35\\"/></svg>")'
                        }}
                    />
                </div>
                <div className="relative">
                <div className="flex flex-col gap-4 text-left">
                    <div className="flex items-center gap-3">
                        <div className="h-2.5 w-2.5 rounded-full bg-[#BC8010]" />
                        <span className="text-[11px] uppercase tracking-[0.32em] text-[#2A2121]/70">studio access</span>
                    </div>
                    <div>
                        <h1 className="text-2xl font-semibold text-[#2A2121]">Welcome back</h1>
                        <p className="text-sm text-[#2A2121]/60">
                            Enter the archive to steward your authenticated works.
                        </p>
                    </div>
                </div>

                <div className="mt-6 grid gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="email" className="text-xs uppercase tracking-wider text-[#2A2121]/70">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="studio@email.com"
                            required
                            onChange={(e) => setEmail(e.target.value)}
                            value={email}
                            className="h-12 rounded-2xl border-[#2A2121]/15 bg-white/80"
                        />
                    </div>
                    <div className="grid gap-2">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="password" className="text-xs uppercase tracking-wider text-[#2A2121]/70">Password</Label>
                            <a
                                href="#"
                                className="text-[11px] text-[#2A2121]/60 underline-offset-4 hover:underline"
                            >
                                Forgot?
                            </a>
                        </div>
                        <div className="relative w-full flex items-center">
                            <Input
                                type={isVisible ? "text" : "password"}
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full h-12 rounded-2xl pr-12 border-[#2A2121]/15 bg-white/80"
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
                    {error && <p className="text-sm text-destructive">{error}</p>}
                </div>

                <div className="mt-6">
                    <Button
                        type="submit"
                        className="w-full rounded-2xl bg-[#2A2121] text-white hover:bg-[#2A2121]/90"
                        onClick={handleSignIn}
                        disabled={loading}
                    >
                        {loading ? "Signing in..." : "Enter Studio"}
                    </Button>
                </div>
                </div>
            </div>

            <div className="text-center text-sm text-[#2A2121]/70">
                New here?{" "}
                <a href="/signup" className="font-medium text-[#CA5B2B] underline underline-offset-4">
                    Create your account
                </a>
            </div>
        </form>
    )
}
