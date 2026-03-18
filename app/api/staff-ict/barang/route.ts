export const runtime = 'nodejs'

import { NextRequest, NextResponse } from 'next/server'
import { getMockBarangCollection } from '@/lib/mock-database'

// Configure for Cloudflare Pages Edge Runtime

export async function GET(request: NextRequest) {
  try {
    const db = (process.env as any).DB
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') || ''
    const kategori = searchParams.get('kategori') || ''
    const status = searchParams.get('status') || ''

    // Mock data for local dev
    if (!db || typeof db.prepare !== 'function') {
      if (process.env.NODE_ENV === 'production') {
        return NextResponse.json(
          { success: false, error: 'Database tidak tersedia. Sila hubungi admin.' },
          { status: 503 }
        )
      }
      const mockCollection = getMockBarangCollection({ search, kategori, status })

      return NextResponse.json({
        success: true,
        barang: mockCollection.barang,
        stats: mockCollection.stats
      })
    }

    // Build query conditions
    let query = 'SELECT * FROM barang WHERE 1=1'
    const params: any[] = []

    if (search) {
      query += ' AND (namaBarang LIKE ? OR kodBarang LIKE ?)'
      params.push(`%${search}%`, `%${search}%`)
    }

    if (kategori && kategori !== 'all') {
      query += ' AND kategori = ?'
      params.push(kategori)
    }

    if (status && status !== 'all') {
      query += ' AND status = ?'
      params.push(status)
    }

    query += ' ORDER BY namaBarang ASC'

    const result = await db.prepare(query).bind(...params).all()

    // Get stats
    const statsResult = await db.prepare(`
      SELECT
        COUNT(*) as totalItems,
        SUM(CASE WHEN status = 'Tersedia' THEN 1 ELSE 0 END) as tersedia,
        SUM(CASE WHEN status = 'Tidak Tersedia' THEN 1 ELSE 0 END) as dipinjam,
        SUM(CASE WHEN status = 'Rosak' THEN 1 ELSE 0 END) as rosak
      FROM barang
    `).first()

    return NextResponse.json({
      success: true,
      barang: result.results || [],
      stats: statsResult || {
        totalItems: 0,
        tersedia: 0,
        dipinjam: 0,
        rosak: 0
      }
    })

  } catch (error) {
    console.error('Staff barang GET error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error'
      },
      { status: 500 }
    )
  }
}

