'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

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

  // Form state
  const [formData, setFormData] = useState({
    namaBarang: '',
    kategori: '',
    kodBarang: '',
    kuantitiTotal: 1,
    kuantitiTersedia: 1,
    lokasi: '',
    status: 'Tersedia',
    hargaPerolehan: 0,
    tarikhPerolehan: new Date().toISOString().split('T')[0],
    catatan: ''
  })

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (!userData) {
      router.push('/login')
      return
    }
    setUser(JSON.parse(userData))
    fetchBarang()
  }, [router])

  const fetchBarang = async () => {
    try {
      const res = await fetch('/api/admin/barang')
      const data = await res.json()
      if (data.success) {
        setBarang(data.barang || [])
      }
    } catch (error) {
      console.error('Error fetching barang:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const url = editMode ? '/api/admin/barang' : '/api/admin/barang'
      const method = editMode ? 'PUT' : 'POST'
      const body = editMode ? { ...formData, id: selectedBarang?.id } : formData

      const res = await fetch(url, {
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
      console.error('Error:', error)
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
        alert(data.error || 'Gagal padam')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Network error')
    }
  }

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) {
      alert('Sila pilih barang untuk dipadam')
      return
    }
    if (!confirm(`Padam ${selectedIds.length} barang yang dipilih?`)) return

    try {
      const res = await fetch('/api/admin/barang', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: selectedIds })
      })

      const data = await res.json()
      if (data.success) {
        alert(data.message)
        setSelectedIds([])
        fetchBarang()
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Network error')
    }
  }

  const openAddModal = () => {
    setEditMode(false)
    resetForm()
    setShowModal(true)
  }

  const openEditModal = (item: Barang) => {
    setEditMode(true)
    setSelectedBarang(item)
    setFormData({
      namaBarang: item.namaBarang,
      kategori: item.kategori,
      kodBarang: item.kodBarang,
      kuantitiTotal: item.kuantitiTotal,
      kuantitiTersedia: item.kuantitiTersedia,
      lokasi: item.lokasi,
      status: item.status,
      hargaPerolehan: item.hargaPerolehan || 0,
      tarikhPerolehan: item.tarikhPerolehan || new Date().toISOString().split('T')[0],
      catatan: item.catatan || ''
    })
    setShowModal(true)
  }

  const resetForm = () => {
    setFormData({
      namaBarang: '',
      kategori: '',
      kodBarang: '',
      kuantitiTotal: 1,
      kuantitiTersedia: 1,
      lokasi: '',
      status: 'Tersedia',
      hargaPerolehan: 0,
      tarikhPerolehan: new Date().toISOString().split('T')[0],
      catatan: ''
    })
    setSelectedBarang(null)
  }

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredBarang.length) {
      setSelectedIds([])
    } else {
      setSelectedIds(filteredBarang.map(b => b.id))
    }
  }

  const toggleSelectId = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(i => i !== id))
    } else {
      setSelectedIds([...selectedIds, id])
    }
  }

  // Filter barang
  const filteredBarang = barang.filter(item => {
    const matchSearch = item.namaBarang.toLowerCase().includes(searchQuery.toLowerCase()) ||
                       item.kodBarang.toLowerCase().includes(searchQuery.toLowerCase())
    const matchKategori = filterKategori === 'all' || item.kategori === filterKategori
    return matchSearch && matchKategori
  })

  const kategoriList = Array.from(new Set(barang.map(b => b.kategori)))

  if (!user) return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>

  return (
    <div className="min-h-screen bg-gray-50 p-3 pb-24">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
          <h1 className="text-2xl font-bold text-gray-900">Pengurusan Barang</h1>
          <p className="text-sm text-gray-600">Urus inventori barang ICT</p>
        </div>

        {/* Actions Bar */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
          <div className="flex gap-2 mb-3">
            <button
              onClick={openAddModal}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700"
            >
              + Tambah Barang
            </button>
            {selectedIds.length > 0 && (
              <button
                onClick={handleBulkDelete}
                className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-700"
              >
                Padam ({selectedIds.length})
              </button>
            )}
          </div>

          {/* Search & Filter */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input
              type="text"
              placeholder="Cari nama atau kod barang..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-3 py-2 border rounded-lg text-sm"
            />
            <select
              value={filterKategori}
              onChange={(e) => setFilterKategori(e.target.value)}
              className="px-3 py-2 border rounded-lg text-sm"
            >
              <option value="all">Semua Kategori</option>
              {kategoriList.map(k => (
                <option key={k} value={k}>{k}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-gray-600">Loading...</div>
          ) : filteredBarang.length === 0 ? (
            <div className="p-8 text-center text-gray-600">Tiada barang dijumpai</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="p-3 text-left">
                      <input
                        type="checkbox"
                        checked={selectedIds.length === filteredBarang.length && filteredBarang.length > 0}
                        onChange={toggleSelectAll}
                      />
                    </th>
                    <th className="p-3 text-left text-sm font-semibold">Kod</th>
                    <th className="p-3 text-left text-sm font-semibold">Nama Barang</th>
                    <th className="p-3 text-left text-sm font-semibold">Kategori</th>
                    <th className="p-3 text-left text-sm font-semibold">Kuantiti</th>
                    <th className="p-3 text-left text-sm font-semibold">Lokasi</th>
                    <th className="p-3 text-left text-sm font-semibold">Status</th>
                    <th className="p-3 text-left text-sm font-semibold">Tindakan</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBarang.map((item) => (
                    <tr key={item.id} className="border-b hover:bg-gray-50">
                      <td className="p-3">
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(item.id)}
                          onChange={() => toggleSelectId(item.id)}
                        />
                      </td>
                      <td className="p-3 text-sm">{item.kodBarang}</td>
                      <td className="p-3 text-sm font-medium">{item.namaBarang}</td>
                      <td className="p-3 text-sm">{item.kategori}</td>
                      <td className="p-3 text-sm">{item.kuantitiTersedia}/{item.kuantitiTotal}</td>
                      <td className="p-3 text-sm">{item.lokasi}</td>
                      <td className="p-3">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          item.status === 'Tersedia' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="p-3">
                        <div className="flex gap-2">
                          <button
                            onClick={() => openEditModal(item)}
                            className="text-blue-600 hover:text-blue-800 text-sm"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="text-red-600 hover:text-red-800 text-sm"
                          >
                            Padam
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <h2 className="text-xl font-bold mb-4">
                  {editMode ? 'Edit Barang' : 'Tambah Barang Baru'}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Nama Barang *</label>
                      <input
                        type="text"
                        value={formData.namaBarang}
                        onChange={(e) => setFormData({...formData, namaBarang: e.target.value})}
                        className="w-full px-3 py-2 border rounded-lg"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Kategori *</label>
                      <input
                        type="text"
                        value={formData.kategori}
                        onChange={(e) => setFormData({...formData, kategori: e.target.value})}
                        className="w-full px-3 py-2 border rounded-lg"
                        placeholder="cth: Laptop, Projektor"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Kod Barang *</label>
                      <input
                        type="text"
                        value={formData.kodBarang}
                        onChange={(e) => setFormData({...formData, kodBarang: e.target.value})}
                        className="w-full px-3 py-2 border rounded-lg"
                        placeholder="cth: LT-001"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Lokasi *</label>
                      <input
                        type="text"
                        value={formData.lokasi}
                        onChange={(e) => setFormData({...formData, lokasi: e.target.value})}
                        className="w-full px-3 py-2 border rounded-lg"
                        placeholder="cth: Stor ICT"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Kuantiti Total *</label>
                      <input
                        type="number"
                        value={formData.kuantitiTotal}
                        onChange={(e) => setFormData({...formData, kuantitiTotal: parseInt(e.target.value) || 1})}
                        className="w-full px-3 py-2 border rounded-lg"
                        min="1"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Kuantiti Tersedia *</label>
                      <input
                        type="number"
                        value={formData.kuantitiTersedia}
                        onChange={(e) => setFormData({...formData, kuantitiTersedia: parseInt(e.target.value) || 1})}
                        className="w-full px-3 py-2 border rounded-lg"
                        min="0"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Status</label>
                      <select
                        value={formData.status}
                        onChange={(e) => setFormData({...formData, status: e.target.value})}
                        className="w-full px-3 py-2 border rounded-lg"
                      >
                        <option value="Tersedia">Tersedia</option>
                        <option value="Tidak Tersedia">Tidak Tersedia</option>
                        <option value="Rosak">Rosak</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Harga Perolehan (RM)</label>
                      <input
                        type="number"
                        value={formData.hargaPerolehan}
                        onChange={(e) => setFormData({...formData, hargaPerolehan: parseFloat(e.target.value) || 0})}
                        className="w-full px-3 py-2 border rounded-lg"
                        min="0"
                        step="0.01"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Tarikh Perolehan</label>
                      <input
                        type="date"
                        value={formData.tarikhPerolehan}
                        onChange={(e) => setFormData({...formData, tarikhPerolehan: e.target.value})}
                        className="w-full px-3 py-2 border rounded-lg"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Catatan</label>
                    <textarea
                      value={formData.catatan}
                      onChange={(e) => setFormData({...formData, catatan: e.target.value})}
                      className="w-full px-3 py-2 border rounded-lg"
                      rows={3}
                      placeholder="Maklumat tambahan..."
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                    >
                      {loading ? 'Memproses...' : (editMode ? 'Kemaskini' : 'Tambah')}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400"
                    >
                      Batal
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Bottom Nav */}
        <div className="fixed bottom-4 left-4 right-4 bg-white rounded-2xl shadow-lg p-3 flex justify-around">
          <Link href="/admin/dashboard" className="flex flex-col items-center text-gray-600"><div className="text-xl">📊</div><div className="text-xs">Dashboard</div></Link>
          <Link href="/admin/pengguna" className="flex flex-col items-center text-gray-600"><div className="text-xl">👥</div><div className="text-xs">Pengguna</div></Link>
          <Link href="/admin/barang" className="flex flex-col items-center text-blue-600"><div className="text-xl">📦</div><div className="text-xs">Barang</div></Link>
          <Link href="/admin/laporan" className="flex flex-col items-center text-gray-600"><div className="text-xl">📈</div><div className="text-xs">Laporan</div></Link>
          <Link href="/admin/tetapan/sistem" className="flex flex-col items-center text-gray-600"><div className="text-xl">⚙️</div><div className="text-xs">Tetapan</div></Link>
          <Link href="/admin/profile" className="flex flex-col items-center text-gray-600"><div className="text-xl">👤</div><div className="text-xs">Profil</div></Link>
        </div>
      </div>
    </div>
  )
}
