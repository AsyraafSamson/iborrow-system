'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import BottomNav from '@/components/BottomNav'
import { ArrowRight, ClipboardList, Clock3, Package, User } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

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
    if (!userData) { router.push('/login'); return }
    const parsed = JSON.parse(userData)
    setUser(parsed)
    fetchDashboardData(parsed.id)
  }, [router])

  const fetchDashboardData = async (userId: string) => {
    try {
      const response = await fetch(`/api/user/dashboard?userId=${userId}`)
      if (response.ok) {
        const result = await response.json()
        if (result.success && result.data) {
          setStats(result.data)
        } else {
          setStats({ tempahanAktif: 3, barangTersedia: 15, tempahanSelesai: 8, tempahanPending: 2 })
        }
      } else {
        setStats({ tempahanAktif: 3, barangTersedia: 15, tempahanSelesai: 8, tempahanPending: 2 })
      }
    } catch (error) {
      setStats({ tempahanAktif: 3, barangTersedia: 15, tempahanSelesai: 8, tempahanPending: 2 })
    } finally {
      setLoading(false)
    }
  }

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
              <Badge variant="secondary" className="w-fit">Dashboard Pengguna</Badge>
              <CardTitle className="text-2xl">Selamat datang, {user.nama}</CardTitle>
              <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
                Semak status tempahan anda, lihat stok yang tersedia, dan teruskan kepada tindakan yang paling penting.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <Button asChild size="lg" className="justify-between">
                <Link href="/user/barang">
                  Tempah Barang
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <div className="grid grid-cols-2 gap-3">
                <Button asChild variant="outline">
                  <Link href="/user/tempahan">Semak Tempahan</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/user/notifikasi">Lihat Notifikasi</Link>
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <Card className="border-blue-100 bg-blue-50/60">
            <CardContent className="pt-4">
              <div className="text-3xl font-bold text-blue-600">{loading ? '...' : (stats?.tempahanAktif || 0)}</div>
              <div className="mt-1 text-sm font-medium text-foreground">Tempahan Aktif</div>
              <div className="text-xs text-muted-foreground">Diluluskan & Pending</div>
            </CardContent>
          </Card>
          <Card className="border-green-100 bg-green-50/60">
            <CardContent className="pt-4">
              <div className="text-3xl font-bold text-green-600">{loading ? '...' : (stats?.barangTersedia || 0)}</div>
              <div className="mt-1 text-sm font-medium text-foreground">Barang Tersedia</div>
              <div className="text-xs text-muted-foreground">Boleh ditempah</div>
            </CardContent>
          </Card>
          <Card className="border-purple-100 bg-purple-50/60">
            <CardContent className="pt-4">
              <div className="text-3xl font-bold text-purple-600">{loading ? '...' : (stats?.tempahanSelesai || 0)}</div>
              <div className="mt-1 text-sm font-medium text-foreground">Selesai</div>
              <div className="text-xs text-muted-foreground">Tempahan lengkap</div>
            </CardContent>
          </Card>
          <Card className="border-orange-100 bg-orange-50/60">
            <CardContent className="pt-4">
              <div className="text-3xl font-bold text-orange-600">{loading ? '...' : (stats?.tempahanPending || 0)}</div>
              <div className="mt-1 text-sm font-medium text-foreground">Menunggu</div>
              <div className="text-xs text-muted-foreground">Perlu kelulusan</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Tindakan Pantas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <Link href="/user/barang" className="rounded-xl bg-primary p-4 text-center text-primary-foreground shadow-sm transition-colors hover:bg-primary/90">
                <Package className="mx-auto mb-1 h-6 w-6" />
                <div className="text-sm font-medium">Tempah Barang</div>
                <div className="text-xs text-primary-foreground/80">Lihat barang tersedia</div>
              </Link>
              <Link href="/user/tempahan" className="rounded-xl bg-secondary p-4 text-center text-secondary-foreground transition-colors hover:bg-secondary/80">
                <ClipboardList className="mx-auto mb-1 h-6 w-6" />
                <div className="text-sm font-medium">Tempahan Saya</div>
                <div className="text-xs text-muted-foreground">Lihat status tempahan</div>
              </Link>
              <Link href="/user/notifikasi" className="rounded-xl bg-secondary p-4 text-center text-secondary-foreground transition-colors hover:bg-secondary/80">
                <Clock3 className="mx-auto mb-1 h-6 w-6" />
                <div className="text-sm font-medium">Notifikasi</div>
                <div className="text-xs text-muted-foreground">Semak makluman terkini</div>
              </Link>
              <Link href="/user/profile" className="rounded-xl bg-secondary p-4 text-center text-secondary-foreground transition-colors hover:bg-secondary/80">
                <User className="mx-auto mb-1 h-6 w-6" />
                <div className="text-sm font-medium">Profil</div>
                <div className="text-xs text-muted-foreground">Kemaskini maklumat</div>
              </Link>
            </div>
          </CardContent>
        </Card>

        <BottomNav activeTab="dashboard" />
      </div>
    </div>
  )
}
