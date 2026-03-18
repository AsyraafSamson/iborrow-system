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
  return bcrypt.hashSync(password, saltRounds)
}

/**
 * Verify a password against a hash
 * @param password - Plain text password to verify
 * @param hash - Hashed password from database
 * @returns True if password matches, false otherwise
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compareSync(password, hash)
}

/**
 * Generate hashed passwords for migration
 * This is a helper function to create hashes for existing passwords
 */
export async function generateHashedPasswords(passwords: string[]) {
  const hashedPasswords = Object.fromEntries(
    passwords.map((password) => [password, bcrypt.hashSync(password, 10)])
  )

  return hashedPasswords
}
