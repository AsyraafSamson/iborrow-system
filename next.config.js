/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remove static export for full Next.js framework
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
