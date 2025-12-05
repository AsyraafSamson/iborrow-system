'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import BottomNav from '@/components/BottomNav'

interface BookingReportData {
  totalTempahan: number
  pending: number
  diluluskan: number
  ditolak: number
  dibatalkan: number
  approvalRate: number
  byStatus: Record<string, number>
  monthlyTrend: Array<{ month: string; count: number }>
  recentBookings: Array<{
    id: string
    namaPemohon: string
    namaBarang: string
    kategori: string
    kodBarang?: string
    kuantiti: number
    tarikhMula: string
    tarikhTamat: string
    status: string
    createdAt: string
  }>
}

export default function AdminLaporanTempahan() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [data, setData] = useState<BookingReportData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (!userData) {
      router.push('/login')
      return
    }
    setUser(JSON.parse(userData))
    fetchReport()
  }, [router])

  const fetchReport = async () => {
    try {
      const res = await fetch('/api/admin/laporan/tempahan')
      const result = await res.json()
      if (result.success) {
        setData(result.data)
      }
    } catch (error) {
      console.error('Error fetching report:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('ms-MY', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getStatusColor = (status: string) => {
    const colors: any = {
      'Pending': 'bg-yellow-100 text-yellow-800',
      'Diluluskan': 'bg-green-100 text-green-800',
      'Ditolak': 'bg-red-100 text-red-800',
      'Dibatalkan': 'bg-gray-100 text-gray-800',
      'Selesai': 'bg-blue-100 text-blue-800'
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  const maxTrendCount = data ? Math.max(...data.monthlyTrend.map(t => t.count), 1) : 1

  if (!user) return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>

  return (
    <div className="min-h-screen bg-gray-50 p-3 pb-24">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
          <div className="flex items-center gap-2 mb-2">
            <Link href="/admin/laporan" className="text-blue-600 hover:text-blue-800">
              ← Kembali
            </Link>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Laporan Tempahan</h1>
          <p className="text-sm text-gray-600">Trend dan status peminjaman barang</p>
        </div>

        {loading ? (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center text-gray-600">
            Loading...
          </div>
        ) : data ? (
          <>
            {/* Summary Stats */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4">
              <div className="bg-white rounded-xl shadow-sm p-4">
                <div className="text-2xl font-bold text-blue-600">{data.totalTempahan}</div>
                <div className="text-xs text-gray-600">Jumlah</div>
              </div>
              <div className="bg-white rounded-xl shadow-sm p-4">
                <div className="text-2xl font-bold text-yellow-600">{data.pending}</div>
                <div className="text-xs text-gray-600">Pending</div>
              </div>
              <div className="bg-white rounded-xl shadow-sm p-4">
                <div className="text-2xl font-bold text-green-600">{data.diluluskan}</div>
                <div className="text-xs text-gray-600">Diluluskan</div>
              </div>
              <div className="bg-white rounded-xl shadow-sm p-4">
                <div className="text-2xl font-bold text-red-600">{data.ditolak}</div>
                <div className="text-xs text-gray-600">Ditolak</div>
              </div>
              <div className="bg-white rounded-xl shadow-sm p-4">
                <div className="text-2xl font-bold text-gray-600">{data.dibatalkan}</div>
                <div className="text-xs text-gray-600">Dibatalkan</div>
              </div>
            </div>

            {/* Approval Rate */}
            <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl shadow-sm p-6 mb-4 text-white">
              <div className="text-sm opacity-90">Kadar Kelulusan</div>
              <div className="text-4xl font-bold mt-1">{data.approvalRate}%</div>
              <div className="text-sm opacity-75 mt-2">
                {data.diluluskan} daripada {data.diluluskan + data.ditolak} tempahan diluluskan
              </div>
            </div>

            {/* Monthly Trend */}
            {data.monthlyTrend.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
                <h2 className="text-lg font-semibold mb-4">Trend Bulanan (Tahun Ini)</h2>
                <div className="flex items-end justify-between gap-2 h-48">
                  {data.monthlyTrend.map((item) => (
                    <div key={item.month} className="flex-1 flex flex-col items-center justify-end h-full">
                      <div className="text-sm font-semibold text-blue-600 mb-1">{item.count}</div>
                      <div
                        className="w-full bg-blue-500 rounded-t-lg transition-all hover:bg-blue-600"
                        style={{ height: `${(item.count / maxTrendCount) * 100}%`, minHeight: '20px' }}
                      />
                      <div className="text-xs text-gray-600 mt-2">{item.month}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* By Status */}
            <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
              <h2 className="text-lg font-semibold mb-3">Tempahan Mengikut Status</h2>
              <div className="space-y-3">
                {Object.entries(data.byStatus).map(([status, count]) => (
                  <div key={status} className="flex items-center justify-between">
                    <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(status)}`}>
                      {status}
                    </span>
                    <div className="flex items-center gap-3">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${(count / data.totalTempahan) * 100}%` }}
                        />
                      </div>
                      <span className="font-semibold text-gray-900 w-12 text-right">{count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Bookings */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-4 border-b">
                <h2 className="text-lg font-semibold">Tempahan Terkini</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="p-3 text-left text-sm font-semibold">Pemohon</th>
                      <th className="p-3 text-left text-sm font-semibold">Barang</th>
                      <th className="p-3 text-left text-sm font-semibold">Kuantiti</th>
                      <th className="p-3 text-left text-sm font-semibold">Tarikh</th>
                      <th className="p-3 text-left text-sm font-semibold">Status</th>
                      <th className="p-3 text-left text-sm font-semibold">Dibuat</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.recentBookings.map((booking) => (
                      <tr key={booking.id} className="border-b hover:bg-gray-50">
                        <td className="p-3 text-sm font-medium">{booking.namaPemohon}</td>
                        <td className="p-3 text-sm">
                          <div>{booking.namaBarang}</div>
                          <div className="text-xs text-gray-500">{booking.kategori}</div>
                        </td>
                        <td className="p-3 text-sm text-center">{booking.kuantiti}</td>
                        <td className="p-3 text-sm">
                          <div className="text-xs">
                            <div>{formatDate(booking.tarikhMula)}</div>
                            <div className="text-gray-500">- {formatDate(booking.tarikhTamat)}</div>
                          </div>
                        </td>
                        <td className="p-3">
                          <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(booking.status)}`}>
                            {booking.status}
                          </span>
                        </td>
                        <td className="p-3 text-sm text-gray-600">{formatDate(booking.createdAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        ) : (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center text-gray-600">
            Tiada data
          </div>
        )}

        {/* Bottom Nav */}
        <BottomNav activeTab="laporan" />
      </div>
    </div>
  )
}
