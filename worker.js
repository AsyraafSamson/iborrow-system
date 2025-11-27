// iBorrow System - Pure Cloudflare Worker with D1
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;

    // CORS headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    // Handle OPTIONS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    try {
      // API Routes
      if (path.startsWith('/api/')) {
        return await handleAPI(path, request, env, corsHeaders);
      }

      // Static Pages
      return await handlePage(path, corsHeaders);

    } catch (error) {
      return jsonResponse({ 
        success: false, 
        error: 'Internal server error',
        message: error.message 
      }, 500, corsHeaders);
    }
  }
};

// ============================================
// API HANDLERS
// ============================================

async function handleAPI(path, request, env, corsHeaders) {
  const db = env.DB;

  // POST /api/auth/login
  if (path === '/api/auth/login' && request.method === 'POST') {
    const { email, password } = await request.json();

    if (!email || !password) {
      return jsonResponse({ 
        success: false, 
        error: 'Email dan password diperlukan' 
      }, 400, corsHeaders);
    }

    // Query D1 database
    const result = await db.prepare(
      'SELECT * FROM users WHERE email = ? AND password_hash = ?'
    ).bind(email, password).first();

    if (!result) {
      return jsonResponse({ 
        success: false, 
        error: 'Email atau password salah' 
      }, 401, corsHeaders);
    }

    // Update last login
    await db.prepare(
      "UPDATE users SET last_login = datetime('now') WHERE id = ?"
    ).bind(result.id).run();

    // Remove password from response
    const { password_hash, ...user } = result;

    return jsonResponse({
      success: true,
      user,
      redirectTo: getRedirectPath(user.peranan),
      usingRealDatabase: true,
      message: 'Login berjaya (D1 Database)'
    }, 200, corsHeaders);
  }

  // GET /api/user/dashboard
  if (path === '/api/user/dashboard' && request.method === 'GET') {
    const stats = await db.prepare(`
      SELECT 
        (SELECT COUNT(*) FROM tempahan WHERE user_id = ?) as total_tempahan,
        (SELECT COUNT(*) FROM tempahan WHERE user_id = ? AND status = 'Aktif') as tempahan_aktif,
        (SELECT COUNT(*) FROM barang WHERE status = 'Tersedia') as barang_tersedia
    `).bind('user_003', 'user_003').first();

    return jsonResponse({ success: true, data: stats }, 200, corsHeaders);
  }

  // GET /api/admin/dashboard
  if (path === '/api/admin/dashboard' && request.method === 'GET') {
    const stats = await db.prepare(`
      SELECT 
        (SELECT COUNT(*) FROM users) as total_users,
        (SELECT COUNT(*) FROM barang) as total_barang,
        (SELECT COUNT(*) FROM tempahan WHERE status = 'Aktif') as tempahan_aktif
    `).first();

    return jsonResponse({ success: true, data: stats }, 200, corsHeaders);
  }

  // GET /api/user/barang - List all available items
  if (path === '/api/user/barang' && request.method === 'GET') {
    const barang = await db.prepare(
      'SELECT * FROM barang WHERE status = "Tersedia" ORDER BY created_at DESC'
    ).all();

    return jsonResponse({ 
      success: true, 
      data: barang.results 
    }, 200, corsHeaders);
  }

  // POST /api/auth/logout
  if (path === '/api/auth/logout' && request.method === 'POST') {
    return jsonResponse({ 
      success: true, 
      message: 'Logout berjaya' 
    }, 200, corsHeaders);
  }

  // API not found
  return jsonResponse({ 
    success: false, 
    error: 'API endpoint not found' 
  }, 404, corsHeaders);
}

// ============================================
// PAGE HANDLERS (HTML)
// ============================================

async function handlePage(path, corsHeaders) {
  // Home - redirect to login
  if (path === '/' || path === '') {
    return Response.redirect('/login', 302);
  }

  // Login page
  if (path === '/login') {
    return htmlResponse(getLoginHTML(), corsHeaders);
  }

  // User dashboard
  if (path === '/user/dashboard') {
    return htmlResponse(getUserDashboardHTML(), corsHeaders);
  }

  // Admin dashboard
  if (path === '/admin/dashboard') {
    return htmlResponse(getAdminDashboardHTML(), corsHeaders);
  }

  // User barang page
  if (path === '/user/barang') {
    return htmlResponse(getUserBarangHTML(), corsHeaders);
  }

  // 404
  return htmlResponse('<h1>404 - Page Not Found</h1>', corsHeaders, 404);
}

// ============================================
// HTML TEMPLATES
// ============================================

function getLoginHTML() {
  return `<!DOCTYPE html>
<html lang="ms">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Login - iBorrow System</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-100">
  <div class="min-h-screen flex items-center justify-center">
    <div class="bg-white p-8 rounded-lg shadow-md w-96">
      <h1 class="text-2xl font-bold mb-6 text-center">iBorrow System</h1>
      <form id="loginForm" class="space-y-4">
        <div>
          <label class="block text-sm font-medium mb-1">Email</label>
          <input type="email" id="email" class="w-full border rounded px-3 py-2" required>
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Password</label>
          <input type="password" id="password" class="w-full border rounded px-3 py-2" required>
        </div>
        <button type="submit" class="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          Login
        </button>
        <div id="message" class="text-sm text-center"></div>
      </form>
      <div class="mt-6 text-xs text-gray-600">
        <p><strong>Test Accounts:</strong></p>
        <p>Admin: admin@iborrow.com / admin123</p>
        <p>Staff ICT: staffict@iborrow.com / staffict123</p>
        <p>User: user@iborrow.com / user123</p>
      </div>
    </div>
  </div>
  <script>
    document.getElementById('loginForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      const messageEl = document.getElementById('message');
      
      try {
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        
        if (data.success) {
          messageEl.className = 'text-sm text-center text-green-600';
          messageEl.textContent = data.message;
          console.log('Login response:', data);
          setTimeout(() => {
            window.location.href = data.redirectTo;
          }, 1000);
        } else {
          messageEl.className = 'text-sm text-center text-red-600';
          messageEl.textContent = data.error;
        }
      } catch (error) {
        messageEl.className = 'text-sm text-center text-red-600';
        messageEl.textContent = 'Error: ' + error.message;
      }
    });
  </script>
</body>
</html>`;
}

function getUserDashboardHTML() {
  return `<!DOCTYPE html>
<html lang="ms">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Dashboard - User</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-100">
  <div class="min-h-screen p-8">
    <div class="max-w-6xl mx-auto">
      <div class="bg-white rounded-lg shadow p-6 mb-6">
        <h1 class="text-3xl font-bold mb-2">Dashboard Pengguna</h1>
        <p class="text-gray-600">Selamat datang ke sistem iBorrow!</p>
      </div>
      
      <div id="stats" class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div class="bg-blue-500 text-white rounded-lg p-6">
          <h3 class="text-lg font-semibold">Total Tempahan</h3>
          <p class="text-3xl font-bold mt-2" id="totalTempahan">-</p>
        </div>
        <div class="bg-green-500 text-white rounded-lg p-6">
          <h3 class="text-lg font-semibold">Tempahan Aktif</h3>
          <p class="text-3xl font-bold mt-2" id="tempahanAktif">-</p>
        </div>
        <div class="bg-purple-500 text-white rounded-lg p-6">
          <h3 class="text-lg font-semibold">Barang Tersedia</h3>
          <p class="text-3xl font-bold mt-2" id="barangTersedia">-</p>
        </div>
      </div>
      
      <div class="bg-white rounded-lg shadow p-6">
        <a href="/user/barang" class="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
          Lihat Senarai Barang
        </a>
        <a href="/login" class="ml-4 text-red-600 hover:underline">Logout</a>
      </div>
    </div>
  </div>
  <script>
    fetch('/api/user/dashboard')
      .then(r => r.json())
      .then(data => {
        if (data.success) {
          document.getElementById('totalTempahan').textContent = data.data.total_tempahan;
          document.getElementById('tempahanAktif').textContent = data.data.tempahan_aktif;
          document.getElementById('barangTersedia').textContent = data.data.barang_tersedia;
        }
      });
  </script>
</body>
</html>`;
}

function getAdminDashboardHTML() {
  return `<!DOCTYPE html>
<html lang="ms">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Dashboard - Admin</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-100">
  <div class="min-h-screen p-8">
    <div class="max-w-6xl mx-auto">
      <div class="bg-white rounded-lg shadow p-6 mb-6">
        <h1 class="text-3xl font-bold mb-2">Dashboard Admin</h1>
        <p class="text-gray-600">Pengurusan sistem iBorrow</p>
      </div>
      
      <div id="stats" class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div class="bg-blue-500 text-white rounded-lg p-6">
          <h3 class="text-lg font-semibold">Total Pengguna</h3>
          <p class="text-3xl font-bold mt-2" id="totalUsers">-</p>
        </div>
        <div class="bg-green-500 text-white rounded-lg p-6">
          <h3 class="text-lg font-semibold">Total Barang</h3>
          <p class="text-3xl font-bold mt-2" id="totalBarang">-</p>
        </div>
        <div class="bg-purple-500 text-white rounded-lg p-6">
          <h3 class="text-lg font-semibold">Tempahan Aktif</h3>
          <p class="text-3xl font-bold mt-2" id="tempahanAktif">-</p>
        </div>
      </div>
      
      <div class="bg-white rounded-lg shadow p-6">
        <p class="text-green-600 font-semibold">✅ Connected to Cloudflare D1 Database</p>
        <a href="/login" class="mt-4 inline-block text-red-600 hover:underline">Logout</a>
      </div>
    </div>
  </div>
  <script>
    fetch('/api/admin/dashboard')
      .then(r => r.json())
      .then(data => {
        if (data.success) {
          document.getElementById('totalUsers').textContent = data.data.total_users;
          document.getElementById('totalBarang').textContent = data.data.total_barang;
          document.getElementById('tempahanAktif').textContent = data.data.tempahan_aktif;
        }
      });
  </script>
</body>
</html>`;
}

function getUserBarangHTML() {
  return `<!DOCTYPE html>
<html lang="ms">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Senarai Barang - iBorrow</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-100">
  <div class="min-h-screen p-8">
    <div class="max-w-6xl mx-auto">
      <div class="bg-white rounded-lg shadow p-6 mb-6">
        <h1 class="text-3xl font-bold mb-2">Senarai Barang</h1>
        <p class="text-gray-600">Barang yang tersedia untuk dipinjam</p>
      </div>
      
      <div id="barangList" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <p class="text-center text-gray-500">Loading...</p>
      </div>
      
      <div class="mt-6">
        <a href="/user/dashboard" class="text-blue-600 hover:underline">← Kembali ke Dashboard</a>
      </div>
    </div>
  </div>
  <script>
    fetch('/api/user/barang')
      .then(r => r.json())
      .then(data => {
        const container = document.getElementById('barangList');
        if (data.success && data.data.length > 0) {
          container.innerHTML = data.data.map(item => \`
            <div class="bg-white rounded-lg shadow p-6">
              <h3 class="text-xl font-bold mb-2">\${item.nama_barang}</h3>
              <p class="text-gray-600 mb-2">Kategori: \${item.kategori}</p>
              <p class="text-sm text-gray-500 mb-2">\${item.penerangan || '-'}</p>
              <p class="font-semibold text-green-600">Tersedia: \${item.kuantiti_tersedia}</p>
              <button class="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                Buat Tempahan
              </button>
            </div>
          \`).join('');
        } else {
          container.innerHTML = '<p class="text-center text-gray-500">Tiada barang tersedia</p>';
        }
      });
  </script>
</body>
</html>`;
}

// ============================================
// HELPER FUNCTIONS
// ============================================

function jsonResponse(data, status = 200, additionalHeaders = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...additionalHeaders
    }
  });
}

function htmlResponse(html, additionalHeaders = {}, status = 200) {
  return new Response(html, {
    status,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      ...additionalHeaders
    }
  });
}

function getRedirectPath(role) {
  switch (role) {
    case 'admin': return '/admin/dashboard';
    case 'staff-ict': return '/staff-ict/dashboard';
    case 'user': return '/user/dashboard';
    default: return '/user/dashboard';
  }
}
