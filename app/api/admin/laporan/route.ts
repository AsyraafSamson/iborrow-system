import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const db = (process.env as any).DB

    // Mock data for local dev
    if (!db || typeof db.prepare !== 'function') {
      return NextResponse.json({
        success: true,
        data: {
          ringkasan: {
            totalTempahan: 124,
            tempahanPending: 8,
            tempahanDiluluskan: 23,
            tempahanSelesai: 87,
            tempahanDitolak: 6,
          },
          tempahanBulan: [
            { bulan: 'Okt', jumlah: 18 },
            { bulan: 'Nov', jumlah: 22 },
            { bulan: 'Dis', jumlah: 15 },
            { bulan: 'Jan', jumlah: 27 },
            { bulan: 'Feb', jumlah: 20 },
            { bulan: 'Mac', jumlah: 22 },
          ],
          topBarang: [
            { namaBarang: 'Laptop Dell Latitude 5420', kategori: 'Komputer', jumlahTempahan: 34 },
            { namaBarang: 'Projektor Epson EB-X41', kategori: 'Multimedia', jumlahTempahan: 28 },
            { namaBarang: 'Kamera Canon EOS 90D', kategori: 'Multimedia', jumlahTempahan: 21 },
            { namaBarang: 'Tablet Samsung Galaxy Tab S8', kategori: 'Komputer', jumlahTempahan: 19 },
            { namaBarang: 'Mic Wireless Shure SM58', kategori: 'Audio', jumlahTempahan: 14 },
          ],
          barangMengikutKategori: [
            { kategori: 'Komputer', jumlah: 20 },
            { kategori: 'Multimedia', jumlah: 13 },
            { kategori: 'Rangkaian', jumlah: 6 },
            { kategori: 'Audio', jumlah: 8 },
            { kategori: 'Pencetak', jumlah: 4 },
          ],
        }
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
