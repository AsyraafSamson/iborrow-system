'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowRight, BellRing, Boxes, CheckSquare, Clock3 } from 'lucide-react'
import BottomNav from '@/components/BottomNav'
import EmptyState from '@/components/empty-state'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
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
        <Card className="overflow-hidden border-primary/10 bg-gradient-to-br from-primary/10 via-background to-background">
          <CardHeader className="space-y-4">
            <div className="space-y-2">
              <Badge variant="secondary" className="w-fit">Peranan: Staff ICT</Badge>
              <CardTitle className="text-2xl">Selamat datang, {user.nama}</CardTitle>
              <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
                Utamakan kelulusan tempahan, pantau permohonan pemulangan, dan pastikan stok sentiasa terkini.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <Button asChild size="lg" className="justify-between">
                <Link href="/staff-ict/kelulusan">
                  Luluskan Tempahan
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <div className="grid grid-cols-2 gap-3">
                <Button asChild variant="outline">
                  <Link href="/staff-ict/return-requests">Semak Pemulangan</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/staff-ict/barang">Urus Barang</Link>
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <Card className="border-orange-100 bg-orange-50/60">
            <CardContent className="pt-4">
              <div className="text-3xl font-bold text-orange-600">{loading ? '...' : dashboardData.perluKelulusan}</div>
              <div className="mt-1 text-sm font-medium text-foreground">Perlu Kelulusan</div>
              <div className="text-xs text-muted-foreground">Permohonan yang menunggu tindakan anda</div>
            </CardContent>
          </Card>
          <Card className="border-green-100 bg-green-50/60">
            <CardContent className="pt-4">
              <div className="text-3xl font-bold text-green-600">{loading ? '...' : dashboardData.diluluskan}</div>
              <div className="mt-1 text-sm font-medium text-foreground">Telah Diluluskan</div>
              <div className="text-xs text-muted-foreground">Tempahan yang berjaya diproses</div>
            </CardContent>
          </Card>
          <Card className="border-blue-100 bg-blue-50/60">
            <CardContent className="pt-4">
              <div className="text-3xl font-bold text-blue-600">{loading ? '...' : dashboardData.totalBarang}</div>
              <div className="mt-1 text-sm font-medium text-foreground">Jumlah Barang</div>
              <div className="text-xs text-muted-foreground">Stok yang sedang diuruskan</div>
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
                  title="Belum ada aktiviti baharu"
                  description="Apabila ada tempahan atau pemulangan baharu, ringkasannya akan muncul di sini."
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
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <Link href="/staff-ict/kelulusan" className="rounded-xl bg-primary p-4 text-center text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90">
                <CheckSquare className="mx-auto mb-2 h-5 w-5" />
                Luluskan Tempahan
              </Link>
              <Link href="/staff-ict/return-requests" className="rounded-xl bg-secondary p-4 text-center text-sm font-medium text-secondary-foreground transition-colors hover:bg-secondary/80">
                <BellRing className="mx-auto mb-2 h-5 w-5" />
                Urus Pemulangan
              </Link>
              <Link href="/staff-ict/barang" className="rounded-xl bg-secondary p-4 text-center text-sm font-medium text-secondary-foreground transition-colors hover:bg-secondary/80">
                <Boxes className="mx-auto mb-2 h-5 w-5" />
                Urus Barang
              </Link>
            </div>
          </CardContent>
        </Card>

        <BottomNav activeTab="dashboard" />
      </div>
    </div>
  )
}
