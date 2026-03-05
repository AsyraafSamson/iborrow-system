'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import BottomNav from '@/components/BottomNav'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
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

export default function AdminBarang() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [barang, setBarang] = useState<Barang[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [selectedBarang, setSelectedBarang] = useState<Barang | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterKategori, setFilterKategori] = useState('all')
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [showTempahanModal, setShowTempahanModal] = useState(false)
  const [tempahanDetails, setTempahanDetails] = useState<any[]>([])

  const [formData, setFormData] = useState({
    namaBarang: '', kategori: '', kodBarang: '', kuantitiTotal: 1,
    kuantitiTersedia: 1, lokasi: '', status: 'Tersedia', hargaPerolehan: 0,
    tarikhPerolehan: new Date().toISOString().split('T')[0], catatan: ''
  })

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (!userData) { router.push('/login'); return }
    setUser(JSON.parse(userData))
    fetchBarang()
  }, [router])

  const fetchBarang = async () => {
    try {
      const res = await fetch('/api/admin/barang')
      const data = await res.json()
      if (data.success) setBarang(data.barang || [])
    } catch (error) {
      console.error('Error fetching barang:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.kuantitiTersedia > formData.kuantitiTotal) {
      alert('Kuantiti Tersedia tidak boleh melebihi Kuantiti Total!')
      return
    }
    if (formData.kuantitiTersedia < 0 || formData.kuantitiTotal < 1) {
      alert('Kuantiti mesti bernilai positif!')
      return
    }
    setLoading(true)
    try {
      const method = editMode ? 'PUT' : 'POST'
      const body = editMode ? { ...formData, id: selectedBarang?.id } : formData
      const res = await fetch('/api/admin/barang', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })
      const data = await res.json()
      if (data.success) {
        alert(data.message)
        setShowModal(false)
        resetForm()
        fetchBarang()
      } else {
        alert(data.error || 'Operasi gagal')
      }
    } catch (error) {
      alert('Network error')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Adakah anda pasti untuk padam barang ini?')) return
    try {
      const res = await fetch('/api/admin/barang', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      })
      const data = await res.json()
      if (data.success) {
        alert(data.message)
        fetchBarang()
      } else {
        if (data.tempahan && data.tempahan.length > 0) {
          setTempahanDetails(data.tempahan)
          setShowTempahanModal(true)
        } else {
          alert(data.error || 'Gagal padam')
        }
      }
    } catch (error) {
      alert('Network error')
    }
  }

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) { alert('Sila pilih barang untuk dipadam'); return }
    if (!confirm(`Padam ${selectedIds.length} barang yang dipilih?`)) return
    try {
      const res = await fetch('/api/admin/barang', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: selectedIds })
      })
      const data = await res.json()
      if (data.success) { alert(data.message); setSelectedIds([]); fetchBarang() }
    } catch (error) {
      alert('Network error')
    }
  }

  const openAddModal = () => { setEditMode(false); resetForm(); setShowModal(true) }

  const openEditModal = (item: Barang) => {
    setEditMode(true)
    setSelectedBarang(item)
    setFormData({
      namaBarang: item.namaBarang, kategori: item.kategori, kodBarang: item.kodBarang,
      kuantitiTotal: item.kuantitiTotal, kuantitiTersedia: item.kuantitiTersedia,
      lokasi: item.lokasi, status: item.status, hargaPerolehan: item.hargaPerolehan || 0,
      tarikhPerolehan: item.tarikhPerolehan || new Date().toISOString().split('T')[0],
      catatan: item.catatan || ''
    })
    setShowModal(true)
  }

  const resetForm = () => {
    setFormData({
      namaBarang: '', kategori: '', kodBarang: '', kuantitiTotal: 1, kuantitiTersedia: 1,
      lokasi: '', status: 'Tersedia', hargaPerolehan: 0,
      tarikhPerolehan: new Date().toISOString().split('T')[0], catatan: ''
    })
    setSelectedBarang(null)
  }

  const toggleSelectAll = () => {
    setSelectedIds(selectedIds.length === filteredBarang.length ? [] : filteredBarang.map(b => b.id))
  }

  const toggleSelectId = (id: string) => {
    setSelectedIds(selectedIds.includes(id) ? selectedIds.filter(i => i !== id) : [...selectedIds, id])
  }

  const filteredBarang = barang.filter(item => {
    const matchSearch = item.namaBarang.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.kodBarang.toLowerCase().includes(searchQuery.toLowerCase())
    const matchKategori = filterKategori === 'all' || item.kategori === filterKategori
    return matchSearch && matchKategori
  })

  const kategoriList = Array.from(new Set(barang.map(b => b.kategori)))
  const activeStatuses = ['Pending', 'Diluluskan', 'Dipinjam']
  const activeTempahan = (tempahanDetails || []).filter(t => activeStatuses.includes(t.status))

  const statusVariant = (status: string): "default" | "destructive" | "secondary" | "outline" => {
    if (status === 'Tersedia') return 'default'
    return 'destructive'
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
            <CardTitle>Pengurusan Barang</CardTitle>
            <p className="text-sm text-muted-foreground">Urus inventori barang ICT</p>
          </CardHeader>
        </Card>

        <Card>
          <CardContent className="pt-4 space-y-3">
            <div className="flex gap-2">
              <Button onClick={openAddModal} size="sm">+ Tambah Barang</Button>
              {selectedIds.length > 0 && (
                <Button onClick={handleBulkDelete} variant="destructive" size="sm">
                  Padam ({selectedIds.length})
                </Button>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Input
                placeholder="Cari nama atau kod barang..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <select
                value={filterKategori}
                onChange={(e) => setFilterKategori(e.target.value)}
                className="border-input dark:bg-input/30 h-9 w-full rounded-md border bg-transparent px-3 text-sm"
              >
                <option value="all">Semua Kategori</option>
                {kategoriList.map(k => <option key={k} value={k}>{k}</option>)}
              </select>
            </div>
          </CardContent>
        </Card>

        <Card className="py-0 overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-muted-foreground">Loading...</div>
          ) : filteredBarang.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">Tiada barang dijumpai</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-10">
                    <Checkbox
                      checked={selectedIds.length === filteredBarang.length && filteredBarang.length > 0}
                      onCheckedChange={toggleSelectAll}
                    />
                  </TableHead>
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
                {filteredBarang.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedIds.includes(item.id)}
                        onCheckedChange={() => toggleSelectId(item.id)}
                      />
                    </TableCell>
                    <TableCell className="font-mono text-xs">{item.kodBarang}</TableCell>
                    <TableCell className="font-medium">{item.namaBarang}</TableCell>
                    <TableCell>{item.kategori}</TableCell>
                    <TableCell>{item.kuantitiTersedia}/{item.kuantitiTotal}</TableCell>
                    <TableCell>{item.lokasi}</TableCell>
                    <TableCell>
                      <Badge variant={statusVariant(item.status)}>{item.status}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" onClick={() => openEditModal(item)}>Edit</Button>
                        <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => handleDelete(item.id)}>Padam</Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </Card>

        {/* Add/Edit Modal */}
        <Dialog open={showModal} onOpenChange={setShowModal}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editMode ? 'Edit Barang' : 'Tambah Barang Baru'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Nama Barang *</Label>
                  <Input value={formData.namaBarang} onChange={(e) => setFormData({...formData, namaBarang: e.target.value})} required />
                </div>
                <div className="space-y-2">
                  <Label>Kategori *</Label>
                  <Input value={formData.kategori} onChange={(e) => setFormData({...formData, kategori: e.target.value})} placeholder="cth: Laptop, Projektor" required />
                </div>
                <div className="space-y-2">
                  <Label>Kod Barang *</Label>
                  <Input value={formData.kodBarang} onChange={(e) => setFormData({...formData, kodBarang: e.target.value})} placeholder="cth: LT-001" required />
                </div>
                <div className="space-y-2">
                  <Label>Lokasi *</Label>
                  <Input value={formData.lokasi} onChange={(e) => setFormData({...formData, lokasi: e.target.value})} placeholder="cth: Stor ICT" required />
                </div>
                <div className="space-y-2">
                  <Label>Kuantiti Total *</Label>
                  <Input type="number" value={formData.kuantitiTotal} onChange={(e) => setFormData({...formData, kuantitiTotal: parseInt(e.target.value) || 1})} min="1" required />
                  <p className="text-xs text-muted-foreground">Jumlah keseluruhan barang</p>
                </div>
                <div className="space-y-2">
                  <Label>Kuantiti Tersedia *</Label>
                  <Input type="number" value={formData.kuantitiTersedia} onChange={(e) => setFormData({...formData, kuantitiTersedia: parseInt(e.target.value) || 1})} min="0" max={formData.kuantitiTotal} required />
                  <p className="text-xs text-muted-foreground">Boleh dipinjam sekarang (max: {formData.kuantitiTotal})</p>
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <select value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})} className="border-input dark:bg-input/30 h-9 w-full rounded-md border bg-transparent px-3 text-sm">
                    <option value="Tersedia">Tersedia</option>
                    <option value="Tidak Tersedia">Tidak Tersedia</option>
                    <option value="Rosak">Rosak</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Harga Perolehan (RM)</Label>
                  <Input type="number" value={formData.hargaPerolehan} onChange={(e) => setFormData({...formData, hargaPerolehan: parseFloat(e.target.value) || 0})} min="0" step="0.01" />
                </div>
                <div className="space-y-2">
                  <Label>Tarikh Perolehan</Label>
                  <Input type="date" value={formData.tarikhPerolehan} onChange={(e) => setFormData({...formData, tarikhPerolehan: e.target.value})} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Catatan</Label>
                <Textarea value={formData.catatan} onChange={(e) => setFormData({...formData, catatan: e.target.value})} rows={3} placeholder="Maklumat tambahan..." />
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setShowModal(false)}>Batal</Button>
                <Button type="submit" disabled={loading}>
                  {loading ? 'Memproses...' : (editMode ? 'Kemaskini' : 'Tambah')}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Tempahan Conflict Modal */}
        <Dialog open={showTempahanModal} onOpenChange={setShowTempahanModal}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Tidak Boleh Padam Barang</DialogTitle>
              <p className="text-sm text-muted-foreground">
                Barang ini mempunyai {activeTempahan.length} tempahan aktif
              </p>
            </DialogHeader>
            <div className="rounded-md bg-yellow-50 border border-yellow-200 p-4 text-sm text-yellow-800">
              Barang ini tidak boleh dipadam kerana mempunyai tempahan aktif.
              Sila selesaikan atau batalkan tempahan aktif terlebih dahulu.
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Pemohon</TableHead>
                  <TableHead>Peranan</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Kuantiti</TableHead>
                  <TableHead>Tarikh</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {activeTempahan.map((tempahan, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <div className="font-medium">{tempahan.userName}</div>
                      <div className="text-xs text-muted-foreground">{tempahan.userEmail}</div>
                    </TableCell>
                    <TableCell>{tempahan.peranan}</TableCell>
                    <TableCell>
                      <Badge variant={tempahan.status === 'Pending' ? 'secondary' : tempahan.status === 'Diluluskan' ? 'default' : 'outline'}>
                        {tempahan.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{tempahan.kuantiti}</TableCell>
                    <TableCell className="text-xs">
                      {new Date(tempahan.tarikhMula).toLocaleDateString('ms-MY')} -
                      {new Date(tempahan.tarikhTamat).toLocaleDateString('ms-MY')}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <DialogFooter>
              <Button onClick={() => setShowTempahanModal(false)}>Tutup</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <BottomNav activeTab="barang" />
      </div>
    </div>
  )
}
