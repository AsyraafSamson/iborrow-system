// app/admin/barang/page.tsx
"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AdminBarangPage() {
  const router = useRouter();
  
  const [barang, setBarang] = useState([
    { 
      id: 1, 
      nama: "Laptop Dell XPS 13", 
      kategori: "elektronik", 
      status: "tersedia", 
      kuantiti: 5,
      hargaSewa: 15.00,
      lokasi: "Bilik Server A",
      noSiri: "LAP-001",
      tarikhTambah: "2025-01-15"
    },
    { 
      id: 2, 
      nama: "Projector Epson EB-X41", 
      kategori: "elektronik", 
      status: "tersedia", 
      kuantiti: 3,
      hargaSewa: 20.00,
      lokasi: "Bilik Media",
      noSiri: "PROJ-001", 
      tarikhTambah: "2025-02-10"
    },
    { 
      id: 3, 
      nama: "Kamera Canon EOS R6", 
      kategori: "fotografi", 
      status: "rosak", 
      kuantiti: 1,
      hargaSewa: 25.00,
      lokasi: "Bilik Fotografi",
      noSiri: "CAM-001",
      tarikhTambah: "2025-01-20"
    },
    { 
      id: 4, 
      nama: "Tripod Manfrotto", 
      kategori: "fotografi", 
      status: "dipinjam", 
      kuantiti: 2,
      hargaSewa: 5.00,
      lokasi: "Bilik Fotografi",
      noSiri: "TRIP-001",
      tarikhTambah: "2025-03-05"
    },
    { 
      id: 5, 
      nama: "Calculator Scientific Casio", 
      kategori: "alat_tulis", 
      status: "tersedia", 
      kuantiti: 8,
      hargaSewa: 2.00,
      lokasi: "Kaunter Pinjaman",
      noSiri: "CALC-001",
      tarikhTambah: "2025-02-28"
    },
  ]);

  const [carian, setCarian] = useState("");
  const [filterKategori, setFilterKategori] = useState("semua");
  const [filterStatus, setFilterStatus] = useState("semua");
  const [modalTambah, setModalTambah] = useState(false);
  const [barangBaru, setBarangBaru] = useState({
    nama: "",
    kategori: "elektronik",
    kuantiti: 1,
    hargaSewa: 0,
    lokasi: "",
    noSiri: ""
  });

  // ✅ Navigation handlers untuk bottom navigation
  const handleKeDashboard = () => {
    router.push("/admin/dashboard");
  };

  const handleKePengguna = () => {
    router.push("/admin/pengguna");
  };

  const handleKeLaporan = () => {
    router.push("/admin/laporan");
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

  const handleUpdateStatus = (id: number, statusBaru: string) => {
    setBarang(barang.map(item =>
      item.id === id ? { ...item, status: statusBaru } : item
    ));
    alert(`Status barang berjaya dikemaskini!`);
  };

  const handleUpdateKuantiti = (id: number, kuantitiBaru: number) => {
    if (kuantitiBaru < 0) return;
    setBarang(barang.map(item =>
      item.id === id ? { ...item, kuantiti: kuantitiBaru } : item
    ));
    alert(`Kuantiti barang berjaya dikemaskini!`);
  };

  const handleTambahBarang = () => {
    if (!barangBaru.nama || !barangBaru.noSiri) {
      alert("Sila isi nama barang dan nombor siri!");
      return;
    }

    const baru = {
      id: barang.length + 1,
      ...barangBaru,
      status: "tersedia",
      tarikhTambah: new Date().toISOString().split('T')[0]
    };

    setBarang([...barang, baru]);
    setModalTambah(false);
    setBarangBaru({
      nama: "",
      kategori: "elektronik",
      kuantiti: 1,
      hargaSewa: 0,
      lokasi: "",
      noSiri: ""
    });
    alert("Barang baru berjaya ditambah!");
  };

  const handleHapusBarang = (id: number) => {
    if (confirm("Adakah anda pasti ingin hapus barang ini?")) {
      setBarang(barang.filter(item => item.id !== id));
      alert("Barang berjaya dipadam!");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "tersedia": return "bg-green-100 text-green-800";
      case "dipinjam": return "bg-blue-100 text-blue-800";
      case "rosak": return "bg-red-100 text-red-800";
      case "servis": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getKategoriColor = (kategori: string) => {
    switch (kategori) {
      case "elektronik": return "bg-purple-100 text-purple-800";
      case "fotografi": return "bg-blue-100 text-blue-800";
      case "alat_tulis": return "bg-green-100 text-green-800";
      case "buku": return "bg-orange-100 text-orange-800";
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

  const getKategoriText = (kategori: string) => {
    switch (kategori) {
      case "elektronik": return "Elektronik";
      case "fotografi": return "Fotografi";
      case "alat_tulis": return "Alat Tulis";
      case "buku": return "Buku";
      default: return kategori;
    }
  };

  // Filter barang berdasarkan carian, kategori dan status
  const barangTertapis = barang.filter(item => {
    const matchesCarian = item.nama.toLowerCase().includes(carian.toLowerCase()) || 
                         item.noSiri.toLowerCase().includes(carian.toLowerCase());
    const matchesKategori = filterKategori === "semua" || item.kategori === filterKategori;
    const matchesStatus = filterStatus === "semua" || item.status === filterStatus;
    return matchesCarian && matchesKategori && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-gray-50 p-3 pb-24">
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
            <h1 className="text-xl font-bold text-gray-900">📦 Urus Inventori Barang</h1>
            <p className="text-gray-600 text-sm mt-1">Manage semua barang dalam sistem i-Borrow</p>
          </div>
        </div>

        {/* ✅ STATS CARDS - MOBILE OPTIMIZED */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-white rounded-xl shadow-sm p-3 text-center">
            <div className="text-lg font-bold text-blue-600">{barang.length}</div>
            <div className="text-xs text-gray-600">Total Barang</div>
            <div className="text-xs text-blue-600 mt-1">Dalam inventori</div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-3 text-center">
            <div className="text-lg font-bold text-green-600">
              {barang.filter(b => b.status === "tersedia").length}
            </div>
            <div className="text-xs text-gray-600">Tersedia</div>
            <div className="text-xs text-green-600 mt-1">Boleh dipinjam</div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-3 text-center">
            <div className="text-lg font-bold text-purple-600">
              {barang.filter(b => b.status === "dipinjam").length}
            </div>
            <div className="text-xs text-gray-600">Dipinjam</div>
            <div className="text-xs text-purple-600 mt-1">Sedang digunakan</div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-3 text-center">
            <div className="text-lg font-bold text-red-600">
              {barang.filter(b => b.status === "rosak" || b.status === "servis").length}
            </div>
            <div className="text-xs text-gray-600">Perhatian</div>
            <div className="text-xs text-red-600 mt-1">Rosak & Servis</div>
          </div>
        </div>

        {/* ✅ FILTERS & SEARCH - MOBILE OPTIMIZED */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Carian Barang</label>
              <input
                type="text"
                placeholder="Cari nama atau no siri..."
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
                <option value="alat_tulis">Alat Tulis</option>
                <option value="buku">Buku</option>
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
              <label className="block text-xs font-medium text-gray-700 mb-1">Actions</label>
              <div className="flex gap-2">
                <button 
                  onClick={() => setModalTambah(true)}
                  className="flex-1 bg-green-500 text-white px-3 py-2 rounded-lg hover:bg-green-600 transition-colors text-sm"
                >
                  + Tambah
                </button>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center flex-1">
                  <p className="text-blue-800 font-semibold text-sm">
                    {barangTertapis.length} barang
                  </p>
                  <p className="text-blue-600 text-xs">ditemui</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ✅ SENARAI BARANG - MOBILE OPTIMIZED */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900 text-sm">📋 Senarai Barang Inventori</h2>
            <div className="flex items-center gap-2">
              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                {barangTertapis.length} barang
              </span>
            </div>
          </div>
          
          <div className="space-y-3">
            {barangTertapis.map((item) => (
              <div key={item.id} className="border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow">
                <div className="flex flex-col gap-3">
                  {/* Item Info */}
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 text-sm">{item.nama}</h3>
                      <p className="text-gray-600 text-xs mt-1">No Siri: {item.noSiri}</p>
                      <p className="text-gray-500 text-xs mt-1">📍 {item.lokasi}</p>
                      <p className="text-gray-500 text-xs mt-1">Daftar: {item.tarikhTambah}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-green-600">RM {item.hargaSewa}/hari</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-1">
                    <span className={`${getKategoriColor(item.kategori)} text-xs px-2 py-1 rounded`}>
                      {getKategoriText(item.kategori)}
                    </span>
                    <span className={`${getStatusColor(item.status)} text-xs px-2 py-1 rounded`}>
                      {getStatusText(item.status)}
                    </span>
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                      Qty: {item.kuantiti}
                    </span>
                  </div>

                  {/* Actions - Mobile Optimized */}
                  <div className="flex flex-col sm:flex-row gap-2 pt-2 border-t border-gray-100">
                    <div className="flex-1">
                      <label className="block text-xs font-medium text-gray-700 mb-1">Status</label>
                      <select 
                        value={item.status}
                        onChange={(e) => handleUpdateStatus(item.id, e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-blue-500"
                      >
                        <option value="tersedia">Tersedia</option>
                        <option value="dipinjam">Dipinjam</option>
                        <option value="rosak">Rosak</option>
                        <option value="servis">Servis</option>
                      </select>
                    </div>
                    
                    <div className="flex-1">
                      <label className="block text-xs font-medium text-gray-700 mb-1">Kuantiti</label>
                      <div className="flex gap-1">
                        <button 
                          onClick={() => handleUpdateKuantiti(item.id, item.kuantiti - 1)}
                          disabled={item.kuantiti <= 0}
                          className="bg-gray-200 text-gray-700 px-2 py-1 rounded text-xs disabled:opacity-50"
                        >
                          -
                        </button>
                        <span className="px-2 py-1 border rounded text-xs w-12 text-center">
                          {item.kuantiti}
                        </span>
                        <button 
                          onClick={() => handleUpdateKuantiti(item.id, item.kuantiti + 1)}
                          className="bg-gray-200 text-gray-700 px-2 py-1 rounded text-xs"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div className="flex items-end">
                      <button 
                        onClick={() => handleHapusBarang(item.id)}
                        className="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600 transition-colors w-full"
                      >
                        Padam
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {barangTertapis.length === 0 && (
              <div className="text-center py-8">
                <div className="text-4xl mb-2">📦</div>
                <p className="text-gray-500 text-sm">Tiada barang ditemui</p>
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
              <h4 className="font-semibold text-blue-800 text-sm mb-2">Cara Mengurus Barang</h4>
              <ul className="text-blue-700 text-xs space-y-1">
                <li>• <strong>Tambah barang baru</strong> dengan butang "+ Tambah"</li>
                <li>• <strong>Kemaskini status</strong> untuk pantau ketersediaan</li>
                <li>• <strong>Adjust kuantiti</strong> dengan butang +/- untuk stok</li>
                <li>• <strong>Padam barang</strong> yang sudah tidak digunakan</li>
                <li>• <strong>Filter & carian</strong> untuk urusan yang lebih pantas</li>
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
            <button className="flex-1 text-center py-2 px-1 bg-blue-500 text-white rounded-lg text-xs font-medium mx-1">
              📦 Barang
            </button>
            <button 
              onClick={handleKeLaporan}
              className="flex-1 text-center py-2 px-1 bg-gray-100 text-gray-700 rounded-lg text-xs font-medium mx-1 hover:bg-gray-200 transition-colors"
            >
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

      {/* Modal Tambah Barang - Mobile Optimized */}
      {modalTambah && (
        <div className="fixed inset-0 bg-gray-100 bg-opacity-80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md mx-4 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Tambah Barang Baru</h3>
              <button 
                onClick={() => setModalTambah(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Barang *</label>
                <input
                  type="text"
                  value={barangBaru.nama}
                  onChange={(e) => setBarangBaru({...barangBaru, nama: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  placeholder="Contoh: Laptop Dell XPS 13"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">No Siri *</label>
                <input
                  type="text"
                  value={barangBaru.noSiri}
                  onChange={(e) => setBarangBaru({...barangBaru, noSiri: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  placeholder="Contoh: LAP-001"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
                  <select
                    value={barangBaru.kategori}
                    onChange={(e) => setBarangBaru({...barangBaru, kategori: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  >
                    <option value="elektronik">Elektronik</option>
                    <option value="fotografi">Fotografi</option>
                    <option value="alat_tulis">Alat Tulis</option>
                    <option value="buku">Buku</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Kuantiti</label>
                  <input
                    type="number"
                    value={barangBaru.kuantiti}
                    onChange={(e) => setBarangBaru({...barangBaru, kuantiti: parseInt(e.target.value) || 0})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    min="1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Harga Sewa (RM)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={barangBaru.hargaSewa}
                    onChange={(e) => setBarangBaru({...barangBaru, hargaSewa: parseFloat(e.target.value) || 0})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Lokasi</label>
                  <input
                    type="text"
                    value={barangBaru.lokasi}
                    onChange={(e) => setBarangBaru({...barangBaru, lokasi: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    placeholder="Contoh: Bilik Server A"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setModalTambah(false)}
                className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
              >
                Batal
              </button>
              <button
                onClick={handleTambahBarang}
                className="flex-1 bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition-colors text-sm font-medium"
              >
                Tambah
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}