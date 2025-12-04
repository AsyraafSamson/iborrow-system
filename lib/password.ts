// Password hashing utilities using bcryptjs
// Compatible with Cloudflare Edge Runtime
import bcrypt from 'bcryptjs'

/**
 * Hash a plain text password
 * @param password - Plain text password
 * @returns Hashed password
 */
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10
  return await bcrypt.hash(password, saltRounds)
}

/**
 * Verify a password against a hash
 * @param password - Plain text password to verify
 * @param hash - Hashed password from database
 * @returns True if password matches, false otherwise
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(password, hash)
}

/**
 * Generate hashed passwords for migration
 * This is a helper function to create hashes for existing passwords
 */
export async function generateHashedPasswords() {
  const passwords = {
    admin123: await hashPassword('admin123'),
    staffict123: await hashPassword('staffict123'),
    user123: await hashPassword('user123'),
    pengajar123: await hashPassword('pengajar123'),
    staff123: await hashPassword('staff123'),
  }

  return passwords
}
