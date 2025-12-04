'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

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
    if (!userData) { 
      router.push('/login')
      return 
    }
    setUser(JSON.parse(userData))
    fetchTempahan(JSON.parse(userData).id)
  }, [router])

  const fetchTempahan = async (userId: string) => {
    try {
      const response = await fetch(`/api/user/tempahan?userId=${userId}`)
      const data = await response.json()
      
      if (data.success) {
        setTempahan(data.data || [])
      } else {
        setMessage({ type: 'error', text: 'Gagal memuat tempahan' })
      }
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
      if (data.success) {
        setMessage({ type: 'success', text: 'Tempahan berjaya dibatalkan' })
        fetchTempahan(user.id)
      } else {
        setMessage({ type: 'error', text: data.error || 'Gagal batalkan tempahan' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Ralat rangkaian' })
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800'
      case 'Diluluskan': return 'bg-green-100 text-green-800'
      case 'Ditolak': return 'bg-red-100 text-red-800'
      case 'Selesai': return 'bg-blue-100 text-blue-800'
      case 'Dibatalkan': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
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

  const filteredTempahan = tempahan.filter(item => {
    if (activeTab === 'active') {
      return ['Pending', 'Diluluskan'].includes(item.status)
    }
    return true
  })

  const activeTempahan = tempahan.filter(t => ['Pending', 'Diluluskan'].includes(t.status))
  const completedTempahan = tempahan.filter(t => ['Selesai', 'Ditolak', 'Dibatalkan'].includes(t.status))

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
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-gray-900">📋 Tempahan Saya</h1>
            <Link 
              href="/user/barang"
              className="bg-blue-500 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-blue-600"
            >
              ➕ Tempah Barang
            </Link>
          </div>
        </div>

        {/* Alert Messages */}
        {message.text && (
          <div className={`mb-4 p-3 rounded-lg ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {message.text}
          </div>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          <div className="bg-yellow-100 rounded-xl p-3 text-center">
            <div className="text-lg font-bold text-yellow-800">{tempahan.filter(t => t.status === 'Pending').length}</div>
            <div className="text-xs text-yellow-600">Menunggu</div>
          </div>
          <div className="bg-green-100 rounded-xl p-3 text-center">
            <div className="text-lg font-bold text-green-800">{tempahan.filter(t => t.status === 'Diluluskan').length}</div>
            <div className="text-xs text-green-600">Diluluskan</div>
          </div>
          <div className="bg-blue-100 rounded-xl p-3 text-center">
            <div className="text-lg font-bold text-blue-800">{tempahan.filter(t => t.status === 'Selesai').length}</div>
            <div className="text-xs text-blue-600">Selesai</div>
          </div>
          <div className="bg-gray-100 rounded-xl p-3 text-center">
            <div className="text-lg font-bold text-gray-800">{tempahan.length}</div>
            <div className="text-xs text-gray-600">Jumlah</div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-xl shadow-sm p-1 mb-4">
          <div className="grid grid-cols-2 gap-1">
            <button
              onClick={() => setActiveTab('active')}
              className={`py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'active'
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              🔴 Aktif ({activeTempahan.length})
            </button>
            <button
              onClick={() => setActiveTab('all')}
              className={`py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'all'
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              📋 Semua ({tempahan.length})
            </button>
          </div>
        </div>

        {/* Tempahan List */}
        <div className="space-y-3">
          {filteredTempahan.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm p-8 text-center">
              <div className="text-4xl mb-2">📋</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {activeTab === 'active' ? 'Tiada Tempahan Aktif' : 'Tiada Tempahan'}
              </h3>
              <p className="text-gray-600 mb-4">
                {activeTab === 'active' 
                  ? 'Anda tidak mempunyai tempahan yang sedang aktif'
                  : 'Anda belum membuat sebarang tempahan'
                }
              </p>
              <Link 
                href="/user/barang"
                className="inline-block bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
              >
                📦 Lihat Barang Tersedia
              </Link>
            </div>
          ) : (
            filteredTempahan.map((item) => (
              <div key={item.id} className="bg-white rounded-xl shadow-sm p-4">
                <div className="flex items-start gap-4">
                  {/* Status Icon */}
                  <div className="text-2xl">{getStatusIcon(item.status)}</div>
                  
                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-bold text-gray-900">{item.namaBarang}</h3>
                        <p className="text-sm text-gray-600">{item.kategori} • Kuantiti: {item.kuantiti}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                        {item.status}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-3 text-sm">
                      <div>
                        <span className="text-gray-500">Tarikh Mula:</span>
                        <p className="font-medium">{new Date(item.tarikhMula).toLocaleDateString('ms-MY')}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Tarikh Tamat:</span>
                        <p className="font-medium">{new Date(item.tarikhTamat).toLocaleDateString('ms-MY')}</p>
                      </div>
                    </div>
                    
                    <div className="mb-3 text-sm">
                      <span className="text-gray-500">Tujuan:</span>
                      <p className="text-gray-900">{item.tujuan}</p>
                    </div>

                    {item.catatan && (
                      <div className="bg-gray-50 rounded-lg p-3 mb-3">
                        <span className="text-sm text-gray-500">Catatan:</span>
                        <p className="text-sm text-gray-900">{item.catatan}</p>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>Ditempah: {new Date(item.createdAt).toLocaleDateString('ms-MY')}</span>
                      
                      {/* Action Buttons */}
                      {item.status === 'Pending' && (
                        <button
                          onClick={() => handleCancel(item.id)}
                          className="bg-red-100 text-red-800 px-3 py-1 rounded-lg hover:bg-red-200 text-xs"
                        >
                          ❌ Batal
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Bottom Navigation */}
        <div className="fixed bottom-4 left-4 right-4 bg-white rounded-2xl shadow-lg p-3 flex justify-around">
          <Link href="/user/dashboard" className="flex flex-col items-center text-gray-600 hover:text-blue-600">
            <div>📊</div><div className="text-xs">Dashboard</div>
          </Link>
          <Link href="/user/barang" className="flex flex-col items-center text-gray-600 hover:text-blue-600">
            <div>📦</div><div className="text-xs">Barang</div>
          </Link>
          <Link href="/user/tempahan" className="flex flex-col items-center text-blue-600">
            <div>📋</div><div className="text-xs">Tempahan</div>
          </Link>
          <Link href="/user/sejarah" className="flex flex-col items-center text-gray-600 hover:text-blue-600">
            <div>📜</div><div className="text-xs">Sejarah</div>
          </Link>
          <Link href="/user/profile" className="flex flex-col items-center text-gray-600 hover:text-blue-600">
            <div>👤</div><div className="text-xs">Profil</div>
          </Link>
        </div>
      </div>
    </div>
  )
}
