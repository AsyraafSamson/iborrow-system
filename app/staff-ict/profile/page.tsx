'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import BottomNav from '@/components/BottomNav'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export default function StaffProfile() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState({ nama: '', email: '', telefon: '', jabatan: '' })
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' })
  const [isEditing, setIsEditing] = useState(false)
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (!userData) { router.push('/login'); return }
    const parsedUser = JSON.parse(userData)
    setUser(parsedUser)
    const fetchProfile = async () => {
      try {
        const response = await fetch('/api/staff-ict/profile')
        if (response.ok) {
          const data = await response.json()
          setProfile({ nama: data.nama || parsedUser.nama || '', email: data.email || parsedUser.email || '', telefon: data.telefon || '', jabatan: data.jabatan || '' })
        }
      } catch (error) {
        setProfile({ nama: parsedUser.nama || '', email: parsedUser.email || '', telefon: '', jabatan: '' })
      }
    }
    fetchProfile()
  }, [router])

  const handleUpdateProfile = async () => {
    setLoading(true)
    setMessage('')
    try {
      const response = await fetch('/api/staff-ict/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile)
      })
      const data = await response.json()
      if (response.ok) {
        setMessage('Profil berjaya dikemas kini!')
        setIsEditing(false)
        const updatedUser = { ...user, nama: profile.nama, email: profile.email }
        localStorage.setItem('user', JSON.stringify(updatedUser))
        setUser(updatedUser)
      } else {
        setMessage(data.error || 'Ralat mengemaskini profil')
      }
    } catch (error) {
      setMessage('Ralat mengemaskini profil')
    } finally {
      setLoading(false)
    }
  }

  const handleChangePassword = async () => {
    if (passwords.new !== passwords.confirm) { setMessage('Kata laluan baru tidak sepadan'); return }
    if (passwords.new.length < 6) { setMessage('Kata laluan baru mestilah sekurang-kurangnya 6 aksara'); return }
    setLoading(true)
    setMessage('')
    try {
      const response = await fetch('/api/staff-ict/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword: passwords.current, newPassword: passwords.new })
      })
      const data = await response.json()
      if (response.ok) {
        setMessage('Kata laluan berjaya dikemas kini!')
        setIsChangingPassword(false)
        setPasswords({ current: '', new: '', confirm: '' })
      } else {
        setMessage(data.error || 'Ralat menukar kata laluan')
      }
    } catch (error) {
      setMessage('Ralat menukar kata laluan')
    } finally {
      setLoading(false)
    }
  }

  if (!user) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <Skeleton className="h-8 w-32" />
    </div>
  )

  return (
    <div className="min-h-screen bg-background p-3 pb-24">
      <div className="max-w-6xl mx-auto space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Profil Staff ICT</CardTitle>
            <p className="text-sm text-muted-foreground">Urus maklumat profil anda</p>
          </CardHeader>
        </Card>

        {message && (
          <div className={`rounded-md p-3 text-sm ${message.includes('berjaya') ? 'bg-green-500/15 text-green-700' : 'bg-destructive/15 text-destructive'}`}>
            {message}
          </div>
        )}

        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-base">Maklumat Profil</CardTitle>
              {!isEditing ? (
                <Button size="sm" onClick={() => setIsEditing(true)}>Edit Profil</Button>
              ) : (
                <div className="flex gap-2">
                  <Button size="sm" onClick={handleUpdateProfile} disabled={loading}>{loading ? 'Menyimpan...' : 'Simpan'}</Button>
                  <Button size="sm" variant="outline" onClick={() => { setIsEditing(false); setMessage('') }}>Batal</Button>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {(['nama', 'email', 'telefon', 'jabatan'] as const).map((field) => (
              <div key={field} className="space-y-1">
                <Label>{field === 'telefon' ? 'No. Telefon' : field.charAt(0).toUpperCase() + field.slice(1)}</Label>
                {isEditing ? (
                  <Input
                    type={field === 'email' ? 'email' : field === 'telefon' ? 'tel' : 'text'}
                    value={profile[field]}
                    onChange={(e) => setProfile({...profile, [field]: e.target.value})}
                    placeholder={`Masukkan ${field}`}
                  />
                ) : (
                  <div className="rounded-md bg-muted px-3 py-2 text-sm">{profile[field] || 'Tidak dinyatakan'}</div>
                )}
              </div>
            ))}
            <div className="space-y-1">
              <Label>Peranan</Label>
              <div className="rounded-md bg-muted px-3 py-2 text-sm">Staff ICT</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-base">Tukar Kata Laluan</CardTitle>
              {!isChangingPassword ? (
                <Button size="sm" variant="secondary" onClick={() => setIsChangingPassword(true)}>Tukar Kata Laluan</Button>
              ) : (
                <div className="flex gap-2">
                  <Button size="sm" onClick={handleChangePassword} disabled={loading}>{loading ? 'Menyimpan...' : 'Tukar'}</Button>
                  <Button size="sm" variant="outline" onClick={() => { setIsChangingPassword(false); setPasswords({ current: '', new: '', confirm: '' }); setMessage('') }}>Batal</Button>
                </div>
              )}
            </div>
          </CardHeader>
          {isChangingPassword && (
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Kata Laluan Semasa</Label>
                <Input type="password" value={passwords.current} onChange={(e) => setPasswords({...passwords, current: e.target.value})} placeholder="Masukkan kata laluan semasa" />
              </div>
              <div className="space-y-2">
                <Label>Kata Laluan Baru</Label>
                <Input type="password" value={passwords.new} onChange={(e) => setPasswords({...passwords, new: e.target.value})} placeholder="Masukkan kata laluan baru (min. 6 aksara)" />
              </div>
              <div className="space-y-2">
                <Label>Sahkan Kata Laluan Baru</Label>
                <Input type="password" value={passwords.confirm} onChange={(e) => setPasswords({...passwords, confirm: e.target.value})} placeholder="Sahkan kata laluan baru" />
              </div>
            </CardContent>
          )}
        </Card>

        <BottomNav activeTab="profile" />
      </div>
    </div>
  )
}
