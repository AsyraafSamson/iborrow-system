// app/admin/pengguna/page.tsx
"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

// ✅ Definisikan types dengan role baru
interface Pengguna {
  id: number;
  nama: string;
  email: string;
  role: string;
  fakulti: string;
  status: string;
  tarikhDaftar: string;
  noMatrik?: string;
  noStaf?: string;
}

interface PenggunaBaru {
  nama: string;
  email: string;
  role: string;
  fakulti: string;
  noMatrik: string;
  noStaf: string;
}

export default function AdminPenggunaPage() {
  const router = useRouter();
  
  // ✅ Type the state properly dengan data contoh mengikut role baru
  const [pengguna, setPengguna] = useState<Pengguna[]>([
    { 
      id: 1, 
      nama: "Ahmad bin Ali", 
      email: "ahmad@ilkkm.edu.my", 
      role: "pelajar", 
      fakulti: "Fakulti Teknologi Maklumat",
      status: "aktif",
      tarikhDaftar: "2025-01-15",
      noMatrik: "A12345"
    },
    { 
      id: 2, 
      nama: "Siti binti Rahman", 
      email: "siti@ilkkm.edu.my", 
      role: "pengajar", 
      fakulti: "Fakulti Kejuruteraan",
      status: "aktif", 
      tarikhDaftar: "2025-02-20",
      noStaf: "PJG001"
    },
    { 
      id: 3, 
      nama: "Mohd Faris", 
      email: "faris@ilkkm.edu.my", 
      role: "staff-it", 
      fakulti: "Bahagian ICT",
      status: "aktif",
      tarikhDaftar: "2025-03-10",
      noStaf: "ICT001"
    },
    { 
      id: 4, 
      nama: "Nurul Huda", 
      email: "huda@ilkkm.edu.my", 
      role: "pelajar", 
      fakulti: "Fakulti Perniagaan",
      status: "tidak aktif",
      tarikhDaftar: "2025-01-08",
      noMatrik: "B67890"
    },
    { 
      id: 5, 
      nama: "Ali bin Abu", 
      email: "ali@ilkkm.edu.my", 
      role: "staff-pentadbiran", 
      fakulti: "Unit Pentadbiran",
      status: "aktif",
      tarikhDaftar: "2025-03-15",
      noStaf: "PEN001"
    },
    { 
      id: 6, 
      nama: "Dr. Sarah Lim", 
      email: "sarah@ilkkm.edu.my", 
      role: "pengajar", 
      fakulti: "Fakulti Sains",
      status: "aktif",
      tarikhDaftar: "2025-02-01",
      noStaf: "PJG002"
    },
  ]);

  const [carian, setCarian] = useState<string>("");
  const [filterRole, setFilterRole] = useState<string>("semua");
  const [filterStatus, setFilterStatus] = useState<string>("semua");
  const [modalTambah, setModalTambah] = useState<boolean>(false);
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [selectAll, setSelectAll] = useState<boolean>(false);
  
  // ✅ Properly type the new user state
  const [penggunaBaru, setPenggunaBaru] = useState<PenggunaBaru>({
    nama: "",
    email: "",
    role: "pelajar",
    fakulti: "",
    noMatrik: "",
    noStaf: ""
  });

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

  // ✅ TAMBAH USER dengan proper typing
  const handleTambahPengguna = (): void => {
    if (!penggunaBaru.nama || !penggunaBaru.email) {
      alert("Sila isi nama dan email pengguna!");
      return;
    }

    const baru: Pengguna = {
      id: pengguna.length + 1,
      ...penggunaBaru,
      status: "aktif",
      tarikhDaftar: new Date().toISOString().split('T')[0]
    };

    setPengguna([...pengguna, baru]);
    setModalTambah(false);
    setPenggunaBaru({
      nama: "",
      email: "",
      role: "pelajar",
      fakulti: "",
      noMatrik: "",
      noStaf: ""
    });
    alert("Pengguna baru berjaya ditambah!");
  };

  // ✅ DELETE USER
  const handleHapusPengguna = (id: number): void => {
    if (confirm("Adakah anda pasti ingin hapus pengguna ini?")) {
      setPengguna(pengguna.filter(user => user.id !== id));
      alert("Pengguna berjaya dipadam!");
    }
  };

  // ✅ BULK DELETE USERS
  const handleBulkDelete = (): void => {
    if (selectedUsers.length === 0) {
      alert("Sila pilih sekurang-kurangnya satu pengguna untuk dipadam!");
      return;
    }

    if (confirm(`Adakah anda pasti ingin padam ${selectedUsers.length} pengguna?`)) {
      setPengguna(pengguna.filter(user => !selectedUsers.includes(user.id)));
      setSelectedUsers([]);
      setSelectAll(false);
      alert(`${selectedUsers.length} pengguna berjaya dipadam!`);
    }
  };

  // ✅ RESET PASSWORD
  const handleResetPassword = (id: number): void => {
    if (confirm("Reset kata laluan pengguna ini kepada default?")) {
      alert("Kata laluan telah direset! Password sementara telah dihantar ke email pengguna.");
      // Simulate API call untuk reset password
    }
  };

  // ✅ BULK RESET PASSWORD
  const handleBulkResetPassword = (): void => {
    if (selectedUsers.length === 0) {
      alert("Sila pilih sekurang-kurangnya satu pengguna untuk reset password!");
      return;
    }

    if (confirm(`Reset kata laluan untuk ${selectedUsers.length} pengguna?`)) {
      alert(`Kata laluan sementara telah dihantar ke email ${selectedUsers.length} pengguna!`);
      // Simulate API call untuk bulk reset password
    }
  };

  const handleUpdateStatus = (id: number, statusBaru: string): void => {
    setPengguna(pengguna.map(user =>
      user.id === id ? { ...user, status: statusBaru } : user
    ));
    alert(`Status pengguna berjaya dikemaskini!`);
  };

  const handleUpdateRole = (id: number, roleBaru: string): void => {
    setPengguna(pengguna.map(user =>
      user.id === id ? { ...user, role: roleBaru } : user
    ));
    alert(`Role pengguna berjaya dikemaskini!`);
  };

  // ✅ SELECT/DESELECT USER
  const handleSelectUser = (id: number): void => {
    if (selectedUsers.includes(id)) {
      setSelectedUsers(selectedUsers.filter(userId => userId !== id));
    } else {
      setSelectedUsers([...selectedUsers, id]);
    }
  };

  // ✅ SELECT ALL USERS
  const handleSelectAll = (): void => {
    if (selectAll) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(penggunaTertapis.map(user => user.id));
    }
    setSelectAll(!selectAll);
  };

  // ✅ EXPORT TO CSV
  const handleExportCSV = (): void => {
    const headers = ["ID", "Nama", "Email", "Role", "Fakulti", "Status", "Tarikh Daftar", "No Matrik", "No Staf"];
    const csvData = penggunaTertapis.map(user => [
      user.id,
      user.nama,
      user.email,
      user.role,
      user.fakulti,
      user.status,
      user.tarikhDaftar,
      user.noMatrik || "",
      user.noStaf || ""
    ]);

    const csvContent = [
      headers.join(","),
      ...csvData.map(row => row.map(field => `"${field}"`).join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `pengguna-iborrow-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    alert(`Data ${penggunaTertapis.length} pengguna berjaya diexport!`);
  };

  // ✅ IMPORT FROM CSV
  const handleImportCSV = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      const lines = content.split('\n');
      const headers = lines[0].split(',').map(header => header.replace(/"/g, '').trim());
      
      const importedUsers: Pengguna[] = [];
      
      for (let i = 1; i < lines.length; i++) {
        if (lines[i].trim() === '') continue;
        
        const values = lines[i].split(',').map(value => value.replace(/"/g, '').trim());
        const user: Pengguna = {
          id: pengguna.length + i,
          nama: values[headers.indexOf('Nama')] || '',
          email: values[headers.indexOf('Email')] || '',
          role: values[headers.indexOf('Role')] || 'pelajar',
          fakulti: values[headers.indexOf('Fakulti')] || '',
          status: values[headers.indexOf('Status')] || 'aktif',
          tarikhDaftar: values[headers.indexOf('Tarikh Daftar')] || new Date().toISOString().split('T')[0],
          noMatrik: values[headers.indexOf('No Matrik')] || '',
          noStaf: values[headers.indexOf('No Staf')] || ''
        };
        
        importedUsers.push(user);
      }

      if (importedUsers.length > 0) {
        setPengguna([...pengguna, ...importedUsers]);
        alert(`${importedUsers.length} pengguna berjaya diimport dari CSV!`);
      } else {
        alert("Tiada data pengguna yang berjaya diimport. Sila semak format fail CSV.");
      }
    };

    reader.readAsText(file);
    // Reset input
    event.target.value = '';
  };

  // ✅ UPDATED: Role colors dengan role baru
  const getStatusColor = (status: string): string => {
    switch (status) {
      case "aktif": return "bg-green-100 text-green-800";
      case "tidak aktif": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getRoleColor = (role: string): string => {
    switch (role) {
      case "admin": return "bg-purple-100 text-purple-800";
      case "staff-it": return "bg-blue-100 text-blue-800";
      case "pengajar": return "bg-green-100 text-green-800";
      case "pelajar": return "bg-orange-100 text-orange-800";
      case "staff-pentadbiran": return "bg-indigo-100 text-indigo-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string): string => {
    return status === "aktif" ? "Aktif" : "Tidak Aktif";
  };

  // ✅ UPDATED: Role texts dengan role baru
  const getRoleText = (role: string): string => {
    switch (role) {
      case "admin": return "Admin";
      case "staff-it": return "Staff ICT";
      case "pengajar": return "Pengajar";
      case "pelajar": return "Pelajar";
      case "staff-pentadbiran": return "Staff Pentadbiran";
      default: return role;
    }
  };

  // Filter pengguna berdasarkan carian, role dan status
  const penggunaTertapis: Pengguna[] = pengguna.filter(user => {
    const matchesCarian = user.nama.toLowerCase().includes(carian.toLowerCase()) || 
                         user.email.toLowerCase().includes(carian.toLowerCase());
    const matchesRole = filterRole === "semua" || user.role === filterRole;
    const matchesStatus = filterStatus === "semua" || user.status === filterStatus;
    return matchesCarian && matchesRole && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-gray-50 p-3 pb-24">
      <div className="max-w-6xl mx-auto">
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
                <span className="text-xs font-medium">👥 PENGGUNA</span>
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
            <h1 className="text-xl font-bold text-gray-900">👥 Urus Pengguna</h1>
            <p className="text-gray-600 text-sm mt-1">Manage semua pengguna sistem i-Borrow</p>
          </div>
        </div>

        {/* ✅ STATS CARDS - MOBILE OPTIMIZED */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-white rounded-xl shadow-sm p-3 text-center">
            <div className="text-lg font-bold text-blue-600">{pengguna.length}</div>
            <div className="text-xs text-gray-600">Total Pengguna</div>
            <div className="text-xs text-blue-600 mt-1">Dalam sistem</div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-3 text-center">
            <div className="text-lg font-bold text-green-600">
              {pengguna.filter(p => p.role === "pelajar").length}
            </div>
            <div className="text-xs text-gray-600">Pelajar</div>
            <div className="text-xs text-green-600 mt-1">Aktif</div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-3 text-center">
            <div className="text-lg font-bold text-purple-600">
              {pengguna.filter(p => p.role === "pengajar").length}
            </div>
            <div className="text-xs text-gray-600">Pengajar</div>
            <div className="text-xs text-purple-600 mt-1">Aktif</div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-3 text-center">
            <div className="text-lg font-bold text-orange-600">
              {pengguna.filter(p => p.status === "aktif").length}
            </div>
            <div className="text-xs text-gray-600">Status Aktif</div>
            <div className="text-xs text-orange-600 mt-1">{Math.round((pengguna.filter(p => p.status === "aktif").length / pengguna.length) * 100)}%</div>
          </div>
        </div>

        {/* Bulk Actions & Import/Export */}
        {selectedUsers.length > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h3 className="font-semibold text-yellow-800 text-sm">
                  📋 {selectedUsers.length} pengguna dipilih
                </h3>
                <p className="text-yellow-700 text-xs mt-1">
                  Pilih tindakan yang ingin dilakukan
                </p>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={handleBulkResetPassword}
                  className="bg-yellow-500 text-white px-3 py-2 rounded-lg hover:bg-yellow-600 transition-colors text-xs"
                >
                  🔑 Reset
                </button>
                <button 
                  onClick={handleBulkDelete}
                  className="bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600 transition-colors text-xs"
                >
                  🗑️ Padam
                </button>
                <button 
                  onClick={() => setSelectedUsers([])}
                  className="bg-gray-500 text-white px-3 py-2 rounded-lg hover:bg-gray-600 transition-colors text-xs"
                >
                  ✗ Batal
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ✅ FILTERS & SEARCH - MOBILE OPTIMIZED */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Carian</label>
              <input
                type="text"
                placeholder="Cari nama atau email..."
                value={carian}
                onChange={(e) => setCarian(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Filter Role</label>
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              >
                <option value="semua">Semua Role</option>
                <option value="admin">Admin</option>
                <option value="staff-it">Staff ICT</option>
                <option value="pengajar">Pengajar</option>
                <option value="pelajar">Pelajar</option>
                <option value="staff-pentadbiran">Staff Pentadbiran</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Filter Status</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              >
                <option value="semua">Semua Status</option>
                <option value="aktif">Aktif</option>
                <option value="tidak aktif">Tidak Aktif</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Actions</label>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center w-full">
                <p className="text-blue-800 font-semibold text-sm">
                  {penggunaTertapis.length} pengguna
                </p>
                <p className="text-blue-600 text-xs">ditemui</p>
              </div>
            </div>
          </div>

          {/* Import/Export Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
            <div className="flex-1">
              <label className="block text-xs font-medium text-gray-700 mb-1">Import CSV</label>
              <div className="flex gap-2">
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleImportCSV}
                  className="hidden"
                  id="csv-upload"
                />
                <label 
                  htmlFor="csv-upload"
                  className="flex-1 bg-blue-500 text-white px-3 py-2 rounded-lg hover:bg-blue-600 transition-colors text-sm text-center cursor-pointer"
                >
                  📁 Upload CSV
                </label>
              </div>
            </div>
            
            <div className="flex-1">
              <label className="block text-xs font-medium text-gray-700 mb-1">Export CSV</label>
              <button 
                onClick={handleExportCSV}
                className="w-full bg-green-500 text-white px-3 py-2 rounded-lg hover:bg-green-600 transition-colors text-sm"
              >
                📊 Export CSV
              </button>
            </div>

            <div className="flex-1">
              <label className="block text-xs font-medium text-gray-700 mb-1">Tambah User</label>
              <button 
                onClick={() => setModalTambah(true)}
                className="w-full bg-purple-500 text-white px-3 py-2 rounded-lg hover:bg-purple-600 transition-colors text-sm"
              >
                👤 Tambah User
              </button>
            </div>
          </div>
        </div>

        {/* ✅ SENARAI PENGGUNA - MOBILE OPTIMIZED */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900 text-sm">📋 Senarai Pengguna</h2>
            <div className="flex items-center gap-3">
              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                {penggunaTertapis.length} pengguna
              </span>
              {penggunaTertapis.length > 0 && (
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selectAll}
                    onChange={handleSelectAll}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <span className="text-xs text-gray-600">Pilih Semua</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="space-y-3">
            {penggunaTertapis.map((user) => (
              <div key={user.id} className="border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow">
                <div className="flex flex-col gap-3">
                  {/* User Info dengan Checkbox */}
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user.id)}
                      onChange={() => handleSelectUser(user.id)}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 mt-1"
                    />
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-gray-900 text-sm">{user.nama}</h3>
                          <p className="text-gray-600 text-xs mt-1">{user.email}</p>
                          <p className="text-gray-500 text-xs mt-1">{user.fakulti}</p>
                          {(user.noMatrik || user.noStaf) && (
                            <p className="text-gray-500 text-xs mt-1">
                              {user.noMatrik ? `No Matrik: ${user.noMatrik}` : `No Staf: ${user.noStaf}`}
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="text-gray-500 text-xs">Daftar: {user.tarikhDaftar}</p>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-1 mt-2">
                        <span className={`${getRoleColor(user.role)} text-xs px-2 py-1 rounded`}>
                          {getRoleText(user.role)}
                        </span>
                        <span className={`${getStatusColor(user.status)} text-xs px-2 py-1 rounded`}>
                          {getStatusText(user.status)}
                        </span>
                        {selectedUsers.includes(user.id) && (
                          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                            ✅ Terpilih
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions - Mobile Optimized */}
                  <div className="flex flex-col sm:flex-row gap-2 pt-2 border-t border-gray-100">
                    <div className="flex-1">
                      <label className="block text-xs font-medium text-gray-700 mb-1">Role</label>
                      <select 
                        value={user.role}
                        onChange={(e) => handleUpdateRole(user.id, e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-blue-500"
                      >
                        <option value="admin">Admin</option>
                        <option value="staff-it">Staff ICT</option>
                        <option value="pengajar">Pengajar</option>
                        <option value="pelajar">Pelajar</option>
                        <option value="staff-pentadbiran">Staff Pentadbiran</option>
                      </select>
                    </div>
                    
                    <div className="flex-1">
                      <label className="block text-xs font-medium text-gray-700 mb-1">Status</label>
                      <select 
                        value={user.status}
                        onChange={(e) => handleUpdateStatus(user.id, e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-blue-500"
                      >
                        <option value="aktif">Aktif</option>
                        <option value="tidak aktif">Tidak Aktif</option>
                      </select>
                    </div>

                    <div className="flex items-end gap-2">
                      <button 
                        onClick={() => handleResetPassword(user.id)}
                        className="bg-yellow-500 text-white px-2 py-1 rounded text-xs hover:bg-yellow-600 transition-colors"
                        title="Reset Password"
                      >
                        🔑
                      </button>
                      <button 
                        onClick={() => handleHapusPengguna(user.id)}
                        className="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600 transition-colors"
                      >
                        Padam
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {penggunaTertapis.length === 0 && (
              <div className="text-center py-8">
                <div className="text-4xl mb-2">👥</div>
                <p className="text-gray-500 text-sm">Tiada pengguna ditemui</p>
                <p className="text-gray-400 text-xs mt-1">Cuba ubah carian atau filter anda</p>
              </div>
            )}
          </div>
        </div>

        {/* ✅ INFO SECTION */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4">
          <div className="flex items-start gap-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <span className="text-blue-600 text-sm">💡</span>
            </div>
            <div>
              <h4 className="font-semibold text-blue-800 text-sm mb-2">Cara Mengurus Pengguna</h4>
              <ul className="text-blue-700 text-xs space-y-1">
                <li>• <strong>Pilih pengguna</strong> dengan checkbox untuk tindakan bulk</li>
                <li>• <strong>Tukar role/status</strong> melalui dropdown untuk update cepat</li>
                <li>• <strong>Import/Export CSV</strong> untuk urusan batch yang banyak</li>
                <li>• <strong>Reset password</strong> akan hantar email automatik kepada pengguna</li>
                <li>• <strong>Padam pengguna</strong> akan alihkan ke status "tidak aktif"</li>
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
            <button className="flex-1 text-center py-2 px-1 bg-blue-500 text-white rounded-lg text-xs font-medium mx-1">
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

      {/* Modal Tambah Pengguna - Mobile Optimized */}
      {modalTambah && (
        <div className="fixed inset-0 bg-gray-100 bg-opacity-80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md mx-4 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Tambah Pengguna Baru</h3>
              <button 
                onClick={() => setModalTambah(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Penuh *</label>
                <input
                  type="text"
                  value={penggunaBaru.nama}
                  onChange={(e) => setPenggunaBaru({...penggunaBaru, nama: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  placeholder="Contoh: Ahmad bin Ali"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                <input
                  type="email"
                  value={penggunaBaru.email}
                  onChange={(e) => setPenggunaBaru({...penggunaBaru, email: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  placeholder="Contoh: ahmad@ilkkm.edu.my"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select
                  value={penggunaBaru.role}
                  onChange={(e) => setPenggunaBaru({...penggunaBaru, role: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                >
                  <option value="pelajar">Pelajar</option>
                  <option value="pengajar">Pengajar</option>
                  <option value="staff-it">Staff ICT</option>
                  <option value="staff-pentadbiran">Staff Pentadbiran</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fakulti</label>
                <input
                  type="text"
                  value={penggunaBaru.fakulti}
                  onChange={(e) => setPenggunaBaru({...penggunaBaru, fakulti: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  placeholder="Contoh: Fakulti Teknologi Maklumat"
                />
              </div>

              {penggunaBaru.role === "pelajar" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">No Matrik</label>
                  <input
                    type="text"
                    value={penggunaBaru.noMatrik}
                    onChange={(e) => setPenggunaBaru({...penggunaBaru, noMatrik: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    placeholder="Contoh: A12345"
                  />
                </div>
              )}

              {(penggunaBaru.role === "pengajar" || penggunaBaru.role === "staff-it" || penggunaBaru.role === "staff-pentadbiran" || penggunaBaru.role === "admin") && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">No Staf</label>
                  <input
                    type="text"
                    value={penggunaBaru.noStaf}
                    onChange={(e) => setPenggunaBaru({...penggunaBaru, noStaf: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    placeholder="Contoh: STF001"
                  />
                </div>
              )}
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setModalTambah(false)}
                className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
              >
                Batal
              </button>
              <button
                onClick={handleTambahPengguna}
                className="flex-1 bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition-colors text-sm font-medium"
              >
                Tambah
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}