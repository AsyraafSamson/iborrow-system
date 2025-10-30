"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple hardcoded authentication - PROPER APPROACH
    if (username === "admin" && password === "admin") {
      router.push("/admin/dashboard");
    } else if (username === "staff" && password === "staff") {
      router.push("/staff-ict/dashboard");  // ✅ UPDATED: staff-ict/dashboard
    } else if (username === "user" && password === "user") {
      router.push("/user/dashboard");
    } else {
      alert("Username atau password salah! Gunakan: admin/admin, staff/staff, user/user");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-xl font-bold text-white">iB</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Sistem i-Borrow</h1>
          <p className="text-gray-600 mt-2">ILKKM Johor Bahru</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Masukkan username"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Masukkan password"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
          >
            Log Masuk
          </button>
        </form>

        {/* Test Accounts Info */}
        <div className="mt-8 p-4 bg-gray-50 rounded-xl">
          <h3 className="font-semibold text-gray-900 mb-2">Test Accounts:</h3>
          <div className="text-sm text-gray-600 space-y-1">
            <p><strong>Admin:</strong> admin / admin</p>
            <p><strong>Staff ICT:</strong> staff / staff</p>
            <p><strong>User:</strong> user / user</p>
          </div>
        </div>
      </div>
    </div>
  );
}