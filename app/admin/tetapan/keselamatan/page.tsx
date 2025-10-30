"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function TetapanKeselamatanPage() {
  const router = useRouter();
  
  const [tetapanKeselamatan, setTetapanKeselamatan] = useState({
    loginAttempts: 3,
    sessionTimeout: 30,
    passwordMinLength: 8,
    requireSpecialChar: true,
    requireNumbers: true,
    twoFactorAuth: false
  });

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

  const handleKeBackup = () => {
    router.push("/admin/tetapan/backup-pulih");
  };

  const handleKeLogAktiviti = () => {
    router.push("/admin/tetapan/log-aktiviti");
  };

  const handleUpdateTetapan = (field: string, value: any) => {
    setTetapanKeselamatan(prev => ({ ...prev, [field]: value }));
  };

  const handleSimpan = () => {
    alert("Tetapan keselamatan berjaya disimpan!");
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
              {/* ✅ ICON DAN BADGE KESELAMATAN DALAM SATU BARIS */}
              <div className="text-blue-600 bg-blue-100 px-2 py-1 rounded-full flex items-center gap-1">
                <span className="text-sm">🔐</span>
                <span className="text-xs font-medium">KESELAMATAN</span>
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
            <h1 className="text-xl font-bold text-gray-900">🔐 Tetapan Keselamatan</h1>
            <p className="text-gray-600 text-sm mt-1">Konfigurasi keselamatan dan akses sistem</p>
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
            <button className="bg-blue-500 text-white py-2 px-3 rounded-lg text-xs font-medium text-center">
              🔒 Keselamatan
            </button>
            <button 
              onClick={handleKeBackup}
              className="bg-gray-100 text-gray-700 py-2 px-3 rounded-lg text-xs font-medium text-center hover:bg-gray-200 transition-colors"
            >
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
          {/* Kawalan Akses */}
          <div className="bg-white rounded-xl shadow-sm p-4">
            <h3 className="font-semibold text-gray-900 text-sm mb-3 border-b pb-2">🔑 Kawalan Akses</h3>
            
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Percubaan Login Maksimum</label>
                <input
                  type="number"
                  value={tetapanKeselamatan.loginAttempts}
                  onChange={(e) => handleUpdateTetapan("loginAttempts", parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  min="1"
                  max="10"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Masa Tamat Sesi (minit)</label>
                <input
                  type="number"
                  value={tetapanKeselamatan.sessionTimeout}
                  onChange={(e) => handleUpdateTetapan("sessionTimeout", parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  min="5"
                  max="120"
                />
              </div>
            </div>
          </div>

          {/* Keperluan Kata Laluan */}
          <div className="bg-white rounded-xl shadow-sm p-4">
            <h3 className="font-semibold text-gray-900 text-sm mb-3 border-b pb-2">🔐 Keperluan Kata Laluan</h3>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <label className="font-medium text-xs text-gray-900">Panjang Minimum</label>
                  <p className="text-gray-600 text-xs">{tetapanKeselamatan.passwordMinLength} aksara</p>
                </div>
                <input
                  type="number"
                  value={tetapanKeselamatan.passwordMinLength}
                  onChange={(e) => handleUpdateTetapan("passwordMinLength", parseInt(e.target.value))}
                  className="w-16 px-2 py-1 border border-gray-300 rounded text-sm"
                  min="6"
                  max="20"
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <label className="font-medium text-xs text-gray-900">Perlu Aksara Khas</label>
                  <p className="text-gray-600 text-xs">Contoh: @#$%</p>
                </div>
                <input
                  type="checkbox"
                  checked={tetapanKeselamatan.requireSpecialChar}
                  onChange={(e) => handleUpdateTetapan("requireSpecialChar", e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <label className="font-medium text-xs text-gray-900">Perlu Nombor</label>
                  <p className="text-gray-600 text-xs">Contoh: 123456</p>
                </div>
                <input
                  type="checkbox"
                  checked={tetapanKeselamatan.requireNumbers}
                  onChange={(e) => handleUpdateTetapan("requireNumbers", e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div>
                  <label className="font-medium text-xs text-gray-900">2-Factor Authentication</label>
                  <p className="text-gray-600 text-xs">Tambah lapisan keselamatan</p>
                </div>
                <input
                  type="checkbox"
                  checked={tetapanKeselamatan.twoFactorAuth}
                  onChange={(e) => handleUpdateTetapan("twoFactorAuth", e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-white rounded-xl shadow-sm p-4">
            <h3 className="font-semibold text-gray-900 text-sm mb-3">📈 Statistik Keselamatan</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center">
                <div className="text-lg font-bold text-green-600">0</div>
                <div className="text-xs text-gray-600">Cubaan Gagal</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-blue-600">156</div>
                <div className="text-xs text-gray-600">Login Berjaya</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-purple-600">3</div>
                <div className="text-xs text-gray-600">Admin Aktif</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-orange-600">30m</div>
                <div className="text-xs text-gray-600">Sesi Aktif</div>
              </div>
            </div>
          </div>
        </div>

        {/* Tips */}
        <div className="bg-yellow-50 rounded-xl p-4 mt-4 border border-yellow-200">
          <div className="flex items-start gap-3">
            <div className="text-yellow-500 mt-0.5">💡</div>
            <div>
              <p className="text-sm font-medium text-yellow-900">Tips Keselamatan</p>
              <p className="text-xs text-yellow-700 mt-1">
                Aktifkan 2FA untuk keselamatan tambahan. Pastikan kata laluan minimum 8 aksara dengan kombinasi huruf, nombor dan simbol.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="bg-white rounded-xl shadow-sm p-4 mt-4">
          <div className="flex flex-col gap-2">
            <button 
              onClick={handleSimpan}
              className="bg-green-500 text-white py-3 px-4 rounded-lg hover:bg-green-600 transition-colors text-sm font-semibold text-center"
            >
              💾 Simpan Tetapan Keselamatan
            </button>
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