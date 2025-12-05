'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import BottomNav from '@/components/BottomNav'

export default function AdminProfile() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState({
    nama: '',
    email: '',
    telefon: '',
    jabatan: ''
  })
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: ''
  })
  const [isEditing, setIsEditing] = useState(false)
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (!userData) { 
      router.push('/login')
      return
    }
    const parsedUser = JSON.parse(userData)
    setUser(parsedUser)
    
    // Fetch complete profile data
    const fetchProfile = async () => {
      try {
        const response = await fetch('/api/admin/profile')
        if (response.ok) {
          const data = await response.json()
          setProfile({
            nama: data.nama || parsedUser.nama || '',
            email: data.email || parsedUser.email || '',
            telefon: data.telefon || '',
            jabatan: data.jabatan || ''
          })
        }
      } catch (error) {
        console.error('Error fetching profile:', error)
        // Use stored user data as fallback
        setProfile({
          nama: parsedUser.nama || '',
          email: parsedUser.email || '',
          telefon: '',
          jabatan: ''
        })
      }
    }
    
    fetchProfile()
  }, [router])

  const handleUpdateProfile = async () => {
    setLoading(true)
    setMessage('')
    
    try {
      const response = await fetch('/api/admin/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile)
      })
      
      const data = await response.json()
      
      if (response.ok) {
        setMessage('Profil berjaya dikemas kini!')
        setIsEditing(false)
        
        // Update localStorage
        const updatedUser = { ...user, nama: profile.nama, email: profile.email }
        localStorage.setItem('user', JSON.stringify(updatedUser))
        setUser(updatedUser)
      } else {
        setMessage(data.error || 'Ralat mengemaskini profil')
      }
    } catch (error) {
      setMessage('Ralat mengemaskini profil')
    } finally {
      setLoading(false)
    }
  }

  const handleChangePassword = async () => {
    if (passwords.new !== passwords.confirm) {
      setMessage('Kata laluan baru tidak sepadan')
      return
    }
    
    if (passwords.new.length < 6) {
      setMessage('Kata laluan baru mestilah sekurang-kurangnya 6 aksara')
      return
    }
    
    setLoading(true)
    setMessage('')
    
    try {
      const response = await fetch('/api/admin/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: passwords.current,
          newPassword: passwords.new
        })
      })
      
      const data = await response.json()
      
      if (response.ok) {
        setMessage('Kata laluan berjaya dikemas kini!')
        setIsChangingPassword(false)
        setPasswords({ current: '', new: '', confirm: '' })
      } else {
        setMessage(data.error || 'Ralat menukar kata laluan')
      }
    } catch (error) {
      setMessage('Ralat menukar kata laluan')
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
          <h1 className="text-2xl font-bold text-gray-900">Profil Admin</h1>
          <p className="text-sm text-gray-600">Urus maklumat profil anda</p>
        </div>

        {/* Message */}
        {message && (
          <div className={`p-3 rounded-lg mb-4 text-sm ${
            message.includes('berjaya') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
            {message}
          </div>
        )}

        {/* Profile Information */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-900">Maklumat Profil</h2>
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-600"
              >
                Edit Profil
              </button>
            ) : (
              <div className="space-x-2">
                <button
                  onClick={handleUpdateProfile}
                  disabled={loading}
                  className="bg-green-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-600 disabled:opacity-50"
                >
                  {loading ? 'Menyimpan...' : 'Simpan'}
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false)
                    setMessage('')
                  }}
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-600"
                >
                  Batal
                </button>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nama</label>
              {isEditing ? (
                <input
                  type="text"
                  value={profile.nama}
                  onChange={(e) => setProfile({...profile, nama: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Masukkan nama penuh"
                />
              ) : (
                <div className="p-3 bg-gray-50 rounded-lg text-gray-900">{profile.nama || 'Tidak dinyatakan'}</div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              {isEditing ? (
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({...profile, email: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Masukkan alamat email"
                />
              ) : (
                <div className="p-3 bg-gray-50 rounded-lg text-gray-900">{profile.email || 'Tidak dinyatakan'}</div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">No. Telefon</label>
              {isEditing ? (
                <input
                  type="tel"
                  value={profile.telefon}
                  onChange={(e) => setProfile({...profile, telefon: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Masukkan no. telefon"
                />
              ) : (
                <div className="p-3 bg-gray-50 rounded-lg text-gray-900">{profile.telefon || 'Tidak dinyatakan'}</div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Jabatan</label>
              {isEditing ? (
                <input
                  type="text"
                  value={profile.jabatan}
                  onChange={(e) => setProfile({...profile, jabatan: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Masukkan jabatan"
                />
              ) : (
                <div className="p-3 bg-gray-50 rounded-lg text-gray-900">{profile.jabatan || 'Tidak dinyatakan'}</div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Peranan</label>
              <div className="p-3 bg-gray-50 rounded-lg text-gray-900">Administrator</div>
            </div>
          </div>
        </div>

        {/* Password Change */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-900">Tukar Kata Laluan</h2>
            {!isChangingPassword ? (
              <button
                onClick={() => setIsChangingPassword(true)}
                className="bg-orange-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-orange-600"
              >
                Tukar Kata Laluan
              </button>
            ) : (
              <div className="space-x-2">
                <button
                  onClick={handleChangePassword}
                  disabled={loading}
                  className="bg-green-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-600 disabled:opacity-50"
                >
                  {loading ? 'Menyimpan...' : 'Tukar'}
                </button>
                <button
                  onClick={() => {
                    setIsChangingPassword(false)
                    setPasswords({ current: '', new: '', confirm: '' })
                    setMessage('')
                  }}
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-600"
                >
                  Batal
                </button>
              </div>
            )}
          </div>

          {isChangingPassword && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Kata Laluan Semasa</label>
                <input
                  type="password"
                  value={passwords.current}
                  onChange={(e) => setPasswords({...passwords, current: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Masukkan kata laluan semasa"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Kata Laluan Baru</label>
                <input
                  type="password"
                  value={passwords.new}
                  onChange={(e) => setPasswords({...passwords, new: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Masukkan kata laluan baru (min. 6 aksara)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sahkan Kata Laluan Baru</label>
                <input
                  type="password"
                  value={passwords.confirm}
                  onChange={(e) => setPasswords({...passwords, confirm: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Sahkan kata laluan baru"
                />
              </div>
            </div>
          )}
        </div>
        <BottomNav activeTab="profile" />
      </div>
    </div>
  )
}
