"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function LaporanKeseluruhanPage() {
  const router = useRouter();
  const [selectedPeriod, setSelectedPeriod] = useState("bulan-ini");
  const [loading, setLoading] = useState(true);

  // Data statistik
  const [stats, setStats] = useState({
    totalTempahan: 0,
    tempahanBerjaya: 0,
    tempahanDitolak: 0,
    kadarKejayaan: 0,
    barangPopular: "-",
    waktuSibuk: "-"
  });

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

  // ✅ Navigation untuk laporan types
  const handleLaporanKeseluruhan = () => {
    router.push("/staff-ict/laporan/keseluruhan");
  };

  const handleLaporanBarang = () => {
    router.push("/staff-ict/laporan/barang");
  };

  const handleLaporanTempahan = () => {
    router.push("/staff-ict/laporan/tempahan");
  };

  // Mock data loading
  useEffect(() => {
    const loadData = () => {
      setLoading(true);
      setTimeout(() => {
        setStats({
          totalTempahan: 234,
          tempahanBerjaya: 189,
          tempahanDitolak: 45,
          kadarKejayaan: 80.8,
          barangPopular: "Laptop Dell XPS 13",
          waktuSibuk: "10:00 AM - 12:00 PM"
        });
        setLoading(false);
      }, 1000);
    };

    loadData();
  }, [selectedPeriod]);

  return (
    <div className="min-h-screen bg-gray-50 p-3 pb-24">
      <div className="max-w-4xl mx-auto">
        {/* ✅ HEADER SAMA SEPERTI PAGE LAIN - DENGAN BUTANG ← DASHBOARD & LOG KELUAR */}
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
            <h1 className="text-xl font-bold text-gray-900">📈 Laporan Keseluruhan</h1>
            <p className="text-gray-600 text-sm mt-1">Statistik menyeluruh sistem tempahan</p>
          </div>

          {/* ✅ PERIOD SELECTOR DI BAWAH TITLE */}
          <div className="flex justify-center mt-3">
            <select 
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="bg-gray-100 border border-gray-300 rounded-lg px-3 py-1 text-sm"
            >
              <option value="minggu-ini">Minggu Ini</option>
              <option value="bulan-ini">Bulan Ini</option>
              <option value="tahun-ini">Tahun Ini</option>
              <option value="semua-masa">Semua Masa</option>
            </select>
          </div>
        </div>

        {/* ✅ QUICK STATS DARI ROOT LAPORAN/PAGE.TSX */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
          <h3 className="font-semibold text-gray-900 text-sm mb-3 text-center">📈 Statistik Ringkas</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-green-50 rounded-lg p-3 text-center">
              <div className="text-lg font-bold text-green-600">45</div>
              <div className="text-xs text-green-700">Diluluskan</div>
            </div>
            <div className="bg-red-50 rounded-lg p-3 text-center">
              <div className="text-lg font-bold text-red-600">12</div>
              <div className="text-xs text-red-700">Ditolak</div>
            </div>
            <div className="bg-blue-50 rounded-lg p-3 text-center">
              <div className="text-lg font-bold text-blue-600">38</div>
              <div className="text-xs text-blue-700">Dikembalikan</div>
            </div>
            <div className="bg-purple-50 rounded-lg p-3 text-center">
              <div className="text-lg font-bold text-purple-600">15</div>
              <div className="text-xs text-purple-700">Barang Baru</div>
            </div>
          </div>
        </div>

        {/* ✅ LAPORAN OPTIONS GRID DARI ROOT LAPORAN/PAGE.TSX */}
        <div className="space-y-3 mb-4">
          {/* Laporan Keseluruhan */}
          <button 
            onClick={handleLaporanKeseluruhan}
            className="w-full bg-white rounded-xl shadow-sm p-4 text-left hover:bg-gray-50 transition-colors border border-blue-200"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <span className="text-blue-600 text-lg">📈</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm">Laporan Keseluruhan</h3>
                  <p className="text-gray-600 text-xs">Statistik menyeluruh sistem</p>
                </div>
              </div>
              <span className="text-blue-400">●</span>
            </div>
          </button>

          {/* Laporan Barang */}
          <button 
            onClick={handleLaporanBarang}
            className="w-full bg-white rounded-xl shadow-sm p-4 text-left hover:bg-gray-50 transition-colors border border-gray-200"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-green-100 p-3 rounded-lg">
                  <span className="text-green-600 text-lg">📦</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm">Laporan Barang</h3>
                  <p className="text-gray-600 text-xs">Analisis penggunaan barang</p>
                </div>
              </div>
              <span className="text-gray-400">→</span>
            </div>
          </button>

          {/* Laporan Tempahan */}
          <button 
            onClick={handleLaporanTempahan}
            className="w-full bg-white rounded-xl shadow-sm p-4 text-left hover:bg-gray-50 transition-colors border border-gray-200"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-purple-100 p-3 rounded-lg">
                  <span className="text-purple-600 text-lg">📄</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm">Laporan Tempahan</h3>
                  <p className="text-gray-600 text-xs">Laporan tempahan sistem</p>
                </div>
              </div>
              <span className="text-gray-400">→</span>
            </div>
          </button>
        </div>

        {/* ✅ INFO SECTION DARI ROOT LAPORAN/PAGE.TSX */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4">
          <div className="flex items-start gap-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <span className="text-blue-600 text-sm">💡</span>
            </div>
            <div>
              <h4 className="font-semibold text-blue-800 text-sm mb-2">Cara Menggunakan Laporan</h4>
              <ul className="text-blue-700 text-xs space-y-1">
                <li>• <strong>Keseluruhan</strong> - Overview semua aktiviti</li>
                <li>• <strong>Barang</strong> - Analisis penggunaan inventori</li>
                <li>• <strong>Tempahan</strong> - Template laporan sedia ada</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          {/* Total Tempahan */}
          <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600">Total Tempahan</p>
                <p className="text-lg font-bold text-gray-900">
                  {loading ? "..." : stats.totalTempahan}
                </p>
              </div>
              <div className="bg-blue-100 p-2 rounded-lg">
                <span className="text-blue-600 text-sm">📋</span>
              </div>
            </div>
            <p className="text-gray-500 text-xs mt-1">Semua tempahan</p>
          </div>

          {/* Tempahan Berjaya */}
          <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600">Berjaya</p>
                <p className="text-lg font-bold text-gray-900">
                  {loading ? "..." : stats.tempahanBerjaya}
                </p>
              </div>
              <div className="bg-green-100 p-2 rounded-lg">
                <span className="text-green-600 text-sm">✅</span>
              </div>
            </div>
            <p className="text-gray-500 text-xs mt-1">Diluluskan</p>
          </div>

          {/* Tempahan Ditolak */}
          <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-red-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600">Ditolak</p>
                <p className="text-lg font-bold text-gray-900">
                  {loading ? "..." : stats.tempahanDitolak}
                </p>
              </div>
              <div className="bg-red-100 p-2 rounded-lg">
                <span className="text-red-600 text-sm">❌</span>
              </div>
            </div>
            <p className="text-gray-500 text-xs mt-1">Tidak diluluskan</p>
          </div>

          {/* Kadar Kejayaan */}
          <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600">Kadar Kejayaan</p>
                <p className="text-lg font-bold text-gray-900">
                  {loading ? "..." : `${stats.kadarKejayaan}%`}
                </p>
              </div>
              <div className="bg-purple-100 p-2 rounded-lg">
                <span className="text-purple-600 text-sm">📊</span>
              </div>
            </div>
            <p className="text-gray-500 text-xs mt-1">Nisbah berjaya</p>
          </div>
        </div>

        {/* Additional Insights */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
          <h2 className="font-semibold text-gray-900 text-sm mb-3">💡 Analisis Tambahan</h2>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <span className="text-blue-600 text-sm">🏆</span>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-900">Barang Paling Popular</p>
                  <p className="text-gray-600 text-xs">{loading ? "Memuatkan..." : stats.barangPopular}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="bg-green-100 p-2 rounded-lg">
                  <span className="text-green-600 text-sm">⏰</span>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-900">Waktu Permintaan Tinggi</p>
                  <p className="text-gray-600 text-xs">{loading ? "Memuatkan..." : stats.waktuSibuk}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Trend Chart Placeholder */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
          <h2 className="font-semibold text-gray-900 text-sm mb-3">📈 Trend Tempahan</h2>
          <div className="bg-gray-50 rounded-lg p-8 text-center">
            <div className="text-4xl mb-3">📊</div>
            <p className="text-gray-600 text-sm mb-2">Graf trend tempahan</p>
            <p className="text-gray-500 text-xs">Data visualisasi akan dipaparkan di sini</p>
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-20">
          <h2 className="font-semibold text-gray-900 text-sm mb-3">📦 Taburan Mengikut Kategori</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-blue-500 text-sm">💻</span>
                <span className="text-gray-700 text-sm">Laptop & Komputer</span>
              </div>
              <span className="text-gray-900 text-sm font-medium">45%</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-green-500 text-sm">📱</span>
                <span className="text-gray-700 text-sm">Tablet & Mobile</span>
              </div>
              <span className="text-gray-900 text-sm font-medium">25%</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-purple-500 text-sm">🎥</span>
                <span className="text-gray-700 text-sm">AV Equipment</span>
              </div>
              <span className="text-gray-900 text-sm font-medium">15%</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-orange-500 text-sm">🔌</span>
                <span className="text-gray-700 text-sm">Aksesori</span>
              </div>
              <span className="text-gray-900 text-sm font-medium">10%</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-red-500 text-sm">🖨️</span>
                <span className="text-gray-700 text-sm">Printer & Scanner</span>
              </div>
              <span className="text-gray-900 text-sm font-medium">5%</span>
            </div>
          </div>
        </div>

        {/* ✅ UPDATED: Bottom Navigation - DENGAN 5 ITEM TERMASUK PROFIL */}
        <div className="fixed bottom-4 left-4 right-4 bg-white rounded-xl shadow-lg p-3 border border-gray-200">
          <div className="flex justify-between items-center">
            <button 
              onClick={handleKeDashboard}
              className="flex-1 text-center py-2 px-1 bg-gray-100 text-gray-700 rounded-lg text-xs font-medium mx-1 hover:bg-gray-200 transition-colors"
            >
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
            <button className="flex-1 text-center py-2 px-1 bg-blue-500 text-white rounded-lg text-xs font-medium mx-1">
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

      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-3"></div>
            <p className="text-gray-700 text-sm">Memuatkan data laporan...</p>
          </div>
        </div>
      )}
    </div>
  );
}