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

interface Stats {
  totalItems: number
  tersedia: number
  dipinjam: number
  rosak: number
}

export default function StaffBarang() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [barang, setBarang] = useState<Barang[]>([])
  const [stats, setStats] = useState<Stats>({
    totalItems: 0,
    tersedia: 0,
    dipinjam: 0,
    rosak: 0
  })
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterKategori, setFilterKategori] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [selectedBarang, setSelectedBarang] = useState<Barang | null>(null)
  const [showDetailModal, setShowDetailModal] = useState(false)

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (!userData) {
      router.push('/login')
      return
    }
    setUser(JSON.parse(userData))
  }, [router])

  useEffect(() => {
    if (user) {
      fetchBarang()
    }
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
        setStats(data.stats || {
          totalItems: 0,
          tersedia: 0,
          dipinjam: 0,
          rosak: 0
        })
      }
    } catch (error) {
      console.error('Error fetching barang:', error)
    } finally {
      setLoading(false)
    }
  }

  const openDetailModal = (item: Barang) => {
    setSelectedBarang(item)
    setShowDetailModal(true)
  }

  const closeDetailModal = () => {
    setSelectedBarang(null)
    setShowDetailModal(false)
  }

  const kategoriList = Array.from(new Set(barang.map(b => b.kategori)))

  const formatCurrency = (amount?: number) => {
    if (!amount) return 'N/A'
    return `RM ${amount.toFixed(2)}`
  }

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return 'N/A'
    const date = new Date(dateStr)
    return date.toLocaleDateString('ms-MY', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (!user) return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>

  return (
    <div className="min-h-screen bg-gray-50 p-3 pb-24">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
          <h1 className="text-2xl font-bold text-gray-900">Inventori Barang</h1>
          <p className="text-sm text-gray-600">Senarai semua barang dalam sistem</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          <div className="bg-white rounded-xl shadow-sm p-4">
            <div className="text-2xl font-bold text-gray-900">{stats.totalItems}</div>
            <div className="text-xs text-gray-600">Jumlah Barang</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4">
            <div className="text-2xl font-bold text-green-600">{stats.tersedia}</div>
            <div className="text-xs text-gray-600">Tersedia</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4">
            <div className="text-2xl font-bold text-orange-600">{stats.dipinjam}</div>
            <div className="text-xs text-gray-600">Dipinjam</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4">
            <div className="text-2xl font-bold text-red-600">{stats.rosak}</div>
            <div className="text-xs text-gray-600">Rosak</div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1">Cari Barang</label>
              <input
                type="text"
                placeholder="Cari nama atau kod barang..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Kategori</label>
              <select
                value={filterKategori}
                onChange={(e) => setFilterKategori(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg text-sm"
              >
                <option value="all">Semua Kategori</option>
                {kategoriList.map(k => (
                  <option key={k} value={k}>{k}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Status</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg text-sm"
              >
                <option value="all">Semua Status</option>
                <option value="Tersedia">Tersedia</option>
                <option value="Tidak Tersedia">Tidak Tersedia</option>
                <option value="Rosak">Rosak</option>
              </select>
            </div>
          </div>
        </div>

        {/* Items Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-gray-600">Loading...</div>
          ) : barang.length === 0 ? (
            <div className="p-8 text-center text-gray-600">Tiada barang dijumpai</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
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
                  {barang.map((item) => (
                    <tr key={item.id} className="border-b hover:bg-gray-50">
                      <td className="p-3 text-sm font-mono">{item.kodBarang}</td>
                      <td className="p-3 text-sm font-medium">{item.namaBarang}</td>
                      <td className="p-3 text-sm">{item.kategori}</td>
                      <td className="p-3 text-sm">
                        <span className={item.kuantitiTersedia === 0 ? 'text-red-600 font-medium' : ''}>
                          {item.kuantitiTersedia}
                        </span>
                        /{item.kuantitiTotal}
                      </td>
                      <td className="p-3 text-sm">{item.lokasi}</td>
                      <td className="p-3">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          item.status === 'Tersedia' ? 'bg-green-100 text-green-800' :
                          item.status === 'Rosak' ? 'bg-red-100 text-red-800' :
                          'bg-orange-100 text-orange-800'
                        }`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="p-3">
                        <button
                          onClick={() => openDetailModal(item)}
                          className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                          Lihat
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Detail Modal */}
        {showDetailModal && selectedBarang && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-xl font-bold">Butiran Barang</h2>
                  <button
                    onClick={closeDetailModal}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-600">Kod Barang</label>
                      <p className="font-mono font-semibold">{selectedBarang.kodBarang}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600">Status</label>
                      <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                        selectedBarang.status === 'Tersedia' ? 'bg-green-100 text-green-800' :
                        selectedBarang.status === 'Rosak' ? 'bg-red-100 text-red-800' :
                        'bg-orange-100 text-orange-800'
                      }`}>
                        {selectedBarang.status}
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-600">Nama Barang</label>
                    <p className="font-semibold">{selectedBarang.namaBarang}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-600">Kategori</label>
                      <p>{selectedBarang.kategori}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600">Lokasi</label>
                      <p>{selectedBarang.lokasi}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-600">Kuantiti Tersedia</label>
                      <p className="text-2xl font-bold text-green-600">{selectedBarang.kuantitiTersedia}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600">Kuantiti Total</label>
                      <p className="text-2xl font-bold">{selectedBarang.kuantitiTotal}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-600">Harga Perolehan</label>
                      <p className="font-semibold">{formatCurrency(selectedBarang.hargaPerolehan)}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600">Tarikh Perolehan</label>
                      <p>{formatDate(selectedBarang.tarikhPerolehan)}</p>
                    </div>
                  </div>

                  {selectedBarang.catatan && (
                    <div>
                      <label className="block text-sm font-medium text-gray-600">Catatan</label>
                      <p className="text-sm bg-gray-50 p-3 rounded-lg">{selectedBarang.catatan}</p>
                    </div>
                  )}

                  <div className="pt-4">
                    <button
                      onClick={closeDetailModal}
                      className="w-full bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400"
                    >
                      Tutup
                    </button>
                  </div>
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
