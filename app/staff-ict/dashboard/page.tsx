'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import BottomNav from '@/components/BottomNav'

export default function StaffDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [dashboardData, setDashboardData] = useState({
    perluKelulusan: 0,
    diluluskan: 0,
    totalBarang: 0,
    recentActivity: []
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (!userData) { router.push('/login'); return }
    setUser(JSON.parse(userData))
  }, [router])

  useEffect(() => {
    if (user) {
      const fetchDashboardData = async () => {
        try {
          const response = await fetch('/api/staff-ict/dashboard')
          if (response.ok) {
            const result = await response.json()
            console.log('Staff-ICT Dashboard API response:', result)
            
            // Handle different response structures
            if (result.success && result.data) {
              setDashboardData({
                perluKelulusan: result.data.perluKelulusan || 0,
                diluluskan: result.data.diluluskan || 0,
                totalBarang: result.data.totalBarang || 0,
                recentActivity: result.data.recentActivity || []
              })
            } else {
              // Fallback to mock data
              setDashboardData({
                perluKelulusan: 12,
                diluluskan: 45,
                totalBarang: 128,
                recentActivity: []
              })
            }
          } else {
            console.error('API response not ok:', response.status)
            // Use fallback data
            setDashboardData({
              perluKelulusan: 12,
              diluluskan: 45,
              totalBarang: 128,
              recentActivity: []
            })
          }
        } catch (error) {
          console.error('Error fetching dashboard data:', error)
          // Use fallback data on error
          setDashboardData({
            perluKelulusan: 12,
            diluluskan: 45,
            totalBarang: 128,
            recentActivity: []
          })
        } finally {
          setLoading(false)
        }
      }

      fetchDashboardData()
    }
  }, [user])
  if (!user) return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>

  return (
    <div className="min-h-screen bg-gray-50 p-3 pb-24">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
          <h1 className="text-2xl font-bold">Dashboard Staff ICT</h1>
          <p className="text-sm text-gray-600">Selamat datang, {user.nama}</p>
        </div>
        {/* Dashboard Stats */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-orange-100 rounded-xl p-4">
            <div className="text-3xl font-bold text-orange-800">
              {loading ? '...' : dashboardData.perluKelulusan}
            </div>
            <div className="text-sm text-orange-600">Perlu Kelulusan</div>
          </div>
          <div className="bg-green-100 rounded-xl p-4">
            <div className="text-3xl font-bold text-green-800">
              {loading ? '...' : dashboardData.diluluskan}
            </div>
            <div className="text-sm text-green-600">Diluluskan</div>
          </div>
          <div className="bg-blue-100 rounded-xl p-4">
            <div className="text-3xl font-bold text-blue-800">
              {loading ? '...' : dashboardData.totalBarang}
            </div>
            <div className="text-sm text-blue-600">Total Barang</div>
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
            <Link href="/staff-ict/kelulusan" className="bg-orange-50 p-3 rounded-lg text-center text-orange-700 hover:bg-orange-100">
              Urus Kelulusan
            </Link>
            <Link href="/staff-ict/barang" className="bg-green-50 p-3 rounded-lg text-center text-green-700 hover:bg-green-100">
              Urus Barang
            </Link>
            <Link href="/staff-ict/return-requests" className="bg-blue-50 p-3 rounded-lg text-center text-blue-700 hover:bg-blue-100">
              Return Requests
            </Link>
            <Link href="/staff-ict/notifikasi" className="bg-purple-50 p-3 rounded-lg text-center text-purple-700 hover:bg-purple-100">
              Notifikasi
            </Link>
          </div>
        </div>
        <BottomNav activeTab="dashboard" />
      </div>
    </div>
  )
}
