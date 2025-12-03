// TypeScript definitions for Cloudflare D1 Database
import type { D1Database } from '@cloudflare/workers-types'

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DB: D1Database
    }
  }
}

export {}
