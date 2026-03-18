'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { CircleAlert, Eye, EyeOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })

      const data = await response.json()

      if (data.success) {
        setSuccess(`${data.message}. Mengarahkan anda ke halaman seterusnya...`)
        localStorage.setItem('user', JSON.stringify(data.user))
        if (data.token) {
          localStorage.setItem('session_token', data.token)
        }
        setTimeout(() => {
          router.push(data.redirectTo)
        }, 1000)
      } else {
        setError(data.error || 'Log masuk gagal')
        setLoading(false)
      }
    } catch (error) {
      console.error('Login error:', error)
      setError('Ralat rangkaian. Sila cuba lagi.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-xl font-bold text-primary-foreground">iB</span>
          </div>
          <CardTitle className="text-2xl">Sistem i-Borrow</CardTitle>
          <CardDescription>ILKKM Johor Bahru</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 rounded-md bg-destructive/15 p-3 text-sm text-destructive">
              <div className="flex items-start gap-2">
                <CircleAlert className="mt-0.5 h-4 w-4 shrink-0" />
                <div className="space-y-1 text-left">
                  <p>{error}</p>
                  <p className="text-xs text-destructive/80">
                    Semak semula ejaan email ILKKM dan kata laluan anda sebelum cuba lagi.
                  </p>
                </div>
              </div>
            </div>
          )}
          {success && (
            <div className="mb-4 rounded-md bg-green-500/15 p-3 text-sm text-green-700">
              {success}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Masukkan email"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Kata Laluan</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan kata laluan"
                  className="pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((current) => !current)}
                  className="absolute inset-y-0 right-0 flex items-center justify-center px-3 text-muted-foreground hover:text-foreground"
                  aria-label={showPassword ? 'Sembunyikan kata laluan' : 'Lihat kata laluan'}
                  aria-pressed={showPassword}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Sedang log masuk...' : 'Log Masuk'}
            </Button>
          </form>

        </CardContent>
      </Card>
    </div>
  )
}
