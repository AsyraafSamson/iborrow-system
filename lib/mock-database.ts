import { existsSync, readFileSync } from 'node:fs'
import path from 'node:path'
import bundledSnapshot from '@/data/remote-d1-snapshot.json'

type UserRole = 'admin' | 'staff-ict' | 'pelajar' | 'pengajar' | 'staff-pentadbiran'
type UserStatus = 'aktif' | 'tidak aktif'
type BarangStatus = 'Tersedia' | 'Dipinjam' | 'Rosak' | 'Diselenggara'
type TempahanStatus = 'Pending' | 'Diluluskan' | 'Ditolak' | 'Selesai' | 'Dibatalkan' | 'Aktif'

export interface MockUserRecord {
  id: string
  email: string
  nama: string
  peranan: UserRole
  fakulti: string | null
  no_telefon: string | null
  no_matrik: string | null
  no_staf: string | null
  password_hash: string
  status: UserStatus
  last_login: string | null
  created_at: string
  updated_at: string
}

export interface MockBarangRecord {
  id: string
  namaBarang: string
  kategori: string
  kodBarang: string
  kuantitiTersedia: number
  kuantitiTotal: number
  lokasi: string
  status: BarangStatus
  hargaPerolehan: number | null
  tarikhPerolehan: string | null
  catatan: string | null
  gambarUrl: string | null
  createdBy: string | null
  createdAt: string
  updatedAt: string
}

export interface MockTempahanRecord {
  id: string
  userId: string
  barangId: string
  kuantiti: number
  tarikhMula: string
  tarikhTamat: string
  tujuan: string
  status: TempahanStatus
  catatanKelulusan: string | null
  diluluskanOleh: string | null
  tarikhKelulusan: string | null
  createdAt: string
  updatedAt: string
}

export interface MockLogAktivitiRecord {
  id: string
  userId: string
  jenisAktiviti: string
  keterangan: string
  ipAddress: string | null
  userAgent: string | null
  createdAt: string
}

export interface MockReturnRequestRecord {
  id: string
  tempahanId: string
  userId: string
  requestDate: string
  status: string
  notes: string | null
  approvedBy: string | null
  approvedAt: string | null
  createdAt: string
  updatedAt: string
}

interface SnapshotShape {
  generatedAt: string
  source: {
    databaseName: string
    databaseId: string
  }
  tables: {
    users: MockUserRecord[]
    barang: MockBarangRecord[]
    tempahan: MockTempahanRecord[]
    log_aktiviti: MockLogAktivitiRecord[]
    return_requests: MockReturnRequestRecord[]
  }
}

function loadSnapshot(): SnapshotShape {
  const localSnapshotPath = path.join(process.cwd(), 'data', 'remote-d1-snapshot.local.json')

  if (process.env.NODE_ENV !== 'production' && existsSync(localSnapshotPath)) {
    try {
      const raw = readFileSync(localSnapshotPath, 'utf8')
      return JSON.parse(raw) as SnapshotShape
    } catch (error) {
      console.warn('Gagal membaca snapshot tempatan. Guna snapshot terbina dalam.', error)
    }
  }

  return bundledSnapshot as SnapshotShape
}

const data = loadSnapshot()

function cloneArray<T>(items: T[]): T[] {
  return items.map((item) => ({ ...item }))
}

export function getMockSnapshotMeta() {
  return { ...data.source, generatedAt: data.generatedAt }
}

export function getMockUsers(): MockUserRecord[] {
  return cloneArray(data.tables.users)
}

export function getMockBarang(): MockBarangRecord[] {
  return cloneArray(data.tables.barang)
}

export function getMockTempahan(): MockTempahanRecord[] {
  return cloneArray(data.tables.tempahan)
}

export function getMockLogAktiviti(): MockLogAktivitiRecord[] {
  return cloneArray(data.tables.log_aktiviti)
}

export function getMockReturnRequests(): MockReturnRequestRecord[] {
  return cloneArray(data.tables.return_requests)
}

export function findMockUserByEmail(email: string): MockUserRecord | null {
  const normalizedEmail = email.trim().toLowerCase()
  return data.tables.users.find(
    (user) => user.email.toLowerCase() === normalizedEmail && user.status === 'aktif'
  ) ?? null
}

export function findMockUserById(id: string): MockUserRecord | null {
  return data.tables.users.find(
    (user) => user.id === id && user.status === 'aktif'
  ) ?? null
}

export function getMockAdminDashboardStats() {
  const tempahan = data.tables.tempahan
  const barang = data.tables.barang
  const users = data.tables.users

  return {
    totalUsers: users.length,
    totalBarang: barang.length,
    tempahanAktif: tempahan.filter(
      (item) => item.status === 'Diluluskan' || item.status === 'Aktif'
    ).length,
    tempahanPending: tempahan.filter((item) => item.status === 'Pending').length,
    totalKuantiti: barang.reduce((total, item) => total + Number(item.kuantitiTersedia || 0), 0),
  }
}

export function getMockBarangCollection(filters?: {
  search?: string
  kategori?: string
  status?: string
}) {
  const search = filters?.search?.trim().toLowerCase() ?? ''
  const kategori = filters?.kategori ?? ''
  const status = filters?.status ?? ''

  let barang = getMockBarang()

  if (search) {
    barang = barang.filter(
      (item) =>
        item.namaBarang.toLowerCase().includes(search) ||
        item.kodBarang.toLowerCase().includes(search)
    )
  }

  if (kategori && kategori !== 'all') {
    barang = barang.filter((item) => item.kategori === kategori)
  }

  if (status && status !== 'all') {
    barang = barang.filter((item) => item.status === status)
  }

  const allBarang = data.tables.barang

  return {
    barang,
    stats: {
      totalItems: allBarang.length,
      tersedia: allBarang.filter((item) => item.status === 'Tersedia').length,
      dipinjam: allBarang.filter((item) => item.status === 'Dipinjam').length,
      rosak: allBarang.filter((item) => item.status === 'Rosak').length,
    },
  }
}

export function getMockLaporanData() {
  const tempahan = data.tables.tempahan
  const barang = data.tables.barang

  const tempahanBulanMap = new Map<string, number>()
  for (const item of tempahan) {
    const monthKey = item.createdAt.slice(0, 7)
    tempahanBulanMap.set(monthKey, (tempahanBulanMap.get(monthKey) ?? 0) + 1)
  }

  const topBarangMap = new Map<string, number>()
  for (const item of tempahan) {
    topBarangMap.set(item.barangId, (topBarangMap.get(item.barangId) ?? 0) + 1)
  }

  const tempahanBulan = Array.from(tempahanBulanMap.entries())
    .sort(([left], [right]) => right.localeCompare(left))
    .slice(0, 6)
    .map(([bulan, jumlah]) => ({ bulan, jumlah }))

  const topBarang = Array.from(topBarangMap.entries())
    .map(([barangId, jumlahTempahan]) => {
      const matchedBarang = barang.find((item) => item.id === barangId)
      if (!matchedBarang) {
        return null
      }

      return {
        namaBarang: matchedBarang.namaBarang,
        kategori: matchedBarang.kategori,
        jumlahTempahan,
      }
    })
    .filter((item): item is NonNullable<typeof item> => item !== null)
    .sort((left, right) => right.jumlahTempahan - left.jumlahTempahan)
    .slice(0, 5)

  const kategoriMap = new Map<string, number>()
  for (const item of barang) {
    kategoriMap.set(item.kategori, (kategoriMap.get(item.kategori) ?? 0) + 1)
  }

  const barangMengikutKategori = Array.from(kategoriMap.entries())
    .map(([kategori, jumlah]) => ({ kategori, jumlah }))
    .sort((left, right) => right.jumlah - left.jumlah)

  return {
    ringkasan: {
      totalTempahan: tempahan.length,
      tempahanPending: tempahan.filter((item) => item.status === 'Pending').length,
      tempahanDiluluskan: tempahan.filter(
        (item) => item.status === 'Diluluskan' || item.status === 'Aktif'
      ).length,
      tempahanSelesai: tempahan.filter((item) => item.status === 'Selesai').length,
      tempahanDitolak: tempahan.filter((item) => item.status === 'Ditolak').length,
    },
    tempahanBulan,
    topBarang,
    barangMengikutKategori,
  }
}
