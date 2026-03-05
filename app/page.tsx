import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-sm w-full text-center space-y-6">
        <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto shadow-lg">
          <span className="text-xl font-bold text-primary-foreground">iB</span>
        </div>

        <div>
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Sistem Peminjaman Barang ICT
          </h1>
          <p className="text-muted-foreground text-sm">
            Institut Kementerian Kesihatan Malaysia Johor Bahru
          </p>
        </div>

        <Link
          href="/login"
          className="block w-full bg-primary text-primary-foreground py-3 px-4 rounded-lg font-semibold hover:bg-primary/90 transition-colors shadow-md"
        >
          Log Masuk
        </Link>

        <div className="text-xs text-muted-foreground space-y-1">
          <p>Gunakan: admin/admin, staff/staff, user/user</p>
        </div>

        <div className="pt-4 border-t border-border">
          <p className="text-xs text-muted-foreground">
            &copy; 2025{' '}
            <a
              href="https://asyraaf.pages.dev/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors"
            >
              Asyraaf Samson
            </a>
            . All rights reserved.
          </p>
        </div>
      </div>
    </div>
  )
}
