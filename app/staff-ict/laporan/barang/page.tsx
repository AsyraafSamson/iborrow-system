'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import BottomNav from '@/components/BottomNav'

interface BarangItem {
  id: string
  namaBarang: string
  kategori: string
  kodBarang: string
  kuantitiTotal: number
  kuantitiTersedia: number
  kuantitiDipinjam: number
  lokasi: string
  status: string
  utilizationRate: number
}

interface LaporanBarangData {
  items: BarangItem[]
  summary: {
    totalItems: number
    totalQuantity: number
    availableQuantity: number
    borrowedQuantity: number
    overallUtilization: number
  }
}

export default function StaffLaporanBarang() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [laporanData, setLaporanData] = useState<LaporanBarangData | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedKategori, setSelectedKategori] = useState<string>('')

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (!userData) { 
      router.push('/login')
      return 
    }
    const parsedUser = JSON.parse(userData)
    if (parsedUser.peranan !== 'staff-ict') {
      router.push('/login')
      return
    }
    setUser(parsedUser)
  }, [router])

  useEffect(() => {
    if (user) {
      fetchLaporanData()
    }
  }, [user, selectedKategori])

  const fetchLaporanData = async () => {
    try {
      let url = '/api/staff-ict/laporan/barang'
      if (selectedKategori) {
        url += `?kategori=${encodeURIComponent(selectedKategori)}`
      }
      
      const response = await fetch(url)
      const result = await response.json()
      
      if (result.success) {
        setLaporanData(result.data)
      }
    } catch (error) {
      console.error('Error fetching laporan barang:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 p-3 pb-24 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat...</p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-3 pb-24">
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-6 text-white mb-6">
          <h1 className="text-2xl font-bold">Laporan Barang</h1>
          <p className="opacity-90">Inventori dan penggunaan</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat data barang...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-3 pb-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-6 text-white mb-6">
        <h1 className="text-2xl font-bold">Laporan Barang</h1>
        <p className="opacity-90">Inventori dan penggunaan</p>
      </div>

      {/* Filter */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <select 
            value={selectedKategori}
            onChange={(e) => setSelectedKategori(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Semua Kategori</option>
            <option value="laptop">Laptop</option>
            <option value="projector">Projector</option>
            <option value="camera">Camera</option>
            <option value="fotografi">Fotografi</option>
          </select>
        </div>
      </div>

      {/* Summary Cards */}
      {laporanData?.summary && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-sm p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{laporanData.summary.totalItems}</div>
            <div className="text-sm text-gray-600">Jenis Barang</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{laporanData.summary.totalQuantity}</div>
            <div className="text-sm text-gray-600">Total Unit</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">{laporanData.summary.availableQuantity}</div>
            <div className="text-sm text-gray-600">Tersedia</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4 text-center">
            <div className="text-2xl font-bold text-red-600">{laporanData.summary.borrowedQuantity}</div>
            <div className="text-sm text-gray-600">Dipinjam</div>
          </div>
        </div>
      )}

      {/* Items List */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold">Senarai Barang</h2>
        </div>
        <div className="overflow-x-auto">
          {laporanData?.items && laporanData.items.length > 0 ? (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Barang</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kategori</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kuantiti</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Penggunaan</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {laporanData.items.map((item) => (
                  <tr key={item.id}>
                    <td className="px-4 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{item.namaBarang}</div>
                        <div className="text-sm text-gray-500">{item.kodBarang}</div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-900">{item.kategori}</td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        item.status === 'Tersedia' ? 'bg-green-100 text-green-800' : 
                        'bg-red-100 text-red-800'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-900">
                      <div className="text-sm">
                        <div>Total: {item.kuantitiTotal}</div>
                        <div>Tersedia: {item.kuantitiTersedia}</div>
                        <div>Dipinjam: {item.kuantitiDipinjam}</div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center">
                        <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{width: `${item.utilizationRate}%`}}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600">{item.utilizationRate}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-8 text-center text-gray-600">
              Tiada data barang ditemui
            </div>
          )}
        </div>
      </div>
        <BottomNav activeTab="laporan" />
      </div>
  )
}
