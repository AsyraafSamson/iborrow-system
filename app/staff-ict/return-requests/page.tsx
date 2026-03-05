'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import BottomNav from '@/components/BottomNav'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Skeleton } from '@/components/ui/skeleton'

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

const statusVariant = (status: string): "default" | "destructive" | "secondary" | "outline" => {
  if (status === 'completed') return 'default'
  if (status === 'cancelled') return 'outline'
  if (status === 'pending') return 'secondary'
  return 'secondary'
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
    if (!userData) { router.push('/login'); return }
    setUser(JSON.parse(userData))
    fetchRequests('pending')
  }, [router])

  const fetchRequests = async (status: string) => {
    try {
      const res = await fetch(`/api/staff-ict/return-requests?status=${status}`)
      const data = await res.json()
      if (data.success) setRequests(data.data || [])
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
    if (modalAction === 'schedule' && !scheduledTime) { alert('Sila pilih masa jemputan'); return }
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
      if (data.success) { alert(data.message); closeModal(); fetchRequests(filterStatus) }
      else alert(data.error || 'Gagal kemaskini permohonan')
    } catch (error) {
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
    if (request.status === 'pending') return (
      <div className="flex gap-2">
        <Button className="flex-1" size="sm" onClick={() => openModal(request, 'acknowledge')}>Terima</Button>
        <Button className="flex-1" size="sm" variant="secondary" onClick={() => openModal(request, 'schedule')}>Jadual</Button>
        <Button className="flex-1" size="sm" variant="destructive" onClick={() => openModal(request, 'cancel')}>Batal</Button>
      </div>
    )
    if (request.status === 'acknowledged') return (
      <div className="flex gap-2">
        <Button className="flex-1" size="sm" variant="secondary" onClick={() => openModal(request, 'schedule')}>Jadual</Button>
        <Button className="flex-1" size="sm" onClick={() => openModal(request, 'complete')}>Selesai</Button>
      </div>
    )
    if (request.status === 'scheduled') return (
      <Button className="w-full" size="sm" onClick={() => openModal(request, 'complete')}>Tandakan Selesai</Button>
    )
    return null
  }

  const modalTitle = {
    acknowledge: 'Terima Permohonan',
    schedule: 'Jadualkan Jemputan',
    complete: 'Selesaikan Pemulangan',
    cancel: 'Batalkan Permohonan'
  }[modalAction]

  if (!user) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <Skeleton className="h-8 w-32" />
    </div>
  )

  return (
    <div className="min-h-screen bg-background p-3 pb-24">
      <div className="max-w-6xl mx-auto space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Permohonan Pemulangan</CardTitle>
            <p className="text-sm text-muted-foreground">Urus permohonan pemulangan barang dari pengguna</p>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-5 gap-2">
          <Card><CardContent className="pt-4"><div className="text-xl font-bold text-orange-600">{statusCounts.pending}</div><div className="text-xs text-muted-foreground">Pending</div></CardContent></Card>
          <Card><CardContent className="pt-4"><div className="text-xl font-bold text-blue-600">{statusCounts.acknowledged}</div><div className="text-xs text-muted-foreground">Diterima</div></CardContent></Card>
          <Card><CardContent className="pt-4"><div className="text-xl font-bold text-purple-600">{statusCounts.scheduled}</div><div className="text-xs text-muted-foreground">Dijadual</div></CardContent></Card>
          <Card><CardContent className="pt-4"><div className="text-xl font-bold text-green-600">{statusCounts.completed}</div><div className="text-xs text-muted-foreground">Selesai</div></CardContent></Card>
          <Card><CardContent className="pt-4"><div className="text-xl font-bold text-muted-foreground">{statusCounts.cancelled}</div><div className="text-xs text-muted-foreground">Dibatal</div></CardContent></Card>
        </div>

        <Card>
          <CardContent className="pt-4">
            <select value={filterStatus} onChange={(e) => handleFilterChange(e.target.value)} className="border-input dark:bg-input/30 h-9 w-full rounded-md border bg-transparent px-3 text-sm">
              <option value="pending">Pending</option>
              <option value="acknowledged">Diterima</option>
              <option value="scheduled">Dijadual</option>
              <option value="completed">Selesai</option>
              <option value="cancelled">Dibatal</option>
              <option value="all">Semua</option>
            </select>
          </CardContent>
        </Card>

        <div className="space-y-3">
          {loading ? (
            <Card><CardContent className="p-8 text-center text-muted-foreground">Loading...</CardContent></Card>
          ) : requests.length === 0 ? (
            <Card><CardContent className="p-8 text-center text-muted-foreground">Tiada permohonan pemulangan</CardContent></Card>
          ) : (
            requests.map((request) => (
              <Card key={request.id}>
                <CardContent className="pt-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-foreground">{request.itemName}</h3>
                        {request.urgency === 'urgent' && (
                          <Badge variant="destructive" className="text-xs">URGENT</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">Kuantiti: {request.kuantiti} unit</p>
                    </div>
                    <Badge variant={statusVariant(request.status)}>{request.status}</Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-3 text-sm">
                    <div>
                      <span className="text-muted-foreground">Pemohon:</span>
                      <p className="font-medium">{request.userName}</p>
                      <p className="text-xs text-muted-foreground">{request.userEmail}</p>
                      <p className="text-xs text-muted-foreground">{request.userFakulti}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Tempoh Pinjaman:</span>
                      <p className="font-medium text-xs">
                        {new Date(request.tarikhMula).toLocaleDateString('ms-MY')} - {new Date(request.tarikhTamat).toLocaleDateString('ms-MY')}
                      </p>
                    </div>
                  </div>

                  {request.userNotes && (
                    <div className="mb-3">
                      <span className="text-sm text-muted-foreground">Nota Pengguna:</span>
                      <p className="text-sm bg-muted p-2 rounded mt-1">{request.userNotes}</p>
                    </div>
                  )}

                  {request.staffResponse && (
                    <div className="mb-3">
                      <span className="text-sm text-muted-foreground">Respons Staff ({request.staffName}):</span>
                      <p className="text-sm bg-muted p-2 rounded mt-1">{request.staffResponse}</p>
                    </div>
                  )}

                  {request.scheduledTime && (
                    <div className="mb-3 bg-muted p-2 rounded">
                      <span className="text-sm text-muted-foreground">Dijadual:</span>
                      <p className="text-sm font-medium">{new Date(request.scheduledTime).toLocaleString('ms-MY')}</p>
                    </div>
                  )}

                  <div className="text-xs text-muted-foreground mb-3">
                    Dimohon: {new Date(request.createdAt).toLocaleString('ms-MY')}
                    {request.respondedAt && ` • Direspons: ${new Date(request.respondedAt).toLocaleString('ms-MY')}`}
                  </div>

                  {getActionButtons(request)}
                </CardContent>
              </Card>
            ))
          )}
        </div>

        <Dialog open={showModal} onOpenChange={setShowModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{modalTitle}</DialogTitle>
            </DialogHeader>
            {selectedRequest && (
              <>
                <div className="rounded-md bg-secondary p-3 text-sm space-y-1">
                  <p><strong>Barang:</strong> {selectedRequest.itemName}</p>
                  <p><strong>Pemohon:</strong> {selectedRequest.userName}</p>
                  <p><strong>Kuantiti:</strong> {selectedRequest.kuantiti} unit</p>
                </div>

                {modalAction === 'schedule' && (
                  <div className="space-y-2">
                    <Label>Masa Jemputan *</Label>
                    <Input type="datetime-local" value={scheduledTime} onChange={(e) => setScheduledTime(e.target.value)} required />
                  </div>
                )}

                <div className="space-y-2">
                  <Label>{modalAction === 'cancel' ? 'Sebab Pembatalan *' : 'Nota Tambahan (Opsional)'}</Label>
                  <Textarea
                    value={response}
                    onChange={(e) => setResponse(e.target.value)}
                    rows={3}
                    placeholder={modalAction === 'cancel' ? 'Masukkan sebab...' : 'Tambah nota jika perlu...'}
                  />
                </div>

                {modalAction === 'complete' && (
                  <div className="rounded-md bg-green-50 border border-green-200 p-3 text-sm text-green-800">
                    Barang akan ditandakan sebagai dikembalikan dan kuantiti akan dipulihkan ke stok.
                  </div>
                )}
              </>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={closeModal}>Tutup</Button>
              <Button
                variant={modalAction === 'cancel' ? 'destructive' : 'default'}
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? 'Memproses...' : 'Hantar'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <BottomNav activeTab="kelulusan" />
      </div>
    </div>
  )
}
