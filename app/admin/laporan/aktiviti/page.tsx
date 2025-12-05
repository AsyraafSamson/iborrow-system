'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface ActivityReportData {
  totalLogs: number
  todayLogs: number
  byActivity: Record<string, number>
  byUser: Array<{ nama: string; count: number }>
  recentLogs: Array<{
    id: string
    nama: string
    email?: string
    peranan?: string
    jenisAktiviti: string
    keterangan: string
    ipAddress: string
    createdAt: string
  }>
}

export default function AdminLaporanAktiviti() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [data, setData] = useState<ActivityReportData | null>(null)
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
      const res = await fetch('/api/admin/laporan/aktiviti')
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
    return date.toLocaleString('ms-MY', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getActivityIcon = (jenis: string) => {
    const icons: any = {
      'CREATE': '➕',
      'UPDATE': '✏️',
      'DELETE': '🗑️',
      'LOGIN': '🔐',
      'LOGOUT': '🚪',
      'APPROVE': '✅',
      'REJECT': '❌',
      'VIEW': '👁️',
      'EXPORT': '📤',
      'IMPORT': '📥'
    }
    return icons[jenis] || '📝'
  }

  const getActivityColor = (jenis: string) => {
    const colors: any = {
      'CREATE': 'bg-green-100 text-green-800',
      'UPDATE': 'bg-blue-100 text-blue-800',
      'DELETE': 'bg-red-100 text-red-800',
      'LOGIN': 'bg-purple-100 text-purple-800',
      'LOGOUT': 'bg-gray-100 text-gray-800',
      'APPROVE': 'bg-green-100 text-green-800',
      'REJECT': 'bg-red-100 text-red-800',
      'VIEW': 'bg-blue-100 text-blue-800'
    }
    return colors[jenis] || 'bg-gray-100 text-gray-800'
  }

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
          <h1 className="text-2xl font-bold text-gray-900">Log Aktiviti</h1>
          <p className="text-sm text-gray-600">Audit trail dan analisis aktiviti sistem</p>
        </div>

        {loading ? (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center text-gray-600">
            Loading...
          </div>
        ) : data ? (
          <>
            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="bg-white rounded-xl shadow-sm p-4">
                <div className="text-3xl font-bold text-blue-600">{data.totalLogs}</div>
                <div className="text-sm text-gray-600">Jumlah Log Aktiviti</div>
              </div>
              <div className="bg-white rounded-xl shadow-sm p-4">
                <div className="text-3xl font-bold text-green-600">{data.todayLogs}</div>
                <div className="text-sm text-gray-600">Aktiviti Hari Ini</div>
              </div>
            </div>

            {/* By Activity Type */}
            <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
              <h2 className="text-lg font-semibold mb-3">Aktiviti Mengikut Jenis</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {Object.entries(data.byActivity).map(([activity, count]) => (
                  <div
                    key={activity}
                    className={`p-4 rounded-lg ${getActivityColor(activity)}`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-2xl mb-1">{getActivityIcon(activity)}</div>
                        <div className="text-xs font-medium">{activity}</div>
                      </div>
                      <div className="text-2xl font-bold">{count}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Active Users */}
            <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
              <h2 className="text-lg font-semibold mb-3">Pengguna Paling Aktif</h2>
              <div className="space-y-2">
                {data.byUser.slice(0, 10).map((u, index) => (
                  <div key={index} className="flex items-center justify-between py-2 border-b last:border-0">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-sm">
                        {index + 1}
                      </div>
                      <span className="font-medium text-gray-900">{u.nama}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${(u.count / data.byUser[0].count) * 100}%` }}
                        />
                      </div>
                      <span className="font-semibold text-gray-900 w-12 text-right">{u.count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity Logs */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-4 border-b">
                <h2 className="text-lg font-semibold">Log Terkini</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="p-3 text-left text-sm font-semibold">Masa</th>
                      <th className="p-3 text-left text-sm font-semibold">Pengguna</th>
                      <th className="p-3 text-left text-sm font-semibold">Aktiviti</th>
                      <th className="p-3 text-left text-sm font-semibold">Keterangan</th>
                      <th className="p-3 text-left text-sm font-semibold">IP</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.recentLogs.map((log) => (
                      <tr key={log.id} className="border-b hover:bg-gray-50">
                        <td className="p-3 text-sm whitespace-nowrap">
                          {formatDate(log.createdAt)}
                        </td>
                        <td className="p-3 text-sm">
                          <div>
                            <div className="font-medium">{log.nama}</div>
                            {log.peranan && (
                              <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded">
                                {log.peranan}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="p-3">
                          <span className={`px-2 py-1 rounded-full text-xs ${getActivityColor(log.jenisAktiviti)}`}>
                            {getActivityIcon(log.jenisAktiviti)} {log.jenisAktiviti}
                          </span>
                        </td>
                        <td className="p-3 text-sm">
                          <div className="max-w-md truncate" title={log.keterangan}>
                            {log.keterangan}
                          </div>
                        </td>
                        <td className="p-3 text-sm font-mono text-xs text-gray-600">
                          {log.ipAddress}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* View Full Logs Link */}
            <div className="mt-4 text-center">
              <Link
                href="/admin/tetapan/log-aktiviti"
                className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
              >
                Lihat Semua Log Aktiviti →
              </Link>
            </div>
          </>
        ) : (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center text-gray-600">
            Tiada data
          </div>
        )}

        {/* Bottom Nav */}
        <div className="fixed bottom-4 left-4 right-4 bg-white rounded-2xl shadow-lg p-3 flex justify-around">
          <Link href="/admin/dashboard" className="flex flex-col items-center text-gray-600"><div>📊</div><div className="text-xs">Dashboard</div></Link>
          <Link href="/admin/pengguna" className="flex flex-col items-center text-gray-600"><div>👥</div><div className="text-xs">Pengguna</div></Link>
          <Link href="/admin/barang" className="flex flex-col items-center text-gray-600"><div>📦</div><div className="text-xs">Barang</div></Link>
          <Link href="/admin/laporan" className="flex flex-col items-center text-blue-600"><div>📈</div><div className="text-xs">Laporan</div></Link>
          <Link href="/admin/tetapan/sistem" className="flex flex-col items-center text-gray-600"><div>⚙️</div><div className="text-xs">Tetapan</div></Link>
          <Link href="/admin/profile" className="flex flex-col items-center text-gray-600"><div>👤</div><div className="text-xs">Profil</div></Link>
        </div>
      </div>
    </div>
  )
}
