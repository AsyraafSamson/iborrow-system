'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import BottomNav from '@/components/BottomNav'

interface SecuritySettings {
  minPasswordLength: number
  requireUppercase: boolean
  requireLowercase: boolean
  requireNumbers: boolean
  requireSpecialChars: boolean
  passwordExpiryDays: number
  maxLoginAttempts: number
  lockoutDurationMinutes: number
  sessionTimeoutMinutes: number
  enableTwoFactor: boolean
  allowPasswordReset: boolean
  requireEmailVerification: boolean
  loginHistoryRetentionDays: number
}

export default function AdminTetapanKeselamatan() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [settings, setSettings] = useState<SecuritySettings>({
    minPasswordLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: false,
    passwordExpiryDays: 90,
    maxLoginAttempts: 5,
    lockoutDurationMinutes: 30,
    sessionTimeoutMinutes: 60,
    enableTwoFactor: false,
    allowPasswordReset: true,
    requireEmailVerification: false,
    loginHistoryRetentionDays: 90
  })

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (!userData) {
      router.push('/login')
      return
    }
    setUser(JSON.parse(userData))
    fetchSettings()
  }, [router])

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/admin/tetapan/keselamatan')
      const data = await res.json()
      if (data.success) {
        setSettings(data.data)
      }
    } catch (error) {
      console.error('Error fetching settings:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!confirm('Kemaskini tetapan keselamatan?')) return

    setSaving(true)
    try {
      const res = await fetch('/api/admin/tetapan/keselamatan', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings })
      })

      const data = await res.json()
      if (data.success) {
        alert(data.message)
      } else {
        alert(data.error || 'Gagal kemaskini')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Network error')
    } finally {
      setSaving(false)
    }
  }

  const handleReset = () => {
    if (!confirm('Reset kepada tetapan asal?')) return
    setSettings({
      minPasswordLength: 8,
      requireUppercase: true,
      requireLowercase: true,
      requireNumbers: true,
      requireSpecialChars: false,
      passwordExpiryDays: 90,
      maxLoginAttempts: 5,
      lockoutDurationMinutes: 30,
      sessionTimeoutMinutes: 60,
      enableTwoFactor: false,
      allowPasswordReset: true,
      requireEmailVerification: false,
      loginHistoryRetentionDays: 90
    })
  }

  if (!user) return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>

  return (
    <div className="min-h-screen bg-gray-50 p-3 pb-24">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
          <h1 className="text-2xl font-bold text-gray-900">Tetapan Keselamatan</h1>
          <p className="text-sm text-gray-600">Konfigurasi keselamatan dan kawalan akses sistem</p>
        </div>

        {loading ? (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center text-gray-600">
            Loading...
          </div>
        ) : (
          <>
            {/* Password Policy */}
            <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
              <h2 className="text-lg font-semibold mb-3">Dasar Kata Laluan</h2>

              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium mb-1">Panjang Minimum Kata Laluan</label>
                  <input
                    type="number"
                    value={settings.minPasswordLength}
                    onChange={(e) => setSettings({...settings, minPasswordLength: parseInt(e.target.value) || 8})}
                    className="w-full px-3 py-2 border rounded-lg"
                    min="6"
                    max="20"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Tempoh Luput Kata Laluan (Hari)</label>
                  <input
                    type="number"
                    value={settings.passwordExpiryDays}
                    onChange={(e) => setSettings({...settings, passwordExpiryDays: parseInt(e.target.value) || 90})}
                    className="w-full px-3 py-2 border rounded-lg"
                    min="0"
                  />
                  <p className="text-xs text-gray-500 mt-1">0 = Tiada had masa</p>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="requireUppercase"
                    checked={settings.requireUppercase}
                    onChange={(e) => setSettings({...settings, requireUppercase: e.target.checked})}
                    className="w-4 h-4"
                  />
                  <label htmlFor="requireUppercase" className="text-sm">Wajib huruf besar (A-Z)</label>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="requireLowercase"
                    checked={settings.requireLowercase}
                    onChange={(e) => setSettings({...settings, requireLowercase: e.target.checked})}
                    className="w-4 h-4"
                  />
                  <label htmlFor="requireLowercase" className="text-sm">Wajib huruf kecil (a-z)</label>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="requireNumbers"
                    checked={settings.requireNumbers}
                    onChange={(e) => setSettings({...settings, requireNumbers: e.target.checked})}
                    className="w-4 h-4"
                  />
                  <label htmlFor="requireNumbers" className="text-sm">Wajib nombor (0-9)</label>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="requireSpecialChars"
                    checked={settings.requireSpecialChars}
                    onChange={(e) => setSettings({...settings, requireSpecialChars: e.target.checked})}
                    className="w-4 h-4"
                  />
                  <label htmlFor="requireSpecialChars" className="text-sm">Wajib aksara khas (!@#$%)</label>
                </div>
              </div>
            </div>

            {/* Login Security */}
            <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
              <h2 className="text-lg font-semibold mb-3">Keselamatan Log Masuk</h2>

              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium mb-1">Maksimum Percubaan Log Masuk</label>
                  <input
                    type="number"
                    value={settings.maxLoginAttempts}
                    onChange={(e) => setSettings({...settings, maxLoginAttempts: parseInt(e.target.value) || 5})}
                    className="w-full px-3 py-2 border rounded-lg"
                    min="3"
                    max="10"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Tempoh Kunci Akaun (Minit)</label>
                  <input
                    type="number"
                    value={settings.lockoutDurationMinutes}
                    onChange={(e) => setSettings({...settings, lockoutDurationMinutes: parseInt(e.target.value) || 30})}
                    className="w-full px-3 py-2 border rounded-lg"
                    min="5"
                  />
                  <p className="text-xs text-gray-500 mt-1">Selepas melebihi percubaan log masuk</p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Tamat Sesi Automatik (Minit)</label>
                  <input
                    type="number"
                    value={settings.sessionTimeoutMinutes}
                    onChange={(e) => setSettings({...settings, sessionTimeoutMinutes: parseInt(e.target.value) || 60})}
                    className="w-full px-3 py-2 border rounded-lg"
                    min="15"
                  />
                  <p className="text-xs text-gray-500 mt-1">Masa tidak aktif sebelum log keluar</p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Simpan Sejarah Log Masuk (Hari)</label>
                  <input
                    type="number"
                    value={settings.loginHistoryRetentionDays}
                    onChange={(e) => setSettings({...settings, loginHistoryRetentionDays: parseInt(e.target.value) || 90})}
                    className="w-full px-3 py-2 border rounded-lg"
                    min="30"
                  />
                </div>
              </div>
            </div>

            {/* Additional Security */}
            <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
              <h2 className="text-lg font-semibold mb-3">Keselamatan Tambahan</h2>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="enableTwoFactor"
                    checked={settings.enableTwoFactor}
                    onChange={(e) => setSettings({...settings, enableTwoFactor: e.target.checked})}
                    className="w-4 h-4"
                  />
                  <label htmlFor="enableTwoFactor" className="text-sm">Aktifkan Two-Factor Authentication (2FA)</label>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="allowPasswordReset"
                    checked={settings.allowPasswordReset}
                    onChange={(e) => setSettings({...settings, allowPasswordReset: e.target.checked})}
                    className="w-4 h-4"
                  />
                  <label htmlFor="allowPasswordReset" className="text-sm">Benarkan Reset Kata Laluan Sendiri</label>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="requireEmailVerification"
                    checked={settings.requireEmailVerification}
                    onChange={(e) => setSettings({...settings, requireEmailVerification: e.target.checked})}
                    className="w-4 h-4"
                  />
                  <label htmlFor="requireEmailVerification" className="text-sm">Wajib Pengesahan Email</label>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="bg-white rounded-xl shadow-sm p-4">
              <div className="flex gap-3">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {saving ? 'Menyimpan...' : 'Simpan Tetapan'}
                </button>
                <button
                  onClick={handleReset}
                  className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-400"
                >
                  Reset
                </button>
              </div>
            </div>
          </>
        )}

        {/* Bottom Nav */}
        <BottomNav activeTab="tetapan" />
      </div>
    </div>
  )
}
