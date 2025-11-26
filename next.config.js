/** @type {import('next').NextConfig} */
const nextConfig = {
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