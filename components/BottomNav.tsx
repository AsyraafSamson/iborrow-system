'use client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import {
  LayoutDashboard,
  Users,
  Package,
  User,
  CheckSquare,
  Bell,
  ClipboardList,
  LogOut,
  RotateCcw,
} from 'lucide-react'
import { cn } from '@/lib/utils'

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
      const lastViewedAt = localStorage.getItem('notificationLastViewedAt') || ''
      const endpoint = role === 'staff-ict' || role === 'admin'
        ? '/api/staff-ict/notifikasi'
        : '/api/user/notifikasi'

      const url = lastViewedAt
        ? `${endpoint}?lastViewedAt=${encodeURIComponent(lastViewedAt)}`
        : endpoint

      const res = await fetch(url)
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
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      })
      localStorage.removeItem('user')
      localStorage.removeItem('session_token')
      router.push('/login')
    } catch (error) {
      console.error('Logout error:', error)
      localStorage.removeItem('user')
      localStorage.removeItem('session_token')
      router.push('/login')
    }
  }

  const getNavItems = () => {
    if (userRole === 'admin') {
      return [
        { href: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { href: '/admin/pengguna', icon: Users, label: 'Pengguna' },
        { href: '/admin/barang', icon: Package, label: 'Barang' },
        { href: '/admin/profile', icon: User, label: 'Profil' },
      ]
    } else if (userRole === 'staff-ict') {
      return [
        { href: '/staff-ict/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { href: '/staff-ict/kelulusan', icon: CheckSquare, label: 'Kelulusan' },
        { href: '/staff-ict/notifikasi', icon: Bell, label: 'Notifikasi', showBadge: true },
        { href: '/staff-ict/barang', icon: Package, label: 'Barang' },
        { href: '/staff-ict/profile', icon: User, label: 'Profil' },
      ]
    } else {
      return [
        { href: '/user/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { href: '/user/barang', icon: Package, label: 'Barang' },
        { href: '/user/tempahan', icon: ClipboardList, label: 'Tempahan' },
        { href: '/user/notifikasi', icon: Bell, label: 'Notifikasi', showBadge: true },
        { href: '/user/profile', icon: User, label: 'Profil' },
      ]
    }
  }

  const navItems = getNavItems()

  return (
    <div className="fixed bottom-4 left-4 right-4 bg-card border rounded-2xl shadow-lg p-3 flex justify-around items-center z-50">
      {navItems.map((item) => {
        const Icon = item.icon
        const isActive = activeTab === item.label.toLowerCase()
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex flex-col items-center relative',
              isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
            )}
          >
            <div className="relative">
              <Icon className="size-5" />
              {item.showBadge && unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-destructive text-white text-xs rounded-full w-4 h-4 flex items-center justify-center leading-none">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </div>
            <div className="text-xs mt-1">{item.label}</div>
          </Link>
        )
      })}

      <button
        onClick={handleLogout}
        className="flex flex-col items-center text-destructive hover:text-destructive/80"
      >
        <LogOut className="size-5" />
        <div className="text-xs mt-1">Keluar</div>
      </button>
    </div>
  )
}
