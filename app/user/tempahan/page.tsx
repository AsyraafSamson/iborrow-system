// app/user/tempahan/page.tsx
"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function UserTempahanPage() {
  const router = useRouter();

  // State untuk tempahan baru
  const [tempahanBaru, setTempahanBaru] = useState({
    barangId: "",
    tarikhPinjam: "",
    tarikhPulang: "",
    nota: ""
  });

  // Data barang tersedia untuk tempahan baru
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

  const handleKembaliKeDashboard = () => {
    router.push("/user/dashboard");
  };

  const handleLihatSejarah = () => {
    router.push("/user/sejarah");
  };

  const handleBuatTempahan = () => {
    if (!tempahanBaru.barangId || !tempahanBaru.tarikhPinjam || !tempahanBaru.tarikhPulang) {
      alert("Sila lengkapkan semua maklumat bertanda (*)!");
      return;
    }

    const barangDipilih = senaraiBarang.find(b => b.id === parseInt(tempahanBaru.barangId));
    if (!barangDipilih) return;

    // Validation: Check tarikh
    const tarikhPinjam = new Date(tempahanBaru.tarikhPinjam);
    const tarikhPulang = new Date(tempahanBaru.tarikhPulang);
    const hariIni = new Date();
    hariIni.setHours(0, 0, 0, 0);

    if (tarikhPinjam < hariIni) {
      alert("Tarikh pinjam tidak boleh kurang dari hari ini!");
      return;
    }

    if (tarikhPulang <= tarikhPinjam) {
      alert("Tarikh pulang mesti selepas tarikh pinjam!");
      return;
    }

    // Calculate hari pinjam
    const diffTime = Math.abs(tarikhPulang.getTime() - tarikhPinjam.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays > 7) {
      alert("Tempoh pinjaman maksimum adalah 7 hari!");
      return;
    }

    // Success - Simulate API call
    alert(`✅ TEMPAHAN BERJAYA DIBUAT!\n\n📦 Barang: ${barangDipilih.nama}\n📅 Tempoh: ${diffDays} hari\n📌 Status: MENUNGGU KELULUSAN STAFF ICT\n\nStaff ICT akan semak tempahan anda dalam 24 jam.`);

    // Reset form
    setTempahanBaru({
      barangId: "",
      tarikhPinjam: "",
      tarikhPulang: "",
      nota: ""
    });
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

  const getStatusColor = (status: string) => {
    return status === "Tersedia" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800";
  };

  // Dapatkan barang yang dipilih untuk display info
  const barangDipilih = tempahanBaru.barangId 
    ? senaraiBarang.find(b => b.id === parseInt(tempahanBaru.barangId))
    : null;

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="text-center sm:text-left">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">📋 Buat Tempahan Baru</h1>
              <p className="text-gray-600 text-sm">Pinjam barang ICT ILKKM</p>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={handleLihatSejarah}
                className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors text-sm"
              >
                📊 Lihat Sejarah
              </button>
              <button 
                onClick={handleKembaliKeDashboard}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors text-sm"
              >
                ← Kembali
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">Maklumat Tempahan</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Pilih Barang *
                  </label>
                  <select
                    value={tempahanBaru.barangId}
                    onChange={(e) => setTempahanBaru({...tempahanBaru, barangId: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  >
                    <option value="">-- Sila pilih barang --</option>
                    {senaraiBarang.filter(b => b.status === "Tersedia").map(barang => (
                      <option key={barang.id} value={barang.id}>
                        {barang.gambar} {barang.nama} - {barang.lokasi}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-500 mt-1">Hanya barang dengan status "Tersedia" boleh dipilih</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tarikh Pinjam *
                    </label>
                    <input
                      type="date"
                      value={tempahanBaru.tarikhPinjam}
                      onChange={(e) => setTempahanBaru({...tempahanBaru, tarikhPinjam: e.target.value})}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tarikh Pulang *
                    </label>
                    <input
                      type="date"
                      value={tempahanBaru.tarikhPulang}
                      onChange={(e) => setTempahanBaru({...tempahanBaru, tarikhPulang: e.target.value})}
                      min={tempahanBaru.tarikhPinjam || new Date().toISOString().split('T')[0]}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    />
                  </div>
                </div>

                {tempahanBaru.tarikhPinjam && tempahanBaru.tarikhPulang && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <p className="text-blue-800 text-sm font-medium">
                      📅 Tempoh Pinjaman: {
                        Math.ceil(
                          (new Date(tempahanBaru.tarikhPulang).getTime() - new Date(tempahanBaru.tarikhPinjam).getTime()) 
                          / (1000 * 60 * 60 * 24)
                        )
                      } hari
                    </p>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nota Tambahan (Optional)
                  </label>
                  <textarea
                    value={tempahanBaru.nota}
                    onChange={(e) => setTempahanBaru({...tempahanBaru, nota: e.target.value})}
                    rows={4}
                    placeholder="Contoh: Untuk kelas multimedia, perlu adapter HDMI...&#10;Atau: Guna untuk event persidangan..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  />
                  <p className="text-xs text-gray-500 mt-1">Berikan maklumat tambahan tentang keperluan penggunaan</p>
                </div>

                <button
                  onClick={handleBuatTempahan}
                  disabled={!tempahanBaru.barangId || !tempahanBaru.tarikhPinjam || !tempahanBaru.tarikhPulang}
                  className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors text-sm font-medium"
                >
                  📋 Hantar Tempahan untuk Kelulusan
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar Info */}
          <div className="space-y-6">
            {/* Info Barang Dipilih */}
            {barangDipilih && (
              <div className="bg-white rounded-xl shadow-sm p-4">
                <h3 className="font-semibold text-gray-900 text-sm mb-3">📦 Barang Dipilih</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{barangDipilih.gambar}</span>
                    <div>
                      <p className="font-medium text-sm">{barangDipilih.nama}</p>
                      <p className="text-gray-600 text-xs">{barangDipilih.deskripsi}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    <span className={`${getKategoriColor(barangDipilih.kategori)} text-xs px-2 py-1 rounded`}>
                      {getKategoriText(barangDipilih.kategori)}
                    </span>
                    <span className={`${getStatusColor(barangDipilih.status)} text-xs px-2 py-1 rounded`}>
                      {barangDipilih.status}
                    </span>
                  </div>
                  <p className="text-gray-500 text-xs">📍 {barangDipilih.lokasi}</p>
                </div>
              </div>
            )}

            {/* Info Proses */}
            <div className="bg-white rounded-xl shadow-sm p-4">
              <h3 className="font-semibold text-gray-900 text-sm mb-3">ℹ️ Proses Tempahan</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <span className="bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">1</span>
                  <div>
                    <p className="font-medium text-xs">Buat Tempahan</p>
                    <p className="text-gray-600 text-xs">Isi form dan hantar</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <span className="bg-yellow-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">2</span>
                  <div>
                    <p className="font-medium text-xs">Menunggu Kelulusan</p>
                    <p className="text-gray-600 text-xs">Staff ICT akan semak</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <span className="bg-green-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">3</span>
                  <div>
                    <p className="font-medium text-xs">Ambil Barang</p>
                    <p className="text-gray-600 text-xs">Di Kaunter ICT setelah diluluskan</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Makluman Penting */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
              <h3 className="font-semibold text-yellow-800 text-sm mb-3">💡 Makluman Penting</h3>
              <ul className="text-yellow-700 text-xs space-y-2">
                <li className="flex items-start gap-2">
                  <span>•</span>
                  <span><strong>Tempoh maksimum:</strong> 7 hari</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>•</span>
                  <span><strong>Kelulusan:</strong> Diperlukan dari Staff ICT</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>•</span>
                  <span><strong>Waktu ambil:</strong> 8:30 PG - 5:30 PTG (Isnin-Jumaat)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>•</span>
                  <span><strong>Hubungi:</strong> 03-1234 5678</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}