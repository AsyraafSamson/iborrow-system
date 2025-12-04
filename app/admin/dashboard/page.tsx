'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function AdminDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [dashboardData, setDashboardData] = useState({
    totalUsers: 0,
    totalBarang: 0,
    tempahanAktif: 0,
    perluKelulusan: 0,
    recentActivity: []
  })
  const [loading, setLoading] = useState(true)

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
      const fetchDashboardData = async () => {
        try {
          const response = await fetch('/api/admin/dashboard')
          if (response.ok) {
            const data = await response.json()
            setDashboardData(data)
          }
        } catch (error) {
          console.error('Error fetching dashboard data:', error)
        } finally {
          setLoading(false)
        }
      }

      fetchDashboardData()
    }
  }, [user])

  const handleLogout = () => {
    localStorage.removeItem('user')
    router.push('/login')
  }

  if (!user) return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>

  return (
    <div className="min-h-screen bg-gray-50 p-3 pb-24">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard Admin</h1>
            <p className="text-sm text-gray-600">Selamat datang, {user.nama}</p>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700"
          >
            Logout
          </button>
        </div>

        {/* Dashboard Stats */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-blue-100 rounded-xl p-4">
            <div className="text-3xl font-bold text-blue-800">
              {loading ? '...' : dashboardData.totalUsers}
            </div>
            <div className="text-sm text-blue-600">Total Pengguna</div>
          </div>
          <div className="bg-green-100 rounded-xl p-4">
            <div className="text-3xl font-bold text-green-800">
              {loading ? '...' : dashboardData.totalBarang}
            </div>
            <div className="text-sm text-green-600">Total Barang</div>
          </div>
          <div className="bg-purple-100 rounded-xl p-4">
            <div className="text-3xl font-bold text-purple-800">
              {loading ? '...' : dashboardData.tempahanAktif}
            </div>
            <div className="text-sm text-purple-600">Tempahan Aktif</div>
          </div>
          <div className="bg-orange-100 rounded-xl p-4">
            <div className="text-3xl font-bold text-orange-800">
              {loading ? '...' : dashboardData.perluKelulusan}
            </div>
            <div className="text-sm text-orange-600">Perlu Kelulusan</div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
          <h2 className="text-lg font-bold text-gray-900 mb-3">Aktiviti Terkini</h2>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {loading ? (
              <div className="text-gray-500 text-sm">Memuat aktiviti...</div>
            ) : dashboardData.recentActivity.length > 0 ? (
              dashboardData.recentActivity.map((activity: any, index: number) => (
                <div key={index} className="text-xs text-gray-600 py-1 border-b border-gray-100 last:border-b-0">
                  <span className="font-medium">{activity.user_email}</span> - {activity.action}
                  <div className="text-gray-400">{new Date(activity.timestamp).toLocaleString()}</div>
                </div>
              ))
            ) : (
              <div className="text-gray-500 text-sm">Tiada aktiviti terkini</div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
          <h2 className="text-lg font-bold text-gray-900 mb-3">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            <Link href="/admin/pengguna" className="bg-blue-50 p-3 rounded-lg text-center text-blue-700 hover:bg-blue-100">
              Urus Pengguna
            </Link>
            <Link href="/admin/barang" className="bg-green-50 p-3 rounded-lg text-center text-green-700 hover:bg-green-100">
              Urus Barang
            </Link>
            <Link href="/admin/laporan" className="bg-purple-50 p-3 rounded-lg text-center text-purple-700 hover:bg-purple-100">
              Lihat Laporan
            </Link>
            <Link href="/admin/tetapan/sistem" className="bg-gray-50 p-3 rounded-lg text-center text-gray-700 hover:bg-gray-100">
              Tetapan Sistem
            </Link>
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="fixed bottom-4 left-4 right-4 bg-white rounded-2xl shadow-lg p-3 flex justify-around items-center">
          <Link href="/admin/dashboard" className="flex flex-col items-center text-blue-600">
            <div className="text-xl">📊</div>
            <div className="text-xs">Dashboard</div>
          </Link>
          <Link href="/admin/pengguna" className="flex flex-col items-center text-gray-600">
            <div className="text-xl">👥</div>
            <div className="text-xs">Pengguna</div>
          </Link>
          <Link href="/admin/barang" className="flex flex-col items-center text-gray-600">
            <div className="text-xl">📦</div>
            <div className="text-xs">Barang</div>
          </Link>
          <Link href="/admin/laporan" className="flex flex-col items-center text-gray-600">
            <div className="text-xl">📈</div>
            <div className="text-xs">Laporan</div>
          </Link>
          <Link href="/admin/tetapan/sistem" className="flex flex-col items-center text-gray-600">
            <div className="text-xl">⚙️</div>
            <div className="text-xs">Tetapan</div>
          </Link>
          <Link href="/admin/profile" className="flex flex-col items-center text-gray-600">
            <div className="text-xl">👤</div>
            <div className="text-xs">Profil</div>
          </Link>
        </div>
      </div>
    </div>
  )
}
