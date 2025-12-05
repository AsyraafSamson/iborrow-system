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

  const [bookingData, setBookingData] = useState({
    kuantiti: 1,
    tarikhMula: '',
    tarikhTamat: '',
    tujuan: ''
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
      const res = await fetch('/api/user/barang')
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

  const openBookingModal = (item: Barang) => {
    setSelectedBarang(item)
    setBookingData({
      kuantiti: 1,
      tarikhMula: '',
      tarikhTamat: '',
      tujuan: ''
    })
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
      console.error('Error:', error)
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

  if (!user) return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>

  return (
    <div className="min-h-screen bg-gray-50 p-3 pb-24">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
          <h1 className="text-2xl font-bold text-gray-900">Senarai Barang</h1>
          <p className="text-sm text-gray-600">Cari dan tempah barang yang diperlukan</p>
        </div>

        {/* Search & Filter */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Cari nama atau kod barang..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg text-sm"
            />
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
        </div>

        {/* Items Grid */}
        {loading ? (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center text-gray-600">
            Loading...
          </div>
        ) : filteredBarang.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center text-gray-600">
            Tiada barang dijumpai
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {filteredBarang.map((item) => (
              <div key={item.id} className="bg-white rounded-xl shadow-sm p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-bold text-gray-900">{item.namaBarang}</h3>
                    <p className="text-sm text-gray-600">{item.kategori}</p>
                  </div>
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                    {item.status}
                  </span>
                </div>

                <div className="space-y-1 mb-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Kod:</span>
                    <span className="font-medium">{item.kodBarang}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Lokasi:</span>
                    <span className="font-medium">{item.lokasi}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tersedia:</span>
                    <span className="font-medium">{item.kuantitiTersedia}/{item.kuantitiTotal} unit</span>
                  </div>
                </div>

                {item.catatan && (
                  <p className="text-xs text-gray-500 mb-3">{item.catatan}</p>
                )}

                <button
                  onClick={() => openBookingModal(item)}
                  disabled={item.kuantitiTersedia === 0}
                  className="w-full bg-blue-600 text-white py-2 rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {item.kuantitiTersedia > 0 ? 'Buat Tempahan' : 'Tiada Stok'}
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Booking Modal */}
        {showModal && selectedBarang && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <h2 className="text-xl font-bold mb-4">Buat Tempahan</h2>

                <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm font-medium">{selectedBarang.namaBarang}</p>
                  <p className="text-xs text-gray-600">{selectedBarang.kategori} • {selectedBarang.kodBarang}</p>
                  <p className="text-xs text-gray-600 mt-1">Tersedia: {selectedBarang.kuantitiTersedia} unit</p>
                </div>

                <form onSubmit={handleSubmitBooking} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Kuantiti *</label>
                    <input
                      type="number"
                      value={bookingData.kuantiti}
                      onChange={(e) => setBookingData({...bookingData, kuantiti: parseInt(e.target.value) || 1})}
                      className="w-full px-3 py-2 border rounded-lg"
                      min="1"
                      max={selectedBarang.kuantitiTersedia}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Tarikh Mula *</label>
                    <input
                      type="date"
                      value={bookingData.tarikhMula}
                      onChange={(e) => setBookingData({...bookingData, tarikhMula: e.target.value})}
                      className="w-full px-3 py-2 border rounded-lg"
                      min={new Date().toISOString().split('T')[0]}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Tarikh Tamat *</label>
                    <input
                      type="date"
                      value={bookingData.tarikhTamat}
                      onChange={(e) => setBookingData({...bookingData, tarikhTamat: e.target.value})}
                      className="w-full px-3 py-2 border rounded-lg"
                      min={bookingData.tarikhMula || new Date().toISOString().split('T')[0]}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Tujuan Penggunaan *</label>
                    <textarea
                      value={bookingData.tujuan}
                      onChange={(e) => setBookingData({...bookingData, tujuan: e.target.value})}
                      className="w-full px-3 py-2 border rounded-lg"
                      rows={4}
                      placeholder="Nyatakan tujuan penggunaan barang..."
                      required
                    />
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <p className="text-xs text-yellow-800">
                      Tempahan anda akan dihantar kepada Staff ICT untuk kelulusan
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                    >
                      {loading ? 'Memproses...' : 'Hantar Tempahan'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowModal(false)
                        setSelectedBarang(null)
                      }}
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
        <BottomNav activeTab="barang" />
      </div>
    </div>
  )
}
