'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import BottomNav from '@/components/BottomNav'

interface SummaryStats {
  tempahanBulanIni: number
  kadarKelulusan: number
  penggunaAktifHariIni: number
  barangTersediaPercent: number
}

export default function AdminLaporan() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [stats, setStats] = useState<SummaryStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (!userData) { router.push('/login'); return }
    setUser(JSON.parse(userData))
  }, [router])

  useEffect(() => {
    if (user) {
      fetchStats()
    }
  }, [user])

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/laporan?type=summary')
      const result = await response.json()
      if (result.success) {
        setStats(result.data)
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!user) return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>

  return (
    <div className="min-h-screen bg-gray-50 p-3 pb-24">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
          <h1 className="text-2xl font-bold text-gray-900">Laporan Sistem</h1>
          <p className="text-sm text-gray-600">Lihat laporan keseluruhan sistem peminjaman</p>
        </div>

        {/* Reports Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <Link href="/admin/laporan/pengguna" className="bg-white rounded-xl shadow-sm p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-100 p-3 rounded-lg">
                <div className="text-2xl">👥</div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Laporan Pengguna</h3>
                <p className="text-sm text-gray-600">Statistik dan aktiviti pengguna</p>
              </div>
            </div>
          </Link>

          <Link href="/admin/laporan/barang" className="bg-white rounded-xl shadow-sm p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center space-x-3">
              <div className="bg-green-100 p-3 rounded-lg">
                <div className="text-2xl">📦</div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Laporan Barang</h3>
                <p className="text-sm text-gray-600">Inventori dan penggunaan barang</p>
              </div>
            </div>
          </Link>

          <Link href="/admin/laporan/tempahan" className="bg-white rounded-xl shadow-sm p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center space-x-3">
              <div className="bg-purple-100 p-3 rounded-lg">
                <div className="text-2xl">📋</div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Laporan Tempahan</h3>
                <p className="text-sm text-gray-600">Trend dan status peminjaman</p>
              </div>
            </div>
          </Link>

          <Link href="/admin/laporan/aktiviti" className="bg-white rounded-xl shadow-sm p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center space-x-3">
              <div className="bg-orange-100 p-3 rounded-lg">
                <div className="text-2xl">📈</div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Log Aktiviti</h3>
                <p className="text-sm text-gray-600">Audit trail sistem</p>
              </div>
            </div>
          </Link>
        </div>

        {/* Quick Stats */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
          <h2 className="text-lg font-bold text-gray-900 mb-3">Ringkasan Statistik</h2>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-sm text-gray-600">Memuat statistik...</p>
            </div>
          ) : stats ? (
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{stats.tempahanBulanIni}</div>
                <div className="text-xs text-gray-600">Total Tempahan Bulan Ini</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{stats.kadarKelulusan}%</div>
                <div className="text-xs text-gray-600">Kadar Kelulusan</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{stats.penggunaAktifHariIni}</div>
                <div className="text-xs text-gray-600">Pengguna Aktif Hari Ini</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{stats.barangTersediaPercent}%</div>
                <div className="text-xs text-gray-600">Barang Tersedia</div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-600">
              Gagal memuat statistik
            </div>
          )}
        </div>
        <BottomNav activeTab="laporan" />
      </div>
    </div>
  )
}
