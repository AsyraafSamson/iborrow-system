'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface UserProfile {
  id: string
  email: string
  nama: string
  peranan: string
  fakulti: string
  no_telefon: string
  no_matrik: string
  status: string
}

export default function UserProfile() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [changingPassword, setChangingPassword] = useState(false)
  const [formData, setFormData] = useState({
    nama: '',
    email: '',
    fakulti: '',
    no_telefon: '',
    no_matrik: ''
  })
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [message, setMessage] = useState({ type: '', text: '' })

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (!userData) { 
      router.push('/login')
      return 
    }
    setUser(JSON.parse(userData))
    fetchProfile(JSON.parse(userData).id)
  }, [router])

  const fetchProfile = async (userId: string) => {
    try {
      const response = await fetch(`/api/user/profile?userId=${userId}`)
      const data = await response.json()
      
      if (data.success) {
        setProfile(data.data)
        setFormData({
          nama: data.data.nama || '',
          email: data.data.email || '',
          fakulti: data.data.fakulti || '',
          no_telefon: data.data.no_telefon || '',
          no_matrik: data.data.no_matrik || ''
        })
      } else {
        setMessage({ type: 'error', text: 'Gagal memuat profil' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Ralat rangkaian' })
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!profile) return

    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: profile.id,
          ...formData
        })
      })

      const data = await response.json()
      if (data.success) {
        setMessage({ type: 'success', text: 'Profil berjaya dikemaskini' })
        setEditing(false)
        fetchProfile(profile.id)
        
        // Update localStorage if nama changed
        if (user.nama !== formData.nama) {
          const updatedUser = { ...user, nama: formData.nama }
          localStorage.setItem('user', JSON.stringify(updatedUser))
          setUser(updatedUser)
        }
      } else {
        setMessage({ type: 'error', text: data.error || 'Gagal kemaskini profil' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Ralat rangkaian' })
    }
  }

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!profile) return

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: 'error', text: 'Password baru dan pengesahan tidak sepadan' })
      return
    }

    if (passwordData.newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Password baru mestilah sekurang-kurangnya 6 aksara' })
      return
    }

    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: profile.id,
          action: 'change-password',
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        })
      })

      const data = await response.json()
      if (data.success) {
        setMessage({ type: 'success', text: 'Password berjaya ditukar' })
        setChangingPassword(false)
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
      } else {
        setMessage({ type: 'error', text: data.error || 'Gagal tukar password' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Ralat rangkaian' })
    }
  }

  if (loading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>
  }

  if (!user || !profile) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Profile not found</div>
  }

  return (
    <div className="min-h-screen bg-gray-50 p-3 pb-24">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-gray-900">👤 Profil Saya</h1>
            {!editing && !changingPassword && (
              <button
                onClick={() => setEditing(true)}
                className="bg-blue-500 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-blue-600"
              >
                ✏️ Edit
              </button>
            )}
          </div>
        </div>

        {/* Alert Messages */}
        {message.text && (
          <div className={`mb-4 p-3 rounded-lg ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {message.text}
          </div>
        )}

        {/* Profile Card */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
          {/* Avatar & Basic Info */}
          <div className="flex items-start gap-4 mb-6 pb-4 border-b">
            <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
              {profile.nama ? profile.nama.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-gray-900 text-lg">{profile.nama}</h3>
              <p className="text-gray-600 text-sm">{profile.email}</p>
              <p className="text-gray-500 text-sm capitalize">{profile.peranan}</p>
              <span className={`inline-block mt-1 px-2 py-1 rounded-full text-xs ${
                profile.status === 'aktif' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {profile.status === 'aktif' ? 'Aktif' : 'Tidak Aktif'}
              </span>
            </div>
          </div>

          {/* Profile Form */}
          {editing ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nama Penuh</label>
                  <input
                    type="text"
                    value={formData.nama}
                    onChange={(e) => setFormData({...formData, nama: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fakulti</label>
                  <select
                    value={formData.fakulti}
                    onChange={(e) => setFormData({...formData, fakulti: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Pilih Fakulti</option>
                    <option value="Kejururawatan">Kejururawatan</option>
                    <option value="Farmasi">Farmasi</option>
                    <option value="Perubatan">Perubatan</option>
                    <option value="Sains Kesihatan">Sains Kesihatan</option>
                    <option value="Pergigian">Pergigian</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">No. Telefon</label>
                  <input
                    type="tel"
                    value={formData.no_telefon}
                    onChange={(e) => setFormData({...formData, no_telefon: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="0123456789"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">No. Matrik</label>
                  <input
                    type="text"
                    value={formData.no_matrik}
                    onChange={(e) => setFormData({...formData, no_matrik: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="ILK2023001"
                  />
                </div>
              </div>
              
              <div className="flex gap-2 pt-4">
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                >
                  💾 Simpan
                </button>
                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
                >
                  ❌ Batal
                </button>
              </div>
            </form>
          ) : changingPassword ? (
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password Semasa</label>
                <input
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password Baru</label>
                <input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                  minLength={6}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pengesahan Password Baru</label>
                <input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div className="flex gap-2 pt-4">
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                >
                  🔐 Tukar Password
                </button>
                <button
                  type="button"
                  onClick={() => setChangingPassword(false)}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
                >
                  ❌ Batal
                </button>
              </div>
            </form>
          ) : (
            /* Profile Display */
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500">Nama Penuh</label>
                  <p className="text-gray-900 font-medium">{profile.nama}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Email</label>
                  <p className="text-gray-900">{profile.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Fakulti</label>
                  <p className="text-gray-900">{profile.fakulti}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">No. Telefon</label>
                  <p className="text-gray-900">{profile.no_telefon || '-'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">No. Matrik</label>
                  <p className="text-gray-900">{profile.no_matrik || '-'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Peranan</label>
                  <p className="text-gray-900 capitalize">{profile.peranan}</p>
                </div>
              </div>
              
              <div className="pt-4 border-t">
                <button
                  onClick={() => setChangingPassword(true)}
                  className="bg-orange-100 text-orange-800 px-4 py-2 rounded-lg hover:bg-orange-200"
                >
                  🔐 Tukar Password
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Navigation */}
        <div className="fixed bottom-4 left-4 right-4 bg-white rounded-2xl shadow-lg p-3 flex justify-around">
          <Link href="/user/dashboard" className="flex flex-col items-center text-gray-600 hover:text-blue-600">
            <div>📊</div><div className="text-xs">Dashboard</div>
          </Link>
          <Link href="/user/barang" className="flex flex-col items-center text-gray-600 hover:text-blue-600">
            <div>📦</div><div className="text-xs">Barang</div>
          </Link>
          <Link href="/user/tempahan" className="flex flex-col items-center text-gray-600 hover:text-blue-600">
            <div>📋</div><div className="text-xs">Tempahan</div>
          </Link>
          <Link href="/user/sejarah" className="flex flex-col items-center text-gray-600 hover:text-blue-600">
            <div>📜</div><div className="text-xs">Sejarah</div>
          </Link>
          <Link href="/user/profile" className="flex flex-col items-center text-blue-600">
            <div>👤</div><div className="text-xs">Profil</div>
          </Link>
        </div>
      </div>
    </div>
  )
}
