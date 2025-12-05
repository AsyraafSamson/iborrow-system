'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import BottomNav from '@/components/BottomNav'

export default function StaffICTLaporanIndex() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData) {
      const parsedUser = JSON.parse(userData)
      setUser(parsedUser)
      
      if (parsedUser.peranan !== 'staff-ict') {
        router.push('/login')
        return
      }
    } else {
      router.push('/login')
    }
  }, [router])

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6 text-white">
          <h1 className="text-2xl font-bold">Laporan</h1>
          <p className="opacity-90">Pilih jenis laporan</p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          
          {/* Laporan Keseluruhan */}
          <Link href="/staff-ict/laporan/keseluruhan" 
                className="block bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center space-x-4">
              <div className="text-3xl">📊</div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">Laporan Keseluruhan</h3>
                <p className="text-gray-600 text-sm">Statistik dan ringkasan sistem</p>
              </div>
              <div className="text-gray-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </Link>

          {/* Laporan Barang */}
          <Link href="/staff-ict/laporan/barang" 
                className="block bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center space-x-4">
              <div className="text-3xl">📦</div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">Laporan Barang</h3>
                <p className="text-gray-600 text-sm">Inventori dan status barang</p>
              </div>
              <div className="text-gray-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </Link>

          {/* Laporan Tempahan */}
          <Link href="/staff-ict/laporan/tempahan" 
                className="block bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center space-x-4">
              <div className="text-3xl">📋</div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">Laporan Tempahan</h3>
                <p className="text-gray-600 text-sm">Analisis tempahan dan kelulusan</p>
              </div>
              <div className="text-gray-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </Link>

          {/* Info */}
          <div className="bg-blue-50 rounded-xl p-4 mt-6">
            <div className="flex items-center space-x-2">
              <div className="text-blue-600">ℹ️</div>
              <div>
                <h4 className="text-sm font-medium text-blue-900">Panduan</h4>
                <p className="text-xs text-blue-700 mt-1">
                  Pilih jenis laporan yang ingin dilihat untuk mendapat analisis terperinci.
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Navigation */}
        <BottomNav activeTab="laporan" />
      </div>
    </div>
  )
}