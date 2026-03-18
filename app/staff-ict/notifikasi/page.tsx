'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import BottomNav from '@/components/BottomNav'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { RotateCcw, CheckSquare, Bell } from 'lucide-react'

interface Notification {
  id: string
  jenisAktiviti: string
  keterangan: string
  createdAt: string
  isRead: number
}

const getNotificationColor = (type: string) => {
  if (type === 'RETURN_NOTIFICATION') return 'border-blue-200 bg-blue-50/50 dark:bg-blue-950/20'
  if (type === 'BOOKING_REQUEST') return 'border-orange-200 bg-orange-50/50 dark:bg-orange-950/20'
  return 'border-border'
}

const getActionLink = (type: string) => {
  if (type === 'RETURN_NOTIFICATION') return { href: '/staff-ict/return-requests', text: 'Lihat Permohonan' }
  if (type === 'BOOKING_REQUEST') return { href: '/staff-ict/kelulusan', text: 'Semak Tempahan' }
  return null
}

export default function StaffNotifikasi() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (!userData) { router.push('/login'); return }
    setUser(JSON.parse(userData))
    fetchNotifications()
    localStorage.setItem('notificationLastViewedAt', new Date().toISOString())
  }, [router])

  const fetchNotifications = async () => {
    try {
      const lastViewedAt = localStorage.getItem('notificationLastViewedAt') || ''
      const url = lastViewedAt
        ? `/api/staff-ict/notifikasi?lastViewedAt=${encodeURIComponent(lastViewedAt)}`
        : '/api/staff-ict/notifikasi'
      const res = await fetch(url)
      const data = await res.json()
      if (data.success) setNotifications(data.data || [])
    } catch (error) {
      console.error('Error fetching notifications:', error)
    } finally {
      setLoading(false)
    }
  }

  const markAllAsRead = async () => {
    try {
      const res = await fetch('/api/staff-ict/notifikasi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ markAllAsRead: true })
      })
      if (res.ok) fetchNotifications()
    } catch (error) {
      console.error('Error marking all as read:', error)
    }
  }

  if (!user) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <Skeleton className="h-8 w-32" />
    </div>
  )

  return (
    <div className="min-h-screen bg-background p-3 pb-24">
      <div className="max-w-4xl mx-auto space-y-4">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>Notifikasi Staff</CardTitle>
                <p className="text-sm text-muted-foreground">Permohonan dan makluman yang memerlukan tindakan</p>
              </div>
              {notifications.some((n: any) => n.isNew) && (
                <Button size="sm" onClick={markAllAsRead}>Tandakan Semua Dibaca</Button>
              )}
            </div>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-2 gap-3">
          <Link href="/staff-ict/return-requests" className="bg-primary text-primary-foreground rounded-xl p-4 text-center hover:bg-primary/90 transition-colors">
            <RotateCcw className="mx-auto mb-2 h-6 w-6" />
            <div className="text-sm font-medium">Permohonan Pemulangan</div>
          </Link>
          <Link href="/staff-ict/kelulusan" className="bg-secondary text-secondary-foreground rounded-xl p-4 text-center hover:bg-secondary/80 transition-colors">
            <CheckSquare className="mx-auto mb-2 h-6 w-6" />
            <div className="text-sm font-medium">Kelulusan Tempahan</div>
          </Link>
        </div>

        <div className="space-y-3">
          {loading ? (
            <Card><CardContent className="p-8 text-center text-muted-foreground">Sedang memuatkan notifikasi semasa...</CardContent></Card>
          ) : notifications.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Bell className="mx-auto mb-2 h-10 w-10 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-1">Tiada Notifikasi</h3>
                <p className="text-sm text-muted-foreground">Tiada permohonan atau makluman baharu pada masa ini</p>
              </CardContent>
            </Card>
          ) : (
            notifications.map((notif: any) => {
              const action = getActionLink(notif.jenisAktiviti)
              return (
                <Card key={notif.id} className={`border ${getNotificationColor(notif.jenisAktiviti)} ${notif.isNew ? 'border-l-4 border-l-primary' : 'opacity-60'}`}>
                  <CardContent className="pt-4">
                    <div className="flex-1">
                      <p className={notif.isNew ? 'font-semibold text-foreground' : 'text-muted-foreground'}>
                        {notif.keterangan}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs text-muted-foreground">
                          {new Date(notif.createdAt).toLocaleString('ms-MY')}
                        </span>
                        {notif.isNew && (
                          <Badge variant="destructive" className="text-xs">BELUM DIBACA</Badge>
                        )}
                      </div>
                      {action && (
                        <Link href={action.href} className="inline-block mt-2">
                          <Button size="sm" variant="outline" className="h-7 text-xs">{action.text} →</Button>
                        </Link>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )
            })
          )}
        </div>

        <BottomNav activeTab="notifikasi" />
      </div>
    </div>
  )
}
