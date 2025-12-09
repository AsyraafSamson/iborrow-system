'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import BottomNav from '@/components/BottomNav'

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

    // Validation: kuantitiTersedia cannot exceed kuantitiTotal
    if (formData.kuantitiTersedia > formData.kuantitiTotal) {
      alert('❌ Ralat: Kuantiti Tersedia tidak boleh melebihi Kuantiti Total!\n\nKuantiti Total: ' + formData.kuantitiTotal + '\nKuantiti Tersedia: ' + formData.kuantitiTersedia)
      return
    }

    // Validation: kuantitiTersedia cannot be negative
    if (formData.kuantitiTersedia < 0 || formData.kuantitiTotal < 1) {
      alert('❌ Ralat: Kuantiti mesti bernilai positif!')
      return
    }

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
        // If there are tempahan details, show modal
        if (data.tempahan && data.tempahan.length > 0) {
          setTempahanDetails(data.tempahan)
          setShowTempahanModal(true)
        } else {
          alert(data.error || 'Gagal padam')
        }
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

  // Derive active tempahan to align UI with server logic
  const activeStatuses = ['Pending','Diluluskan','Dipinjam']
  const activeTempahan = (tempahanDetails || []).filter(t => activeStatuses.includes(t.status))

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
                      <p className="text-xs text-gray-500 mt-1">Jumlah keseluruhan barang yang dimiliki</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Kuantiti Tersedia *</label>
                      <input
                        type="number"
                        value={formData.kuantitiTersedia}
                        onChange={(e) => setFormData({...formData, kuantitiTersedia: parseInt(e.target.value) || 1})}
                        className="w-full px-3 py-2 border rounded-lg"
                        min="0"
                        max={formData.kuantitiTotal}
                        required
                      />
                      <p className="text-xs text-gray-500 mt-1">Boleh dipinjam sekarang (max: {formData.kuantitiTotal})</p>
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

        {/* Tempahan Details Modal */}
        {showTempahanModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      Tidak Boleh Padam Barang
                    </h2>
                    <p className="text-sm text-gray-600 mt-1">
                      Barang ini mempunyai {activeTempahan.length} tempahan aktif
                    </p>
                  </div>
                  <button
                    onClick={() => setShowTempahanModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                   <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-yellow-700">
                        Barang ini tidak boleh dipadam kerana mempunyai tempahan aktif.
                        Sila selesaikan atau batalkan tempahan aktif terlebih dahulu.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pemohon</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Peranan</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kuantiti</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tarikh</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {activeTempahan.map((tempahan, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-4 py-4">
                            <div>
                              <div className="text-sm font-medium text-gray-900">{tempahan.userName}</div>
                              <div className="text-sm text-gray-500">{tempahan.userEmail}</div>
                            </div>
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-900">{tempahan.peranan}</td>
                          <td className="px-4 py-4">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              tempahan.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                              tempahan.status === 'Diluluskan' ? 'bg-green-100 text-green-800' :
                               tempahan.status === 'Selesai' ? 'bg-blue-100 text-blue-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {tempahan.status}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-900">{tempahan.kuantiti}</td>
                          <td className="px-4 py-4 text-sm text-gray-900">
                            <div>
                              <div>{new Date(tempahan.tarikhMula).toLocaleDateString('ms-MY')}</div>
                              <div className="text-xs text-gray-500">
                                hingga {new Date(tempahan.tarikhTamat).toLocaleDateString('ms-MY')}
                              </div>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="mt-6 flex justify-end">
                  <button
                    onClick={() => setShowTempahanModal(false)}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                  >
                    Tutup
                  </button>
                   </div>
              </div>
            </div>
          </div>
        )}

        {/* Bottom Nav */}
        <BottomNav activeTab="barang" />
      </div>
    </div>
  )
}
