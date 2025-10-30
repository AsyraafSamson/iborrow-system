"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LogAktivitiPage() {
  const router = useRouter();
  
  const [logAktiviti, setLogAktiviti] = useState([
    { id: 1, pengguna: "Admin System", tindakan: "Login ke sistem", masa: "2025-10-27 09:15:23", ip: "192.168.1.100" },
    { id: 2, pengguna: "Staff ICT", tindakan: "Approve tempahan #T001", masa: "2025-10-27 10:30:45", ip: "192.168.1.101" },
    { id: 3, pengguna: "Ahmad bin Ali", tindakan: "Buat tempahan barang", masa: "2025-10-27 11:45:12", ip: "192.168.1.102" },
    { id: 4, pengguna: "Admin System", tindakan: "Update tetapan sistem", masa: "2025-10-27 14:20:33", ip: "192.168.1.100" },
  ]);

  // ✅ Navigation handlers untuk bottom navigation - DENGAN PROFIL
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

  // Navigation handlers untuk tetapan lain
  const handleKeTetapanSistem = () => {
    router.push("/admin/tetapan/sistem");
  };

  const handleKeKeselamatan = () => {
    router.push("/admin/tetapan/keselamatan");
  };

  const handleKeBackup = () => {
    router.push("/admin/tetapan/backup-pulih");
  };

  const handleEksportLog = () => {
    alert("Log aktiviti berjaya dieksport!");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-3 pb-24">
      <div className="max-w-4xl mx-auto">
        {/* Header - SAMA SEPERTI HALAMAN LAIN */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <button 
                onClick={handleKeDashboard}
                className="bg-gray-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-gray-600 transition-colors flex items-center gap-1"
              >
                ← Dashboard
              </button>
              {/* ✅ ICON DAN BADGE LOG AKTIVITI DALAM SATU BARIS */}
              <div className="text-blue-600 bg-blue-100 px-2 py-1 rounded-full flex items-center gap-1">
                <span className="text-sm">📊</span>
                <span className="text-xs font-medium">LOG AKTIVITI</span>
              </div>
            </div>
            {/* ✅ BUTANG LOG KELUAR */}
            <button 
              onClick={handleLogKeluar}
              className="bg-red-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-red-600 transition-colors"
            >
              Log Keluar
            </button>
          </div>
          
          {/* ✅ TITLE DI TENGAH */}
          <div className="text-center">
            <h1 className="text-xl font-bold text-gray-900">📊 Log Aktiviti Sistem</h1>
            <p className="text-gray-600 text-sm mt-1">Pantau aktiviti pengguna dalam sistem</p>
          </div>
        </div>

        {/* ✅ NEW: Navigation Bar untuk Tetapan */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
          <h3 className="font-semibold text-gray-900 text-sm mb-3">📋 Jenis Tetapan</h3>
          <div className="grid grid-cols-2 gap-2">
            <button 
              onClick={handleKeTetapanSistem}
              className="bg-gray-100 text-gray-700 py-2 px-3 rounded-lg text-xs font-medium text-center hover:bg-gray-200 transition-colors"
            >
              ⚙️ Sistem
            </button>
            <button 
              onClick={handleKeKeselamatan}
              className="bg-gray-100 text-gray-700 py-2 px-3 rounded-lg text-xs font-medium text-center hover:bg-gray-200 transition-colors"
            >
              🔒 Keselamatan
            </button>
            <button 
              onClick={handleKeBackup}
              className="bg-gray-100 text-gray-700 py-2 px-3 rounded-lg text-xs font-medium text-center hover:bg-gray-200 transition-colors"
            >
              💾 Backup
            </button>
            <button className="bg-blue-500 text-white py-2 px-3 rounded-lg text-xs font-medium text-center">
              📝 Log Aktiviti
            </button>
          </div>
        </div>

        {/* Content Header */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h2 className="font-semibold text-gray-900 text-sm">Aktiviti Terkini</h2>
              <p className="text-gray-600 text-xs">Log aktiviti pengguna dalam sistem 24 jam terakhir</p>
            </div>
            <button 
              onClick={handleEksportLog}
              className="bg-blue-500 text-white px-3 py-2 rounded-lg hover:bg-blue-600 transition-colors text-xs"
            >
              📥 Eksport Log
            </button>
          </div>
        </div>

        {/* Log List - Mobile Optimized */}
        <div className="space-y-3 mb-6">
          {logAktiviti.map((log) => (
            <div key={log.id} className="bg-white rounded-xl shadow-sm p-4 border border-gray-200">
              <div className="flex items-start gap-3">
                <div className="bg-green-100 p-2 rounded-lg">
                  <span className="text-green-600 text-sm">✓</span>
                </div>
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                    <span className="font-medium text-gray-900 text-sm">{log.pengguna}</span>
                    <span className="text-gray-500 text-xs">🕒 {log.masa.split(' ')[1]}</span>
                  </div>
                  <p className="text-gray-700 text-xs mt-1">{log.tindakan}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-gray-500 text-xs">🌐 {log.ip}</span>
                    <span className="text-gray-300">•</span>
                    <span className="text-gray-500 text-xs">{log.masa.split(' ')[0]}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Load More Button */}
        <div className="text-center mb-6">
          <button className="text-blue-600 hover:text-blue-800 text-xs font-medium bg-blue-50 px-4 py-2 rounded-lg">
            Muat Lebih Banyak Log...
          </button>
        </div>

        {/* Quick Stats */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
          <h3 className="font-semibold text-gray-900 text-sm mb-3">📈 Statistik Log</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="text-center">
              <div className="text-lg font-bold text-blue-600">{logAktiviti.length}</div>
              <div className="text-xs text-gray-600">Log Hari Ini</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-green-600">4</div>
              <div className="text-xs text-gray-600">Pengguna Aktif</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-purple-600">12</div>
              <div className="text-xs text-gray-600">Tempahan</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-orange-600">3</div>
              <div className="text-xs text-gray-600">Kategori</div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="flex flex-col gap-2">
            <button 
              onClick={handleKeTetapanSistem}
              className="bg-blue-500 text-white py-3 px-4 rounded-lg hover:bg-blue-600 transition-colors text-sm font-semibold text-center"
            >
              ⚙️ Kembali ke Tetapan Sistem
            </button>
          </div>
        </div>

        {/* ✅ UPDATED: Bottom Navigation - DENGAN 6 ITEM TERMASUK PROFIL */}
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