'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import BottomNav from '@/components/BottomNav'

interface SystemSettings {
  systemName: string
  organization: string
  adminEmail: string
  maxBorrowDays: number
  autoApprovalEnabled: boolean
  maxItemsPerUser: number
}

export default function AdminTetapanSistem() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [settings, setSettings] = useState<SystemSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editingField, setEditingField] = useState<string | null>(null)
  const [editValue, setEditValue] = useState<any>('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (!userData) { router.push('/login'); return }
    setUser(JSON.parse(userData))
  }, [router])

  useEffect(() => {
    if (user) {
      fetchSettings()
    }
  }, [user])

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/admin/tetapan/sistem')
      const result = await response.json()
      if (result.success) {
        setSettings(result.data)
      }
    } catch (error) {
      console.error('Error fetching settings:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (field: string, currentValue: any) => {
    setEditingField(field)
    setEditValue(currentValue)
    setMessage('')
  }

  const handleSave = async () => {
    if (!editingField || !settings) return

    setSaving(true)
    setMessage('')

    try {
      const response = await fetch('/api/admin/tetapan/sistem', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          settings: {
            [editingField]: editValue
          }
        })
      })

      const result = await response.json()

      if (result.success) {
        setSettings({
          ...settings,
          [editingField]: editValue
        })
        setMessage('Tetapan berjaya dikemaskini!')
        setEditingField(null)
        setEditValue('')
      } else {
        setMessage(result.error || 'Gagal mengemaskini tetapan')
      }
    } catch (error) {
      setMessage('Ralat mengemaskini tetapan')
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    setEditingField(null)
    setEditValue('')
    setMessage('')
  }

  const formatAutoApproval = (enabled: boolean) => {
    return enabled ? 'Aktif - Automatik' : 'Tidak Aktif - Perlu kelulusan manual'
  }

  if (!user) return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>

  return (
    <div className="min-h-screen bg-gray-50 p-3 pb-24">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
          <h1 className="text-2xl font-bold text-gray-900">Tetapan Sistem</h1>
          <p className="text-sm text-gray-600">Konfigurasi dan pengurusan sistem</p>
        </div>

        {/* Message */}
        {message && (
          <div className={`mb-4 p-3 rounded-lg text-sm ${
            message.includes('berjaya') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
            {message}
          </div>
        )}

        {loading ? (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Memuat tetapan...</p>
          </div>
        ) : settings ? (
          <>
            {/* General Settings */}
            <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
              <h2 className="text-lg font-bold text-gray-900 mb-3">Tetapan Umum</h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">Nama Sistem</div>
                    {editingField === 'systemName' ? (
                      <input
                        type="text"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        className="mt-1 w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        autoFocus
                      />
                    ) : (
                      <div className="text-sm text-gray-600">{settings.systemName}</div>
                    )}
                  </div>
                  {editingField === 'systemName' ? (
                    <div className="ml-3 space-x-2">
                      <button
                        onClick={handleSave}
                        disabled={saving}
                        className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 disabled:opacity-50"
                      >
                        {saving ? 'Menyimpan...' : 'Simpan'}
                      </button>
                      <button
                        onClick={handleCancel}
                        className="bg-gray-500 text-white px-3 py-1 rounded text-sm hover:bg-gray-600"
                      >
                        Batal
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleEdit('systemName', settings.systemName)}
                      className="ml-3 text-blue-600 text-sm hover:text-blue-800"
                    >
                      Edit
                    </button>
                  )}
                </div>

                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">Organisasi</div>
                    {editingField === 'organization' ? (
                      <input
                        type="text"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        className="mt-1 w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        autoFocus
                      />
                    ) : (
                      <div className="text-sm text-gray-600">{settings.organization}</div>
                    )}
                  </div>
                  {editingField === 'organization' ? (
                    <div className="ml-3 space-x-2">
                      <button
                        onClick={handleSave}
                        disabled={saving}
                        className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 disabled:opacity-50"
                      >
                        {saving ? 'Menyimpan...' : 'Simpan'}
                      </button>
                      <button
                        onClick={handleCancel}
                        className="bg-gray-500 text-white px-3 py-1 rounded text-sm hover:bg-gray-600"
                      >
                        Batal
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleEdit('organization', settings.organization)}
                      className="ml-3 text-blue-600 text-sm hover:text-blue-800"
                    >
                      Edit
                    </button>
                  )}
                </div>

                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">Email Admin</div>
                    {editingField === 'adminEmail' ? (
                      <input
                        type="email"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        className="mt-1 w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        autoFocus
                      />
                    ) : (
                      <div className="text-sm text-gray-600">{settings.adminEmail}</div>
                    )}
                  </div>
                  {editingField === 'adminEmail' ? (
                    <div className="ml-3 space-x-2">
                      <button
                        onClick={handleSave}
                        disabled={saving}
                        className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 disabled:opacity-50"
                      >
                        {saving ? 'Menyimpan...' : 'Simpan'}
                      </button>
                      <button
                        onClick={handleCancel}
                        className="bg-gray-500 text-white px-3 py-1 rounded text-sm hover:bg-gray-600"
                      >
                        Batal
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleEdit('adminEmail', settings.adminEmail)}
                      className="ml-3 text-blue-600 text-sm hover:text-blue-800"
                    >
                      Edit
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Booking Settings */}
            <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
              <h2 className="text-lg font-bold text-gray-900 mb-3">Tetapan Peminjaman</h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">Tempoh Pinjaman Maksimum</div>
                    {editingField === 'maxBorrowDays' ? (
                      <input
                        type="number"
                        value={editValue}
                        onChange={(e) => setEditValue(parseInt(e.target.value))}
                        className="mt-1 w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        autoFocus
                        min="1"
                        max="30"
                      />
                    ) : (
                      <div className="text-sm text-gray-600">{settings.maxBorrowDays} hari</div>
                    )}
                  </div>
                  {editingField === 'maxBorrowDays' ? (
                    <div className="ml-3 space-x-2">
                      <button
                        onClick={handleSave}
                        disabled={saving}
                        className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 disabled:opacity-50"
                      >
                        {saving ? 'Menyimpan...' : 'Simpan'}
                      </button>
                      <button
                        onClick={handleCancel}
                        className="bg-gray-500 text-white px-3 py-1 rounded text-sm hover:bg-gray-600"
                      >
                        Batal
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleEdit('maxBorrowDays', settings.maxBorrowDays)}
                      className="ml-3 text-blue-600 text-sm hover:text-blue-800"
                    >
                      Edit
                    </button>
                  )}
                </div>

                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">Kelulusan Automatik</div>
                    {editingField === 'autoApprovalEnabled' ? (
                      <select
                        value={editValue ? 'true' : 'false'}
                        onChange={(e) => setEditValue(e.target.value === 'true')}
                        className="mt-1 w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        autoFocus
                      >
                        <option value="false">Tidak Aktif - Perlu kelulusan manual</option>
                        <option value="true">Aktif - Automatik</option>
                      </select>
                    ) : (
                      <div className="text-sm text-gray-600">{formatAutoApproval(settings.autoApprovalEnabled)}</div>
                    )}
                  </div>
                  {editingField === 'autoApprovalEnabled' ? (
                    <div className="ml-3 space-x-2">
                      <button
                        onClick={handleSave}
                        disabled={saving}
                        className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 disabled:opacity-50"
                      >
                        {saving ? 'Menyimpan...' : 'Simpan'}
                      </button>
                      <button
                        onClick={handleCancel}
                        className="bg-gray-500 text-white px-3 py-1 rounded text-sm hover:bg-gray-600"
                      >
                        Batal
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleEdit('autoApprovalEnabled', settings.autoApprovalEnabled)}
                      className="ml-3 text-blue-600 text-sm hover:text-blue-800"
                    >
                      Edit
                    </button>
                  )}
                </div>

                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">Had Tempahan Per Pengguna</div>
                    {editingField === 'maxItemsPerUser' ? (
                      <input
                        type="number"
                        value={editValue}
                        onChange={(e) => setEditValue(parseInt(e.target.value))}
                        className="mt-1 w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        autoFocus
                        min="1"
                        max="10"
                      />
                    ) : (
                      <div className="text-sm text-gray-600">{settings.maxItemsPerUser} barang serentak</div>
                    )}
                  </div>
                  {editingField === 'maxItemsPerUser' ? (
                    <div className="ml-3 space-x-2">
                      <button
                        onClick={handleSave}
                        disabled={saving}
                        className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 disabled:opacity-50"
                      >
                        {saving ? 'Menyimpan...' : 'Simpan'}
                      </button>
                      <button
                        onClick={handleCancel}
                        className="bg-gray-500 text-white px-3 py-1 rounded text-sm hover:bg-gray-600"
                      >
                        Batal
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleEdit('maxItemsPerUser', settings.maxItemsPerUser)}
                      className="ml-3 text-blue-600 text-sm hover:text-blue-800"
                    >
                      Edit
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* System Maintenance */}
            <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
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
          </>
        ) : (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center text-gray-600">
            Gagal memuat tetapan sistem
          </div>
        )}
        <BottomNav activeTab="tetapan" />
      </div>
    </div>
  )
}
