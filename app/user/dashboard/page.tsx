'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function UserDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (!userData) { router.push('/login'); return }
    setUser(JSON.parse(userData))
  }, [router])
  if (!user) return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>

  return (
    <div className="min-h-screen bg-gray-50 p-3 pb-24">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
          <h1 className="text-2xl font-bold">Dashboard Pengguna</h1>
          <p className="text-sm text-gray-600">Selamat datang, {user.nama}</p>
        </div>
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-blue-100 rounded-xl p-4">
            <div className="text-3xl font-bold text-blue-800">3</div>
            <div className="text-sm text-blue-600">Tempahan Aktif</div>
          </div>
          <div className="bg-green-100 rounded-xl p-4">
            <div className="text-3xl font-bold text-green-800">85</div>
            <div className="text-sm text-green-600">Barang Tersedia</div>
          </div>
        </div>
        <div className="fixed bottom-4 left-4 right-4 bg-white rounded-2xl shadow-lg p-3 flex justify-around">
          <Link href="/user/dashboard" className="flex flex-col items-center text-blue-600"><div>📊</div><div className="text-xs">Dashboard</div></Link>
          <Link href="/user/barang" className="flex flex-col items-center text-gray-600"><div>📦</div><div className="text-xs">Barang</div></Link>
          <Link href="/user/sejarah" className="flex flex-col items-center text-gray-600"><div>📜</div><div className="text-xs">Sejarah</div></Link>
          <Link href="/user/profile" className="flex flex-col items-center text-gray-600"><div>👤</div><div className="text-xs">Profil</div></Link>
        </div>
      </div>
    </div>
  )
}
