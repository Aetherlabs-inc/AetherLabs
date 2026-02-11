import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/lib/auth'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { signIn } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const { error } = await signIn(email, password)

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      navigate('/')
    }
  }

  return (
    <div className="relative min-h-svh overflow-hidden bg-[#f9f8f6]">
      <div className="pointer-events-none absolute inset-0">
        <div className="auth-blob auth-blob--gold -top-24 right-0" />
        <div className="auth-blob auth-blob--terracotta -bottom-24 left-0" />
        <div className="auth-blob auth-blob--charcoal top-1/3 left-1/2" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(42,33,33,0.06),_transparent_60%)]" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-svh max-w-5xl flex-col px-6 py-10 sm:py-14">
        <header className="flex items-center justify-center sm:justify-between">
          <div className="flex items-center gap-2 tracking-wide">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-[#2A2121] text-[#f9f8f6] font-semibold">
              Æ
            </div>
            <span className="text-sm text-[#2A2121]/80">AetherLabs Admin</span>
          </div>
          <p className="hidden text-sm text-[#2A2121]/60 sm:block">
            Internal access for curated operations.
          </p>
        </header>

        <div className="flex flex-1 items-center justify-center">
          <Card className="w-full max-w-md rounded-3xl border border-[#2A2121]/10 bg-white/80 p-1 shadow-[0_30px_80px_-50px_rgba(42,33,33,0.7)] backdrop-blur">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-[#2A2121]">Sign in</CardTitle>
              <CardDescription className="text-[#2A2121]/60">
                Use your admin credentials to continue.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="rounded-xl border border-[#CA5B2B]/30 bg-[#CA5B2B]/10 p-3 text-sm text-[#2A2121]">
                    {error}
                  </div>
                )}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#2A2121]/80">Email</label>
                  <Input
                    type="email"
                    placeholder="admin@aetherlabs.art"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="rounded-xl border-[#2A2121]/15 bg-white text-[#2A2121] placeholder:text-[#2A2121]/40"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#2A2121]/80">Password</label>
                  <Input
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="rounded-xl border-[#2A2121]/15 bg-white text-[#2A2121] placeholder:text-[#2A2121]/40"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full rounded-xl bg-[#2A2121] text-[#f9f8f6] hover:bg-[#2A2121]/90"
                  disabled={loading}
                >
                  {loading ? 'Signing in...' : 'Sign In'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
