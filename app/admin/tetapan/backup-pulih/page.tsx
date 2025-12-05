'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function AdminTetapanBackupPulih() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [backupFile, setBackupFile] = useState<File | null>(null)
  const [restoreMode, setRestoreMode] = useState<'replace' | 'append'>('append')

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (!userData) {
      router.push('/login')
      return
    }
    setUser(JSON.parse(userData))
  }, [router])

  const handleBackup = async (format: 'json' | 'sql') => {
    if (!confirm(`Buat backup dalam format ${format.toUpperCase()}?`)) return

    setLoading(true)
    try {
      const res = await fetch(`/api/admin/tetapan/backup?format=${format}`)

      if (!res.ok) {
        throw new Error('Gagal membuat backup')
      }

      // Get filename from Content-Disposition header or create default
      const contentDisposition = res.headers.get('Content-Disposition')
      let filename = `iborrow-backup-${new Date().toISOString().split('T')[0]}.${format}`

      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="?(.+)"?/)
        if (filenameMatch) {
          filename = filenameMatch[1]
        }
      }

      // Download file
      const blob = await res.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = filename
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      alert('Backup berjaya dimuat turun!')
    } catch (error) {
      console.error('Backup error:', error)
      alert('Gagal membuat backup')
    } finally {
      setLoading(false)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setBackupFile(e.target.files[0])
    }
  }

  const handleRestore = async () => {
    if (!backupFile) {
      alert('Sila pilih fail backup terlebih dahulu')
      return
    }

    if (!confirm(`AMARAN: Restore database akan ${restoreMode === 'replace' ? 'MENGGANTIKAN SEMUA DATA' : 'menambah data'} yang ada sekarang. Teruskan?`)) {
      return
    }

    setLoading(true)
    try {
      // Read file content
      const fileContent = await backupFile.text()
      let backup

      try {
        backup = JSON.parse(fileContent)
      } catch (e) {
        alert('Format fail tidak sah. Sila gunakan fail backup JSON yang betul.')
        setLoading(false)
        return
      }

      // Send restore request
      const res = await fetch('/api/admin/tetapan/backup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ backup, mode: restoreMode })
      })

      const data = await res.json()
      if (data.success) {
        alert(data.message)
        setBackupFile(null)
        // Reset file input
        const fileInput = document.getElementById('backupFile') as HTMLInputElement
        if (fileInput) fileInput.value = ''
      } else {
        alert(data.error || 'Gagal restore database')
      }
    } catch (error) {
      console.error('Restore error:', error)
      alert('Gagal restore database')
    } finally {
      setLoading(false)
    }
  }

  if (!user) return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>

  return (
    <div className="min-h-screen bg-gray-50 p-3 pb-24">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
          <h1 className="text-2xl font-bold text-gray-900">Backup & Pulih Data</h1>
          <p className="text-sm text-gray-600">Sandarkan dan pulihkan data sistem</p>
        </div>

        {/* Backup Section */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
          <h2 className="text-lg font-semibold mb-3">💾 Backup Database</h2>
          <p className="text-sm text-gray-600 mb-4">
            Muat turun salinan lengkap database dalam format JSON atau SQL
          </p>

          <div className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <button
                onClick={() => handleBackup('json')}
                disabled={loading}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <span>📄</span>
                <span>{loading ? 'Memproses...' : 'Backup (JSON)'}</span>
              </button>

              <button
                onClick={() => handleBackup('sql')}
                disabled={loading}
                className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <span>📊</span>
                <span>{loading ? 'Memproses...' : 'Backup (SQL)'}</span>
              </button>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm text-blue-800">
                <strong>Tip:</strong> Format JSON lebih mudah untuk restore semula. Format SQL untuk integrasi dengan tool lain.
              </p>
            </div>
          </div>
        </div>

        {/* Restore Section */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
          <h2 className="text-lg font-semibold mb-3">♻️ Pulih Database</h2>
          <p className="text-sm text-gray-600 mb-4">
            Pulihkan database dari fail backup yang telah dimuat turun sebelum ini
          </p>

          <div className="space-y-4">
            {/* File Upload */}
            <div>
              <label className="block text-sm font-medium mb-2">Pilih Fail Backup (JSON)</label>
              <input
                id="backupFile"
                type="file"
                accept=".json"
                onChange={handleFileSelect}
                disabled={loading}
                className="w-full px-3 py-2 border rounded-lg text-sm disabled:opacity-50"
              />
              {backupFile && (
                <p className="text-sm text-gray-600 mt-2">
                  Fail dipilih: <strong>{backupFile.name}</strong> ({(backupFile.size / 1024).toFixed(2)} KB)
                </p>
              )}
            </div>

            {/* Restore Mode */}
            <div>
              <label className="block text-sm font-medium mb-2">Mod Restore</label>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    id="append"
                    name="restoreMode"
                    value="append"
                    checked={restoreMode === 'append'}
                    onChange={(e) => setRestoreMode('append')}
                    className="w-4 h-4"
                  />
                  <label htmlFor="append" className="text-sm">
                    <strong>Tambah Sahaja</strong> - Tambah data tanpa padam data sedia ada
                  </label>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    id="replace"
                    name="restoreMode"
                    value="replace"
                    checked={restoreMode === 'replace'}
                    onChange={(e) => setRestoreMode('replace')}
                    className="w-4 h-4"
                  />
                  <label htmlFor="replace" className="text-sm">
                    <strong className="text-red-600">Ganti Semua</strong> - PADAM semua data dan ganti dengan backup
                  </label>
                </div>
              </div>
            </div>

            {/* Warning */}
            {restoreMode === 'replace' && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm text-red-800">
                  <strong>⚠️ AMARAN:</strong> Mod "Ganti Semua" akan MEMADAM SEMUA data dalam sistem dan menggantikannya dengan data dari backup. Tindakan ini tidak boleh dibatalkan!
                </p>
              </div>
            )}

            {/* Restore Button */}
            <button
              onClick={handleRestore}
              disabled={loading || !backupFile}
              className={`w-full py-3 rounded-lg font-medium disabled:opacity-50 ${
                restoreMode === 'replace'
                  ? 'bg-red-600 hover:bg-red-700 text-white'
                  : 'bg-green-600 hover:bg-green-700 text-white'
              }`}
            >
              {loading ? 'Memproses...' : (restoreMode === 'replace' ? '⚠️ Ganti Database' : '♻️ Pulih Database')}
            </button>
          </div>
        </div>

        {/* Info Section */}
        <div className="bg-white rounded-xl shadow-sm p-4">
          <h3 className="font-semibold mb-2">📌 Maklumat Penting</h3>
          <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
            <li>Backup mengandungi semua data: Pengguna, Barang, Tempahan, Log Aktiviti</li>
            <li>Disarankan untuk backup secara berkala (mingguan atau bulanan)</li>
            <li>Simpan fail backup di lokasi yang selamat</li>
            <li>Pastikan fail backup tidak rosak sebelum restore</li>
            <li>Hubungi pentadbir sistem jika menghadapi masalah</li>
          </ul>
        </div>

        {/* Bottom Nav */}
        <div className="fixed bottom-4 left-4 right-4 bg-white rounded-2xl shadow-lg p-3 flex justify-around">
          <Link href="/admin/dashboard" className="flex flex-col items-center text-gray-600"><div>📊</div><div className="text-xs">Dashboard</div></Link>
          <Link href="/admin/pengguna" className="flex flex-col items-center text-gray-600"><div>👥</div><div className="text-xs">Pengguna</div></Link>
          <Link href="/admin/barang" className="flex flex-col items-center text-gray-600"><div>📦</div><div className="text-xs">Barang</div></Link>
          <Link href="/admin/laporan" className="flex flex-col items-center text-gray-600"><div>📈</div><div className="text-xs">Laporan</div></Link>
          <Link href="/admin/tetapan/sistem" className="flex flex-col items-center text-blue-600"><div>⚙️</div><div className="text-xs">Tetapan</div></Link>
          <Link href="/admin/profile" className="flex flex-col items-center text-gray-600"><div>👤</div><div className="text-xs">Profil</div></Link>
        </div>
      </div>
    </div>
  )
}
