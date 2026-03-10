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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Skeleton } from '@/components/ui/skeleton'

interface User {
  id: string
  email: string
  nama: string
  peranan: string
  fakulti?: string
  no_telefon?: string
  no_matrik?: string
  no_staf?: string
  status: string
  created_at: string
}

export default function AdminPengguna() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterRole, setFilterRole] = useState('all')
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  const [formData, setFormData] = useState({
    email: '', nama: '', role: 'pelajar', fakulti: '', no_telefon: '', noMatrik: '', noStaf: ''
  })

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (!userData) { router.push('/login'); return }
    setUser(JSON.parse(userData))
    fetchUsers()
  }, [router])

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/admin/pengguna')
      const data = await res.json()
      if (data.success) setUsers(data.data || [])
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/admin/pengguna', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      const data = await res.json()
      if (data.success) {
        alert(data.message + '\nPassword default: password123')
        setShowModal(false)
        resetForm()
        fetchUsers()
      } else {
        alert(data.error || 'Operasi gagal')
      }
    } catch (error) {
      alert('Network error')
    } finally {
      setLoading(false)
    }
  }

  const handleResetPassword = async (id: string, nama: string) => {
    if (!confirm(`Reset password untuk ${nama}?\nPassword akan ditukar kepada: password123`)) return
    try {
      const res = await fetch('/api/admin/pengguna', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, action: 'reset-password' })
      })
      const data = await res.json()
      alert(data.success ? data.message : (data.error || 'Gagal reset password'))
    } catch (error) {
      alert('Network error')
    }
  }

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'aktif' ? 'tidak aktif' : 'aktif'
    if (!confirm(`Tukar status kepada "${newStatus}"?`)) return
    try {
      const res = await fetch('/api/admin/pengguna', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus })
      })
      const data = await res.json()
      if (data.success) { alert(data.message); fetchUsers() }
      else alert(data.error || 'Gagal update status')
    } catch (error) {
      alert('Network error')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Adakah anda pasti untuk padam pengguna ini?')) return
    try {
      const res = await fetch('/api/admin/pengguna', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      })
      const data = await res.json()
      if (data.success) { alert(data.message); fetchUsers() }
      else alert(data.error || 'Gagal padam')
    } catch (error) {
      alert('Network error')
    }
  }

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) { alert('Sila pilih pengguna untuk dipadam'); return }
    if (!confirm(`Padam ${selectedIds.length} pengguna yang dipilih?`)) return
    try {
      const res = await fetch('/api/admin/pengguna', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: selectedIds })
      })
      const data = await res.json()
      if (data.success) { alert(data.message); setSelectedIds([]); fetchUsers() }
    } catch (error) {
      alert('Network error')
    }
  }

  const resetForm = () => {
    setFormData({ email: '', nama: '', role: 'pelajar', fakulti: '', no_telefon: '', noMatrik: '', noStaf: '' })
  }

  const toggleSelectAll = () => {
    setSelectedIds(selectedIds.length === filteredUsers.length ? [] : filteredUsers.map(u => u.id))
  }

  const toggleSelectId = (id: string) => {
    setSelectedIds(selectedIds.includes(id) ? selectedIds.filter(i => i !== id) : [...selectedIds, id])
  }

  const filteredUsers = users.filter(u => {
    const matchSearch = u.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchRole = filterRole === 'all' || u.peranan === filterRole
    return matchSearch && matchRole
  })

  const rolesList = ['admin', 'staff-ict', 'pelajar', 'pengajar', 'staff-pentadbiran']

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
            <CardTitle>Pengurusan Pengguna</CardTitle>
            <p className="text-sm text-muted-foreground">Urus akaun pengguna sistem</p>
          </CardHeader>
        </Card>

        <Card>
          <CardContent className="pt-4 space-y-3">
            <div className="flex gap-2">
              <Button onClick={() => setShowModal(true)} size="sm">+ Tambah Pengguna</Button>
              {selectedIds.length > 0 && (
                <Button onClick={handleBulkDelete} variant="destructive" size="sm">
                  Padam ({selectedIds.length})
                </Button>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Input placeholder="Cari nama atau email..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
              <select value={filterRole} onChange={(e) => setFilterRole(e.target.value)} className="border-input dark:bg-input/30 h-9 w-full rounded-md border bg-transparent px-3 text-sm">
                <option value="all">Semua Peranan</option>
                {rolesList.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
          </CardContent>
        </Card>

        {loading ? (
          <Card><CardContent className="p-8 text-center text-muted-foreground">Loading...</CardContent></Card>
        ) : filteredUsers.length === 0 ? (
          <Card><CardContent className="p-8 text-center text-muted-foreground">Tiada pengguna dijumpai</CardContent></Card>
        ) : (
          <div className="space-y-2">
            {filteredUsers.map((u) => (
              <Card key={u.id}>
                <CardContent className="pt-4 pb-3">
                  <div className="flex items-start gap-3">
                    <Checkbox
                      checked={selectedIds.includes(u.id)}
                      onCheckedChange={() => toggleSelectId(u.id)}
                      className="mt-0.5"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <p className="font-semibold text-sm truncate">{u.nama}</p>
                        <button
                          onClick={() => handleToggleStatus(u.id, u.status)}
                          className={`shrink-0 px-2 py-0.5 rounded-full text-xs font-medium ${u.status === 'aktif' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                        >
                          {u.status}
                        </button>
                      </div>
                      <p className="text-xs text-muted-foreground mb-1 truncate">{u.email}</p>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="secondary" className="text-xs">{u.peranan}</Badge>
                        <span className="text-xs text-muted-foreground">{u.fakulti || '-'}</span>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="h-7 text-xs flex-1 text-orange-600 hover:text-orange-700" onClick={() => handleResetPassword(u.id, u.nama)}>Reset Password</Button>
                        <Button variant="outline" size="sm" className="h-7 text-xs flex-1 text-destructive hover:text-destructive" onClick={() => handleDelete(u.id)}>Padam</Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <Dialog open={showModal} onOpenChange={setShowModal}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Tambah Pengguna Baru</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2 space-y-2">
                  <Label>Email *</Label>
                  <Input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} placeholder="contoh@ilkkm.edu.my" required />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <Label>Nama Penuh *</Label>
                  <Input value={formData.nama} onChange={(e) => setFormData({...formData, nama: e.target.value})} required />
                </div>
                <div className="space-y-2">
                  <Label>Peranan *</Label>
                  <select value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})} className="border-input dark:bg-input/30 h-9 w-full rounded-md border bg-transparent px-3 text-sm" required>
                    {rolesList.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Fakulti/Jabatan</Label>
                  <Input value={formData.fakulti} onChange={(e) => setFormData({...formData, fakulti: e.target.value})} placeholder="cth: Kejururawatan" />
                </div>
                <div className="space-y-2">
                  <Label>No. Telefon</Label>
                  <Input value={formData.no_telefon} onChange={(e) => setFormData({...formData, no_telefon: e.target.value})} placeholder="0123456789" />
                </div>
                {formData.role === 'pelajar' && (
                  <div className="space-y-2">
                    <Label>No. Matrik</Label>
                    <Input value={formData.noMatrik} onChange={(e) => setFormData({...formData, noMatrik: e.target.value})} placeholder="MT202301234" />
                  </div>
                )}
                {(formData.role === 'staff-ict' || formData.role === 'staff-pentadbiran' || formData.role === 'pengajar') && (
                  <div className="space-y-2">
                    <Label>No. Staf</Label>
                    <Input value={formData.noStaf} onChange={(e) => setFormData({...formData, noStaf: e.target.value})} placeholder="STF2023001" />
                  </div>
                )}
              </div>
              <div className="rounded-md bg-yellow-50 border border-yellow-200 p-3 text-sm text-yellow-800">
                Password default: <strong>password123</strong>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setShowModal(false)}>Batal</Button>
                <Button type="submit" disabled={loading}>{loading ? 'Memproses...' : 'Tambah Pengguna'}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        <BottomNav activeTab="pengguna" />
      </div>
    </div>
  )
}
