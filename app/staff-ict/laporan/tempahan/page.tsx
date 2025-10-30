"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function LaporanTempahanPage() {
  const router = useRouter();
  const [stats, setStats] = useState({
    totalTempahan: 0,
    tempahanBaru: 0,
    menungguKelulusan: 0,
    tempahanAktif: 0
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

  // Mock data untuk stats
  useEffect(() => {
    setTimeout(() => {
      setStats({
        totalTempahan: 156,
        tempahanBaru: 12,
        menungguKelulusan: 8,
        tempahanAktif: 45
      });
    }, 500);
  }, []);

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
            <h1 className="text-xl font-bold text-gray-900">📄 Laporan Tempahan</h1>
            <p className="text-gray-600 text-sm mt-1">Laporan dan analisis tempahan sistem</p>
          </div>
        </div>

        {/* ✅ LAPORAN OPTIONS GRID DARI ROOT LAPORAN/PAGE.TSX */}
        <div className="space-y-3 mb-4">
          {/* Laporan Keseluruhan */}
          <button 
            onClick={handleLaporanKeseluruhan}
            className="w-full bg-white rounded-xl shadow-sm p-4 text-left hover:bg-gray-50 transition-colors border border-gray-200"
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
              <span className="text-gray-400">→</span>
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
            className="w-full bg-white rounded-xl shadow-sm p-4 text-left hover:bg-gray-50 transition-colors border border-blue-200"
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
              <span className="text-blue-400">●</span>
            </div>
          </button>
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

        {/* Quick Stats - Mobile Friendly */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600">Total Tempahan</p>
                <p className="text-lg font-bold text-gray-900">{stats.totalTempahan}</p>
              </div>
              <div className="bg-blue-100 p-2 rounded-lg">
                <span className="text-blue-600 text-sm">📦</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600">Tempahan Baru</p>
                <p className="text-lg font-bold text-gray-900">{stats.tempahanBaru}</p>
              </div>
              <div className="bg-green-100 p-2 rounded-lg">
                <span className="text-green-600 text-sm">🆕</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-yellow-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600">Menunggu Kelulusan</p>
                <p className="text-lg font-bold text-gray-900">{stats.menungguKelulusan}</p>
              </div>
              <div className="bg-yellow-100 p-2 rounded-lg">
                <span className="text-yellow-600 text-sm">⏳</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600">Tempahan Aktif</p>
                <p className="text-lg font-bold text-gray-900">{stats.tempahanAktif}</p>
              </div>
              <div className="bg-purple-100 p-2 rounded-lg">
                <span className="text-purple-600 text-sm">✅</span>
              </div>
            </div>
          </div>
        </div>

        {/* Laporan Tempahan Content */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
          <h2 className="font-semibold text-gray-900 text-sm mb-3">📊 Analisis Tempahan</h2>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <span className="text-blue-600 text-sm">📈</span>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-900">Trend Tempahan Bulanan</p>
                  <p className="text-gray-600 text-xs">Peningkatan 15% dari bulan lepas</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="bg-green-100 p-2 rounded-lg">
                  <span className="text-green-600 text-sm">⏰</span>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-900">Waktu Puncak</p>
                  <p className="text-gray-600 text-xs">Isnin & Selasa (10:00-12:00)</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="bg-purple-100 p-2 rounded-lg">
                  <span className="text-purple-600 text-sm">👥</span>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-900">Pengguna Aktif</p>
                  <p className="text-gray-600 text-xs">45 pengguna membuat tempahan</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Template Laporan */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
          <h2 className="font-semibold text-gray-900 text-sm mb-3">📋 Template Laporan</h2>
          
          <div className="space-y-2">
            <button className="w-full bg-gray-50 rounded-lg p-3 text-left hover:bg-gray-100 transition-colors border border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <span className="text-blue-600 text-sm">📅</span>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 text-sm">Laporan Harian</h3>
                    <p className="text-gray-600 text-xs">Ringkasan aktiviti harian</p>
                  </div>
                </div>
                <span className="text-gray-400 text-sm">📥</span>
              </div>
            </button>

            <button className="w-full bg-gray-50 rounded-lg p-3 text-left hover:bg-gray-100 transition-colors border border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-green-100 p-2 rounded-lg">
                    <span className="text-green-600 text-sm">📊</span>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 text-sm">Laporan Mingguan</h3>
                    <p className="text-gray-600 text-xs">Analisis prestasi mingguan</p>
                  </div>
                </div>
                <span className="text-gray-400 text-sm">📥</span>
              </div>
            </button>

            <button className="w-full bg-gray-50 rounded-lg p-3 text-left hover:bg-gray-100 transition-colors border border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-purple-100 p-2 rounded-lg">
                    <span className="text-purple-600 text-sm">📈</span>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 text-sm">Laporan Bulanan</h3>
                    <p className="text-gray-600 text-xs">Statistik bulanan lengkap</p>
                  </div>
                </div>
                <span className="text-gray-400 text-sm">📥</span>
              </div>
            </button>
          </div>
        </div>

        {/* Recent Activity - Mobile Optimized */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-20">
          <h2 className="font-semibold text-gray-900 text-sm mb-3">🕒 Aktiviti Tempahan Terkini</h2>
          <div className="space-y-2">
            <div className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
              <div className="bg-blue-100 p-1 rounded">
                <span className="text-blue-600 text-xs">📋</span>
              </div>
              <div className="flex-1">
                <p className="text-xs font-medium text-gray-900">Tempahan baru diterima</p>
                <p className="text-gray-500 text-xs">2 minit lalu</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
              <div className="bg-green-100 p-1 rounded">
                <span className="text-green-600 text-xs">✅</span>
              </div>
              <div className="flex-1">
                <p className="text-xs font-medium text-gray-900">Tempahan diluluskan</p>
                <p className="text-gray-500 text-xs">1 jam lalu</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
              <div className="bg-yellow-100 p-1 rounded">
                <span className="text-yellow-600 text-xs">⏳</span>
              </div>
              <div className="flex-1">
                <p className="text-xs font-medium text-gray-900">Menunggu kelulusan</p>
                <p className="text-gray-500 text-xs">3 tempahan</p>
              </div>
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
    </div>
  );
}