'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import BottomNav from '@/components/BottomNav'
import EmptyState from '@/components/empty-state'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { ClipboardX } from 'lucide-react'

interface Tempahan {
  id: string
  barangId: string
  namaBarang: string
  kategori: string
  kuantiti: number
  tarikhMula: string
  tarikhTamat: string
  tujuan: string
  status: 'Pending' | 'Diluluskan' | 'Ditolak' | 'Selesai' | 'Dibatalkan'
  createdAt: string
  catatan?: string
  returnRequestId?: string
  returnRequestStatus?: 'pending' | 'acknowledged' | 'scheduled' | 'completed' | 'cancelled'
  returnRequestUrgency?: 'normal' | 'urgent'
  returnRequestedAt?: string
}

const statusVariant = (status: string): "default" | "destructive" | "secondary" | "outline" => {
  if (status === 'Diluluskan') return 'default'
  if (status === 'Ditolak') return 'destructive'
  if (status === 'Selesai') return 'outline'
  return 'secondary'
}

export default function UserTempahan() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [tempahan, setTempahan] = useState<Tempahan[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'active' | 'all'>('active')
  const [message, setMessage] = useState({ type: '', text: '' })

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (!userData) { router.push('/login'); return }
    const parsed = JSON.parse(userData)
    setUser(parsed)
    fetchTempahan(parsed.id)
  }, [router])

  const fetchTempahan = async (userId: string) => {
    try {
      const response = await fetch(`/api/user/tempahan?userId=${userId}`)
      const data = await response.json()
      if (data.success) setTempahan(data.data || [])
      else setMessage({ type: 'error', text: 'Gagal memuat tempahan' })
    } catch (error) {
      setMessage({ type: 'error', text: 'Ralat rangkaian' })
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = async (tempahanId: string) => {
    if (!confirm('Adakah anda pasti untuk membatalkan tempahan ini?')) return
    try {
      const response = await fetch('/api/user/tempahan', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tempahanId })
      })
      const data = await response.json()
      if (data.success) { setMessage({ type: 'success', text: 'Tempahan berjaya dibatalkan' }); fetchTempahan(user.id) }
      else setMessage({ type: 'error', text: data.error || 'Gagal batalkan tempahan' })
    } catch (error) {
      setMessage({ type: 'error', text: 'Ralat rangkaian' })
    }
  }

  const handleReturnRequest = async (item: Tempahan) => {
    const urgency = confirm('Adakah ini permohonan pemulangan segera?') ? 'urgent' : 'normal'
    const notes = prompt('Nota tambahan (opsional):') || ''
    if (!confirm(`Hantar permohonan pemulangan untuk ${item.namaBarang}?\n\nStaff ICT akan dimaklumkan secara automatik.`)) return
    setLoading(true)
    try {
      const response = await fetch('/api/user/return-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingId: item.id, urgency, notes })
      })
      const data = await response.json()
      if (data.success) {
        setMessage({ type: 'success', text: `Permohonan pemulangan berjaya dihantar! ${data.staffCount} staff telah dimaklumkan.` })
        fetchTempahan(user.id)
      } else {
        setMessage({ type: 'error', text: data.error || 'Gagal hantar permohonan' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Ralat rangkaian' })
    } finally {
      setLoading(false)
    }
  }

  const filteredTempahan = tempahan.filter(item =>
    activeTab === 'active' ? ['Pending', 'Diluluskan'].includes(item.status) : true
  )

  const activeTempahan = tempahan.filter(t => ['Pending', 'Diluluskan'].includes(t.status))

  if (!user) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <Skeleton className="h-8 w-32" />
    </div>
  )

  return (
    <div className="min-h-screen bg-background p-3 pb-24">
      <div className="max-w-4xl mx-auto space-y-4">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Tempahan Saya</CardTitle>
              <Link href="/user/barang">
                <Button size="sm">+ Tempah Barang</Button>
              </Link>
            </div>
          </CardHeader>
        </Card>

        {message.text && (
          <div className={`rounded-md p-3 text-sm ${message.type === 'success' ? 'bg-green-500/15 text-green-700' : 'bg-destructive/15 text-destructive'}`}>
            {message.text}
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Card><CardContent className="pt-4 text-center"><div className="text-lg font-bold text-orange-600">{tempahan.filter(t => t.status === 'Pending').length}</div><div className="text-xs text-muted-foreground">Menunggu</div></CardContent></Card>
          <Card><CardContent className="pt-4 text-center"><div className="text-lg font-bold text-green-600">{tempahan.filter(t => t.status === 'Diluluskan').length}</div><div className="text-xs text-muted-foreground">Diluluskan</div></CardContent></Card>
          <Card><CardContent className="pt-4 text-center"><div className="text-lg font-bold text-blue-600">{tempahan.filter(t => t.status === 'Selesai').length}</div><div className="text-xs text-muted-foreground">Selesai</div></CardContent></Card>
          <Card><CardContent className="pt-4 text-center"><div className="text-lg font-bold text-foreground">{tempahan.length}</div><div className="text-xs text-muted-foreground">Jumlah</div></CardContent></Card>
        </div>

        <Card>
          <CardContent className="pt-4">
            <div className="grid grid-cols-2 gap-1">
              <button
                onClick={() => setActiveTab('active')}
                className={`py-2 px-4 rounded-md text-sm font-medium transition-colors ${activeTab === 'active' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}
              >
                Aktif ({activeTempahan.length})
              </button>
              <button
                onClick={() => setActiveTab('all')}
                className={`py-2 px-4 rounded-md text-sm font-medium transition-colors ${activeTab === 'all' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}
              >
                Semua ({tempahan.length})
              </button>
            </div>
          </CardContent>
        </Card>

        {loading ? (
          <Card><CardContent className="p-8 text-center text-muted-foreground">Sedang memuatkan tempahan anda...</CardContent></Card>
        ) : filteredTempahan.length === 0 ? (
          <Card>
            <CardContent className="p-4">
              <EmptyState
                icon={ClipboardX}
                title={activeTab === 'active' ? 'Tiada tempahan aktif' : 'Tiada tempahan direkodkan'}
                description={activeTab === 'active'
                  ? 'Semua tempahan anda telah selesai atau belum dibuat. Anda boleh buat tempahan baharu bila-bila masa.'
                  : 'Belum ada tempahan dalam rekod anda. Mulakan dengan memilih barang yang tersedia.'}
                actionHref="/user/barang"
                actionLabel="Lihat Barang Tersedia"
              />
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {filteredTempahan.map((item) => (
              <Card key={item.id}>
                <CardContent className="pt-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-bold text-foreground">{item.namaBarang}</h3>
                      <p className="text-sm text-muted-foreground">{item.kategori} • Kuantiti: {item.kuantiti}</p>
                    </div>
                    <Badge variant={statusVariant(item.status)}>{item.status}</Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-3 text-sm">
                    <div>
                      <span className="text-muted-foreground">Tarikh Mula:</span>
                      <p className="font-medium">{new Date(item.tarikhMula).toLocaleDateString('ms-MY')}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Tarikh Tamat:</span>
                      <p className="font-medium">{new Date(item.tarikhTamat).toLocaleDateString('ms-MY')}</p>
                    </div>
                  </div>

                  <div className="mb-3 text-sm">
                    <span className="text-muted-foreground">Tujuan:</span>
                    <p className="text-foreground">{item.tujuan}</p>
                  </div>

                  {item.catatan && (
                    <div className="bg-muted rounded-md p-3 mb-3">
                      <span className="text-sm text-muted-foreground">Catatan:</span>
                      <p className="text-sm text-foreground">{item.catatan}</p>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Ditempah: {new Date(item.createdAt).toLocaleDateString('ms-MY')}</span>
                    <div>
                      {item.status === 'Pending' && (
                        <Button variant="destructive" size="sm" className="h-7 text-xs" onClick={() => handleCancel(item.id)}>
                          Batal
                        </Button>
                      )}
                      {item.status === 'Diluluskan' && !item.returnRequestId && (
                        <Button size="sm" className="h-7 text-xs" onClick={() => handleReturnRequest(item)}>
                          Mohon Pulangkan
                        </Button>
                      )}
                      {item.status === 'Diluluskan' && item.returnRequestId && (
                        <div className="text-xs">
                          {item.returnRequestStatus === 'pending' && <Badge variant="secondary">Permohonan Pulang Dihantar</Badge>}
                          {item.returnRequestStatus === 'acknowledged' && <Badge variant="default">Staff Terima Permohonan</Badge>}
                          {item.returnRequestStatus === 'scheduled' && <Badge variant="secondary">Dijadualkan</Badge>}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <BottomNav activeTab="tempahan" />
      </div>
    </div>
  )
}
