'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import BottomNav from '@/components/BottomNav'

interface ReturnRequest {
  id: string
  bookingId: string
  userId: string
  userName: string
  userEmail: string
  userFakulti: string
  itemName: string
  kuantiti: number
  urgency: 'normal' | 'urgent'
  userNotes: string
  status: 'pending' | 'acknowledged' | 'scheduled' | 'completed' | 'cancelled'
  staffId?: string
  staffName?: string
  staffResponse?: string
  scheduledTime?: string
  respondedAt?: string
  createdAt: string
  tarikhMula: string
  tarikhTamat: string
  bookingStatus: string
}

export default function StaffReturnRequests() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [requests, setRequests] = useState<ReturnRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState('pending')
  const [selectedRequest, setSelectedRequest] = useState<ReturnRequest | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [modalAction, setModalAction] = useState<'acknowledge' | 'schedule' | 'complete' | 'cancel'>('acknowledge')
  const [response, setResponse] = useState('')
  const [scheduledTime, setScheduledTime] = useState('')

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (!userData) {
      router.push('/login')
      return
    }
    setUser(JSON.parse(userData))
    fetchRequests('pending')
  }, [router])

  const fetchRequests = async (status: string) => {
    try {
      const res = await fetch(`/api/staff-ict/return-requests?status=${status}`)
      const data = await res.json()
      if (data.success) {
        setRequests(data.data || [])
      }
    } catch (error) {
      console.error('Error fetching return requests:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (status: string) => {
    setFilterStatus(status)
    setLoading(true)
    fetchRequests(status)
  }

  const openModal = (request: ReturnRequest, action: typeof modalAction) => {
    setSelectedRequest(request)
    setModalAction(action)
    setResponse('')
    setScheduledTime('')
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setSelectedRequest(null)
    setResponse('')
    setScheduledTime('')
  }

  const handleSubmit = async () => {
    if (!selectedRequest) return

    // Validation
    if (modalAction === 'schedule' && !scheduledTime) {
      alert('Sila pilih masa jemputan')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/staff-ict/return-requests', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requestId: selectedRequest.id,
          action: modalAction,
          response,
          scheduledTime: modalAction === 'schedule' ? scheduledTime : undefined
        })
      })

      const data = await res.json()
      if (data.success) {
        alert(data.message)
        closeModal()
        fetchRequests(filterStatus)
      } else {
        alert(data.error || 'Gagal kemaskini permohonan')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Ralat rangkaian')
    } finally {
      setLoading(false)
    }
  }

  const statusCounts = {
    pending: requests.filter(r => r.status === 'pending').length,
    acknowledged: requests.filter(r => r.status === 'acknowledged').length,
    scheduled: requests.filter(r => r.status === 'scheduled').length,
    completed: requests.filter(r => r.status === 'completed').length,
    cancelled: requests.filter(r => r.status === 'cancelled').length
  }

  const getActionButtons = (request: ReturnRequest) => {
    switch (request.status) {
      case 'pending':
        return (
          <div className="flex gap-2">
            <button
              onClick={() => openModal(request, 'acknowledge')}
              className="flex-1 bg-green-500 text-white py-2 rounded-lg text-sm hover:bg-green-600"
            >
              ✓ Terima
            </button>
            <button
              onClick={() => openModal(request, 'schedule')}
              className="flex-1 bg-blue-500 text-white py-2 rounded-lg text-sm hover:bg-blue-600"
            >
              📅 Jadual
            </button>
            <button
              onClick={() => openModal(request, 'cancel')}
              className="flex-1 bg-red-500 text-white py-2 rounded-lg text-sm hover:bg-red-600"
            >
              ✗ Batal
            </button>
          </div>
        )

      case 'acknowledged':
        return (
          <div className="flex gap-2">
            <button
              onClick={() => openModal(request, 'schedule')}
              className="flex-1 bg-blue-500 text-white py-2 rounded-lg text-sm hover:bg-blue-600"
            >
              📅 Jadual
            </button>
            <button
              onClick={() => openModal(request, 'complete')}
              className="flex-1 bg-green-600 text-white py-2 rounded-lg text-sm hover:bg-green-700"
            >
              ✓ Selesai
            </button>
          </div>
        )

      case 'scheduled':
        return (
          <button
            onClick={() => openModal(request, 'complete')}
            className="w-full bg-green-600 text-white py-2 rounded-lg text-sm hover:bg-green-700"
          >
            ✓ Tandakan Selesai
          </button>
        )

      default:
        return null
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-orange-100 text-orange-800'
      case 'acknowledged': return 'bg-blue-100 text-blue-800'
      case 'scheduled': return 'bg-purple-100 text-purple-800'
      case 'completed': return 'bg-green-100 text-green-800'
      case 'cancelled': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (!user) return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>

  return (
    <div className="min-h-screen bg-gray-50 p-3 pb-24">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
          <h1 className="text-2xl font-bold text-gray-900">↩️ Permohonan Pemulangan</h1>
          <p className="text-sm text-gray-600">Urus permohonan pemulangan barang dari pengguna</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-5 gap-2 mb-4">
          <div className="bg-orange-100 rounded-xl p-3">
            <div className="text-xl font-bold text-orange-800">{statusCounts.pending}</div>
            <div className="text-xs text-orange-600">Pending</div>
          </div>
          <div className="bg-blue-100 rounded-xl p-3">
            <div className="text-xl font-bold text-blue-800">{statusCounts.acknowledged}</div>
            <div className="text-xs text-blue-600">Diterima</div>
          </div>
          <div className="bg-purple-100 rounded-xl p-3">
            <div className="text-xl font-bold text-purple-800">{statusCounts.scheduled}</div>
            <div className="text-xs text-purple-600">Dijadual</div>
          </div>
          <div className="bg-green-100 rounded-xl p-3">
            <div className="text-xl font-bold text-green-800">{statusCounts.completed}</div>
            <div className="text-xs text-green-600">Selesai</div>
          </div>
          <div className="bg-gray-100 rounded-xl p-3">
            <div className="text-xl font-bold text-gray-800">{statusCounts.cancelled}</div>
            <div className="text-xs text-gray-600">Dibatal</div>
          </div>
        </div>

        {/* Filter */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
          <select
            value={filterStatus}
            onChange={(e) => handleFilterChange(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg text-sm"
          >
            <option value="pending">Pending</option>
            <option value="acknowledged">Diterima</option>
            <option value="scheduled">Dijadual</option>
            <option value="completed">Selesai</option>
            <option value="cancelled">Dibatal</option>
            <option value="all">Semua</option>
          </select>
        </div>

        {/* Return Requests List */}
        <div className="space-y-3">
          {loading ? (
            <div className="bg-white rounded-xl shadow-sm p-8 text-center text-gray-600">
              Loading...
            </div>
          ) : requests.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm p-8 text-center text-gray-600">
              Tiada permohonan pemulangan
            </div>
          ) : (
            requests.map((request) => (
              <div key={request.id} className="bg-white rounded-xl shadow-sm p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-gray-900">{request.itemName}</h3>
                      {request.urgency === 'urgent' && (
                        <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                          🔥 URGENT
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">Kuantiti: {request.kuantiti} unit</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                    {request.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div className="text-sm">
                    <span className="text-gray-600">Pemohon:</span>
                    <p className="font-medium">{request.userName}</p>
                    <p className="text-xs text-gray-500">{request.userEmail}</p>
                    <p className="text-xs text-gray-500">{request.userFakulti}</p>
                  </div>
                  <div className="text-sm">
                    <span className="text-gray-600">Tempoh Pinjaman:</span>
                    <p className="font-medium text-xs">
                      {new Date(request.tarikhMula).toLocaleDateString('ms-MY')} - {new Date(request.tarikhTamat).toLocaleDateString('ms-MY')}
                    </p>
                  </div>
                </div>

                {request.userNotes && (
                  <div className="mb-3">
                    <span className="text-sm text-gray-600">Nota Pengguna:</span>
                    <p className="text-sm bg-blue-50 p-2 rounded mt-1">{request.userNotes}</p>
                  </div>
                )}

                {request.staffResponse && (
                  <div className="mb-3">
                    <span className="text-sm text-gray-600">Respons Staff ({request.staffName}):</span>
                    <p className="text-sm bg-green-50 p-2 rounded mt-1">{request.staffResponse}</p>
                  </div>
                )}

                {request.scheduledTime && (
                  <div className="mb-3 bg-purple-50 p-2 rounded">
                    <span className="text-sm text-gray-600">📅 Dijadual:</span>
                    <p className="text-sm font-medium">{new Date(request.scheduledTime).toLocaleString('ms-MY')}</p>
                  </div>
                )}

                <div className="text-xs text-gray-500 mb-3">
                  Dimohon: {new Date(request.createdAt).toLocaleString('ms-MY')}
                  {request.respondedAt && ` • Direspons: ${new Date(request.respondedAt).toLocaleString('ms-MY')}`}
                </div>

                {getActionButtons(request)}
              </div>
            ))
          )}
        </div>

        {/* Action Modal */}
        {showModal && selectedRequest && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-md w-full">
              <div className="p-6">
                <h2 className="text-xl font-bold mb-4">
                  {modalAction === 'acknowledge' && '✓ Terima Permohonan'}
                  {modalAction === 'schedule' && '📅 Jadualkan Jemputan'}
                  {modalAction === 'complete' && '✓ Selesaikan Pemulangan'}
                  {modalAction === 'cancel' && '✗ Batalkan Permohonan'}
                </h2>

                <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm"><strong>Barang:</strong> {selectedRequest.itemName}</p>
                  <p className="text-sm"><strong>Pemohon:</strong> {selectedRequest.userName}</p>
                  <p className="text-sm"><strong>Kuantiti:</strong> {selectedRequest.kuantiti} unit</p>
                </div>

                {modalAction === 'schedule' && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Masa Jemputan *</label>
                    <input
                      type="datetime-local"
                      value={scheduledTime}
                      onChange={(e) => setScheduledTime(e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg"
                      required
                    />
                  </div>
                )}

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">
                    {modalAction === 'cancel' ? 'Sebab Pembatalan *' : 'Nota Tambahan (Opsional)'}
                  </label>
                  <textarea
                    value={response}
                    onChange={(e) => setResponse(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg"
                    rows={3}
                    placeholder={modalAction === 'cancel' ? 'Masukkan sebab...' : 'Tambah nota jika perlu...'}
                  />
                </div>

                {modalAction === 'complete' && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                    <p className="text-sm text-green-800">
                      ✓ Barang akan ditandakan sebagai dikembalikan dan kuantiti akan dipulihkan ke stok.
                    </p>
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className={`flex-1 text-white py-2 rounded-lg disabled:opacity-50 ${
                      modalAction === 'cancel'
                        ? 'bg-red-600 hover:bg-red-700'
                        : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                  >
                    {loading ? 'Memproses...' : 'Hantar'}
                  </button>
                  <button
                    onClick={closeModal}
                    className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400"
                  >
                    Tutup
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Bottom Nav */}
        <BottomNav activeTab="kelulusan" />
      </div>
    </div>
  )
}
