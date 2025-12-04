'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface User {
  id: string
  email: string
  nama: string
  peranan: string
  fakulti?: string
  no_telefon?: string
  no_matrik?: string
  no_staf?: string
  status: string
  created_at: string
}

export default function AdminPengguna() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterRole, setFilterRole] = useState('all')
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  const [formData, setFormData] = useState({
    email: '',
    nama: '',
    role: 'pelajar',
    fakulti: '',
    no_telefon: '',
    noMatrik: '',
    noStaf: ''
  })

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (!userData) {
      router.push('/login')
      return
    }
    setUser(JSON.parse(userData))
    fetchUsers()
  }, [router])

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/admin/pengguna')
      const data = await res.json()
      if (data.success) {
        setUsers(data.data || [])
      }
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch('/api/admin/pengguna', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const data = await res.json()
      if (data.success) {
        alert(data.message + '\nPassword default: password123')
        setShowModal(false)
        resetForm()
        fetchUsers()
      } else {
        alert(data.error || 'Operasi gagal')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Network error')
    } finally {
      setLoading(false)
    }
  }

  const handleResetPassword = async (id: string, nama: string) => {
    if (!confirm(`Reset password untuk ${nama}?\nPassword akan ditukar kepada: password123`)) return

    try {
      const res = await fetch('/api/admin/pengguna', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, action: 'reset-password' })
      })

      const data = await res.json()
      if (data.success) {
        alert(data.message)
      } else {
        alert(data.error || 'Gagal reset password')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Network error')
    }
  }

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'aktif' ? 'tidak aktif' : 'aktif'
    if (!confirm(`Tukar status kepada "${newStatus}"?`)) return

    try {
      const res = await fetch('/api/admin/pengguna', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus })
      })

      const data = await res.json()
      if (data.success) {
        alert(data.message)
        fetchUsers()
      } else {
        alert(data.error || 'Gagal update status')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Network error')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Adakah anda pasti untuk padam pengguna ini?')) return

    try {
      const res = await fetch('/api/admin/pengguna', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      })

      const data = await res.json()
      if (data.success) {
        alert(data.message)
        fetchUsers()
      } else {
        alert(data.error || 'Gagal padam')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Network error')
    }
  }

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) {
      alert('Sila pilih pengguna untuk dipadam')
      return
    }
    if (!confirm(`Padam ${selectedIds.length} pengguna yang dipilih?`)) return

    try {
      const res = await fetch('/api/admin/pengguna', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: selectedIds })
      })

      const data = await res.json()
      if (data.success) {
        alert(data.message)
        setSelectedIds([])
        fetchUsers()
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Network error')
    }
  }

  const openAddModal = () => {
    resetForm()
    setShowModal(true)
  }

  const resetForm = () => {
    setFormData({
      email: '',
      nama: '',
      role: 'pelajar',
      fakulti: '',
      no_telefon: '',
      noMatrik: '',
      noStaf: ''
    })
  }

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredUsers.length) {
      setSelectedIds([])
    } else {
      setSelectedIds(filteredUsers.map(u => u.id))
    }
  }

  const toggleSelectId = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(i => i !== id))
    } else {
      setSelectedIds([...selectedIds, id])
    }
  }

  const filteredUsers = users.filter(u => {
    const matchSearch = u.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
                       u.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchRole = filterRole === 'all' || u.peranan === filterRole
    return matchSearch && matchRole
  })

  const rolesList = ['admin', 'staff-ict', 'pelajar', 'pengajar', 'staff-pentadbiran']

  if (!user) return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>

  return (
    <div className="min-h-screen bg-gray-50 p-3 pb-24">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
          <h1 className="text-2xl font-bold text-gray-900">Pengurusan Pengguna</h1>
          <p className="text-sm text-gray-600">Urus akaun pengguna sistem</p>
        </div>

        {/* Actions Bar */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
          <div className="flex gap-2 mb-3">
            <button
              onClick={openAddModal}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700"
            >
              + Tambah Pengguna
            </button>
            {selectedIds.length > 0 && (
              <button
                onClick={handleBulkDelete}
                className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-700"
              >
                Padam ({selectedIds.length})
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input
              type="text"
              placeholder="Cari nama atau email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-3 py-2 border rounded-lg text-sm"
            />
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="px-3 py-2 border rounded-lg text-sm"
            >
              <option value="all">Semua Peranan</option>
              {rolesList.map(r => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-gray-600">Loading...</div>
          ) : filteredUsers.length === 0 ? (
            <div className="p-8 text-center text-gray-600">Tiada pengguna dijumpai</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="p-3 text-left">
                      <input
                        type="checkbox"
                        checked={selectedIds.length === filteredUsers.length && filteredUsers.length > 0}
                        onChange={toggleSelectAll}
                      />
                    </th>
                    <th className="p-3 text-left text-sm font-semibold">Nama</th>
                    <th className="p-3 text-left text-sm font-semibold">Email</th>
                    <th className="p-3 text-left text-sm font-semibold">Peranan</th>
                    <th className="p-3 text-left text-sm font-semibold">Fakulti</th>
                    <th className="p-3 text-left text-sm font-semibold">Status</th>
                    <th className="p-3 text-left text-sm font-semibold">Tindakan</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((u) => (
                    <tr key={u.id} className="border-b hover:bg-gray-50">
                      <td className="p-3">
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(u.id)}
                          onChange={() => toggleSelectId(u.id)}
                        />
                      </td>
                      <td className="p-3 text-sm font-medium">{u.nama}</td>
                      <td className="p-3 text-sm">{u.email}</td>
                      <td className="p-3">
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                          {u.peranan}
                        </span>
                      </td>
                      <td className="p-3 text-sm">{u.fakulti || '-'}</td>
                      <td className="p-3">
                        <button
                          onClick={() => handleToggleStatus(u.id, u.status)}
                          className={`px-2 py-1 rounded-full text-xs ${
                            u.status === 'aktif' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {u.status}
                        </button>
                      </td>
                      <td className="p-3">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleResetPassword(u.id, u.nama)}
                            className="text-orange-600 hover:text-orange-800 text-sm"
                          >
                            Reset
                          </button>
                          <button
                            onClick={() => handleDelete(u.id)}
                            className="text-red-600 hover:text-red-800 text-sm"
                          >
                            Padam
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Add User Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <h2 className="text-xl font-bold mb-4">Tambah Pengguna Baru</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium mb-1">Email *</label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="w-full px-3 py-2 border rounded-lg"
                        placeholder="contoh@ilkkm.edu.my"
                        required
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium mb-1">Nama Penuh *</label>
                      <input
                        type="text"
                        value={formData.nama}
                        onChange={(e) => setFormData({...formData, nama: e.target.value})}
                        className="w-full px-3 py-2 border rounded-lg"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Peranan *</label>
                      <select
                        value={formData.role}
                        onChange={(e) => setFormData({...formData, role: e.target.value})}
                        className="w-full px-3 py-2 border rounded-lg"
                        required
                      >
                        {rolesList.map(r => (
                          <option key={r} value={r}>{r}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Fakulti/Jabatan</label>
                      <input
                        type="text"
                        value={formData.fakulti}
                        onChange={(e) => setFormData({...formData, fakulti: e.target.value})}
                        className="w-full px-3 py-2 border rounded-lg"
                        placeholder="cth: Kejururawatan"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">No. Telefon</label>
                      <input
                        type="text"
                        value={formData.no_telefon}
                        onChange={(e) => setFormData({...formData, no_telefon: e.target.value})}
                        className="w-full px-3 py-2 border rounded-lg"
                        placeholder="0123456789"
                      />
                    </div>

                    {(formData.role === 'pelajar') && (
                      <div>
                        <label className="block text-sm font-medium mb-1">No. Matrik</label>
                        <input
                          type="text"
                          value={formData.noMatrik}
                          onChange={(e) => setFormData({...formData, noMatrik: e.target.value})}
                          className="w-full px-3 py-2 border rounded-lg"
                          placeholder="MT202301234"
                        />
                      </div>
                    )}

                    {(formData.role === 'staff-ict' || formData.role === 'staff-pentadbiran' || formData.role === 'pengajar') && (
                      <div>
                        <label className="block text-sm font-medium mb-1">No. Staf</label>
                        <input
                          type="text"
                          value={formData.noStaf}
                          onChange={(e) => setFormData({...formData, noStaf: e.target.value})}
                          className="w-full px-3 py-2 border rounded-lg"
                          placeholder="STF2023001"
                        />
                      </div>
                    )}
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <p className="text-sm text-yellow-800">
                      Password default: <strong>password123</strong>
                    </p>
                    <p className="text-xs text-yellow-700 mt-1">
                      Pengguna boleh tukar password selepas login
                    </p>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                    >
                      {loading ? 'Memproses...' : 'Tambah Pengguna'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400"
                    >
                      Batal
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Bottom Nav */}
        <div className="fixed bottom-4 left-4 right-4 bg-white rounded-2xl shadow-lg p-3 flex justify-around">
          <Link href="/admin/dashboard" className="flex flex-col items-center text-gray-600"><div>📊</div><div className="text-xs">Dashboard</div></Link>
          <Link href="/admin/pengguna" className="flex flex-col items-center text-blue-600"><div>👥</div><div className="text-xs">Pengguna</div></Link>
          <Link href="/admin/barang" className="flex flex-col items-center text-gray-600"><div>📦</div><div className="text-xs">Barang</div></Link>
          <Link href="/admin/laporan" className="flex flex-col items-center text-gray-600"><div>📈</div><div className="text-xs">Laporan</div></Link>
          <Link href="/admin/tetapan/sistem" className="flex flex-col items-center text-gray-600"><div>⚙️</div><div className="text-xs">Tetapan</div></Link>
          <Link href="/admin/profile" className="flex flex-col items-center text-gray-600"><div>👤</div><div className="text-xs">Profil</div></Link>
        </div>
      </div>
    </div>
  )
}
