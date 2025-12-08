'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import BottomNav from '@/components/BottomNav'

interface Notification {
  id: string
  jenisAktiviti: string
  keterangan: string
  createdAt: string
}

export default function UserNotifikasi() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (!userData) {
      router.push('/login')
      return
    }
    setUser(JSON.parse(userData))
    fetchNotifications()
  }, [router])

  const fetchNotifications = async () => {
    try {
      const res = await fetch('/api/user/notifikasi')
      const data = await res.json()
      if (data.success) {
        setNotifications(data.data || [])
      }
    } catch (error) {
      console.error('Error fetching notifications:', error)
    } finally {
      setLoading(false)
    }
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'RETURN_UPDATE': return '↩️'
      case 'BOOKING_APPROVED': return '✅'
      case 'BOOKING_REJECTED': return '❌'
      default: return '🔔'
    }
  }

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'RETURN_UPDATE': return 'bg-blue-50 border-blue-200'
      case 'BOOKING_APPROVED': return 'bg-green-50 border-green-200'
      case 'BOOKING_REJECTED': return 'bg-red-50 border-red-200'
      default: return 'bg-gray-50 border-gray-200'
    }
  }

  const isNew = (createdAt: string) => {
    const notifTime = new Date(createdAt).getTime()
    const now = Date.now()
    const hoursDiff = (now - notifTime) / (1000 * 60 * 60)
    return hoursDiff < 24
  }

  if (!user) return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>

  return (
    <div className="min-h-screen bg-gray-50 p-3 pb-24">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
          <h1 className="text-2xl font-bold text-gray-900">🔔 Notifikasi</h1>
          <p className="text-sm text-gray-600">Kemaskini dan makluman untuk anda</p>
        </div>

        {/* Notifications List */}
        <div className="space-y-3">
          {loading ? (
            <div className="bg-white rounded-xl shadow-sm p-8 text-center text-gray-600">
              Loading...
            </div>
          ) : notifications.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm p-8 text-center">
              <div className="text-4xl mb-2">🔔</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Tiada Notifikasi</h3>
              <p className="text-gray-600">Anda tidak mempunyai sebarang notifikasi baharu</p>
            </div>
          ) : (
            notifications.map((notif) => (
              <div
                key={notif.id}
                className={`rounded-xl shadow-sm p-4 border ${getNotificationColor(notif.jenisAktiviti)} ${
                  isNew(notif.createdAt) ? 'border-l-4' : ''
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="text-2xl">{getNotificationIcon(notif.jenisAktiviti)}</div>
                  <div className="flex-1">
                    <p className="text-gray-900">{notif.keterangan}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs text-gray-500">
                        {new Date(notif.createdAt).toLocaleString('ms-MY')}
                      </span>
                      {isNew(notif.createdAt) && (
                        <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                          BARU
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Bottom Nav */}
        <BottomNav activeTab="notifikasi" />
      </div>
    </div>
  )
}
