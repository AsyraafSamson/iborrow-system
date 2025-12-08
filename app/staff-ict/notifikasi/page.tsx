'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import BottomNav from '@/components/BottomNav'

interface Notification {
  id: string
  jenisAktiviti: string
  keterangan: string
  createdAt: string
  isRead: number
}

export default function StaffNotifikasi() {
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
      const res = await fetch('/api/staff-ict/notifikasi')
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

  const markAllAsRead = async () => {
    try {
      const res = await fetch('/api/staff-ict/notifikasi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ markAllAsRead: true })
      })
      if (res.ok) {
        // Refresh notifications
        fetchNotifications()
      }
    } catch (error) {
      console.error('Error marking all as read:', error)
    }
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'RETURN_NOTIFICATION': return '↩️'
      case 'BOOKING_REQUEST': return '📋'
      default: return '🔔'
    }
  }

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'RETURN_NOTIFICATION': return 'bg-blue-50 border-blue-200'
      case 'BOOKING_REQUEST': return 'bg-orange-50 border-orange-200'
      default: return 'bg-gray-50 border-gray-200'
    }
  }

  const getActionLink = (type: string, keterangan: string) => {
    if (type === 'RETURN_NOTIFICATION') {
      return { href: '/staff-ict/return-requests', text: 'Lihat Permohonan' }
    } else if (type === 'BOOKING_REQUEST') {
      return { href: '/staff-ict/kelulusan', text: 'Semak Tempahan' }
    }
    return null
  }

  if (!user) return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>

  return (
    <div className="min-h-screen bg-gray-50 p-3 pb-24">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">🔔 Notifikasi Staff</h1>
              <p className="text-sm text-gray-600">Permohonan dan makluman yang memerlukan tindakan</p>
            </div>
            {notifications.some(n => n.isRead === 0) && (
              <button
                onClick={markAllAsRead}
                className="bg-blue-500 text-white text-sm px-3 py-2 rounded-lg hover:bg-blue-600"
              >
                Tandakan Semua Dibaca
              </button>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <Link
            href="/staff-ict/return-requests"
            className="bg-blue-500 text-white rounded-xl p-4 text-center hover:bg-blue-600 transition"
          >
            <div className="text-2xl mb-1">↩️</div>
            <div className="text-sm font-medium">Permohonan Pemulangan</div>
          </Link>
          <Link
            href="/staff-ict/kelulusan"
            className="bg-orange-500 text-white rounded-xl p-4 text-center hover:bg-orange-600 transition"
          >
            <div className="text-2xl mb-1">📋</div>
            <div className="text-sm font-medium">Kelulusan Tempahan</div>
          </Link>
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
              <p className="text-gray-600">Tiada permohonan atau makluman baharu pada masa ini</p>
            </div>
          ) : (
            notifications.map((notif) => {
              const action = getActionLink(notif.jenisAktiviti, notif.keterangan)
              return (
                <div
                  key={notif.id}
                  className={`rounded-xl shadow-sm p-4 border ${getNotificationColor(notif.jenisAktiviti)} ${
                    notif.isRead === 0 ? 'border-l-4 bg-blue-50' : 'bg-white opacity-60'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="text-2xl">{getNotificationIcon(notif.jenisAktiviti)}</div>
                    <div className="flex-1">
                      <p className={`${notif.isRead === 0 ? 'font-semibold text-gray-900' : 'text-gray-600'}`}>
                        {notif.keterangan}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs text-gray-500">
                          {new Date(notif.createdAt).toLocaleString('ms-MY')}
                        </span>
                        {notif.isRead === 0 && (
                          <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                            BELUM DIBACA
                          </span>
                        )}
                      </div>
                      {action && (
                        <Link
                          href={action.href}
                          className="inline-block mt-2 bg-blue-500 text-white text-xs px-3 py-1.5 rounded-lg hover:bg-blue-600"
                        >
                          {action.text} →
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>

        {/* Bottom Nav */}
        <BottomNav activeTab="notifikasi" />
      </div>
    </div>
  )
}
