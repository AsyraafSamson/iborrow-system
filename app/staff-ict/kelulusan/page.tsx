'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import BottomNav from '@/components/BottomNav'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Skeleton } from '@/components/ui/skeleton'

interface Tempahan {
  id: string
  userId: string
  barangId: string
  namaBarang: string
  kategori: string
  lokasi: string
  namaPemohon: string
  emailPemohon: string
  fakulti: string
  kuantiti: number
  tarikhMula: string
  tarikhTamat: string
  tujuan: string
  status: string
  createdAt: string
}

const statusVariant = (status: string): "default" | "destructive" | "secondary" | "outline" => {
  if (status === 'Pending') return 'secondary'
  if (status === 'Diluluskan') return 'default'
  if (status === 'Selesai') return 'outline'
  return 'destructive'
}

export default function StaffKelulusan() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [tempahan, setTempahan] = useState<Tempahan[]>([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState('Pending')
  const [selectedBooking, setSelectedBooking] = useState<Tempahan | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [catatan, setCatatan] = useState('')

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (!userData) { router.push('/login'); return }
    setUser(JSON.parse(userData))
    fetchTempahan()
  }, [router])

  const fetchTempahan = async () => {
    try {
      const res = await fetch('/api/staff-ict/kelulusan')
      const data = await res.json()
      if (data.success) setTempahan(data.data || [])
    } catch (error) {
      console.error('Error fetching tempahan:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = (booking: Tempahan) => {
    setSelectedBooking(booking)
    setCatatan('')
    setShowModal(true)
  }

  const handleReject = async (booking: Tempahan) => {
    const reason = prompt('Masukkan sebab penolakan:')
    if (!reason) return
    if (!confirm(`Tolak tempahan dari ${booking.namaPemohon}?`)) return
    setLoading(true)
    try {
      const res = await fetch('/api/staff-ict/kelulusan', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: booking.id, status: 'Ditolak', catatan: reason })
      })
      const data = await res.json()
      if (data.success) { alert(data.message); fetchTempahan() }
      else alert(data.error || 'Gagal tolak tempahan')
    } catch (error) {
      alert('Network error')
    } finally {
      setLoading(false)
    }
  }

  const handleReturn = async (booking: Tempahan) => {
    const catan = prompt('Catatan pemulangan (opsional):') || ''
    if (!confirm(`Kembalikan barang dari ${booking.namaPemohon}?\nKuantiti ${booking.kuantiti} unit akan dikembalikan ke stok.`)) return
    setLoading(true)
    try {
      const res = await fetch('/api/staff-ict/kelulusan', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: booking.id, action: 'return', catatan: catan })
      })
      const data = await res.json()
      if (data.success) { alert(data.message); fetchTempahan() }
      else alert(data.error || 'Gagal kembalikan barang')
    } catch (error) {
      alert('Network error')
    } finally {
      setLoading(false)
    }
  }

  const confirmApprove = async () => {
    if (!selectedBooking) return
    setLoading(true)
    try {
      const res = await fetch('/api/staff-ict/kelulusan', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: selectedBooking.id, status: 'Diluluskan', catatan: catatan || 'Diluluskan' })
      })
      const data = await res.json()
      if (data.success) {
        alert(data.message)
        setShowModal(false)
        setSelectedBooking(null)
        setCatatan('')
        fetchTempahan()
      } else {
        alert(data.error || 'Gagal luluskan tempahan')
      }
    } catch (error) {
      alert('Network error')
    } finally {
      setLoading(false)
    }
  }

  const filteredTempahan = tempahan.filter(t => filterStatus === 'all' ? true : t.status === filterStatus)

  const statusCounts = {
    pending: tempahan.filter(t => t.status === 'Pending').length,
    diluluskan: tempahan.filter(t => t.status === 'Diluluskan').length,
    selesai: tempahan.filter(t => t.status === 'Selesai').length,
    ditolak: tempahan.filter(t => t.status === 'Ditolak').length
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
            <CardTitle>Kelulusan Tempahan</CardTitle>
            <p className="text-sm text-muted-foreground">Urus permohonan pinjaman barang</p>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-4 gap-2">
          <Card><CardContent className="pt-4"><div className="text-xl font-bold text-orange-600">{statusCounts.pending}</div><div className="text-xs text-muted-foreground">Pending</div></CardContent></Card>
          <Card><CardContent className="pt-4"><div className="text-xl font-bold text-green-600">{statusCounts.diluluskan}</div><div className="text-xs text-muted-foreground">Diluluskan</div></CardContent></Card>
          <Card><CardContent className="pt-4"><div className="text-xl font-bold text-blue-600">{statusCounts.selesai}</div><div className="text-xs text-muted-foreground">Selesai</div></CardContent></Card>
          <Card><CardContent className="pt-4"><div className="text-xl font-bold text-destructive">{statusCounts.ditolak}</div><div className="text-xs text-muted-foreground">Ditolak</div></CardContent></Card>
        </div>

        <Card>
          <CardContent className="pt-4">
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="border-input dark:bg-input/30 h-9 w-full rounded-md border bg-transparent px-3 text-sm">
              <option value="Pending">Pending</option>
              <option value="Diluluskan">Diluluskan (Belum Dikembalikan)</option>
              <option value="Selesai">Selesai (Sudah Dikembalikan)</option>
              <option value="Ditolak">Ditolak</option>
              <option value="all">Semua Status</option>
            </select>
          </CardContent>
        </Card>

        <div className="space-y-3">
          {loading ? (
            <Card><CardContent className="p-8 text-center text-muted-foreground">Loading...</CardContent></Card>
          ) : filteredTempahan.length === 0 ? (
            <Card><CardContent className="p-8 text-center text-muted-foreground">Tiada tempahan {filterStatus !== 'all' ? filterStatus.toLowerCase() : ''}</CardContent></Card>
          ) : (
            filteredTempahan.map((booking) => (
              <Card key={booking.id}>
                <CardContent className="pt-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-bold text-foreground">{booking.namaBarang}</h3>
                      <p className="text-sm text-muted-foreground">{booking.kategori} • {booking.lokasi}</p>
                    </div>
                    <Badge variant={statusVariant(booking.status)}>{booking.status}</Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-3 text-sm">
                    <div>
                      <span className="text-muted-foreground">Pemohon:</span>
                      <p className="font-medium">{booking.namaPemohon}</p>
                      <p className="text-xs text-muted-foreground">{booking.emailPemohon}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Fakulti:</span>
                      <p className="font-medium">{booking.fakulti}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Tarikh:</span>
                      <p className="font-medium text-xs">
                        {new Date(booking.tarikhMula).toLocaleDateString('ms-MY')} - {new Date(booking.tarikhTamat).toLocaleDateString('ms-MY')}
                      </p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Kuantiti:</span>
                      <p className="font-medium">{booking.kuantiti} unit</p>
                    </div>
                  </div>

                  <div className="mb-3">
                    <span className="text-sm text-muted-foreground">Tujuan:</span>
                    <p className="text-sm mt-1 bg-muted p-2 rounded">{booking.tujuan}</p>
                  </div>

                  {booking.status === 'Pending' && (
                    <div className="flex gap-2">
                      <Button className="flex-1" size="sm" onClick={() => handleApprove(booking)}>Lulus</Button>
                      <Button className="flex-1" size="sm" variant="destructive" onClick={() => handleReject(booking)}>Tolak</Button>
                    </div>
                  )}

                  {booking.status === 'Diluluskan' && (
                    <div>
                      <Button className="w-full" size="sm" variant="secondary" onClick={() => handleReturn(booking)}>Kembalikan Barang</Button>
                      <div className="text-xs text-muted-foreground mt-2">
                        Diluluskan pada: {new Date(booking.createdAt).toLocaleString('ms-MY')}
                      </div>
                    </div>
                  )}

                  {(booking.status === 'Ditolak' || booking.status === 'Selesai') && (
                    <div className="text-xs text-muted-foreground mt-2">
                      Diproses pada: {new Date(booking.createdAt).toLocaleString('ms-MY')}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>

        <Dialog open={showModal} onOpenChange={setShowModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Luluskan Tempahan</DialogTitle>
            </DialogHeader>
            {selectedBooking && (
              <>
                <div className="rounded-md bg-secondary p-3 text-sm space-y-1">
                  <p><strong>Barang:</strong> {selectedBooking.namaBarang}</p>
                  <p><strong>Pemohon:</strong> {selectedBooking.namaPemohon}</p>
                  <p><strong>Kuantiti:</strong> {selectedBooking.kuantiti} unit</p>
                </div>
                <div className="space-y-2">
                  <Label>Catatan (Opsional)</Label>
                  <Textarea value={catatan} onChange={(e) => setCatatan(e.target.value)} rows={3} placeholder="Tambah nota jika perlu..." />
                </div>
                <div className="rounded-md bg-yellow-50 border border-yellow-200 p-3 text-sm text-yellow-800">
                  Setelah diluluskan, kuantiti barang akan dikurangkan secara automatik.
                </div>
              </>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => { setShowModal(false); setSelectedBooking(null); setCatatan('') }}>Batal</Button>
              <Button onClick={confirmApprove} disabled={loading}>{loading ? 'Memproses...' : 'Luluskan'}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <BottomNav activeTab="kelulusan" />
      </div>
    </div>
  )
}
