import { NextRequest, NextResponse } from 'next/server'

// Configure for Cloudflare Pages Edge Runtime
export const runtime = 'edge'

export async function GET(request: NextRequest) {
  try {
    const db = (process.env as any).DB

    // Mock data for local dev
    if (!db || typeof db.prepare !== 'function') {
      return NextResponse.json({
        success: true,
        data: {
          maxBookingDays: 7,
          autoApprovalEnabled: false,
          emailNotificationsEnabled: true,
          overdueReminderDays: 1,
          maxBookingPerUser: 3,
          systemMaintenance: false,
          maintenanceMessage: 'Sistem dalam penyelenggaraan',
          bookingTimeStart: '08:00',
          bookingTimeEnd: '17:00',
          allowWeekendBooking: false,
          requireApprovalForCategories: ['Laptop', 'Projector'],
          defaultBookingDuration: 3,
          maxAdvanceBookingDays: 30
        }
      })
    }

    // Get system settings from database
    const settings = await db.prepare(`
      SELECT setting_key, setting_value, data_type 
      FROM system_settings 
      ORDER BY setting_key
    `).all()

    // Convert to object format
    const settingsObj: any = {}
    if (settings.results) {
      settings.results.forEach((setting: any) => {
        let value = setting.setting_value
        
        // Convert based on data type
        if (setting.data_type === 'boolean') {
          value = value === 'true' || value === '1'
        } else if (setting.data_type === 'number') {
          value = parseInt(value) || parseFloat(value)
        } else if (setting.data_type === 'json') {
          try {
            value = JSON.parse(value)
          } catch (e) {
            value = []
          }
        }
        
        settingsObj[setting.setting_key] = value
      })
    }

    return NextResponse.json({
      success: true,
      data: settingsObj
    })

  } catch (error) {
    console.error('System settings GET error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error'
      },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const db = (process.env as any).DB
    const body = await request.json()

    // Mock response for local dev
    if (!db || typeof db.prepare !== 'function') {
      return NextResponse.json({
        success: true,
        message: 'Tetapan sistem berjaya dikemaskini (Mock)'
      })
    }

    const { settings } = body

    if (!settings || typeof settings !== 'object') {
      return NextResponse.json(
        { success: false, error: 'Data tetapan tidak sah' },
        { status: 400 }
      )
    }

    // Create system_settings table if not exists
    await db.prepare(`
      CREATE TABLE IF NOT EXISTS system_settings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        setting_key TEXT UNIQUE NOT NULL,
        setting_value TEXT NOT NULL,
        data_type TEXT DEFAULT 'string',
        description TEXT,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_by TEXT
      )
    `).run()

    // Update each setting
    for (const [key, value] of Object.entries(settings)) {
      let dataType = 'string'
      let stringValue = String(value)

      // Determine data type
      if (typeof value === 'boolean') {
        dataType = 'boolean'
        stringValue = value ? 'true' : 'false'
      } else if (typeof value === 'number') {
        dataType = 'number'
        stringValue = String(value)
      } else if (Array.isArray(value) || (typeof value === 'object' && value !== null)) {
        dataType = 'json'
        stringValue = JSON.stringify(value)
      }

      // Upsert setting
      await db.prepare(`
        INSERT INTO system_settings (setting_key, setting_value, data_type, updated_at)
        VALUES (?, ?, ?, datetime('now'))
        ON CONFLICT(setting_key) 
        DO UPDATE SET 
          setting_value = excluded.setting_value,
          data_type = excluded.data_type,
          updated_at = datetime('now')
      `).bind(key, stringValue, dataType).run()
    }

    return NextResponse.json({
      success: true,
      message: 'Tetapan sistem berjaya dikemaskini'
    })

  } catch (error) {
    console.error('System settings PUT error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error'
      },
      { status: 500 }
    )
  }
}