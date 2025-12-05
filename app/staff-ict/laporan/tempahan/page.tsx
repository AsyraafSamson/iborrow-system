'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import BottomNav from '@/components/BottomNav'

interface TempahanItem {
  id: string
  userName: string
  userEmail: string
  barangName: string
  kuantiti: number
  tarikhMula: string
  tarikhTamat: string
  status: string
  tujuan: string
  createdAt: string
}

interface LaporanTempahanData {
  tempahan: TempahanItem[]
  summary: {
    total: number
    pending: number
    approved: number
    rejected: number
    completed: number
  }
  monthlyStats: any[]
}

export default function StaffLaporanTempahan() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [laporanData, setLaporanData] = useState<LaporanTempahanData | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedStatus, setSelectedStatus] = useState<string>('')
  const [selectedMonth, setSelectedMonth] = useState<string>('')

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
  }, [user, selectedStatus, selectedMonth])

  const fetchLaporanData = async () => {
    try {
      let url = '/api/staff-ict/laporan/tempahan'
      const params = new URLSearchParams()
      if (selectedStatus) params.append('status', selectedStatus)
      if (selectedMonth) params.append('month', selectedMonth)
      if (params.toString()) url += `?${params.toString()}`
      
      const response = await fetch(url)
      const result = await response.json()
      
      if (result.success) {
        setLaporanData(result.data)
      }
    } catch (error) {
      console.error('Error fetching laporan tempahan:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ms-MY')
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800'
      case 'Diluluskan': return 'bg-green-100 text-green-800'
      case 'Ditolak': return 'bg-red-100 text-red-800'
      case 'Selesai': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
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
          <h1 className="text-2xl font-bold">Laporan Tempahan</h1>
          <p className="opacity-90">Analisis peminjaman dan kelulusan</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat data tempahan...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-3 pb-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-6 text-white mb-6">
        <h1 className="text-2xl font-bold">Laporan Tempahan</h1>
        <p className="opacity-90">Analisis peminjaman dan kelulusan</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <select 
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Semua Status</option>
            <option value="Pending">Pending</option>
            <option value="Diluluskan">Diluluskan</option>
            <option value="Ditolak">Ditolak</option>
            <option value="Selesai">Selesai</option>
          </select>
          <input
            type="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Summary Cards */}
      {laporanData?.summary && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-sm p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{laporanData.summary.total}</div>
            <div className="text-sm text-gray-600">Total Tempahan</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">{laporanData.summary.pending}</div>
            <div className="text-sm text-gray-600">Pending</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{laporanData.summary.approved}</div>
            <div className="text-sm text-gray-600">Diluluskan</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4 text-center">
            <div className="text-2xl font-bold text-red-600">{laporanData.summary.rejected}</div>
            <div className="text-sm text-gray-600">Ditolak</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">{laporanData.summary.completed}</div>
            <div className="text-sm text-gray-600">Selesai</div>
          </div>
        </div>
      )}

      {/* Tempahan List */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold">Senarai Tempahan</h2>
        </div>
        <div className="overflow-x-auto">
          {laporanData?.tempahan && laporanData.tempahan.length > 0 ? (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pemohon</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Barang</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tempoh</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tujuan</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {laporanData.tempahan.map((tempahan) => (
                  <tr key={tempahan.id}>
                    <td className="px-4 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{tempahan.userName}</div>
                        <div className="text-sm text-gray-500">{tempahan.userEmail}</div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{tempahan.barangName}</div>
                        <div className="text-sm text-gray-500">Qty: {tempahan.kuantiti}</div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-900">
                      <div>
                        <div>{formatDate(tempahan.tarikhMula)}</div>
                        <div className="text-gray-500">hingga</div>
                        <div>{formatDate(tempahan.tarikhTamat)}</div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(tempahan.status)}`}>
                        {tempahan.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-900">
                      {tempahan.tujuan}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-8 text-center text-gray-600">
              Tiada data tempahan ditemui
            </div>
          )}
        </div>
      </div>
        <BottomNav activeTab="laporan" />
      </div>
    </div>
  )
}
