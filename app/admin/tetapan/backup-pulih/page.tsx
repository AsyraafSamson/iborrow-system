"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function BackupPulihPage() {
  const router = useRouter();

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

  const handleKeLogAktiviti = () => {
    router.push("/admin/tetapan/log-aktiviti");
  };

  const handleBackupData = () => {
    alert("Backup data sedang dibuat...");
    setTimeout(() => {
      alert("Backup data berjaya disimpan!");
    }, 2000);
  };

  const handleResetTetapan = () => {
    if (confirm("Adakah anda pasti ingin reset semua tetapan kepada nilai default?")) {
      alert("Tetapan berjaya direset kepada nilai default!");
    }
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
              {/* ✅ ICON DAN BADGE BACKUP DALAM SATU BARIS */}
              <div className="text-blue-600 bg-blue-100 px-2 py-1 rounded-full flex items-center gap-1">
                <span className="text-sm">💾</span>
                <span className="text-xs font-medium">BACKUP</span>
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
            <h1 className="text-xl font-bold text-gray-900">💾 Backup & Pulih Data</h1>
            <p className="text-gray-600 text-sm mt-1">Urus backup dan pulih data sistem</p>
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
            <button className="bg-blue-500 text-white py-2 px-3 rounded-lg text-xs font-medium text-center">
              💾 Backup
            </button>
            <button 
              onClick={handleKeLogAktiviti}
              className="bg-gray-100 text-gray-700 py-2 px-3 rounded-lg text-xs font-medium text-center hover:bg-gray-200 transition-colors"
            >
              📝 Log Aktiviti
            </button>
          </div>
        </div>

        {/* Content - Mobile Optimized */}
        <div className="space-y-4">
          {/* Backup Data Section */}
          <div className="bg-white rounded-xl shadow-sm p-4">
            <h3 className="font-semibold text-gray-900 text-sm mb-3 border-b pb-2">💾 Backup Data</h3>
            
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200 mb-4">
              <div className="text-center">
                <div className="text-2xl mb-2">💾</div>
                <h4 className="font-semibold text-gray-900 text-sm mb-2">Backup Penuh Sistem</h4>
                <p className="text-gray-600 text-xs mb-4">Backup semua data termasuk pengguna, barang, dan tempahan</p>
                <button 
                  onClick={handleBackupData}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors text-xs w-full"
                >
                  Buat Backup Sekarang
                </button>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 text-sm mb-2">Backup Terkini</h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span>backup_2025_10_27.zip</span>
                  <span className="text-green-600 text-xs">✓ Selesai</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span>backup_2025_10_26.zip</span>
                  <span className="text-green-600 text-xs">✓ Selesai</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span>backup_2025_10_25.zip</span>
                  <span className="text-green-600 text-xs">✓ Selesai</span>
                </div>
              </div>
            </div>
          </div>

          {/* Pulih Data Section */}
          <div className="bg-white rounded-xl shadow-sm p-4">
            <h3 className="font-semibold text-gray-900 text-sm mb-3 border-b pb-2">🔄 Pulih Data</h3>
            
            <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200 mb-4">
              <div className="text-center">
                <div className="text-2xl mb-2">⚠️</div>
                <h4 className="font-semibold text-gray-900 text-sm mb-2">Pulih Data dari Backup</h4>
                <p className="text-gray-600 text-xs mb-4">Pilih fail backup untuk memulih data</p>
                <div className="space-y-2">
                  <input
                    type="file"
                    className="w-full text-xs text-gray-500 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                  <button className="w-full bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition-colors text-xs">
                    Pulih Data
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-red-50 rounded-lg p-4 border border-red-200">
              <h4 className="font-semibold text-gray-900 text-sm mb-2">Tindakan Berisiko Tinggi</h4>
              <p className="text-gray-600 text-xs mb-3">Reset semua tetapan kepada nilai default</p>
              <button 
                onClick={handleResetTetapan}
                className="w-full bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors text-xs"
              >
                Reset Tetapan
              </button>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-white rounded-xl shadow-sm p-4 mt-4">
          <h3 className="font-semibold text-gray-900 text-sm mb-3">📈 Statistik Backup</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="text-center">
              <div className="text-lg font-bold text-blue-600">3</div>
              <div className="text-xs text-gray-600">Backup Terkini</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-green-600">2.5 GB</div>
              <div className="text-xs text-gray-600">Total Saiz</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-purple-600">7</div>
              <div className="text-xs text-gray-600">Hari Simpanan</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-orange-600">Auto</div>
              <div className="text-xs text-gray-600">Backup Harian</div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="bg-white rounded-xl shadow-sm p-4 mt-4">
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