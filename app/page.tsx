import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-sm w-full text-center space-y-6">
        {/* Logo & Brand */}
        <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
          <span className="text-xl font-bold text-white">iB</span>
        </div>

        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Sistem Peminjaman Barang ICT
          </h1>
          <p className="text-gray-600 text-sm">
            Institut Kementerian Kesihatan Malaysia Johor Bahru
          </p>
        </div>

        {/* Login Button */}
        <Link
          href="/login"
          className="block w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
        >
          Log Masuk
        </Link>

        {/* Quick Info */}
        <div className="text-xs text-gray-500 space-y-1">
          <p>Gunakan: admin/admin, staff/staff, user/user</p>
        </div>

        {/* COPYRIGHT */}
        <div className="pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-400">
            &copy; 2025 <a href="https://asyraaf.pages.dev/" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 transition-colors">Asyraaf Samson</a>. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  )
}
