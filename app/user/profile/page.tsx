'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import BottomNav from '@/components/BottomNav'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'

interface UserProfile {
  id: string
  email: string
  nama: string
  peranan: string
  fakulti: string
  no_telefon: string
  no_matrik: string
  status: string
}

export default function UserProfile() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [changingPassword, setChangingPassword] = useState(false)
  const [formData, setFormData] = useState({ nama: '', email: '', fakulti: '', no_telefon: '', no_matrik: '' })
  const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })
  const [message, setMessage] = useState({ type: '', text: '' })

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (!userData) { router.push('/login'); return }
    const parsed = JSON.parse(userData)
    setUser(parsed)
    fetchProfile(parsed.id)
  }, [router])

  const fetchProfile = async (userId: string) => {
    try {
      const response = await fetch(`/api/user/profile?userId=${userId}`)
      const data = await response.json()
      if (data.success) {
        setProfile(data.data)
        setFormData({
          nama: data.data.nama || '',
          email: data.data.email || '',
          fakulti: data.data.fakulti || '',
          no_telefon: data.data.no_telefon || '',
          no_matrik: data.data.no_matrik || ''
        })
      } else {
        setMessage({ type: 'error', text: 'Gagal memuat profil' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Ralat rangkaian' })
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!profile) return
    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: profile.id, ...formData })
      })
      const data = await response.json()
      if (data.success) {
        setMessage({ type: 'success', text: 'Profil berjaya dikemaskini' })
        setEditing(false)
        fetchProfile(profile.id)
        if (user.nama !== formData.nama) {
          const updatedUser = { ...user, nama: formData.nama }
          localStorage.setItem('user', JSON.stringify(updatedUser))
          setUser(updatedUser)
        }
      } else {
        setMessage({ type: 'error', text: data.error || 'Gagal kemaskini profil' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Ralat rangkaian' })
    }
  }

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!profile) return
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: 'error', text: 'Password baru dan pengesahan tidak sepadan' })
      return
    }
    if (passwordData.newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Password baru mestilah sekurang-kurangnya 6 aksara' })
      return
    }
    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: profile.id,
          action: 'change-password',
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        })
      })
      const data = await response.json()
      if (data.success) {
        setMessage({ type: 'success', text: 'Password berjaya ditukar' })
        setChangingPassword(false)
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
      } else {
        setMessage({ type: 'error', text: data.error || 'Gagal tukar password' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Ralat rangkaian' })
    }
  }

  if (!user || loading) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <Skeleton className="h-8 w-32" />
    </div>
  )

  if (!profile) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <p className="text-muted-foreground">Profile not found</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-background p-3 pb-24">
      <div className="max-w-4xl mx-auto space-y-4">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Profil Saya</CardTitle>
              {!editing && !changingPassword && (
                <Button size="sm" onClick={() => setEditing(true)}>Edit Profil</Button>
              )}
            </div>
          </CardHeader>
        </Card>

        {message.text && (
          <div className={`rounded-md p-3 text-sm ${message.type === 'success' ? 'bg-green-500/15 text-green-700' : 'bg-destructive/15 text-destructive'}`}>
            {message.text}
          </div>
        )}

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-start gap-4 mb-6 pb-4 border-b border-border">
              <Avatar className="h-16 w-16">
                <AvatarFallback className="text-lg font-bold bg-primary text-primary-foreground">
                  {profile.nama ? profile.nama.charAt(0).toUpperCase() : 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h3 className="font-bold text-foreground text-lg">{profile.nama}</h3>
                <p className="text-muted-foreground text-sm">{profile.email}</p>
                <p className="text-muted-foreground text-sm capitalize">{profile.peranan}</p>
                <Badge variant={profile.status === 'aktif' ? 'default' : 'destructive'} className="mt-1">
                  {profile.status === 'aktif' ? 'Aktif' : 'Tidak Aktif'}
                </Badge>
              </div>
            </div>

            {editing ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Nama Penuh</Label>
                    <Input value={formData.nama} onChange={(e) => setFormData({...formData, nama: e.target.value})} required />
                  </div>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required />
                  </div>
                  <div className="space-y-2">
                    <Label>Fakulti</Label>
                    <select value={formData.fakulti} onChange={(e) => setFormData({...formData, fakulti: e.target.value})} className="border-input dark:bg-input/30 h-9 w-full rounded-md border bg-transparent px-3 text-sm" required>
                      <option value="">Pilih Fakulti</option>
                      <option value="Kejururawatan">Kejururawatan</option>
                      <option value="Farmasi">Farmasi</option>
                      <option value="Perubatan">Perubatan</option>
                      <option value="Sains Kesihatan">Sains Kesihatan</option>
                      <option value="Pergigian">Pergigian</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label>No. Telefon</Label>
                    <Input type="tel" value={formData.no_telefon} onChange={(e) => setFormData({...formData, no_telefon: e.target.value})} placeholder="0123456789" />
                  </div>
                  <div className="space-y-2">
                    <Label>No. Matrik</Label>
                    <Input value={formData.no_matrik} onChange={(e) => setFormData({...formData, no_matrik: e.target.value})} placeholder="ILK2023001" />
                  </div>
                </div>
                <div className="flex gap-2 pt-2">
                  <Button type="submit">Simpan</Button>
                  <Button type="button" variant="outline" onClick={() => setEditing(false)}>Batal</Button>
                </div>
              </form>
            ) : changingPassword ? (
              <form onSubmit={handlePasswordChange} className="space-y-4">
                <div className="space-y-2">
                  <Label>Password Semasa</Label>
                  <Input type="password" value={passwordData.currentPassword} onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})} required />
                </div>
                <div className="space-y-2">
                  <Label>Password Baru</Label>
                  <Input type="password" value={passwordData.newPassword} onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})} required minLength={6} />
                </div>
                <div className="space-y-2">
                  <Label>Pengesahan Password Baru</Label>
                  <Input type="password" value={passwordData.confirmPassword} onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})} required />
                </div>
                <div className="flex gap-2 pt-2">
                  <Button type="submit">Tukar Password</Button>
                  <Button type="button" variant="outline" onClick={() => setChangingPassword(false)}>Batal</Button>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { label: 'Nama Penuh', value: profile.nama },
                    { label: 'Email', value: profile.email },
                    { label: 'Fakulti', value: profile.fakulti },
                    { label: 'No. Telefon', value: profile.no_telefon || '-' },
                    { label: 'No. Matrik', value: profile.no_matrik || '-' },
                    { label: 'Peranan', value: profile.peranan }
                  ].map(({ label, value }) => (
                    <div key={label}>
                      <p className="text-sm text-muted-foreground">{label}</p>
                      <p className="font-medium capitalize">{value}</p>
                    </div>
                  ))}
                </div>
                <div className="pt-4 border-t border-border">
                  <Button variant="secondary" onClick={() => setChangingPassword(true)}>Tukar Password</Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <BottomNav activeTab="profile" />
      </div>
    </div>
  )
}
