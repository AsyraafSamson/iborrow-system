// app/page.tsx - MINIMAL LANDING
export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-sm w-full text-center space-y-6">
        {/* Logo & Brand */}
        <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto">
          <span className="text-xl font-bold text-white">iB</span>
        </div>
        
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Sistem i-Borrow
          </h1>
          <p className="text-gray-600 text-sm">
            ILKKM Johor Bahru
          </p>
        </div>

        {/* Login Button */}
        <a
          href="/login"
          className="block w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
        >
          Log Masuk
        </a>

        {/* Quick Info */}
        <div className="text-xs text-gray-500 space-y-1">
          <p>Gunakan: admin/admin, staff/staff, user/user</p>
          <p>Sistem Peminjaman Barang ICT</p>
        </div>
      </div>
    </div>
  );
}