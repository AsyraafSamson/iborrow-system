'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import BottomNav from '@/components/BottomNav'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Settings, Building2, Mail, Phone, Info } from 'lucide-react'

export default function TetapanSistem() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const [tetapan, setTetapan] = useState({
    namaSistem: 'iBorrow System',
    namaOrganisasi: 'Institut Latihan Kemahiran Malaysia (ILKKM)',
    emailAdmin: 'admin@ilkkm.edu.my',
    noTelefon: '03-1234 5678',
    alamat: 'Kuala Lumpur, Malaysia',
    versiSistem: '1.0.0',
    maksTempahanSerentak: '3',
    tempohTempahanMaksimum: '14',
  })

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (!userData) { router.push('/login'); return }
    setUser(JSON.parse(userData))
  }, [router])

  const handleSave = async () => {
    setLoading(true)
    setMessage('')
    // Simulate save — replace with real API call when backend is ready
    await new Promise(resolve => setTimeout(resolve, 600))
    setMessage('Tetapan berjaya dikemas kini!')
    setIsEditing(false)
    setLoading(false)
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
            <CardTitle className="flex items-center gap-2">
              <Settings className="size-5" />
              Tetapan Sistem
            </CardTitle>
            <p className="text-sm text-muted-foreground">Konfigurasi maklumat dan tetapan am sistem</p>
          </CardHeader>
        </Card>

        {message && (
          <div className={`rounded-md p-3 text-sm ${message.includes('berjaya') ? 'bg-green-500/15 text-green-700' : 'bg-destructive/15 text-destructive'}`}>
            {message}
          </div>
        )}

        {/* Maklumat Organisasi */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-base flex items-center gap-2">
                <Building2 className="size-4" />
                Maklumat Organisasi
              </CardTitle>
              {!isEditing ? (
                <Button size="sm" onClick={() => setIsEditing(true)}>Edit</Button>
              ) : (
                <div className="flex gap-2">
                  <Button size="sm" onClick={handleSave} disabled={loading}>
                    {loading ? 'Menyimpan...' : 'Simpan'}
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => { setIsEditing(false); setMessage('') }}>
                    Batal
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {([
              { key: 'namaSistem', label: 'Nama Sistem' },
              { key: 'namaOrganisasi', label: 'Nama Organisasi' },
              { key: 'alamat', label: 'Alamat' },
            ] as const).map(({ key, label }) => (
              <div key={key} className="space-y-1">
                <Label>{label}</Label>
                {isEditing ? (
                  <Input
                    value={tetapan[key]}
                    onChange={(e) => setTetapan({ ...tetapan, [key]: e.target.value })}
                  />
                ) : (
                  <div className="rounded-md bg-muted px-3 py-2 text-sm">{tetapan[key]}</div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Maklumat Hubungan */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Mail className="size-4" />
              Maklumat Hubungan
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {([
              { key: 'emailAdmin', label: 'Email Admin', type: 'email' },
              { key: 'noTelefon', label: 'No. Telefon', type: 'tel' },
            ] as const).map(({ key, label, type }) => (
              <div key={key} className="space-y-1">
                <Label>{label}</Label>
                {isEditing ? (
                  <Input
                    type={type}
                    value={tetapan[key]}
                    onChange={(e) => setTetapan({ ...tetapan, [key]: e.target.value })}
                  />
                ) : (
                  <div className="rounded-md bg-muted px-3 py-2 text-sm">{tetapan[key]}</div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Tetapan Tempahan */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Tetapan Tempahan</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <Label>Maksimum Tempahan Serentak (per pengguna)</Label>
              {isEditing ? (
                <Input
                  type="number"
                  min="1"
                  max="10"
                  value={tetapan.maksTempahanSerentak}
                  onChange={(e) => setTetapan({ ...tetapan, maksTempahanSerentak: e.target.value })}
                />
              ) : (
                <div className="rounded-md bg-muted px-3 py-2 text-sm">{tetapan.maksTempahanSerentak} tempahan</div>
              )}
            </div>
            <div className="space-y-1">
              <Label>Tempoh Tempahan Maksimum (hari)</Label>
              {isEditing ? (
                <Input
                  type="number"
                  min="1"
                  max="60"
                  value={tetapan.tempohTempahanMaksimum}
                  onChange={(e) => setTetapan({ ...tetapan, tempohTempahanMaksimum: e.target.value })}
                />
              ) : (
                <div className="rounded-md bg-muted px-3 py-2 text-sm">{tetapan.tempohTempahanMaksimum} hari</div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Info Sistem */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Info className="size-4" />
              Maklumat Sistem
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { label: 'Versi Sistem', value: tetapan.versiSistem },
              { label: 'Platform', value: 'Next.js 15 + Cloudflare Pages' },
              { label: 'Database', value: 'Cloudflare D1 (SQLite)' },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between items-center text-sm border-b border-border pb-2 last:border-b-0 last:pb-0">
                <span className="text-muted-foreground">{label}</span>
                <span className="font-medium">{value}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <BottomNav activeTab="dashboard" />
      </div>
    </div>
  )
}
