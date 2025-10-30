// app/admin/tetapan/sistem/page.tsx
"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function TetapanSistemPage() {
  const router = useRouter();
  
  const [tetapanSistem, setTetapanSistem] = useState({
    namaSistem: "iBorrow ILKKM",
    versi: "1.0.0",
    maxTempahanUser: 3,
    tempohPinjaman: 7,
    dendaLewat: 5.00,
    waktuOperasi: "08:00 - 17:00",
    notifikasiEmail: true,
    notifikasiSMS: false,
    maintenanceMode: false
  });

  // ✅ NEW: Statistik data
  const [statistik, setStatistik] = useState({
    totalTetapan: 12,
    backupTerkini: 3,
    logHariIni: 156,
    peringatan: 1
  });

  // ✅ NEW: Aktiviti terkini
  const [aktivitiTerkini, setAktivitiTerkini] = useState([
    { id: 1, pengguna: "Admin System", tindakan: "Update tetapan sistem", masa: "2 minit lalu" },
    { id: 2, pengguna: "Staff ICT", tindakan: "Backup data dibuat", masa: "1 jam lalu" },
    { id: 3, pengguna: "System", tindakan: "Log aktiviti dikemaskini", masa: "3 jam lalu" },
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

  const handleUpdateTetapan = (field: string, value: any) => {
    setTetapanSistem(prev => ({ ...prev, [field]: value }));
  };

  const handleSimpan = () => {
    alert("Tetapan sistem berjaya disimpan!");
  };

  // Navigation handlers untuk tetapan lain
  const handleKeselamatan = () => {
    router.push("/admin/tetapan/keselamatan");
  };

  const handleBackup = () => {
    router.push("/admin/tetapan/backup-pulih");
  };

  const handleLogAktiviti = () => {
    router.push("/admin/tetapan/log-aktiviti");
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
                <span className="text-xs font-medium">⚙️ TETAPAN</span>
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
            <h1 className="text-xl font-bold text-gray-900">🏢 Tetapan Sistem</h1>
            <p className="text-gray-600 text-sm mt-1">Urus tetapan sistem umum i-Borrow</p>
          </div>
        </div>

        {/* ✅ JENIS TETAPAN - MOBILE OPTIMIZED */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900 text-sm">📋 Jenis Tetapan</h3>
            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
              Sistem
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button className="bg-blue-500 text-white py-2 px-3 rounded-lg text-xs font-medium text-center">
              ⚙️ Sistem
            </button>
            <button 
              onClick={handleKeselamatan}
              className="bg-gray-100 text-gray-700 py-2 px-3 rounded-lg text-xs font-medium text-center hover:bg-gray-200 transition-colors"
            >
              🔒 Keselamatan
            </button>
            <button 
              onClick={handleBackup}
              className="bg-gray-100 text-gray-700 py-2 px-3 rounded-lg text-xs font-medium text-center hover:bg-gray-200 transition-colors"
            >
              💾 Backup
            </button>
            <button 
              onClick={handleLogAktiviti}
              className="bg-gray-100 text-gray-700 py-2 px-3 rounded-lg text-xs font-medium text-center hover:bg-gray-200 transition-colors"
            >
              📝 Log Aktiviti
            </button>
          </div>
        </div>

        {/* ✅ STATISTIK TETAPAN - MOBILE OPTIMIZED */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-white rounded-xl shadow-sm p-3 text-center">
            <div className="text-lg font-bold text-blue-600">{statistik.totalTetapan}</div>
            <div className="text-xs text-gray-600">Tetapan Aktif</div>
            <div className="text-xs text-blue-600 mt-1">Dalam sistem</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-3 text-center">
            <div className="text-lg font-bold text-green-600">{statistik.backupTerkini}</div>
            <div className="text-xs text-gray-600">Backup</div>
            <div className="text-xs text-green-600 mt-1">Terkini</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-3 text-center">
            <div className="text-lg font-bold text-purple-600">{statistik.logHariIni}</div>
            <div className="text-xs text-gray-600">Log Hari Ini</div>
            <div className="text-xs text-purple-600 mt-1">Aktiviti</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-3 text-center">
            <div className="text-lg font-bold text-orange-600">{statistik.peringatan}</div>
            <div className="text-xs text-gray-600">Peringatan</div>
            <div className="text-xs text-orange-600 mt-1">Perhatian</div>
          </div>
        </div>

        {/* ✅ MAKLUMAT SISTEM - MOBILE OPTIMIZED */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900 text-sm">📝 Maklumat Sistem</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Nama Sistem</label>
              <input
                type="text"
                value={tetapanSistem.namaSistem}
                onChange={(e) => handleUpdateTetapan("namaSistem", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Max Tempahan/User</label>
                <input
                  type="number"
                  value={tetapanSistem.maxTempahanUser}
                  onChange={(e) => handleUpdateTetapan("maxTempahanUser", parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  min="1"
                  max="10"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Tempoh Pinjaman (hari)</label>
                <input
                  type="number"
                  value={tetapanSistem.tempohPinjaman}
                  onChange={(e) => handleUpdateTetapan("tempohPinjaman", parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  min="1"
                  max="30"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Denda Lewat (RM/hari)</label>
                <input
                  type="number"
                  step="0.01"
                  value={tetapanSistem.dendaLewat}
                  onChange={(e) => handleUpdateTetapan("dendaLewat", parseFloat(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  min="0"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Waktu Operasi</label>
                <input
                  type="text"
                  value={tetapanSistem.waktuOperasi}
                  onChange={(e) => handleUpdateTetapan("waktuOperasi", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  placeholder="08:00 - 17:00"
                />
              </div>
            </div>
          </div>
        </div>

        {/* ✅ TETAPAN NOTIFIKASI - MOBILE OPTIMIZED */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900 text-sm">🔔 Tetapan Notifikasi</h3>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
              <div>
                <label className="font-medium text-xs text-gray-900">Notifikasi Email</label>
                <p className="text-gray-600 text-xs">Hantar notifikasi melalui email</p>
              </div>
              <input
                type="checkbox"
                checked={tetapanSistem.notifikasiEmail}
                onChange={(e) => handleUpdateTetapan("notifikasiEmail", e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
              <div>
                <label className="font-medium text-xs text-gray-900">Notifikasi SMS</label>
                <p className="text-gray-600 text-xs">Hantar notifikasi melalui SMS</p>
              </div>
              <input
                type="checkbox"
                checked={tetapanSistem.notifikasiSMS}
                onChange={(e) => handleUpdateTetapan("notifikasiSMS", e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-200">
              <div>
                <label className="font-medium text-xs text-gray-900">Maintenance Mode</label>
                <p className="text-gray-600 text-xs">Tutup sistem untuk penyelenggaraan</p>
              </div>
              <input
                type="checkbox"
                checked={tetapanSistem.maintenanceMode}
                onChange={(e) => handleUpdateTetapan("maintenanceMode", e.target.checked)}
                className="w-4 h-4 text-yellow-600 rounded focus:ring-yellow-500"
              />
            </div>
          </div>
        </div>

        {/* ✅ AKTIVITI TERKINI - MOBILE OPTIMIZED */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900 text-sm">📈 Aktiviti Terkini</h3>
            <button 
              onClick={handleLogAktiviti}
              className="text-blue-600 text-xs font-medium hover:text-blue-700"
            >
              Lihat semua
            </button>
          </div>
          
          <div className="space-y-3">
            {aktivitiTerkini.map((aktiviti) => (
              <div key={aktiviti.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-900">{aktiviti.tindakan}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-xs text-gray-500">Oleh: {aktiviti.pengguna}</p>
                    <span className="text-gray-300">•</span>
                    <p className="text-xs text-gray-500">{aktiviti.masa}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ✅ INFO SECTION */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4">
          <div className="flex items-start gap-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <span className="text-blue-600 text-sm">💡</span>
            </div>
            <div>
              <h4 className="font-semibold text-blue-800 text-sm mb-2">Tips Tetapan Sistem</h4>
              <ul className="text-blue-700 text-xs space-y-1">
                <li>• <strong>Max Tempahan/User</strong> - Hadkan bilangan pinjaman serentak</li>
                <li>• <strong>Tempoh Pinjaman</strong> - Tetapkan tempoh maksimum pinjaman</li>
                <li>• <strong>Maintenance Mode</strong> - Tutup akses pengguna biasa sementara</li>
                <li>• <strong>Notifikasi</strong> - Aktifkan untuk makluman automatik</li>
                <li>• <strong>Simpan tetapan</strong> selepas membuat sebarang perubahan</li>
              </ul>
            </div>
          </div>
        </div>

        {/* ✅ ACTION BUTTONS */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
          <button 
            onClick={handleSimpan}
            className="w-full bg-green-500 text-white py-3 px-4 rounded-lg hover:bg-green-600 transition-colors text-sm font-semibold text-center"
          >
            💾 Simpan Tetapan Sistem
          </button>
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
            <button 
              onClick={handleKeLaporan}
              className="flex-1 text-center py-2 px-1 bg-gray-100 text-gray-700 rounded-lg text-xs font-medium mx-1 hover:bg-gray-200 transition-colors"
            >
              📊 Laporan
            </button>
            <button className="flex-1 text-center py-2 px-1 bg-blue-500 text-white rounded-lg text-xs font-medium mx-1">
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