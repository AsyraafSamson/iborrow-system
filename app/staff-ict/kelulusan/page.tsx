"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

// Interface untuk tempahan
interface Tempahan {
  id: string;
  userId: string;
  namaUser: string;
  emailUser: string;
  barangId: number;
  namaBarang: string;
  kategori: string;
  lokasi: string;
  tarikhTempah: string;
  tarikhPinjam: string;
  tarikhPulang: string;
  status: "menunggu" | "diluluskan" | "ditolak";
  nota?: string;
  sebabTolakan?: string;
  diluluskanOleh?: string;
  tarikhKelulusan?: string;
}

export default function StaffKelulusanPage() {
  const router = useRouter();
  const [carian, setCarian] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<string>("menunggu");
  const [modalTolak, setModalTolak] = useState<boolean>(false);
  const [tempahanDipilih, setTempahanDipilih] = useState<Tempahan | null>(null);
  const [sebabTolakan, setSebabTolakan] = useState<string>("");

  // Data contoh tempahan yang menunggu kelulusan
  const [tempahan, setTempahan] = useState<Tempahan[]>([
    {
      id: "1",
      userId: "user123",
      namaUser: "Ahmad bin Ali",
      emailUser: "ahmad@ilkkm.edu.my",
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
      userId: "user124",
      namaUser: "Siti binti Rahman",
      emailUser: "siti@ilkkm.edu.my",
      barangId: 2,
      namaBarang: "Projector Epson EB-X41",
      kategori: "elektronik",
      lokasi: "Bilik Media",
      tarikhTempah: "2024-01-15T14:20:00",
      tarikhPinjam: "2024-01-16T14:00:00",
      tarikhPulang: "2024-01-23T17:00:00",
      status: "menunggu",
      nota: "Untuk presentation mingguan fakulti"
    },
    {
      id: "3",
      userId: "user125",
      namaUser: "Mohd Faris",
      emailUser: "faris@ilkkm.edu.my",
      barangId: 3,
      namaBarang: "Kamera Canon EOS R6",
      kategori: "fotografi",
      lokasi: "Unit Media",
      tarikhTempah: "2024-01-14T11:15:00",
      tarikhPinjam: "2024-01-15T10:00:00",
      tarikhPulang: "2024-01-22T17:00:00",
      status: "menunggu",
      nota: "Untuk rakaman video project akhir tahun"
    },
    {
      id: "4",
      userId: "user126",
      namaUser: "Nurul Huda",
      emailUser: "huda@ilkkm.edu.my",
      barangId: 8,
      namaBarang: "Microphone Blue Yeti",
      kategori: "audio",
      lokasi: "Studio Rakaman",
      tarikhTempah: "2024-01-15T16:45:00",
      tarikhPinjam: "2024-01-16T11:00:00",
      tarikhPulang: "2024-01-23T17:00:00",
      status: "menunggu",
      nota: "Untuk rakaman podcast kelab pelajar"
    },
    {
      id: "5",
      userId: "user127",
      namaUser: "Ali bin Abu",
      emailUser: "ali@ilkkm.edu.my",
      barangId: 4,
      namaBarang: "Tripod Manfrotto",
      kategori: "fotografi",
      lokasi: "Unit Media",
      tarikhTempah: "2024-01-13T09:20:00",
      tarikhPinjam: "2024-01-15T08:00:00",
      tarikhPulang: "2024-01-22T17:00:00",
      status: "diluluskan",
      diluluskanOleh: "Staff ICT01",
      tarikhKelulusan: "2024-01-13T14:30:00"
    },
    {
      id: "6",
      userId: "user128",
      namaUser: "Dr. Sarah Lim",
      emailUser: "sarah@ilkkm.edu.my",
      barangId: 5,
      namaBarang: "Calculator Scientific Casio",
      kategori: "alat-tulis",
      lokasi: "Kaunter ICT",
      tarikhTempah: "2024-01-12T13:10:00",
      tarikhPinjam: "2024-01-13T09:00:00",
      tarikhPulang: "2024-01-20T17:00:00",
      status: "ditolak",
      sebabTolakan: "Barang sedang dalam penyelenggaraan",
      diluluskanOleh: "Staff ICT02",
      tarikhKelulusan: "2024-01-12T16:45:00"
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

  const handleLulusTempahan = (tempahanId: string) => {
    if (confirm("Adakah anda pasti ingin meluluskan tempahan ini?")) {
      setTempahan(tempahan.map(item =>
        item.id === tempahanId 
          ? { 
              ...item, 
              status: "diluluskan",
              diluluskanOleh: "Anda (Staff ICT)",
              tarikhKelulusan: new Date().toISOString()
            } 
          : item
      ));
      alert("Tempahan berjaya diluluskan! Pengguna akan dimaklumkan melalui email.");
    }
  };

  const handleBukaModalTolak = (tempahan: Tempahan) => {
    setTempahanDipilih(tempahan);
    setSebabTolakan("");
    setModalTolak(true);
  };

  const handleTolakTempahan = () => {
    if (!tempahanDipilih) return;
    
    if (!sebabTolakan.trim()) {
      alert("Sila berikan sebab penolakan!");
      return;
    }

    setTempahan(tempahan.map(item =>
      item.id === tempahanDipilih.id 
        ? { 
            ...item, 
            status: "ditolak",
            sebabTolakan: sebabTolakan,
            diluluskanOleh: "Anda (Staff ICT)",
            tarikhKelulusan: new Date().toISOString()
          } 
        : item
    ));
    
    setModalTolak(false);
    setTempahanDipilih(null);
    setSebabTolakan("");
    
    alert("Tempahan berjaya ditolak! Pengguna akan dimaklumkan melalui email.");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "menunggu": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "diluluskan": return "bg-green-100 text-green-800 border-green-200";
      case "ditolak": return "bg-red-100 text-red-800 border-red-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "menunggu": return "Menunggu Kelulusan";
      case "diluluskan": return "Diluluskan";
      case "ditolak": return "Ditolak";
      default: return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "menunggu": return "⏳";
      case "diluluskan": return "✅";
      case "ditolak": return "❌";
      default: return "📋";
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

  // Filter tempahan berdasarkan carian dan status
  const tempahanTertapis = tempahan.filter(item => {
    const matchesCarian = item.namaUser.toLowerCase().includes(carian.toLowerCase()) ||
                         item.namaBarang.toLowerCase().includes(carian.toLowerCase()) ||
                         item.emailUser.toLowerCase().includes(carian.toLowerCase());
    const matchesStatus = filterStatus === "semua" || item.status === filterStatus;
    return matchesCarian && matchesStatus;
  });

  // Kira statistik
  const statistik = {
    total: tempahan.length,
    menunggu: tempahan.filter(t => t.status === "menunggu").length,
    diluluskan: tempahan.filter(t => t.status === "diluluskan").length,
    ditolak: tempahan.filter(t => t.status === "ditolak").length,
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
                <span className="text-xs font-medium">📋 KELULUSAN</span>
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
            <h1 className="text-xl font-bold text-gray-900">📋 Urus Kelulusan</h1>
            <p className="text-gray-600 text-sm mt-1">Luluskan atau tolak tempahan barang ICT</p>
          </div>
        </div>

        {/* Stats Cards - Mobile Optimized */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-white rounded-xl shadow-sm p-3 text-center">
            <div className="text-lg font-bold text-blue-600">
              {statistik.total}
            </div>
            <div className="text-xs text-gray-600">Total Tempahan</div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-3 text-center">
            <div className="text-lg font-bold text-yellow-600">
              {statistik.menunggu}
            </div>
            <div className="text-xs text-gray-600">Menunggu</div>
            <div className="text-xs text-yellow-600 mt-1">
              Perlu tindakan
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-3 text-center">
            <div className="text-lg font-bold text-green-600">
              {statistik.diluluskan}
            </div>
            <div className="text-xs text-gray-600">Diluluskan</div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-3 text-center">
            <div className="text-lg font-bold text-red-600">
              {statistik.ditolak}
            </div>
            <div className="text-xs text-gray-600">Ditolak</div>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Carian</label>
              <input
                type="text"
                placeholder="Cari nama, barang atau email..."
                value={carian}
                onChange={(e) => setCarian(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Filter Status</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              >
                <option value="menunggu">Menunggu Kelulusan</option>
                <option value="diluluskan">Diluluskan</option>
                <option value="ditolak">Ditolak</option>
                <option value="semua">Semua Status</option>
              </select>
            </div>
            <div className="flex items-end">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center w-full">
                <p className="text-blue-800 font-semibold text-sm">
                  {tempahanTertapis.length} tempahan
                </p>
                <p className="text-blue-600 text-xs">ditemui</p>
              </div>
            </div>
          </div>
        </div>

        {/* Senarai Tempahan */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-20">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900 text-sm">📋 Senarai Tempahan</h2>
            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
              {tempahanTertapis.length} ditemui
            </span>
          </div>
          
          <div className="space-y-3">
            {tempahanTertapis.map((item) => (
              <div key={item.id} className={`border rounded-lg p-3 ${getStatusColor(item.status)}`}>
                <div className="flex flex-col gap-3">
                  {/* Header Info */}
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 text-sm">{item.namaBarang}</h3>
                      <p className="text-gray-600 text-xs mt-1">
                        <strong>Pemohon:</strong> {item.namaUser} ({item.emailUser})
                      </p>
                      <p className="text-gray-500 text-xs mt-1">📍 {item.lokasi}</p>
                      {item.nota && (
                        <p className="text-gray-500 text-xs mt-1">📝 {item.nota}</p>
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className={`${getStatusColor(item.status)} text-xs px-2 py-1 rounded border font-medium`}>
                        {getStatusIcon(item.status)} {getStatusText(item.status)}
                      </span>
                      <span className={`${getKategoriColor(item.kategori)} text-xs px-2 py-1 rounded`}>
                        {getKategoriText(item.kategori)}
                      </span>
                    </div>
                  </div>

                  {/* Tarikh Info */}
                  <div className="grid grid-cols-1 gap-2 text-xs">
                    <div className="bg-white rounded p-2 border">
                      <span className="font-medium text-gray-700">Tarikh Tempah:</span>
                      <p className="text-gray-900 mt-1">{formatTarikhMasa(item.tarikhTempah)}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-white rounded p-2 border">
                        <span className="font-medium text-gray-700">Tarikh Pinjam:</span>
                        <p className="text-gray-900 mt-1">{formatTarikh(item.tarikhPinjam)}</p>
                      </div>
                      <div className="bg-white rounded p-2 border">
                        <span className="font-medium text-gray-700">Tarikh Pulang:</span>
                        <p className="text-gray-900 mt-1">{formatTarikh(item.tarikhPulang)}</p>
                      </div>
                    </div>
                  </div>

                  {/* Additional Info untuk status diluluskan/ditolak */}
                  {item.status === "diluluskan" && item.diluluskanOleh && (
                    <div className="p-2 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-green-700 text-xs">
                        ✅ <strong>Diluluskan oleh:</strong> {item.diluluskanOleh} pada {formatTarikhMasa(item.tarikhKelulusan!)}
                      </p>
                    </div>
                  )}
                  
                  {item.status === "ditolak" && item.sebabTolakan && (
                    <div className="p-2 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-red-700 text-xs">
                        ❌ <strong>Ditolak:</strong> {item.sebabTolakan}
                      </p>
                      {item.diluluskanOleh && (
                        <p className="text-red-600 text-xs mt-1">
                          Oleh: {item.diluluskanOleh} pada {formatTarikhMasa(item.tarikhKelulusan!)}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Actions untuk status menunggu */}
                  {item.status === "menunggu" && (
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleLulusTempahan(item.id)}
                        className="flex-1 bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition-colors text-sm"
                      >
                        ✅ Luluskan
                      </button>
                      <button 
                        onClick={() => handleBukaModalTolak(item)}
                        className="flex-1 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition-colors text-sm"
                      >
                        ❌ Tolak
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {tempahanTertapis.length === 0 && (
              <div className="text-center py-8">
                <div className="text-4xl mb-2">📋</div>
                <p className="text-gray-500 text-sm">Tiada tempahan ditemui</p>
                <p className="text-gray-400 text-xs mt-1">Cuba ubah carian atau filter anda</p>
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
            <button className="flex-1 text-center py-2 px-1 bg-blue-500 text-white rounded-lg text-xs font-medium mx-1">
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

      {/* Modal Tolak Tempahan */}
      {modalTolak && tempahanDipilih && (
        <div className="fixed inset-0 bg-gray-100 bg-opacity-80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md mx-4 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Tolak Tempahan</h3>
              <button 
                onClick={() => setModalTolak(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-700 mb-2">
                  Anda akan menolak tempahan untuk:
                </p>
                <p className="font-semibold text-gray-900">{tempahanDipilih.namaBarang}</p>
                <p className="text-sm text-gray-600">Oleh: {tempahanDipilih.namaUser}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sebab Penolakan *
                </label>
                <textarea
                  value={sebabTolakan}
                  onChange={(e) => setSebabTolakan(e.target.value)}
                  rows={4}
                  placeholder="Berikan sebab mengapa tempahan ini ditolak..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">Sebab ini akan dihantar kepada pengguna melalui email</p>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setModalTolak(false)}
                className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
              >
                Batal
              </button>
              <button
                onClick={handleTolakTempahan}
                className="flex-1 bg-red-500 text-white py-3 rounded-lg hover:bg-red-600 transition-colors text-sm font-medium"
              >
                Tolak Tempahan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}