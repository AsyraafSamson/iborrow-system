"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

// Interface untuk barang
interface Barang {
  id: number;
  nama: string;
  kategori: string;
  status: string;
  lokasi: string;
  deskripsi: string;
  kodBarang: string;
  tarikhDaftar: string;
  gambar: string;
  nota?: string;
}

export default function StaffBarangPage() {
  const router = useRouter();
  const [carian, setCarian] = useState<string>("");
  const [filterKategori, setFilterKategori] = useState<string>("semua");
  const [filterStatus, setFilterStatus] = useState<string>("semua");
  const [modalTambah, setModalTambah] = useState<boolean>(false);
  const [modalEdit, setModalEdit] = useState<boolean>(false);
  const [barangDipilih, setBarangDipilih] = useState<Barang | null>(null);
  const [selectedBarang, setSelectedBarang] = useState<number[]>([]);
  const [selectAll, setSelectAll] = useState<boolean>(false);

  // State untuk barang baru
  const [barangBaru, setBarangBaru] = useState({
    nama: "",
    kategori: "elektronik",
    status: "tersedia",
    lokasi: "",
    deskripsi: "",
    kodBarang: "",
    nota: ""
  });

  // State untuk barang edit
  const [barangEdit, setBarangEdit] = useState({
    nama: "",
    kategori: "elektronik",
    status: "tersedia",
    lokasi: "",
    deskripsi: "",
    kodBarang: "",
    nota: ""
  });

  // Data contoh barang
  const [senaraiBarang, setSenaraiBarang] = useState<Barang[]>([
    {
      id: 1,
      nama: "Laptop Dell XPS 13",
      kategori: "elektronik",
      status: "tersedia",
      lokasi: "Makmal Komputer 1",
      deskripsi: "Laptop prestasi tinggi untuk programming dan multimedia",
      kodBarang: "ICT-LAP-001",
      tarikhDaftar: "2024-01-10",
      gambar: "💻"
    },
    {
      id: 2,
      nama: "Projector Epson EB-X41",
      kategori: "elektronik",
      status: "tersedia",
      lokasi: "Bilik Media",
      deskripsi: "Projector untuk presentation dan kuliah",
      kodBarang: "ICT-PRO-002",
      tarikhDaftar: "2024-01-12",
      gambar: "📽️"
    },
    {
      id: 3,
      nama: "Kamera Canon EOS R6",
      kategori: "fotografi",
      status: "rosak",
      lokasi: "Unit Media",
      deskripsi: "Kamera DSLR profesional untuk fotografi dan videografi",
      kodBarang: "ICT-CAM-003",
      tarikhDaftar: "2024-01-08",
      gambar: "📷",
      nota: "Lens perlu diservis"
    },
    {
      id: 4,
      nama: "Tripod Manfrotto",
      kategori: "fotografi",
      status: "dipinjam",
      lokasi: "Unit Media",
      deskripsi: "Tripod stabil untuk kamera dan peralatan video",
      kodBarang: "ICT-TRI-004",
      tarikhDaftar: "2024-01-05",
      gambar: "📹"
    },
    {
      id: 5,
      nama: "Calculator Scientific Casio",
      kategori: "alat-tulis",
      status: "tersedia",
      lokasi: "Kaunter ICT",
      deskripsi: "Kalkulator saintifik untuk kejuruteraan dan sains",
      kodBarang: "ICT-CAL-005",
      tarikhDaftar: "2024-01-15",
      gambar: "🧮"
    },
    {
      id: 6,
      nama: "Microphone Blue Yeti",
      kategori: "audio",
      status: "tersedia",
      lokasi: "Studio Rakaman",
      deskripsi: "Microphone USB untuk rakaman audio berkualiti",
      kodBarang: "ICT-MIC-006",
      tarikhDaftar: "2024-01-20",
      gambar: "🎤"
    },
    {
      id: 7,
      nama: "Tablet iPad Pro",
      kategori: "elektronik",
      status: "dipinjam",
      lokasi: "Makmal Komputer 2",
      deskripsi: "Tablet untuk design dan creative work",
      kodBarang: "ICT-TAB-007",
      tarikhDaftar: "2024-01-18",
      gambar: "📱"
    },
    {
      id: 8,
      nama: "Speaker Bluetooth JBL",
      kategori: "audio",
      status: "rosak",
      lokasi: "Bilik Media",
      deskripsi: "Speaker portable untuk presentation dan event",
      kodBarang: "ICT-SPK-008",
      tarikhDaftar: "2024-01-22",
      gambar: "🔊",
      nota: "Bateri tidak boleh charge"
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

  // ✅ FIXED: Path yang betul untuk laporan
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

  const handleTambahBarang = () => {
    if (!barangBaru.nama || !barangBaru.kodBarang || !barangBaru.lokasi) {
      alert("Sila isi semua maklumat bertanda (*)!");
      return;
    }

    const barangBaruData: Barang = {
      id: senaraiBarang.length + 1,
      nama: barangBaru.nama,
      kategori: barangBaru.kategori,
      status: barangBaru.status,
      lokasi: barangBaru.lokasi,
      deskripsi: barangBaru.deskripsi,
      kodBarang: barangBaru.kodBarang,
      tarikhDaftar: new Date().toISOString().split('T')[0],
      gambar: getKategoriIcon(barangBaru.kategori),
      nota: barangBaru.nota || undefined
    };

    setSenaraiBarang([...senaraiBarang, barangBaruData]);
    setModalTambah(false);
    setBarangBaru({
      nama: "",
      kategori: "elektronik",
      status: "tersedia",
      lokasi: "",
      deskripsi: "",
      kodBarang: "",
      nota: ""
    });
    alert("Barang baru berjaya ditambah!");
  };

  const handleEditBarang = (barang: Barang) => {
    setBarangDipilih(barang);
    setBarangEdit({
      nama: barang.nama,
      kategori: barang.kategori,
      status: barang.status,
      lokasi: barang.lokasi,
      deskripsi: barang.deskripsi,
      kodBarang: barang.kodBarang,
      nota: barang.nota || ""
    });
    setModalEdit(true);
  };

  const handleUpdateBarang = () => {
    if (!barangDipilih) return;

    if (!barangEdit.nama || !barangEdit.kodBarang || !barangEdit.lokasi) {
      alert("Sila isi semua maklumat bertanda (*)!");
      return;
    }

    setSenaraiBarang(senaraiBarang.map(item =>
      item.id === barangDipilih.id
        ? {
            ...item,
            nama: barangEdit.nama,
            kategori: barangEdit.kategori,
            status: barangEdit.status,
            lokasi: barangEdit.lokasi,
            deskripsi: barangEdit.deskripsi,
            kodBarang: barangEdit.kodBarang,
            nota: barangEdit.nota || undefined,
            gambar: getKategoriIcon(barangEdit.kategori)
          }
        : item
    ));

    setModalEdit(false);
    setBarangDipilih(null);
    alert("Barang berjaya dikemaskini!");
  };

  const handleHapusBarang = (id: number, nama: string) => {
    if (confirm(`Adakah anda pasti ingin hapus barang "${nama}"?`)) {
      setSenaraiBarang(senaraiBarang.filter(item => item.id !== id));
      // Remove from selected items if exists
      setSelectedBarang(selectedBarang.filter(itemId => itemId !== id));
      alert("Barang berjaya dipadam!");
    }
  };

  // ✅ BULK DELETE BARANG
  const handleBulkDelete = () => {
    if (selectedBarang.length === 0) {
      alert("Sila pilih sekurang-kurangnya satu barang untuk dipadam!");
      return;
    }

    if (confirm(`Adakah anda pasti ingin padam ${selectedBarang.length} barang?`)) {
      setSenaraiBarang(senaraiBarang.filter(item => !selectedBarang.includes(item.id)));
      setSelectedBarang([]);
      setSelectAll(false);
      alert(`${selectedBarang.length} barang berjaya dipadam!`);
    }
  };

  // ✅ SELECT/DESELECT BARANG
  const handleSelectBarang = (id: number) => {
    if (selectedBarang.includes(id)) {
      setSelectedBarang(selectedBarang.filter(itemId => itemId !== id));
    } else {
      setSelectedBarang([...selectedBarang, id]);
    }
  };

  // ✅ SELECT ALL BARANG
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedBarang([]);
    } else {
      setSelectedBarang(barangTertapis.map(barang => barang.id));
    }
    setSelectAll(!selectAll);
  };

  const handleUpdateStatus = (id: number, statusBaru: string) => {
    setSenaraiBarang(senaraiBarang.map(item =>
      item.id === id ? { ...item, status: statusBaru } : item
    ));
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

  const getKategoriIcon = (kategori: string) => {
    switch (kategori) {
      case "elektronik": return "💻";
      case "fotografi": return "📷";
      case "alat-tulis": return "✏️";
      case "audio": return "🎤";
      default: return "📦";
    }
  };

  // Filter barang berdasarkan carian, kategori dan status
  const barangTertapis = senaraiBarang.filter(barang => {
    const matchesCarian = barang.nama.toLowerCase().includes(carian.toLowerCase()) ||
                         barang.kodBarang.toLowerCase().includes(carian.toLowerCase()) ||
                         barang.deskripsi.toLowerCase().includes(carian.toLowerCase());
    const matchesKategori = filterKategori === "semua" || barang.kategori === filterKategori;
    const matchesStatus = filterStatus === "semua" || barang.status === filterStatus;
    return matchesCarian && matchesKategori && matchesStatus;
  });

  // Kira statistik
  const statistik = {
    total: senaraiBarang.length,
    tersedia: senaraiBarang.filter(b => b.status === "tersedia").length,
    dipinjam: senaraiBarang.filter(b => b.status === "dipinjam").length,
    rosak: senaraiBarang.filter(b => b.status === "rosak").length,
  };

  return (
    <div className="min-h-screen bg-gray-50 p-3 pb-24">
      <div className="max-w-6xl mx-auto">
        {/* ✅ HEADER SAMA SEPERTI ADMIN/PENGGUNA - DENGAN BUTANG ← DASHBOARD & LOG KELUAR */}
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
            <h1 className="text-xl font-bold text-gray-900">📦 Urus Barang ICT</h1>
            <p className="text-gray-600 text-sm mt-1">Manage inventori barang ICT ILKKM</p>
          </div>
        </div>

        {/* Stats Cards - Mobile Optimized */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-white rounded-xl shadow-sm p-3 text-center">
            <div className="text-lg font-bold text-blue-600">{statistik.total}</div>
            <div className="text-xs text-gray-600">Total Barang</div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-3 text-center">
            <div className="text-lg font-bold text-green-600">{statistik.tersedia}</div>
            <div className="text-xs text-gray-600">Tersedia</div>
            <div className="text-xs text-green-600 mt-1">Boleh dipinjam</div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-3 text-center">
            <div className="text-lg font-bold text-orange-600">{statistik.dipinjam}</div>
            <div className="text-xs text-gray-600">Dipinjam</div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-3 text-center">
            <div className="text-lg font-bold text-red-600">{statistik.rosak}</div>
            <div className="text-xs text-gray-600">Rosak</div>
            <div className="text-xs text-red-600 mt-1">Perbaikan</div>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedBarang.length > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h3 className="font-semibold text-yellow-800 text-sm">
                  📋 {selectedBarang.length} barang dipilih
                </h3>
                <p className="text-yellow-700 text-xs mt-1">
                  Pilih tindakan yang ingin dilakukan
                </p>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={handleBulkDelete}
                  className="bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600 transition-colors text-xs"
                >
                  🗑️ Padam Dipilih
                </button>
                <button 
                  onClick={() => setSelectedBarang([])}
                  className="bg-gray-500 text-white px-3 py-2 rounded-lg hover:bg-gray-600 transition-colors text-xs"
                >
                  ✗ Batal Pilih
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Filters & Search - Mobile Optimized */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Carian Barang</label>
              <input
                type="text"
                placeholder="Cari nama, kod atau deskripsi..."
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
          </div>

          {/* Import/Export Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
            <div className="flex-1">
              <label className="block text-xs font-medium text-gray-700 mb-1">Tambah Barang</label>
              <button 
                onClick={() => setModalTambah(true)}
                className="w-full bg-green-500 text-white px-3 py-2 rounded-lg hover:bg-green-600 transition-colors text-sm"
              >
                + Tambah Barang
              </button>
            </div>
            
            <div className="flex-1">
              <label className="block text-xs font-medium text-gray-700 mb-1">Actions</label>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center w-full">
                <p className="text-blue-800 font-semibold text-sm">
                  {barangTertapis.length} barang
                </p>
                <p className="text-blue-600 text-xs">ditemui</p>
              </div>
            </div>
          </div>
        </div>

        {/* Senarai Barang - Mobile Optimized */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900 text-sm">Senarai Barang ICT</h2>
            <div className="flex items-center gap-3">
              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                {barangTertapis.length} barang
              </span>
              {barangTertapis.length > 0 && (
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selectAll}
                    onChange={handleSelectAll}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <span className="text-xs text-gray-600">Pilih Semua</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="space-y-3">
            {barangTertapis.map((barang) => (
              <div key={barang.id} className={`border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow ${selectedBarang.includes(barang.id) ? 'ring-2 ring-blue-500' : ''}`}>
                <div className="flex flex-col gap-3">
                  {/* Header dengan icon, checkbox dan status */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={selectedBarang.includes(barang.id)}
                        onChange={() => handleSelectBarang(barang.id)}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 mt-1"
                      />
                      <div className="text-3xl">{barang.gambar}</div>
                      <div>
                        <h3 className="font-semibold text-gray-900 text-sm">{barang.nama}</h3>
                        <p className="text-gray-600 text-xs">{barang.deskripsi}</p>
                      </div>
                    </div>
                    <span className={`${getStatusColor(barang.status)} text-xs px-2 py-1 rounded font-medium`}>
                      {getStatusText(barang.status)}
                    </span>
                  </div>

                  {/* Info Barang */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-gray-50 rounded p-2">
                      <span className="text-gray-500">Kod Barang:</span>
                      <p className="font-mono text-gray-700 mt-1">{barang.kodBarang}</p>
                    </div>
                    <div className="bg-gray-50 rounded p-2">
                      <span className="text-gray-500">Lokasi:</span>
                      <p className="text-gray-700 mt-1">📍 {barang.lokasi}</p>
                    </div>
                    <div className="bg-gray-50 rounded p-2">
                      <span className="text-gray-500">Daftar:</span>
                      <p className="text-gray-700 mt-1">{barang.tarikhDaftar}</p>
                    </div>
                    <div className="bg-gray-50 rounded p-2">
                      <span className="text-gray-500">Kategori:</span>
                      <p className="text-gray-700 mt-1">
                        <span className={`${getKategoriColor(barang.kategori)} text-xs px-1 py-0.5 rounded`}>
                          {getKategoriText(barang.kategori)}
                        </span>
                      </p>
                    </div>
                  </div>

                  {/* Nota jika ada */}
                  {barang.nota && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded p-2">
                      <p className="text-yellow-700 text-xs">📝 {barang.nota}</p>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex flex-col gap-2 pt-2 border-t border-gray-100">
                    <div className="flex-1">
                      <label className="block text-xs font-medium text-gray-700 mb-1">Update Status</label>
                      <select 
                        value={barang.status}
                        onChange={(e) => handleUpdateStatus(barang.id, e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-blue-500"
                      >
                        <option value="tersedia">Tersedia</option>
                        <option value="dipinjam">Dipinjam</option>
                        <option value="rosak">Rosak</option>
                        <option value="servis">Servis</option>
                      </select>
                    </div>
                    
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleEditBarang(barang)}
                        className="flex-1 bg-blue-500 text-white px-2 py-1 rounded text-xs hover:bg-blue-600 transition-colors"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleHapusBarang(barang.id, barang.nama)}
                        className="flex-1 bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600 transition-colors"
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
                <p className="text-gray-400 text-xs mt-1">Cuba ubah carian atau filter</p>
              </div>
            )}
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
              onClick={handleKeProfile}
              className="flex-1 text-center py-2 px-1 bg-gray-100 text-gray-700 rounded-lg text-xs font-medium mx-1 hover:bg-gray-200 transition-colors"
            >
              👤 Profil
            </button>
          </div>
        </div>
      </div>

      {/* Modal Tambah Barang - DESIGN LEBIH COMPACT */}
      {modalTambah && (
        <div className="fixed inset-0 bg-gray-100 bg-opacity-80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-sm p-4 w-full max-w-sm mx-4 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold text-gray-900">Tambah Barang Baru</h3>
              <button 
                onClick={() => setModalTambah(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Nama Barang *</label>
                <input
                  type="text"
                  value={barangBaru.nama}
                  onChange={(e) => setBarangBaru({...barangBaru, nama: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  placeholder="Laptop Dell XPS 13"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Kod Barang *</label>
                <input
                  type="text"
                  value={barangBaru.kodBarang}
                  onChange={(e) => setBarangBaru({...barangBaru, kodBarang: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  placeholder="ICT-LAP-001"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Kategori</label>
                  <select
                    value={barangBaru.kategori}
                    onChange={(e) => setBarangBaru({...barangBaru, kategori: e.target.value})}
                    className="w-full px-2 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  >
                    <option value="elektronik">Elektronik</option>
                    <option value="fotografi">Fotografi</option>
                    <option value="alat-tulis">Alat Tulis</option>
                    <option value="audio">Audio</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={barangBaru.status}
                    onChange={(e) => setBarangBaru({...barangBaru, status: e.target.value})}
                    className="w-full px-2 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  >
                    <option value="tersedia">Tersedia</option>
                    <option value="rosak">Rosak</option>
                    <option value="servis">Servis</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Lokasi *</label>
                <input
                  type="text"
                  value={barangBaru.lokasi}
                  onChange={(e) => setBarangBaru({...barangBaru, lokasi: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  placeholder="Makmal Komputer 1"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Deskripsi</label>
                <textarea
                  value={barangBaru.deskripsi}
                  onChange={(e) => setBarangBaru({...barangBaru, deskripsi: e.target.value})}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  placeholder="Deskripsi barang..."
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Nota (Optional)</label>
                <textarea
                  value={barangBaru.nota}
                  onChange={(e) => setBarangBaru({...barangBaru, nota: e.target.value})}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  placeholder="Nota tambahan..."
                />
              </div>
            </div>

            <div className="flex gap-2 mt-4">
              <button
                onClick={() => setModalTambah(false)}
                className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition-colors text-xs font-medium"
              >
                Batal
              </button>
              <button
                onClick={handleTambahBarang}
                className="flex-1 bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition-colors text-xs font-medium"
              >
                Tambah Barang
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Edit Barang - DESIGN LEBIH COMPACT */}
      {modalEdit && barangDipilih && (
        <div className="fixed inset-0 bg-gray-100 bg-opacity-80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-sm p-4 w-full max-w-sm mx-4 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold text-gray-900">Edit Barang</h3>
              <button 
                onClick={() => setModalEdit(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Nama Barang *</label>
                <input
                  type="text"
                  value={barangEdit.nama}
                  onChange={(e) => setBarangEdit({...barangEdit, nama: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Kod Barang *</label>
                <input
                  type="text"
                  value={barangEdit.kodBarang}
                  onChange={(e) => setBarangEdit({...barangEdit, kodBarang: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Kategori</label>
                  <select
                    value={barangEdit.kategori}
                    onChange={(e) => setBarangEdit({...barangEdit, kategori: e.target.value})}
                    className="w-full px-2 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  >
                    <option value="elektronik">Elektronik</option>
                    <option value="fotografi">Fotografi</option>
                    <option value="alat-tulis">Alat Tulis</option>
                    <option value="audio">Audio</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={barangEdit.status}
                    onChange={(e) => setBarangEdit({...barangEdit, status: e.target.value})}
                    className="w-full px-2 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  >
                    <option value="tersedia">Tersedia</option>
                    <option value="dipinjam">Dipinjam</option>
                    <option value="rosak">Rosak</option>
                    <option value="servis">Servis</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Lokasi *</label>
                <input
                  type="text"
                  value={barangEdit.lokasi}
                  onChange={(e) => setBarangEdit({...barangEdit, lokasi: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Deskripsi</label>
                <textarea
                  value={barangEdit.deskripsi}
                  onChange={(e) => setBarangEdit({...barangEdit, deskripsi: e.target.value})}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Nota (Optional)</label>
                <textarea
                  value={barangEdit.nota}
                  onChange={(e) => setBarangEdit({...barangEdit, nota: e.target.value})}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
              </div>
            </div>

            <div className="flex gap-2 mt-4">
              <button
                onClick={() => setModalEdit(false)}
                className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition-colors text-xs font-medium"
              >
                Batal
              </button>
              <button
                onClick={handleUpdateBarang}
                className="flex-1 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors text-xs font-medium"
              >
                Kemaskini
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}