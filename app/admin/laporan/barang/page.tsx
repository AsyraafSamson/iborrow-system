'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import BottomNav from '@/components/BottomNav'

interface ItemReportData {
  totalBarang: number
  tersedia: number
  dipinjam: number
  rosak: number
  totalValue: number
  byKategori: Record<string, number>
  topBarang: Array<{
    id: string
    namaBarang: string
    kategori: string
    kodBarang: string
    kuantitiTotal: number
    kuantitiTersedia: number
    totalPinjaman: number
    hargaPerolehan?: number
  }>
  lowStock: Array<{
    id: string
    namaBarang: string
    kategori: string
    kodBarang: string
    kuantitiTotal: number
    kuantitiTersedia: number
    status: string
  }>
}

export default function AdminLaporanBarang() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [data, setData] = useState<ItemReportData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (!userData) {
      router.push('/login')
      return
    }
    setUser(JSON.parse(userData))
    fetchReport()
  }, [router])

  const fetchReport = async () => {
    try {
      const res = await fetch('/api/admin/laporan/barang')
      const result = await res.json()
      if (result.success) {
        setData(result.data)
      }
    } catch (error) {
      console.error('Error fetching report:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return `RM ${amount.toLocaleString('ms-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }

  if (!user) return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>

  return (
    <div className="min-h-screen bg-gray-50 p-3 pb-24">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
          <div className="flex items-center gap-2 mb-2">
            <Link href="/admin/laporan" className="text-blue-600 hover:text-blue-800">
              ← Kembali
            </Link>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Laporan Barang</h1>
          <p className="text-sm text-gray-600">Inventori dan penggunaan barang</p>
        </div>

        {loading ? (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center text-gray-600">
            Loading...
          </div>
        ) : data ? (
          <>
            {/* Summary Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
              <div className="bg-white rounded-xl shadow-sm p-4">
                <div className="text-2xl font-bold text-blue-600">{data.totalBarang}</div>
                <div className="text-xs text-gray-600">Jumlah Barang</div>
              </div>
              <div className="bg-white rounded-xl shadow-sm p-4">
                <div className="text-2xl font-bold text-green-600">{data.tersedia}</div>
                <div className="text-xs text-gray-600">Tersedia</div>
              </div>
              <div className="bg-white rounded-xl shadow-sm p-4">
                <div className="text-2xl font-bold text-orange-600">{data.dipinjam}</div>
                <div className="text-xs text-gray-600">Dipinjam</div>
              </div>
              <div className="bg-white rounded-xl shadow-sm p-4">
                <div className="text-2xl font-bold text-red-600">{data.rosak}</div>
                <div className="text-xs text-gray-600">Rosak</div>
              </div>
            </div>

            {/* Total Value */}
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-sm p-6 mb-4 text-white">
              <div className="text-sm opacity-90">Jumlah Nilai Aset</div>
              <div className="text-3xl font-bold mt-1">{formatCurrency(data.totalValue || 0)}</div>
            </div>

            {/* By Category */}
            <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
              <h2 className="text-lg font-semibold mb-3">Barang Mengikut Kategori</h2>
              <div className="space-y-3">
                {Object.entries(data.byKategori).map(([kategori, count]) => (
                  <div key={kategori} className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">{kategori}</span>
                    <div className="flex items-center gap-3">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${(count / data.totalBarang) * 100}%` }}
                        />
                      </div>
                      <span className="font-semibold text-gray-900 w-8 text-right">{count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Items */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-4">
              <div className="p-4 border-b">
                <h2 className="text-lg font-semibold">Barang Paling Popular</h2>
                <p className="text-sm text-gray-600">Berdasarkan jumlah peminjaman</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="p-3 text-left text-sm font-semibold">Kod</th>
                      <th className="p-3 text-left text-sm font-semibold">Nama Barang</th>
                      <th className="p-3 text-left text-sm font-semibold">Kategori</th>
                      <th className="p-3 text-left text-sm font-semibold">Stok</th>
                      <th className="p-3 text-left text-sm font-semibold">Pinjaman</th>
                      <th className="p-3 text-left text-sm font-semibold">Harga</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.topBarang.map((item, index) => (
                      <tr key={item.id} className="border-b hover:bg-gray-50">
                        <td className="p-3 text-sm font-mono">{item.kodBarang}</td>
                        <td className="p-3 text-sm font-medium">
                          <div className="flex items-center gap-2">
                            {index < 3 && (
                              <span className="text-xl">
                                {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                              </span>
                            )}
                            {item.namaBarang}
                          </div>
                        </td>
                        <td className="p-3 text-sm">{item.kategori}</td>
                        <td className="p-3 text-sm">
                          <span className={item.kuantitiTersedia === 0 ? 'text-red-600 font-medium' : ''}>
                            {item.kuantitiTersedia}/{item.kuantitiTotal}
                          </span>
                        </td>
                        <td className="p-3 text-sm font-semibold text-blue-600">{item.totalPinjaman}</td>
                        <td className="p-3 text-sm text-gray-600">
                          {item.hargaPerolehan ? formatCurrency(item.hargaPerolehan) : 'N/A'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Low Stock Alert */}
            {data.lowStock.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="p-4 border-b bg-red-50">
                  <h2 className="text-lg font-semibold text-red-900">⚠️ Amaran Stok Rendah</h2>
                  <p className="text-sm text-red-700">Barang yang perlu perhatian</p>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="p-3 text-left text-sm font-semibold">Kod</th>
                        <th className="p-3 text-left text-sm font-semibold">Nama Barang</th>
                        <th className="p-3 text-left text-sm font-semibold">Kategori</th>
                        <th className="p-3 text-left text-sm font-semibold">Stok</th>
                        <th className="p-3 text-left text-sm font-semibold">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.lowStock.map((item) => (
                        <tr key={item.id} className="border-b hover:bg-gray-50">
                          <td className="p-3 text-sm font-mono">{item.kodBarang}</td>
                          <td className="p-3 text-sm font-medium">{item.namaBarang}</td>
                          <td className="p-3 text-sm">{item.kategori}</td>
                          <td className="p-3 text-sm">
                            <span className="text-red-600 font-bold">
                              {item.kuantitiTersedia}/{item.kuantitiTotal}
                            </span>
                          </td>
                          <td className="p-3">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              item.status === 'Rosak' ? 'bg-red-100 text-red-800' : 'bg-orange-100 text-orange-800'
                            }`}>
                              {item.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center text-gray-600">
            Tiada data
          </div>
        )}

        {/* Bottom Nav */}
        <BottomNav activeTab="laporan" />
      </div>
    </div>
  )
}
