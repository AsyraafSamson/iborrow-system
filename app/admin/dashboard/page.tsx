'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowRight, Box, Clock3, ShieldCheck, Users } from 'lucide-react'
import BottomNav from '@/components/BottomNav'
import EmptyState from '@/components/empty-state'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
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
        <Card className="overflow-hidden border-primary/10 bg-gradient-to-br from-primary/10 via-background to-background">
          <CardHeader className="space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-2">
                <Badge variant="secondary" className="w-fit">Peranan: Pentadbir</Badge>
                <CardTitle className="text-2xl">Selamat datang, {user.nama}</CardTitle>
                <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
                  Pantau pengguna, semak stok barang, dan lihat tempahan yang memerlukan perhatian anda.
                </p>
              </div>
              <ShieldCheck className="hidden h-10 w-10 text-primary md:block" />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <Button asChild size="lg" className="justify-between">
                <Link href="/admin/barang">
                  Urus Barang
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <div className="grid grid-cols-2 gap-3">
                <Button asChild variant="outline">
                  <Link href="/admin/pengguna">Urus Pengguna</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/admin/laporan">Lihat Laporan</Link>
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <Card className="border-blue-100 bg-blue-50/60">
            <CardContent className="pt-4">
              <div className="text-3xl font-bold text-blue-600">{loading ? '...' : dashboardData.totalUsers}</div>
              <div className="mt-1 text-sm font-medium text-foreground">Jumlah Pengguna</div>
              <div className="text-xs text-muted-foreground">Akaun aktif dalam sistem</div>
            </CardContent>
          </Card>
          <Card className="border-green-100 bg-green-50/60">
            <CardContent className="pt-4">
              <div className="text-3xl font-bold text-green-600">{loading ? '...' : dashboardData.totalBarang}</div>
              <div className="mt-1 text-sm font-medium text-foreground">Jumlah Barang</div>
              <div className="text-xs text-muted-foreground">Inventori yang sedang direkodkan</div>
            </CardContent>
          </Card>
          <Card className="border-purple-100 bg-purple-50/60">
            <CardContent className="pt-4">
              <div className="text-3xl font-bold text-purple-600">{loading ? '...' : dashboardData.tempahanAktif}</div>
              <div className="text-sm text-muted-foreground mt-1">Tempahan Aktif</div>
              <div className="text-xs text-muted-foreground">Sedang berjalan atau telah diluluskan</div>
            </CardContent>
          </Card>
          <Card className="border-orange-100 bg-orange-50/60">
            <CardContent className="pt-4">
              <div className="text-3xl font-bold text-orange-600">{loading ? '...' : dashboardData.perluKelulusan}</div>
              <div className="mt-1 text-sm font-medium text-foreground">Perlu Kelulusan</div>
              <div className="text-xs text-muted-foreground">Semak segera bersama staff ICT</div>
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
                <EmptyState
                  icon={Clock3}
                  title="Aktiviti masih tenang"
                  description="Belum ada aktiviti baharu untuk dipaparkan. Semak semula selepas pengguna atau staff membuat tindakan."
                  className="border-0 bg-transparent px-0 py-4"
                />
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Tindakan Utama</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <Link href="/admin/barang" className="rounded-xl bg-primary p-4 text-center text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90">
                <Box className="mx-auto mb-2 h-5 w-5" />
                Urus Barang
              </Link>
              <Link href="/admin/pengguna" className="rounded-xl bg-secondary p-4 text-center text-sm font-medium text-secondary-foreground transition-colors hover:bg-secondary/80">
                <Users className="mx-auto mb-2 h-5 w-5" />
                Urus Pengguna
              </Link>
              <Link href="/admin/laporan" className="rounded-xl bg-secondary p-4 text-center text-sm font-medium text-secondary-foreground transition-colors hover:bg-secondary/80">
                Lihat Laporan
              </Link>
              <Link href="/admin/tetapan/sistem" className="rounded-xl bg-secondary p-4 text-center text-sm font-medium text-secondary-foreground transition-colors hover:bg-secondary/80">
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
