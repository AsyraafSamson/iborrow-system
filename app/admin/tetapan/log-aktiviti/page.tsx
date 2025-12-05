'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import BottomNav from '@/components/BottomNav'

interface ActivityLog {
  id: string
  userId: string
  nama: string
  email?: string
  peranan?: string
  jenisAktiviti: string
  keterangan: string
  ipAddress: string
  userAgent: string
  createdAt: string
}

export default function AdminTetapanLogAktiviti() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [logs, setLogs] = useState<ActivityLog[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)

  // Filters
  const [filterUserId, setFilterUserId] = useState('')
  const [filterJenisAktiviti, setFilterJenisAktiviti] = useState('')
  const [filterStartDate, setFilterStartDate] = useState('')
  const [filterEndDate, setFilterEndDate] = useState('')
  const [limit, setLimit] = useState(50)

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (!userData) {
      router.push('/login')
      return
    }
    setUser(JSON.parse(userData))
  }, [router])

  useEffect(() => {
    if (user) {
      fetchLogs()
    }
  }, [user, currentPage, limit, filterUserId, filterJenisAktiviti, filterStartDate, filterEndDate])

  const fetchLogs = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: limit.toString()
      })

      if (filterUserId) params.append('userId', filterUserId)
      if (filterJenisAktiviti) params.append('jenisAktiviti', filterJenisAktiviti)
      if (filterStartDate) params.append('startDate', filterStartDate)
      if (filterEndDate) params.append('endDate', filterEndDate)

      const res = await fetch(`/api/admin/tetapan/log-aktiviti?${params.toString()}`)
      const data = await res.json()

      if (data.success) {
        setLogs(data.data || [])
        if (data.pagination) {
          setCurrentPage(data.pagination.page)
          setTotalPages(data.pagination.totalPages)
          setTotal(data.pagination.total)
        }
      }
    } catch (error) {
      console.error('Error fetching logs:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleClearOld = async () => {
    const days = prompt('Padam log lebih dari berapa hari? (cth: 90)')
    if (!days) return

    const daysNum = parseInt(days)
    if (isNaN(daysNum) || daysNum < 1) {
      alert('Sila masukkan nombor yang sah')
      return
    }

    if (!confirm(`Padam semua log lebih dari ${daysNum} hari?`)) return

    try {
      const res = await fetch('/api/admin/tetapan/log-aktiviti', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'clear-old', days: daysNum })
      })

      const data = await res.json()
      if (data.success) {
        alert(data.message)
        fetchLogs()
      } else {
        alert(data.error || 'Gagal padam')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Network error')
    }
  }

  const handleClearAll = async () => {
    if (!confirm('AMARAN: Padam SEMUA log aktiviti? Tindakan ini tidak boleh dibatalkan!')) return
    if (!confirm('Adakah anda PASTI untuk meneruskan?')) return

    try {
      const res = await fetch('/api/admin/tetapan/log-aktiviti', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'clear-all' })
      })

      const data = await res.json()
      if (data.success) {
        alert(data.message)
        fetchLogs()
      } else {
        alert(data.error || 'Gagal padam')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Network error')
    }
  }

  const resetFilters = () => {
    setFilterUserId('')
    setFilterJenisAktiviti('')
    setFilterStartDate('')
    setFilterEndDate('')
    setCurrentPage(1)
  }

  const getActivityIcon = (jenis: string) => {
    const icons: any = {
      'CREATE': '➕',
      'UPDATE': '✏️',
      'DELETE': '🗑️',
      'LOGIN': '🔐',
      'LOGOUT': '🚪',
      'APPROVE': '✅',
      'REJECT': '❌',
      'VIEW': '👁️',
      'EXPORT': '📤',
      'IMPORT': '📥'
    }
    return icons[jenis] || '📝'
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleString('ms-MY', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (!user) return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>

  return (
    <div className="min-h-screen bg-gray-50 p-3 pb-24">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
          <h1 className="text-2xl font-bold text-gray-900">Log Aktiviti Sistem</h1>
          <p className="text-sm text-gray-600">Audit trail semua aktiviti pengguna</p>
          <p className="text-xs text-gray-500 mt-1">Jumlah: {total} rekod</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
          <h2 className="font-semibold mb-3">🔍 Penapis</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
            <div>
              <label className="block text-sm font-medium mb-1">Jenis Aktiviti</label>
              <select
                value={filterJenisAktiviti}
                onChange={(e) => { setFilterJenisAktiviti(e.target.value); setCurrentPage(1) }}
                className="w-full px-3 py-2 border rounded-lg text-sm"
              >
                <option value="">Semua</option>
                <option value="CREATE">CREATE - Tambah</option>
                <option value="UPDATE">UPDATE - Kemaskini</option>
                <option value="DELETE">DELETE - Padam</option>
                <option value="LOGIN">LOGIN - Log Masuk</option>
                <option value="LOGOUT">LOGOUT - Log Keluar</option>
                <option value="APPROVE">APPROVE - Lulus</option>
                <option value="REJECT">REJECT - Tolak</option>
                <option value="VIEW">VIEW - Lihat</option>
                <option value="EXPORT">EXPORT - Eksport</option>
                <option value="IMPORT">IMPORT - Import</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Rekod per halaman</label>
              <select
                value={limit}
                onChange={(e) => { setLimit(parseInt(e.target.value)); setCurrentPage(1) }}
                className="w-full px-3 py-2 border rounded-lg text-sm"
              >
                <option value="25">25</option>
                <option value="50">50</option>
                <option value="100">100</option>
                <option value="200">200</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Tarikh Mula</label>
              <input
                type="date"
                value={filterStartDate}
                onChange={(e) => { setFilterStartDate(e.target.value); setCurrentPage(1) }}
                className="w-full px-3 py-2 border rounded-lg text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Tarikh Tamat</label>
              <input
                type="date"
                value={filterEndDate}
                onChange={(e) => { setFilterEndDate(e.target.value); setCurrentPage(1) }}
                className="w-full px-3 py-2 border rounded-lg text-sm"
              />
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={resetFilters}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm hover:bg-gray-300"
            >
              Reset Penapis
            </button>
          </div>
        </div>

        {/* Actions */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={handleClearOld}
              className="px-4 py-2 bg-orange-600 text-white rounded-lg text-sm hover:bg-orange-700"
            >
              🗑️ Padam Log Lama
            </button>
            <button
              onClick={handleClearAll}
              className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700"
            >
              ⚠️ Padam Semua Log
            </button>
          </div>
        </div>

        {/* Logs Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-4">
          {loading ? (
            <div className="p-8 text-center text-gray-600">Loading...</div>
          ) : logs.length === 0 ? (
            <div className="p-8 text-center text-gray-600">Tiada log dijumpai</div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="p-3 text-left text-sm font-semibold">Masa</th>
                      <th className="p-3 text-left text-sm font-semibold">Pengguna</th>
                      <th className="p-3 text-left text-sm font-semibold">Aktiviti</th>
                      <th className="p-3 text-left text-sm font-semibold">Keterangan</th>
                      <th className="p-3 text-left text-sm font-semibold">IP Address</th>
                    </tr>
                  </thead>
                  <tbody>
                    {logs.map((log) => (
                      <tr key={log.id} className="border-b hover:bg-gray-50">
                        <td className="p-3 text-sm whitespace-nowrap">
                          {formatDate(log.createdAt)}
                        </td>
                        <td className="p-3 text-sm">
                          <div>
                            <div className="font-medium">{log.nama}</div>
                            {log.email && <div className="text-xs text-gray-500">{log.email}</div>}
                            {log.peranan && (
                              <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-800 rounded">
                                {log.peranan}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="p-3 text-sm">
                          <span className="flex items-center gap-1">
                            <span>{getActivityIcon(log.jenisAktiviti)}</span>
                            <span className="font-medium">{log.jenisAktiviti}</span>
                          </span>
                        </td>
                        <td className="p-3 text-sm">
                          <div className="max-w-md truncate" title={log.keterangan}>
                            {log.keterangan}
                          </div>
                        </td>
                        <td className="p-3 text-sm font-mono text-xs">
                          {log.ipAddress}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="p-4 border-t flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Halaman {currentPage} dari {totalPages} ({total} rekod)
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 border rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    ← Sebelum
                  </button>
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 border rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Seterus →
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Bottom Nav */}
        <BottomNav activeTab="tetapan" />
      </div>
    </div>
  )
}
