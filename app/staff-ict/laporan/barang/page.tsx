"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";

// Interface untuk laporan barang
interface LaporanBarang {
  id: number;
  nama: string;
  kategori: string;
  status: string;
  lokasi: string;
  kodBarang: string;
  tarikhDaftar: string;
  jumlahPinjaman: number;
  kadarPenggunaan: number;
  statusKesihatan: "baik" | "perlu_servis" | "rosak";
  tempohPurataPinjam: number;
  catatan?: string;
}

interface StatistikBarang {
  totalBarang: number;
  barangTersedia: number;
  barangDipinjam: number;
  barangRosak: number;
  barangServis: number;
  kadarPenggunaan: number;
  barangPopular: string;
  purataTempohPinjam: number;
}

export default function LaporanBarangPage() {
  const router = useRouter();
  const [carian, setCarian] = useState<string>("");
  const [filterKategori, setFilterKategori] = useState<string>("semua");
  const [filterStatus, setFilterStatus] = useState<string>("semua");
  const [filterKesihatan, setFilterKesihatan] = useState<string>("semua");
  
  // ✅ PAGINATION STATE
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(5); // 5 items per page

  // Data statistik barang
  const [statistik, setStatistik] = useState<StatistikBarang>({
    totalBarang: 156,
    barangTersedia: 89,
    barangDipinjam: 45,
    barangRosak: 12,
    barangServis: 10,
    kadarPenggunaan: 68,
    barangPopular: "Laptop Dell XPS 13",
    purataTempohPinjam: 4.7
  });

  // Data contoh laporan barang (lebih banyak data untuk demo pagination)
  const [laporanBarang, setLaporanBarang] = useState<LaporanBarang[]>([
    {
      id: 1, nama: "Laptop Dell XPS 13", kategori: "elektronik", status: "tersedia", lokasi: "Makmal Komputer 1", kodBarang: "ICT-LAP-001", tarikhDaftar: "2024-01-10", jumlahPinjaman: 23, kadarPenggunaan: 85, statusKesihatan: "baik", tempohPurataPinjam: 5.2
    },
    {
      id: 2, nama: "Projector Epson EB-X41", kategori: "elektronik", status: "dipinjam", lokasi: "Bilik Media", kodBarang: "ICT-PRO-002", tarikhDaftar: "2024-01-12", jumlahPinjaman: 18, kadarPenggunaan: 72, statusKesihatan: "perlu_servis", tempohPurataPinjam: 3.8, catatan: "Lampu projector mulai malap"
    },
    {
      id: 3, nama: "Kamera Canon EOS R6", kategori: "fotografi", status: "tersedia", lokasi: "Unit Media", kodBarang: "ICT-CAM-003", tarikhDaftar: "2024-01-08", jumlahPinjaman: 31, kadarPenggunaan: 92, statusKesihatan: "baik", tempohPurataPinjam: 6.1
    },
    {
      id: 4, nama: "Tripod Manfrotto", kategori: "fotografi", status: "rosak", lokasi: "Unit Media", kodBarang: "ICT-TRI-004", tarikhDaftar: "2024-01-05", jumlahPinjaman: 15, kadarPenggunaan: 45, statusKesihatan: "rosak", tempohPurataPinjam: 4.3, catatan: "Kaki tripod patah - perlu diganti"
    },
    {
      id: 5, nama: "Calculator Scientific Casio", kategori: "alat-tulis", status: "tersedia", lokasi: "Kaunter ICT", kodBarang: "ICT-CAL-005", tarikhDaftar: "2024-01-15", jumlahPinjaman: 8, kadarPenggunaan: 25, statusKesihatan: "baik", tempohPurataPinjam: 2.5
    },
    {
      id: 6, nama: "Microphone Blue Yeti", kategori: "audio", status: "dipinjam", lokasi: "Studio Rakaman", kodBarang: "ICT-MIC-006", tarikhDaftar: "2024-01-20", jumlahPinjaman: 12, kadarPenggunaan: 60, statusKesihatan: "baik", tempohPurataPinjam: 3.2
    },
    {
      id: 7, nama: "Tablet iPad Pro", kategori: "elektronik", status: "servis", lokasi: "Makmal Komputer 2", kodBarang: "ICT-TAB-007", tarikhDaftar: "2024-01-18", jumlahPinjaman: 27, kadarPenggunaan: 78, statusKesihatan: "perlu_servis", tempohPurataPinjam: 4.8, catatan: "Screen diganti - dalam warranty"
    },
    {
      id: 8, nama: "Speaker Bluetooth JBL", kategori: "audio", status: "tersedia", lokasi: "Bilik Media", kodBarang: "ICT-SPK-008", tarikhDaftar: "2024-01-22", jumlahPinjaman: 5, kadarPenggunaan: 18, statusKesihatan: "baik", tempohPurataPinjam: 2.1
    },
    {
      id: 9, nama: "VR Headset Oculus", kategori: "elektronik", status: "dipinjam", lokasi: "Makmal Multimedia", kodBarang: "ICT-VR-009", tarikhDaftar: "2024-02-01", jumlahPinjaman: 9, kadarPenggunaan: 75, statusKesihatan: "baik", tempohPurataPinjam: 5.5
    },
    {
      id: 10, nama: "Printer Laser HP", kategori: "elektronik", status: "rosak", lokasi: "Pejabat ICT", kodBarang: "ICT-PRI-010", tarikhDaftar: "2024-01-25", jumlahPinjaman: 0, kadarPenggunaan: 0, statusKesihatan: "rosak", tempohPurataPinjam: 0, catatan: "Paper jam berulang - perlu technician"
    },
    {
      id: 11, nama: "Monitor LG 24inch", kategori: "elektronik", status: "tersedia", lokasi: "Makmal Komputer 1", kodBarang: "ICT-MON-011", tarikhDaftar: "2024-02-05", jumlahPinjaman: 7, kadarPenggunaan: 35, statusKesihatan: "baik", tempohPurataPinjam: 3.0
    },
    {
      id: 12, nama: "Webcam Logitech", kategori: "elektronik", status: "dipinjam", lokasi: "Bilik Media", kodBarang: "ICT-WEB-012", tarikhDaftar: "2024-02-08", jumlahPinjaman: 14, kadarPenggunaan: 65, statusKesihatan: "baik", tempohPurataPinjam: 2.8
    },
    {
      id: 13, nama: "Graphics Tablet Wacom", kategori: "elektronik", status: "tersedia", lokasi: "Makmal Multimedia", kodBarang: "ICT-TAB-013", tarikhDaftar: "2024-02-10", jumlahPinjaman: 6, kadarPenggunaan: 28, statusKesihatan: "baik", tempohPurataPinjam: 4.2
    },
    {
      id: 14, nama: "External Harddisk 1TB", kategori: "elektronik", status: "dipinjam", lokasi: "Kaunter ICT", kodBarang: "ICT-HDD-014", tarikhDaftar: "2024-02-12", jumlahPinjaman: 11, kadarPenggunaan: 52, statusKesihatan: "baik", tempohPurataPinjam: 3.5
    },
    {
      id: 15, nama: "Wireless Mouse Logitech", kategori: "elektronik", status: "tersedia", lokasi: "Makmal Komputer 2", kodBarang: "ICT-MOU-015", tarikhDaftar: "2024-02-15", jumlahPinjaman: 19, kadarPenggunaan: 88, statusKesihatan: "perlu_servis", tempohPurataPinjam: 2.1, catatan: "Bateri lemah - perlu diganti"
    }
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

  const handleExportLaporan = () => {
    alert("Laporan barang berjaya diexport ke format CSV!");
    // Simulate export functionality
  };

  // ✅ PAGINATION FUNCTIONS
  const handleNextPage = () => {
    setCurrentPage(prev => prev + 1);
  };

  const handlePrevPage = () => {
    setCurrentPage(prev => Math.max(1, prev - 1));
  };

  const handlePageClick = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  // Filter laporan berdasarkan carian dan filter
  const laporanTertapis = laporanBarang.filter(barang => {
    const matchesCarian = barang.nama.toLowerCase().includes(carian.toLowerCase()) ||
                         barang.kodBarang.toLowerCase().includes(carian.toLowerCase()) ||
                         barang.lokasi.toLowerCase().includes(carian.toLowerCase());
    const matchesKategori = filterKategori === "semua" || barang.kategori === filterKategori;
    const matchesStatus = filterStatus === "semua" || barang.status === filterStatus;
    const matchesKesihatan = filterKesihatan === "semua" || barang.statusKesihatan === filterKesihatan;
    return matchesCarian && matchesKategori && matchesStatus && matchesKesihatan;
  });

  // ✅ PAGINATION CALCULATIONS
  const totalPages = Math.ceil(laporanTertapis.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = laporanTertapis.slice(startIndex, startIndex + itemsPerPage);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [carian, filterKategori, filterStatus, filterKesihatan]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "tersedia": return "bg-green-100 text-green-800";
      case "dipinjam": return "bg-blue-100 text-blue-800";
      case "rosak": return "bg-red-100 text-red-800";
      case "servis": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "tersedia": return "Tersedia";
      case "dipinjam": return "Dipinjam";
      case "rosak": return "Rosak";
      case "servis": return "Dalam Servis";
      default: return status;
    }
  };

  const getKategoriColor = (kategori: string) => {
    switch (kategori) {
      case "elektronik": return "bg-blue-100 text-blue-800";
      case "fotografi": return "bg-purple-100 text-purple-800";
      case "alat-tulis": return "bg-orange-100 text-orange-800";
      case "audio": return "bg-pink-100 text-pink-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getKategoriText = (kategori: string) => {
    switch (kategori) {
      case "elektronik": return "Elektronik";
      case "fotografi": return "Fotografi";
      case "alat-tulis": return "Alat Tulis";
      case "audio": return "Audio";
      default: return kategori;
    }
  };

  const getKesihatanColor = (kesihatan: string) => {
    switch (kesihatan) {
      case "baik": return "bg-green-100 text-green-800";
      case "perlu_servis": return "bg-yellow-100 text-yellow-800";
      case "rosak": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getKesihatanText = (kesihatan: string) => {
    switch (kesihatan) {
      case "baik": return "Baik";
      case "perlu_servis": return "Perlu Servis";
      case "rosak": return "Rosak";
      default: return kesihatan;
    }
  };

  const getKesihatanIcon = (kesihatan: string) => {
    switch (kesihatan) {
      case "baik": return "✅";
      case "perlu_servis": return "⚠️";
      case "rosak": return "❌";
      default: return "📦";
    }
  };

  // Format tarikh untuk display
  const formatTarikh = (tarikh: string) => {
    return new Date(tarikh).toLocaleDateString('ms-MY', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-3 pb-24">
      <div className="max-w-7xl mx-auto">
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
            <h1 className="text-xl font-bold text-gray-900">📦 Laporan Barang</h1>
            <p className="text-gray-600 text-sm mt-1">Analisis dan statistik inventori barang ICT</p>
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
            className="w-full bg-white rounded-xl shadow-sm p-4 text-left hover:bg-gray-50 transition-colors border border-blue-200"
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
              <span className="text-blue-400">●</span>
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

        {/* Main Stats Cards - Mobile Optimized */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-white rounded-xl shadow-sm p-3 text-center">
            <div className="text-lg font-bold text-blue-600">{statistik.totalBarang}</div>
            <div className="text-xs text-gray-600">Total Barang</div>
            <div className="text-xs text-blue-600 mt-1">Dalam inventori</div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-3 text-center">
            <div className="text-lg font-bold text-green-600">{statistik.barangTersedia}</div>
            <div className="text-xs text-gray-600">Tersedia</div>
            <div className="text-xs text-green-600 mt-1">{Math.round((statistik.barangTersedia / statistik.totalBarang) * 100)}% dari total</div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-3 text-center">
            <div className="text-lg font-bold text-orange-600">{statistik.barangDipinjam}</div>
            <div className="text-xs text-gray-600">Dipinjam</div>
            <div className="text-xs text-orange-600 mt-1">Sedang digunakan</div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-3 text-center">
            <div className="text-lg font-bold text-red-600">{statistik.barangRosak + statistik.barangServis}</div>
            <div className="text-xs text-gray-600">Perhatian</div>
            <div className="text-xs text-red-600 mt-1">Rosak & Servis</div>
          </div>
        </div>

        {/* Additional Stats - Mobile Optimized */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-white rounded-xl shadow-sm p-3 text-center">
            <div className="text-lg font-bold text-purple-600">{statistik.kadarPenggunaan}%</div>
            <div className="text-xs text-gray-600">Kadar Penggunaan</div>
            <div className="text-xs text-purple-600 mt-1">Efisiensi inventori</div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-3 text-center">
            <div className="text-sm font-bold text-gray-800 truncate">{statistik.barangPopular}</div>
            <div className="text-xs text-gray-600">Barang Popular</div>
            <div className="text-xs text-gray-600 mt-1">Paling banyak dipinjam</div>
          </div>
        </div>

        {/* Kesihatan Inventori - Mobile Optimized */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
          <h3 className="font-semibold text-gray-900 text-sm mb-4">🏥 Kesihatan Inventori</h3>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-600">Barang Baik</span>
                <span className="font-semibold">{laporanBarang.filter(b => b.statusKesihatan === "baik").length}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-600 h-2 rounded-full" 
                  style={{ width: `${(laporanBarang.filter(b => b.statusKesihatan === "baik").length / laporanBarang.length) * 100}%` }}
                ></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-600">Perlu Servis</span>
                <span className="font-semibold">{laporanBarang.filter(b => b.statusKesihatan === "perlu_servis").length}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-yellow-600 h-2 rounded-full" 
                  style={{ width: `${(laporanBarang.filter(b => b.statusKesihatan === "perlu_servis").length / laporanBarang.length) * 100}%` }}
                ></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-600">Barang Rosak</span>
                <span className="font-semibold">{laporanBarang.filter(b => b.statusKesihatan === "rosak").length}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-red-600 h-2 rounded-full" 
                  style={{ width: `${(laporanBarang.filter(b => b.statusKesihatan === "rosak").length / laporanBarang.length) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters & Search - Mobile Optimized */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Carian Barang</label>
              <input
                type="text"
                placeholder="Cari nama, kod atau lokasi..."
                value={carian}
                onChange={(e) => setCarian(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
            </div>
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
                <option value="audio">Audio</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Status</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              >
                <option value="semua">Semua Status</option>
                <option value="tersedia">Tersedia</option>
                <option value="dipinjam">Dipinjam</option>
                <option value="rosak">Rosak</option>
                <option value="servis">Servis</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Kesihatan</label>
              <select
                value={filterKesihatan}
                onChange={(e) => setFilterKesihatan(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              >
                <option value="semua">Semua Kesihatan</option>
                <option value="baik">Baik</option>
                <option value="perlu_servis">Perlu Servis</option>
                <option value="rosak">Rosak</option>
              </select>
            </div>
          </div>

          {/* Export Button */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
            <div className="flex-1">
              <label className="block text-xs font-medium text-gray-700 mb-1">Export Laporan</label>
              <button 
                onClick={handleExportLaporan}
                className="w-full bg-green-500 text-white px-3 py-2 rounded-lg hover:bg-green-600 transition-colors text-sm"
              >
                📈 Export Laporan
              </button>
            </div>
            
            <div className="flex-1">
              <label className="block text-xs font-medium text-gray-700 mb-1">Actions</label>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center w-full">
                <p className="text-blue-800 font-semibold text-sm">
                  {laporanTertapis.length} barang
                </p>
                <p className="text-blue-600 text-xs">ditemui</p>
              </div>
            </div>
          </div>
        </div>

        {/* Senarai Laporan Barang - Mobile Optimized dengan PAGINATION */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900 text-sm">Detail Inventori Barang</h2>
            <div className="flex items-center gap-2">
              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                {laporanTertapis.length} barang
              </span>
              <span className="text-gray-500 text-xs">
                Halaman {currentPage} dari {totalPages}
              </span>
            </div>
          </div>
          
          <div className="space-y-3">
            {currentItems.map((barang) => (
              <div key={barang.id} className="border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow">
                <div className="flex flex-col gap-3">
                  {/* Header Info */}
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 text-sm">{barang.nama}</h3>
                      <p className="text-gray-600 text-xs mt-1">
                        <strong>Kod:</strong> {barang.kodBarang} | <strong>Lokasi:</strong> {barang.lokasi}
                      </p>
                      <p className="text-gray-500 text-xs mt-1">
                        <strong>Daftar:</strong> {formatTarikh(barang.tarikhDaftar)}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className={`${getKategoriColor(barang.kategori)} text-xs px-2 py-1 rounded font-medium`}>
                        {getKategoriText(barang.kategori)}
                      </span>
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-gray-50 rounded p-2">
                      <span className="text-gray-500">Jumlah Pinjaman:</span>
                      <p className="text-gray-900 mt-1">{barang.jumlahPinjaman} kali</p>
                    </div>
                    <div className="bg-gray-50 rounded p-2">
                      <span className="text-gray-500">Kadar Penggunaan:</span>
                      <p className="text-gray-900 mt-1">{barang.kadarPenggunaan}%</p>
                    </div>
                    <div className="bg-gray-50 rounded p-2">
                      <span className="text-gray-500">Purata Tempoh:</span>
                      <p className="text-gray-900 mt-1">{barang.tempohPurataPinjam} hari</p>
                    </div>
                    <div className="bg-gray-50 rounded p-2">
                      <span className="text-gray-500">Status:</span>
                      <p className="mt-1">
                        <span className={`${getStatusColor(barang.status)} text-xs px-1 py-0.5 rounded`}>
                          {getStatusText(barang.status)}
                        </span>
                      </p>
                    </div>
                  </div>

                  {/* Kesihatan Status */}
                  <div className="flex items-center justify-between">
                    <span className={`${getKesihatanColor(barang.statusKesihatan)} text-xs px-2 py-1 rounded`}>
                      {getKesihatanIcon(barang.statusKesihatan)} {getKesihatanText(barang.statusKesihatan)}
                    </span>
                  </div>

                  {/* Catatan jika ada */}
                  {barang.catatan && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded p-2">
                      <p className="text-yellow-700 text-xs">📝 {barang.catatan}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {currentItems.length === 0 && (
              <div className="text-center py-8">
                <div className="text-4xl mb-2">📦</div>
                <p className="text-gray-500 text-sm">Tiada barang ditemui</p>
                <p className="text-gray-400 text-xs mt-1">Cuba ubah carian atau filter anda</p>
              </div>
            )}
          </div>

          {/* ✅ PAGINATION CONTROLS */}
          {totalPages > 1 && (
            <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-200">
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className={`flex items-center gap-1 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                  currentPage === 1 
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                    : 'bg-gray-500 text-white hover:bg-gray-600'
                }`}
              >
                ← Sebelumnya
              </button>

              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNumber;
                  if (totalPages <= 5) {
                    pageNumber = i + 1;
                  } else if (currentPage <= 3) {
                    pageNumber = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNumber = totalPages - 4 + i;
                  } else {
                    pageNumber = currentPage - 2 + i;
                  }

                  return (
                    <button
                      key={pageNumber}
                      onClick={() => handlePageClick(pageNumber)}
                      className={`w-8 h-8 rounded-lg text-xs font-medium transition-colors ${
                        currentPage === pageNumber
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {pageNumber}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className={`flex items-center gap-1 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                  currentPage === totalPages
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-500 text-white hover:bg-gray-600'
                }`}
              >
                Seterusnya →
              </button>
            </div>
          )}
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