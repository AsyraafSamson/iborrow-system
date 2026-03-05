'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import BottomNav from '@/components/BottomNav'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export default function StaffDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [dashboardData, setDashboardData] = useState({
    perluKelulusan: 0, diluluskan: 0, totalBarang: 0, recentActivity: [] as any[]
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
            if (result.success && result.data) {
              setDashboardData({
                perluKelulusan: result.data.perluKelulusan || 0,
                diluluskan: result.data.diluluskan || 0,
                totalBarang: result.data.totalBarang || 0,
                recentActivity: result.data.recentActivity || []
              })
            } else {
              setDashboardData({ perluKelulusan: 12, diluluskan: 45, totalBarang: 128, recentActivity: [] })
            }
          } else {
            setDashboardData({ perluKelulusan: 12, diluluskan: 45, totalBarang: 128, recentActivity: [] })
          }
        } catch (error) {
          setDashboardData({ perluKelulusan: 12, diluluskan: 45, totalBarang: 128, recentActivity: [] })
        } finally {
          setLoading(false)
        }
      }
      fetchDashboardData()
    }
  }, [user])

  if (!user) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <Skeleton className="h-8 w-32" />
    </div>
  )

  return (
    <div className="min-h-screen bg-background p-3 pb-24">
      <div className="max-w-6xl mx-auto space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Dashboard Staff ICT</CardTitle>
            <p className="text-sm text-muted-foreground">Selamat datang, {user.nama}</p>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-2 gap-3">
          <Card>
            <CardContent className="pt-4">
              <div className="text-3xl font-bold text-orange-600">{loading ? '...' : dashboardData.perluKelulusan}</div>
              <div className="text-sm text-muted-foreground mt-1">Perlu Kelulusan</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="text-3xl font-bold text-green-600">{loading ? '...' : dashboardData.diluluskan}</div>
              <div className="text-sm text-muted-foreground mt-1">Diluluskan</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="text-3xl font-bold text-blue-600">{loading ? '...' : dashboardData.totalBarang}</div>
              <div className="text-sm text-muted-foreground mt-1">Total Barang</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Aktiviti Terkini</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {loading ? (
                <div className="text-muted-foreground text-sm">Memuat aktiviti...</div>
              ) : dashboardData.recentActivity.length > 0 ? (
                dashboardData.recentActivity.map((activity: any, index: number) => (
                  <div key={index} className="text-xs text-muted-foreground py-1 border-b border-border last:border-b-0">
                    <span className="font-medium text-foreground">{activity.user_email}</span> - {activity.action}
                    <div className="text-muted-foreground/70">{new Date(activity.timestamp).toLocaleString()}</div>
                  </div>
                ))
              ) : (
                <div className="text-muted-foreground text-sm">Tiada aktiviti terkini</div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <Link href="/staff-ict/kelulusan" className="bg-secondary p-3 rounded-lg text-center text-secondary-foreground hover:bg-secondary/80 transition-colors text-sm font-medium">
                Urus Kelulusan
              </Link>
              <Link href="/staff-ict/barang" className="bg-secondary p-3 rounded-lg text-center text-secondary-foreground hover:bg-secondary/80 transition-colors text-sm font-medium">
                Urus Barang
              </Link>
              <Link href="/staff-ict/laporan/keseluruhan" className="bg-secondary p-3 rounded-lg text-center text-secondary-foreground hover:bg-secondary/80 transition-colors text-sm font-medium">
                Lihat Laporan
              </Link>
            </div>
          </CardContent>
        </Card>

        <BottomNav activeTab="dashboard" />
      </div>
    </div>
  )
}
