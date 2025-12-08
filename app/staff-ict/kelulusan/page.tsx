'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import BottomNav from '@/components/BottomNav'

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
    if (!userData) {
      router.push('/login')
      return
    }
    setUser(JSON.parse(userData))
    fetchTempahan()
  }, [router])

  const fetchTempahan = async () => {
    try {
      const res = await fetch('/api/staff-ict/kelulusan')
      const data = await res.json()
      if (data.success) {
        setTempahan(data.data || [])
      }
    } catch (error) {
      console.error('Error fetching tempahan:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (booking: Tempahan) => {
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
        body: JSON.stringify({
          id: booking.id,
          status: 'Ditolak',
          catatan: reason
        })
      })

      const data = await res.json()
      if (data.success) {
        alert(data.message)
        fetchTempahan()
      } else {
        alert(data.error || 'Gagal tolak tempahan')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Network error')
    } finally {
      setLoading(false)
    }
  }

  const handleReturn = async (booking: Tempahan) => {
    const catatan = prompt('Catatan pemulangan (opsional):') || ''

    if (!confirm(`Kembalikan barang dari ${booking.namaPemohon}?\n\nKuantiti ${booking.kuantiti} unit akan dikembalikan ke stok.`)) return

    setLoading(true)
    try {
      const res = await fetch('/api/staff-ict/kelulusan', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: booking.id,
          action: 'return',
          catatan: catatan
        })
      })

      const data = await res.json()
      if (data.success) {
        alert(data.message)
        fetchTempahan()
      } else {
        alert(data.error || 'Gagal kembalikan barang')
      }
    } catch (error) {
      console.error('Error:', error)
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
        body: JSON.stringify({
          id: selectedBooking.id,
          status: 'Diluluskan',
          catatan: catatan || 'Diluluskan'
        })
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
      console.error('Error:', error)
      alert('Network error')
    } finally {
      setLoading(false)
    }
  }

  const filteredTempahan = tempahan.filter(t => {
    if (filterStatus === 'all') return true
    return t.status === filterStatus
  })

  const statusCounts = {
    pending: tempahan.filter(t => t.status === 'Pending').length,
    diluluskan: tempahan.filter(t => t.status === 'Diluluskan').length,
    selesai: tempahan.filter(t => t.status === 'Selesai').length,
    ditolak: tempahan.filter(t => t.status === 'Ditolak').length
  }

  if (!user) return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>

  return (
    <div className="min-h-screen bg-gray-50 p-3 pb-24">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
          <h1 className="text-2xl font-bold text-gray-900">Kelulusan Tempahan</h1>
          <p className="text-sm text-gray-600">Urus permohonan pinjaman barang</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-2 mb-4">
          <div className="bg-orange-100 rounded-xl p-3">
            <div className="text-xl font-bold text-orange-800">{statusCounts.pending}</div>
            <div className="text-xs text-orange-600">Pending</div>
          </div>
          <div className="bg-green-100 rounded-xl p-3">
            <div className="text-xl font-bold text-green-800">{statusCounts.diluluskan}</div>
            <div className="text-xs text-green-600">Diluluskan</div>
          </div>
          <div className="bg-blue-100 rounded-xl p-3">
            <div className="text-xl font-bold text-blue-800">{statusCounts.selesai}</div>
            <div className="text-xs text-blue-600">Selesai</div>
          </div>
          <div className="bg-red-100 rounded-xl p-3">
            <div className="text-xl font-bold text-red-800">{statusCounts.ditolak}</div>
            <div className="text-xs text-red-600">Ditolak</div>
          </div>
        </div>

        {/* Filter */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg text-sm"
          >
            <option value="Pending">Pending</option>
            <option value="Diluluskan">Diluluskan (Belum Dikembalikan)</option>
            <option value="Selesai">Selesai (Sudah Dikembalikan)</option>
            <option value="Ditolak">Ditolak</option>
            <option value="all">Semua Status</option>
          </select>
        </div>

        {/* Bookings List */}
        <div className="space-y-3">
          {loading ? (
            <div className="bg-white rounded-xl shadow-sm p-8 text-center text-gray-600">
              Loading...
            </div>
          ) : filteredTempahan.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm p-8 text-center text-gray-600">
              Tiada tempahan {filterStatus !== 'all' ? filterStatus.toLowerCase() : ''}
            </div>
          ) : (
            filteredTempahan.map((booking) => (
              <div key={booking.id} className="bg-white rounded-xl shadow-sm p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-bold text-gray-900">{booking.namaBarang}</h3>
                    <p className="text-sm text-gray-600">{booking.kategori} • {booking.lokasi}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    booking.status === 'Pending' ? 'bg-orange-100 text-orange-800' :
                    booking.status === 'Diluluskan' ? 'bg-green-100 text-green-800' :
                    booking.status === 'Selesai' ? 'bg-blue-100 text-blue-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {booking.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div className="text-sm">
                    <span className="text-gray-600">Pemohon:</span>
                    <p className="font-medium">{booking.namaPemohon}</p>
                    <p className="text-xs text-gray-500">{booking.emailPemohon}</p>
                  </div>
                  <div className="text-sm">
                    <span className="text-gray-600">Fakulti:</span>
                    <p className="font-medium">{booking.fakulti}</p>
                  </div>
                  <div className="text-sm">
                    <span className="text-gray-600">Tarikh:</span>
                    <p className="font-medium">
                      {new Date(booking.tarikhMula).toLocaleDateString('ms-MY')} - {new Date(booking.tarikhTamat).toLocaleDateString('ms-MY')}
                    </p>
                  </div>
                  <div className="text-sm">
                    <span className="text-gray-600">Kuantiti:</span>
                    <p className="font-medium">{booking.kuantiti} unit</p>
                  </div>
                </div>

                <div className="mb-3">
                  <span className="text-sm text-gray-600">Tujuan:</span>
                  <p className="text-sm mt-1 bg-gray-50 p-2 rounded">{booking.tujuan}</p>
                </div>

                {booking.status === 'Pending' && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleApprove(booking)}
                      className="flex-1 bg-green-600 text-white py-2 rounded-lg text-sm hover:bg-green-700"
                    >
                      ✓ Lulus
                    </button>
                    <button
                      onClick={() => handleReject(booking)}
                      className="flex-1 bg-red-600 text-white py-2 rounded-lg text-sm hover:bg-red-700"
                    >
                      ✗ Tolak
                    </button>
                  </div>
                )}

                {booking.status === 'Diluluskan' && (
                  <div>
                    <button
                      onClick={() => handleReturn(booking)}
                      className="w-full bg-blue-600 text-white py-2 rounded-lg text-sm hover:bg-blue-700 flex items-center justify-center gap-2"
                    >
                      <span>↩</span> Kembalikan Barang
                    </button>
                    <div className="text-xs text-gray-500 mt-2">
                      Diluluskan pada: {new Date(booking.createdAt).toLocaleString('ms-MY')}
                    </div>
                  </div>
                )}

                {(booking.status === 'Ditolak' || booking.status === 'Selesai') && (
                  <div className="text-xs text-gray-500 mt-2">
                    Diproses pada: {new Date(booking.createdAt).toLocaleString('ms-MY')}
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Approval Modal */}
        {showModal && selectedBooking && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-md w-full">
              <div className="p-6">
                <h2 className="text-xl font-bold mb-4">Luluskan Tempahan</h2>

                <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm"><strong>Barang:</strong> {selectedBooking.namaBarang}</p>
                  <p className="text-sm"><strong>Pemohon:</strong> {selectedBooking.namaPemohon}</p>
                  <p className="text-sm"><strong>Kuantiti:</strong> {selectedBooking.kuantiti} unit</p>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Catatan (Opsional)</label>
                  <textarea
                    value={catatan}
                    onChange={(e) => setCatatan(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg"
                    rows={3}
                    placeholder="Tambah nota jika perlu..."
                  />
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                  <p className="text-sm text-yellow-800">
                    Setelah diluluskan, kuantiti barang akan dikurangkan secara automatik.
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={confirmApprove}
                    disabled={loading}
                    className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
                  >
                    {loading ? 'Memproses...' : 'Luluskan'}
                  </button>
                  <button
                    onClick={() => {
                      setShowModal(false)
                      setSelectedBooking(null)
                      setCatatan('')
                    }}
                    className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400"
                  >
                    Batal
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Bottom Nav */}
        <BottomNav activeTab="kelulusan" />
      </div>
    </div>
  )
}
