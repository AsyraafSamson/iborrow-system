// app/user/sejarah/page.tsx
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
  lokasi: string;
  tarikhTempah: string;
  tarikhPinjam: string;
  tarikhPulang: string;
  status: "menunggu" | "diluluskan" | "ditolak" | "selesai";
  sebabTolakan?: string;
  diluluskanOleh?: string;
  tarikhKelulusan?: string;
  nota?: string;
}

export default function UserSejarahPage() {
  const router = useRouter();
  const [carian, setCarian] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<string>("semua");
  const [filterKategori, setFilterKategori] = useState<string>("semua");

  // Data contoh tempahan - lebih lengkap
  const [tempahanSaya, setTempahanSaya] = useState<Tempahan[]>([
    {
      id: "1",
      userId: "user123",
      barangId: 1,
      namaBarang: "Laptop Dell XPS 13",
      kategori: "elektronik",
      lokasi: "Makmal Komputer 1",
      tarikhTempah: "2024-01-15T10:30:00",
      tarikhPinjam: "2024-01-16T09:00:00",
      tarikhPulang: "2024-01-23T17:00:00",
      status: "menunggu",
      nota: "Untuk kelas programming web development"
    },
    {
      id: "2", 
      userId: "user123",
      barangId: 3,
      namaBarang: "Kamera Canon EOS R6",
      kategori: "fotografi",
      lokasi: "Unit Media",
      tarikhTempah: "2024-01-10T14:20:00",
      tarikhPinjam: "2024-01-11T10:00:00",
      tarikhPulang: "2024-01-18T17:00:00",
      status: "diluluskan",
      diluluskanOleh: "Ahmad (Staff ICT)",
      tarikhKelulusan: "2024-01-10T16:45:00",
      nota: "Untuk rakaman video event kemahiran insaniah"
    },
    {
      id: "3",
      userId: "user123",
      barangId: 5,
      namaBarang: "Calculator Scientific Casio",
      kategori: "alat-tulis", 
      lokasi: "Kaunter ICT",
      tarikhTempah: "2024-01-08T11:15:00",
      tarikhPinjam: "2024-01-09T08:30:00",
      tarikhPulang: "2024-01-16T17:00:00",
      status: "ditolak",
      sebabTolakan: "Barang sedang dalam penyelenggaraan",
      diluluskanOleh: "Siti (Staff ICT)",
      tarikhKelulusan: "2024-01-08T15:20:00",
      nota: "Untuk final exam subject calculus"
    },
    {
      id: "4",
      userId: "user123",
      barangId: 2,
      namaBarang: "Projector Epson EB-X41",
      kategori: "elektronik",
      lokasi: "Bilik Media", 
      tarikhTempah: "2024-01-05T09:45:00",
      tarikhPinjam: "2024-01-06T14:00:00",
      tarikhPulang: "2024-01-13T17:00:00",
      status: "selesai",
      nota: "Untuk presentation mingguan kumpulan"
    },
    {
      id: "5",
      userId: "user123",
      barangId: 8,
      namaBarang: "Microphone Blue Yeti",
      kategori: "audio",
      lokasi: "Studio Rakaman",
      tarikhTempah: "2024-01-03T13:20:00",
      tarikhPinjam: "2024-01-04T11:00:00",
      tarikhPulang: "2024-01-11T17:00:00",
      status: "selesai",
      diluluskanOleh: "Ahmad (Staff ICT)",
      tarikhKelulusan: "2024-01-03T15:30:00",
      nota: "Untuk rakaman podcast project akhir tahun"
    },
    {
      id: "6",
      userId: "user123",
      barangId: 4,
      namaBarang: "Tripod Manfrotto",
      kategori: "fotografi",
      lokasi: "Unit Media",
      tarikhTempah: "2023-12-28T16:10:00",
      tarikhPinjam: "2023-12-29T09:00:00",
      tarikhPulang: "2024-01-05T17:00:00",
      status: "selesai",
      nota: "Digunakan bersama kamera untuk shooting video"
    }
  ]);

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

  const handleBatalkanTempahan = (tempahanId: string, namaBarang: string) => {
    if (!confirm(`Adakah anda pasti ingin batalkan tempahan untuk ${namaBarang}?`)) {
      return;
    }

    setTempahanSaya(tempahanSaya.filter(t => t.id !== tempahanId));
    alert(`Tempahan ${namaBarang} telah dibatalkan.`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "menunggu": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "diluluskan": return "bg-green-100 text-green-800 border-green-200";
      case "ditolak": return "bg-red-100 text-red-800 border-red-200";
      case "selesai": return "bg-gray-100 text-gray-800 border-gray-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "menunggu": return "Menunggu Kelulusan";
      case "diluluskan": return "Diluluskan";
      case "ditolak": return "Ditolak";
      case "selesai": return "Selesai";
      default: return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "menunggu": return "⏳";
      case "diluluskan": return "✅";
      case "ditolak": return "❌";
      case "selesai": return "📦";
      default: return "📋";
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

  const getKategoriIcon = (kategori: string) => {
    switch (kategori) {
      case "elektronik": return "💻";
      case "fotografi": return "📷";
      case "alat-tulis": return "✏️";
      case "buku": return "📚";
      case "audio": return "🎤";
      default: return "📦";
    }
  };

  // Filter tempahan berdasarkan carian, status dan kategori
  const tempahanTertapis = tempahanSaya.filter(tempahan => {
    const matchesCarian = tempahan.namaBarang.toLowerCase().includes(carian.toLowerCase()) ||
                         (tempahan.nota && tempahan.nota.toLowerCase().includes(carian.toLowerCase()));
    const matchesStatus = filterStatus === "semua" || tempahan.status === filterStatus;
    const matchesKategori = filterKategori === "semua" || tempahan.kategori === filterKategori;
    return matchesCarian && matchesStatus && matchesKategori;
  });

  // Kira statistik
  const statistik = {
    total: tempahanSaya.length,
    menunggu: tempahanSaya.filter(t => t.status === "menunggu").length,
    diluluskan: tempahanSaya.filter(t => t.status === "diluluskan").length,
    ditolak: tempahanSaya.filter(t => t.status === "ditolak").length,
    selesai: tempahanSaya.filter(t => t.status === "selesai").length,
  };

  // Format tarikh untuk display
  const formatTarikh = (tarikh: string) => {
    return new Date(tarikh).toLocaleDateString('ms-MY', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatTarikhMasa = (tarikh: string) => {
    return new Date(tarikh).toLocaleDateString('ms-MY', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

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
                <span className="text-xs font-medium">📊 SEJARAH</span>
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
            <h1 className="text-xl font-bold text-gray-900">📊 Sejarah Tempahan</h1>
            <p className="text-gray-600 text-sm mt-1">Lihat semua tempahan dan status terkini</p>
          </div>
        </div>

        {/* ✅ STATS CARDS - MOBILE OPTIMIZED */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-white rounded-xl shadow-sm p-3 text-center">
            <div className="text-lg font-bold text-blue-600">{statistik.total}</div>
            <div className="text-xs text-gray-600">Total</div>
            <div className="text-xs text-blue-600 mt-1">Semua tempahan</div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-3 text-center">
            <div className="text-lg font-bold text-yellow-600">{statistik.menunggu}</div>
            <div className="text-xs text-gray-600">Menunggu</div>
            <div className="text-xs text-yellow-600 mt-1">Sedang diproses</div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-3 text-center">
            <div className="text-lg font-bold text-green-600">{statistik.diluluskan}</div>
            <div className="text-xs text-gray-600">Diluluskan</div>
            <div className="text-xs text-green-600 mt-1">Boleh diambil</div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-3 text-center">
            <div className="text-lg font-bold text-red-600">{statistik.ditolak}</div>
            <div className="text-xs text-gray-600">Ditolak</div>
            <div className="text-xs text-red-600 mt-1">Tidak diluluskan</div>
          </div>
        </div>

        {/* ✅ FILTERS & SEARCH - MOBILE OPTIMIZED */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Carian</label>
              <input
                type="text"
                placeholder="Cari barang atau nota..."
                value={carian}
                onChange={(e) => setCarian(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Status</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              >
                <option value="semua">Semua Status</option>
                <option value="menunggu">Menunggu</option>
                <option value="diluluskan">Diluluskan</option>
                <option value="ditolak">Ditolak</option>
                <option value="selesai">Selesai</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Kategori</label>
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
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Actions</label>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center w-full">
                <p className="text-blue-800 font-semibold text-sm">
                  {tempahanTertapis.length} tempahan
                </p>
                <p className="text-blue-600 text-xs">ditemui</p>
              </div>
            </div>
          </div>
        </div>

        {/* ✅ SENARAI TEMPAHAN - MOBILE OPTIMIZED */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900 text-sm">📋 Senarai Tempahan</h2>
            <div className="flex items-center gap-2">
              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                {tempahanTertapis.length} ditemui
              </span>
            </div>
          </div>
          
          <div className="space-y-3">
            {tempahanTertapis.map((tempahan) => (
              <div key={tempahan.id} className={`border rounded-lg p-3 ${getStatusColor(tempahan.status)}`}>
                <div className="flex flex-col gap-3">
                  {/* Header Info */}
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-lg">{getKategoriIcon(tempahan.kategori)}</span>
                        <h3 className="font-semibold text-gray-900 text-sm">{tempahan.namaBarang}</h3>
                      </div>
                      <p className="text-gray-600 text-xs mb-2">📍 {tempahan.lokasi}</p>
                      {tempahan.nota && (
                        <p className="text-gray-500 text-xs mb-2">📝 {tempahan.nota}</p>
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className={`${getStatusColor(tempahan.status)} text-xs px-2 py-1 rounded border font-medium`}>
                        {getStatusIcon(tempahan.status)} {getStatusText(tempahan.status)}
                      </span>
                      <span className="text-gray-500 text-xs">
                        {formatTarikh(tempahan.tarikhTempah)}
                      </span>
                    </div>
                  </div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-white rounded p-2">
                      <span className="text-gray-500">Tarikh Pinjam:</span>
                      <p className="text-gray-900 mt-1">{formatTarikh(tempahan.tarikhPinjam)}</p>
                    </div>
                    <div className="bg-white rounded p-2">
                      <span className="text-gray-500">Tarikh Pulang:</span>
                      <p className="text-gray-900 mt-1">{formatTarikh(tempahan.tarikhPulang)}</p>
                    </div>
                    <div className="bg-white rounded p-2">
                      <span className="text-gray-500">Kategori:</span>
                      <p className="mt-1">
                        <span className={`${getKategoriColor(tempahan.kategori)} text-xs px-1 py-0.5 rounded`}>
                          {getKategoriText(tempahan.kategori)}
                        </span>
                      </p>
                    </div>
                    <div className="bg-white rounded p-2">
                      <span className="text-gray-500">Tempoh:</span>
                      <p className="text-gray-900 mt-1">
                        {Math.ceil(
                          (new Date(tempahan.tarikhPulang).getTime() - new Date(tempahan.tarikhPinjam).getTime()) 
                          / (1000 * 60 * 60 * 24)
                        )} hari
                      </p>
                    </div>
                  </div>

                  {/* Additional Info berdasarkan Status */}
                  {tempahan.status === "diluluskan" && tempahan.diluluskanOleh && (
                    <div className="p-2 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-green-700 text-xs">
                        ✅ <strong>Diluluskan oleh:</strong> {tempahan.diluluskanOleh} pada {formatTarikhMasa(tempahan.tarikhKelulusan!)}
                      </p>
                    </div>
                  )}
                  
                  {tempahan.status === "ditolak" && tempahan.sebabTolakan && (
                    <div className="p-2 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-red-700 text-xs">
                        ❌ <strong>Ditolak:</strong> {tempahan.sebabTolakan}
                      </p>
                      {tempahan.diluluskanOleh && (
                        <p className="text-red-600 text-xs mt-1">
                          Oleh: {tempahan.diluluskanOleh} pada {formatTarikhMasa(tempahan.tarikhKelulusan!)}
                        </p>
                      )}
                    </div>
                  )}

                  {tempahan.status === "selesai" && (
                    <div className="p-2 bg-gray-50 border border-gray-200 rounded-lg">
                      <p className="text-gray-700 text-xs">
                        📦 <strong>Tempahan telah selesai</strong> - Barang telah dikembalikan
                      </p>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2">
                    {tempahan.status === "menunggu" && (
                      <button 
                        onClick={() => handleBatalkanTempahan(tempahan.id, tempahan.namaBarang)}
                        className="bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600 transition-colors text-xs font-medium flex-1"
                      >
                        Batalkan
                      </button>
                    )}
                    
                    {tempahan.status === "diluluskan" && (
                      <button className="bg-green-500 text-white px-3 py-2 rounded-lg hover:bg-green-600 transition-colors text-xs font-medium flex-1">
                        Konfirmasi Ambil
                      </button>
                    )}

                    {tempahan.status === "selesai" && (
                      <button className="bg-blue-500 text-white px-3 py-2 rounded-lg hover:bg-blue-600 transition-colors text-xs font-medium flex-1">
                        Buat Semula
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            {tempahanTertapis.length === 0 && (
              <div className="text-center py-8">
                <div className="text-4xl mb-2">📊</div>
                <p className="text-gray-500 text-sm">Tiada tempahan ditemui</p>
                <p className="text-gray-400 text-xs mt-1">Cuba ubah carian atau filter anda</p>
              </div>
            )}
          </div>
        </div>

        {/* ✅ INFO SECTION */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4">
          <div className="flex items-start gap-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <span className="text-blue-600 text-sm">💡</span>
            </div>
            <div>
              <h4 className="font-semibold text-blue-800 text-sm mb-2">Maklumat Status Tempahan</h4>
              <ul className="text-blue-700 text-xs space-y-1">
                <li>• <strong>Menunggu</strong> - Staff ICT sedang proses permohonan anda</li>
                <li>• <strong>Diluluskan</strong> - Tempahan diluluskan, boleh ambil barang</li>
                <li>• <strong>Ditolak</strong> - Tempahan tidak diluluskan dengan sebab tertentu</li>
                <li>• <strong>Selesai</strong> - Barang telah dikembalikan dan proses selesai</li>
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
            <button 
              onClick={handleKeBarang}
              className="flex-1 text-center py-2 px-2 bg-gray-100 text-gray-700 rounded-lg text-xs font-medium mx-1 hover:bg-gray-200 transition-colors"
            >
              📦 Barang
            </button>
            <button className="flex-1 text-center py-2 px-2 bg-blue-500 text-white rounded-lg text-xs font-medium mx-1">
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