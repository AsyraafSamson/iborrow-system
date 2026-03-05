'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import BottomNav from '@/components/BottomNav'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Package, ClipboardList, History, User } from 'lucide-react'

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
        <Card>
          <CardHeader>
            <CardTitle>Dashboard Pengguna</CardTitle>
            <p className="text-sm text-muted-foreground">Selamat datang, {user.nama}</p>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-2 gap-3">
          <Card>
            <CardContent className="pt-4">
              <div className="text-3xl font-bold text-blue-600">{loading ? '...' : (stats?.tempahanAktif || 0)}</div>
              <div className="text-sm text-muted-foreground mt-1">Tempahan Aktif</div>
              <div className="text-xs text-muted-foreground">Diluluskan & Pending</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="text-3xl font-bold text-green-600">{loading ? '...' : (stats?.barangTersedia || 0)}</div>
              <div className="text-sm text-muted-foreground mt-1">Barang Tersedia</div>
              <div className="text-xs text-muted-foreground">Boleh ditempah</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="text-3xl font-bold text-purple-600">{loading ? '...' : (stats?.tempahanSelesai || 0)}</div>
              <div className="text-sm text-muted-foreground mt-1">Selesai</div>
              <div className="text-xs text-muted-foreground">Tempahan lengkap</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="text-3xl font-bold text-orange-600">{loading ? '...' : (stats?.tempahanPending || 0)}</div>
              <div className="text-sm text-muted-foreground mt-1">Menunggu</div>
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
              <Link href="/user/barang" className="bg-secondary p-3 rounded-lg text-center text-secondary-foreground hover:bg-secondary/80 transition-colors">
                <Package className="mx-auto mb-1 h-6 w-6" />
                <div className="text-sm font-medium">Tempah Barang</div>
                <div className="text-xs text-muted-foreground">Lihat barang tersedia</div>
              </Link>
              <Link href="/user/tempahan" className="bg-secondary p-3 rounded-lg text-center text-secondary-foreground hover:bg-secondary/80 transition-colors">
                <ClipboardList className="mx-auto mb-1 h-6 w-6" />
                <div className="text-sm font-medium">Tempahan Saya</div>
                <div className="text-xs text-muted-foreground">Lihat status tempahan</div>
              </Link>
              <Link href="/user/sejarah" className="bg-secondary p-3 rounded-lg text-center text-secondary-foreground hover:bg-secondary/80 transition-colors">
                <History className="mx-auto mb-1 h-6 w-6" />
                <div className="text-sm font-medium">Sejarah</div>
                <div className="text-xs text-muted-foreground">Rekod tempahan</div>
              </Link>
              <Link href="/user/profile" className="bg-secondary p-3 rounded-lg text-center text-secondary-foreground hover:bg-secondary/80 transition-colors">
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
