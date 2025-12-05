'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import BottomNav from '@/components/BottomNav'

export default function AdminTetapanSistem() {
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
          <h1 className="text-2xl font-bold text-gray-900">Tetapan Sistem</h1>
          <p className="text-sm text-gray-600">Konfigurasi dan pengurusan sistem</p>
        </div>

        {/* System Settings Categories */}
        <div className="space-y-4 mb-4">
          {/* General Settings */}
          <div className="bg-white rounded-xl shadow-sm p-4">
            <h2 className="text-lg font-bold text-gray-900 mb-3">Tetapan Umum</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <div>
                  <div className="font-medium text-gray-900">Nama Sistem</div>
                  <div className="text-sm text-gray-600">iBorrow - Sistem Peminjaman ICT</div>
                </div>
                <button className="text-blue-600 text-sm hover:text-blue-800">Edit</button>
              </div>
              
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <div>
                  <div className="font-medium text-gray-900">Organisasi</div>
                  <div className="text-sm text-gray-600">Institut Kementerian Kesihatan Malaysia JB</div>
                </div>
                <button className="text-blue-600 text-sm hover:text-blue-800">Edit</button>
              </div>

              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <div>
                  <div className="font-medium text-gray-900">Email Admin</div>
                  <div className="text-sm text-gray-600">admin@ikmjb.edu.my</div>
                </div>
                <button className="text-blue-600 text-sm hover:text-blue-800">Edit</button>
              </div>
            </div>
          </div>

          {/* Booking Settings */}
          <div className="bg-white rounded-xl shadow-sm p-4">
            <h2 className="text-lg font-bold text-gray-900 mb-3">Tetapan Peminjaman</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <div>
                  <div className="font-medium text-gray-900">Tempoh Pinjaman Maksimum</div>
                  <div className="text-sm text-gray-600">7 hari</div>
                </div>
                <button className="text-blue-600 text-sm hover:text-blue-800">Edit</button>
              </div>
              
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <div>
                  <div className="font-medium text-gray-900">Kelulusan Automatik</div>
                  <div className="text-sm text-gray-600">Tidak Aktif - Perlu kelulusan manual</div>
                </div>
                <button className="text-blue-600 text-sm hover:text-blue-800">Edit</button>
              </div>

              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <div>
                  <div className="font-medium text-gray-900">Had Tempahan Per Pengguna</div>
                  <div className="text-sm text-gray-600">3 barang serentak</div>
                </div>
                <button className="text-blue-600 text-sm hover:text-blue-800">Edit</button>
              </div>
            </div>
          </div>

          {/* System Maintenance */}
          <div className="bg-white rounded-xl shadow-sm p-4">
            <h2 className="text-lg font-bold text-gray-900 mb-3">Penyelenggaraan Sistem</h2>
            <div className="grid grid-cols-2 gap-3">
              <Link href="/admin/tetapan/backup-pulih" className="bg-blue-50 p-3 rounded-lg text-center text-blue-700 hover:bg-blue-100">
                <div className="text-2xl mb-1">💾</div>
                <div className="text-sm font-medium">Backup & Restore</div>
              </Link>
              
              <Link href="/admin/tetapan/log-aktiviti" className="bg-green-50 p-3 rounded-lg text-center text-green-700 hover:bg-green-100">
                <div className="text-2xl mb-1">📋</div>
                <div className="text-sm font-medium">Log Aktiviti</div>
              </Link>
              
              <Link href="/admin/tetapan/keselamatan" className="bg-orange-50 p-3 rounded-lg text-center text-orange-700 hover:bg-orange-100">
                <div className="text-2xl mb-1">🔒</div>
                <div className="text-sm font-medium">Keselamatan</div>
              </Link>
              
              <button className="bg-red-50 p-3 rounded-lg text-center text-red-700 hover:bg-red-100">
                <div className="text-2xl mb-1">🔄</div>
                <div className="text-sm font-medium">Restart Sistem</div>
              </button>
            </div>
          </div>
        </div>
        <BottomNav activeTab="tetapan" />
      </div>
    </div>
  )
}
