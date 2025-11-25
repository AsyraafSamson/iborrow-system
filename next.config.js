/** @type {import('next').NextConfig} */
const nextConfig = {
  // Cloudflare Pages - Static Export
  output: 'export',
  distDir: 'out',
  
  // Image optimization - disable for Cloudflare Pages
  images: {
    unoptimized: true,
  },
  
  // ESLint - ignore during build
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // TypeScript - ignore during build
  typescript: {
    ignoreBuildErrors: true,
  },
}

module.exports = nextConfig