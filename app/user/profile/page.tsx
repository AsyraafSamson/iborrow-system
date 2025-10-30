// app/user/profile/page.tsx
"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

interface UserProfile {
  nama: string;
  noMatrik: string;
  emel: string;
  fakulti: string;
  noPhone: string;
  program: string;
  tahunPengajian: string;
}

export default function UserProfilePage() {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Data profil user
  const [profile, setProfile] = useState<UserProfile>({
    nama: "",
    noMatrik: "",
    emel: "",
    fakulti: "",
    noPhone: "",
    program: "",
    tahunPengajian: ""
  });

  // Data asal untuk comparison
  const [originalProfile, setOriginalProfile] = useState<UserProfile>({
    nama: "",
    noMatrik: "",
    emel: "",
    fakulti: "",
    noPhone: "",
    program: "",
    tahunPengajian: ""
  });

  // Load profile data on component mount
  useEffect(() => {
    // Simulate API call to get user profile
    const loadUserProfile = () => {
      setIsLoading(true);
      setTimeout(() => {
        const userData: UserProfile = {
          nama: "Ahmad bin Abdullah",
          noMatrik: "2023123456",
          emel: "ahmad.abdullah@student.ilkkm.edu.my",
          fakulti: "Fakulti Teknologi Maklumat dan Komunikasi",
          noPhone: "012-3456789",
          program: "Sarjana Muda Sains Komputer",
          tahunPengajian: "Tahun 3"
        };
        setProfile(userData);
        setOriginalProfile(userData);
        setIsLoading(false);
      }, 1000);
    };

    loadUserProfile();
  }, []);

  // Navigation handlers
  const handleKeDashboard = () => {
    router.push("/user/dashboard");
  };

  const handleKeBarang = () => {
    router.push("/user/barang");
  };

  const handleKeSejarah = () => {
    router.push("/user/sejarah");
  };

  const handleKeProfile = () => {
    router.push("/user/profile");
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
    if (!profile.nama || !profile.noMatrik || !profile.emel || !profile.fakulti || !profile.noPhone) {
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

  const handleInputChange = (field: keyof UserProfile, value: string) => {
    setProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // List fakulti options
  const fakultiOptions = [
    "Fakulti Teknologi Maklumat dan Komunikasi",
    "Fakulti Kejuruteraan Elektrik",
    "Fakulti Pengurusan dan Perniagaan",
    "Fakulti Sains Kesihatan",
    "Fakulti Sains Sosial dan Kemanusiaan",
    "Fakulti Pendidikan dan Sains Sukan"
  ];

  // List program options
  const programOptions = [
    "Sarjana Muda Sains Komputer",
    "Sarjana Muda Kejuruteraan Perisian",
    "Sarjana Muda Teknologi Maklumat",
    "Sarjana Muda Keselamatan Siber",
    "Sarjana Muda Sains Data",
    "Sarjana Muda Rangkaian Komputer"
  ];

  // List tahun pengajian options
  const tahunPengajianOptions = [
    "Tahun 1",
    "Tahun 2", 
    "Tahun 3",
    "Tahun 4"
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-3 pb-20">
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
              {[1, 2, 3, 4, 5, 6, 7].map((item) => (
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
              {[1, 2, 3, 4].map((item) => (
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
    <div className="min-h-screen bg-gray-50 p-3 pb-20">
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
            <h1 className="text-xl font-bold text-gray-900">👤 Maklumat Peribadi</h1>
            <p className="text-gray-600 text-sm mt-1">Kemaskini maklumat profil anda</p>
          </div>
        </div>

        {/* ✅ PROFILE CONTENT */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
          {/* Profile Header dengan Edit Button */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 p-3 rounded-full">
                <span className="text-blue-600 text-lg">👤</span>
              </div>
              <div>
                <h2 className="font-semibold text-gray-900 text-sm">{profile.nama}</h2>
                <p className="text-gray-600 text-xs">{profile.noMatrik} • {profile.program}</p>
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
            {/* Nama */}
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

            {/* No. Matrik & Emel */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  No. Matrik / KP *
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={profile.noMatrik}
                    onChange={(e) => handleInputChange('noMatrik', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    placeholder="Contoh: 2023123456"
                  />
                ) : (
                  <div className="w-full px-3 py-2 bg-gray-50 rounded-lg text-sm text-gray-900">
                    {profile.noMatrik}
                  </div>
                )}
              </div>

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
                    placeholder="nama@student.ilkkm.edu.my"
                  />
                ) : (
                  <div className="w-full px-3 py-2 bg-gray-50 rounded-lg text-sm text-gray-900">
                    {profile.emel}
                  </div>
                )}
              </div>
            </div>

            {/* Fakulti & Program */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Fakulti *
                </label>
                {isEditing ? (
                  <select
                    value={profile.fakulti}
                    onChange={(e) => handleInputChange('fakulti', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  >
                    <option value="">Pilih Fakulti</option>
                    {fakultiOptions.map((fakulti) => (
                      <option key={fakulti} value={fakulti}>{fakulti}</option>
                    ))}
                  </select>
                ) : (
                  <div className="w-full px-3 py-2 bg-gray-50 rounded-lg text-sm text-gray-900">
                    {profile.fakulti}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Program Pengajian
                </label>
                {isEditing ? (
                  <select
                    value={profile.program}
                    onChange={(e) => handleInputChange('program', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  >
                    <option value="">Pilih Program</option>
                    {programOptions.map((program) => (
                      <option key={program} value={program}>{program}</option>
                    ))}
                  </select>
                ) : (
                  <div className="w-full px-3 py-2 bg-gray-50 rounded-lg text-sm text-gray-900">
                    {profile.program}
                  </div>
                )}
              </div>
            </div>

            {/* Tahun Pengajian & No. Phone */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Tahun Pengajian
                </label>
                {isEditing ? (
                  <select
                    value={profile.tahunPengajian}
                    onChange={(e) => handleInputChange('tahunPengajian', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  >
                    <option value="">Pilih Tahun</option>
                    {tahunPengajianOptions.map((tahun) => (
                      <option key={tahun} value={tahun}>{tahun}</option>
                    ))}
                  </select>
                ) : (
                  <div className="w-full px-3 py-2 bg-gray-50 rounded-lg text-sm text-gray-900">
                    {profile.tahunPengajian}
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
          </div>
        </div>

        {/* ✅ INFO SECTION */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4">
          <div className="flex items-start gap-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <span className="text-blue-600 text-sm">💡</span>
            </div>
            <div>
              <h4 className="font-semibold text-blue-800 text-sm mb-2">Maklumat Profil</h4>
              <ul className="text-blue-700 text-xs space-y-1">
                <li>• Maklumat profil digunakan untuk proses pinjaman barang</li>
                <li>• Pastikan maklumat anda sentiasa dikemaskini</li>
                <li>• Staff ICT akan gunakan maklumat ini untuk proses kelulusan</li>
                <li>• Anda akan dihubungi melalui emel dan telefon yang didaftarkan</li>
              </ul>
            </div>
          </div>
        </div>

        {/* ✅ BOTTOM NAVIGATION */}
        <div className="fixed bottom-4 left-4 right-4 bg-white rounded-xl shadow-lg p-3 border border-gray-200">
          <div className="flex justify-between items-center">
            <button 
              onClick={handleKeDashboard}
              className="flex-1 text-center py-2 px-2 bg-gray-100 text-gray-700 rounded-lg text-xs font-medium mx-1 hover:bg-gray-200 transition-colors"
            >
              🏠 Dashboard
            </button>
            <button 
              onClick={handleKeBarang}
              className="flex-1 text-center py-2 px-2 bg-gray-100 text-gray-700 rounded-lg text-xs font-medium mx-1 hover:bg-gray-200 transition-colors"
            >
              📦 Barang
            </button>
            <button 
              onClick={handleKeSejarah}
              className="flex-1 text-center py-2 px-2 bg-gray-100 text-gray-700 rounded-lg text-xs font-medium mx-1 hover:bg-gray-200 transition-colors"
            >
              📊 Sejarah
            </button>
            <button className="flex-1 text-center py-2 px-2 bg-blue-500 text-white rounded-lg text-xs font-medium mx-1">
              👤 Profil
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}