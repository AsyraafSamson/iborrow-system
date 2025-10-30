"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function StaffDashboard() {
  const router = useRouter();
  const [tempahan, setTempahan] = useState([
    { id: 1, nama: "Ahmad bin Ali", barang: "Laptop Dell XPS 13", tarikh: "27/10/2025", status: "menunggu" },
    { id: 2, nama: "Siti binti Rahman", barang: "Projector Epson", tarikh: "27/10/2025", status: "menunggu" },
    { id: 3, nama: "Mohd Faris", barang: "Kamera Canon", tarikh: "26/10/2025", status: "menunggu" },
  ]);

  const [senaraiBarang, setSenaraiBarang] = useState([
    { id: 1, nama: "Laptop Dell XPS 13", status: "tersedia", kategori: "Elektronik" },
    { id: 2, nama: "Projector Epson EB-X41", status: "tersedia", kategori: "Elektronik" },
    { id: 3, nama: "Kamera Canon EOS R6", status: "rosak", kategori: "Fotografi" },
    { id: 4, nama: "Tripod Manfrotto", status: "dipinjam", kategori: "Fotografi" },
    { id: 5, nama: "Calculator Scientific", status: "tersedia", kategori: "Alat Tulis" },
  ]);

  // ✅ Navigation handlers untuk bottom navigation - DENGAN PROFIL
  const handleKeDashboard = () => {
    router.push("/staff-ict/dashboard");
  };

  const handleKeKelulusan = () => {
    router.push("/staff-ict/kelulusan");
  };

  const handleKeBarang = () => {
    router.push("/staff-ict/barang");
  };

  // ✅ UPDATED: Tukar ke /staff-ict/laporan/keseluruhan
  const handleKeLaporan = () => {
    router.push("/staff-ict/laporan/keseluruhan");
  };

  const handleKeProfile = () => {
    router.push("/staff-ict/profile");
  };

  const handleLogKeluar = () => {
    if (confirm("Adakah anda pasti ingin log keluar?")) {
      router.push("/login");
    }
  };

  const handleKelulusan = (id: number, status: string) => {
    setTempahan(tempahan.map(item => 
      item.id === id ? { ...item, status } : item
    ));
    alert(`Tempahan ${status === "lulus" ? "diluluskan" : "ditolak"}!`);
  };

  const handleUpdateStatusBarang = (id: number, statusBaru: string) => {
    setSenaraiBarang(senaraiBarang.map(item =>
      item.id === id ? { ...item, status: statusBaru } : item
    ));
    alert(`Status barang berjaya dikemaskini!`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "tersedia": return "bg-green-100 text-green-800";
      case "dipinjam": return "bg-blue-100 text-blue-800";
      case "rosak": return "bg-red-100 text-red-800";
      case "menunggu": return "bg-yellow-100 text-yellow-800";
      case "lulus": return "bg-green-100 text-green-800";
      case "tolak": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "tersedia": return "Tersedia";
      case "dipinjam": return "Dipinjam";
      case "rosak": return "Rosak";
      case "menunggu": return "Menunggu";
      case "lulus": return "Diluluskan";
      case "tolak": return "Ditolak";
      default: return status;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-3 pb-24">
      <div className="max-w-6xl mx-auto">
        {/* Header - SAMA SEPERTI ADMIN */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              {/* ✅ ICON DAN BADGE STAFF ICT DALAM SATU BARIS */}
              <div className="text-blue-600 bg-blue-100 px-2 py-1 rounded-full flex items-center gap-1">
                <span className="text-sm">🏠</span>
                <span className="text-xs font-medium">STAFF ICT</span>
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
          
          {/* ✅ TITLE DI TENGAH */}
          <div className="text-center">
            <h1 className="text-xl font-bold text-gray-900">Dashboard Staff ICT</h1>
            <p className="text-gray-600 text-sm mt-1">Urus tempahan dan barang ICT ILKKM</p>
          </div>
        </div>

        {/* Stats Cards - Mobile Optimized */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-white rounded-xl shadow-sm p-3 text-center">
            <div className="text-lg font-bold text-blue-600">
              {tempahan.filter(t => t.status === "menunggu").length}
            </div>
            <div className="text-xs text-gray-600">Tempahan Baru</div>
            <div className="text-xs text-yellow-600 mt-1">
              Perlu kelulusan
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-3 text-center">
            <div className="text-lg font-bold text-green-600">
              {senaraiBarang.filter(b => b.status === "dipinjam").length}
            </div>
            <div className="text-xs text-gray-600">Pinjaman Aktif</div>
            <div className="text-xs text-blue-600 mt-1">
              Sedang dipinjam
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-3 text-center">
            <div className="text-lg font-bold text-purple-600">
              {senaraiBarang.length}
            </div>
            <div className="text-xs text-gray-600">Total Barang</div>
            <div className="text-xs text-green-600 mt-1">
              {senaraiBarang.filter(b => b.status === "tersedia").length} Tersedia
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-3 text-center">
            <div className="text-lg font-bold text-red-600">
              {senaraiBarang.filter(b => b.status === "rosak").length}
            </div>
            <div className="text-xs text-gray-600">Barang Rosak</div>
            <div className="text-xs text-red-600 mt-1">
              Perbaikan diperlukan
            </div>
          </div>
        </div>

        {/* Senarai Tempahan Perlu Kelulusan */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-gray-900 text-sm">📋 Tempahan Perlu Kelulusan</h2>
            <div className="flex items-center gap-2">
              <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                {tempahan.filter(t => t.status === "menunggu").length} menunggu
              </span>
              <button 
                onClick={handleKeKelulusan}
                className="bg-blue-500 text-white px-2 py-1 rounded text-xs hover:bg-blue-600 transition-colors"
              >
                Lihat Semua
              </button>
            </div>
          </div>
          
          <div className="space-y-2">
            {tempahan.filter(t => t.status === "menunggu").map((item) => (
              <div key={item.id} className="border border-gray-200 rounded-lg p-2">
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-gray-900 text-sm">{item.nama}</h3>
                      <p className="text-gray-600 text-xs">{item.barang}</p>
                      <p className="text-gray-500 text-xs">Tarikh: {item.tarikh}</p>
                    </div>
                    <span className={`${getStatusColor(item.status)} text-xs px-2 py-1 rounded`}>
                      {getStatusText(item.status)}
                    </span>
                  </div>
                  
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleKelulusan(item.id, "lulus")}
                      className="flex-1 bg-green-500 text-white py-1 rounded text-xs hover:bg-green-600 transition-colors"
                    >
                      ✅ Lulus
                    </button>
                    <button 
                      onClick={() => handleKelulusan(item.id, "tolak")}
                      className="flex-1 bg-red-500 text-white py-1 rounded text-xs hover:bg-red-600 transition-colors"
                    >
                      ❌ Tolak
                    </button>
                  </div>
                </div>
              </div>
            ))}
            
            {tempahan.filter(t => t.status === "menunggu").length === 0 && (
              <div className="text-center py-4">
                <p className="text-gray-500 text-sm">Tiada tempahan menunggu kelulusan</p>
                <button 
                  onClick={handleKeKelulusan}
                  className="text-blue-500 text-xs hover:text-blue-600 mt-2"
                >
                  Pergi ke halaman kelulusan →
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Senarai Barang - Manage Status */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-20">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <h2 className="font-semibold text-gray-900 text-sm">📦 Urus Status Barang</h2>
              <button 
                onClick={handleKeBarang}
                className="bg-green-500 text-white px-2 py-1 rounded text-xs hover:bg-green-600 transition-colors"
              >
                Urus Barang
              </button>
            </div>
            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
              {senaraiBarang.length} barang
            </span>
          </div>
          
          <div className="space-y-2">
            {senaraiBarang.slice(0, 3).map((barang) => (
              <div key={barang.id} className="border border-gray-200 rounded-lg p-2">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 text-sm">{barang.nama}</h3>
                    <div className="flex items-center gap-1 mt-1">
                      <span className="bg-gray-100 text-gray-700 text-xs px-1 py-0.5 rounded">
                        {barang.kategori}
                      </span>
                      <span className={`${getStatusColor(barang.status)} text-xs px-1 py-0.5 rounded`}>
                        {getStatusText(barang.status)}
                      </span>
                    </div>
                  </div>
                  
                  <select 
                    value={barang.status}
                    onChange={(e) => handleUpdateStatusBarang(barang.id, e.target.value)}
                    className="border border-gray-300 rounded-lg px-2 py-1 text-xs focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="tersedia">Tersedia</option>
                    <option value="dipinjam">Dipinjam</option>
                    <option value="rosak">Rosak</option>
                  </select>
                </div>
              </div>
            ))}
            <button 
              onClick={handleKeBarang}
              className="w-full bg-green-50 text-green-700 py-2 rounded-lg text-xs font-medium hover:bg-green-100 transition-colors"
            >
              Lihat Semua Barang →
            </button>
          </div>
        </div>

        {/* ✅ UPDATED: Bottom Navigation - DENGAN 5 ITEM TERMASUK PROFIL */}
        <div className="fixed bottom-4 left-4 right-4 bg-white rounded-xl shadow-lg p-3 border border-gray-200">
          <div className="flex justify-between items-center">
            <button className="flex-1 text-center py-2 px-1 bg-blue-500 text-white rounded-lg text-xs font-medium mx-1">
              🏠 Dashboard
            </button>
            <button 
              onClick={handleKeKelulusan}
              className="flex-1 text-center py-2 px-1 bg-gray-100 text-gray-700 rounded-lg text-xs font-medium mx-1 hover:bg-gray-200 transition-colors"
            >
              📋 Kelulusan
            </button>
            <button 
              onClick={handleKeBarang}
              className="flex-1 text-center py-2 px-1 bg-gray-100 text-gray-700 rounded-lg text-xs font-medium mx-1 hover:bg-gray-200 transition-colors"
            >
              📦 Barang
            </button>
            <button 
              onClick={handleKeLaporan}
              className="flex-1 text-center py-2 px-1 bg-gray-100 text-gray-700 rounded-lg text-xs font-medium mx-1 hover:bg-gray-200 transition-colors"
            >
              📊 Laporan
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