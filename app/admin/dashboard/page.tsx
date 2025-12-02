'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function AdminDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (!userData) {
      router.push('/login')
      return
    }
    setUser(JSON.parse(userData))
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('user')
    router.push('/login')
  }

  if (!user) return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>

  return (
    <div className="min-h-screen bg-gray-50 p-3 pb-24">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard Admin</h1>
            <p className="text-sm text-gray-600">Selamat datang, {user.nama}</p>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700"
          >
            Logout
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-blue-100 rounded-xl p-4">
            <div className="text-3xl font-bold text-blue-800">45</div>
            <div className="text-sm text-blue-600">Total Pengguna</div>
          </div>
          <div className="bg-green-100 rounded-xl p-4">
            <div className="text-3xl font-bold text-green-800">128</div>
            <div className="text-sm text-green-600">Total Barang</div>
          </div>
          <div className="bg-purple-100 rounded-xl p-4">
            <div className="text-3xl font-bold text-purple-800">23</div>
            <div className="text-sm text-purple-600">Tempahan Aktif</div>
          </div>
          <div className="bg-orange-100 rounded-xl p-4">
            <div className="text-3xl font-bold text-orange-800">8</div>
            <div className="text-sm text-orange-600">Perlu Kelulusan</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
          <h2 className="text-lg font-bold text-gray-900 mb-3">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            <Link href="/admin/pengguna" className="bg-blue-50 p-3 rounded-lg text-center text-blue-700 hover:bg-blue-100">
              Urus Pengguna
            </Link>
            <Link href="/admin/barang" className="bg-green-50 p-3 rounded-lg text-center text-green-700 hover:bg-green-100">
              Urus Barang
            </Link>
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="fixed bottom-4 left-4 right-4 bg-white rounded-2xl shadow-lg p-3 flex justify-around items-center">
          <Link href="/admin/dashboard" className="flex flex-col items-center text-blue-600">
            <div className="text-xl">📊</div>
            <div className="text-xs">Dashboard</div>
          </Link>
          <Link href="/admin/pengguna" className="flex flex-col items-center text-gray-600">
            <div className="text-xl">👥</div>
            <div className="text-xs">Pengguna</div>
          </Link>
          <Link href="/admin/barang" className="flex flex-col items-center text-gray-600">
            <div className="text-xl">📦</div>
            <div className="text-xs">Barang</div>
          </Link>
          <Link href="/admin/laporan" className="flex flex-col items-center text-gray-600">
            <div className="text-xl">📈</div>
            <div className="text-xs">Laporan</div>
          </Link>
          <Link href="/admin/tetapan/sistem" className="flex flex-col items-center text-gray-600">
            <div className="text-xl">⚙️</div>
            <div className="text-xs">Tetapan</div>
          </Link>
          <Link href="/admin/profile" className="flex flex-col items-center text-gray-600">
            <div className="text-xl">👤</div>
            <div className="text-xs">Profil</div>
          </Link>
        </div>
      </div>
    </div>
  )
}
