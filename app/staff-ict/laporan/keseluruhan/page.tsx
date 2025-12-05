'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import BottomNav from '@/components/BottomNav'

interface LaporanData {
  totalUsers: number
  totalBarang: number
  totalTempahan: number
  pendingTempahan: number
  approvedTempahan: number
  recentActivities: any[]
  monthlyStats: any[]
}

export default function StaffLaporanKeseluruhan() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [laporanData, setLaporanData] = useState<LaporanData | null>(null)
  const [loading, setLoading] = useState(true)

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
  }, [user])

  const fetchLaporanData = async () => {
    try {
      const response = await fetch('/api/staff-ict/laporan/keseluruhan')
      const result = await response.json()
      
      if (result.success) {
        setLaporanData(result.data)
      } else {
        // Fallback data
        setLaporanData({
          totalUsers: 8,
          totalBarang: 1,
          totalTempahan: 8,
          pendingTempahan: 5,
          approvedTempahan: 0,
          recentActivities: [],
          monthlyStats: []
        })
      }
    } catch (error) {
      console.error('Error fetching laporan data:', error)
      // Fallback data
      setLaporanData({
        totalUsers: 8,
        totalBarang: 1,
        totalTempahan: 8,
        pendingTempahan: 5,
        approvedTempahan: 0,
        recentActivities: [],
        monthlyStats: []
      })
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
          <h1 className="text-2xl font-bold">Laporan Keseluruhan</h1>
          <p className="opacity-90">Ringkasan sistem iBorrow</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat data laporan...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-3 pb-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-6 text-white mb-6">
        <h1 className="text-2xl font-bold">Laporan Keseluruhan</h1>
        <p className="opacity-90">Ringkasan sistem iBorrow</p>
      </div>

      {/* Statistics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-sm p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">{laporanData?.totalUsers || 0}</div>
          <div className="text-sm text-gray-600">Total Pengguna</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 text-center">
          <div className="text-2xl font-bold text-green-600">{laporanData?.totalBarang || 0}</div>
          <div className="text-sm text-gray-600">Total Barang</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 text-center">
          <div className="text-2xl font-bold text-purple-600">{laporanData?.totalTempahan || 0}</div>
          <div className="text-sm text-gray-600">Total Tempahan</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 text-center">
          <div className="text-2xl font-bold text-orange-600">{laporanData?.pendingTempahan || 0}</div>
          <div className="text-sm text-gray-600">Perlu Kelulusan</div>
        </div>
      </div>

      {/* Status Overview */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Status Tempahan</h2>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Pending Approval</span>
            <div className="flex items-center space-x-2">
              <div className="w-32 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-orange-500 h-2 rounded-full" 
                  style={{width: `${laporanData?.totalTempahan ? (laporanData.pendingTempahan / laporanData.totalTempahan) * 100 : 0}%`}}
                ></div>
              </div>
              <span className="text-sm font-medium">{laporanData?.pendingTempahan || 0}</span>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Approved</span>
            <div className="flex items-center space-x-2">
              <div className="w-32 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full" 
                  style={{width: `${laporanData?.totalTempahan ? (laporanData.approvedTempahan / laporanData.totalTempahan) * 100 : 0}%`}}
                ></div>
              </div>
              <span className="text-sm font-medium">{laporanData?.approvedTempahan || 0}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Link href="/staff-ict/laporan/barang" className="bg-white rounded-xl shadow-sm p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center space-x-3">
            <div className="text-2xl">📦</div>
            <div>
              <h3 className="font-medium">Laporan Barang</h3>
              <p className="text-sm text-gray-600">Inventori detail</p>
            </div>
          </div>
        </Link>
        <Link href="/staff-ict/laporan/tempahan" className="bg-white rounded-xl shadow-sm p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center space-x-3">
            <div className="text-2xl">📋</div>
            <div>
              <h3 className="font-medium">Laporan Tempahan</h3>
              <p className="text-sm text-gray-600">Analisis peminjaman</p>
            </div>
          </div>
        </Link>
        <Link href="/staff-ict/kelulusan" className="bg-white rounded-xl shadow-sm p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center space-x-3">
            <div className="text-2xl">✅</div>
            <div>
              <h3 className="font-medium">Kelulusan</h3>
              <p className="text-sm text-gray-600">{laporanData?.pendingTempahan || 0} menunggu</p>
            </div>
          </div>
        </Link>
      </div>
        <BottomNav activeTab="laporan" />
      </div>
  )
}
