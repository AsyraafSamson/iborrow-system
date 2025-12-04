import { NextRequest, NextResponse } from 'next/server'

// Configure for Cloudflare Pages Edge Runtime
export const runtime = 'edge'

export async function GET(request: NextRequest) {
  try {
    const db = (process.env as any).DB
    const { searchParams } = new URL(request.url)
    const format = searchParams.get('format') || 'json' // json or sql

    // Mock data for local dev
    if (!db || typeof db.prepare !== 'function') {
      return NextResponse.json({
        success: true,
        message: 'Backup sedang diproses (Mock mode)',
        data: {
          timestamp: new Date().toISOString(),
          tables: ['users', 'barang', 'tempahan', 'log_aktiviti']
        }
      })
    }

    const timestamp = new Date().toISOString().split('T')[0]
    const backup: any = {
      timestamp: new Date().toISOString(),
      version: '1.0',
      database: 'iborrow'
    }

    // Export all tables
    backup.users = await db.prepare('SELECT * FROM users').all()
    backup.barang = await db.prepare('SELECT * FROM barang').all()
    backup.tempahan = await db.prepare('SELECT * FROM tempahan').all()
    backup.log_aktiviti = await db.prepare('SELECT * FROM log_aktiviti').all()

    if (format === 'json') {
      return new NextResponse(JSON.stringify(backup, null, 2), {
        headers: {
          'Content-Type': 'application/json',
          'Content-Disposition': `attachment; filename="iborrow-backup-${timestamp}.json"`
        }
      })
    } else if (format === 'sql') {
      // Generate SQL dump
      let sqlDump = `-- iBorrow Database Backup\n-- Date: ${backup.timestamp}\n\n`

      // Export users
      sqlDump += `-- Users\n`
      for (const user of backup.users.results) {
        const values = [
          user.id, user.email, user.nama, user.peranan, user.fakulti,
          user.no_telefon, user.no_matrik, user.no_staf, user.password_hash, user.status
        ].map(v => v === null ? 'NULL' : `'${v}'`).join(', ')
        sqlDump += `INSERT INTO users VALUES (${values});\n`
      }

      // Add other tables...
      sqlDump += `\n-- Barang\n`
      for (const item of backup.barang.results) {
        sqlDump += `INSERT INTO barang VALUES (...);\n` // Simplified
      }

      return new NextResponse(sqlDump, {
        headers: {
          'Content-Type': 'text/plain',
          'Content-Disposition': `attachment; filename="iborrow-backup-${timestamp}.sql"`
        }
      })
    }

    return NextResponse.json({
      success: true,
      message: 'Backup berjaya',
      data: backup
    })

  } catch (error) {
    console.error('Backup GET error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Gagal membuat backup'
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const db = (process.env as any).DB
    const body = await request.json()

    // Mock response for local dev
    if (!db || typeof db.prepare !== 'function') {
      return NextResponse.json({
        success: true,
        message: 'Restore berjaya (Mock mode)'
      })
    }

    if (!body.backup || !body.backup.users || !body.backup.barang) {
      return NextResponse.json(
        { success: false, error: 'Invalid backup format' },
        { status: 400 }
      )
    }

    // Restore tables (DANGEROUS - Use with caution)
    const restoreMode = body.mode || 'append' // 'replace' or 'append'

    if (restoreMode === 'replace') {
      // Clear existing data
      await db.prepare('DELETE FROM log_aktiviti').run()
      await db.prepare('DELETE FROM tempahan').run()
      await db.prepare('DELETE FROM barang').run()
      await db.prepare('DELETE FROM users').run()
    }

    // Restore users
    for (const user of body.backup.users.results || body.backup.users) {
      await db.prepare(`
        INSERT OR REPLACE INTO users
        (id, email, nama, peranan, fakulti, no_telefon, no_matrik, no_staf, password_hash, status, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).bind(
        user.id, user.email, user.nama, user.peranan, user.fakulti,
        user.no_telefon, user.no_matrik, user.no_staf, user.password_hash,
        user.status, user.created_at, user.updated_at
      ).run()
    }

    // Restore barang
    for (const item of body.backup.barang.results || body.backup.barang) {
      await db.prepare(`
        INSERT OR REPLACE INTO barang
        (id, namaBarang, kategori, kodBarang, kuantitiTersedia, kuantitiTotal,
         lokasi, status, hargaPerolehan, tarikhPerolehan, catatan, createdBy, createdAt, updatedAt)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).bind(
        item.id, item.namaBarang, item.kategori, item.kodBarang,
        item.kuantitiTersedia, item.kuantitiTotal, item.lokasi, item.status,
        item.hargaPerolehan, item.tarikhPerolehan, item.catatan,
        item.createdBy, item.createdAt, item.updatedAt
      ).run()
    }

    // Restore tempahan if exists
    if (body.backup.tempahan) {
      for (const booking of body.backup.tempahan.results || body.backup.tempahan) {
        await db.prepare(`
          INSERT OR REPLACE INTO tempahan
          (id, userId, barangId, kuantiti, tarikhMula, tarikhTamat, tujuan,
           status, catatanKelulusan, diluluskanOleh, tarikhKelulusan, createdAt, updatedAt)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).bind(
          booking.id, booking.userId, booking.barangId, booking.kuantiti,
          booking.tarikhMula, booking.tarikhTamat, booking.tujuan, booking.status,
          booking.catatanKelulusan, booking.diluluskanOleh, booking.tarikhKelulusan,
          booking.createdAt, booking.updatedAt
        ).run()
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Database berjaya dipulihkan dari backup'
    })

  } catch (error) {
    console.error('Backup POST (restore) error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Gagal memulihkan backup'
      },
      { status: 500 }
    )
  }
}
