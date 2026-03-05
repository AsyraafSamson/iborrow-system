'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import BottomNav from '@/components/BottomNav'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
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
  hargaPerolehan?: number
  tarikhPerolehan?: string
  catatan?: string
  createdAt: string
}

interface Stats {
  totalItems: number
  tersedia: number
  dipinjam: number
  rosak: number
}

const statusVariant = (status: string): "default" | "destructive" | "secondary" | "outline" => {
  if (status === 'Tersedia') return 'default'
  if (status === 'Rosak') return 'destructive'
  return 'secondary'
}

export default function StaffBarang() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [barang, setBarang] = useState<Barang[]>([])
  const [stats, setStats] = useState<Stats>({ totalItems: 0, tersedia: 0, dipinjam: 0, rosak: 0 })
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterKategori, setFilterKategori] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [selectedBarang, setSelectedBarang] = useState<Barang | null>(null)
  const [showDetailModal, setShowDetailModal] = useState(false)

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (!userData) { router.push('/login'); return }
    setUser(JSON.parse(userData))
  }, [router])

  useEffect(() => {
    if (user) fetchBarang()
  }, [user, searchQuery, filterKategori, filterStatus])

  const fetchBarang = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (searchQuery) params.append('search', searchQuery)
      if (filterKategori && filterKategori !== 'all') params.append('kategori', filterKategori)
      if (filterStatus && filterStatus !== 'all') params.append('status', filterStatus)
      const res = await fetch(`/api/staff-ict/barang?${params.toString()}`)
      const data = await res.json()
      if (data.success) {
        setBarang(data.barang || [])
        setStats(data.stats || { totalItems: 0, tersedia: 0, dipinjam: 0, rosak: 0 })
      }
    } catch (error) {
      console.error('Error fetching barang:', error)
    } finally {
      setLoading(false)
    }
  }

  const kategoriList = Array.from(new Set(barang.map(b => b.kategori)))

  const formatCurrency = (amount?: number) => {
    if (!amount) return 'N/A'
    return `RM ${amount.toFixed(2)}`
  }

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return 'N/A'
    return new Date(dateStr).toLocaleDateString('ms-MY', { year: 'numeric', month: 'long', day: 'numeric' })
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
            <CardTitle>Inventori Barang</CardTitle>
            <p className="text-sm text-muted-foreground">Senarai semua barang dalam sistem</p>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Card><CardContent className="pt-4"><div className="text-2xl font-bold text-foreground">{stats.totalItems}</div><div className="text-xs text-muted-foreground">Jumlah Barang</div></CardContent></Card>
          <Card><CardContent className="pt-4"><div className="text-2xl font-bold text-green-600">{stats.tersedia}</div><div className="text-xs text-muted-foreground">Tersedia</div></CardContent></Card>
          <Card><CardContent className="pt-4"><div className="text-2xl font-bold text-orange-600">{stats.dipinjam}</div><div className="text-xs text-muted-foreground">Dipinjam</div></CardContent></Card>
          <Card><CardContent className="pt-4"><div className="text-2xl font-bold text-destructive">{stats.rosak}</div><div className="text-xs text-muted-foreground">Rosak</div></CardContent></Card>
        </div>

        <Card>
          <CardContent className="pt-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="space-y-1">
                <Label>Cari Barang</Label>
                <Input placeholder="Cari nama atau kod barang..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
              </div>
              <div className="space-y-1">
                <Label>Kategori</Label>
                <select value={filterKategori} onChange={(e) => setFilterKategori(e.target.value)} className="border-input dark:bg-input/30 h-9 w-full rounded-md border bg-transparent px-3 text-sm">
                  <option value="all">Semua Kategori</option>
                  {kategoriList.map(k => <option key={k} value={k}>{k}</option>)}
                </select>
              </div>
              <div className="space-y-1">
                <Label>Status</Label>
                <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="border-input dark:bg-input/30 h-9 w-full rounded-md border bg-transparent px-3 text-sm">
                  <option value="all">Semua Status</option>
                  <option value="Tersedia">Tersedia</option>
                  <option value="Tidak Tersedia">Tidak Tersedia</option>
                  <option value="Rosak">Rosak</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="py-0 overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-muted-foreground">Loading...</div>
          ) : barang.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">Tiada barang dijumpai</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Kod</TableHead>
                  <TableHead>Nama Barang</TableHead>
                  <TableHead>Kategori</TableHead>
                  <TableHead>Kuantiti</TableHead>
                  <TableHead>Lokasi</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Tindakan</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {barang.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-mono text-sm">{item.kodBarang}</TableCell>
                    <TableCell className="font-medium">{item.namaBarang}</TableCell>
                    <TableCell>{item.kategori}</TableCell>
                    <TableCell>
                      <span className={item.kuantitiTersedia === 0 ? 'text-destructive font-medium' : ''}>
                        {item.kuantitiTersedia}
                      </span>
                      /{item.kuantitiTotal}
                    </TableCell>
                    <TableCell>{item.lokasi}</TableCell>
                    <TableCell>
                      <Badge variant={statusVariant(item.status)}>{item.status}</Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" className="text-primary h-7 text-xs" onClick={() => { setSelectedBarang(item); setShowDetailModal(true) }}>
                        Lihat
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </Card>

        <Dialog open={showDetailModal} onOpenChange={setShowDetailModal}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Butiran Barang</DialogTitle>
            </DialogHeader>
            {selectedBarang && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Kod Barang</p>
                    <p className="font-mono font-semibold">{selectedBarang.kodBarang}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <Badge variant={statusVariant(selectedBarang.status)}>{selectedBarang.status}</Badge>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Nama Barang</p>
                  <p className="font-semibold">{selectedBarang.namaBarang}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Kategori</p>
                    <p>{selectedBarang.kategori}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Lokasi</p>
                    <p>{selectedBarang.lokasi}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Kuantiti Tersedia</p>
                    <p className="text-2xl font-bold text-green-600">{selectedBarang.kuantitiTersedia}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Kuantiti Total</p>
                    <p className="text-2xl font-bold">{selectedBarang.kuantitiTotal}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Harga Perolehan</p>
                    <p className="font-semibold">{formatCurrency(selectedBarang.hargaPerolehan)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Tarikh Perolehan</p>
                    <p>{formatDate(selectedBarang.tarikhPerolehan)}</p>
                  </div>
                </div>
                {selectedBarang.catatan && (
                  <div>
                    <p className="text-sm text-muted-foreground">Catatan</p>
                    <p className="text-sm bg-muted p-3 rounded-md">{selectedBarang.catatan}</p>
                  </div>
                )}
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => { setShowDetailModal(false); setSelectedBarang(null) }}>Tutup</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <BottomNav activeTab="barang" />
      </div>
    </div>
  )
}
