export const runtime = 'nodejs'

import { NextRequest, NextResponse } from 'next/server'
import { getMockLaporanData } from '@/lib/mock-database'

export async function GET(request: NextRequest) {
  try {
    const db = (process.env as any).DB

    // Mock data for local dev
    if (!db || typeof db.prepare !== 'function') {
      if (process.env.NODE_ENV === 'production') {
        return NextResponse.json(
          { success: false, error: 'Database tidak tersedia. Sila hubungi admin.' },
          { status: 503 }
        )
      }
      return NextResponse.json({
        success: true,
        data: getMockLaporanData()
      })
    }

    // Real D1 queries
    const ringkasan = await db.prepare(`
      SELECT
        COUNT(*) as totalTempahan,
        SUM(CASE WHEN status = 'Pending' THEN 1 ELSE 0 END) as tempahanPending,
        SUM(CASE WHEN status = 'Diluluskan' OR status = 'Aktif' THEN 1 ELSE 0 END) as tempahanDiluluskan,
        SUM(CASE WHEN status = 'Selesai' THEN 1 ELSE 0 END) as tempahanSelesai,
        SUM(CASE WHEN status = 'Ditolak' THEN 1 ELSE 0 END) as tempahanDitolak
      FROM tempahan
    `).first()

    const tempahanBulan = await db.prepare(`
      SELECT
        strftime('%m/%Y', createdAt) as bulan,
        COUNT(*) as jumlah
      FROM tempahan
      GROUP BY strftime('%m/%Y', createdAt)
      ORDER BY createdAt DESC
      LIMIT 6
    `).all()

    const topBarang = await db.prepare(`
      SELECT b.namaBarang, b.kategori, COUNT(t.id) as jumlahTempahan
      FROM tempahan t
      JOIN barang b ON t.barangId = b.id
      GROUP BY t.barangId
      ORDER BY jumlahTempahan DESC
      LIMIT 5
    `).all()

    const barangMengikutKategori = await db.prepare(`
      SELECT kategori, COUNT(*) as jumlah
      FROM barang
      GROUP BY kategori
      ORDER BY jumlah DESC
    `).all()

    return NextResponse.json({
      success: true,
      data: {
        ringkasan,
        tempahanBulan: tempahanBulan.results,
        topBarang: topBarang.results,
        barangMengikutKategori: barangMengikutKategori.results,
      }
    })

  } catch (error) {
    console.error('Admin laporan error:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}

