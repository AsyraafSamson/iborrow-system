// app/admin/laporan/page.tsx
"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LaporanPage() {
  const router = useRouter();
  
  const [jenisLaporan, setJenisLaporan] = useState("tempahan");
  const [tempohLaporan, setTempohLaporan] = useState("7hari");
  const [tarikhMula, setTarikhMula] = useState("");
  const [tarikhAkhir, setTarikhAkhir] = useState("");

  // Data sample untuk laporan
  const [statistikLaporan] = useState({
    totalTempahan: 156,
    tempahanAktif: 23,
    tempahanSelesai: 133,
    barangPopular: "Laptop Dell XPS 13",
    purataTempoh: 5.2,
    kadarPengembalian: 98.5
  });

  const [laporanTempahan] = useState([
    { id: 1, pengguna: "Ahmad bin Ali", barang: "Laptop Dell XPS 13", tarikhPinjam: "2025-10-25", tarikhPulang: "2025-10-27", status: "Selesai" },
    { id: 2, pengguna: "Siti binti Rahman", barang: "Projector Epson", tarikhPinjam: "2025-10-26", tarikhPulang: "-", status: "Aktif" },
    { id: 3, pengguna: "Mohd Faris", barang: "Kamera Canon", tarikhPinjam: "2025-10-24", tarikhPulang: "2025-10-26", status: "Selesai" },
    { id: 4, pengguna: "Nurul Huda", barang: "Tripod Manfrotto", tarikhPinjam: "2025-10-27", tarikhPulang: "-", status: "Aktif" },
  ]);

  const [laporanBarang] = useState([
    { id: 1, nama: "Laptop Dell XPS 13", kategori: "Elektronik", jumlahPinjam: 45, status: "Popular" },
    { id: 2, nama: "Projector Epson EB-X41", kategori: "Elektronik", jumlahPinjam: 32, status: "Aktif" },
    { id: 3, nama: "Kamera Canon EOS R6", kategori: "Fotografi", jumlahPinjam: 28, status: "Aktif" },
    { id: 4, nama: "Tripod Manfrotto", kategori: "Fotografi", jumlahPinjam: 15, status: "Sedang" },
  ]);

  // ✅ Navigation handlers untuk bottom navigation
  const handleKeDashboard = () => {
    router.push("/admin/dashboard");
  };

  const handleKePengguna = () => {
    router.push("/admin/pengguna");
  };

  const handleKeBarang = () => {
    router.push("/admin/barang");
  };

  const handleKeTetapan = () => {
    router.push("/admin/tetapan/sistem");
  };

  const handleKeProfile = () => {
    router.push("/admin/profile");
  };

  const handleLogKeluar = () => {
    if (confirm("Adakah anda pasti ingin log keluar?")) {
      router.push("/login");
    }
  };

  const handleJanaLaporan = () => {
    alert(`Laporan ${jenisLaporan} untuk ${tempohLaporan} sedang dijana...`);
    setTimeout(() => {
      alert("Laporan berjaya dijana!");
    }, 1500);
  };

  const handleEksportLaporan = (format: string) => {
    alert(`Mengeksport laporan dalam format ${format.toUpperCase()}...`);
    setTimeout(() => {
      alert(`Laporan berjaya dieksport sebagai ${format.toUpperCase()}!`);
    }, 2000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Selesai": return "bg-green-100 text-green-800";
      case "Aktif": return "bg-blue-100 text-blue-800";
      case "Popular": return "bg-purple-100 text-purple-800";
      case "Sedang": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-3 pb-24">
      <div className="max-w-4xl mx-auto">
        
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
                <span className="text-xs font-medium">📊 LAPORAN</span>
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
            <h1 className="text-xl font-bold text-gray-900">📊 Urus Laporan Sistem</h1>
            <p className="text-gray-600 text-sm mt-1">Analisis dan statistik sistem i-Borrow</p>
          </div>
        </div>

        {/* ✅ STATS CARDS - MOBILE OPTIMIZED */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-white rounded-xl shadow-sm p-3 text-center">
            <div className="text-lg font-bold text-blue-600">{statistikLaporan.totalTempahan}</div>
            <div className="text-xs text-gray-600">Total Tempahan</div>
            <div className="text-xs text-blue-600 mt-1">Semua masa</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-3 text-center">
            <div className="text-lg font-bold text-green-600">{statistikLaporan.tempahanSelesai}</div>
            <div className="text-xs text-gray-600">Selesai</div>
            <div className="text-xs text-green-600 mt-1">Berjaya dikembalikan</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-3 text-center">
            <div className="text-lg font-bold text-orange-600">{statistikLaporan.tempahanAktif}</div>
            <div className="text-xs text-gray-600">Aktif</div>
            <div className="text-xs text-orange-600 mt-1">Sedang dipinjam</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-3 text-center">
            <div className="text-lg font-bold text-purple-600">{statistikLaporan.kadarPengembalian}%</div>
            <div className="text-xs text-gray-600">Kadar Pulang</div>
            <div className="text-xs text-purple-600 mt-1">Tepat waktu</div>
          </div>
        </div>

        {/* ✅ PENAPIS LAPORAN - MOBILE OPTIMIZED */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900 text-sm">🔍 Penapis Laporan</h3>
            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
              {jenisLaporan === "tempahan" ? "📋 Tempahan" : "📦 Barang"}
            </span>
          </div>
          
          <div className="grid grid-cols-2 gap-2 mb-3">
            <button
              onClick={() => setJenisLaporan("tempahan")}
              className={`p-2 rounded-lg text-xs font-medium transition-colors ${
                jenisLaporan === "tempahan" ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              📋 Tempahan
            </button>
            <button
              onClick={() => setJenisLaporan("barang")}
              className={`p-2 rounded-lg text-xs font-medium transition-colors ${
                jenisLaporan === "barang" ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              📦 Barang
            </button>
          </div>

          <div className="grid grid-cols-3 gap-2 mb-3">
            {["7hari", "30hari", "kustom"].map((tempoh) => (
              <button
                key={tempoh}
                onClick={() => setTempohLaporan(tempoh)}
                className={`p-2 rounded-lg text-xs font-medium transition-colors capitalize ${
                  tempohLaporan === tempoh ? "bg-green-500 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {tempoh === "7hari" ? "7 Hari" : tempoh === "30hari" ? "30 Hari" : "Kustom"}
              </button>
            ))}
          </div>

          {tempohLaporan === "kustom" && (
            <div className="grid grid-cols-2 gap-2 mb-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Tarikh Mula</label>
                <input 
                  type="date" 
                  value={tarikhMula} 
                  onChange={(e) => setTarikhMula(e.target.value)} 
                  className="w-full px-2 py-1 border border-gray-300 rounded-lg text-xs focus:ring-1 focus:ring-blue-500" 
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Tarikh Akhir</label>
                <input 
                  type="date" 
                  value={tarikhAkhir} 
                  onChange={(e) => setTarikhAkhir(e.target.value)} 
                  className="w-full px-2 py-1 border border-gray-300 rounded-lg text-xs focus:ring-1 focus:ring-blue-500" 
                />
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-2">
            <button 
              onClick={handleJanaLaporan} 
              className="bg-blue-500 text-white py-2 rounded-lg text-xs font-medium hover:bg-blue-600 transition-colors"
            >
              📊 Jana Laporan
            </button>
            <button 
              onClick={() => handleEksportLaporan("pdf")} 
              className="bg-green-500 text-white py-2 rounded-lg text-xs font-medium hover:bg-green-600 transition-colors"
            >
              📥 Eksport PDF
            </button>
          </div>
        </div>

        {/* ✅ SENARAI LAPORAN - MOBILE OPTIMIZED */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900 text-sm">
              {jenisLaporan === "tempahan" ? "📋 Senarai Tempahan" : "📦 Statistik Barang"}
            </h3>
            <div className="flex items-center gap-2">
              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                {jenisLaporan === "tempahan" ? laporanTempahan.length : laporanBarang.length} item
              </span>
            </div>
          </div>

          <div className="space-y-3">
            {(jenisLaporan === "tempahan" ? laporanTempahan : laporanBarang).slice(0, 4).map((item: any) => (
              <div key={item.id} className="border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow">
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="font-medium text-sm text-gray-900">
                        {jenisLaporan === "tempahan" ? item.barang : item.nama}
                      </div>
                      <div className="text-gray-600 text-xs mt-1">
                        {jenisLaporan === "tempahan" ? `Oleh: ${item.pengguna}` : `Kategori: ${item.kategori}`}
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs ${getStatusColor(item.status)}`}>
                      {item.status}
                    </span>
                  </div>
                  
                  {jenisLaporan === "tempahan" ? (
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500">Pinjam: {item.tarikhPinjam}</span>
                      <span className="text-gray-500">Pulang: {item.tarikhPulang}</span>
                    </div>
                  ) : (
                    <div className="text-xs">
                      <span className="text-gray-500">Dipinjam: </span>
                      <span className="font-semibold text-blue-600">{item.jumlahPinjam} kali</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Export Buttons */}
          <div className="flex gap-2 pt-4 border-t border-gray-200 mt-4">
            <button 
              onClick={() => handleEksportLaporan("excel")} 
              className="flex-1 bg-gray-500 text-white py-2 rounded-lg text-xs font-medium hover:bg-gray-600 transition-colors"
            >
              📊 Excel
            </button>
            <button 
              onClick={() => handleEksportLaporan("csv")} 
              className="flex-1 bg-green-500 text-white py-2 rounded-lg text-xs font-medium hover:bg-green-600 transition-colors"
            >
              📄 CSV
            </button>
          </div>
        </div>

        {/* ✅ RINGKASAN - MOBILE OPTIMIZED */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
          <h3 className="font-semibold text-gray-900 text-sm mb-4">📈 Ringkasan Statistik</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg border border-blue-200">
              <span className="text-sm text-blue-700">Barang Popular</span>
              <b className="text-blue-800 text-sm">{statistikLaporan.barangPopular}</b>
            </div>
            <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg border border-green-200">
              <span className="text-sm text-green-700">Purata Tempoh</span>
              <b className="text-green-800 text-sm">{statistikLaporan.purataTempoh} hari</b>
            </div>
            <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg border border-purple-200">
              <span className="text-sm text-purple-700">Kadar Pengembalian</span>
              <b className="text-purple-800 text-sm">{statistikLaporan.kadarPengembalian}%</b>
            </div>
          </div>
        </div>

        {/* ✅ INFO SECTION */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4">
          <div className="flex items-start gap-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <span className="text-blue-600 text-sm">💡</span>
            </div>
            <div>
              <h4 className="font-semibold text-blue-800 text-sm mb-2">Cara Menggunakan Laporan</h4>
              <ul className="text-blue-700 text-xs space-y-1">
                <li>• <strong>Pilih jenis laporan</strong> - Tempahan atau Barang</li>
                <li>• <strong>Tetapkan tempoh</strong> - 7 hari, 30 hari atau kustom</li>
                <li>• <strong>Jana laporan</strong> - Untuk analisis terkini</li>
                <li>• <strong>Eksport</strong> - PDF, Excel atau CSV untuk dokumentasi</li>
                <li>• <strong>Monitor statistik</strong> - Pantau prestasi sistem</li>
              </ul>
            </div>
          </div>
        </div>

        {/* ✅ BOTTOM NAVIGATION DENGAN 6 ITEM */}
        <div className="fixed bottom-4 left-4 right-4 bg-white rounded-xl shadow-lg p-3 border border-gray-200">
          <div className="flex justify-between items-center">
            <button 
              onClick={handleKeDashboard}
              className="flex-1 text-center py-2 px-1 bg-gray-100 text-gray-700 rounded-lg text-xs font-medium mx-1 hover:bg-gray-200 transition-colors"
            >
              🏠 Dashboard
            </button>
            <button 
              onClick={handleKePengguna}
              className="flex-1 text-center py-2 px-1 bg-gray-100 text-gray-700 rounded-lg text-xs font-medium mx-1 hover:bg-gray-200 transition-colors"
            >
              👥 Pengguna
            </button>
            <button 
              onClick={handleKeBarang}
              className="flex-1 text-center py-2 px-1 bg-gray-100 text-gray-700 rounded-lg text-xs font-medium mx-1 hover:bg-gray-200 transition-colors"
            >
              📦 Barang
            </button>
            <button className="flex-1 text-center py-2 px-1 bg-blue-500 text-white rounded-lg text-xs font-medium mx-1">
              📊 Laporan
            </button>
            <button 
              onClick={handleKeTetapan}
              className="flex-1 text-center py-2 px-1 bg-gray-100 text-gray-700 rounded-lg text-xs font-medium mx-1 hover:bg-gray-200 transition-colors"
            >
              ⚙️ Tetapan
            </button>
            <button 
              onClick={handleKeProfile}
              className="flex-1 text-center py-2 px-1 bg-gray-100 text-gray-700 rounded-lg text-xs font-medium mx-1 hover:bg-gray-200 transition-colors"
            >
              👤 Profil
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}