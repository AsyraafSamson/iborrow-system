'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface DashboardStats {
  tempahanAktif: number
  barangTersedia: number
  tempahanSelesai: number
  tempahanPending: number
}

export default function UserDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (!userData) { 
      router.push('/login')
      return 
    }
    setUser(JSON.parse(userData))
    fetchDashboardData(JSON.parse(userData).id)
  }, [router])

  const fetchDashboardData = async (userId: string) => {
    try {
      const response = await fetch(`/api/user/dashboard?userId=${userId}`)
      const data = await response.json()
      
      if (data.success) {
        setStats(data.data)
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>

  return (
    <div className="min-h-screen bg-gray-50 p-3 pb-24">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
          <h1 className="text-2xl font-bold">Dashboard Pengguna</h1>
          <p className="text-sm text-gray-600">Selamat datang, {user.nama}</p>
        </div>
        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-blue-100 rounded-xl p-4">
            <div className="text-3xl font-bold text-blue-800">{stats?.tempahanAktif || 0}</div>
            <div className="text-sm text-blue-600">Tempahan Aktif</div>
            <div className="text-xs text-blue-500 mt-1">Diluluskan & Pending</div>
          </div>
          <div className="bg-green-100 rounded-xl p-4">
            <div className="text-3xl font-bold text-green-800">{stats?.barangTersedia || 0}</div>
            <div className="text-sm text-green-600">Barang Tersedia</div>
            <div className="text-xs text-green-500 mt-1">Boleh ditempah</div>
          </div>
          <div className="bg-purple-100 rounded-xl p-4">
            <div className="text-3xl font-bold text-purple-800">{stats?.tempahanSelesai || 0}</div>
            <div className="text-sm text-purple-600">Selesai</div>
            <div className="text-xs text-purple-500 mt-1">Tempahan lengkap</div>
          </div>
          <div className="bg-yellow-100 rounded-xl p-4">
            <div className="text-3xl font-bold text-yellow-800">{stats?.tempahanPending || 0}</div>
            <div className="text-sm text-yellow-600">Menunggu</div>
            <div className="text-xs text-yellow-500 mt-1">Perlu kelulusan</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">🚀 Tindakan Pantas</h2>
          <div className="grid grid-cols-2 gap-3">
            <Link href="/user/barang" className="bg-blue-50 hover:bg-blue-100 rounded-lg p-3 text-center transition-colors">
              <div className="text-2xl mb-1">📦</div>
              <div className="text-sm font-medium text-blue-900">Tempah Barang</div>
              <div className="text-xs text-blue-600">Lihat barang tersedia</div>
            </Link>
            <Link href="/user/tempahan" className="bg-green-50 hover:bg-green-100 rounded-lg p-3 text-center transition-colors">
              <div className="text-2xl mb-1">📋</div>
              <div className="text-sm font-medium text-green-900">Tempahan Saya</div>
              <div className="text-xs text-green-600">Lihat status tempahan</div>
            </Link>
            <Link href="/user/sejarah" className="bg-purple-50 hover:bg-purple-100 rounded-lg p-3 text-center transition-colors">
              <div className="text-2xl mb-1">📜</div>
              <div className="text-sm font-medium text-purple-900">Sejarah</div>
              <div className="text-xs text-purple-600">Rekod tempahan</div>
            </Link>
            <Link href="/user/profile" className="bg-orange-50 hover:bg-orange-100 rounded-lg p-3 text-center transition-colors">
              <div className="text-2xl mb-1">👤</div>
              <div className="text-sm font-medium text-orange-900">Profil</div>
              <div className="text-xs text-orange-600">Kemaskini maklumat</div>
            </Link>
          </div>
        </div>
        {/* Bottom Navigation */}
        <div className="fixed bottom-4 left-4 right-4 bg-white rounded-2xl shadow-lg p-3 flex justify-around">
          <Link href="/user/dashboard" className="flex flex-col items-center text-blue-600">
            <div>📊</div><div className="text-xs">Dashboard</div>
          </Link>
          <Link href="/user/barang" className="flex flex-col items-center text-gray-600 hover:text-blue-600">
            <div>📦</div><div className="text-xs">Barang</div>
          </Link>
          <Link href="/user/tempahan" className="flex flex-col items-center text-gray-600 hover:text-blue-600">
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
