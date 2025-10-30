"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function StaffProfilePage() {
  const router = useRouter();
  
  const [profile, setProfile] = useState({
    nama: "Ahmad bin Ismail",
    email: "ahmad.ismail@ilkkm.edu.my",
    noStaf: "STF2024001",
    jabatan: "Bahagian Teknologi Maklumat",
    jawatan: "Staff ICT",
    telefon: "+6012-345 6789",
    tarikhJoin: "15/01/2024",
    status: "Aktif"
  });

  const [isEditing, setIsEditing] = useState(false);
  const [tempProfile, setTempProfile] = useState(profile);

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

  const handleEditProfile = () => {
    setIsEditing(true);
    setTempProfile(profile);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setTempProfile(profile);
  };

  const handleSaveProfile = () => {
    setProfile(tempProfile);
    setIsEditing(false);
    alert("Profil berjaya dikemaskini!");
  };

  const handleUpdateField = (field: string, value: string) => {
    setTempProfile(prev => ({ ...prev, [field]: value }));
  };

  const getStatusColor = (status: string) => {
    return status === "Aktif" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800";
  };

  return (
    <div className="min-h-screen bg-gray-50 p-3 pb-24">
      <div className="max-w-4xl mx-auto">
        {/* Header - SAMA SEPERTI HALAMAN STAFF ICT LAIN */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <button 
                onClick={handleKeDashboard}
                className="bg-gray-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-gray-600 transition-colors flex items-center gap-1"
              >
                ← Dashboard
              </button>
              {/* ✅ ICON DAN BADGE PROFIL DALAM SATU BARIS */}
              <div className="text-blue-600 bg-blue-100 px-2 py-1 rounded-full flex items-center gap-1">
                <span className="text-sm">👤</span>
                <span className="text-xs font-medium">PROFIL</span>
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
            <h1 className="text-xl font-bold text-gray-900">👤 Profil Staff ICT</h1>
            <p className="text-gray-600 text-sm mt-1">Maklumat peribadi dan akaun</p>
          </div>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900 text-sm">📝 Maklumat Peribadi</h2>
            {!isEditing ? (
              <button 
                onClick={handleEditProfile}
                className="bg-blue-500 text-white px-3 py-1 rounded-lg text-xs hover:bg-blue-600 transition-colors"
              >
                ✏️ Edit Profil
              </button>
            ) : (
              <div className="flex gap-2">
                <button 
                  onClick={handleCancelEdit}
                  className="bg-gray-500 text-white px-3 py-1 rounded-lg text-xs hover:bg-gray-600 transition-colors"
                >
                  ❌ Batal
                </button>
                <button 
                  onClick={handleSaveProfile}
                  className="bg-green-500 text-white px-3 py-1 rounded-lg text-xs hover:bg-green-600 transition-colors"
                >
                  💾 Simpan
                </button>
              </div>
            )}
          </div>

          <div className="space-y-4">
            {/* Profile Picture & Basic Info */}
            <div className="flex items-center gap-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                {profile.nama.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 text-sm">{profile.nama}</h3>
                <p className="text-gray-600 text-xs">{profile.jawatan}</p>
                <p className="text-gray-500 text-xs">{profile.jabatan}</p>
                <span className={`${getStatusColor(profile.status)} text-xs px-2 py-1 rounded-full mt-1 inline-block`}>
                  {profile.status}
                </span>
              </div>
            </div>

            {/* Editable Fields */}
            <div className="grid grid-cols-1 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Nama Penuh</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={tempProfile.nama}
                    onChange={(e) => handleUpdateField("nama", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  />
                ) : (
                  <div className="w-full px-3 py-2 bg-gray-50 rounded-lg text-sm text-gray-900">
                    {profile.nama}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Email</label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={tempProfile.email}
                      onChange={(e) => handleUpdateField("email", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    />
                  ) : (
                    <div className="w-full px-3 py-2 bg-gray-50 rounded-lg text-sm text-gray-900">
                      {profile.email}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">No. Telefon</label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={tempProfile.telefon}
                      onChange={(e) => handleUpdateField("telefon", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    />
                  ) : (
                    <div className="w-full px-3 py-2 bg-gray-50 rounded-lg text-sm text-gray-900">
                      {profile.telefon}
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">No. Staf</label>
                  <div className="w-full px-3 py-2 bg-gray-50 rounded-lg text-sm text-gray-900">
                    {profile.noStaf}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Jawatan</label>
                  <div className="w-full px-3 py-2 bg-gray-50 rounded-lg text-sm text-gray-900">
                    {profile.jawatan}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Jabatan</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={tempProfile.jabatan}
                    onChange={(e) => handleUpdateField("jabatan", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  />
                ) : (
                  <div className="w-full px-3 py-2 bg-gray-50 rounded-lg text-sm text-gray-900">
                    {profile.jabatan}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Tarikh Join</label>
                  <div className="w-full px-3 py-2 bg-gray-50 rounded-lg text-sm text-gray-900">
                    {profile.tarikhJoin}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Status</label>
                  <div className="w-full px-3 py-2 bg-gray-50 rounded-lg text-sm">
                    <span className={`${getStatusColor(profile.status)} px-2 py-1 rounded-full text-xs`}>
                      {profile.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
          <h3 className="font-semibold text-gray-900 text-sm mb-3">📈 Statistik Staff ICT</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="text-center">
              <div className="text-lg font-bold text-blue-600">12</div>
              <div className="text-xs text-gray-600">Kelulusan</div>
              <div className="text-xs text-blue-600 mt-1">Bulan Ini</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-green-600">45</div>
              <div className="text-xs text-gray-600">Tempahan</div>
              <div className="text-xs text-green-600 mt-1">Diluluskan</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-purple-600">3</div>
              <div className="text-xs text-gray-600">Barang</div>
              <div className="text-xs text-purple-600 mt-1">Diurus</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-orange-600">8</div>
              <div className="text-xs text-gray-600">Laporan</div>
              <div className="text-xs text-orange-600 mt-1">Dihasilkan</div>
            </div>
          </div>
        </div>

        {/* Account Actions */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
          <h3 className="font-semibold text-gray-900 text-sm mb-3">⚙️ Tindakan Akaun</h3>
          <div className="space-y-2">
            <button className="w-full bg-blue-50 text-blue-700 py-2 px-3 rounded-lg text-xs font-medium text-left hover:bg-blue-100 transition-colors flex items-center justify-between">
              <span>🔐 Tukar Kata Laluan</span>
              <span>→</span>
            </button>
            <button className="w-full bg-yellow-50 text-yellow-700 py-2 px-3 rounded-lg text-xs font-medium text-left hover:bg-yellow-100 transition-colors flex items-center justify-between">
              <span>📧 Tetapan Notifikasi</span>
              <span>→</span>
            </button>
            <button className="w-full bg-red-50 text-red-700 py-2 px-3 rounded-lg text-xs font-medium text-left hover:bg-red-100 transition-colors flex items-center justify-between">
              <span>🚫 Tutup Akaun</span>
              <span>→</span>
            </button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
          <h3 className="font-semibold text-gray-900 text-sm mb-3">📋 Aktiviti Terkini</h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-gray-900">Meluluskan tempahan #T001</p>
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-xs text-gray-500">Hari ini, 10:30 AM</p>
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-gray-900">Update status barang Laptop Dell</p>
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-xs text-gray-500">Semalam, 14:20 PM</p>
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
              <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-gray-900">Menghasilkan laporan bulanan</p>
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-xs text-gray-500">2 hari lalu, 09:15 AM</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Information Section */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4">
          <div className="flex items-start gap-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <span className="text-blue-600 text-sm">💡</span>
            </div>
            <div>
              <h4 className="font-semibold text-blue-800 text-sm mb-2">Maklumat Profil Staff ICT</h4>
              <ul className="text-blue-700 text-xs space-y-1">
                <li>• <strong>No. Staf</strong> - Pengenalan unik untuk staff ICT</li>
                <li>• <strong>Jabatan</strong> - Bahagian tempat anda bertugas</li>
                <li>• <strong>Status Aktif</strong> - Menunjukkan akaun aktif dalam sistem</li>
                <li>• <strong>Edit Profil</strong> - Kemaskini maklumat peribadi jika perlu</li>
                <li>• <strong>Statistik</strong> - Prestasi dan aktiviti terkini</li>
              </ul>
            </div>
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
              👤 Profil
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}