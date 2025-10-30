// app/admin/dashboard/page.tsx
"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AdminDashboard() {
  const router = useRouter();
  
  const [pengguna, setPengguna] = useState([
    { id: 1, nama: "Ahmad bin Ali", email: "ahmad@ilkkm.edu.my", role: "pelajar", status: "aktif" },
    { id: 2, nama: "Siti binti Rahman", email: "siti@ilkkm.edu.my", role: "pengajar", status: "aktif" },
    { id: 3, nama: "Mohd Faris", email: "faris@ilkkm.edu.my", role: "staff", status: "aktif" },
    { id: 4, nama: "Nurul Huda", email: "huda@ilkkm.edu.my", role: "pelajar", status: "tidak aktif" },
  ]);

  const [senaraiBarang, setSenaraiBarang] = useState([
    { id: 1, nama: "Laptop Dell XPS 13", kategori: "Elektronik", status: "tersedia", kuantiti: 5 },
    { id: 2, nama: "Projector Epson EB-X41", kategori: "Elektronik", status: "tersedia", kuantiti: 3 },
    { id: 3, nama: "Kamera Canon EOS R6", kategori: "Fotografi", status: "rosak", kuantiti: 1 },
    { id: 4, nama: "Tripod Manfrotto", kategori: "Fotografi", status: "dipinjam", kuantiti: 2 },
  ]);

  // ✅ Navigation handlers untuk bottom navigation
  const handleKePengguna = () => {
    router.push("/admin/pengguna");
  };

  const handleKeBarang = () => {
    router.push("/admin/barang");
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

  const handleUpdateStatusPengguna = (id: number, statusBaru: string) => {
    setPengguna(pengguna.map(user =>
      user.id === id ? { ...user, status: statusBaru } : user
    ));
    alert(`Status pengguna berjaya dikemaskini!`);
  };

  const handleUpdateStatusBarang = (id: number, statusBaru: string) => {
    setSenaraiBarang(senaraiBarang.map(item =>
      item.id === id ? { ...item, status: statusBaru } : item
    ));
    alert(`Status barang berjaya dikemaskini!`);
  };

  const handleTambahBarang = () => {
    const barangBaru = {
      id: senaraiBarang.length + 1,
      nama: "Barang Baru",
      kategori: "Elektronik",
      status: "tersedia",
      kuantiti: 1
    };
    setSenaraiBarang([...senaraiBarang, barangBaru]);
    alert("Barang baru berjaya ditambah!");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "aktif": return "bg-green-100 text-green-800";
      case "tidak aktif": return "bg-red-100 text-red-800";
      case "tersedia": return "bg-green-100 text-green-800";
      case "dipinjam": return "bg-blue-100 text-blue-800";
      case "rosak": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "aktif": return "Aktif";
      case "tidak aktif": return "Tidak Aktif";
      case "tersedia": return "Tersedia";
      case "dipinjam": return "Dipinjam";
      case "rosak": return "Rosak";
      default: return status;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin": return "bg-purple-100 text-purple-800";
      case "staff": return "bg-blue-100 text-blue-800";
      case "pengajar": return "bg-green-100 text-green-800";
      case "pelajar": return "bg-orange-100 text-orange-800";
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
              <div className="text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                <span className="text-xs font-medium">🏠 DASHBOARD</span>
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
            <h1 className="text-xl font-bold text-gray-900">👨‍💼 Dashboard Admin</h1>
            <p className="text-gray-600 text-sm mt-1">Urus sistem i-Borrow ILKKM</p>
          </div>
        </div>

        {/* ✅ STATS CARDS - MOBILE OPTIMIZED */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-white rounded-xl shadow-sm p-3 text-center">
            <div className="text-lg font-bold text-blue-600">{pengguna.length}</div>
            <div className="text-xs text-gray-600">Total Pengguna</div>
            <div className="text-xs text-blue-600 mt-1">
              {pengguna.filter(p => p.status === "aktif").length} Aktif
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-3 text-center">
            <div className="text-lg font-bold text-green-600">{senaraiBarang.length}</div>
            <div className="text-xs text-gray-600">Total Barang</div>
            <div className="text-xs text-green-600 mt-1">
              {senaraiBarang.filter(b => b.status === "tersedia").length} Tersedia
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-3 text-center">
            <div className="text-lg font-bold text-purple-600">23</div>
            <div className="text-xs text-gray-600">Tempahan Aktif</div>
            <div className="text-xs text-purple-600 mt-1">8 Pending</div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-3 text-center">
            <div className="text-lg font-bold text-red-600">
              {senaraiBarang.filter(b => b.status === "rosak").length}
            </div>
            <div className="text-xs text-gray-600">Barang Rosak</div>
            <div className="text-xs text-red-600 mt-1">Perlu Baiki</div>
          </div>
        </div>

        {/* ✅ URUS PENGGUNA */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900 text-sm">👥 Urus Pengguna</h2>
            <div className="flex items-center gap-2">
              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                {pengguna.length} pengguna
              </span>
            </div>
          </div>
          
          <div className="space-y-3">
            {pengguna.slice(0, 3).map((user) => (
              <div key={user.id} className="border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow">
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 text-sm">{user.nama}</h3>
                      <p className="text-gray-600 text-xs mt-1">{user.email}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className={`${getRoleColor(user.role)} text-xs px-2 py-1 rounded`}>
                        {user.role}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className={`${getStatusColor(user.status)} text-xs px-2 py-1 rounded`}>
                      {getStatusText(user.status)}
                    </span>
                    <select 
                      value={user.status}
                      onChange={(e) => handleUpdateStatusPengguna(user.id, e.target.value)}
                      className="border border-gray-300 rounded-lg px-2 py-1 text-xs focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="aktif">Aktif</option>
                      <option value="tidak aktif">Tidak Aktif</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}
            <button 
              onClick={handleKePengguna}
              className="w-full bg-blue-50 text-blue-700 py-2 rounded-lg text-xs font-medium hover:bg-blue-100 transition-colors border border-blue-200"
            >
              Lihat Semua Pengguna →
            </button>
          </div>
        </div>

        {/* ✅ URUS BARANG */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <h2 className="font-semibold text-gray-900 text-sm">📦 Urus Barang</h2>
              <button 
                onClick={handleTambahBarang}
                className="bg-green-500 text-white px-2 py-1 rounded text-xs hover:bg-green-600 transition-colors"
              >
                + Tambah
              </button>
            </div>
            <div className="flex items-center gap-2">
              <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                {senaraiBarang.length} barang
              </span>
            </div>
          </div>
          
          <div className="space-y-3">
            {senaraiBarang.slice(0, 3).map((barang) => (
              <div key={barang.id} className="border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow">
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 text-sm">{barang.nama}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                          {barang.kategori}
                        </span>
                        <span className="text-gray-500 text-xs">Qty: {barang.kuantiti}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className={`${getStatusColor(barang.status)} text-xs px-2 py-1 rounded`}>
                      {getStatusText(barang.status)}
                    </span>
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
              </div>
            ))}
            <button 
              onClick={handleKeBarang}
              className="w-full bg-green-50 text-green-700 py-2 rounded-lg text-xs font-medium hover:bg-green-100 transition-colors border border-green-200"
            >
              Lihat Semua Barang →
            </button>
          </div>
        </div>

        {/* ✅ INFO SECTION */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4">
          <div className="flex items-start gap-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <span className="text-blue-600 text-sm">💡</span>
            </div>
            <div>
              <h4 className="font-semibold text-blue-800 text-sm mb-2">Fungsi Dashboard Admin</h4>
              <ul className="text-blue-700 text-xs space-y-1">
                <li>• <strong>Urus Pengguna</strong> - Aktifkan/nyahaktifkan akaun pengguna</li>
                <li>• <strong>Urus Barang</strong> - Tambah dan kemaskini status inventori</li>
                <li>• <strong>Pantau Tempahan</strong> - Lihat semua aktiviti pinjaman</li>
                <li>• <strong>Laporan</strong> - Analisis penggunaan sistem</li>
                <li>• <strong>Tetapan</strong> - Konfigurasi sistem dan keselamatan</li>
              </ul>
            </div>
          </div>
        </div>

        {/* ✅ BOTTOM NAVIGATION DENGAN 6 ITEM */}
        <div className="fixed bottom-4 left-4 right-4 bg-white rounded-xl shadow-lg p-3 border border-gray-200">
          <div className="flex justify-between items-center">
            <button className="flex-1 text-center py-2 px-1 bg-blue-500 text-white rounded-lg text-xs font-medium mx-1">
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
    </div>
  );
}