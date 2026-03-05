'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import BottomNav from '@/components/BottomNav'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Skeleton } from '@/components/ui/skeleton'

interface Barang {
  id: string
  namaBarang: string
  kategori: string
  kodBarang: string
  kuantitiTersedia: number
  kuantitiTotal: number
  lokasi: string
  status: string
  catatan?: string
}

export default function UserBarang() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [barang, setBarang] = useState<Barang[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterKategori, setFilterKategori] = useState('all')
  const [selectedBarang, setSelectedBarang] = useState<Barang | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [bookingData, setBookingData] = useState({ kuantiti: 1, tarikhMula: '', tarikhTamat: '', tujuan: '' })

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (!userData) { router.push('/login'); return }
    setUser(JSON.parse(userData))
    fetchBarang()
  }, [router])

  const fetchBarang = async () => {
    try {
      const res = await fetch('/api/user/barang')
      const data = await res.json()
      if (data.success) setBarang(data.barang || [])
    } catch (error) {
      console.error('Error fetching barang:', error)
    } finally {
      setLoading(false)
    }
  }

  const openBookingModal = (item: Barang) => {
    setSelectedBarang(item)
    setBookingData({ kuantiti: 1, tarikhMula: '', tarikhTamat: '', tujuan: '' })
    setShowModal(true)
  }

  const handleSubmitBooking = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedBarang) return
    if (bookingData.kuantiti > selectedBarang.kuantitiTersedia) {
      alert(`Kuantiti melebihi jumlah tersedia (${selectedBarang.kuantitiTersedia})`)
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/user/tempahan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          barangId: selectedBarang.id,
          kuantiti: bookingData.kuantiti,
          tarikhMula: bookingData.tarikhMula,
          tarikhTamat: bookingData.tarikhTamat,
          tujuan: bookingData.tujuan,
          userId: user.id
        })
      })
      const data = await res.json()
      if (data.success) {
        alert(data.message + '\n\nTempahan anda sedang menunggu kelulusan Staff ICT.')
        setShowModal(false)
        setSelectedBarang(null)
        router.push('/user/tempahan')
      } else {
        alert(data.error || 'Gagal buat tempahan')
      }
    } catch (error) {
      alert('Network error')
    } finally {
      setLoading(false)
    }
  }

  const filteredBarang = barang.filter(item => {
    const matchSearch = item.namaBarang.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.kodBarang.toLowerCase().includes(searchQuery.toLowerCase())
    const matchKategori = filterKategori === 'all' || item.kategori === filterKategori
    return matchSearch && matchKategori && item.status === 'Tersedia'
  })

  const kategoriList = Array.from(new Set(barang.map(b => b.kategori)))

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
            <CardTitle>Senarai Barang</CardTitle>
            <p className="text-sm text-muted-foreground">Cari dan tempah barang yang diperlukan</p>
          </CardHeader>
        </Card>

        <Card>
          <CardContent className="pt-4 space-y-3">
            <Input placeholder="Cari nama atau kod barang..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            <select value={filterKategori} onChange={(e) => setFilterKategori(e.target.value)} className="border-input dark:bg-input/30 h-9 w-full rounded-md border bg-transparent px-3 text-sm">
              <option value="all">Semua Kategori</option>
              {kategoriList.map(k => <option key={k} value={k}>{k}</option>)}
            </select>
          </CardContent>
        </Card>

        {loading ? (
          <Card><CardContent className="p-8 text-center text-muted-foreground">Loading...</CardContent></Card>
        ) : filteredBarang.length === 0 ? (
          <Card><CardContent className="p-8 text-center text-muted-foreground">Tiada barang dijumpai</CardContent></Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {filteredBarang.map((item) => (
              <Card key={item.id}>
                <CardContent className="pt-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-bold text-foreground">{item.namaBarang}</h3>
                      <p className="text-sm text-muted-foreground">{item.kategori}</p>
                    </div>
                    <Badge variant="default">{item.status}</Badge>
                  </div>

                  <div className="space-y-1 mb-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Kod:</span>
                      <span className="font-medium">{item.kodBarang}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Lokasi:</span>
                      <span className="font-medium">{item.lokasi}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tersedia:</span>
                      <span className="font-medium">{item.kuantitiTersedia}/{item.kuantitiTotal} unit</span>
                    </div>
                  </div>

                  {item.catatan && (
                    <p className="text-xs text-muted-foreground mb-3">{item.catatan}</p>
                  )}

                  <Button
                    className="w-full"
                    size="sm"
                    onClick={() => openBookingModal(item)}
                    disabled={item.kuantitiTersedia === 0}
                  >
                    {item.kuantitiTersedia > 0 ? 'Buat Tempahan' : 'Tiada Stok'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <Dialog open={showModal} onOpenChange={setShowModal}>
          <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Buat Tempahan</DialogTitle>
            </DialogHeader>
            {selectedBarang && (
              <form onSubmit={handleSubmitBooking} className="space-y-4">
                <div className="rounded-md bg-secondary p-3 text-sm space-y-1">
                  <p className="font-medium">{selectedBarang.namaBarang}</p>
                  <p className="text-muted-foreground">{selectedBarang.kategori} • {selectedBarang.kodBarang}</p>
                  <p className="text-muted-foreground">Tersedia: {selectedBarang.kuantitiTersedia} unit</p>
                </div>

                <div className="space-y-2">
                  <Label>Kuantiti *</Label>
                  <Input
                    type="number"
                    value={bookingData.kuantiti}
                    onChange={(e) => setBookingData({...bookingData, kuantiti: parseInt(e.target.value) || 1})}
                    min="1"
                    max={selectedBarang.kuantitiTersedia}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Tarikh Mula *</Label>
                  <Input
                    type="date"
                    value={bookingData.tarikhMula}
                    onChange={(e) => setBookingData({...bookingData, tarikhMula: e.target.value})}
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Tarikh Tamat *</Label>
                  <Input
                    type="date"
                    value={bookingData.tarikhTamat}
                    onChange={(e) => setBookingData({...bookingData, tarikhTamat: e.target.value})}
                    min={bookingData.tarikhMula || new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Tujuan Penggunaan *</Label>
                  <Textarea
                    value={bookingData.tujuan}
                    onChange={(e) => setBookingData({...bookingData, tujuan: e.target.value})}
                    rows={4}
                    placeholder="Nyatakan tujuan penggunaan barang..."
                    required
                  />
                </div>

                <div className="rounded-md bg-yellow-50 border border-yellow-200 p-3 text-sm text-yellow-800">
                  Tempahan anda akan dihantar kepada Staff ICT untuk kelulusan
                </div>

                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => { setShowModal(false); setSelectedBarang(null) }}>Batal</Button>
                  <Button type="submit" disabled={loading}>{loading ? 'Memproses...' : 'Hantar Tempahan'}</Button>
                </DialogFooter>
              </form>
            )}
          </DialogContent>
        </Dialog>

        <BottomNav activeTab="barang" />
      </div>
    </div>
  )
}
