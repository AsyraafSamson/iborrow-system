// app/user/barang/page.tsx
"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

// Interface untuk tempahan
interface Tempahan {
  id: string;
  userId: string;
  barangId: number;
  namaBarang: string;
  kategori: string;
  tarikhTempah: string;
  tarikhPinjam: string;
  tarikhPulang: string;
  status: "menunggu" | "diluluskan" | "ditolak" | "selesai";
  sebab?: string;
  diluluskanOleh?: string;
  tarikhKelulusan?: string;
}

export default function UserBarangPage() {
  const router = useRouter();
  const [tempahanSaya, setTempahanSaya] = useState<Tempahan[]>([]);
  const [carian, setCarian] = useState<string>("");
  const [filterKategori, setFilterKategori] = useState<string>("semua");

  // Hardcoded data barang - lebih lengkap
  const senaraiBarang = [
    { 
      id: 1, 
      nama: "Laptop Dell XPS 13", 
      kategori: "elektronik", 
      status: "Tersedia",
      lokasi: "Makmal Komputer 1",
      deskripsi: "Laptop prestasi tinggi untuk programming dan multimedia",
      gambar: "💻"
    },
    { 
      id: 2, 
      nama: "Projector Epson EB-X41", 
      kategori: "elektronik", 
      status: "Tersedia",
      lokasi: "Bilik Media",
      deskripsi: "Projector untuk presentation dan kuliah",
      gambar: "📽️"
    },
    { 
      id: 3, 
      nama: "Kamera Canon EOS R6", 
      kategori: "fotografi", 
      status: "Tersedia",
      lokasi: "Unit Media",
      deskripsi: "Kamera DSLR profesional untuk fotografi dan videografi",
      gambar: "📷"
    },
    { 
      id: 4, 
      nama: "Tripod Manfrotto", 
      kategori: "fotografi", 
      status: "Tersedia",
      lokasi: "Unit Media", 
      deskripsi: "Tripod stabil untuk kamera dan peralatan video",
      gambar: "📹"
    },
    { 
      id: 5, 
      nama: "Calculator Scientific Casio", 
      kategori: "alat-tulis", 
      status: "Tersedia",
      lokasi: "Kaunter ICT",
      deskripsi: "Kalkulator saintifik untuk kejuruteraan dan sains",
      gambar: "🧮"
    },
    { 
      id: 6, 
      nama: "Buku Programming Basics", 
      kategori: "buku", 
      status: "Tersedia",
      lokasi: "Perpustakaan ICT",
      deskripsi: "Buku asas programming untuk pemula",
      gambar: "📚"
    },
    { 
      id: 7, 
      nama: "Tablet iPad Pro", 
      kategori: "elektronik", 
      status: "Dalam Pinjaman",
      lokasi: "Makmal Komputer 2",
      deskripsi: "Tablet untuk design dan creative work",
      gambar: "📱"
    },
    { 
      id: 8, 
      nama: "Microphone Blue Yeti", 
      kategori: "audio", 
      status: "Tersedia",
      lokasi: "Studio Rakaman",
      deskripsi: "Microphone USB untuk rakaman audio berkualiti",
      gambar: "🎤"
    },
  ];

  const handleBuatTempahan = (barangId: number, namaBarang: string, kategori: string) => {
    // Check jika sudah ada tempahan untuk barang ini yang masih menunggu
    const tempahanAktif = tempahanSaya.find(
      t => t.barangId === barangId && (t.status === "menunggu" || t.status === "diluluskan")
    );
    
    if (tempahanAktif) {
      alert(`Anda sudah ada tempahan aktif untuk ${namaBarang}\n\nStatus: ${tempahanAktif.status.toUpperCase()}`);
      return;
    }

    // Buat tempahan baru dengan status "menunggu"
    const tempahanBaru: Tempahan = {
      id: Date.now().toString(),
      userId: "user123", // Dalam real implementation, ambil dari auth
      barangId,
      namaBarang,
      kategori,
      tarikhTempah: new Date().toISOString(),
      tarikhPinjam: new Date().toISOString(), // Dalam real implementation, user pilih tarikh
      tarikhPulang: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // +7 hari
      status: "menunggu"
    };

    // Simpan tempahan
    setTempahanSaya([...tempahanSaya, tempahanBaru]);
    
    // Alert confirmation
    alert(`✅ TEMPAHAN BERJAYA DIBUAT!\n\nBarang: ${namaBarang}\nStatus: MENUNGGU KELULUSAN STAFF ICT\n\nStaff ICT akan semak tempahan anda dalam 24 jam. Anda akan dimaklumkan melalui email.`);
  };

  // Navigation handlers
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Tersedia": return "bg-green-100 text-green-800";
      case "Dalam Pinjaman": return "bg-red-100 text-red-800";
      case "Rosak": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getKategoriColor = (kategori: string) => {
    switch (kategori) {
      case "elektronik": return "bg-blue-100 text-blue-800";
      case "fotografi": return "bg-purple-100 text-purple-800";
      case "alat-tulis": return "bg-orange-100 text-orange-800";
      case "buku": return "bg-green-100 text-green-800";
      case "audio": return "bg-pink-100 text-pink-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getKategoriText = (kategori: string) => {
    switch (kategori) {
      case "elektronik": return "Elektronik";
      case "fotografi": return "Fotografi";
      case "alat-tulis": return "Alat Tulis";
      case "buku": return "Buku";
      case "audio": return "Audio";
      default: return kategori;
    }
  };

  const getStatusTempahan = (barangId: number) => {
    const tempahan = tempahanSaya.find(t => t.barangId === barangId);
    if (!tempahan) return null;
    
    switch (tempahan.status) {
      case "menunggu": return { text: "Menunggu Kelulusan", color: "bg-yellow-100 text-yellow-800" };
      case "diluluskan": return { text: "Diluluskan", color: "bg-green-100 text-green-800" };
      case "ditolak": return { text: "Ditolak", color: "bg-red-100 text-red-800" };
      case "selesai": return { text: "Selesai", color: "bg-gray-100 text-gray-800" };
      default: return null;
    }
  };

  // Filter barang berdasarkan carian dan kategori
  const barangTertapis = senaraiBarang.filter(barang => {
    const matchesCarian = barang.nama.toLowerCase().includes(carian.toLowerCase()) || 
                         barang.deskripsi.toLowerCase().includes(carian.toLowerCase());
    const matchesKategori = filterKategori === "semua" || barang.kategori === filterKategori;
    return matchesCarian && matchesKategori;
  });

  // Kira statistik
  const totalMenunggu = tempahanSaya.filter(t => t.status === "menunggu").length;
  const totalDiluluskan = tempahanSaya.filter(t => t.status === "diluluskan").length;

  return (
    <div className="min-h-screen bg-gray-50 p-3 pb-20">
      <div className="max-w-6xl mx-auto">
        {/* ✅ HEADER DENGAN ICON SEPERTI PAGE LAIN */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <button 
                onClick={handleKeDashboard}
                className="bg-gray-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-gray-600 transition-colors flex items-center gap-1"
              >
                ← Dashboard
              </button>
              <div className="text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                <span className="text-xs font-medium">📦 BARANG</span>
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
            <h1 className="text-xl font-bold text-gray-900">📦 Senarai Barang ICT</h1>
            <p className="text-gray-600 text-sm mt-1">Lihat dan buat tempahan barang</p>
          </div>
        </div>

        {/* ✅ STATS CARDS - MOBILE OPTIMIZED */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-white rounded-xl shadow-sm p-3 text-center">
            <div className="text-lg font-bold text-blue-600">{senaraiBarang.length}</div>
            <div className="text-xs text-gray-600">Total Barang</div>
            <div className="text-xs text-blue-600 mt-1">Dalam inventori</div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-3 text-center">
            <div className="text-lg font-bold text-green-600">
              {senaraiBarang.filter(b => b.status === "Tersedia").length}
            </div>
            <div className="text-xs text-gray-600">Tersedia</div>
            <div className="text-xs text-green-600 mt-1">Boleh dipinjam</div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-3 text-center">
            <div className="text-lg font-bold text-yellow-600">
              {totalMenunggu}
            </div>
            <div className="text-xs text-gray-600">Menunggu</div>
            <div className="text-xs text-yellow-600 mt-1">Kelulusan anda</div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-3 text-center">
            <div className="text-lg font-bold text-purple-600">
              {totalDiluluskan}
            </div>
            <div className="text-xs text-gray-600">Diluluskan</div>
            <div className="text-xs text-purple-600 mt-1">Tempahan anda</div>
          </div>
        </div>

        {/* ✅ FILTERS & SEARCH - MOBILE OPTIMIZED */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Carian Barang</label>
              <input
                type="text"
                placeholder="Cari nama atau deskripsi barang..."
                value={carian}
                onChange={(e) => setCarian(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Filter Kategori</label>
              <select
                value={filterKategori}
                onChange={(e) => setFilterKategori(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              >
                <option value="semua">Semua Kategori</option>
                <option value="elektronik">Elektronik</option>
                <option value="fotografi">Fotografi</option>
                <option value="alat-tulis">Alat Tulis</option>
                <option value="buku">Buku</option>
                <option value="audio">Audio</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
            <div className="flex-1">
              <label className="block text-xs font-medium text-gray-700 mb-1">Status Tempahan Anda</label>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center">
                <p className="text-blue-800 font-semibold text-sm">
                  {tempahanSaya.length} tempahan aktif
                </p>
                <p className="text-blue-600 text-xs">
                  {totalMenunggu} menunggu • {totalDiluluskan} diluluskan
                </p>
              </div>
            </div>
            
            <div className="flex-1">
              <label className="block text-xs font-medium text-gray-700 mb-1">Actions</label>
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
                <p className="text-green-800 font-semibold text-sm">
                  {barangTertapis.length} barang
                </p>
                <p className="text-green-600 text-xs">ditemui</p>
              </div>
            </div>
          </div>
        </div>

        {/* ✅ SENARAI BARANG - MOBILE OPTIMIZED */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900 text-sm">📦 Senarai Barang ICT</h2>
            <div className="flex items-center gap-2">
              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                {barangTertapis.length} barang
              </span>
            </div>
          </div>
          
          <div className="space-y-3">
            {barangTertapis.map((barang) => {
              const statusTempahan = getStatusTempahan(barang.id);
              const sudahAdaTempahan = statusTempahan !== null;
              const bolehTempah = barang.status === "Tersedia" && !sudahAdaTempahan;

              return (
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
                          <span className="text-gray-500 text-xs">📍 {barang.lokasi}</span>
                          <span className={`${getKategoriColor(barang.kategori)} text-xs px-2 py-1 rounded`}>
                            {getKategoriText(barang.kategori)}
                          </span>
                          <span className={`${getStatusColor(barang.status)} text-xs px-2 py-1 rounded`}>
                            {barang.status}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Status Tempahan & Action Button */}
                    <div className="flex flex-col gap-2">
                      {statusTempahan && (
                        <div className={`${statusTempahan.color} text-xs px-2 py-1 rounded text-center`}>
                          {statusTempahan.text}
                        </div>
                      )}
                      
                      <button 
                        onClick={() => handleBuatTempahan(barang.id, barang.nama, barang.kategori)}
                        disabled={!bolehTempah}
                        className={`w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          bolehTempah 
                            ? 'bg-blue-500 text-white hover:bg-blue-600' 
                            : sudahAdaTempahan 
                              ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                              : 'bg-red-300 text-red-500 cursor-not-allowed'
                        }`}
                      >
                        {bolehTempah 
                          ? "📋 Buat Tempahan" 
                          : sudahAdaTempahan 
                            ? "✅ Ditempah" 
                            : "❌ Tidak Tersedia"
                        }
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
            
            {barangTertapis.length === 0 && (
              <div className="text-center py-8">
                <div className="text-4xl mb-2">📦</div>
                <p className="text-gray-500 text-sm">Tiada barang ditemui</p>
                <p className="text-gray-400 text-xs mt-1">Cuba ubah carian atau filter anda</p>
              </div>
            )}
          </div>
        </div>

        {/* ✅ TEMPAHAN MENUNGGU KELULUSAN */}
        {totalMenunggu > 0 && (
          <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-900 text-sm">⏳ Tempahan Menunggu Kelulusan</h2>
              <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                {totalMenunggu} menunggu
              </span>
            </div>
            
            <div className="space-y-2">
              {tempahanSaya.filter(t => t.status === "menunggu").map(tempahan => (
                <div key={tempahan.id} className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                  <div className="flex items-center gap-3">
                    <span className="text-yellow-600 text-sm">📦</span>
                    <div>
                      <span className="font-medium text-sm">{tempahan.namaBarang}</span>
                      <p className="text-yellow-700 text-xs">
                        Kategori: {getKategoriText(tempahan.kategori)}
                      </p>
                    </div>
                  </div>
                  <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">
                    Menunggu
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
              <h4 className="font-semibold text-blue-800 text-sm mb-2">Proses Tempahan</h4>
              <ul className="text-blue-700 text-xs space-y-1">
                <li>• <strong>Klik "Buat Tempahan"</strong> - Barang akan ditanda sebagai ditempah</li>
                <li>• <strong>Menunggu Kelulusan</strong> - Staff ICT akan semak tempahan anda</li>
                <li>• <strong>Notifikasi Email</strong> - Anda akan dapat email apabila status berubah</li>
                <li>• <strong>Ambil Barang</strong> - Hanya setelah kelulusan, barang boleh diambil di Kaunter ICT</li>
                <li>• <strong>Hubungi Staff ICT</strong> untuk bantuan: 03-1234 5678</li>
              </ul>
            </div>
          </div>
        </div>

        {/* ✅ BOTTOM NAVIGATION */}
        <div className="fixed bottom-4 left-4 right-4 bg-white rounded-xl shadow-lg p-3 border border-gray-200">
          <div className="flex justify-between items-center">
            <button 
              onClick={handleKeDashboard}
              className="flex-1 text-center py-2 px-2 bg-gray-100 text-gray-700 rounded-lg text-xs font-medium mx-1 hover:bg-gray-200 transition-colors"
            >
              🏠 Dashboard
            </button>
            <button className="flex-1 text-center py-2 px-2 bg-blue-500 text-white rounded-lg text-xs font-medium mx-1">
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