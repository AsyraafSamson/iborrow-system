'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import BottomNav from '@/components/BottomNav'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { FileBarChart, CheckCircle, Clock, XCircle, Package } from 'lucide-react'

interface LaporanData {
  ringkasan: {
    totalTempahan: number
    tempahanPending: number
    tempahanDiluluskan: number
    tempahanSelesai: number
    tempahanDitolak: number
  }
  tempahanBulan: { bulan: string; jumlah: number }[]
  topBarang: { namaBarang: string; kategori: string; jumlahTempahan: number }[]
  barangMengikutKategori: { kategori: string; jumlah: number }[]
}

export default function AdminLaporan() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [data, setData] = useState<LaporanData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (!userData) { router.push('/login'); return }
    setUser(JSON.parse(userData))
  }, [router])

  useEffect(() => {
    if (!user) return
    const fetchLaporan = async () => {
      try {
        const res = await fetch('/api/admin/laporan')
        if (res.ok) {
          const result = await res.json()
          if (result.success) setData(result.data)
        }
      } catch (error) {
        console.error('Error fetching laporan:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchLaporan()
  }, [user])

  if (!user) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <Skeleton className="h-8 w-32" />
    </div>
  )

  const maxBulan = data ? Math.max(...data.tempahanBulan.map(b => b.jumlah), 1) : 1

  return (
    <div className="min-h-screen bg-background p-3 pb-24">
      <div className="max-w-6xl mx-auto space-y-4">

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileBarChart className="size-5" />
              Laporan Sistem
            </CardTitle>
            <p className="text-sm text-muted-foreground">Ringkasan aktiviti dan statistik sistem</p>
          </CardHeader>
        </Card>

        {/* Ringkasan Stats */}
        <div className="grid grid-cols-2 gap-3">
          <Card>
            <CardContent className="pt-4">
              {loading ? <Skeleton className="h-8 w-16" /> : (
                <div className="text-3xl font-bold text-blue-600">{data?.ringkasan.totalTempahan ?? 0}</div>
              )}
              <div className="text-sm text-muted-foreground mt-1">Jumlah Tempahan</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              {loading ? <Skeleton className="h-8 w-16" /> : (
                <div className="text-3xl font-bold text-orange-500">{data?.ringkasan.tempahanPending ?? 0}</div>
              )}
              <div className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
                <Clock className="size-3" /> Pending
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              {loading ? <Skeleton className="h-8 w-16" /> : (
                <div className="text-3xl font-bold text-green-600">{data?.ringkasan.tempahanSelesai ?? 0}</div>
              )}
              <div className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
                <CheckCircle className="size-3" /> Selesai
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              {loading ? <Skeleton className="h-8 w-16" /> : (
                <div className="text-3xl font-bold text-red-500">{data?.ringkasan.tempahanDitolak ?? 0}</div>
              )}
              <div className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
                <XCircle className="size-3" /> Ditolak
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tempahan Mengikut Bulan */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Tempahan Mengikut Bulan</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-2">
                {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-6 w-full" />)}
              </div>
            ) : data?.tempahanBulan.length ? (
              <div className="space-y-2">
                {[...data.tempahanBulan].reverse().map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground w-16 shrink-0">{item.bulan}</span>
                    <div className="flex-1 bg-secondary rounded-full h-5 overflow-hidden">
                      <div
                        className="bg-primary h-full rounded-full transition-all"
                        style={{ width: `${(item.jumlah / maxBulan) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs font-medium w-6 text-right">{item.jumlah}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Tiada data</p>
            )}
          </CardContent>
        </Card>

        {/* Top 5 Barang */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Package className="size-4" />
              Top 5 Barang Paling Banyak Dipinjam
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-2">
                {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}
              </div>
            ) : data?.topBarang.length ? (
              <div className="space-y-2">
                {data.topBarang.map((item, i) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b border-border last:border-b-0">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-bold text-muted-foreground w-5">{i + 1}.</span>
                      <div>
                        <div className="text-sm font-medium">{item.namaBarang}</div>
                        <Badge variant="outline" className="text-xs mt-0.5">{item.kategori}</Badge>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-lg font-bold text-primary">{item.jumlahTempahan}</div>
                      <div className="text-xs text-muted-foreground">tempahan</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Tiada data</p>
            )}
          </CardContent>
        </Card>

        {/* Barang Mengikut Kategori */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Barang Mengikut Kategori</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-2">
                {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-6 w-full" />)}
              </div>
            ) : data?.barangMengikutKategori.length ? (
              <div className="space-y-2">
                {data.barangMengikutKategori.map((item, i) => {
                  const maxKat = Math.max(...(data?.barangMengikutKategori.map(k => k.jumlah) ?? [1]))
                  return (
                    <div key={i} className="flex items-center gap-3">
                      <span className="text-xs text-muted-foreground w-24 shrink-0">{item.kategori}</span>
                      <div className="flex-1 bg-secondary rounded-full h-5 overflow-hidden">
                        <div
                          className="bg-blue-500 h-full rounded-full transition-all"
                          style={{ width: `${(item.jumlah / maxKat) * 100}%` }}
                        />
                      </div>
                      <span className="text-xs font-medium w-6 text-right">{item.jumlah}</span>
                    </div>
                  )
                })}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Tiada data</p>
            )}
          </CardContent>
        </Card>

        <BottomNav activeTab="dashboard" />
      </div>
    </div>
  )
}
