// app/lib/database.ts

export interface User {
  id: string;
  email: string;
  nama: string;
  peranan: 'admin' | 'staff-ict' | 'user';
  jabatan: string;
  no_telefon: string;
  password_hash: string;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
}

// Simple database service - no Cloudflare imports needed
export class DatabaseService {
  // For now, we'll use mock data or fetch from API routes
  // Later we'll connect directly to D1 via API routes
  
  async authenticateUser(email: string, password: string): Promise<User | null> {
    try {
      // This will be handled by API route that connects to D1
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        return data.user;
      }
      return null;
    } catch (error) {
      console.error('Authentication error:', error);
      return null;
    }
  }

  // Other methods will be implemented via API calls
  async getUserById(id: string): Promise<User | null> {
    // Will be implemented via API route
    return null;
  }
}

// Mock data for development
export const mockUsers: User[] = [
  {
    id: '1',
    email: 'admin@iborrow.com',
    nama: 'Administrator',
    peranan: 'admin',
    jabatan: 'ICT',
    no_telefon: '0123456789',
    password_hash: 'admin123',
    status: 'active',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '2',
    email: 'staff@iborrow.com',
    nama: 'Staff ICT',
    peranan: 'staff-ict',
    jabatan: 'ICT',
    no_telefon: '0123456790',
    password_hash: 'staff123',
    status: 'active',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '3',
    email: 'user@iborrow.com',
    nama: 'Regular User',
    peranan: 'user',
    jabatan: 'Akademik',
    no_telefon: '0123456791',
    password_hash: 'user123',
    status: 'active',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];