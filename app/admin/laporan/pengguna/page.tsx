'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import BottomNav from '@/components/BottomNav'

interface UserReportData {
  totalUsers: number
  activeUsers: number
  inactiveUsers: number
  byRole: Record<string, number>
  byFakulti: Record<string, number>
  recentUsers: Array<{
    id: string
    nama: string
    email: string
    peranan: string
    fakulti?: string
    status: string
    totalTempahan: number
    lastLogin?: string
    createdAt: string
  }>
}

export default function AdminLaporanPengguna() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [data, setData] = useState<UserReportData | null>(null)
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
      const res = await fetch('/api/admin/laporan/pengguna')
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

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return 'N/A'
    const date = new Date(dateStr)
    return date.toLocaleDateString('ms-MY', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getRoleBadgeColor = (role: string) => {
    const colors: any = {
      'admin': 'bg-red-100 text-red-800',
      'staff-ict': 'bg-blue-100 text-blue-800',
      'pengajar': 'bg-green-100 text-green-800',
      'pelajar': 'bg-purple-100 text-purple-800',
      'staff-pentadbiran': 'bg-orange-100 text-orange-800'
    }
    return colors[role] || 'bg-gray-100 text-gray-800'
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
          <h1 className="text-2xl font-bold text-gray-900">Laporan Pengguna</h1>
          <p className="text-sm text-gray-600">Statistik dan analisis pengguna sistem</p>
        </div>

        {loading ? (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center text-gray-600">
            Loading...
          </div>
        ) : data ? (
          <>
            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="bg-white rounded-xl shadow-sm p-4">
                <div className="text-2xl font-bold text-blue-600">{data.totalUsers}</div>
                <div className="text-sm text-gray-600">Jumlah Pengguna</div>
              </div>
              <div className="bg-white rounded-xl shadow-sm p-4">
                <div className="text-2xl font-bold text-green-600">{data.activeUsers}</div>
                <div className="text-sm text-gray-600">Pengguna Aktif</div>
              </div>
              <div className="bg-white rounded-xl shadow-sm p-4">
                <div className="text-2xl font-bold text-red-600">{data.inactiveUsers}</div>
                <div className="text-sm text-gray-600">Pengguna Tidak Aktif</div>
              </div>
            </div>

            {/* By Role */}
            <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
              <h2 className="text-lg font-semibold mb-3">Pengguna Mengikut Peranan</h2>
              <div className="space-y-3">
                {Object.entries(data.byRole).map(([role, count]) => (
                  <div key={role} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-full text-sm ${getRoleBadgeColor(role)}`}>
                        {role}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${(count / data.totalUsers) * 100}%` }}
                        />
                      </div>
                      <span className="font-semibold text-gray-900 w-12 text-right">{count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* By Fakulti */}
            {Object.keys(data.byFakulti).length > 0 && (
              <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
                <h2 className="text-lg font-semibold mb-3">Pengguna Mengikut Fakulti</h2>
                <div className="space-y-2">
                  {Object.entries(data.byFakulti).map(([fakulti, count]) => (
                    <div key={fakulti} className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">{fakulti}</span>
                      <div className="flex items-center gap-3">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-green-600 h-2 rounded-full"
                            style={{ width: `${(count / data.totalUsers) * 100}%` }}
                          />
                        </div>
                        <span className="font-semibold text-gray-900 w-8 text-right">{count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recent Users Table */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-4 border-b">
                <h2 className="text-lg font-semibold">Pengguna Terkini</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="p-3 text-left text-sm font-semibold">Nama</th>
                      <th className="p-3 text-left text-sm font-semibold">Email</th>
                      <th className="p-3 text-left text-sm font-semibold">Peranan</th>
                      <th className="p-3 text-left text-sm font-semibold">Fakulti</th>
                      <th className="p-3 text-left text-sm font-semibold">Status</th>
                      <th className="p-3 text-left text-sm font-semibold">Tempahan</th>
                      <th className="p-3 text-left text-sm font-semibold">Daftar</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.recentUsers.map((u) => (
                      <tr key={u.id} className="border-b hover:bg-gray-50">
                        <td className="p-3 text-sm font-medium">{u.nama}</td>
                        <td className="p-3 text-sm text-gray-600">{u.email}</td>
                        <td className="p-3">
                          <span className={`px-2 py-1 rounded-full text-xs ${getRoleBadgeColor(u.peranan)}`}>
                            {u.peranan}
                          </span>
                        </td>
                        <td className="p-3 text-sm">{u.fakulti || '-'}</td>
                        <td className="p-3">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            u.status === 'aktif' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {u.status}
                          </span>
                        </td>
                        <td className="p-3 text-sm text-center">{u.totalTempahan}</td>
                        <td className="p-3 text-sm text-gray-600">{formatDate(u.createdAt)}</td>
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
