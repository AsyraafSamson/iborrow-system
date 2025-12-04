// Activity Logger for tracking all system operations
// Compatible with Cloudflare D1 database

export interface ActivityLog {
  id?: string
  user_id: string
  user_name?: string
  action: string
  table_name: string
  record_id?: string
  old_data?: string
  new_data?: string
  ip_address?: string
  user_agent?: string
  timestamp?: string
}

export type ActionType = 
  | 'CREATE' 
  | 'UPDATE' 
  | 'DELETE' 
  | 'LOGIN' 
  | 'LOGOUT' 
  | 'APPROVE' 
  | 'REJECT' 
  | 'VIEW'

/**
 * Log activity to database
 */
export async function logActivity(
  db: any,
  userId: string,
  action: ActionType,
  tableName: string,
  recordId?: string,
  oldData?: any,
  newData?: any,
  request?: Request
): Promise<void> {
  try {
    // Skip if no database connection
    if (!db || typeof db.prepare !== 'function') {
      console.log('Activity log skipped - no DB connection:', { userId, action, tableName })
      return
    }

    // Get user info
    const user = await db.prepare(
      'SELECT nama FROM users WHERE id = ?'
    ).bind(userId).first()

    // Prepare log data
    const logData: Partial<ActivityLog> = {
      user_id: userId,
      user_name: user?.nama || 'Unknown User',
      action,
      table_name: tableName,
      record_id: recordId,
      old_data: oldData ? JSON.stringify(oldData) : null,
      new_data: newData ? JSON.stringify(newData) : null,
      ip_address: getClientIP(request),
      user_agent: request?.headers.get('user-agent') || null,
      timestamp: new Date().toISOString()
    }

    // Insert into log_aktiviti table
    await db.prepare(`
      INSERT INTO log_aktiviti (
        user_id, user_name, action, table_name, record_id, 
        old_data, new_data, ip_address, user_agent, timestamp
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
    `).bind(
      logData.user_id,
      logData.user_name,
      logData.action,
      logData.table_name,
      logData.record_id,
      logData.old_data,
      logData.new_data,
      logData.ip_address,
      logData.user_agent
    ).run()

  } catch (error) {
    // Don't throw error for logging failures
    console.error('Failed to log activity:', error)
  }
}

/**
 * Log user authentication
 */
export async function logAuth(
  db: any,
  userId: string,
  action: 'LOGIN' | 'LOGOUT',
  request?: Request
): Promise<void> {
  return logActivity(db, userId, action, 'users', userId, null, null, request)
}

/**
 * Log CRUD operations
 */
export async function logCRUD(
  db: any,
  userId: string,
  action: 'CREATE' | 'UPDATE' | 'DELETE',
  tableName: string,
  recordId: string,
  oldData?: any,
  newData?: any,
  request?: Request
): Promise<void> {
  return logActivity(db, userId, action, tableName, recordId, oldData, newData, request)
}

/**
 * Log approval/rejection actions
 */
export async function logApproval(
  db: any,
  userId: string,
  action: 'APPROVE' | 'REJECT',
  recordId: string,
  oldData?: any,
  newData?: any,
  request?: Request
): Promise<void> {
  return logActivity(db, userId, action, 'tempahan', recordId, oldData, newData, request)
}

/**
 * Get recent activity logs
 */
export async function getActivityLogs(
  db: any,
  options: {
    limit?: number
    offset?: number
    userId?: string
    action?: ActionType
    tableName?: string
    startDate?: string
    endDate?: string
  } = {}
): Promise<ActivityLog[]> {
  try {
    if (!db || typeof db.prepare !== 'function') {
      return []
    }

    const {
      limit = 50,
      offset = 0,
      userId,
      action,
      tableName,
      startDate,
      endDate
    } = options

    // Build WHERE conditions
    const conditions: string[] = []
    const params: any[] = []

    if (userId) {
      conditions.push('user_id = ?')
      params.push(userId)
    }

    if (action) {
      conditions.push('action = ?')
      params.push(action)
    }

    if (tableName) {
      conditions.push('table_name = ?')
      params.push(tableName)
    }

    if (startDate && endDate) {
      conditions.push('timestamp BETWEEN ? AND ?')
      params.push(startDate, endDate)
    }

    const whereClause = conditions.length > 0 
      ? 'WHERE ' + conditions.join(' AND ') 
      : ''

    const logs = await db.prepare(`
      SELECT * FROM log_aktiviti
      ${whereClause}
      ORDER BY timestamp DESC
      LIMIT ? OFFSET ?
    `).bind(...params, limit, offset).all()

    return logs.results || []

  } catch (error) {
    console.error('Failed to get activity logs:', error)
    return []
  }
}

/**
 * Get activity statistics
 */
export async function getActivityStats(
  db: any,
  days: number = 30
): Promise<{
  totalActions: number
  actionBreakdown: { action: string; count: number }[]
  userActivity: { user_name: string; count: number }[]
  dailyActivity: { date: string; count: number }[]
}> {
  try {
    if (!db || typeof db.prepare !== 'function') {
      return {
        totalActions: 0,
        actionBreakdown: [],
        userActivity: [],
        dailyActivity: []
      }
    }

    // Total actions in period
    const totalResult = await db.prepare(`
      SELECT COUNT(*) as total
      FROM log_aktiviti 
      WHERE timestamp >= DATE('now', '-${days} days')
    `).first()

    // Action breakdown
    const actionBreakdown = await db.prepare(`
      SELECT action, COUNT(*) as count
      FROM log_aktiviti 
      WHERE timestamp >= DATE('now', '-${days} days')
      GROUP BY action
      ORDER BY count DESC
    `).all()

    // User activity
    const userActivity = await db.prepare(`
      SELECT user_name, COUNT(*) as count
      FROM log_aktiviti 
      WHERE timestamp >= DATE('now', '-${days} days')
      GROUP BY user_id, user_name
      ORDER BY count DESC
      LIMIT 10
    `).all()

    // Daily activity
    const dailyActivity = await db.prepare(`
      SELECT DATE(timestamp) as date, COUNT(*) as count
      FROM log_aktiviti 
      WHERE timestamp >= DATE('now', '-${days} days')
      GROUP BY DATE(timestamp)
      ORDER BY date DESC
    `).all()

    return {
      totalActions: totalResult?.total || 0,
      actionBreakdown: actionBreakdown?.results || [],
      userActivity: userActivity?.results || [],
      dailyActivity: dailyActivity?.results || []
    }

  } catch (error) {
    console.error('Failed to get activity stats:', error)
    return {
      totalActions: 0,
      actionBreakdown: [],
      userActivity: [],
      dailyActivity: []
    }
  }
}

/**
 * Helper function to extract client IP
 */
function getClientIP(request?: Request): string | null {
  if (!request) return null
  
  // Try different headers (Cloudflare specific)
  const cfConnectingIP = request.headers.get('CF-Connecting-IP')
  const xForwardedFor = request.headers.get('X-Forwarded-For')
  const xRealIP = request.headers.get('X-Real-IP')
  
  return cfConnectingIP || 
         (xForwardedFor ? xForwardedFor.split(',')[0].trim() : null) || 
         xRealIP || 
         'unknown'
}