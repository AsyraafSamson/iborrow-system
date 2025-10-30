// app/admin/profile/page.tsx
"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

interface AdminProfile {
  nama: string;
  noStaf: string;
  emel: string;
  jabatan: string;
  noPhone: string;
  role: string;
  tarikhDaftar: string;
  status: string;
}

export default function AdminProfilePage() {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Data profil admin
  const [profile, setProfile] = useState<AdminProfile>({
    nama: "",
    noStaf: "",
    emel: "",
    jabatan: "",
    noPhone: "",
    role: "",
    tarikhDaftar: "",
    status: ""
  });

  // Data asal untuk comparison
  const [originalProfile, setOriginalProfile] = useState<AdminProfile>({
    nama: "",
    noStaf: "",
    emel: "",
    jabatan: "",
    noPhone: "",
    role: "",
    tarikhDaftar: "",
    status: ""
  });

  // Load profile data on component mount
  useEffect(() => {
    // Simulate API call to get admin profile
    const loadAdminProfile = () => {
      setIsLoading(true);
      setTimeout(() => {
        const adminData: AdminProfile = {
          nama: "Dr. Ahmad bin Abdullah",
          noStaf: "STF2024001",
          emel: "ahmad.abdullah@ilkkm.edu.my",
          jabatan: "Jabatan Teknologi Maklumat",
          noPhone: "012-3456789",
          role: "Super Admin",
          tarikhDaftar: "2023-01-15",
          status: "Aktif"
        };
        setProfile(adminData);
        setOriginalProfile(adminData);
        setIsLoading(false);
      }, 1000);
    };

    loadAdminProfile();
  }, []);

  // Navigation handlers
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

  const handleEditProfile = () => {
    setIsEditing(true);
  };

  const handleSaveProfile = () => {
    // Validation
    if (!profile.nama || !profile.noStaf || !profile.emel || !profile.jabatan || !profile.noPhone) {
      alert("Sila lengkapkan semua maklumat yang diperlukan!");
      return;
    }

    if (!profile.emel.includes('@')) {
      alert("Sila masukkan emel yang sah!");
      return;
    }

    if (profile.noPhone.length < 10) {
      alert("Sila masukkan nombor telefon yang sah!");
      return;
    }

    // Simulate API call to save profile
    setIsLoading(true);
    setTimeout(() => {
      setOriginalProfile(profile);
      setIsEditing(false);
      setIsLoading(false);
      alert("✅ Profil berjaya dikemaskini!");
    }, 1000);
  };

  const handleCancelEdit = () => {
    setProfile(originalProfile);
    setIsEditing(false);
  };

  const handleInputChange = (field: keyof AdminProfile, value: string) => {
    setProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // List jabatan options
  const jabatanOptions = [
    "Jabatan Teknologi Maklumat",
    "Jabatan Hal Ehwal Akademik",
    "Jabatan Hal Ehwal Pelajar",
    "Jabatan Kewangan",
    "Jabatan Pembangunan dan Penyelenggaraan",
    "Jabatan Perpustakaan dan Sumber Maklumat"
  ];

  // List role options
  const roleOptions = [
    "Super Admin",
    "System Admin",
    "IT Manager",
    "ICT Officer"
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-3 pb-24">
        <div className="max-w-4xl mx-auto">
          {/* Loading Header */}
          <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                  <span className="text-xs font-medium">👤 PROFIL</span>
                </div>
              </div>
              <div className="bg-gray-300 animate-pulse h-8 w-20 rounded-lg"></div>
            </div>
            <div className="text-center">
              <div className="bg-gray-300 animate-pulse h-6 w-48 mx-auto rounded mb-2"></div>
              <div className="bg-gray-300 animate-pulse h-4 w-64 mx-auto rounded"></div>
            </div>
          </div>

          {/* Loading Content */}
          <div className="bg-white rounded-xl shadow-sm p-4">
            <div className="space-y-4">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
                <div key={item} className="flex items-center gap-4">
                  <div className="bg-gray-300 animate-pulse h-4 w-24 rounded"></div>
                  <div className="bg-gray-300 animate-pulse h-10 flex-1 rounded"></div>
                </div>
              ))}
            </div>
          </div>

          {/* Loading Bottom Navigation */}
          <div className="fixed bottom-4 left-4 right-4 bg-white rounded-xl shadow-lg p-3 border border-gray-200">
            <div className="flex justify-between items-center">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <div key={item} className="flex-1 text-center">
                  <div className="bg-gray-300 animate-pulse h-8 mx-1 rounded-lg"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-3 pb-24">
      <div className="max-w-4xl mx-auto">
        {/* ✅ HEADER DENGAN ICON */}
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
                <span className="text-xs font-medium">👤 PROFIL</span>
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
            <h1 className="text-xl font-bold text-gray-900">👨‍💼 Profil Admin</h1>
            <p className="text-gray-600 text-sm mt-1">Maklumat peribadi dan akaun sistem</p>
          </div>
        </div>

        {/* ✅ PROFILE CONTENT */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
          {/* Profile Header dengan Edit Button */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 p-3 rounded-full">
                <span className="text-blue-600 text-lg">👨‍💼</span>
              </div>
              <div>
                <h2 className="font-semibold text-gray-900 text-sm">{profile.nama}</h2>
                <p className="text-gray-600 text-xs">{profile.noStaf} • {profile.role}</p>
                <p className="text-gray-500 text-xs mt-1">Daftar: {new Date(profile.tarikhDaftar).toLocaleDateString('ms-MY')}</p>
              </div>
            </div>
            
            {!isEditing ? (
              <button 
                onClick={handleEditProfile}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors text-sm"
              >
                ✏️ Edit Profil
              </button>
            ) : (
              <div className="flex gap-2">
                <button 
                  onClick={handleCancelEdit}
                  className="bg-gray-500 text-white px-3 py-2 rounded-lg hover:bg-gray-600 transition-colors text-sm"
                >
                  Batal
                </button>
                <button 
                  onClick={handleSaveProfile}
                  className="bg-green-500 text-white px-3 py-2 rounded-lg hover:bg-green-600 transition-colors text-sm"
                >
                  💾 Simpan
                </button>
              </div>
            )}
          </div>

          {/* Profile Form */}
          <div className="space-y-4">
            {/* Nama & No. Staf */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Nama Penuh *
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={profile.nama}
                    onChange={(e) => handleInputChange('nama', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    placeholder="Masukkan nama penuh"
                  />
                ) : (
                  <div className="w-full px-3 py-2 bg-gray-50 rounded-lg text-sm text-gray-900">
                    {profile.nama}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  No. Staf *
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={profile.noStaf}
                    onChange={(e) => handleInputChange('noStaf', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    placeholder="Contoh: STF2024001"
                  />
                ) : (
                  <div className="w-full px-3 py-2 bg-gray-50 rounded-lg text-sm text-gray-900">
                    {profile.noStaf}
                  </div>
                )}
              </div>
            </div>

            {/* Emel & No. Telefon */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Alamat Emel *
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    value={profile.emel}
                    onChange={(e) => handleInputChange('emel', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    placeholder="nama@ilkkm.edu.my"
                  />
                ) : (
                  <div className="w-full px-3 py-2 bg-gray-50 rounded-lg text-sm text-gray-900">
                    {profile.emel}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  No. Telefon *
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    value={profile.noPhone}
                    onChange={(e) => handleInputChange('noPhone', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    placeholder="Contoh: 012-3456789"
                  />
                ) : (
                  <div className="w-full px-3 py-2 bg-gray-50 rounded-lg text-sm text-gray-900">
                    {profile.noPhone}
                  </div>
                )}
              </div>
            </div>

            {/* Jabatan & Role */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Jabatan *
                </label>
                {isEditing ? (
                  <select
                    value={profile.jabatan}
                    onChange={(e) => handleInputChange('jabatan', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  >
                    <option value="">Pilih Jabatan</option>
                    {jabatanOptions.map((jabatan) => (
                      <option key={jabatan} value={jabatan}>{jabatan}</option>
                    ))}
                  </select>
                ) : (
                  <div className="w-full px-3 py-2 bg-gray-50 rounded-lg text-sm text-gray-900">
                    {profile.jabatan}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Role Sistem
                </label>
                {isEditing ? (
                  <select
                    value={profile.role}
                    onChange={(e) => handleInputChange('role', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  >
                    <option value="">Pilih Role</option>
                    {roleOptions.map((role) => (
                      <option key={role} value={role}>{role}</option>
                    ))}
                  </select>
                ) : (
                  <div className="w-full px-3 py-2 bg-gray-50 rounded-lg text-sm text-gray-900">
                    {profile.role}
                  </div>
                )}
              </div>
            </div>

            {/* Status & Tarikh Daftar (Read-only) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Status Akaun
                </label>
                <div className={`w-full px-3 py-2 rounded-lg text-sm font-medium text-center ${
                  profile.status === "Aktif" 
                    ? "bg-green-100 text-green-800" 
                    : "bg-red-100 text-red-800"
                }`}>
                  {profile.status}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Tarikh Daftar
                </label>
                <div className="w-full px-3 py-2 bg-gray-50 rounded-lg text-sm text-gray-900">
                  {new Date(profile.tarikhDaftar).toLocaleDateString('ms-MY', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ✅ ADMIN PERMISSIONS INFO */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
          <h3 className="font-semibold text-gray-900 text-sm mb-4">🔐 Keistimewaan Admin</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                <span>Urus semua pengguna sistem</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                <span>Tambah/edit/padam barang</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                <span>Lihat semua laporan sistem</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                <span>Konfigurasi tetapan sistem</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                <span>Backup dan pulih data</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                <span>Monitor aktiviti sistem</span>
              </div>
            </div>
          </div>
        </div>

        {/* ✅ INFO SECTION */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4">
          <div className="flex items-start gap-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <span className="text-blue-600 text-sm">💡</span>
            </div>
            <div>
              <h4 className="font-semibold text-blue-800 text-sm mb-2">Maklumat Profil Admin</h4>
              <ul className="text-blue-700 text-xs space-y-1">
                <li>• Maklumat profil digunakan untuk identifikasi dalam sistem</li>
                <li>• Pastikan maklumat sentiasa dikemaskini dan tepat</li>
                <li>• Role sistem menentukan tahap akses dan keistimewaan</li>
                <li>• Hubungi Super Admin untuk perubahan role atau status akaun</li>
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
            <button className="flex-1 text-center py-2 px-1 bg-blue-500 text-white rounded-lg text-xs font-medium mx-1">
              👤 Profil
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}