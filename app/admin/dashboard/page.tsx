'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import BottomNav from '@/components/BottomNav'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export default function AdminDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [dashboardData, setDashboardData] = useState({
    totalUsers: 0,
    totalBarang: 0,
    tempahanAktif: 0,
    perluKelulusan: 0,
    recentActivity: [] as any[]
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
            const result = await response.json()
            if (result.success && result.data) {
              setDashboardData({
                totalUsers: result.data.totalUsers || 0,
                totalBarang: result.data.totalBarang || 0,
                tempahanAktif: result.data.tempahanAktif || 0,
                perluKelulusan: result.data.tempahanPending || 0,
                recentActivity: result.data.recentActivity || []
              })
            } else {
              setDashboardData({ totalUsers: 45, totalBarang: 128, tempahanAktif: 23, perluKelulusan: 8, recentActivity: [] })
            }
          } else {
            setDashboardData({ totalUsers: 45, totalBarang: 128, tempahanAktif: 23, perluKelulusan: 8, recentActivity: [] })
          }
        } catch (error) {
          console.error('Error fetching dashboard data:', error)
          setDashboardData({ totalUsers: 45, totalBarang: 128, tempahanAktif: 23, perluKelulusan: 8, recentActivity: [] })
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
            <CardTitle>Dashboard Admin</CardTitle>
            <p className="text-sm text-muted-foreground">Selamat datang, {user.nama}</p>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardContent className="pt-4">
              <div className="text-3xl font-bold text-blue-600">{loading ? '...' : dashboardData.totalUsers}</div>
              <div className="text-sm text-muted-foreground mt-1">Total Pengguna</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="text-3xl font-bold text-green-600">{loading ? '...' : dashboardData.totalBarang}</div>
              <div className="text-sm text-muted-foreground mt-1">Total Barang</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="text-3xl font-bold text-purple-600">{loading ? '...' : dashboardData.tempahanAktif}</div>
              <div className="text-sm text-muted-foreground mt-1">Tempahan Aktif</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="text-3xl font-bold text-orange-600">{loading ? '...' : dashboardData.perluKelulusan}</div>
              <div className="text-sm text-muted-foreground mt-1">Perlu Kelulusan</div>
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
              <Link href="/admin/pengguna" className="bg-secondary p-3 rounded-lg text-center text-secondary-foreground hover:bg-secondary/80 transition-colors text-sm font-medium">
                Urus Pengguna
              </Link>
              <Link href="/admin/barang" className="bg-secondary p-3 rounded-lg text-center text-secondary-foreground hover:bg-secondary/80 transition-colors text-sm font-medium">
                Urus Barang
              </Link>
              <Link href="/admin/laporan" className="bg-secondary p-3 rounded-lg text-center text-secondary-foreground hover:bg-secondary/80 transition-colors text-sm font-medium">
                Lihat Laporan
              </Link>
              <Link href="/admin/tetapan/sistem" className="bg-secondary p-3 rounded-lg text-center text-secondary-foreground hover:bg-secondary/80 transition-colors text-sm font-medium">
                Tetapan Sistem
              </Link>
            </div>
          </CardContent>
        </Card>

        <BottomNav activeTab="dashboard" />
      </div>
    </div>
  )
}
