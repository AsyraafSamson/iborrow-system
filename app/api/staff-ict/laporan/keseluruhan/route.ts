import { NextRequest, NextResponse } from 'next/server'
export async function GET(request: NextRequest) {
  try {
    const db = (process.env as any).DB

    // Mock data for local dev
    if (!db || typeof db.prepare !== 'function') {
      return NextResponse.json({
        success: true,
        data: {
          totalTempahan: 50,
          tempahanLulus: 35,
          tempahanPending: 8,
          tempahanTolak: 7,
          totalBarang: 128,
          barangTersedia: 98,
          totalPelajar: 250,
          totalPengajar: 45
        }
      })
    }

    // Real D1 query
    const stats = await db.prepare(`
      SELECT
        (SELECT COUNT(*) FROM tempahan) as totalTempahan,
        (SELECT COUNT(*) FROM tempahan WHERE status = 'Diluluskan') as tempahanLulus,
        (SELECT COUNT(*) FROM tempahan WHERE status = 'Pending') as tempahanPending,
        (SELECT COUNT(*) FROM tempahan WHERE status = 'Ditolak') as tempahanTolak,
        (SELECT COUNT(*) FROM barang) as totalBarang,
        (SELECT COUNT(*) FROM barang WHERE status = 'Tersedia') as barangTersedia,
        (SELECT COUNT(*) FROM users WHERE peranan = 'pelajar') as totalPelajar,
        (SELECT COUNT(*) FROM users WHERE peranan = 'pengajar') as totalPengajar
    `).first()

    return NextResponse.json({
      success: true,
      data: stats
    })

  } catch (error) {
    console.error('Laporan keseluruhan error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error'
      },
      { status: 500 }
    )
  }
}
