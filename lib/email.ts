// Email notification utility using Resend API
// For Cloudflare Workers/Pages edge runtime

interface EmailParams {
  to: string
  subject: string
  html: string
}

interface NotificationEmailParams {
  to: string
  userName: string
  type: 'BOOKING_APPROVED' | 'BOOKING_REJECTED' | 'RETURN_UPDATE' | 'NEW_BOOKING' | 'RETURN_REQUEST'
  itemName?: string
  message?: string
  actionUrl?: string
}

export async function sendEmail({ to, subject, html }: EmailParams): Promise<boolean> {
  try {
    const RESEND_API_KEY = (process.env as any).RESEND_API_KEY
    
    if (!RESEND_API_KEY) {
      console.warn('RESEND_API_KEY not configured. Email not sent.')
      return false
    }

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'iBorrow System <noreply@iborrow.pages.dev>',
        to: [to],
        subject,
        html,
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      console.error('Email send failed:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('Email send error:', error)
    return false
  }
}

export async function sendNotificationEmail(params: NotificationEmailParams): Promise<boolean> {
  const { to, userName, type, itemName, message, actionUrl } = params

  let subject = ''
  let html = ''

  const baseUrl = 'https://iborrow.pages.dev'

  switch (type) {
    case 'BOOKING_APPROVED':
      subject = '✅ Tempahan Diluluskan - iBorrow'
      html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #10b981;">Tempahan Diluluskan!</h2>
          <p>Hi ${userName},</p>
          <p>Tempahan anda untuk <strong>${itemName}</strong> telah diluluskan.</p>
          ${message ? `<p><strong>Mesej dari staff:</strong> ${message}</p>` : ''}
          <p>Sila ambil barang anda di pejabat ICT.</p>
          <a href="${baseUrl}/user/tempahan" style="display: inline-block; padding: 10px 20px; background-color: #10b981; color: white; text-decoration: none; border-radius: 5px; margin-top: 10px;">Lihat Tempahan</a>
          <hr style="margin: 20px 0; border: none; border-top: 1px solid #e5e7eb;">
          <p style="color: #6b7280; font-size: 12px;">Ini adalah email automatik dari iBorrow System.</p>
        </div>
      `
      break

    case 'BOOKING_REJECTED':
      subject = '❌ Tempahan Ditolak - iBorrow'
      html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #ef4444;">Tempahan Ditolak</h2>
          <p>Hi ${userName},</p>
          <p>Maaf, tempahan anda untuk <strong>${itemName}</strong> telah ditolak.</p>
          ${message ? `<p><strong>Sebab:</strong> ${message}</p>` : ''}
          <p>Anda boleh buat tempahan baru untuk item lain.</p>
          <a href="${baseUrl}/user/barang" style="display: inline-block; padding: 10px 20px; background-color: #3b82f6; color: white; text-decoration: none; border-radius: 5px; margin-top: 10px;">Lihat Barang</a>
          <hr style="margin: 20px 0; border: none; border-top: 1px solid #e5e7eb;">
          <p style="color: #6b7280; font-size: 12px;">Ini adalah email automatik dari iBorrow System.</p>
        </div>
      `
      break

    case 'RETURN_UPDATE':
      subject = '↩️ Status Pemulangan Dikemaskini - iBorrow'
      html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #3b82f6;">Status Pemulangan Dikemaskini</h2>
          <p>Hi ${userName},</p>
          <p>Status pemulangan untuk <strong>${itemName}</strong> telah dikemaskini.</p>
          ${message ? `<p><strong>Nota:</strong> ${message}</p>` : ''}
          <a href="${baseUrl}/user/tempahan" style="display: inline-block; padding: 10px 20px; background-color: #3b82f6; color: white; text-decoration: none; border-radius: 5px; margin-top: 10px;">Lihat Tempahan</a>
          <hr style="margin: 20px 0; border: none; border-top: 1px solid #e5e7eb;">
          <p style="color: #6b7280; font-size: 12px;">Ini adalah email automatik dari iBorrow System.</p>
        </div>
      `
      break

    case 'NEW_BOOKING':
      subject = '🔔 Tempahan Baru Perlu Diluluskan - iBorrow'
      html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #f59e0b;">Tempahan Baru</h2>
          <p>Hi ${userName},</p>
          <p>Terdapat tempahan baru untuk <strong>${itemName}</strong> yang perlu diluluskan.</p>
          ${message ? `<p><strong>Catatan peminjam:</strong> ${message}</p>` : ''}
          <a href="${baseUrl}/staff-ict/kelulusan" style="display: inline-block; padding: 10px 20px; background-color: #f59e0b; color: white; text-decoration: none; border-radius: 5px; margin-top: 10px;">Lihat Kelulusan</a>
          <hr style="margin: 20px 0; border: none; border-top: 1px solid #e5e7eb;">
          <p style="color: #6b7280; font-size: 12px;">Ini adalah email automatik dari iBorrow System.</p>
        </div>
      `
      break

    case 'RETURN_REQUEST':
      subject = '📦 Permintaan Pemulangan Baru - iBorrow'
      html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #8b5cf6;">Permintaan Pemulangan</h2>
          <p>Hi ${userName},</p>
          <p>Terdapat permintaan pemulangan untuk <strong>${itemName}</strong>.</p>
          ${message ? `<p><strong>Nota:</strong> ${message}</p>` : ''}
          <a href="${baseUrl}/staff-ict/return-requests" style="display: inline-block; padding: 10px 20px; background-color: #8b5cf6; color: white; text-decoration: none; border-radius: 5px; margin-top: 10px;">Lihat Pemulangan</a>
          <hr style="margin: 20px 0; border: none; border-top: 1px solid #e5e7eb;">
          <p style="color: #6b7280; font-size: 12px;">Ini adalah email automatik dari iBorrow System.</p>
        </div>
      `
      break

    default:
      return false
  }

  return sendEmail({ to, subject, html })
}

// Helper to get staff emails for notifications
export async function getStaffEmails(db: any): Promise<string[]> {
  try {
    if (!db || typeof db.prepare !== 'function') {
      return []
    }

    const result = await db.prepare(`
      SELECT email FROM users WHERE peranan = 'staff-ict'
    `).all()

    return result.results.map((user: any) => user.email).filter((email: string) => email)
  } catch (error) {
    console.error('Error fetching staff emails:', error)
    return []
  }
}
