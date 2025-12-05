'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import BottomNav from '@/components/BottomNav'

export default function StaffLaporanTempahan() {
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
          <h1 className="text-2xl font-bold">Laporan Tempahan</h1>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4">
          <p className="text-gray-600">🚧 Laporan Tempahan - Coming soon</p>
        </div>
        <BottomNav activeTab="laporan" />
      </div>
    </div>
  )
}
