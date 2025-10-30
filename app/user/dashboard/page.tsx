// app/user/dashboard/page.tsx
"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function UserDashboard() {
  const router = useRouter();
  const [barangDipinjam, setBarangDipinjam] = useState<string[]>([]);

  // Hardcoded data barang
  const senaraiBarang = [
    { 
      id: 1, 
      nama: "Laptop Dell XPS 13", 
      kategori: "Elektronik", 
      status: "Tersedia",
      lokasi: "Makmal Komputer 1",
      deskripsi: "Laptop prestasi tinggi untuk programming dan multimedia",
      gambar: "💻"
    },
    { 
      id: 2, 
      nama: "Projector Epson EB-X41", 
      kategori: "Elektronik", 
      status: "Tersedia",
      lokasi: "Bilik Media",
      deskripsi: "Projector untuk presentation dan kuliah",
      gambar: "📽️"
    },
    { 
      id: 3, 
      nama: "Kamera Canon EOS R6", 
      kategori: "Fotografi", 
      status: "Tersedia",
      lokasi: "Unit Media",
      deskripsi: "Kamera DSLR profesional untuk fotografi dan videografi",
      gambar: "📷"
    },
    { 
      id: 4, 
      nama: "Tripod Manfrotto", 
      kategori: "Fotografi", 
      status: "Tersedia",
      lokasi: "Unit Media", 
      deskripsi: "Tripod stabil untuk kamera dan peralatan video",
      gambar: "📹"
    },
    { 
      id: 5, 
      nama: "Calculator Scientific Casio", 
      kategori: "Alat Tulis", 
      status: "Tersedia",
      lokasi: "Kaunter ICT",
      deskripsi: "Kalkulator saintifik untuk kejuruteraan dan sains",
      gambar: "🧮"
    },
    { 
      id: 6, 
      nama: "Buku Programming Basics", 
      kategori: "Buku", 
      status: "Tersedia",
      lokasi: "Perpustakaan ICT",
      deskripsi: "Buku asas programming untuk pemula",
      gambar: "📚"
    },
  ];

  const handlePinjamBarang = (barang: any) => {
    if (barangDipinjam.includes(barang.nama)) {
      alert(`Anda sudah meminjam ${barang.nama}`);
      return;
    }
    
    // Default: pinjam hari ini, pulang dalam 3 hari
    const today = new Date();
    const returnDate = new Date();
    returnDate.setDate(today.getDate() + 3);
    
    const formattedToday = today.toISOString().split('T')[0];
    const formattedReturn = returnDate.toISOString().split('T')[0];
    
    setBarangDipinjam([...barangDipinjam, barang.nama]);
    
    alert(`✅ BERJAYA MEMINJAM!\n\n📦 ${barang.nama}\n📅 Pinjam: ${formatTarikh(formattedToday)}\n📅 Pulang: ${formatTarikh(formattedReturn)}\n⏰ Tempoh: 3 hari\n\nStatus: MENUNGGU KELULUSAN STAFF ICT`);
  };

  const formatTarikh = (tarikh: string) => {
    return new Date(tarikh).toLocaleDateString('ms-MY', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  // Navigation handlers untuk bottom navigation
  const handleKeDashboard = () => {
    router.push("/user/dashboard");
  };

  const handleKeBarang = () => {
    router.push("/user/barang");
  };

  const handleKeSejarah = () => {
    router.push("/user/sejarah");
  };

  const handleKeProfile = () => {
    router.push("/user/profile");
  };

  const handleLogKeluar = () => {
    if (confirm("Adakah anda pasti ingin log keluar?")) {
      router.push("/login");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-3 pb-20">
      <div className="max-w-6xl mx-auto">
        {/* ✅ HEADER DENGAN ICON SEPERTI DI LAPORAN/BARANG/PAGE.TSX */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                <span className="text-xs font-medium">🏠 DASHBOARD</span>
              </div>
            </div>
            {/* ✅ BUTANG LOG KELUAR DI KANAN */}
            <button 
              onClick={handleLogKeluar}
              className="bg-red-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-red-600 transition-colors"
            >
              Log Keluar
            </button>
          </div>
          
          <div className="text-center">
            <h1 className="text-xl font-bold text-gray-900">👋 Dashboard Pengguna</h1>
            <p className="text-gray-600 text-sm mt-1">Pinjam barang ICT ILKKM dengan mudah</p>
          </div>
        </div>

        {/* ✅ STATS CARDS - MOBILE OPTIMIZED */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-white rounded-xl shadow-sm p-3 text-center">
            <div className="text-lg font-bold text-blue-600">{barangDipinjam.length}</div>
            <div className="text-xs text-gray-600">Tempahan Aktif</div>
            <div className="text-xs text-blue-600 mt-1">Menunggu kelulusan</div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-3 text-center">
            <div className="text-lg font-bold text-green-600">23</div>
            <div className="text-xs text-gray-600">Sejarah</div>
            <div className="text-xs text-green-600 mt-1">Pinjaman lepas</div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-3 text-center">
            <div className="text-lg font-bold text-purple-600">{senaraiBarang.length}</div>
            <div className="text-xs text-gray-600">Barang Tersedia</div>
            <div className="text-xs text-purple-600 mt-1">Boleh dipinjam</div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-3 text-center">
            <div className="text-lg font-bold text-orange-600">5</div>
            <div className="text-xs text-gray-600">Disetujui</div>
            <div className="text-xs text-orange-600 mt-1">Bulan ini</div>
          </div>
        </div>

        {/* ✅ SENARAI BARANG TERSEEDIA - MOBILE OPTIMIZED */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900 text-sm">📦 Barang Tersedia</h2>
            <div className="flex items-center gap-2">
              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                {senaraiBarang.length} barang
              </span>
            </div>
          </div>
          
          <div className="space-y-3">
            {senaraiBarang.map((barang) => (
              <div key={barang.id} className="border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow">
                <div className="flex flex-col gap-3">
                  {/* Header Info */}
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-lg">{barang.gambar}</span>
                        <h3 className="font-semibold text-gray-900 text-sm">{barang.nama}</h3>
                      </div>
                      <p className="text-gray-600 text-xs mb-2">{barang.deskripsi}</p>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                          {barang.kategori}
                        </span>
                        <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded">
                          {barang.status}
                        </span>
                        <span className="text-gray-500 text-xs">📍 {barang.lokasi}</span>
                      </div>
                    </div>
                  </div>

                  {/* Action Button */}
                  <button 
                    onClick={() => handlePinjamBarang(barang)}
                    disabled={barangDipinjam.includes(barang.nama)}
                    className={`w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      barangDipinjam.includes(barang.nama)
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-blue-500 text-white hover:bg-blue-600'
                    }`}
                  >
                    {barangDipinjam.includes(barang.nama) ? "✅ Telah Dipinjam" : "📌 Pinjam Sekarang"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ✅ BARANG YANG DIPINJAM */}
        {barangDipinjam.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-900 text-sm">🔄 Barang Sedang Dipinjam</h2>
              <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                {barangDipinjam.length} menunggu
              </span>
            </div>
            
            <div className="space-y-2">
              {barangDipinjam.map((barang, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-3">
                    <span className="text-blue-600 text-sm">📦</span>
                    <span className="font-medium text-sm">{barang}</span>
                  </div>
                  <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">
                    Menunggu Kelulusan
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ✅ INFO SECTION */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4">
          <div className="flex items-start gap-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <span className="text-blue-600 text-sm">💡</span>
            </div>
            <div>
              <h4 className="font-semibold text-blue-800 text-sm mb-2">Cara Meminjam Barang</h4>
              <ul className="text-blue-700 text-xs space-y-1">
                <li>• Klik "Pinjam Sekarang" pada barang yang ingin dipinjam</li>
                <li>• Tempahan akan menunggu kelulusan Staff ICT</li>
                <li>• Anda akan dimaklumkan melalui emel apabila diluluskan</li>
                <li>• Ambil barang di Kaunter ICT dalam tempoh 24 jam</li>
                <li>• Pastikan maklumat peribadi anda lengkap dalam profil</li>
              </ul>
            </div>
          </div>
        </div>

        {/* ✅ BOTTOM NAVIGATION DENGAN 4 ITEM: Dashboard, Barang, Sejarah, Maklumat Peribadi */}
        <div className="fixed bottom-4 left-4 right-4 bg-white rounded-xl shadow-lg p-3 border border-gray-200">
          <div className="flex justify-between items-center">
            <button className="flex-1 text-center py-2 px-2 bg-blue-500 text-white rounded-lg text-xs font-medium mx-1">
              🏠 Dashboard
            </button>
            <button 
              onClick={handleKeBarang}
              className="flex-1 text-center py-2 px-2 bg-gray-100 text-gray-700 rounded-lg text-xs font-medium mx-1 hover:bg-gray-200 transition-colors"
            >
              📦 Barang
            </button>
            <button 
              onClick={handleKeSejarah}
              className="flex-1 text-center py-2 px-2 bg-gray-100 text-gray-700 rounded-lg text-xs font-medium mx-1 hover:bg-gray-200 transition-colors"
            >
              📊 Sejarah
            </button>
            <button 
              onClick={handleKeProfile}
              className="flex-1 text-center py-2 px-2 bg-gray-100 text-gray-700 rounded-lg text-xs font-medium mx-1 hover:bg-gray-200 transition-colors"
            >
              👤 Profil
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}