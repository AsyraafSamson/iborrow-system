'use client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useEffect, useState } from 'react'

interface BottomNavProps {
  activeTab?: string
}

export default function BottomNav({ activeTab }: BottomNavProps) {
  const router = useRouter()
  const [userRole, setUserRole] = useState<string>('user')
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData) {
      const user = JSON.parse(userData)
      setUserRole(user.peranan || 'user')
      fetchUnreadCount(user.peranan)
    }
  }, [])

  const fetchUnreadCount = async (role: string) => {
    try {
      const endpoint = role === 'staff-ict' || role === 'admin'
        ? '/api/staff-ict/notifikasi'
        : '/api/user/notifikasi'

      const res = await fetch(endpoint)
      const data = await res.json()
      if (data.success) {
        setUnreadCount(data.unreadCount || 0)
      }
    } catch (error) {
      console.error('Error fetching unread count:', error)
    }
  }

  const handleLogout = async () => {
    try {
      // Call logout API to log LOGOUT event
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      })

      // Clear storage and redirect
      localStorage.removeItem('user')
      localStorage.removeItem('session_token')
      router.push('/login')
    } catch (error) {
      console.error('Logout error:', error)
      // Still logout even if API fails
      localStorage.removeItem('user')
      localStorage.removeItem('session_token')
      router.push('/login')
    }
  }

  // Define navigation items based on role
  const getNavItems = () => {
    if (userRole === 'admin') {
      return [
        { href: '/admin/dashboard', icon: '📊', label: 'Dashboard' },
        { href: '/admin/pengguna', icon: '👥', label: 'Pengguna' },
        { href: '/admin/barang', icon: '📦', label: 'Barang' },
        { href: '/admin/profile', icon: '👤', label: 'Profil' }
      ]
    } else if (userRole === 'staff-ict') {
      return [
        { href: '/staff-ict/dashboard', icon: '📊', label: 'Dashboard' },
        { href: '/staff-ict/kelulusan', icon: '✅', label: 'Kelulusan' },
        { href: '/staff-ict/notifikasi', icon: '🔔', label: 'Notifikasi', showBadge: true },
        { href: '/staff-ict/barang', icon: '📦', label: 'Barang' },
        { href: '/staff-ict/profile', icon: '👤', label: 'Profil' }
      ]
    } else {
      // user, pelajar, staf
      return [
        { href: '/user/dashboard', icon: '📊', label: 'Dashboard' },
        { href: '/user/barang', icon: '📦', label: 'Barang' },
        { href: '/user/tempahan', icon: '📋', label: 'Tempahan' },
        { href: '/user/notifikasi', icon: '🔔', label: 'Notifikasi', showBadge: true },
        { href: '/user/profile', icon: '👤', label: 'Profil' }
      ]
    }
  }

  const navItems = getNavItems()

  return (
    <div className="fixed bottom-4 left-4 right-4 bg-white rounded-2xl shadow-lg p-3 flex justify-around items-center z-50">
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={`flex flex-col items-center relative ${
            activeTab === item.label.toLowerCase()
              ? 'text-blue-600'
              : 'text-gray-600 hover:text-blue-500'
          }`}
        >
          <div className="text-xl relative">
            {item.icon}
            {item.showBadge && unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </div>
          <div className="text-xs mt-1">{item.label}</div>
        </Link>
      ))}

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="flex flex-col items-center text-red-600 hover:text-red-700"
      >
        <div className="text-xl">🚪</div>
        <div className="text-xs mt-1">Keluar</div>
      </button>
    </div>
  )
}
