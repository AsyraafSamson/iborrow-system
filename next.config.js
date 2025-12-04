/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static export untuk Cloudflare Pages
  output: 'export',
  trailingSlash: true,
  
  images: {
    unoptimized: true,
  },

  // Disable type checking during build  
  typescript: {
    ignoreBuildErrors: true,
  },

  // Disable ESLint during build
  eslint: {
    ignoreDuringBuilds: true,
  },
}

module.exports = nextConfig
