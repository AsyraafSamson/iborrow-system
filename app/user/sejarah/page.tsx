'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import BottomNav from '@/components/BottomNav'

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
  diluluskanOleh?: string
  namaApprover?: string
}

export default function UserSejarah() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [tempahan, setTempahan] = useState<Tempahan[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('semua')
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('terbaru')

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (!userData) { 
      router.push('/login')
      return 
    }
    setUser(JSON.parse(userData))
    fetchSejarah(JSON.parse(userData).id)
  }, [router])

  const fetchSejarah = async (userId: string) => {
    try {
      const response = await fetch(`/api/user/tempahan?userId=${userId}&history=true`)
      const data = await response.json()
      
      if (data.success) {
        setTempahan(data.data || [])
      }
    } catch (error) {
      console.error('Error fetching history:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'Diluluskan': return 'bg-green-100 text-green-800 border-green-200'
      case 'Ditolak': return 'bg-red-100 text-red-800 border-red-200'
      case 'Selesai': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'Dibatalkan': return 'bg-gray-100 text-gray-800 border-gray-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Pending': return '⏳'
      case 'Diluluskan': return '✅'
      case 'Ditolak': return '❌'
      case 'Selesai': return '✔️'
      case 'Dibatalkan': return '⚫'
      default: return '❓'
    }
  }

  // Filter and sort tempahan
  const filteredTempahan = tempahan
    .filter(item => {
      if (filter !== 'semua' && item.status !== filter) return false
      if (searchTerm && !item.namaBarang.toLowerCase().includes(searchTerm.toLowerCase())) return false
      return true
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'terbaru':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        case 'terlama':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        case 'nama':
          return a.namaBarang.localeCompare(b.namaBarang)
        case 'status':
          return a.status.localeCompare(b.status)
        default:
          return 0
      }
    })

  // Statistics
  const stats = {
    total: tempahan.length,
    pending: tempahan.filter(t => t.status === 'Pending').length,
    diluluskan: tempahan.filter(t => t.status === 'Diluluskan').length,
    ditolak: tempahan.filter(t => t.status === 'Ditolak').length,
    selesai: tempahan.filter(t => t.status === 'Selesai').length,
    dibatalkan: tempahan.filter(t => t.status === 'Dibatalkan').length
  }

  if (loading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>
  }

  if (!user) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">User not found</div>
  }

  return (
    <div className="min-h-screen bg-gray-50 p-3 pb-24">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
          <h1 className="text-xl font-bold text-gray-900">📜 Sejarah Tempahan</h1>
          <p className="text-sm text-gray-600 mt-1">Rekod lengkap semua tempahan anda</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
          <div className="bg-blue-100 rounded-xl p-3 text-center">
            <div className="text-lg font-bold text-blue-800">{stats.total}</div>
            <div className="text-xs text-blue-600">Jumlah Tempahan</div>
          </div>
          <div className="bg-green-100 rounded-xl p-3 text-center">
            <div className="text-lg font-bold text-green-800">{stats.diluluskan}</div>
            <div className="text-xs text-green-600">Diluluskan</div>
          </div>
          <div className="bg-red-100 rounded-xl p-3 text-center">
            <div className="text-lg font-bold text-red-800">{stats.ditolak}</div>
            <div className="text-xs text-red-600">Ditolak</div>
          </div>
          <div className="bg-purple-100 rounded-xl p-3 text-center">
            <div className="text-lg font-bold text-purple-800">{stats.selesai}</div>
            <div className="text-xs text-purple-600">Selesai</div>
          </div>
          <div className="bg-yellow-100 rounded-xl p-3 text-center">
            <div className="text-lg font-bold text-yellow-800">{stats.pending}</div>
            <div className="text-xs text-yellow-600">Menunggu</div>
          </div>
          <div className="bg-gray-100 rounded-xl p-3 text-center">
            <div className="text-lg font-bold text-gray-800">{stats.dibatalkan}</div>
            <div className="text-xs text-gray-600">Dibatalkan</div>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
          <div className="space-y-3">
            {/* Search */}
            <div>
              <input
                type="text"
                placeholder="Cari nama barang..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Filters */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="semua">Semua Status</option>
                  <option value="Pending">Menunggu</option>
                  <option value="Diluluskan">Diluluskan</option>
                  <option value="Ditolak">Ditolak</option>
                  <option value="Selesai">Selesai</option>
                  <option value="Dibatalkan">Dibatalkan</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Urutan</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="terbaru">Terbaru</option>
                  <option value="terlama">Terlama</option>
                  <option value="nama">Nama Barang</option>
                  <option value="status">Status</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Results Info */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-gray-600">
            Menunjukkan {filteredTempahan.length} daripada {tempahan.length} rekod
          </p>
          {(filter !== 'semua' || searchTerm) && (
            <button
              onClick={() => { setFilter('semua'); setSearchTerm(''); setSortBy('terbaru') }}
              className="text-xs text-blue-600 hover:text-blue-800"
            >
              🔄 Reset Penapis
            </button>
          )}
        </div>

        {/* History List */}
        <div className="space-y-3">
          {filteredTempahan.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm p-8 text-center">
              <div className="text-4xl mb-2">📜</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Tiada Rekod Dijumpai</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm || filter !== 'semua' 
                  ? 'Tiada rekod yang sepadan dengan carian atau penapis anda'
                  : 'Anda belum membuat sebarang tempahan'
                }
              </p>
              {(!searchTerm && filter === 'semua') && (
                <Link 
                  href="/user/barang"
                  className="inline-block bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                >
                  📦 Lihat Barang Tersedia
                </Link>
              )}
            </div>
          ) : (
            filteredTempahan.map((item) => (
              <div key={item.id} className="bg-white rounded-xl shadow-sm p-4">
                <div className="flex items-start gap-4">
                  {/* Status Icon */}
                  <div className="text-2xl">{getStatusIcon(item.status)}</div>
                  
                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-bold text-gray-900">{item.namaBarang}</h3>
                        <p className="text-sm text-gray-600">{item.kategori} • Kuantiti: {item.kuantiti}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(item.status)}`}>
                        {item.status}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3 text-sm">
                      <div>
                        <span className="text-gray-500 block">Tempoh:</span>
                        <p className="font-medium">
                          {new Date(item.tarikhMula).toLocaleDateString('ms-MY')} - {new Date(item.tarikhTamat).toLocaleDateString('ms-MY')}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-500 block">Ditempah:</span>
                        <p className="font-medium">{new Date(item.createdAt).toLocaleDateString('ms-MY')}</p>
                      </div>
                      {item.namaApprover && (
                        <div>
                          <span className="text-gray-500 block">Diluluskan oleh:</span>
                          <p className="font-medium">{item.namaApprover}</p>
                        </div>
                      )}
                    </div>
                    
                    <div className="mb-3 text-sm">
                      <span className="text-gray-500 block">Tujuan:</span>
                      <p className="text-gray-900">{item.tujuan}</p>
                    </div>

                    {item.catatan && (
                      <div className="bg-gray-50 rounded-lg p-3">
                        <span className="text-sm text-gray-500 block">Catatan:</span>
                        <p className="text-sm text-gray-900">{item.catatan}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Bottom Navigation */}
        <BottomNav activeTab="sejarah" />
      </div>
    </div>
  )
}
